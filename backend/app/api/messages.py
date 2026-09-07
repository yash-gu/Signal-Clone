from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query, HTTPException
from typing import List
import json
import aiosqlite

from app.core.ws_manager import manager
from app.core.security import decode_token, get_current_user
from app.core.config import settings
from app.db.database import get_db

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    # Authenticate WebSocket connection via token query parameter
    try:
        payload = decode_token(token)
        user_id = payload.get("user_id")
        if not user_id:
            await websocket.close(code=1008)
            return
    except Exception:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, user_id)
    
    # We maintain a dedicated DB connection for this WebSocket session
    db = await aiosqlite.connect(settings.DATABASE_URL)
    db.row_factory = aiosqlite.Row

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            action = payload.get("action")
            
            if action == "send_message":
                conversation_id = payload.get("conversation_id")
                content = payload.get("content")
                
                # Persist the message as SENT
                cursor = await db.execute(
                    "INSERT INTO messages (conversation_id, sender_id, content, status) VALUES (?, ?, ?, 'SENT')",
                    (conversation_id, user_id, content)
                )
                await db.commit()
                message_id = cursor.lastrowid
                
                # Retrieve the inserted message
                await cursor.execute("SELECT * FROM messages WHERE id = ?", (message_id,))
                msg_row = await cursor.fetchone()
                msg_dict = dict(msg_row)
                
                # Broadcast the message to all participants in the conversation
                await cursor.execute("SELECT user_id FROM participants WHERE conversation_id = ?", (conversation_id,))
                participants = await cursor.fetchall()
                
                for participant in participants:
                    p_id = participant["user_id"]
                    await manager.send_personal_message(
                        {"type": "new_message", "message": msg_dict},
                        p_id
                    )
            
            elif action == "message_delivered":
                message_id = payload.get("message_id")
                # Update status if it's currently SENT
                await db.execute("UPDATE messages SET status = 'DELIVERED' WHERE id = ? AND status = 'SENT'", (message_id,))
                await db.commit()
                
                # Fetch message to find sender and conversation
                async with db.execute("SELECT sender_id, conversation_id FROM messages WHERE id = ?", (message_id,)) as cursor:
                    msg = await cursor.fetchone()
                    if msg:
                        # Broadcast to the sender that it was delivered
                        await manager.send_personal_message(
                            {"type": "message_status_update", "message_id": message_id, "conversation_id": msg["conversation_id"], "status": "DELIVERED"},
                            msg["sender_id"]
                        )
                        
            elif action == "messages_read":
                conversation_id = payload.get("conversation_id")
                # Update all DELIVERED/SENT messages sent by OTHERS in this conversation to READ
                await db.execute(
                    "UPDATE messages SET status = 'READ' WHERE conversation_id = ? AND sender_id != ? AND status IN ('SENT', 'DELIVERED')",
                    (conversation_id, user_id)
                )
                await db.commit()
                
                # Notify the other participants in the conversation
                async with db.execute("SELECT user_id FROM participants WHERE conversation_id = ?", (conversation_id,)) as cursor:
                    participants = await cursor.fetchall()
                    for p in participants:
                        p_id = p["user_id"]
                        if p_id != user_id:
                            await manager.send_personal_message(
                                {"type": "conversation_read", "conversation_id": conversation_id},
                                p_id
                            )
            
            elif action == "typing":
                conversation_id = payload.get("conversation_id")
                # Broadcast typing indicator to others in the conversation
                async with db.execute("SELECT user_id FROM participants WHERE conversation_id = ?", (conversation_id,)) as cursor:
                    participants = await cursor.fetchall()
                    for p in participants:
                        p_id = p["user_id"]
                        if p_id != user_id:
                            await manager.send_personal_message(
                                {"type": "typing", "conversation_id": conversation_id, "user_id": user_id},
                                p_id
                            )
                            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        await db.close()
    except Exception as e:
        manager.disconnect(websocket, user_id)
        await db.close()


@router.get("/{conversation_id}")
async def get_messages(conversation_id: int, current_user: dict = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    # Check if user is participant
    async with db.execute("SELECT 1 FROM participants WHERE conversation_id = ? AND user_id = ?", (conversation_id, current_user['id'])) as cursor:
        if not await cursor.fetchone():
            raise HTTPException(status_code=403, detail="Not a participant")

    query = '''
        SELECT m.id, m.conversation_id, m.sender_id, m.content, m.status, m.created_at,
               u.display_name as sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
    '''
    async with db.execute(query, (conversation_id,)) as cursor:
        rows = await cursor.fetchall()
        
    return [dict(row) for row in rows]
