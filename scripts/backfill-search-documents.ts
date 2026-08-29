import fs from 'node:fs/promises'
import path from 'node:path'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/db'
import { assertSearchProjectionApplyAuthorization } from '../lib/search/search-projection-authorization'
import {
  executeSearchProjection,
  type ExistingSearchProjection,
  type SearchProjectionDocument,
  type SearchProjectionMode,
  type SearchProjectionSourceData,
  type SearchProjectionStore,
} from '../lib/search/search-projection'

const apply = process.argv.includes('--apply')
const exportArg = process.argv.find((arg) => arg.startsWith('--export='))?.slice('--export='.length)
const modeArg = process.argv.find((arg) => arg.startsWith('--mode='))?.slice('--mode='.length) || 'dry-run'
const productionApproved = process.argv.includes('--production-approved')
const disposableApproved = process.argv.includes('--disposable-approved')
const expectedTotalArg = process.argv.find((arg) => arg.startsWith('--expected-total='))?.slice('--expected-total='.length)
const expectedArticlesArg = process.argv.find((arg) => arg.startsWith('--expected-articles='))?.slice('--expected-articles='.length)
const expectedSystemsArg = process.argv.find((arg) => arg.startsWith('--expected-systems='))?.slice('--expected-systems='.length)
const expectedExplainersArg = process.argv.find((arg) => arg.startsWith('--expected-explainers='))?.slice('--expected-explainers='.length)
const expectedContractsArg = process.argv.find((arg) => arg.startsWith('--expected-contracts='))?.slice('--expected-contracts='.length)
const expectedProjectionSha256 = process.argv.find((arg) => arg.startsWith('--expected-sha256='))?.slice('--expected-sha256='.length)

function parseMode(value: string): SearchProjectionMode {
  if (value === 'dry-run' || value === 'projection' || value === 'delete-stale') return value
  throw new Error('--mode must be dry-run, projection, or delete-stale')
}

function parseExpectedCount(value: string | undefined, option: string, allowZero = false): number | undefined {
  if (value === undefined) return undefined
  if (!/^\d+$/.test(value)) throw new Error(`${option} must be ${allowZero ? 'a non-negative' : 'a positive'} integer`)
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed < (allowZero ? 0 : 1)) {
    throw new Error(`${option} must be ${allowZero ? 'a non-negative' : 'a positive'} integer`)
  }
  return parsed
}

class PrismaSearchProjectionStore implements SearchProjectionStore {
  async loadSources(): Promise<SearchProjectionSourceData> {
    const [articles, systems, explainers, contracts] = await Promise.all([
      prisma.article.findMany({
        select: {
          id: true, status: true, title: true, content: true, excerpt: true, aiSummary: true,
          sourceName: true, topics: true, category: true, imageUrl: true, provenanceLabel: true, updatedAt: true,
        },
        orderBy: { id: 'asc' },
      }),
      prisma.system.findMany({
        select: {
          id: true, slug: true, name: true, description: true, content: true, manufacturer: true,
          country: true, status: true, relatedSystems: true, specifications: true, category: true,
          imageUrl: true, provenanceLabel: true, updatedAt: true,
        },
        orderBy: { id: 'asc' },
      }),
      prisma.explainer.findMany({
        select: {
          id: true, slug: true, title: true, description: true, content: true, relatedSystems: true,
          keyFeatures: true, difficulty: true, category: true, imageUrl: true, provenanceLabel: true, updatedAt: true,
        },
        orderBy: { id: 'asc' },
      }),
      prisma.contract.findMany({
        select: {
          id: true, contractNumber: true, title: true, description: true, company: true, agency: true,
          office: true, location: true, relatedSystems: true, status: true, category: true,
          sourceUrl: true, updatedAt: true,
        },
        orderBy: { id: 'asc' },
      }),
    ])
    return { articles, systems, explainers, contracts }
  }

  async loadExisting(): Promise<ExistingSearchProjection[]> {
    return prisma.$queryRaw<ExistingSearchProjection[]>(Prisma.sql`
      SELECT "entityType", "entityId", "embedding"::text AS "embedding"
      FROM "search_documents"
      ORDER BY "entityType", "entityId"
    `)
  }

