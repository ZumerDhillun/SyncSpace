import { Response } from 'express'
import { streamHint } from '../lib/openai'
import { hintSchema } from '../utils/validators'
import { AuthedRequest } from '../middleware/auth.middleware'

// Streams the hint back as Server-Sent Events so the client can render tokens live.
export async function hint(req: AuthedRequest, res: Response) {
  const { problemDesc, currentCode, language } = hintSchema.parse(req.body)

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  try {
    const full = await streamHint(problemDesc, currentCode, language, (chunk) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`)
    })
    res.write(`data: ${JSON.stringify({ done: true, fullHint: full })}\n\n`)
    res.end()
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err?.message || 'AI hint failed' })}\n\n`)
    res.end()
  }
}
