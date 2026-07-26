<div align="center">

# ⚡ SyncSpace

**A real-time collaborative coding platform for technical interview practice, pair programming, and live coding sessions.**

Write code together in a shared editor, run it instantly, get AI-powered hints, and chat — all in one room, all in real time.

[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

</div>

---

## ✨ Features

- **Live collaborative editor** — every keystroke synced in real time via CRDT (Y.js), so two people can type in the same file with zero conflicts.
- **Instant code execution** — run code in JavaScript, TypeScript, Python, Java, C++, Go, and Rust, with output shared to everyone in the room.
- **AI-powered hints** — a built-in coach nudges you toward the next step without ever handing you the full solution.
- **Live chat & presence** — see who's in the room and talk through your approach without leaving the editor.
- **Custom rooms** — attach a problem statement, difficulty, and language; set an expiry; make it private.
- **Session history** — review the code from any past closed room.
- **Invite links** — one click to copy a shareable room link.

## 🖥️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Zustand, Monaco Editor, Socket.io-client |
| Backend | Node.js, Express, TypeScript, Socket.io, Y.js (y-websocket) |
| Database | PostgreSQL (via Prisma ORM) |
| Cache | Redis |
| AI | Groq (OpenAI-compatible API) |
| Code execution | JDoodle Compiler API |

## 📁 Project Structure

```
syncspace/
├── client/     React + TypeScript frontend
└── server/     Express + TypeScript backend (REST API, Socket.io, Y.js sync server)
```

## 🚀 Getting Started

This repo needs a database, a cache, and two free API keys before it runs.

Quick version, once your `.env` files are filled in:

```bash
# Terminal 1
cd server
npm install
npx prisma db push
npm run dev

# Terminal 2
cd client
npm install
npm run dev
```

Then open **http://localhost:5173**.

## 🗺️ Roadmap Ideas

- Voice chat in-room
- Multi-file project support
- Interviewer-only "watch mode"
- More languages via Judge0/Piston fallback

