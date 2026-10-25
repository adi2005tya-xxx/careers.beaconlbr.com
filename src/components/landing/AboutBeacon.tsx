import { ArrowUpRight, Sparkles } from 'lucide-react'
import Reveal from './Reveal'

const STATS: [string, string][] = [
  ['50+', 'Planners Onboarded'],
  ['100+', 'Packages Live'],
  ['All Types', 'Trekking to International'],
]

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
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--beacon-teal)]/25 bg-[var(--beacon-teal)]/8 px-4 py-1.5">
            <Sparkles size={14} className="text-[var(--beacon-teal)]" />
            <span className="text-xs font-bold uppercase tracking-wide text-[var(--beacon-teal)]">
              India&apos;s First Travel Marketplace
            </span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mx-auto mt-8 h-px w-16 bg-gradient-to-r from-[var(--beacon-teal)] to-[var(--beacon-cyan)]" />
          <p className="mt-8 text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            Beacon is India&apos;s first dedicated marketplace for touring experiences &mdash;
            connecting travellers directly with trusted travel planners, and helping travel
            businesses showcase and manage their packages through digital tools.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-6 transition hover:border-[var(--beacon-teal)]/30"
              >
                <p className="text-2xl font-extrabold text-[var(--beacon-navy)] sm:text-3xl">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            At Beacon, we believe in learning through practical work, solving real problems and
            building products that create value. Join us to experience the journey of an
            early-stage startup and contribute to its growth.
          </p>

          <a
            href="https://beaconlbr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--beacon-teal)] transition hover:text-[var(--beacon-cyan)]"
          >
            Visit beaconlbr.com
            <ArrowUpRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
