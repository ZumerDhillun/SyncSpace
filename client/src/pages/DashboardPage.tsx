import { useEffect, useState } from 'react'
import { Hash, Clock, Code2 } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { StatCard } from '@/components/dashboard/StatCard'
import { QuickJoin } from '@/components/dashboard/QuickJoin'
import { RoomCard } from '@/components/dashboard/RoomCard'
import { CreateRoomModal } from '@/components/room/CreateRoomModal'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Room } from '@/types'

function RoomCardSkeleton() {
  return <div className="glass-card h-40 animate-pulse bg-base-800/40" />
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    api
      .get('/api/rooms/my-rooms')
      .then(({ data }) => {
        if (mounted) setRooms(data.rooms)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const totalSessions = rooms.length
  const languageCounts = rooms.reduce<Record<string, number>>((acc, r) => {
    acc[r.language] = (acc[r.language] || 0) + 1
    return acc
  }, {})
  const mostUsedLang =
    Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

  return (
    <div className="flex">
      <Sidebar onNewRoom={() => setModalOpen(true)} />
      <main className="min-h-screen flex-1 px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard icon={Hash} label="Total Sessions" value={totalSessions} />
          <StatCard icon={Clock} label="Avg Session Length" value="—" />
          <StatCard icon={Code2} label="Most Used Language" value={mostUsedLang} />
        </div>

        <div className="mb-8">
          <QuickJoin />
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Recent Rooms</h2>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center gap-3 py-16 text-center">
              <p className="text-slate-400">You haven't joined any rooms yet.</p>
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Create your first room
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.slice(0, 6).map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onDeleted={(roomId) => setRooms((prev) => prev.filter((r) => r.id !== roomId))}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateRoomModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
