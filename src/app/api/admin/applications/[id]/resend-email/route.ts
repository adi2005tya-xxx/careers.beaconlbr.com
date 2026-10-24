import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendApplicationConfirmation } from '@/lib/mail'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await params
  const application = await prisma.application.findUnique({
    where: { id },
    select: { fullName: true, email: true },
  })

  if (!application) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  try {
    await sendApplicationConfirmation({ applicantName: application.fullName, applicantEmail: application.email })
    await prisma.application.update({
      where: { id },
      data: { emailStatus: 'SENT', emailSentAt: new Date(), emailError: null },
    })
    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('Manual resend failed for application', id, err)
    await prisma.application.update({
      where: { id },
      data: { emailStatus: 'FAILED', emailError: err instanceof Error ? err.message : String(err) },
    })
    return NextResponse.json({ error: 'SEND_FAILED' }, { status: 502 })
  }
}
