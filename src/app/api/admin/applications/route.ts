import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { buildApplicationWhere } from '@/lib/admin-query'

const PAGE_SIZE = 25

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const where = buildApplicationWhere(searchParams)
  const page = Math.max(1, Number(searchParams.get('page')) || 1)

  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        fullName: true,
        email: true,
        mobile: true,
        collegeName: true,
        primaryPortfolio: true,
        status: true,
        emailStatus: true,
        submittedAt: true,
      },
    }),
    prisma.application.count({ where }),
  ])

  return NextResponse.json({ items, total, page, pageSize: PAGE_SIZE })
}
