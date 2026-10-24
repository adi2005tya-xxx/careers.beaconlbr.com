import { PROGRAM_INFO } from '@/lib/config/program'
import Reveal from './Reveal'

const ROWS: [string, string][] = [
  ['Program Duration', PROGRAM_INFO.duration],
  ['Application Deadline', PROGRAM_INFO.applicationDeadline],
  ['Internship Start Date', PROGRAM_INFO.startDate],
  ['Internship End Date', PROGRAM_INFO.endDate],
  ['Eligibility', PROGRAM_INFO.eligibility],
  ['Working Arrangement', PROGRAM_INFO.workingArrangement],
  ['Stipend', PROGRAM_INFO.stipendStatus],
  ['Certificate Eligibility', PROGRAM_INFO.certificateEligibility],
  ['Incentive Policy', PROGRAM_INFO.incentivePolicy],
]

export default function InternshipInfoSection() {
  return (
    <section className="bg-[var(--background)] px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <span className="block text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--beacon-teal)]">
            Good to Know
          </span>
          <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight text-[var(--beacon-navy)] sm:text-4xl">
            Internship Information
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_48px_-28px_rgba(15,23,42,0.15)]">
            {ROWS.map(([label, value], idx) => (
              <div
                key={label}
                className={`flex flex-col gap-1 px-7 py-5 sm:flex-row sm:items-center sm:justify-between ${
                  idx !== ROWS.length - 1 ? 'border-b border-[var(--border)]' : ''
                }`}
              >
                <span className="text-sm font-semibold text-[var(--beacon-navy)]">{label}</span>
                <span className="text-sm text-[var(--text-muted)]">{value}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
