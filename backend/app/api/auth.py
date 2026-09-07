from fastapi import APIRouter, Depends, HTTPException
from app.schemas.schemas import RegisterRequest, LoginRequest, TokenResponse
from app.core.security import create_access_token
from app.db.database import get_db
import aiosqlite

import re

router = APIRouter()

from pydantic import BaseModel

class CheckUserRequest(BaseModel):
    phone_number: str = None
    username: str = None

import os
import uuid
from fastapi import UploadFile, File

@router.post("/upload_avatar")
async def upload_avatar(file: UploadFile = File(...)):
    os.makedirs("data/uploads", exist_ok=True)
    ext = file.filename.split(".")[-1] if "." in file.filename else ""
    filename = f"avatar_{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join("data/uploads", filename)
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    return {"url": f"/uploads/{filename}"}

@router.post("/check")
async def check_user(req: CheckUserRequest, db: aiosqlite.Connection = Depends(get_db)):
    if req.username:
        async with db.execute("SELECT id FROM users WHERE username = ?", (req.username,)) as cursor:
            user = await cursor.fetchone()
    elif req.phone_number:
        async with db.execute("SELECT id FROM users WHERE phone_number = ?", (req.phone_number,)) as cursor:
            user = await cursor.fetchone()
    else:
        raise HTTPException(status_code=400, detail="Must provide phone_number or username")
    return {"exists": bool(user)}

@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest, db: aiosqlite.Connection = Depends(get_db)):
    if req.otp != "1234":
        raise HTTPException(status_code=401, detail="Invalid OTP. Please use '1234'.")
    if not re.match(r"^[a-zA-Z0-9_]+$", req.username):
        raise HTTPException(status_code=400, detail="Username can only contain letters, numbers, and underscores (no spaces).")
    try:
        await db.execute(
            "INSERT INTO users (phone_number, username, display_name, avatar_url) VALUES (?, ?, ?, ?)",
            (req.phone_number, req.username, req.display_name, req.avatar_url)
        )
        await db.commit()
        
        async with db.execute("SELECT id FROM users WHERE phone_number = ?", (req.phone_number,)) as cursor:
            user = await cursor.fetchone()
            token = create_access_token(user['id'], req.phone_number)
            return {"access_token": token, "token_type": "bearer"}
    except aiosqlite.IntegrityError:
        raise HTTPException(status_code=400, detail="Phone number or username already registered")

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: aiosqlite.Connection = Depends(get_db)):
    if req.otp != "1234":
        raise HTTPException(status_code=401, detail="Invalid OTP. Please use '1234'.")
        
    if req.username:
        async with db.execute("SELECT id, phone_number FROM users WHERE username = ?", (req.username,)) as cursor:
            user = await cursor.fetchone()
    elif req.phone_number:
        async with db.execute("SELECT id, phone_number FROM users WHERE phone_number = ?", (req.phone_number,)) as cursor:
            user = await cursor.fetchone()
    else:
        raise HTTPException(status_code=400, detail="Must provide phone_number or username")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    token = create_access_token(user['id'], user['phone_number'])
    return {"access_token": token, "token_type": "bearer"}
