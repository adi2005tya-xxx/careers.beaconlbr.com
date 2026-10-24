import { NextRequest, NextResponse } from 'next/server'
import { verifySignedUserId } from '@/lib/session-token'
import { ADMIN_COOKIE_NAME } from '@/lib/admin-auth'

const ADMIN_SENTINEL_ID = 'ADMIN'
const ADMIN_SENTINEL_VERSION = 0

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /api/admin/login must stay reachable without a valid cookie - that's
  // the one request that creates the cookie. Gating it here would make
  // logging in impossible for anyone who isn't already logged in.
  const isApiRoute = pathname.startsWith('/api/admin') && pathname !== '/api/admin/login'
  const isPageRoute = pathname.startsWith('/admin') && pathname !== '/admin/login'

  if (!isApiRoute && !isPageRoute) return NextResponse.next()

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  const parsed = await verifySignedUserId(token)
  const authenticated = !!parsed && parsed.id === ADMIN_SENTINEL_ID && parsed.version === ADMIN_SENTINEL_VERSION

  if (authenticated) return NextResponse.next()

  if (isApiRoute) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const loginUrl = new URL('/admin/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
