import os
import aiosqlite
from app.core.config import settings

async def init_db():
    os.makedirs(os.path.dirname(settings.DATABASE_URL) or ".", exist_ok=True)
    async with aiosqlite.connect(settings.DATABASE_URL) as db:
        await db.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone_number TEXT UNIQUE NOT NULL,
                username TEXT UNIQUE,
                display_name TEXT,
                avatar_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        await db.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                user_id INTEGER,
                contact_id INTEGER,
                saved_name TEXT,
                PRIMARY KEY (user_id, contact_id),
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (contact_id) REFERENCES users (id)
            )
        ''')
        await db.execute('''
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                is_group BOOLEAN DEFAULT FALSE,
                name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        await db.execute('''
            CREATE TABLE IF NOT EXISTS participants (
                conversation_id INTEGER,
                user_id INTEGER,
                is_admin BOOLEAN DEFAULT FALSE,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (conversation_id, user_id),
                FOREIGN KEY (conversation_id) REFERENCES conversations (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        await db.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER,
                sender_id INTEGER,
                content TEXT NOT NULL,
                status TEXT DEFAULT 'SENT',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                attachment_url TEXT,
                reply_to_id INTEGER,
                expires_at TIMESTAMP,
                FOREIGN KEY (conversation_id) REFERENCES conversations (id),
                FOREIGN KEY (sender_id) REFERENCES users (id),
                FOREIGN KEY (reply_to_id) REFERENCES messages (id)
            )
        ''')
        
        await db.execute('''
            CREATE TABLE IF NOT EXISTS message_reactions (
                message_id INTEGER,
                user_id INTEGER,
                emoji TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (message_id, user_id),
                FOREIGN KEY (message_id) REFERENCES messages (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        await db.commit()

        # Safely add columns to existing messages table (if migrating from old version)
        try:
            await db.execute("ALTER TABLE messages ADD COLUMN attachment_url TEXT")
        except aiosqlite.OperationalError:
            pass
        try:
            await db.execute("ALTER TABLE messages ADD COLUMN reply_to_id INTEGER REFERENCES messages(id)")
        except aiosqlite.OperationalError:
            pass
        try:
            await db.execute("ALTER TABLE messages ADD COLUMN expires_at TIMESTAMP")
        except aiosqlite.OperationalError:
            pass
        
        await db.commit()

async def get_db():
    db = await aiosqlite.connect(settings.DATABASE_URL)
    db.row_factory = aiosqlite.Row
    try:
        yield db
    finally:
        await db.close()
