/**
 * Systems/explainers correction packet.
 *
 * Dry-run (default, no file or database writes):
 *   npm run correct:known-catalog
 *
 * Apply (only after Jeremy approves the exact approval template from dry-run):
 *   npm run correct:known-catalog -- --apply \
 *     --approval=/absolute/outside-repo/approval.json \
 *     --export=/absolute/outside-repo/catalog-pre-apply.json \
 *     --report=/absolute/outside-repo/catalog-apply-report.json
 */
import { access, readFile, writeFile } from 'node:fs/promises'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/db'
import {
  buildCatalogCorrectionPlan,
  executeCatalogCorrections,
  parseCatalogCli,
  type CatalogArtifactStore,
  type CatalogCorrectionStore,
  type CatalogCorrectionTransaction,
  type CatalogRecordSnapshot,
} from '../lib/content/catalog-correction-packet'
import {
  ALL_KNOWN_CATALOG_CORRECTIONS,
  type CatalogCorrection,
  type CatalogEntityType,
} from '../lib/content/known-catalog-corrections'

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

const systemSlugs = ALL_KNOWN_CATALOG_CORRECTIONS.filter((item) => item.entityType === 'system').map((item) => item.slug)
const explainerSlugs = ALL_KNOWN_CATALOG_CORRECTIONS.filter((item) => item.entityType === 'explainer').map((item) => item.slug)

function normalizeData(value: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value, (_key, item) => typeof item === 'bigint' ? item.toString() : item)) as Record<string, unknown>
}

async function rowsFor(client: TransactionClient | typeof prisma, entityType: CatalogEntityType, locked: boolean): Promise<CatalogRecordSnapshot[]> {
  const table = entityType === 'system' ? 'systems' : 'explainers'
  const slugs = entityType === 'system' ? systemSlugs : explainerSlugs
  const lockClause = locked ? ` FOR UPDATE OF row` : ''
  const rows = await client.$queryRawUnsafe<Array<{ data: Record<string, unknown> }>>(
    `SELECT row_to_json(row)::jsonb AS data FROM ${table} AS row WHERE slug = ANY($1::text[]) ORDER BY slug${lockClause}`,
    slugs,
  )
  return rows.map(({ data }) => ({
    entityType,
    id: String(data.id),
    slug: String(data.slug),
    fields: normalizeData(data),
  }))
}

async function readRecords(client: TransactionClient | typeof prisma, locked = false): Promise<CatalogRecordSnapshot[]> {
  const [systems, explainers] = await Promise.all([
    rowsFor(client, 'system', locked),
    rowsFor(client, 'explainer', locked),
  ])
  return [...systems, ...explainers]
}

async function upsertSource(client: TransactionClient, sourceDefinition: CatalogCorrection['sources'][number]) {
  return client.contentSource.upsert({
    where: { canonicalUrl: sourceDefinition.canonicalUrl },
    create: {
      canonicalUrl: sourceDefinition.canonicalUrl,
      title: sourceDefinition.title,
      publisher: sourceDefinition.publisher,
      sourceType: sourceDefinition.sourceType,
      linkHealthStatus: 'unchecked',
    },
    update: {
      title: sourceDefinition.title,
      publisher: sourceDefinition.publisher,
      sourceType: sourceDefinition.sourceType,
    },
  })
}

async function applyCorrection(client: TransactionClient, correction: CatalogCorrection, recordId: string): Promise<void> {
  if (correction.entityType === 'system') {
    await client.system.update({ where: { id: recordId }, data: correction.changes as Prisma.SystemUncheckedUpdateInput })
  } else {
    await client.explainer.update({ where: { id: recordId }, data: correction.changes as Prisma.ExplainerUncheckedUpdateInput })
  }
  for (const sourceDefinition of correction.sources) {
    const source = await upsertSource(client, sourceDefinition)
    for (const claimKey of sourceDefinition.claimKeys) {
      if (correction.entityType === 'system') {
        await client.systemCitation.upsert({
          where: { systemId_sourceId_claimKey: { systemId: recordId, sourceId: source.id, claimKey } },
          create: { systemId: recordId, sourceId: source.id, claimKey, evidenceText: sourceDefinition.evidenceSummary, provenanceLabel: sourceDefinition.provenanceLabel, lastCheckedAt: new Date() },
          update: { evidenceText: sourceDefinition.evidenceSummary, provenanceLabel: sourceDefinition.provenanceLabel, lastCheckedAt: new Date() },
        })
      } else {
        await client.explainerCitation.upsert({
          where: { explainerId_sourceId_claimKey: { explainerId: recordId, sourceId: source.id, claimKey } },
          create: { explainerId: recordId, sourceId: source.id, claimKey, evidenceText: sourceDefinition.evidenceSummary, provenanceLabel: sourceDefinition.provenanceLabel, lastCheckedAt: new Date() },
          update: { evidenceText: sourceDefinition.evidenceSummary, provenanceLabel: sourceDefinition.provenanceLabel, lastCheckedAt: new Date() },
        })
      }
    }
  }
  if (correction.media) {
    const media = correction.media
    const source = await client.contentSource.findUnique({ where: { canonicalUrl: media.sourceUrl } })
    if (!source) throw new Error(`Media source was not created for ${correction.entityType}:${correction.slug}.`)
    const relation = correction.entityType === 'system' ? { systemId: recordId } : { explainerId: recordId }
    const existing = await client.mediaAsset.findFirst({ where: { ...relation, remoteUrl: media.url } })
    const data = {
      remoteUrl: media.url, origin: media.origin, attribution: media.attribution, license: media.license,
      depictedEntity: media.depictedEntity, depictedVariant: media.depictedVariant, storageMode: media.storageMode,
      verificationState: media.verificationState, sourceId: source.id, lastCheckedAt: new Date(), ...relation,
    }
    if (existing) await client.mediaAsset.update({ where: { id: existing.id }, data })
    else await client.mediaAsset.create({ data })
  }
}

