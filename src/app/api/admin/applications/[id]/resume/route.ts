import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSignedResumeUrl } from '@/lib/blob'

// Gated by middleware (admin-only). Mints a fresh ~90-second signed URL on
// every call - nothing about the resume is ever cached or stored as a
// reusable link anywhere.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await params
  const application = await prisma.application.findUnique({
    where: { id },
    select: { resumeBlobPath: true },
  })

  if (!application) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  try {
    const signedUrl = await getSignedResumeUrl(application.resumeBlobPath)
    return NextResponse.redirect(signedUrl)
  } catch (err) {
    console.error('Failed to sign resume URL for application', id, err)
    return NextResponse.json({ error: 'RESUME_UNAVAILABLE' }, { status: 502 })
  }
}
