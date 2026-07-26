interface BadgeProps {
  children: React.ReactNode
  color?: 'signal' | 'mint' | 'amber' | 'rose' | 'neutral'
}

const colorMap: Record<string, string> = {
  signal: 'bg-signal-500/15 text-signal-400 border-signal-500/30',
  mint: 'bg-mint/15 text-mint border-mint/30',
  amber: 'bg-amber/15 text-amber border-amber/30',
  rose: 'bg-rose/15 text-rose border-rose/30',
  neutral: 'bg-base-700 text-slate-300 border-base-border',
}

export function Badge({ children, color = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorMap[color]}`}>
      {children}
    </span>
  )
}