const store: CatalogCorrectionStore = {
  readRecords: () => prisma.$transaction(async (client) => {
    await client.$executeRaw`SET TRANSACTION READ ONLY`
    return readRecords(client)
  }),
  readRollbackState: async () => {
    const records = await readRecords(prisma)
    const systemIds = records.filter((record) => record.entityType === 'system').map((record) => record.id)
    const explainerIds = records.filter((record) => record.entityType === 'explainer').map((record) => record.id)
    const sourceUrls = [...new Set(ALL_KNOWN_CATALOG_CORRECTIONS.flatMap((correction) => correction.sources.map((source) => source.canonicalUrl)))]
    const [sources, systemCitations, explainerCitations, mediaAssets] = await Promise.all([
      prisma.contentSource.findMany({ where: { canonicalUrl: { in: sourceUrls } }, orderBy: { id: 'asc' } }),
      prisma.systemCitation.findMany({ where: { systemId: { in: systemIds } }, orderBy: { id: 'asc' } }),
      prisma.explainerCitation.findMany({ where: { explainerId: { in: explainerIds } }, orderBy: { id: 'asc' } }),
      prisma.mediaAsset.findMany({ where: { OR: [{ systemId: { in: systemIds } }, { explainerId: { in: explainerIds } }] }, orderBy: { id: 'asc' } }),
    ])
    return normalizeData({ sources, systemCitations, explainerCitations, mediaAssets })
  },
  transaction: <T>(callback: (transaction: CatalogCorrectionTransaction) => Promise<T>) => prisma.$transaction(async (client) => callback({
    readLockedRecords: () => readRecords(client, true),
    applyCorrection: (correction, recordId) => applyCorrection(client, correction, recordId),
    readRecords: () => readRecords(client),
  }), {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 10_000,
    timeout: 60_000,
  }),
}

const artifactStore: CatalogArtifactStore = {
  async exists(filePath) {
    try { await access(filePath); return true } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return false
      throw error
    }
  },
  writeExclusive: (filePath, contents) => writeFile(filePath, contents, { flag: 'wx', mode: 0o600 }),
}

async function schemaReady(): Promise<boolean> {
  const [row] = await prisma.$queryRaw<Array<{ ready: boolean }>>`
    SELECT
      EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='systems' AND column_name='provenanceLabel')
      AND to_regclass('public.content_sources') IS NOT NULL
      AND to_regclass('public.system_citations') IS NOT NULL
      AND to_regclass('public.explainer_citations') IS NOT NULL
      AND to_regclass('public.media_assets') IS NOT NULL AS ready
  `
  return Boolean(row?.ready)
}

async function main(): Promise<void> {
  const options = parseCatalogCli(process.argv.slice(2), process.cwd())
  const ready = await schemaReady()
  if (options.apply && !ready) throw new Error('Foundation provenance/media schema is required before --apply; this command will not migrate it.')
  const records = await store.readRecords()
  const plan = buildCatalogCorrectionPlan(records)
  const approval = options.approvalPath ? JSON.parse(await readFile(options.approvalPath, 'utf8')) as unknown : undefined
  const result = await executeCatalogCorrections({ ...options, plan, store, artifactStore, approval })
  process.stdout.write(`${JSON.stringify({ schemaReady: ready, nextStep: ready ? 'Review and explicitly approve the exact approval template before --apply.' : 'Foundation provenance/media migration remains a separate approval gate.', ...result }, null, 2)}\n`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}).finally(async () => prisma.$disconnect())
