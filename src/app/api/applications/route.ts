import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { applicationSchema } from '@/lib/validation/application'
import { getClientIp, hashIp, isRateLimited } from '@/lib/rate-limit'
import { sendApplicationConfirmation } from '@/lib/mail'

function fieldErrorsFromZod(err: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of err.issues) {
    const key = issue.path.join('.') || '_root'
    if (!fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return fieldErrors
}

export async function POST(request: Request): Promise<NextResponse> {
  const ip = getClientIp(request)
  const ipHash = hashIp(ip)

  if (await isRateLimited(ipHash)) {
    return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 })
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 })
  }

  const parsed = applicationSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'VALIDATION_ERROR', fieldErrors: fieldErrorsFromZod(parsed.error) },
      { status: 400 }
    )
  }

  // honeypot caught something - a real applicant's form never populates
  // this field (it's hidden). Respond as if it succeeded, so a bot gets no
  // signal that it was filtered rather than accepted, but don't actually
  // write a row for it.
  if (parsed.data.honeypot) {
    return NextResponse.json({ id: 'ok', status: 'ok' }, { status: 201 })
  }

  const data = parsed.data

  // This create is the durability point - everything after it (the
  // confirmation email) must never undo or block on failure.
  const application = await prisma.application.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      collegeName: data.collegeName,
      yearOfStudy: data.yearOfStudy,
      degreeBranch: data.degreeBranch,
      primaryPortfolio: data.primaryPortfolio,
      secondaryPortfolio: data.secondaryPortfolio || null,
      availableStartDate: data.availableStartDate,
      availableEndDate: data.availableEndDate,
      skills: data.skills,
      resumeBlobPath: data.resumeBlobPath,
      resumeOriginalName: data.resumeOriginalName,
      resumeSizeBytes: data.resumeSizeBytes,
      ipHash,
    },
  })

  try {
    await sendApplicationConfirmation({ applicantName: data.fullName, applicantEmail: data.email })
    await prisma.application.update({
      where: { id: application.id },
      data: { emailStatus: 'SENT', emailSentAt: new Date() },
    })
  } catch (err) {
    console.error('Confirmation email failed for application', application.id, err)
    await prisma.application.update({
      where: { id: application.id },
      data: { emailStatus: 'FAILED', emailError: err instanceof Error ? err.message : String(err) },
    })
    // Intentionally still a success response - the application was saved.
  }

  return NextResponse.json({ id: application.id, status: 'ok' }, { status: 201 })
}
