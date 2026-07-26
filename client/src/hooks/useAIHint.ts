import { useEffect, useState } from 'react'
import { getSocket } from '@/lib/socket'

export interface HintEntry {
  question: string
  answer: string
  streaming: boolean
}

export function useAIHint(roomId: string | undefined) {
  const [hints, setHints] = useState<HintEntry[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    if (!roomId) return
    const socket = getSocket()

    function onChunk({ chunk }: { chunk: string }) {
      setHints((prev) => {
        if (prev.length === 0) return prev
        const updated = [...prev]
        const last = updated[updated.length - 1]
        updated[updated.length - 1] = { ...last, answer: last.answer + chunk }
        return updated
      })
    }

    function onComplete() {
      setIsStreaming(false)
      setHints((prev) => {
        if (prev.length === 0) return prev
        const updated = [...prev]
        const last = updated[updated.length - 1]
        updated[updated.length - 1] = { ...last, streaming: false }
        return updated
      })
    }

    socket.on('hint-stream', onChunk)
    socket.on('hint-complete', onComplete)

    return () => {
      socket.off('hint-stream', onChunk)
      socket.off('hint-complete', onComplete)
    }
  }, [roomId])

  function requestHint(problemDesc: string, currentCode: string, language: string) {
    if (!roomId) return
    setIsStreaming(true)
    setHints((prev) => [
      ...prev,
      { question: 'Get a hint for my current approach', answer: '', streaming: true },
    ])
    getSocket().emit('request-hint', { roomId, problemDesc, currentCode, language })
  }

  return { hints, isStreaming, requestHint }
}
