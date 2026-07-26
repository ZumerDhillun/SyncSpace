import { Github, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-base-border/60 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} SyncSpace. Built for interview practice.</p>
        <div className="flex items-center gap-5">
          <a href="#" className="flex items-center gap-1.5 transition-colors hover:text-white">
            <Github size={16} /> GitHub
          </a>
          <a href="mailto:hello@syncspace.dev" className="flex items-center gap-1.5 transition-colors hover:text-white">
            <Mail size={16} /> Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
