# Signal Web Clone

A high-fidelity desktop web clone of Signal Messenger, built with a modern, modular architecture. It emphasizes privacy UX, clean typography, low-latency messaging, and UI parity with the original desktop app.

## Features

- **Pixel-Perfect Signal UI**: Faithfully recreates the modern Signal desktop client design using Tailwind CSS, complete with custom palettes, fonts (Inter, JetBrains Mono), and micro-interactions.
- **Real-Time Messaging**: Bidirectional WebSocket integration for low-latency message streaming.
- **Stateless Authentication**: JWT-based session management simulating a phone/OTP registration flow.
- **Asynchronous Backend**: Powered by FastAPI and `aiosqlite` for high-throughput concurrency.
- **Delivery States**: UI readiness for SENT, DELIVERED, and READ message receipts.
- **Encrypted UI Paradigms**: Features mock elements for End-to-End Encryption (E2EE), Safety Numbers, and cryptographic footprints to mirror Signal's privacy-focused interface.

## Tech Stack

### Frontend
- Next.js (App Router)
- React 18
- Tailwind CSS
- TypeScript

### Backend
- FastAPI
- WebSockets
- aiosqlite (Async SQLite Database)
- PyJWT & Passlib (Authentication)

## Local Development Setup

### 1. Backend

Navigate to the backend directory and set up a Python virtual environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Initialize and seed the database with mock users and conversations:
```bash
python app/db/seed.py
```

Start the FastAPI server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
The backend API will be running at `http://localhost:8000`.

### 2. Frontend

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the Next.js development server:
```bash
npm run dev
```
The application will be running at `http://localhost:3000`.

## Testing the App

1. Open `http://localhost:3000` in your browser.
2. The seed script pre-populated the database with three mock users. Log in with the following credentials:
   - **Phone**: `1111111111` (Sarah Chen) or `2222222222` (Alex Rivera)
   - **OTP Code**: `1234` (Mock static passcode)
3. You will immediately see the beautifully rendered Signal chat interface.

## Architecture & Code Structure

The project strictly follows a modular architecture:

- **`/backend/app/api`**: RESTful routers organized by domain (`auth.py`, `conversations.py`, `messages.py`, `users.py`).
- **`/backend/app/core`**: Core infrastructure (`config.py`, `security.py`, `ws_manager.py`).
- **`/frontend/src/components`**: Modular UI components split into `layout`, `sidebar`, and `chat` directories to prevent massive single-file components.
- **`/frontend/src/context`**: React Context providers (`AuthContext.tsx`, `SocketContext.tsx`) isolating complex state management from presentational UI components.

## Database Schema

The SQLite database (`signal_clone.db`) is highly normalized:
- **`users`**: `id`, `phone_number` (unique), `username`, `display_name`, `avatar_url`, `hashed_otp`, `created_at`
- **`conversations`**: `id`, `is_group`, `name` (for groups), `created_at`, `updated_at`
- **`participants`**: `conversation_id`, `user_id`, `joined_at`, `is_admin` (maps many-to-many relationship)
- **`messages`**: `id`, `conversation_id`, `sender_id`, `content`, `created_at`

## API Overview

The backend exposes clean, RESTful endpoints grouped by domain:
- **`POST /api/auth/login`**: Authenticate via phone/OTP and receive JWT.
- **`POST /api/auth/register`**: Create a new user identity.
- **`GET /api/users/me`**: Fetch current user profile.
- **`GET /api/users/search?q={query}`**: Find contacts by username.
- **`GET /api/conversations/`**: List all active conversations for the current user.
- **`POST /api/conversations/direct`**: Create/fetch a 1-on-1 chat.
- **`POST /api/conversations/group`**: Create a new group chat with members.
- **`GET /api/messages/{conversation_id}`**: Fetch historical messages for a chat.
- **`WS /api/messages/ws?token={jwt}`**: Persistent WebSocket connection for real-time messaging, typing indicators, and read receipts.
