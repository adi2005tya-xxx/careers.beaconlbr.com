import { notFound } from 'next/navigation'
import { AlertTriangle, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getPortfolio } from '@/lib/config/portfolios'
import { StatusSelect, ResendEmailButton } from '@/components/admin/ApplicationActions'

// Live, auth-gated admin data - never prerendered/cached.
export const instant = false

function formatDate(d: Date) {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const application = await prisma.application.findUnique({ where: { id } })
  if (!application) notFound()

  return (
    <div>
      <Link href="/admin/applications" className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--beacon-navy)]">
        <ArrowLeft size={15} />
        Back to Applications
      </Link>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[var(--beacon-navy)]">{application.fullName}</h1>
            <p className="text-sm text-[var(--text-muted)]">{application.email} &middot; {application.mobile}</p>
          </div>
          <StatusSelect applicationId={application.id} currentStatus={application.status} />
        </div>

        {application.emailStatus === 'FAILED' && (
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-sm text-amber-800">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Confirmation email failed to send</p>
                {application.emailError && <p className="mt-0.5 text-xs text-amber-700">{application.emailError}</p>}
              </div>
            </div>
            <ResendEmailButton applicationId={application.id} />
          </div>
        )}

        <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Detail label="College" value={application.collegeName} />
          <Detail label="Year of Study / Branch" value={`${application.yearOfStudy.replace('_', ' ')} — ${application.degreeBranch}`} />
          <Detail label="Primary Portfolio" value={getPortfolio(application.primaryPortfolio)?.title || application.primaryPortfolio} />
          <Detail label="Secondary Portfolio" value={application.secondaryPortfolio ? (getPortfolio(application.secondaryPortfolio)?.title || application.secondaryPortfolio) : 'Not specified'} />
          <Detail label="Available From" value={formatDate(application.availableStartDate)} />
          <Detail label="Available Until" value={formatDate(application.availableEndDate)} />
          <Detail label="Submitted" value={formatDate(application.submittedAt)} />
          <Detail label="Confirmation Email" value={application.emailStatus} />
        </dl>

        <div className="mt-6">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Relevant Skills</p>
          <p className="whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--text)]">
            {application.skills}
          </p>
        </div>

        <div className="mt-6">
          {application.resumeBlobPath ? (
            <a
              href={`/api/admin/applications/${application.id}/resume`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--beacon-teal)] px-4 py-2.5 text-sm font-bold text-[var(--beacon-teal)] transition hover:bg-[var(--beacon-teal)]/10"
            >
              <FileText size={16} />
              View Resume ({application.resumeOriginalName})
            </a>
          ) : (
            <p className="text-sm italic text-[var(--text-muted)]">No resume was submitted with this application.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">{label}</dt>
      <dd className="mt-1 text-sm text-[var(--text)]">{value}</dd>
    </div>
  )
}
