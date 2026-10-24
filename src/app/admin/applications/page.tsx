import { prisma } from '@/lib/prisma'
import { buildApplicationWhere } from '@/lib/admin-query'
import FiltersBar from '@/components/admin/FiltersBar'
import ApplicationsTable from '@/components/admin/ApplicationsTable'

const PAGE_SIZE = 25

// Live, auth-gated admin data - never prerendered/cached.
export const instant = false

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const resolvedParams = await searchParams
  const urlSearchParams = new URLSearchParams(
    Object.entries(resolvedParams).filter((entry): entry is [string, string] => !!entry[1])
  )
  const where = buildApplicationWhere(urlSearchParams)
  const page = Math.max(1, Number(resolvedParams.page) || 1)

  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true, fullName: true, email: true, collegeName: true,
        primaryPortfolio: true, status: true, emailStatus: true, submittedAt: true,
      },
    }),
    prisma.application.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--beacon-navy)]">Applications</h1>
          <p className="text-sm text-[var(--text-muted)]">{total} total application{total === 1 ? '' : 's'}</p>
        </div>
      </div>

      <div className="mb-5">
        <FiltersBar />
      </div>

      <ApplicationsTable items={items} />

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <a
              key={p}
              href={`?${new URLSearchParams({ ...resolvedParams, page: String(p) } as Record<string, string>).toString()}`}
              className={`rounded-lg px-3 py-1.5 font-medium ${
                p === page ? 'bg-[var(--beacon-teal)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--background)]'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
