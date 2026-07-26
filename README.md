<div align="center">

# ⚡ SyncSpace

### Real-Time Collaborative Coding Platform for Technical Interviews & Pair Programming

Write code together in a shared editor, execute it instantly, receive AI-powered hints, and communicate with your partner — all in one seamless real-time workspace.

[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

</div>

---

# ✨ Features

- **📝 Live Collaborative Editor**  
  Every keystroke is synchronized in real time using **Y.js (CRDT)**, allowing multiple users to edit the same file simultaneously without conflicts.

- **⚡ Instant Code Execution**  
  Execute code in JavaScript, TypeScript, Python, Java, C++, Go, and Rust. Output is instantly shared with everyone in the room.

- **🤖 AI-Powered Coding Hints**  
  Integrated AI assistant that provides contextual guidance and hints without revealing complete solutions.

- **💬 Live Chat & Presence**  
  See who is currently in the room and collaborate through an integrated real-time chat.

- **🏠 Custom Interview Rooms**  
  Create private rooms with configurable programming language, difficulty level, problem statement, expiration time, and invite links.

- **📜 Session History**  
  Revisit completed coding sessions and review previous solutions anytime.

- **🔗 One-Click Room Sharing**  
  Instantly generate shareable invite links for seamless collaboration.

---

# 🖥️ Tech Stack

| Layer | Technology |
|--------|------------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Zustand, Monaco Editor, Socket.io Client |
| **Backend** | Node.js, Express, TypeScript, Socket.io, Y.js (y-websocket) |
| **Database** | PostgreSQL with Prisma ORM |
| **Caching** | Redis |
| **AI Integration** | Groq (OpenAI-Compatible API) |
| **Code Execution** | JDoodle Compiler API |

---

# 📁 Project Structure

```text
syncspace/
├── client/      # React + TypeScript Frontend
└── server/      # Express + TypeScript Backend
                 # REST APIs
                 # Socket.io Server
                 # Y.js Synchronization Server
```

---

# 🚀 Getting Started

Before running the project, make sure you have:

- Node.js 20+
- PostgreSQL
- Redis
- Groq API Key
- JDoodle API Credentials

After configuring the required environment variables:

```bash
# Terminal 1
cd server
npm install
npx prisma db push
npm run dev
```

```bash
# Terminal 2
cd client
npm install
npm run dev
```

Open your browser and navigate to:

```
http://localhost:5173
```

---

# 🗺️ Future Roadmap

- 📂 Multi-file Project Workspace
- 👀 Interviewer-Only Watch Mode
- 🌐 Judge0 / Piston Fallback Execution Engine
- 📹 Screen Sharing
- 🧪 Automated Coding Assessments
- 📊 Interview Performance Analytics
- 📄 Export Session History
- 🔒 End-to-End Encrypted Private Rooms
- 📱 Responsive Mobile Interface

---

# 🤝 Contributing

Contributions, suggestions, and bug reports are welcome!

---

# 📄 License

This project is licensed under the **MIT License**.

Feel free to use, modify, and distribute this project in accordance with the license terms.

---

<div align="center">

**Built  using React, TypeScript, Node.js, Socket.io, Y.js, PostgreSQL, and AI.**

</div>
