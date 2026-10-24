import Reveal from './Reveal'

export default function AboutBeacon() {
  return (
    <section className="relative bg-[var(--surface)] px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--beacon-teal)]">
            About Us
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--beacon-navy)] sm:text-4xl">
            Beacon &mdash; Life Beyond Routine
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="mx-auto mt-8 h-px w-16 bg-gradient-to-r from-[var(--beacon-teal)] to-[var(--beacon-cyan)]" />
          <p className="mt-8 text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            Beacon is a travel-tech platform designed to connect travellers with travel planners
            while helping travel businesses showcase and manage their packages through digital
            tools.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            Our aim is to improve how people discover and experience travel while empowering travel
            businesses with better digital experiences.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            At Beacon, we believe in learning through practical work, solving real problems and
            building products that create value. Join us to experience the journey of an
            early-stage startup and contribute to its growth.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
