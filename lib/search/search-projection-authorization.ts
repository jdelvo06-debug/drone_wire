import { isLocalDatabaseUrl, type SearchProjectionMode } from './search-projection'

interface SearchProjectionApplyAuthorization {
  apply: boolean
  mode: SearchProjectionMode
  databaseUrl: string | undefined
  exportPath: string | undefined
  productionApproved: boolean
  disposableApproved: boolean
  expectedTotal: number | undefined
  expectedCounts: {
    articles: number | undefined
    systems: number | undefined
    explainers: number | undefined
    contracts: number | undefined
  }
  expectedProjectionSha256: string | undefined
}

export type SearchProjectionApplyTarget = 'none' | 'production' | 'disposable'

export function assertSearchProjectionApplyAuthorization({
  apply,
  mode,
  databaseUrl,
  exportPath,
  productionApproved,
  disposableApproved,
  expectedTotal,
  expectedCounts,
  expectedProjectionSha256,
}: SearchProjectionApplyAuthorization): { checkpointPath: string; target: SearchProjectionApplyTarget } {
  if (!apply) return { checkpointPath: '', target: 'none' }
  if (mode === 'dry-run') throw new Error('--apply requires --mode=projection or --mode=delete-stale')
  if (!databaseUrl) throw new Error('DATABASE_URL is required for --apply')
  if (productionApproved === disposableApproved) {
    throw new Error('--apply requires exactly one of --production-approved or --disposable-approved')
  }

  let target: SearchProjectionApplyTarget
  if (productionApproved) {
    target = 'production'
    if (mode !== 'projection') {
      throw new Error('Production apply is restricted to projection mode; stale deletion remains prohibited')
    }
    if (!Number.isSafeInteger(expectedTotal) || (expectedTotal ?? 0) <= 0) {
      throw new Error('Production projection apply requires --expected-total=<positive integer>')
    }
    if (Object.values(expectedCounts).some((value) => !Number.isSafeInteger(value) || (value ?? -1) < 0)) {
      throw new Error('Production projection apply requires non-negative expected counts for every entity type')
    }
    if (!expectedProjectionSha256 || !/^[a-f0-9]{64}$/.test(expectedProjectionSha256)) {
      throw new Error('Production projection apply requires --expected-sha256=<64 lowercase hex characters>')
    }
  } else {
    target = 'disposable'
    if (!isLocalDatabaseUrl(databaseUrl)) {
      throw new Error('--disposable-approved requires a loopback database URL and connected-database marker')
    }
  }

  if (!exportPath || !exportPath.startsWith('/')) {
    throw new Error('--apply requires an absolute --export path for the pre-change search projection checkpoint')
  }
  return { checkpointPath: exportPath, target }
}
