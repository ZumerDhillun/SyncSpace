import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthedRequest } from '../middleware/auth.middleware'

export async function listHistory(req: AuthedRequest, res: Response) {
  const { language, from, to } = req.query as { language?: string; from?: string; to?: string }

  const sessions = await prisma.room.findMany({
    where: {
      participants: { some: { userId: req.user!.id } },
      status: 'closed',
      ...(language ? { language } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    orderBy: { closedAt: 'desc' },
    include: {
      participants: { include: { user: { select: { id: true, name: true } } } },
    },
  })

  res.json({ sessions })
}

export async function getHistoryDetail(req: AuthedRequest, res: Response) {
  const room = await prisma.room.findUnique({
    where: { id: req.params.roomId },
    include: { participants: { include: { user: { select: { id: true, name: true } } } } },
  })
  if (!room) return res.status(404).json({ message: 'Session not found' })
  res.json({ room, codeSnapshot: room.codeSnapshot })
}
