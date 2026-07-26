import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  defaultLang: z.string().optional(),
  fontSize: z.number().int().min(10).max(28).optional(),
  theme: z.enum(['dark', 'light']).optional(),
  avatarColor: z.string().optional(),
})

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  language: z.string().min(1),
  problemTitle: z.string().optional(),
  problemDesc: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  expiryHours: z.number().int().min(1).max(72).default(4),
  isPrivate: z.boolean().default(false),
})

export const executeSchema = z.object({
  code: z.string().min(1),
  language: z.string().min(1),
  stdin: z.string().optional(),
})

export const hintSchema = z.object({
  problemDesc: z.string().optional().default(''),
  currentCode: z.string().optional().default(''),
  language: z.string().min(1),
})
