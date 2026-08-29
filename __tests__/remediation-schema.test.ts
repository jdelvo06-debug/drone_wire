import fs from 'node:fs'
import path from 'node:path'

const schema = fs.readFileSync(path.join(process.cwd(), 'prisma/schema.prisma'), 'utf8')
const migration = fs.readFileSync(path.join(process.cwd(), 'prisma/migrations/20260823143000_add_full_remediation_foundation/migration.sql'), 'utf8')
const rollback = fs.readFileSync(path.join(process.cwd(), 'prisma/migrations/20260823143000_add_full_remediation_foundation/rollback.sql'), 'utf8')
const searchBackfill = fs.readFileSync(path.join(process.cwd(), 'scripts/backfill-search-documents.ts'), 'utf8')
const embeddingBackfill = fs.readFileSync(path.join(process.cwd(), 'scripts/generate-search-embeddings.ts'), 'utf8')
const triggerAlignment = fs.readFileSync(path.join(process.cwd(), 'prisma/migrations/20260823210000_align_search_projection_triggers/migration.sql'), 'utf8')
const aiCron = fs.readFileSync(path.join(process.cwd(), 'app/api/cron/process-ai/route.ts'), 'utf8')

describe('full-remediation database contract', () => {
  it.each([
    'ContentSource',
    'SystemCitation',
    'ExplainerCitation',
    'MediaAsset',
    'EventCluster',
    'SearchDocument',
    'NewsletterIssue',
    'NewsletterDelivery',
  ])('defines the %s model', (modelName) => {
    expect(schema).toContain(`model ${modelName} {`)
  })

  it('stores explicit weekly digest and breaking-alert consent separately', () => {
    expect(schema).toMatch(/weeklyDigestEnabled\s+Boolean\s+@default\(false\)/)
    expect(schema).toMatch(/breakingAlertsEnabled\s+Boolean\s+@default\(false\)/)
    expect(schema).toMatch(/breakingAlertsConsentedAt\s+DateTime\?/)
  })

  it('stores article quality lifecycle data without deleting source articles', () => {
    expect(schema).toMatch(/eventClusterId\s+String\?/)
    expect(schema).toMatch(/relevanceScore\s+Float\?/)
    expect(schema).toMatch(/aiFailureCode\s+String\?/)
    expect(schema).toMatch(/aiQuarantinedAt\s+DateTime\?/)
    expect(schema).toMatch(/categoryOrigin\s+String/)
    expect(schema).toMatch(/generatedContent\s+Boolean\s+@default\(false\)/)
    expect(migration).toContain('"generatedContent" BOOLEAN NOT NULL DEFAULT false')
  })

  it('requires an out-of-repository search projection checkpoint before apply', () => {
    const projectionAuthorization = fs.readFileSync(path.join(process.cwd(), 'lib/search/search-projection-authorization.ts'), 'utf8')
    expect(projectionAuthorization).toContain('--apply requires an absolute --export path')
    expect(projectionAuthorization).toContain('--production-approved')
    expect(projectionAuthorization).toContain('stale deletion remains prohibited')
    expect(searchBackfill).toContain("mode: 0o600")
    expect(searchBackfill).toContain('dronewire-disposable-restore-only')
    expect(searchBackfill).toContain('fs.realpath')
    expect(searchBackfill).toContain('"embedding"::text AS "embedding"')
    expect(searchBackfill).toContain("{ flag: 'wx', mode: 0o600 }")
  })

  it('keeps projection, stale deletion, and embedding generation as explicit separate operations', () => {
    expect(searchBackfill).not.toContain("from 'openai'")
    expect(searchBackfill).not.toContain('embeddings.create')
    expect(searchBackfill).toContain("value === 'projection'")
    expect(searchBackfill).toContain("value === 'delete-stale'")
    expect(embeddingBackfill).toContain('--provider-approved')
    expect(embeddingBackfill).toContain('isLocalDatabaseUrl(process.env.DATABASE_URL)')
    expect(aiCron).not.toContain('refreshMissingSearchEmbeddings')
  })

  it('aligns database triggers with deterministic projection metadata', () => {
    expect(triggerAlignment).toContain('COALESCE(NEW."topics", ARRAY[]::TEXT[])')
    expect(triggerAlignment).toContain('NEW."country"')
    expect(triggerAlignment).toContain('array_to_string(NEW."relatedSystems", \' \')')
    expect(triggerAlignment).toContain("'/contracts?search=' || NEW.\"contractNumber\"")
  })

})
