import { Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { signToken } from '../utils/jwt'
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
} from '../utils/validators'
import { AuthedRequest } from '../middleware/auth.middleware'

const SALT_ROUNDS = 12

function sanitizeUser(user: any) {
  const { password, ...rest } = user
  return rest
}

export async function register(req: AuthedRequest, res: Response) {
  const { name, email, password } = registerSchema.parse(req.body)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return res.status(409).json({ message: 'An account with that email already exists' })
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  })

  const token = signToken({ id: user.id, email: user.email })
  res.status(201).json({ token, user: sanitizeUser(user) })
}

export async function login(req: AuthedRequest, res: Response) {
  const { email, password } = loginSchema.parse(req.body)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = signToken({ id: user.id, email: user.email })
  res.json({ token, user: sanitizeUser(user) })
}

export async function me(req: AuthedRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json({ user: sanitizeUser(user) })
}

export async function updateProfile(req: AuthedRequest, res: Response) {
  const data = updateProfileSchema.parse(req.body)
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data,
  })
  res.json({ user: sanitizeUser(user) })
}

export async function updatePassword(req: AuthedRequest, res: Response) {
  const { oldPassword, newPassword } = updatePasswordSchema.parse(req.body)
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
  if (!user) return res.status(404).json({ message: 'User not found' })

  const valid = await bcrypt.compare(oldPassword, user.password)
  if (!valid) return res.status(401).json({ message: 'Current password is incorrect' })

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })
  res.json({ success: true })
}

export async function deleteAccount(req: AuthedRequest, res: Response) {
  const userId = req.user!.id
  await prisma.roomParticipant.deleteMany({ where: { userId } })
  await prisma.room.deleteMany({ where: { createdById: userId } })
  await prisma.user.delete({ where: { id: userId } })
  res.json({ success: true })
}
