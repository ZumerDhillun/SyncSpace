import { useState } from 'react'
import { api } from '@/lib/api'
import { ExecutionResult } from '@/types'

// Used for standalone/non-room execution if ever needed; the Room page
// primarily uses the socket-based runCode from useRoomSocket so all
// participants see the same output simultaneously.
export function useCodeExecution() {
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function run(code: string, language: string, stdin?: string) {
    setLoading(true)
    try {
      const { data } = await api.post('/api/execute', { code, language, stdin })
      setResult(data)
      return data as ExecutionResult
    } finally {
      setLoading(false)
    }
  }

  return { run, result, loading }
}
