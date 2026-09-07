from fastapi import APIRouter, Depends, HTTPException
from app.schemas.schemas import RegisterRequest, LoginRequest, TokenResponse
from app.core.security import create_access_token
from app.db.database import get_db
import aiosqlite

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest, db: aiosqlite.Connection = Depends(get_db)):
    if req.otp != "1234":
        raise HTTPException(status_code=401, detail="Invalid OTP. Please use '1234'.")
    try:
        await db.execute(
            "INSERT INTO users (phone_number, username, display_name) VALUES (?, ?, ?)",
            (req.phone_number, req.username, req.display_name)
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
        
    async with db.execute("SELECT id FROM users WHERE phone_number = ?", (req.phone_number,)) as cursor:
        user = await cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        token = create_access_token(user['id'], req.phone_number)
        return {"access_token": token, "token_type": "bearer"}
