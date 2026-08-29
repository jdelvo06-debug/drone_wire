import { prisma } from '../lib/db'
import { refreshMissingSearchEmbeddings } from '../lib/search/refresh-embeddings'
import { isLocalDatabaseUrl } from '../lib/search/search-projection'

const apply = process.argv.includes('--apply')
const providerApproved = process.argv.includes('--provider-approved')
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='))?.slice('--limit='.length)
const parsedLimit = Number.parseInt(limitArg || '', 10)
const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 50) : 50

async function main() {
  if (!apply) {
    process.stdout.write(`${JSON.stringify({ apply: false, limit, note: 'Future embedding operation; no provider call was made' }, null, 2)}\n`)
    return
  }
  if (!providerApproved) throw new Error('--apply requires --provider-approved for the separate embedding operation')
  if (!isLocalDatabaseUrl(process.env.DATABASE_URL)) {
    throw new Error('Embedding generation is restricted to a local database; production requires a separate future implementation and approval')
  }
  const result = await refreshMissingSearchEmbeddings(limit, {
    providerApproved: true,
  })
  process.stdout.write(`${JSON.stringify({ apply: true, limit, ...result }, null, 2)}\n`)
}

main()
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
