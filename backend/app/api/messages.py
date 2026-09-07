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
                    
                    # Optional logic: if the user is online, we might auto-update status to DELIVERED.
                    # The frontend will eventually send back an acknowledgment to set it to READ.
                    
                    await manager.send_personal_message(
                        {"type": "new_message", "message": msg_dict},
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
    # Verify the user is a participant of the conversation
    async with db.execute("SELECT 1 FROM participants WHERE conversation_id = ? AND user_id = ?", (conversation_id, current_user['id'])) as cursor:
        if not await cursor.fetchone():
            raise HTTPException(status_code=403, detail="You do not have access to this conversation")
            
    # Fetch paginated messages (currently fetching all for simplicity, can be paginated)
    async with db.execute("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC", (conversation_id,)) as cursor:
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]
