import { NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { ALLOWED_RESUME_CONTENT_TYPES, MAX_RESUME_SIZE_BYTES } from '@/lib/validation/application'

// This is the server-side half of the direct browser-to-Blob upload flow:
// the client calls @vercel/blob/client's upload(), which itself POSTs here
// first to get a short-lived, single-use token before it ever touches the
// Blob store. The actual file bytes never pass through this route (or any
// Next.js function body) - only this small JSON handshake does, which is
// exactly why a 5MB PDF doesn't run into Vercel's ~4.5MB function body cap.
//
// The MIME allowlist + size ceiling below are enforced by Vercel Blob
// itself at upload time, not just trusted from the client - a tampered
// client request still can't push a non-PDF or oversized file into the
// store. Same allowlist-not-blocklist approach the main Beacon app uses for
// its own document uploads, after learning the hard way that accepting
// anything not explicitly blocked (e.g. text/html, image/svg+xml) is an
// XSS risk once that file is later opened.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Access level ('private') is specified by our own client-side
        // upload() call, not by this hook - the SDK doesn't accept it here.
        // See ResumeUploadField.tsx, where it's a hardcoded literal, never
        // derived from anything user-controllable.
        return {
          allowedContentTypes: ALLOWED_RESUME_CONTENT_TYPES,
          maximumSizeInBytes: MAX_RESUME_SIZE_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60 * 1000, // 10 minutes to complete the upload
          tokenPayload: JSON.stringify({ pathname }),
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (err) {
    console.error('Resume upload token generation failed', err)
    return NextResponse.json({ error: 'UPLOAD_TOKEN_FAILED' }, { status: 400 })
  }
}
