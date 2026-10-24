import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { signUserId, verifySignedUserId, safeEqual } from './session-token'

export const ADMIN_COOKIE_NAME = 'admin_session'

// v1 is deliberately a single admin identity via env credentials, not an
// AdminUser table - this is a small recruitment drive, not a multi-admin
// CRM. The sentinel id/version exist only so the same signed-cookie scheme
// as the main Beacon app can be reused verbatim (it's built around
// `${id}:${version}`), not because there's a real user row behind them.
const ADMIN_SENTINEL_ID = 'ADMIN'
const ADMIN_SENTINEL_VERSION = 0

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const configuredEmail = process.env.ADMIN_EMAIL
  const configuredHash = process.env.ADMIN_PASSWORD_HASH
  if (!configuredEmail || !configuredHash) return false

  // Compare email case-insensitively but in constant time, same reasoning
  // as the password hash check - an admin login form is a credential check,
  // worth treating as carefully as the password itself.
  const emailMatches = safeEqual(email.trim().toLowerCase(), configuredEmail.trim().toLowerCase())
  if (!emailMatches) {
    // Still run a bcrypt compare against something even on an email
    // mismatch, so the response time doesn't leak whether the email was
    // right - bcrypt.compare is already far slower than the string
    // comparison above, which dominates the timing anyway in practice, but
    // this keeps the control flow uniform rather than short-circuiting.
    await bcrypt.compare(password, configuredHash)
    return false
  }

  return bcrypt.compare(password, configuredHash)
}

export async function issueAdminSessionCookie(): Promise<void> {
  const token = await signUserId(ADMIN_SENTINEL_ID, ADMIN_SENTINEL_VERSION)
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const parsed = await verifySignedUserId(token)
  if (!parsed) return false
  return parsed.id === ADMIN_SENTINEL_ID && parsed.version === ADMIN_SENTINEL_VERSION
}
