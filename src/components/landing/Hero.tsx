import Image from 'next/image'
import FlightPath from './FlightPath'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--beacon-navy)] px-6 py-24 text-white sm:py-32">
      {/* Layered soft glows - depth without a loud gradient sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[var(--beacon-teal)]/25 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-20%] h-[420px] w-[420px] rounded-full bg-[var(--beacon-cyan)]/15 blur-[110px]" />
        <FlightPath />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--beacon-navy)]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-10 flex justify-center">
          <div className="rounded-2xl bg-white px-6 py-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
            <Image src="/beacon-logo.png" alt="Beacon — Life Beyond Routine" width={300} height={300} className="h-24 w-24 object-contain sm:h-28 sm:w-28" priority />
          </div>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
          Winter Internships<br className="hidden sm:block" /> at Beacon
        </h1>

        <p className="mt-6 text-lg font-medium tracking-wide text-[var(--beacon-cyan)] sm:text-xl">
          Your Winter. Your Growth. Your Next Step.
        </p>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          Turn your winter break into a practical learning experience. Work on real projects,
          explore how a startup operates, develop valuable skills and contribute to building a
          travel-tech platform.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#opportunities"
            className="w-full rounded-xl bg-[var(--beacon-teal)] px-8 py-3.5 text-center text-base font-bold text-white shadow-[0_12px_30px_-8px_rgba(0,151,166,0.6)] transition hover:-translate-y-0.5 hover:bg-[var(--beacon-cyan)] hover:shadow-[0_16px_36px_-8px_rgba(0,166,184,0.7)] sm:w-auto"
          >
            Explore Opportunities
          </a>
          <a
            href="#apply"
            className="w-full rounded-xl border border-white/25 bg-white/5 px-8 py-3.5 text-center text-base font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 sm:w-auto"
          >
            Register Now
          </a>
        </div>
      </div>
    </section>
  )
}
