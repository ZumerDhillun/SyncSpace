import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { api } from '@/lib/api'
import { LANGUAGES } from '@/types'

interface CreateRoomModalProps {
  open: boolean
  onClose: () => void
}

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const
const EXPIRY_OPTIONS = [
  { label: '1 hour', value: 1 },
  { label: '4 hours', value: 4 },
  { label: '24 hours', value: 24 },
]

export function CreateRoomModal({ open, onClose }: CreateRoomModalProps) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [problemTitle, setProblemTitle] = useState('')
  const [problemDesc, setProblemDesc] = useState('')
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>('Easy')
  const [expiryHours, setExpiryHours] = useState(4)
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Room name is required')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/api/rooms/create', {
        name,
        language,
        problemTitle: problemTitle || undefined,
        problemDesc: problemDesc || undefined,
        difficulty,
        expiryHours,
        isPrivate,
      })
      onClose()
      navigate(`/room/${data.room.id}`)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not create room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create a New Room" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Room Name"
          placeholder="e.g. Mock Interview with Sara"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Problem Title (optional)"
          placeholder="e.g. Two Sum"
          value={problemTitle}
          onChange={(e) => setProblemTitle(e.target.value)}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Problem Description (optional)
          </label>
          <textarea
            value={problemDesc}
            onChange={(e) => setProblemDesc(e.target.value)}
            rows={4}
            placeholder="Paste a LeetCode-style problem here..."
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Difficulty</label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  difficulty === d
                    ? 'border-signal-500 bg-signal-500/15 text-signal-400'
                    : 'border-base-border text-slate-400 hover:bg-base-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Room Expiry</label>
            <select
              value={expiryHours}
              onChange={(e) => setExpiryHours(Number(e.target.value))}
              className="input-field"
            >
              {EXPIRY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <Toggle checked={isPrivate} onChange={setIsPrivate} label="Private room" />
        </div>

        <Button type="submit" variant="primary" disabled={loading} className="mt-2 w-full">
          {loading ? 'Creating…' : 'Create Room'}
        </Button>
      </form>
    </Modal>
  )
}
