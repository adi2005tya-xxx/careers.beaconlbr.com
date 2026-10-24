import { NextResponse } from 'next/server'
import { verifyAdminCredentials, issueAdminSessionCookie } from '@/lib/admin-auth'

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const valid = await verifyAdminCredentials(email, password)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  await issueAdminSessionCookie()
  return NextResponse.json({ status: 'ok' })
}
