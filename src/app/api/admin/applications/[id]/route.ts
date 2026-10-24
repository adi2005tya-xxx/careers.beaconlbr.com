import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { statusUpdateSchema } from '@/lib/validation/application'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await params
  const application = await prisma.application.findUnique({
    where: { id },
    // resumeBlobPath intentionally included here - the admin detail page
    // itself doesn't render it as a link, it only calls the dedicated
    // resume route below, which is the one place a signed URL ever gets
    // minted. Still never a public URL on its own.
  })
  if (!application) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }
  return NextResponse.json(application)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = statusUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 400 })
  }

  try {
    const application = await prisma.application.update({
      where: { id },
      data: { status: parsed.data.status },
    })
    return NextResponse.json(application)
  } catch {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }
}
