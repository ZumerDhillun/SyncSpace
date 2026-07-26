import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { ChatMessage } from '@/types'
import { useAuthStore } from '@/store/authStore'

interface ChatPanelProps {
  messages: ChatMessage[]
  onSend: (message: string) => void
}

export function ChatPanel({ messages, onSend }: ChatPanelProps) {
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const currentUserName = useAuthStore((s) => s.user?.name)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    onSend(draft.trim())
    setDraft('')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-500">
            No messages yet. Say hi to your partner 👋
          </p>
        )}
        {messages.map((m, i) => {
          const mine = m.sender === currentUserName
          return (
            <div key={i} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                  mine ? 'bg-signal-gradient text-white' : 'bg-base-700 text-slate-200'
                }`}
              >
                {!mine && <p className="mb-0.5 text-xs font-semibold opacity-70">{m.sender}</p>}
                <p className="leading-relaxed">{m.message}</p>
              </div>
              <span className="mt-1 text-[10px] text-slate-600">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-base-border p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          className="input-field"
        />
        <button type="submit" className="btn-primary px-3.5">
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
