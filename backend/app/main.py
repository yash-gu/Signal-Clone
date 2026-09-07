from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.database import init_db
from app.db.seed import seed_db
from app.api import auth, users, conversations, messages, contacts

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    await seed_db()
    yield
    # Shutdown

app = FastAPI(title="Signal Clone API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(contacts.router, prefix="/api/contacts", tags=["contacts"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["conversations"])
app.include_router(messages.router, prefix="/api/messages", tags=["messages"])

@app.get("/")
async def root():
    return {"message": "Signal Clone API is running!"}
