# Product Requirement Document (PRD): Signal Messenger Clone

## 1. Executive Summary
A high-fidelity desktop web clone of Signal Messenger emphasizing privacy UX, clean typography, low-latency 1-on-1/group chat, and progressive delivery receipts.

## 2. Core Feature Requirements
- **Auth:** Mock OTP phone/username authentication (`1234` static passcode) issuing stateless Bearer JWTs.
- **Directory:** Contact search by username or phone.
- **Conversations:** Unified conversation model supporting 1-on-1 direct messaging and multi-member groups with admin privileges.
- **Real-Time Messaging:** Native WebSocket communication for instant bi-directional messaging, debounce typing indicators, and online presence.
- **Delivery States:** Triple-state message receipts:
  - Single check: `SENT` (persisted in DB)
  - Double check: `DELIVERED` (transmitted to recipient socket)
  - Blue/Solid double check: `READ` (recipient active viewport acknowledgment)
- **Signal UI Fidelity:** Signal Blue theme (`#2C6BED`), tail-anchored message bubbles, two-column responsive desktop shell.

## 3. Non-Functional Requirements
- Non-blocking asynchronous I/O (`aiosqlite` + FastAPI async routes).
- Optimistic UI updates on outbound messages.
- Sub-50ms local real-time dispatch via WebSocket hub.
