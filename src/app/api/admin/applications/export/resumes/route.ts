import { NextResponse } from 'next/server'
import { PassThrough } from 'stream'
import { ZipArchive } from 'archiver'
import { prisma } from '@/lib/prisma'
import { buildApplicationWhere } from '@/lib/admin-query'
import { getSignedResumeUrl } from '@/lib/blob'

// Zipping every matching resume can take a while for a large filtered set -
// give it more room than the platform default before Vercel kills it.
export const maxDuration = 60

function safeNamePart(value: string): string {
  return value.replace(/[^\w.\- ]+/g, '_').trim().slice(0, 80) || 'applicant'
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const where = buildApplicationWhere(searchParams)

  const applications = await prisma.application.findMany({
    where: { ...where, resumeBlobPath: { not: null } },
    orderBy: { submittedAt: 'desc' },
    select: { id: true, fullName: true, resumeBlobPath: true, resumeOriginalName: true },
  })

  if (applications.length === 0) {
    return NextResponse.json({ error: 'NO_RESUMES' }, { status: 404 })
  }

  const archive = new ZipArchive({ zlib: { level: 9 } })
  const passthrough = new PassThrough()
  archive.pipe(passthrough)

  const chunks: Buffer[] = []
  passthrough.on('data', (chunk: Buffer) => chunks.push(chunk))
  const streamDone = new Promise<void>((resolve, reject) => {
    passthrough.on('end', resolve)
    archive.on('error', reject)
  })

  const usedNames = new Set<string>()
  for (const app of applications) {
    try {
      const signedUrl = await getSignedResumeUrl(app.resumeBlobPath!)
      const res = await fetch(signedUrl)
      if (!res.ok) continue
      const buf = Buffer.from(await res.arrayBuffer())

      const ext = app.resumeOriginalName?.split('.').pop() || 'pdf'
      const base = `${safeNamePart(app.fullName)}-${app.id.slice(0, 8)}`
      let filename = `${base}.${ext}`
      let n = 1
      while (usedNames.has(filename)) filename = `${base}-${++n}.${ext}`
      usedNames.add(filename)

      archive.append(buf, { name: filename })
    } catch (err) {
      console.error('Failed to add resume to zip for application', app.id, err)
    }
  }

  await archive.finalize()
  await streamDone

  return new NextResponse(Buffer.concat(chunks), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="beacon-internship-resumes-${new Date().toISOString().slice(0, 10)}.zip"`,
    },
  })
}
