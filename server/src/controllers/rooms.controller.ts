import { Response } from 'express'
import { nanoid } from 'nanoid'
import { prisma } from '../lib/prisma'
import { setRoomTTL } from '../lib/redis'
import { createRoomSchema } from '../utils/validators'
import { AuthedRequest } from '../middleware/auth.middleware'

export async function createRoom(req: AuthedRequest, res: Response) {
  const data = createRoomSchema.parse(req.body)
  const id = nanoid(8)
  const expiresAt = new Date(Date.now() + data.expiryHours * 60 * 60 * 1000)

  const room = await prisma.room.create({
    data: {
      id,
      name: data.name,
      language: data.language,
      problemTitle: data.problemTitle,
      problemDesc: data.problemDesc,
      difficulty: data.difficulty,
      isPrivate: data.isPrivate,
      expiresAt,
      createdById: req.user!.id,
      participants: {
        create: { userId: req.user!.id },
      },
    },
  })

  // Best-effort only — a slow/unreachable Redis (common on free tiers) should
  // never block the actual room from being created.
  try {
    await setRoomTTL(room.id, expiresAt)
  } catch (err: any) {
    console.warn('[redis] setRoomTTL failed, continuing anyway:', err.message)
  }

  res.status(201).json({ room })
}

export async function myRooms(req: AuthedRequest, res: Response) {
  const rooms = await prisma.room.findMany({
    where: {
      OR: [
        { createdById: req.user!.id },
        { participants: { some: { userId: req.user!.id } } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      participants: { include: { user: { select: { id: true, name: true, avatarColor: true } } } },
    },
  })
  res.json({ rooms })
}

export async function getRoom(req: AuthedRequest, res: Response) {
  const room = await prisma.room.findUnique({
    where: { id: req.params.roomId },
    include: {
      createdBy: { select: { id: true, name: true, avatarColor: true } },
      participants: { include: { user: { select: { id: true, name: true, avatarColor: true } } } },
    },
  })
  if (!room) return res.status(404).json({ message: 'Room not found or expired' })
  res.json({ room })
}

export async function joinRoom(req: AuthedRequest, res: Response) {
  const room = await prisma.room.findUnique({ where: { id: req.params.roomId } })
  if (!room) return res.status(404).json({ message: 'Room not found or expired' })
  if (room.status === 'closed') {
    return res.status(410).json({ message: 'This room has been closed' })
  }

  await prisma.roomParticipant.upsert({
    where: { userId_roomId: { userId: req.user!.id, roomId: room.id } },
    create: { userId: req.user!.id, roomId: room.id },
    update: { leftAt: null },
  })

  res.json({ room })
}

export async function leaveRoom(req: AuthedRequest, res: Response) {
  await prisma.roomParticipant.updateMany({
    where: { userId: req.user!.id, roomId: req.params.roomId },
    data: { leftAt: new Date() },
  })
  res.json({ success: true })
}

export async function closeRoom(req: AuthedRequest, res: Response) {
  const { finalCode } = req.body as { finalCode?: string }
  const room = await prisma.room.update({
    where: { id: req.params.roomId },
    data: { status: 'closed', codeSnapshot: finalCode, closedAt: new Date() },
  })
  res.json({ success: true, room })
}

export async function deleteRoom(req: AuthedRequest, res: Response) {
  const room = await prisma.room.findUnique({ where: { id: req.params.roomId } })
  if (!room) return res.status(404).json({ message: 'Room not found' })
  if (room.createdById !== req.user!.id) {
    return res.status(403).json({ message: 'Only the room creator can delete this room' })
  }

  await prisma.roomParticipant.deleteMany({ where: { roomId: room.id } })
  await prisma.room.delete({ where: { id: room.id } })
  res.json({ success: true })
}
