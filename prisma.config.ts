import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Migrations need the direct endpoint - the pooled one doesn't support
    // the session-level behavior migrate relies on. The app's runtime
    // client (src/lib/prisma.ts) uses DATABASE_URL (pooled) separately.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },
})
