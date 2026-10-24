import { PROGRAM_INFO } from '@/lib/config/program'

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
    <section className="bg-[var(--surface)] px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-extrabold text-[var(--beacon-navy)] sm:text-3xl">
          Internship Information
        </h2>
        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--border)]">
          {ROWS.map(([label, value], idx) => (
            <div
              key={label}
              className={`flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${
                idx % 2 === 0 ? 'bg-[var(--background)]' : 'bg-[var(--surface)]'
              }`}
            >
              <span className="text-sm font-semibold text-[var(--beacon-navy)]">{label}</span>
              <span className="text-sm text-[var(--text-muted)]">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
