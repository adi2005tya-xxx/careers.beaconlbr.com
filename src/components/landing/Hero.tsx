export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--beacon-navy)] to-[var(--beacon-blue)] px-6 py-20 text-white sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--beacon-cyan)]">
          <span>Beacon</span>
          <span className="text-white/40">&middot;</span>
          <span>Life Beyond Routine</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Winter Internships at Beacon
        </h1>

        <p className="mt-5 text-lg font-medium text-[var(--beacon-cyan)] sm:text-xl">
          Your Winter. Your Growth. Your Next Step.
        </p>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
          Turn your winter break into a practical learning experience. Work on real projects,
          explore how a startup operates, develop valuable skills and contribute to building a
          travel-tech platform.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#opportunities"
            className="w-full rounded-xl bg-[var(--beacon-teal)] px-8 py-3.5 text-center text-base font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[var(--beacon-cyan)] sm:w-auto"
          >
            Explore Opportunities
          </a>
          <a
            href="#apply"
            className="w-full rounded-xl border-2 border-white/30 px-8 py-3.5 text-center text-base font-bold text-white transition hover:bg-white/10 sm:w-auto"
          >
            Register Now
          </a>
        </div>
      </div>
    </section>
  )
}
