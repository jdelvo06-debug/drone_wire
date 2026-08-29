/**
 * Guarded nine-row contract title review/apply/rollback tool.
 *
 * Dry-run review (writes only the requested report artifact):
 *   npx tsx --env-file=.env.local scripts/review-contract-title-corrections.ts \
 *     --export=/private/tmp/contract-title-pre-apply.json \
 *     --report=/private/tmp/contract-title-review.json
 *
 * Apply requires --apply plus an exact Jeremy approval artifact. Rollback uses
 * --rollback, the pre-apply export, and a fresh pre-rollback export path.
 * The database adapter exposes only a title update operation.
 */

import { access, readFile, writeFile } from 'node:fs/promises'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { buildPacket1Plan, snapshotSha256, type ContractSnapshotRow, type Packet1Update } from '@/lib/contracts/packet1-apply'
import {
  buildContractTitlePlan,
  executeContractTitles,
  parseContractTitleCli,
  type ContractTitleArtifactStore,
  type ContractTitleStore,
  type ContractTitleTransaction,
} from '@/lib/contracts/contract-title-corrections'

interface RawContractSnapshotRow extends Omit<ContractSnapshotRow, 'awardDate' | 'scrapedAt' | 'createdAt' | 'updatedAt'> {
  awardDate: Date
  scrapedAt: Date
  createdAt: Date
  updatedAt: Date
}

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

function normalizeRow(row: RawContractSnapshotRow): ContractSnapshotRow {
  return {
    ...row,
    awardDate: row.awardDate.toISOString(),
    scrapedAt: row.scrapedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

const snapshotSelect = Prisma.sql`
  SELECT
    id, "contractNumber", title, description, "awardDate", company, "contractorType",
    value::text AS value, currency, duration, status, category, agency, office, location,
    "keyPersonnel", "relatedSystems", "sourceUrl", "scrapedAt", "createdAt", "updatedAt"
  FROM contracts
  ORDER BY id
`

async function readSnapshot(client: TransactionClient): Promise<ContractSnapshotRow[]> {
  return (await client.$queryRaw<RawContractSnapshotRow[]>(snapshotSelect)).map(normalizeRow)
}

async function readLockedSnapshot(client: TransactionClient): Promise<ContractSnapshotRow[]> {
  const rows = await client.$queryRaw<RawContractSnapshotRow[]>(Prisma.sql`
    SELECT
      id, "contractNumber", title, description, "awardDate", company, "contractorType",
      value::text AS value, currency, duration, status, category, agency, office, location,
      "keyPersonnel", "relatedSystems", "sourceUrl", "scrapedAt", "createdAt", "updatedAt"
    FROM contracts
    ORDER BY id
    FOR UPDATE
  `)
  return rows.map(normalizeRow)
}

async function updateTitles(client: TransactionClient, updates: Array<Packet1Update<string>>): Promise<number> {
  const payload = JSON.stringify(updates.map((update) => ({
    id: update.id,
    beforeValue: update.before,
    afterValue: update.after,
  })))
  const rows = await client.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
    WITH changed AS (
      UPDATE contracts AS contract
      SET title = input."afterValue"
      FROM jsonb_to_recordset(CAST(${payload} AS jsonb))
        AS input(id text, "beforeValue" text, "afterValue" text)
      WHERE contract.id = input.id
        AND contract.title = input."beforeValue"
      RETURNING contract.id
    )
    SELECT COUNT(*)::bigint AS count FROM changed
  `)
  if (rows.length !== 1) throw new Error(`Expected one affected-count row, found ${rows.length}.`)
  return Number(rows[0].count)
}

const store: ContractTitleStore = {
  async readSnapshot() {
    return prisma.$transaction(async (transaction) => {
      await transaction.$executeRaw`SET TRANSACTION READ ONLY`
      return readSnapshot(transaction)
    })
  },
  async transaction<T>(callback: (transaction: ContractTitleTransaction) => Promise<T>): Promise<T> {
    return prisma.$transaction(async (client) => callback({
      readLockedSnapshot: () => readLockedSnapshot(client),
      updateTitles: (updates) => updateTitles(client, updates),
      readSnapshot: () => readSnapshot(client),
    }), {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 10_000,
      timeout: 30_000,
    })
  },
}

const artifactStore: ContractTitleArtifactStore = {
  async exists(filePath) {
    try {
      await access(filePath)
      return true
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined
      if (code === 'ENOENT') return false
      throw error
    }
  },
  async writeExclusive(filePath, contents) {
    await writeFile(filePath, contents, { flag: 'wx', mode: 0o600 })
  },
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, 'utf8')) as unknown
}

function reportHash(value: unknown, field: string): string {
  if (!value || typeof value !== 'object' || typeof (value as Record<string, unknown>)[field] !== 'string') {
    throw new Error(`Packet 1 apply report is missing ${field}.`)
  }
  return (value as Record<string, string>)[field]
}

function snapshotFromArtifact(value: unknown): ContractSnapshotRow[] {
  if (!value || typeof value !== 'object') throw new Error('Pre-apply export must be an object.')
  const artifact = value as Record<string, unknown>
  if (!Array.isArray(artifact.contracts) || artifact.contracts.length !== 228) {
    throw new Error('Pre-apply export must contain exactly 228 contracts.')
  }
  const rows = artifact.contracts as ContractSnapshotRow[]
  if (artifact.sha256 !== snapshotSha256(rows)) throw new Error('Pre-apply export SHA-256 is invalid.')
  return rows
}

async function main(): Promise<void> {
  const options = parseContractTitleCli(process.argv.slice(2), process.cwd())
  const [packet, prePacket1, packet1Report] = await Promise.all([
    readJson(options.packetPath), readJson(options.prePacket1Path), readJson(options.packet1ReportPath),
  ])
  const packet1Plan = buildPacket1Plan(packet, prePacket1)
  const postPacket1Hash = reportHash(packet1Report, 'postCommitSha256')
  if (reportHash(packet1Report, 'expectedAfterSha256') !== postPacket1Hash) {
    throw new Error('Packet 1 apply report expected/post-commit hashes do not match.')
  }
  if (snapshotSha256(packet1Plan.appliedSnapshot) !== postPacket1Hash) {
    throw new Error('Packet 1 apply report does not match the reconstructed post-Packet-1 state.')
  }
  const plan = buildContractTitlePlan({
    packet,
    postPacket1Snapshot: packet1Plan.appliedSnapshot,
    expectedPostPacket1Sha256: postPacket1Hash,
  })
  const [approval, preApplySnapshot] = await Promise.all([
    options.approvalPath ? readJson(options.approvalPath) : Promise.resolve(undefined),
    options.preApplyExportPath
      ? readJson(options.preApplyExportPath).then(snapshotFromArtifact)
      : Promise.resolve(undefined),
  ])
  const result = await executeContractTitles({
    action: options.action,
    apply: options.apply,
    exportPath: options.exportPath,
    reportPath: options.reportPath,
    approval,
    preApplySnapshot,
    plan,
    store,
    artifactStore,
  })
  console.log(JSON.stringify(result, null, 2))
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
