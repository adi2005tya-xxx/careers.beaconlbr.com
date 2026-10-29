import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { sendPhase2ShortlistEmail } from '@/lib/mail'

// Admin-gated, one-time batch send for the Phase 2 shortlist - Product &
// Technology track only. Each candidate gets 2 of the 3 technical tasks,
// rotated 1-2 / 2-3 / 3-1 by their position in the list (ordered by
// submittedAt desc, same order the admin list/export already use) so the
// workload stays spread out. Safe to re-trigger: anyone with
// phase2EmailSentAt already set is skipped, so a partial failure (e.g. one
// bad email address) can be retried without re-emailing everyone else.
export const maxDuration = 60

type Phase2TaskId = 1 | 2 | 3
const ROTATION: [Phase2TaskId, Phase2TaskId][] = [[1, 2], [2, 3], [3, 1]]

export async function GET(): Promise<NextResponse> {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const applicants = await prisma.application.findMany({
    where: { primaryPortfolio: 'PRODUCT_TECHNOLOGY' },
    orderBy: { submittedAt: 'desc' },
    select: { id: true, fullName: true, email: true, phase2EmailSentAt: true },
  })

  const results: { name: string; email: string; status: 'sent' | 'skipped' | 'failed'; detail?: string }[] = []

  for (let i = 0; i < applicants.length; i++) {
    const a = applicants[i]
    const taskIds = ROTATION[i % 3]

    if (a.phase2EmailSentAt) {
      results.push({ name: a.fullName, email: a.email, status: 'skipped', detail: 'already sent' })
      continue
    }

    try {
      await sendPhase2ShortlistEmail({ applicantName: a.fullName, applicantEmail: a.email, taskIds })
      await prisma.application.update({
        where: { id: a.id },
        data: { phase2EmailSentAt: new Date(), phase2TaskIds: taskIds.join(',') },
      })
      results.push({ name: a.fullName, email: a.email, status: 'sent', detail: `Task ${taskIds[0]} or ${taskIds[1]}` })
    } catch (err) {
      console.error('Phase 2 email failed for', a.email, err)
      results.push({ name: a.fullName, email: a.email, status: 'failed', detail: err instanceof Error ? err.message : 'unknown error' })
    }
  }

  const sent = results.filter(r => r.status === 'sent').length
  const skipped = results.filter(r => r.status === 'skipped').length
  const failed = results.filter(r => r.status === 'failed').length

  return NextResponse.json({ total: applicants.length, sent, skipped, failed, results })
}
