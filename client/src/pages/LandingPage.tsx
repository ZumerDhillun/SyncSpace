import { Zap, Sparkles, PlayCircle, MessageSquare, History, Globe } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/landing/Hero'
import { FeatureCard } from '@/components/landing/FeatureCard'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Footer } from '@/components/landing/Footer'

const features = [
  { icon: Zap, title: 'Real-Time Collaboration', desc: 'Every keystroke synced instantly via CRDT — no lag, no conflicts, ever.' },
  { icon: Sparkles, title: 'AI-Powered Hints', desc: 'Stuck on a problem? Get a targeted nudge without spoiling the solution.' },
  { icon: PlayCircle, title: 'Instant Code Execution', desc: 'Run code in 7+ languages and see results together, in real time.' },
  { icon: MessageSquare, title: 'Live Chat', desc: 'Talk through your approach without leaving the editor.' },
  { icon: History, title: 'Session History', desc: 'Every closed room is saved so you can review past attempts.' },
  { icon: Globe, title: 'No Installation Required', desc: 'Runs entirely in the browser. Share a link and start coding.' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <section id="features" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to practice together</h2>
          <p className="mt-3 text-slate-400">Built for the way real interviews actually feel.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.desc} />
          ))}
        </div>
      </section>
      <HowItWorks />
      <Footer />
    </div>
  )
}
