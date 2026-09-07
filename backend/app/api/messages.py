from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query, HTTPException, UploadFile, File
from typing import List
import json
import aiosqlite
import os
import uuid
import datetime

from app.core.ws_manager import manager
from app.core.security import decode_token, get_current_user
from app.core.config import settings
from app.db.database import get_db

router = APIRouter()

@router.post("/upload")
async def upload_attachment(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    os.makedirs("data/uploads", exist_ok=True)
    ext = file.filename.split(".")[-1] if "." in file.filename else ""
    filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join("data/uploads", filename)
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    return {"url": f"/uploads/{filename}"}

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
                attachment_url = payload.get("attachment_url")
                reply_to_id = payload.get("reply_to_id")
                expires_in = payload.get("expires_in") # seconds
                
                expires_at = None
                if expires_in:
                    expires_at = (datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in)).isoformat()
                
                # Ensure the sender is a participant
                async with db.execute("SELECT 1 FROM participants WHERE conversation_id = ? AND user_id = ?", (conversation_id, user_id)) as check_cursor:
                    if not await check_cursor.fetchone():
                        await manager.send_personal_message(
                            {"type": "error", "message": "You are no longer a participant in this conversation."},
                            user_id
                        )
                        continue
                
                # Persist the message as SENT
                cursor = await db.execute(
                    "INSERT INTO messages (conversation_id, sender_id, content, status, attachment_url, reply_to_id, expires_at) VALUES (?, ?, ?, 'SENT', ?, ?, ?)",
                    (conversation_id, user_id, content, attachment_url, reply_to_id, expires_at)
                )
                await db.commit()
                message_id = cursor.lastrowid
                
                # Retrieve the inserted message
                await cursor.execute("SELECT * FROM messages WHERE id = ?", (message_id,))
                msg_row = await cursor.fetchone()
                msg_dict = dict(msg_row)
                msg_dict["reactions"] = []
                
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
                
                async with db.execute("SELECT display_name FROM users WHERE id = ?", (user_id,)) as u_cursor:
                    u_row = await u_cursor.fetchone()
                    display_name = u_row["display_name"] if u_row and u_row["display_name"] else "User"

                # Broadcast typing indicator to others in the conversation
                async with db.execute("SELECT user_id FROM participants WHERE conversation_id = ?", (conversation_id,)) as cursor:
                    participants = await cursor.fetchall()
                    for p in participants:
                        p_id = p["user_id"]
                        if p_id != user_id:
                            await manager.send_personal_message(
                                {"type": "typing", "conversation_id": conversation_id, "user_id": user_id, "display_name": display_name},
                                p_id
                            )
            
            elif action == "add_reaction":
                message_id = payload.get("message_id")
                conversation_id = payload.get("conversation_id")
                emoji = payload.get("emoji")
                
                try:
                    await db.execute("INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)", (message_id, user_id, emoji))
                    await db.commit()
                except aiosqlite.IntegrityError:
                    pass # already reacted
                
                # Broadcast
                async with db.execute("SELECT user_id FROM participants WHERE conversation_id = ?", (conversation_id,)) as cursor:
                    participants = await cursor.fetchall()
                    for p in participants:
                        await manager.send_personal_message(
                            {"type": "reaction_update", "message_id": message_id, "conversation_id": conversation_id, "user_id": user_id, "emoji": emoji, "action": "add"},
                            p["user_id"]
                        )
                        
            elif action == "remove_reaction":
                message_id = payload.get("message_id")
                conversation_id = payload.get("conversation_id")
                
                await db.execute("DELETE FROM message_reactions WHERE message_id = ? AND user_id = ?", (message_id, user_id))
                await db.commit()
                
                # Broadcast
                async with db.execute("SELECT user_id FROM participants WHERE conversation_id = ?", (conversation_id,)) as cursor:
                    participants = await cursor.fetchall()
                    for p in participants:
                        await manager.send_personal_message(
                            {"type": "reaction_update", "message_id": message_id, "conversation_id": conversation_id, "user_id": user_id, "action": "remove"},
                            p["user_id"]
                        )
                            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        if user_id not in manager.active_connections:
            await db.execute("UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = ?", (user_id,))
            await db.commit()
        await db.close()
    except Exception as e:
        manager.disconnect(websocket, user_id)
        if user_id not in manager.active_connections:
            await db.execute("UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = ?", (user_id,))
            await db.commit()
        await db.close()


@router.get("/{conversation_id}")
async def get_messages(conversation_id: int, current_user: dict = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    # Check if user is participant
    async with db.execute("SELECT 1 FROM participants WHERE conversation_id = ? AND user_id = ?", (conversation_id, current_user['id'])) as cursor:
        if not await cursor.fetchone():
            raise HTTPException(status_code=403, detail="Not a participant")
            
    # Delete expired messages before fetching
    now = datetime.datetime.utcnow().isoformat()
    await db.execute("DELETE FROM messages WHERE expires_at IS NOT NULL AND expires_at < ?", (now,))
    await db.commit()

    query = '''
        SELECT m.id, m.conversation_id, m.sender_id, m.content, m.status, m.created_at,
               m.attachment_url, m.reply_to_id, m.expires_at,
               u.display_name as sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
    '''
    async with db.execute(query, (conversation_id,)) as cursor:
        rows = await cursor.fetchall()
        
    messages = [dict(row) for row in rows]
    
    # Fetch reactions for these messages
    if messages:
        msg_ids = [str(m["id"]) for m in messages]
        reactions_query = f"SELECT message_id, user_id, emoji FROM message_reactions WHERE message_id IN ({','.join(msg_ids)})"
        async with db.execute(reactions_query) as cursor:
            reactions = await cursor.fetchall()
            
        reactions_map = {}
        for r in reactions:
            mid = r["message_id"]
            if mid not in reactions_map:
                reactions_map[mid] = []
            reactions_map[mid].append(dict(r))
            
        for m in messages:
            m["reactions"] = reactions_map.get(m["id"], [])
    
    return messages
