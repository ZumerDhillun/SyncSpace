import { create } from 'zustand'
import { ChatMessage, ExecutionResult, RoomParticipant, Room } from '@/types'

interface RoomState {
  room: Room | null
  participants: RoomParticipant[] | { userId: string; userName: string; avatarColor: string }[]
  messages: ChatMessage[]
  output: ExecutionResult | null
  isRunning: boolean
  setRoom: (room: Room | null) => void
  setParticipants: (participants: any[]) => void
  addMessage: (msg: ChatMessage) => void
  setOutput: (output: ExecutionResult | null) => void
  setIsRunning: (running: boolean) => void
  reset: () => void
}

export const useRoomStore = create<RoomState>((set) => ({
  room: null,
  participants: [],
  messages: [],
  output: null,
  isRunning: false,
  setRoom: (room) => set({ room }),
  setParticipants: (participants) => set({ participants }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setOutput: (output) => set({ output, isRunning: false }),
  setIsRunning: (isRunning) => set({ isRunning }),
  reset: () => set({ room: null, participants: [], messages: [], output: null, isRunning: false }),
}))
