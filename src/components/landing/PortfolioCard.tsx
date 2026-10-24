import { CheckCircle2 } from 'lucide-react'
import type { PortfolioDefinition } from '@/lib/config/portfolios'

export default function PortfolioCard({
  portfolio,
  isSelected,
  onChoose,
}: {
  portfolio: PortfolioDefinition
  isSelected: boolean
  onChoose: () => void
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border bg-[var(--surface)] p-6 shadow-sm transition ${
        isSelected ? 'border-[var(--beacon-teal)] ring-2 ring-[var(--beacon-teal)]/30' : 'border-[var(--border)]'
      }`}
    >
      <h3 className="text-lg font-bold text-[var(--beacon-navy)]">{portfolio.title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{portfolio.description}</p>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Responsibilities</p>
        <ul className="mt-2 space-y-1.5">
          {portfolio.responsibilities.map(item => (
            <li key={item} className="flex gap-2 text-sm text-[var(--text)]">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--beacon-teal)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Learning Outcomes</p>
        <ul className="mt-2 space-y-1.5">
          {portfolio.learningOutcomes.map(item => (
            <li key={item} className="flex gap-2 text-sm text-[var(--text)]">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--beacon-cyan)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onChoose}
        className={`mt-6 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
          isSelected
            ? 'bg-[var(--beacon-teal)] text-white'
            : 'border border-[var(--beacon-teal)] text-[var(--beacon-teal)] hover:bg-[var(--beacon-teal)]/10'
        }`}
      >
        {isSelected ? <CheckCircle2 size={16} /> : null}
        {isSelected ? 'Selected as Primary' : 'Choose This Portfolio'}
      </button>
    </div>
  )
}
