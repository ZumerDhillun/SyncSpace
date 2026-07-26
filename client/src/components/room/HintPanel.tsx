import { Sparkles } from 'lucide-react'
import { HintEntry } from '@/hooks/useAIHint'
import { Button } from '@/components/ui/Button'

interface HintPanelProps {
  hints: HintEntry[]
  isStreaming: boolean
  onRequestHint: () => void
}

export function HintPanel({ hints, isStreaming, onRequestHint }: HintPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-base-border p-3">
        <Button variant="primary" onClick={onRequestHint} disabled={isStreaming} className="w-full">
          <Sparkles size={16} /> {isStreaming ? 'Thinking…' : 'Get a Hint'}
        </Button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {hints.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-500">
            Stuck? Ask for a nudge — the AI coach won't hand you the full solution.
          </p>
        )}
        {hints.map((h, i) => (
          <div key={i} className="rounded-xl border border-signal-500/20 bg-signal-500/5 p-3.5">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-signal-400">
              <Sparkles size={13} /> Hint
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
              {h.answer || (h.streaming ? '…' : '')}
              {h.streaming && <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-blink bg-signal-400 align-middle" />}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
