import 'dotenv/config'
import express from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'

import authRoutes from './routes/auth.routes'
import roomsRoutes from './routes/rooms.routes'
import executeRoutes from './routes/execute.routes'
import aiRoutes from './routes/ai.routes'
import historyRoutes from './routes/history.routes'
import { errorHandler } from './middleware/errorHandler.middleware'
import { initSocketServer } from './socket/socketServer'

const app = express()
const httpServer = http.createServer(app)

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(helmet())
app.use(cors({ origin: clientUrl, credentials: true }))
app.use(express.json({ limit: '2mb' }))

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomsRoutes)
app.use('/api/execute', executeRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/history', historyRoutes)

app.use(errorHandler)

initSocketServer(httpServer)

const port = process.env.PORT || 3001
httpServer.listen(port, () => {
  console.log(`[server] SyncSpace API listening on http://localhost:${port}`)
})
