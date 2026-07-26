import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { Sidebar } from '@/components/layout/Sidebar'
import { CreateRoomModal } from '@/components/room/CreateRoomModal'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { api } from '@/lib/api'
import { Room, LANGUAGES } from '@/types'

export function HistoryPage() {
  const [sessions, setSessions] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [languageFilter, setLanguageFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewing, setViewing] = useState<Room | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 10

  useEffect(() => {
    setLoading(true)
    api
      .get('/api/history', { params: languageFilter ? { language: languageFilter } : {} })
      .then(({ data }) => setSessions(data.sessions))
      .finally(() => setLoading(false))
  }, [languageFilter])

  const paginated = sessions.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.max(1, Math.ceil(sessions.length / perPage))

  return (
    <div className="flex">
      <Sidebar onNewRoom={() => setModalOpen(true)} />
      <main className="min-h-screen flex-1 px-8 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">Session History</h1>
          <select
            value={languageFilter}
            onChange={(e) => {
              setLanguageFilter(e.target.value)
              setPage(1)
            }}
            className="input-field w-48"
          >
            <option value="">All languages</option>
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-base-700/40" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              No closed sessions yet — your history will show up here once a room ends.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-base-border text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Room</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Language</th>
                  <th className="px-5 py-3">Participants</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((s) => (
                  <tr key={s.id} className="border-b border-base-border/60 last:border-0 hover:bg-base-800/40">
                    <td className="px-5 py-3 font-medium text-white">{s.name}</td>
                    <td className="px-5 py-3 text-slate-400">
                      {s.closedAt ? new Date(s.closedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <Badge color="signal">{s.language}</Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {s.participants.map((p) => p.user.name).join(', ')}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setViewing(s)}
                        className="text-xs font-medium text-signal-400 hover:underline"
                      >
                        View Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-8 w-8 rounded-lg text-sm ${
                  page === i + 1 ? 'bg-signal-gradient text-white' : 'text-slate-400 hover:bg-base-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name || 'Code'} maxWidth="max-w-3xl">
        <div className="h-[60vh] overflow-hidden rounded-xl border border-base-border">
          <Editor
            height="100%"
            theme="vs-dark"
            language={viewing?.language || 'javascript'}
            value={viewing?.codeSnapshot || '// No code was saved for this session'}
            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
          />
        </div>
      </Modal>

      <CreateRoomModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
