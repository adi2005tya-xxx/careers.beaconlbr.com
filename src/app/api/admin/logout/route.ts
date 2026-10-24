import { NextResponse } from 'next/server'
import { clearAdminSessionCookie } from '@/lib/admin-auth'

export async function POST(): Promise<NextResponse> {
  await clearAdminSessionCookie()
  return NextResponse.json({ status: 'ok' })
}
