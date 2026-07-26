import { useEffect } from 'react'
import { getSocket } from '@/lib/socket'
import { useRoomStore } from '@/store/roomStore'
import { useAuthStore } from '@/store/authStore'

export function useRoomSocket(roomId: string | undefined) {
  const setParticipants = useRoomStore((s) => s.setParticipants)
  const addMessage = useRoomStore((s) => s.addMessage)
  const setOutput = useRoomStore((s) => s.setOutput)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!roomId || !user) return
    const socket = getSocket()

    socket.emit('join-room', {
      roomId,
      userId: user.id,
      userName: user.name,
      avatarColor: user.avatarColor,
    })

    socket.on('room-state', ({ participants }) => setParticipants(participants))
    socket.on('user-joined', ({ participants }) => setParticipants(participants))
    socket.on('user-left', ({ participants }) => setParticipants(participants))
    socket.on('code-output', (result) => setOutput(result))
    socket.on('new-message', (msg) => addMessage(msg))

    return () => {
      socket.emit('leave-room', { roomId, userId: user.id })
      socket.off('room-state')
      socket.off('user-joined')
      socket.off('user-left')
      socket.off('code-output')
      socket.off('new-message')
    }
  }, [roomId, user?.id])

  function sendMessage(message: string) {
    if (!roomId || !user) return
    getSocket().emit('send-message', { roomId, message, sender: user.name })
  }

  function runCode(code: string, language: string) {
    if (!roomId) return
    useRoomStore.getState().setIsRunning(true)
    getSocket().emit('run-code', { roomId, code, language })
  }

  return { sendMessage, runCode }
}
