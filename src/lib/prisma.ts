import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// MUST be the pooled Prisma Postgres endpoint (pooled.db.prisma.io), never
// the direct one (db.prisma.io). Confirmed the hard way on the main Beacon
// app: the direct endpoint's small connection ceiling gets exhausted the
// moment a serverless deploy briefly runs old + new instances side by side,
// each holding their own pool - every deploy caused minutes of downtime
// until this was fixed there. Fail loudly here rather than silently
// degrading into the same failure mode on a fresh app.
const databaseUrl = process.env.DATABASE_URL
if (databaseUrl && !databaseUrl.includes('pooled.')) {
  console.warn(
    'DATABASE_URL does not look like the pooled Prisma Postgres endpoint ' +
    '(expected a "pooled." host). Using the direct endpoint in a serverless ' +
    'deployment will exhaust its connection ceiling under concurrent load.'
  )
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 5_000,
  connectionTimeoutMillis: 15_000,
  maxUses: 5_000,
  max: 3,
  keepAlive: true,
  allowExitOnIdle: true,
})

pool.on('error', (err) => {
  console.warn('pg pool: idle client error (recovering)', err.message)
})

const adapter = new PrismaPg(pool)

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma: PrismaClient = globalForPrisma.prisma || new PrismaClient({ adapter })

globalForPrisma.prisma = prisma
