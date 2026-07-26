import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-signal-gradient">
        <Zap size={26} className="text-white" fill="white" />
      </div>
      <h1 className="font-display text-3xl font-bold text-white">Room not found or expired</h1>
      <p className="max-w-sm text-slate-400">
        The page or room you're looking for doesn't exist, has expired, or the link is incorrect.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" className="mt-2">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  )
}
