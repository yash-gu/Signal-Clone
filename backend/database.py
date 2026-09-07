import aiosqlite

DB_NAME = "signal_clone.db"

async def init_db():
    async with aiosqlite.connect(DB_NAME) as db:
        # Users table
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

        # Contacts table
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

        # Conversations table
        await db.execute('''
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                is_group BOOLEAN DEFAULT FALSE,
                name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Participants table
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

        # Messages table
        await db.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER,
                sender_id INTEGER,
                content TEXT NOT NULL,
                status TEXT DEFAULT 'SENT', -- SENT, DELIVERED, READ
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (conversation_id) REFERENCES conversations (id),
                FOREIGN KEY (sender_id) REFERENCES users (id)
            )
        ''')

        await db.commit()

async def get_db():
    db = await aiosqlite.connect(DB_NAME)
    db.row_factory = aiosqlite.Row
    try:
        yield db
    finally:
        await db.close()
