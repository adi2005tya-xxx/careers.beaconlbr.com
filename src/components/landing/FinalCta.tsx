import Reveal from './Reveal'

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[var(--beacon-navy)] px-6 py-24 text-center text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--beacon-teal)]/20 blur-[130px]" />
      </div>
      <Reveal className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to Make This Winter Count?</h2>
        <p className="mt-4 text-base text-white/80 sm:text-lg">
          Learn by doing. Build practical skills. Be part of Beacon&apos;s journey.
        </p>
        <a
          href="#apply"
          className="mt-9 inline-block rounded-xl bg-[var(--beacon-teal)] px-9 py-3.5 text-base font-bold text-white shadow-[0_12px_30px_-8px_rgba(0,151,166,0.6)] transition hover:-translate-y-0.5 hover:bg-[var(--beacon-cyan)] hover:shadow-[0_16px_36px_-8px_rgba(0,166,184,0.7)]"
        >
          Register Now
        </a>
      </Reveal>
    </section>
  )
}
