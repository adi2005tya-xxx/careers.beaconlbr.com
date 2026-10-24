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
  'availableEndDate', 'skills', 'status', 'emailStatus',
] as const

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const where = buildApplicationWhere(searchParams)

  const applications = await prisma.application.findMany({
    where,
    orderBy: { submittedAt: 'desc' },
    select: {
      id: true, submittedAt: true, fullName: true, email: true, mobile: true,
      collegeName: true, yearOfStudy: true, degreeBranch: true, primaryPortfolio: true,
      secondaryPortfolio: true, availableStartDate: true, availableEndDate: true,
      skills: true, status: true, emailStatus: true,
      // Deliberately not selected: resumeBlobPath - never belongs in an
      // export, same reasoning as never putting a public resume link in a
      // spreadsheet.
    },
  })

  const rows = [
    COLUMNS.join(','),
    ...applications.map(app =>
      COLUMNS.map(col => csvField(app[col as keyof typeof app])).join(',')
    ),
  ]

  return new NextResponse(rows.join('\r\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="beacon-internship-applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
