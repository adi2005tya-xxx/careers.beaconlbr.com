'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Download, Search } from 'lucide-react'
import { PORTFOLIOS } from '@/lib/config/portfolios'

const STATUS_OPTIONS = [
  ['', 'All Statuses'],
  ['SUBMITTED', 'Submitted'],
  ['UNDER_REVIEW', 'Under Review'],
  ['SHORTLISTED', 'Shortlisted'],
  ['INTERVIEW', 'Interview'],
  ['SELECTED', 'Selected'],
  ['REJECTED', 'Rejected'],
]

export default function FiltersBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  const exportHref = `/api/admin/applications/export?${searchParams.toString()}`

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search name, email, college"
            defaultValue={searchParams.get('q') || ''}
            onChange={e => updateParam('q', e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--beacon-teal)]"
          />
        </div>
        <select
          defaultValue={searchParams.get('status') || ''}
          onChange={e => updateParam('status', e.target.value)}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--beacon-teal)]"
        >
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          defaultValue={searchParams.get('portfolio') || ''}
          onChange={e => updateParam('portfolio', e.target.value)}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--beacon-teal)]"
        >
          <option value="">All Portfolios</option>
          {PORTFOLIOS.map(p => (
            <option key={p.key} value={p.key}>{p.title}</option>
          ))}
        </select>
      </div>
      <a
        href={exportHref}
        className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--beacon-navy)] transition hover:bg-[var(--background)]"
      >
        <Download size={15} />
        Export CSV
      </a>
    </div>
  )
}
