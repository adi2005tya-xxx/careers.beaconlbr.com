import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { sendPhase2ReminderEmail } from '@/lib/mail'

// Admin-gated, one-time follow-up nudge for everyone who already received
// the Phase 2 shortlist email (phase2EmailSentAt set) and hasn't already
// gotten this reminder. Excludes candidates who confirmed they already
// submitted - the admin doesn't track submissions in-app (they come in via
// email/WhatsApp directly), so this list is maintained by hand here rather
// than derived from any "submitted" flag that doesn't exist.
export const maxDuration = 60

// Already confirmed submitted as of 2026-10-30 - update this list directly
// if more candidates confirm before a future run.
const ALREADY_SUBMITTED_EMAILS = new Set([
  'rachanap3978@gmail.com', // Rachana Patil
  'harishbodkhe8805@gmail.com', // Harish Bodkhe
])

export async function GET(): Promise<NextResponse> {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const applicants = await prisma.application.findMany({
    where: { primaryPortfolio: 'PRODUCT_TECHNOLOGY', phase2EmailSentAt: { not: null } },
    orderBy: { submittedAt: 'desc' },
    select: { id: true, fullName: true, email: true, phase2ReminderSentAt: true },
  })

  const results: { name: string; email: string; status: 'sent' | 'skipped' | 'failed'; detail?: string }[] = []

  for (const a of applicants) {
    if (ALREADY_SUBMITTED_EMAILS.has(a.email.toLowerCase())) {
      results.push({ name: a.fullName, email: a.email, status: 'skipped', detail: 'already submitted' })
      continue
    }
    if (a.phase2ReminderSentAt) {
      results.push({ name: a.fullName, email: a.email, status: 'skipped', detail: 'reminder already sent' })
      continue
    }

    try {
      await sendPhase2ReminderEmail({ applicantName: a.fullName, applicantEmail: a.email })
      await prisma.application.update({ where: { id: a.id }, data: { phase2ReminderSentAt: new Date() } })
      results.push({ name: a.fullName, email: a.email, status: 'sent' })
    } catch (err) {
      console.error('Phase 2 reminder failed for', a.email, err)
      results.push({ name: a.fullName, email: a.email, status: 'failed', detail: err instanceof Error ? err.message : 'unknown error' })
    }
  }

  const sent = results.filter(r => r.status === 'sent').length
  const skipped = results.filter(r => r.status === 'skipped').length
  const failed = results.filter(r => r.status === 'failed').length

  return NextResponse.json({ total: applicants.length, sent, skipped, failed, results })
}
