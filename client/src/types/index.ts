export interface User {
  id: string
  name: string
  email: string
  avatarColor: string
  defaultLang: string
  fontSize: number
  theme: 'dark' | 'light'
}

export interface RoomParticipant {
  id: string
  userId: string
  joinedAt: string
  leftAt: string | null
  user: Pick<User, 'id' | 'name' | 'avatarColor'>
}

export interface Room {
  id: string
  name: string
  language: string
  problemTitle: string | null
  problemDesc: string | null
  difficulty: 'Easy' | 'Medium' | 'Hard' | null
  isPrivate: boolean
  codeSnapshot: string | null
  status: 'active' | 'closed'
  createdById: string
  createdAt: string
  expiresAt: string
  closedAt: string | null
  participants: RoomParticipant[]
}

export interface ChatMessage {
  sender: string
  message: string
  timestamp: string
}

export interface ExecutionResult {
  stdout: string
  stderr: string
  time: string | null
  memory: number | null
  status: string
}

export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
] as const
