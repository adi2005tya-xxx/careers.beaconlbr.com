// HMAC-SHA256 signed token via Web Crypto (not Node's `crypto`) so this
// also works in edge middleware. Format: `${id}:${version}.${hexSignature}`.
// `version` lets a single stored value (bumped on password change) instantly
// invalidate every previously issued cookie without a session table.

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not set.')
  }
  return secret
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function signUserId(id: string, version: number): Promise<string> {
  const payload = `${id}:${version}`
  const key = await hmacKey(getSecret())
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return `${payload}.${toHex(signature)}`
}

export async function verifySignedUserId(token: string | undefined | null): Promise<{ id: string; version: number } | null> {
  if (!token) return null
  const dotIndex = token.lastIndexOf('.')
  if (dotIndex === -1) return null

  const payload = token.slice(0, dotIndex)
  const signatureHex = token.slice(dotIndex + 1)

  const key = await hmacKey(getSecret())
  const expectedSignature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  const expectedHex = toHex(expectedSignature)

  if (!safeEqual(signatureHex, expectedHex)) return null

  const colonIndex = payload.lastIndexOf(':')
  if (colonIndex === -1) return null
  const id = payload.slice(0, colonIndex)
  const version = Number(payload.slice(colonIndex + 1))
  if (!id || Number.isNaN(version)) return null

  return { id, version }
}

// Constant-time string comparison - a naive `===` leaks timing information
// proportional to how many leading characters match, which is enough for a
// timing attack against a signature check.
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}
