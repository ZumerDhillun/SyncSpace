// Dedicated WebSocket server for Y.js document sync (CRDT).
// Kept fully decoupled from the Socket.io event bus per the spec: Y.js handles
// document state, Socket.io handles application events (chat/presence/exec).
import 'dotenv/config'
import http from 'http'
import { WebSocketServer } from 'ws'
// @ts-ignore -- y-websocket ships without types for this deep import
import { setupWSConnection } from 'y-websocket/bin/utils'

const port = parseInt(process.env.YJS_WS_PORT || '1234', 10)

const server = http.createServer((_req, res) => {
  res.writeHead(200)
  res.end('SyncSpace Y.js WebSocket server')
})

const wss = new WebSocketServer({ server })

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req)
})

server.listen(port, () => {
  console.log(`[yjs] WebSocket server listening on ws://localhost:${port}`)
})
