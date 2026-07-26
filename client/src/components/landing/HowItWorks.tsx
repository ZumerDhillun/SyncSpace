const steps = [
  {
    n: '01',
    title: 'Create a Room',
    desc: 'Pick a language, paste in a problem, set a difficulty and expiry — ready in seconds.',
  },
  {
    n: '02',
    title: 'Share the Link',
    desc: 'Send your partner the room code. No sign-up friction, no installs, just a browser tab.',
  },
  {
    n: '03',
    title: 'Code Together',
    desc: 'Write, run, and discuss code live with synced cursors, chat, and AI hints on demand.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
        <p className="mt-3 text-slate-400">Three steps between you and a shared editor.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.n} className="relative">
            <div className="font-display text-5xl font-bold text-base-700">{step.n}</div>
            <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.desc}</p>
            {i < steps.length - 1 && (
              <div className="absolute right-[-1rem] top-6 hidden h-px w-8 bg-base-border md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
