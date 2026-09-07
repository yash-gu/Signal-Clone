import asyncio
import aiosqlite
import sys
import os

# Add backend directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.config import settings
from app.db.database import init_db

async def seed_db():
    await init_db()
    async with aiosqlite.connect(settings.DATABASE_URL) as db:
        # Check if the specific mock user exists
        async with db.execute("SELECT COUNT(*) FROM users WHERE username = 'sarah_chen'") as cursor:
            count = (await cursor.fetchone())[0]
            if count > 0:
                print("Mock data already seeded.")
                return
        # Create users
        users = [
            ("1111111111", "sarah_chen", "Sarah Chen"),
            ("2222222222", "alex_rivera", "Alex Rivera"),
            ("3333333333", "maya_patel", "Maya Patel"),
        ]
        
        for u in users:
            try:
                await db.execute("INSERT INTO users (phone_number, username, display_name) VALUES (?, ?, ?)", u)
            except aiosqlite.IntegrityError:
                pass
        
        await db.commit()
        
        # Get user IDs
        async with db.execute("SELECT id, username FROM users") as cursor:
            user_rows = await cursor.fetchall()
            user_map = {row[1]: row[0] for row in user_rows}
            
        sarah_id = user_map.get("sarah_chen")
        alex_id = user_map.get("alex_rivera")
        
        if not sarah_id or not alex_id:
            print("Users failed to create")
            return
            
        # Create contacts
        try:
            await db.execute("INSERT INTO contacts (user_id, contact_id, saved_name) VALUES (?, ?, ?)", (sarah_id, alex_id, "Alex Rivera"))
        except:
            pass

        # Create a conversation
        await db.execute("INSERT INTO conversations (is_group, name) VALUES (0, NULL)")
        await db.commit()
        
        async with db.execute("SELECT MAX(id) FROM conversations") as cursor:
            conv_id = (await cursor.fetchone())[0]
            
        # Add participants
        try:
            await db.execute("INSERT INTO participants (conversation_id, user_id) VALUES (?, ?)", (conv_id, sarah_id))
            await db.execute("INSERT INTO participants (conversation_id, user_id) VALUES (?, ?)", (conv_id, alex_id))
        except:
            pass
            
        # Add messages
        messages = [
            (conv_id, alex_id, "Hey Sarah! Did you push the latest commit for the Signal protocol upgrade?", "READ"),
            (conv_id, sarah_id, "Just did! All automated tests passed and the handshake is verified.", "READ"),
            (conv_id, alex_id, "Awesome. Let me know when you want to run the live test session.", "READ"),
            (conv_id, sarah_id, "Sounds good! See you at 4pm then", "DELIVERED"),
        ]
        
        for m in messages:
            await db.execute("INSERT INTO messages (conversation_id, sender_id, content, status) VALUES (?, ?, ?, ?)", m)
            
        await db.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_db())
