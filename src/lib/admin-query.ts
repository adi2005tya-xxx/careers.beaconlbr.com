import type { Prisma } from '../generated/prisma/client'
import { ApplicationStatus, Portfolio } from '../generated/prisma/enums'

const APPLICATION_STATUS_VALUES: string[] = Object.values(ApplicationStatus)
const PORTFOLIO_VALUES: string[] = Object.values(Portfolio)

// Shared by the admin list page and the CSV export, so the exported rows
// always match whatever the admin was actually looking at when they
// clicked Export - same filters, same search, just no pagination limit.
export function buildApplicationWhere(searchParams: URLSearchParams): Prisma.ApplicationWhereInput {
  const q = searchParams.get('q')?.trim()
  const status = searchParams.get('status')?.trim()
  const portfolio = searchParams.get('portfolio')?.trim()

  const where: Prisma.ApplicationWhereInput = {}

  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { collegeName: { contains: q, mode: 'insensitive' } },
    ]
  }

  if (status && APPLICATION_STATUS_VALUES.includes(status)) {
    where.status = status as ApplicationStatus
  }

  if (portfolio && PORTFOLIO_VALUES.includes(portfolio)) {
    where.primaryPortfolio = portfolio as Portfolio
  }

  return where
}
