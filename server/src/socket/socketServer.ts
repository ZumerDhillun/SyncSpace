import { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import { executeCode } from '../lib/executor'
import { streamHint } from '../lib/openai'

interface Participant {
  socketId: string
  userId: string
  userName: string
  avatarColor: string
}

// In-memory room presence map: roomId -> participants.
// Fine for a single-instance deployment; for horizontal scaling this would move to Redis.
const rooms = new Map<string, Map<string, Participant>>()

function getRoomParticipants(roomId: string): Participant[] {
  return Array.from(rooms.get(roomId)?.values() || [])
}

export function initSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  })

  io.on('connection', (socket: Socket) => {
    let currentRoomId: string | null = null
    let currentUserId: string | null = null

    socket.on('join-room', ({ roomId, userId, userName, avatarColor }) => {
      currentRoomId = roomId
      currentUserId = userId
      socket.join(roomId)

      if (!rooms.has(roomId)) rooms.set(roomId, new Map())
      rooms.get(roomId)!.set(socket.id, { socketId: socket.id, userId, userName, avatarColor })

      const participants = getRoomParticipants(roomId)
      socket.emit('room-state', { participants })
      socket.to(roomId).emit('user-joined', { userName, participants })
    })

    socket.on('leave-room', ({ roomId }) => {
      rooms.get(roomId)?.delete(socket.id)
      socket.leave(roomId)
      const participants = getRoomParticipants(roomId)
      socket.to(roomId).emit('user-left', { participants })
    })

    socket.on('run-code', async ({ roomId, code, language }) => {
      try {
        const result = await executeCode(code, language)
        io.to(roomId).emit('code-output', result)
      } catch (err: any) {
        io.to(roomId).emit('code-output', {
          stdout: '',
          stderr: err?.message || 'Execution failed',
          time: null,
          memory: null,
          status: 'Error',
        })
      }
    })

    socket.on('send-message', ({ roomId, message, sender }) => {
      io.to(roomId).emit('new-message', {
        sender,
        message,
        timestamp: new Date().toISOString(),
      })
    })

    socket.on('request-hint', async ({ roomId, problemDesc, currentCode, language }) => {
      try {
        const full = await streamHint(problemDesc, currentCode, language, (chunk) => {
          io.to(roomId).emit('hint-stream', { chunk })
        })
        io.to(roomId).emit('hint-complete', { fullHint: full })
      } catch (err: any) {
        io.to(roomId).emit('hint-complete', { fullHint: '', error: err?.message })
      }
    })

    socket.on('disconnect', () => {
      if (currentRoomId) {
        rooms.get(currentRoomId)?.delete(socket.id)
        const participants = getRoomParticipants(currentRoomId)
        socket.to(currentRoomId).emit('user-left', { participants })
      }
    })
  })

  return io
}
