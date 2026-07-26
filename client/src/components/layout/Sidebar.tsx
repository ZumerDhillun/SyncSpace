import { NavLink } from 'react-router-dom'
import { LayoutDashboard, History, Settings, LogOut, Plus, Zap } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'

interface SidebarProps {
  onNewRoom: () => void
}

export function Sidebar({ onNewRoom }: SidebarProps) {
  const user = useAuthStore((s) => s.user)
  const { logout } = useAuth()

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/history', label: 'History', icon: History },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-base-border bg-base-900/60 px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-gradient">
          <Zap size={18} className="text-white" fill="white" />
        </div>
        <span className="font-display text-lg font-semibold text-white">SyncSpace</span>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-xl border border-base-border bg-base-800/50 px-3 py-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: user?.avatarColor || '#7C6CF6' }}
        >
          {user?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{user?.name}</p>
          <p className="truncate text-xs text-slate-400">{user?.email}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-signal-500/15 text-signal-400'
                  : 'text-slate-400 hover:bg-base-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button onClick={onNewRoom} className="btn-primary mb-3 w-full">
        <Plus size={18} /> New Room
      </button>

      <button
        onClick={logout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-base-800 hover:text-rose"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  )
}
