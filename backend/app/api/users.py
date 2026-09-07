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
async def search_users(q: str = Query(...), db: aiosqlite.Connection = Depends(get_db)):
    search_term = f"%{q}%"
    async with db.execute(
        "SELECT id, phone_number, username, display_name, avatar_url FROM users WHERE username LIKE ? OR phone_number LIKE ?",
        (search_term, search_term)
    ) as cursor:
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]
