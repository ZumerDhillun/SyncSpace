import { useState } from 'react'
import { Loader2, Clock, Cpu } from 'lucide-react'
import { ExecutionResult } from '@/types'

interface OutputConsoleProps {
  output: ExecutionResult | null
  isRunning: boolean
  stdin: string
  onStdinChange: (v: string) => void
}

export function OutputConsole({ output, isRunning, stdin, onStdinChange }: OutputConsoleProps) {
  const [tab, setTab] = useState<'output' | 'stdin'>('output')

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-base-border bg-base-800/40">
      <div className="flex items-center justify-between border-b border-base-border px-4 py-2">
        <div className="flex gap-1">
          {(['output', 'stdin'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                tab === t ? 'bg-signal-500/15 text-signal-400' : 'text-slate-500 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {output && (
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {output.time ? `${output.time}s` : '—'}
            </span>
            <span className="flex items-center gap-1">
              <Cpu size={12} /> {output.memory ? `${output.memory} KB` : '—'}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {tab === 'stdin' ? (
          <textarea
            value={stdin}
            onChange={(e) => onStdinChange(e.target.value)}
            placeholder="Optional input passed to your program via stdin…"
            className="h-full w-full resize-none bg-transparent text-slate-300 outline-none placeholder-slate-600"
          />
        ) : isRunning ? (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 size={16} className="animate-spin" /> Running…
          </div>
        ) : output ? (
          <div className="space-y-3">
            {output.stdout && <pre className="whitespace-pre-wrap text-slate-200">{output.stdout}</pre>}
            {output.stderr && <pre className="whitespace-pre-wrap text-rose">{output.stderr}</pre>}
            {!output.stdout && !output.stderr && (
              <p className="text-slate-500">Program ran with no output.</p>
            )}
          </div>
        ) : (
          <p className="text-slate-600">Press "Run ▶" to execute your code.</p>
        )}
      </div>
    </div>
  )
}
