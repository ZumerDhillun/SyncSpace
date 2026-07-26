import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Trash2, Link2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Room } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const difficultyColor: Record<string, 'mint' | 'amber' | 'rose'> = {
  Easy: 'mint',
  Medium: 'amber',
  Hard: 'rose',
}

interface RoomCardProps {
  room: Room
  onDeleted?: (roomId: string) => void
}

export function RoomCard({ room, onDeleted }: RoomCardProps) {
  const navigate = useNavigate()
  const currentUserId = useAuthStore((s) => s.user?.id)
  const [deleting, setDeleting] = useState(false)
  const isOwner = room.createdById === currentUserId

  function copyInviteLink(e: React.MouseEvent) {
    e.stopPropagation()
    const link = `${window.location.origin}/room/${room.id}`
    navigator.clipboard.writeText(link)
    toast.success('Invite link copied — send it to your partner!')
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm(`Delete "${room.name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await api.delete(`/api/rooms/${room.id}`)
      toast.success('Room deleted')
      onDeleted?.(room.id)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not delete room')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="glass-card flex flex-col gap-4 p-5 transition-transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h4 className="truncate font-semibold text-white">{room.name}</h4>
          <p className="mt-1 font-mono text-xs text-slate-500">{room.id}</p>
        </div>
        <div className="flex items-center gap-2">
          {room.status === 'active' ? (
            <Badge color="mint">Active</Badge>
          ) : (
            <Badge color="neutral">Closed</Badge>
          )}
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete room"
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-rose/15 hover:text-rose disabled:opacity-50"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge color="signal">{room.language}</Badge>
        {room.difficulty && <Badge color={difficultyColor[room.difficulty]}>{room.difficulty}</Badge>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {room.participants.slice(0, 4).map((p) => (
            <div
              key={p.id}
              title={p.user.name}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-base-800 text-[10px] font-bold text-white"
              style={{ backgroundColor: p.user.avatarColor }}
            >
              {p.user.name[0]?.toUpperCase()}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyInviteLink}
            title="Copy invite link"
            className="rounded-xl border border-base-border p-2 text-slate-400 transition-colors hover:bg-base-700 hover:text-white"
          >
            <Link2 size={15} />
          </button>
          <Button variant="secondary" onClick={() => navigate(`/room/${room.id}`)}>
            Rejoin
          </Button>
        </div>
      </div>
    </div>
  )
}
