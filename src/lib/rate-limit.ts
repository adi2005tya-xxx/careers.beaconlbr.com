import { createHash } from 'crypto'
import { prisma } from './prisma'

const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 5

// Hashed, never the raw IP - this value is never displayed or exported,
// only ever used for this count query, but hashing it means a DB leak
// still doesn't hand out a readable IP list.
export function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex')
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

// Not an in-memory counter - a serverless function's memory isn't shared
// across invocations or instances, so an in-memory limiter would silently
// do nothing in production. This counts recent rows in the same table the
// application itself writes to, which is consistent across every instance.
export async function isRateLimited(ipHash: string): Promise<boolean> {
  if (ipHash === hashIp('unknown')) return false // can't meaningfully rate-limit an unknown IP

  const count = await prisma.application.count({
    where: {
      ipHash,
      submittedAt: { gte: new Date(Date.now() - WINDOW_MS) },
    },
  })

  return count >= MAX_SUBMISSIONS_PER_WINDOW
}
