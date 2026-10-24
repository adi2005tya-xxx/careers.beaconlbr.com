'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail } from 'lucide-react'

const STATUS_OPTIONS = [
  ['SUBMITTED', 'Submitted'],
  ['UNDER_REVIEW', 'Under Review'],
  ['SHORTLISTED', 'Shortlisted'],
  ['INTERVIEW', 'Interview'],
  ['SELECTED', 'Selected'],
  ['REJECTED', 'Rejected'],
]

export function StatusSelect({ applicationId, currentStatus }: { applicationId: string; currentStatus: string }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  const handleChange = async (next: string) => {
    setStatus(next)
    setSaving(true)
    await fetch(`/api/admin/applications/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={e => handleChange(e.target.value)}
        disabled={saving}
        className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold outline-none focus:border-[var(--beacon-teal)]"
      >
        {STATUS_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {saving && <Loader2 size={14} className="animate-spin text-[var(--text-muted)]" />}
    </div>
  )
}

export function ResendEmailButton({ applicationId }: { applicationId: string }) {
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<'idle' | 'sent' | 'failed'>('idle')

  const handleResend = async () => {
    setSending(true)
    setResult('idle')
    const res = await fetch(`/api/admin/applications/${applicationId}/resend-email`, { method: 'POST' })
    setResult(res.ok ? 'sent' : 'failed')
    setSending(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleResend}
        disabled={sending}
        className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
      >
        {sending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
        Resend confirmation email
      </button>
      {result === 'sent' && <span className="text-xs font-medium text-emerald-600">Sent</span>}
      {result === 'failed' && <span className="text-xs font-medium text-red-600">Failed again</span>}
    </div>
  )
}
