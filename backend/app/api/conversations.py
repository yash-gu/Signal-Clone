from fastapi import APIRouter, Depends
from typing import List
from app.schemas.schemas import ConversationResponse
from app.core.security import get_current_user
from app.db.database import get_db
import aiosqlite

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_conversations(current_user: dict = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    query = '''
        SELECT c.id, c.is_group, c.name, c.created_at
        FROM conversations c
        JOIN participants p ON c.id = p.conversation_id
        WHERE p.user_id = ?
        ORDER BY c.created_at DESC
    '''
    async with db.execute(query, (current_user['id'],)) as cursor:
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]
