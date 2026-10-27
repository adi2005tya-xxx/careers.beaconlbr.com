import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { buildApplicationWhere } from '@/lib/admin-query'

function csvField(value: unknown): string {
  const str = value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? '')
  // Quote any field that could otherwise break column alignment, doubling
  // internal quotes per the standard CSV escaping rule.
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

const COLUMNS = [
  'id', 'submittedAt', 'fullName', 'email', 'mobile', 'collegeName', 'yearOfStudy',
  'degreeBranch', 'primaryPortfolio', 'secondaryPortfolio', 'availableStartDate',
  'availableEndDate', 'skills', 'status', 'emailStatus', 'resumeLink',
] as const

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const where = buildApplicationWhere(searchParams)
  const origin = new URL(request.url).origin

  const applications = await prisma.application.findMany({
    where,
    orderBy: { submittedAt: 'desc' },
    select: {
      id: true, submittedAt: true, fullName: true, email: true, mobile: true,
      collegeName: true, yearOfStudy: true, degreeBranch: true, primaryPortfolio: true,
      secondaryPortfolio: true, availableStartDate: true, availableEndDate: true,
      skills: true, status: true, emailStatus: true, resumeBlobPath: true,
      // The raw blob path itself is never put in the export - only a link
      // to our own admin-gated route, which mints a short-lived signed URL
      // at the moment it's opened. Opening it without an authenticated
      // admin session just redirects to login, so the CSV stays safe to
      // store/share internally even though it now carries a resume link.
    },
  })

  const rows = [
    COLUMNS.join(','),
    ...applications.map(app => {
      const resumeLink = app.resumeBlobPath ? `${origin}/api/admin/applications/${app.id}/resume` : ''
      return COLUMNS.map(col =>
        col === 'resumeLink' ? csvField(resumeLink) : csvField(app[col as keyof typeof app])
      ).join(',')
    }),
  ]

  return new NextResponse(rows.join('\r\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="beacon-internship-applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