  async loadCheckpoint(): Promise<Array<Record<string, unknown>>> {
    return prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT
        "id", "entityType", "entityId", "title", "href", "aliases", "facets",
        "searchableText", "category", "imageUrl", "provenanceLabel",
        "embedding"::text AS "embedding", "sourceUpdatedAt", "createdAt", "updatedAt"
      FROM "search_documents"
      ORDER BY "entityType", "entityId"
    `)
  }

  async upsertProjection(documents: SearchProjectionDocument[]): Promise<void> {
    const operations = documents.flatMap((document) => {
      const { embedding, ...projection } = document
      void embedding
      const data = { ...projection, facets: projection.facets as Prisma.InputJsonValue }
      return [
        prisma.searchDocument.upsert({
          where: { entityType_entityId: { entityType: document.entityType, entityId: document.entityId } },
          create: data,
          update: data,
        }),
        prisma.$executeRaw`
          UPDATE "search_documents"
          SET "embedding" = NULL
          WHERE "entityType" = ${document.entityType} AND "entityId" = ${document.entityId}
        `,
      ]
    })
    await prisma.$transaction(operations)
  }

  async deleteStaleProjection(expectedKeys: Set<string>): Promise<number> {
    const expectedByType = new Map<string, string[]>([
      ['article', []], ['system', []], ['explainer', []], ['contract', []],
    ])
    for (const key of expectedKeys) {
      const separator = key.indexOf(':')
      const entityType = key.slice(0, separator)
      const entityId = key.slice(separator + 1)
      expectedByType.get(entityType)?.push(entityId)
    }
    let deleted = 0
    for (const [entityType, entityIds] of expectedByType) {
      if (entityIds.length === 0) throw new Error(`Refusing stale deletion with zero expected ${entityType} rows`)
      const result = await prisma.searchDocument.deleteMany({
        where: { entityType, entityId: { notIn: entityIds } },
      })
      deleted += result.count
    }
    const unexpected = await prisma.searchDocument.deleteMany({
      where: { entityType: { notIn: Array.from(expectedByType.keys()) } },
    })
    deleted += unexpected.count
    return deleted
  }
}

async function schemaStatus() {
  const [schema] = await prisma.$queryRaw<Array<{ ready: boolean }>>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'topics'
    ) AND to_regclass('public.search_documents') IS NOT NULL AS "ready"
  `
  return schema?.ready === true
}

async function sourceCounts() {
  const [counts] = await prisma.$queryRaw<Array<{ articles: bigint; systems: bigint; explainers: bigint; contracts: bigint }>>`
    SELECT
      (SELECT COUNT(*) FROM "articles" WHERE "status" = 'published') AS "articles",
      (SELECT COUNT(*) FROM "systems") AS "systems",
      (SELECT COUNT(*) FROM "explainers") AS "explainers",
      (SELECT COUNT(*) FROM "contracts") AS "contracts"
  `
  return Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, Number(value)]))
}

async function exportCheckpoint(filePath: string, store: SearchProjectionStore): Promise<void> {
  const existingProjection = store.loadCheckpoint
    ? await store.loadCheckpoint()
    : await store.loadExisting()
  await fs.writeFile(
    filePath,
    `${JSON.stringify({ exportedAt: new Date().toISOString(), documents: existingProjection }, null, 2)}\n`,
    { flag: 'wx', mode: 0o600 },
  )
}

async function assertCheckpointOutsideRepository(filePath: string): Promise<void> {
  const repositoryRoot = await fs.realpath(path.resolve(path.dirname(process.argv[1]), '..'))
  const checkpointParent = await fs.realpath(path.dirname(filePath))
  const relative = path.relative(repositoryRoot, checkpointParent)
  if (relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`))) {
    throw new Error('--export parent must resolve outside the repository')
  }
}

async function assertDisposableDatabaseIdentity(): Promise<void> {
  const [identity] = await prisma.$queryRaw<Array<{ approved: boolean }>>`
    SELECT COALESCE(shobj_description(oid, 'pg_database') = 'dronewire-disposable-restore-only', false) AS "approved"
    FROM pg_database
    WHERE datname = current_database()
  `
  if (identity?.approved !== true) {
    throw new Error('Connected database is not marked as a disposable DroneWire restore')
  }
}

async function main() {
  const mode = parseMode(modeArg)
  const expectedTotal = parseExpectedCount(expectedTotalArg, '--expected-total')
  const expectedCounts = {
    articles: parseExpectedCount(expectedArticlesArg, '--expected-articles', true),
    systems: parseExpectedCount(expectedSystemsArg, '--expected-systems', true),
    explainers: parseExpectedCount(expectedExplainersArg, '--expected-explainers', true),
    contracts: parseExpectedCount(expectedContractsArg, '--expected-contracts', true),
  }
  const authorization = assertSearchProjectionApplyAuthorization({
    apply,
    mode,
    databaseUrl: process.env.DATABASE_URL,
    exportPath: exportArg,
    productionApproved,
    disposableApproved,
    expectedTotal,
    expectedCounts,
    expectedProjectionSha256,
  })
  if (apply) await assertCheckpointOutsideRepository(authorization.checkpointPath)
  if (!await schemaStatus()) {
    process.stdout.write(`${JSON.stringify({ mode, apply, schemaReady: false, counts: await sourceCounts(), nextStep: 'Apply the approved foundation migration before search projection backfill' }, null, 2)}\n`)
    if (apply) throw new Error('Foundation migration is required before --apply')
    return
  }

  const store = new PrismaSearchProjectionStore()
  if (authorization.target === 'disposable') await assertDisposableDatabaseIdentity()
  if (apply) await exportCheckpoint(authorization.checkpointPath, store)
  const report = await executeSearchProjection(store, {
    mode,
    apply,
    expectedTotal,
    expectedCounts,
    expectedProjectionSha256,
  })
  process.stdout.write(`${JSON.stringify({ schemaReady: true, ...report }, null, 2)}\n`)
}

main()
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
