import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass-card group p-6 transition-transform hover:-translate-y-1">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-signal-500/15 text-signal-400 transition-colors group-hover:bg-signal-gradient group-hover:text-white">
        <Icon size={22} />
      </div>
      <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </div>
  )
}
