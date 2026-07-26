import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Room } from '@/types'

const difficultyColor: Record<string, 'mint' | 'amber' | 'rose'> = {
  Easy: 'mint',
  Medium: 'amber',
  Hard: 'rose',
}

export function ProblemPanel({ room }: { room: Room | null }) {
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="flex h-full w-8 shrink-0 items-center justify-center rounded-xl border border-base-border bg-base-800/40 text-slate-500 hover:text-white"
        title="Show problem panel"
      >
        <ChevronRight size={16} />
      </button>
    )
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-base-border bg-base-800/40">
      <div className="flex items-center justify-between border-b border-base-border px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Problem</h3>
        <button onClick={() => setCollapsed(true)} className="text-slate-500 hover:text-white">
          <ChevronLeft size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {room?.problemTitle ? (
          <>
            <div className="mb-3 flex items-center gap-2">
              <h4 className="font-semibold text-white">{room.problemTitle}</h4>
            </div>
            {room.difficulty && (
              <div className="mb-4">
                <Badge color={difficultyColor[room.difficulty]}>{room.difficulty}</Badge>
              </div>
            )}
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {room.problemDesc}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-500">
            No problem attached to this room. Just a shared editor — code away.
          </p>
        )}
      </div>
    </div>
  )
}
