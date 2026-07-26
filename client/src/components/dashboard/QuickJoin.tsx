import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function QuickJoin() {
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    navigate(`/room/${code.trim()}`)
  }

  return (
    <form onSubmit={handleJoin} className="glass-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="mb-1 text-sm font-medium text-white">Quick Join</p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste a room code, e.g. aB3kD9zL"
          className="input-field font-mono"
        />
      </div>
      <Button type="submit" variant="secondary" className="sm:mt-5">
        Join Room <ArrowRight size={16} />
      </Button>
    </form>
  )
}
