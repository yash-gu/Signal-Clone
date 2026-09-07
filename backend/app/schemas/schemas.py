from pydantic import BaseModel
from typing import Optional, List

class RegisterRequest(BaseModel):
    phone_number: str
    username: str
    display_name: str
    otp: str

class LoginRequest(BaseModel):
    phone_number: str
    otp: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    phone_number: str
    username: str
    display_name: str
    avatar_url: Optional[str] = None

class ConversationResponse(BaseModel):
    id: int
    is_group: bool
    name: Optional[str] = None
    created_at: str
    last_message: Optional[str] = None
    last_message_time: Optional[str] = None
    unread_count: int = 0

class GroupCreateRequest(BaseModel):
    name: str
    contact_ids: List[int]

class AddParticipantRequest(BaseModel):
    user_id: int
