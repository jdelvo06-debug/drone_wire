/**
 * Guarded Packet 1 contract source/date apply and rollback tool.
 *
 * Dry-run (default; no files or database writes):
 *   npx tsx --env-file=.env.local scripts/apply-contract-source-dates.ts \
 *     --export=/private/tmp/dronewire-contracts-pre-apply.json
 *
 * Apply (requires separate approval; do not run casually):
 *   npx tsx --env-file=.env.local scripts/apply-contract-source-dates.ts \
 *     --apply \
 *     --export=/private/tmp/dronewire-contracts-pre-apply.json \
 *     --report=/private/tmp/dronewire-contracts-apply-report.json
 *
 * Rollback dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-contract-source-dates.ts \
 *     --rollback \
 *     --pre-apply-export=/private/tmp/dronewire-contracts-pre-apply.json \
 *     --export=/private/tmp/dronewire-contracts-pre-rollback.json
 *
 * Rollback write (requires separate approval): add --apply and --report=/absolute/path.json.
 *
 * This tool can update only contracts.awardDate and contracts.sourceUrl. It has
 * no title or status update operation.
 */

import { access, readFile, writeFile } from 'node:fs/promises'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import {
  buildPacket1Plan,
  executePacket1,
  parsePacket1Cli,
  type ContractSnapshotRow,
  type Packet1ArtifactStore,
  type Packet1Store,
  type Packet1Transaction,
  type Packet1Update,
} from '@/lib/contracts/packet1-apply'

interface RawContractSnapshotRow extends Omit<
  ContractSnapshotRow,
  'awardDate' | 'scrapedAt' | 'createdAt' | 'updatedAt'
> {
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
    id,
    "contractNumber",
    title,
    description,
    "awardDate",
    company,
    "contractorType",
    value::text AS value,
    currency,
    duration,
    status,
    category,
    agency,
    office,
    location,
    "keyPersonnel",
    "relatedSystems",
    "sourceUrl",
    "scrapedAt",
    "createdAt",
    "updatedAt"
  FROM contracts
  ORDER BY id
`

async function readSnapshot(client: TransactionClient): Promise<ContractSnapshotRow[]> {
  const rows = await client.$queryRaw<RawContractSnapshotRow[]>(snapshotSelect)
  return rows.map(normalizeRow)
}

async function readLockedSnapshot(client: TransactionClient): Promise<ContractSnapshotRow[]> {
  const rows = await client.$queryRaw<RawContractSnapshotRow[]>(Prisma.sql`
    SELECT
      id,
      "contractNumber",
      title,
      description,
      "awardDate",
      company,
      "contractorType",
      value::text AS value,
      currency,
      duration,
      status,
      category,
      agency,
      office,
      location,
      "keyPersonnel",
      "relatedSystems",
      "sourceUrl",
      "scrapedAt",
      "createdAt",
      "updatedAt"
    FROM contracts
    ORDER BY id
    FOR UPDATE
  `)
  return rows.map(normalizeRow)
}

function affectedCount(rows: Array<{ count: bigint | number }>): number {
  if (rows.length !== 1) throw new Error(`Expected one affected-count row, found ${rows.length}.`)
  return Number(rows[0].count)
}

async function updateAwardDates(
  client: TransactionClient,
  updates: Array<Packet1Update<string>>
): Promise<number> {
  const payload = JSON.stringify(updates.map((update) => ({
    id: update.id,
    beforeValue: update.before,
    afterValue: update.after,
  })))
  const result = await client.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
    WITH changed AS (
      UPDATE contracts AS contract
      SET "awardDate" = input."afterValue"::timestamptz
      FROM jsonb_to_recordset(CAST(${payload} AS jsonb))
        AS input(id text, "beforeValue" text, "afterValue" text)
      WHERE contract.id = input.id
        AND contract."awardDate" = input."beforeValue"::timestamptz
      RETURNING contract.id
    )
    SELECT COUNT(*)::bigint AS count FROM changed
  `)
  return affectedCount(result)
}

async function updateSourceUrls(
  client: TransactionClient,
  updates: Array<Packet1Update<string | null>>
): Promise<number> {
  const payload = JSON.stringify(updates.map((update) => ({
    id: update.id,
    beforeValue: update.before,
    afterValue: update.after,
  })))
  const result = await client.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
    WITH changed AS (
      UPDATE contracts AS contract
      SET "sourceUrl" = input."afterValue"
      FROM jsonb_to_recordset(CAST(${payload} AS jsonb))
        AS input(id text, "beforeValue" text, "afterValue" text)
      WHERE contract.id = input.id
        AND contract."sourceUrl" IS NOT DISTINCT FROM input."beforeValue"
      RETURNING contract.id
    )
    SELECT COUNT(*)::bigint AS count FROM changed
  `)
  return affectedCount(result)
}

const store: Packet1Store = {
  async readSnapshot() {
    return prisma.$transaction(async (transaction) => {
      await transaction.$executeRaw`SET TRANSACTION READ ONLY`
      return readSnapshot(transaction)
    })
  },
  async transaction<T>(callback: (transaction: Packet1Transaction) => Promise<T>): Promise<T> {
    return prisma.$transaction(async (client) => callback({
      readLockedSnapshot: () => readLockedSnapshot(client),
      updateAwardDates: (updates) => updateAwardDates(client, updates),
      updateSourceUrls: (updates) => updateSourceUrls(client, updates),
      readSnapshot: () => readSnapshot(client),
    }), {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 10_000,
      timeout: 30_000,
    })
  },
}

const artifactStore: Packet1ArtifactStore = {
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

async function main(): Promise<void> {
  const options = parsePacket1Cli(process.argv.slice(2), process.cwd())
  const [packet, baseline] = await Promise.all([
    readJson(options.packetPath),
    readJson(options.baselinePath),
  ])
  const plan = buildPacket1Plan(packet, baseline)
  let preApplySnapshot: ContractSnapshotRow[] | undefined
  if (options.preApplyExportPath) {
    const preApplyPlan = buildPacket1Plan(packet, await readJson(options.preApplyExportPath))
    if (preApplyPlan.expectedBaselineSha256 !== plan.expectedBaselineSha256) {
      throw new Error('Pre-apply export does not match the approved Packet 1 baseline.')
    }
    preApplySnapshot = preApplyPlan.baselineSnapshot
  }

  const result = await executePacket1({
    action: options.action,
    apply: options.apply,
    exportPath: options.exportPath,
    reportPath: options.reportPath,
    plan,
    preApplySnapshot,
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
