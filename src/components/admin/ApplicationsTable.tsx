import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { getPortfolio } from '@/lib/config/portfolios'

interface Row {
  id: string
  fullName: string
  email: string
  collegeName: string
  primaryPortfolio: string
  status: string
  emailStatus: string
  submittedAt: string | Date
}

export default function ApplicationsTable({ items }: { items: Row[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center text-sm text-[var(--text-muted)]">
        No applications match these filters.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--background)] text-left text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
            <th className="px-4 py-3">Applicant</th>
            <th className="px-4 py-3">College</th>
            <th className="px-4 py-3">Portfolio</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map(app => (
            <tr key={app.id} className="border-b border-[var(--border)] last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                  {app.fullName}
                  {app.emailStatus === 'FAILED' && (
                    <AlertTriangle size={14} className="text-amber-500" aria-label="Confirmation email failed" />
                  )}
                </div>
                <div className="text-xs text-[var(--text-muted)]">{app.email}</div>
              </td>
              <td className="px-4 py-3 text-[var(--text-muted)]">{app.collegeName}</td>
              <td className="px-4 py-3 text-[var(--text-muted)]">{getPortfolio(app.primaryPortfolio as never)?.title || app.primaryPortfolio}</td>
              <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
              <td className="px-4 py-3 text-[var(--text-muted)]">
                {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/admin/applications/${app.id}`} className="text-sm font-semibold text-[var(--beacon-teal)] hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
