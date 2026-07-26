import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

export const redis = new Redis(redisUrl, {
  // Upstash's free tier closes idle connections — queue commands and retry
  // quietly instead of erroring out and logging noise every time.
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 200, 5000),
  reconnectOnError: () => true,
  commandTimeout: 3000,
})

let hasLoggedConnect = false
redis.on('connect', () => {
  if (!hasLoggedConnect) {
    console.log('[redis] connected')
    hasLoggedConnect = true
  }
})

redis.on('error', (err) => {
  // Only log the first error after a successful connection, to avoid spam
  // during Upstash's normal idle-reconnect cycles.
  if (hasLoggedConnect) {
    console.error('[redis] connection error:', err.message)
    hasLoggedConnect = false
  }
})

export const ROOM_TTL_PREFIX = 'room:ttl:'

export async function setRoomTTL(roomId: string, expiresAt: Date) {
  const ttlSeconds = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
  await redis.set(`${ROOM_TTL_PREFIX}${roomId}`, '1', 'EX', ttlSeconds)
}

export async function isRoomExpired(roomId: string): Promise<boolean> {
  const exists = await redis.exists(`${ROOM_TTL_PREFIX}${roomId}`)
  return exists === 0
}
