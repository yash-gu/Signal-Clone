from fastapi import APIRouter, Depends, Query
from typing import List
from app.schemas.schemas import UserResponse
from app.core.security import get_current_user
from app.db.database import get_db
import aiosqlite

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.get("/search", response_model=List[UserResponse])
async def search_users(q: str, current_user: dict = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    if not q or not q.strip():
        return []
        
    query = '''
        SELECT id, phone_number, username, display_name, avatar_url 
        FROM users 
        WHERE (username LIKE ? OR display_name LIKE ? OR phone_number LIKE ?)
          AND id != ?
        LIMIT 20
    '''
    search_term = f"%{q}%"
    async with db.execute(query, (search_term, search_term, search_term, current_user['id'])) as cursor:
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]

from app.core.ws_manager import manager

@router.get("/{user_id}/status")
async def get_user_status(user_id: int, db: aiosqlite.Connection = Depends(get_db)):
    is_online = user_id in manager.active_connections
    async with db.execute("SELECT last_seen FROM users WHERE id = ?", (user_id,)) as cursor:
        row = await cursor.fetchone()
        last_seen = row["last_seen"] if row else None
    return {"is_online": is_online, "last_seen": last_seen}

