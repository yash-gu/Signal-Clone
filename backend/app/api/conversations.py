from fastapi import APIRouter, Depends
from typing import List
from app.schemas.schemas import ConversationResponse
from app.core.security import get_current_user
from app.db.database import get_db
import aiosqlite
from app.core.ws_manager import manager

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_conversations(current_user: dict = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    query = '''
        SELECT c.id, c.is_group, c.name, c.created_at,
               (SELECT CASE WHEN content != '' THEN content WHEN attachment_url IS NOT NULL THEN 'Photo' ELSE '' END FROM messages m WHERE m.conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
               (SELECT created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
               (SELECT sender_id FROM messages m WHERE m.conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_sender_id,
               (SELECT status FROM messages m WHERE m.conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_status,
               (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_id != ? AND m.status IN ('SENT', 'DELIVERED')) as unread_count
        FROM conversations c
        JOIN participants p ON c.id = p.conversation_id
        WHERE p.user_id = ?
        ORDER BY COALESCE((SELECT created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY created_at DESC LIMIT 1), c.created_at) DESC
    '''
    async with db.execute(query, (current_user['id'], current_user['id'])) as cursor:
        rows = await cursor.fetchall()
        
        # We also need to fetch participants for each conversation to match the old behavior
        conversations = []
        for row in rows:
            conv = dict(row)
            async with db.execute('''
                SELECT p.user_id, u.id, p.is_admin, u.username, u.display_name, u.phone_number, u.avatar_url
                FROM participants p
                JOIN users u ON p.user_id = u.id
                WHERE p.conversation_id = ?
            ''', (conv['id'],)) as p_cursor:
                p_rows = await p_cursor.fetchall()
                conv['participants'] = [{"user_id": p['user_id'], "user": dict(p)} for p in p_rows]
            conversations.append(conv)
            
        return conversations

from pydantic import BaseModel
class DirectConversationRequest(BaseModel):
    contact_id: int

@router.post("/direct")
async def create_direct_conversation(req: DirectConversationRequest, current_user: dict = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    # Check if a direct conversation already exists
    query = '''
        SELECT c.id
        FROM conversations c
        JOIN participants p1 ON c.id = p1.conversation_id
        JOIN participants p2 ON c.id = p2.conversation_id
        WHERE c.is_group = FALSE 
          AND p1.user_id = ? 
          AND p2.user_id = ?
    '''
    async with db.execute(query, (current_user['id'], req.contact_id)) as cursor:
        existing = await cursor.fetchone()
        if existing:
            return {"conversation_id": existing["id"]}
            
    # Create new conversation
    async with db.execute("INSERT INTO conversations (is_group, name) VALUES (FALSE, NULL)") as cursor:
        conv_id = cursor.lastrowid
        
        # Add participants
        await db.execute("INSERT INTO participants (conversation_id, user_id) VALUES (?, ?)", (conv_id, current_user['id']))
        await db.execute("INSERT INTO participants (conversation_id, user_id) VALUES (?, ?)", (conv_id, req.contact_id))
        await db.commit()
        
        return {"conversation_id": conv_id}

from app.schemas.schemas import GroupCreateRequest, AddParticipantRequest
from fastapi import HTTPException

@router.post("/group")
async def create_group_conversation(req: GroupCreateRequest, current_user: dict = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    if not req.name or len(req.contact_ids) == 0:
        raise HTTPException(status_code=400, detail="Group must have a name and at least one member")
        
    async with db.execute("INSERT INTO conversations (is_group, name) VALUES (TRUE, ?)", (req.name,)) as cursor:
        conv_id = cursor.lastrowid
        
        # Add creator as admin
        await db.execute("INSERT INTO participants (conversation_id, user_id, is_admin) VALUES (?, ?, TRUE)", (conv_id, current_user['id']))
        
        # Add other participants
        for contact_id in set(req.contact_ids):
            if contact_id != current_user['id']:
                await db.execute("INSERT INTO participants (conversation_id, user_id, is_admin) VALUES (?, ?, FALSE)", (conv_id, contact_id))
                
        await db.commit()
        return {"conversation_id": conv_id}

@router.post("/{conv_id}/participants")
async def add_participant(conv_id: int, req: AddParticipantRequest, current_user: dict = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    # Check if current user is admin
    async with db.execute("SELECT is_admin FROM participants WHERE conversation_id = ? AND user_id = ?", (conv_id, current_user['id'])) as cursor:
        row = await cursor.fetchone()
        if not row or not row['is_admin']:
            raise HTTPException(status_code=403, detail="Only admins can add participants")
            
    try:
        await db.execute("INSERT INTO participants (conversation_id, user_id, is_admin) VALUES (?, ?, FALSE)", (conv_id, req.user_id))
        await db.commit()
        
        async with db.execute("SELECT user_id FROM participants WHERE conversation_id = ?", (conv_id,)) as cursor:
            participants = await cursor.fetchall()
            for p in participants:
                await manager.send_personal_message({"type": "group_updated", "conversation_id": conv_id}, p["user_id"])
                
    except aiosqlite.IntegrityError:
        pass # Already a participant
    return {"status": "ok"}

@router.delete("/{conv_id}/participants/{user_id}")
async def remove_participant(conv_id: int, user_id: int, current_user: dict = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    # Allow users to leave, or admins to kick
    if user_id != current_user['id']:
        async with db.execute("SELECT is_admin FROM participants WHERE conversation_id = ? AND user_id = ?", (conv_id, current_user['id'])) as cursor:
            row = await cursor.fetchone()
            if not row or not row['is_admin']:
                raise HTTPException(status_code=403, detail="Only admins can remove other participants")
                
    await db.execute("DELETE FROM participants WHERE conversation_id = ? AND user_id = ?", (conv_id, user_id))
    await db.commit()
    
    async with db.execute("SELECT user_id FROM participants WHERE conversation_id = ?", (conv_id,)) as cursor:
        participants = await cursor.fetchall()
        for p in participants:
            await manager.send_personal_message({"type": "group_updated", "conversation_id": conv_id}, p["user_id"])
            
    await manager.send_personal_message({"type": "group_updated", "conversation_id": conv_id}, user_id)
            
    return {"status": "ok"}
