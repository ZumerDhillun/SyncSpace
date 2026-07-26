import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 md:pt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-base-border bg-base-800/60 px-3 py-1 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            Free · No installation required
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Code Together.
            <br />
            <span className="bg-signal-gradient bg-clip-text text-transparent">Interview Better.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-slate-400">
            SyncSpace is a real-time collaborative coding room for technical
            interview practice, pair programming, and live coding sessions —
            with AI hints and instant execution built in.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/signup">
              <Button variant="primary" className="text-base">
                Start Coding Free <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="secondary" className="text-base">
                See How It Works
              </Button>
            </a>
          </div>
        </div>

        <MockEditor />
      </div>
    </section>
  )
}

function MockEditor() {
  return (
    <div className="glass-card animate-floatY p-0 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-base-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-rose/70" />
        <span className="h-3 w-3 rounded-full bg-amber/70" />
        <span className="h-3 w-3 rounded-full bg-mint/70" />
        <span className="ml-3 text-xs text-slate-500 font-mono">two-sum.js — shared with Priya</span>
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed">
        <p className="text-slate-500">// two participants, one editor, live</p>
        <p><span className="text-signal-400">function</span> <span className="text-ember-400">twoSum</span>(nums, target) {'{'}</p>
        <p className="pl-4 text-slate-300">
          <span className="text-signal-400">const</span> seen = <span className="text-signal-400">new</span> Map();
        </p>
        <p className="pl-4 text-slate-300">
          <span className="text-signal-400">for</span> (<span className="text-signal-400">let</span> i = 0; i {'<'} nums.length; i++) {'{'}
        </p>
        <p className="relative pl-8 text-slate-300">
          <span className="text-signal-400">const</span> rest = target - nums[i]
          <span className="ml-1 inline-block h-4 w-[2px] animate-blink bg-signal-400 align-middle" />
        </p>
        <p className="pl-4 text-slate-300">{'}'}</p>
        <p className="text-slate-300">{'}'}</p>
      </div>
      <div className="flex items-center justify-between border-t border-base-border px-4 py-2.5">
        <div className="flex -space-x-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-base-800 bg-signal-500 text-[10px] font-bold text-white">Y</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-base-800 bg-ember-500 text-[10px] font-bold text-white">P</span>
        </div>
        <span className="text-xs text-mint">● Live · synced</span>
      </div>
    </div>
  )
}
