import { issueSignedToken, presignUrl } from '@vercel/blob'

// Mints a short-lived, single-use signed URL for an admin to view one
// resume. Never called from any public code path - only from the
// admin-gated GET /api/admin/applications/[id]/resume route, and only at
// the moment an authenticated admin actually clicks "View Resume". The raw
// blob pathname is stored in the database, but a browsable URL to it only
// ever exists for the ~90 seconds after this is called.
export async function getSignedResumeUrl(resumeBlobPath: string): Promise<string> {
  const validUntil = Date.now() + 90_000

  const signedToken = await issueSignedToken({
    pathname: resumeBlobPath,
    operations: ['get'],
    validUntil,
  })

  const { presignedUrl } = await presignUrl(signedToken, {
    operation: 'get',
    pathname: resumeBlobPath,
    validUntil,
    access: 'private',
  })

  return presignedUrl
}
