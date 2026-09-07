from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel
from app.schemas.schemas import UserResponse
from app.core.security import get_current_user
from app.db.database import get_db
import aiosqlite

router = APIRouter()

class AddContactRequest(BaseModel):
    contact_id: int

@router.get("")
@router.get("/", response_model=List[UserResponse])
async def get_contacts(current_user: dict = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    query = '''
        SELECT u.id, u.phone_number, u.username, u.display_name, u.avatar_url
        FROM contacts c
        JOIN users u ON c.contact_id = u.id
        WHERE c.user_id = ?
    '''
    async with db.execute(query, (current_user['id'],)) as cursor:
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]

@router.post("")
@router.post("/")
async def add_contact(req: AddContactRequest, current_user: dict = Depends(get_current_user), db: aiosqlite.Connection = Depends(get_db)):
    if req.contact_id == current_user['id']:
        raise HTTPException(status_code=400, detail="Cannot add yourself as a contact")
        
    # Verify contact exists
    async with db.execute("SELECT id FROM users WHERE id = ?", (req.contact_id,)) as cursor:
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="User not found")
            
    try:
        await db.execute(
            "INSERT INTO contacts (user_id, contact_id) VALUES (?, ?)",
            (current_user['id'], req.contact_id)
        )
        await db.commit()
    except aiosqlite.IntegrityError:
        pass # Already a contact
        
    return {"status": "ok"}
