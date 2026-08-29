import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const container = process.env.DRONEWIRE_FOUNDATION_TEST_CONTAINER
const describeWithRestore = container ? describe : describe.skip

const baselineDatabase = 'dronewire_foundation_test_baseline'
const testDatabase = 'dronewire_foundation_test_case'
const migrationPath = path.join(
  process.cwd(),
  'prisma/migrations/20260823143000_add_full_remediation_foundation/migration.sql',
)
const rollbackPath = path.join(
  process.cwd(),
  'prisma/migrations/20260823143000_add_full_remediation_foundation/rollback.sql',
)
const triggerAlignmentPath = path.join(
  process.cwd(),
  'prisma/migrations/20260823210000_align_search_projection_triggers/migration.sql',
)

function dockerPsql(database: string, sql: string): string {
  if (container !== 'dronewire-foundation-restore') {
    throw new Error('Foundation migration integration tests require the named disposable local restore container')
  }

  return execFileSync(
    'docker',
    ['exec', '-i', container, 'psql', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', database, '-Atq'],
    { encoding: 'utf8', input: sql, maxBuffer: 16 * 1024 * 1024 },
  ).trim()
}

function admin(sql: string): string {
  return dockerPsql('template1', sql)
}

function runFile(database: string, filePath: string): string {
  return dockerPsql(database, fs.readFileSync(filePath, 'utf8'))
}

function runFileExpectingFailure(database: string, filePath: string): string {
  if (container !== 'dronewire-foundation-restore') {
    throw new Error('Foundation migration integration tests require the named disposable local restore container')
  }

  const result = spawnSync(
    'docker',
    ['exec', '-i', container, 'psql', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', database, '-Atq'],
    { encoding: 'utf8', input: fs.readFileSync(filePath, 'utf8'), maxBuffer: 16 * 1024 * 1024 },
  )

  expect(result.status).not.toBe(0)
  return `${result.stdout}\n${result.stderr}`
}

function resetTestDatabase(): void {
  admin(`
    DROP DATABASE IF EXISTS ${testDatabase} WITH (FORCE);
    CREATE DATABASE ${testDatabase} TEMPLATE ${baselineDatabase};
  `)
}

function hashState(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function contractState(database = testDatabase): string {
  return hashState(dockerPsql(database, `
    COPY (
      SELECT "id", "status", "updatedAt"
      FROM public."contracts"
      ORDER BY "id"
    ) TO STDOUT WITH (FORMAT csv);
  `))
}

function subscriberState(database = testDatabase): string {
  return hashState(dockerPsql(database, `
    COPY (
      SELECT "id", "status", "alertsEnabled", "alertCategories", "alertFrequency", "minConfidence", "updatedAt"
      FROM public."newsletter_subscribers"
      ORDER BY "id"
    ) TO STDOUT WITH (FORMAT csv);
  `))
}

function expectPristineRestoreBaseline(): void {
  expect(dockerPsql('postgres', `
    SELECT
      (SELECT count(*) FROM public."articles") || ',' ||
      (SELECT count(*) FROM public."contracts") || ',' ||
      (SELECT count(*) FROM public."systems") || ',' ||
      (SELECT count(*) FROM public."explainers") || ',' ||
      (SELECT count(*) FROM public."rss_feeds") || ',' ||
      (SELECT count(*) FROM public."contracts" WHERE "status" = 'active') || ',' ||
      (SELECT count(*) FROM public."newsletter_subscribers" WHERE "status" = 'active') || ',' ||
      (SELECT count(*) FROM public."newsletter_subscribers" WHERE "alertsEnabled" IS TRUE);
  `)).toBe('4845,228,111,40,13,228,3,3')
  expect(dockerPsql('postgres', `
    SELECT count(*)
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (
        (table_name = 'newsletter_subscribers' AND column_name IN (
          'weeklyDigestEnabled', 'breakingAlertsEnabled', 'breakingAlertsConsentedAt', 'preferenceTokenRevision'
        ))
        OR (table_name = 'articles' AND column_name IN ('topics', 'categoryOrigin', 'provenanceLabel'))
      );
  `)).toBe('0')
  expect(dockerPsql('postgres', `
    SELECT string_agg(extname, ',' ORDER BY extname)
    FROM pg_extension
    WHERE extname IN ('pg_trgm', 'vector');
  `)).toBe('pg_trgm,vector')
}

describeWithRestore('foundation migration on the disposable local restore', () => {
  jest.setTimeout(120_000)

  beforeAll(() => {
    expectPristineRestoreBaseline()
    admin(`
      DROP DATABASE IF EXISTS ${testDatabase} WITH (FORCE);
      DROP DATABASE IF EXISTS ${baselineDatabase} WITH (FORCE);
      CREATE DATABASE ${baselineDatabase} TEMPLATE postgres;
    `)
  })

  afterAll(() => {
    admin(`
      DROP DATABASE IF EXISTS ${testDatabase} WITH (FORCE);
      DROP DATABASE IF EXISTS ${baselineDatabase} WITH (FORCE);
    `)
  })

  beforeEach(() => {
    resetTestDatabase()
  })

  it('preserves contract statuses and existing subscriber preferences without implicit opt-in', () => {
    const contractsBefore = contractState()
    const subscribersBefore = subscriberState()

    runFile(testDatabase, migrationPath)

    expect(contractState()).toBe(contractsBefore)
    expect(subscriberState()).toBe(subscribersBefore)
    expect(dockerPsql(testDatabase, `
      SELECT count(*)
      FROM public."newsletter_subscribers"
      WHERE "weeklyDigestEnabled" IS TRUE
         OR "breakingAlertsEnabled" IS TRUE
         OR "breakingAlertsConsentedAt" IS NOT NULL
         OR "preferenceTokenRevision" <> 0;
    `)).toBe('0')
    expect(dockerPsql(testDatabase, `
      SELECT column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'contracts' AND column_name = 'status';
    `)).toBe("'active'::text")
    expect(dockerPsql(testDatabase, `
      SELECT column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'newsletter_subscribers' AND column_name = 'alertsEnabled';
    `)).toBe('true')
  })

  it('creates the empty foundation objects with extensions, indexes, triggers, and foreign keys', () => {
    runFile(testDatabase, migrationPath)

    expect(dockerPsql(testDatabase, `
      SELECT string_agg(extname, ',' ORDER BY extname)
      FROM pg_extension
      WHERE extname IN ('pg_trgm', 'vector');
    `)).toBe('pg_trgm,vector')
    expect(dockerPsql(testDatabase, `
      SELECT string_agg(relname, ',' ORDER BY relname)
      FROM pg_class
      WHERE relnamespace = 'public'::regnamespace
        AND relkind = 'r'
        AND relname IN (
          'content_sources', 'system_citations', 'explainer_citations', 'media_assets',
          'search_documents', 'newsletter_issues', 'newsletter_deliveries', 'event_clusters'
        );
    `)).toBe('content_sources,event_clusters,explainer_citations,media_assets,newsletter_deliveries,newsletter_issues,search_documents,system_citations')
    expect(dockerPsql(testDatabase, `
      SELECT sum(row_count)
      FROM (
        SELECT count(*) AS row_count FROM public."content_sources"
        UNION ALL SELECT count(*) FROM public."system_citations"
        UNION ALL SELECT count(*) FROM public."explainer_citations"
        UNION ALL SELECT count(*) FROM public."media_assets"
        UNION ALL SELECT count(*) FROM public."search_documents"
        UNION ALL SELECT count(*) FROM public."newsletter_issues"
        UNION ALL SELECT count(*) FROM public."newsletter_deliveries"
        UNION ALL SELECT count(*) FROM public."event_clusters"
      ) counts;
    `)).toBe('0')
    expect(dockerPsql(testDatabase, `
      SELECT count(*)
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname IN (
          'search_documents_title_trgm_idx',
          'search_documents_searchable_text_fts_idx',
          'search_documents_searchable_text_trgm_idx',
          'search_documents_embedding_hnsw_idx'
        );
    `)).toBe('4')
    expect(dockerPsql(testDatabase, `
      SELECT count(*)
      FROM pg_trigger
      WHERE NOT tgisinternal
        AND tgname IN (
          'article_search_document_trigger',
          'system_search_document_trigger',
          'explainer_search_document_trigger',
          'contract_search_document_trigger'
        );
    `)).toBe('4')
    expect(dockerPsql(testDatabase, `
      SELECT count(*)
      FROM pg_constraint
      WHERE contype = 'f'
        AND conname IN (
          'articles_eventClusterId_fkey',
          'system_citations_systemId_fkey',
          'system_citations_sourceId_fkey',
          'explainer_citations_explainerId_fkey',
          'explainer_citations_sourceId_fkey',
          'media_assets_sourceId_fkey',
          'media_assets_articleId_fkey',
          'media_assets_systemId_fkey',
          'media_assets_explainerId_fkey',
          'newsletter_deliveries_issueId_fkey',
          'newsletter_deliveries_subscriberId_fkey'
        );
    `)).toBe('11')
  })

  it('keeps search projections empty until source rows change and then synchronizes them', () => {
    runFile(testDatabase, migrationPath)
    runFile(testDatabase, triggerAlignmentPath)

    expect(dockerPsql(testDatabase, 'SELECT count(*) FROM public."search_documents";')).toBe('0')
    dockerPsql(testDatabase, `
      UPDATE public."articles"
      SET "title" = "title" || ' trigger-check', "topics" = ARRAY['article-topic-check']
      WHERE "id" = (SELECT "id" FROM public."articles" WHERE "status" = 'published' ORDER BY "id" LIMIT 1);
    `)
    dockerPsql(testDatabase, `
      UPDATE public."systems"
      SET "name" = "name" || ' trigger-check', "country" = 'country-check',
          "relatedSystems" = ARRAY['system-related-check']
      WHERE "id" = (SELECT "id" FROM public."systems" ORDER BY "id" LIMIT 1);
      UPDATE public."explainers"
      SET "title" = "title" || ' trigger-check', "relatedSystems" = ARRAY['explainer-related-check']
      WHERE "id" = (SELECT "id" FROM public."explainers" ORDER BY "id" LIMIT 1);
      UPDATE public."contracts"
      SET "title" = "title" || ' trigger-check', "contractNumber" = 'TRIGGER-ALIGN-123',
          "office" = 'office-check', "location" = 'location-check',
          "relatedSystems" = ARRAY['contract-related-check']
      WHERE "id" = (SELECT "id" FROM public."contracts" ORDER BY "id" LIMIT 1);
    `)

    expect(dockerPsql(testDatabase, `
      SELECT string_agg("entityType", ',' ORDER BY "entityType")
      FROM public."search_documents";
    `)).toBe('article,contract,explainer,system')
    expect(dockerPsql(testDatabase, `
      SELECT
        (SELECT "aliases" @> ARRAY['article-topic-check'] AND "searchableText" LIKE '%article-topic-check%'
           FROM public."search_documents" WHERE "entityType" = 'article') || ',' ||
        (SELECT "aliases" @> ARRAY['system-related-check'] AND "searchableText" LIKE '%country-check%'
           AND "searchableText" LIKE '%system-related-check%'
           FROM public."search_documents" WHERE "entityType" = 'system') || ',' ||
        (SELECT "aliases" @> ARRAY['explainer-related-check'] AND "searchableText" LIKE '%explainer-related-check%'
           FROM public."search_documents" WHERE "entityType" = 'explainer') || ',' ||
        (SELECT "aliases" @> ARRAY['TRIGGER-ALIGN-123', 'contract-related-check']
           AND "searchableText" LIKE '%office-check%' AND "searchableText" LIKE '%location-check%'
           AND "href" = '/contracts?search=TRIGGER-ALIGN-123'
           FROM public."search_documents" WHERE "entityType" = 'contract');
    `)).toBe('true,true,true,true')
    dockerPsql(testDatabase, `
      UPDATE public."articles"
      SET "status" = 'draft'
      WHERE "id" = (SELECT "entityId" FROM public."search_documents" WHERE "entityType" = 'article' LIMIT 1);
    `)
    expect(dockerPsql(testDatabase, `
      SELECT count(*) FROM public."search_documents" WHERE "entityType" = 'article';
    `)).toBe('0')
  })

  it('blocks rollback after contract status drift without overwriting the changed value', () => {
    runFile(testDatabase, migrationPath)
    const id = dockerPsql(testDatabase, 'SELECT "id" FROM public."contracts" ORDER BY "id" LIMIT 1;')
    dockerPsql(testDatabase, `UPDATE public."contracts" SET "status" = 'manual-drift-test' WHERE "id" = '${id}';`)

    expect(runFileExpectingFailure(testDatabase, rollbackPath)).toContain('contract status changed after migration')
    expect(dockerPsql(testDatabase, `SELECT "status" FROM public."contracts" WHERE "id" = '${id}';`)).toBe('manual-drift-test')
  })

  it.each([
    ['alertsEnabled', '"alertsEnabled" = NOT "alertsEnabled"'],
    ['weeklyDigestEnabled', '"weeklyDigestEnabled" = NOT "weeklyDigestEnabled"'],
    ['breakingAlertsEnabled', '"breakingAlertsEnabled" = NOT "breakingAlertsEnabled"'],
    ['breakingAlertsConsentedAt', '"breakingAlertsConsentedAt" = CURRENT_TIMESTAMP'],
    ['preferenceTokenRevision', '"preferenceTokenRevision" = "preferenceTokenRevision" + 1'],
  ])('blocks rollback after %s drift', (field, assignment) => {
    runFile(testDatabase, migrationPath)
    dockerPsql(testDatabase, `
      UPDATE public."newsletter_subscribers"
      SET ${assignment}
      WHERE "id" = (SELECT "id" FROM public."newsletter_subscribers" ORDER BY "id" LIMIT 1);
    `)

    expect(runFileExpectingFailure(testDatabase, rollbackPath)).toContain(`subscriber ${field} changed after migration`)
  })

  it.each([
    ['article', 'articles', '"provenanceLabel" = \'article-drift-test\''],
    ['system', 'systems', '"provenanceLabel" = \'system-drift-test\''],
    ['explainer', 'explainers', '"provenanceLabel" = \'explainer-drift-test\''],
  ])('blocks rollback after a migrated %s foundation field changes', (entity, table, assignment) => {
    runFile(testDatabase, migrationPath)
    dockerPsql(testDatabase, `
      UPDATE public."${table}"
      SET ${assignment}
      WHERE "id" = (SELECT "id" FROM public."${table}" ORDER BY "id" LIMIT 1);
    `)

    expect(runFileExpectingFailure(testDatabase, rollbackPath)).toContain(`${entity} foundation fields changed after migration`)
  })

  it.each([
    [
      'content source',
      'content_sources',
      `INSERT INTO public."content_sources" (
        "id", "canonicalUrl", "title", "publisher", "sourceType", "updatedAt"
      ) VALUES (
        'rollback-guard-source', 'https://example.test/source', 'Test source', 'Test publisher', 'primary', CURRENT_TIMESTAMP
      );`,
    ],
    [
      'system citation',
      'system_citations',
      `INSERT INTO public."content_sources" (
        "id", "canonicalUrl", "title", "publisher", "sourceType", "updatedAt"
      ) VALUES (
        'rollback-guard-source', 'https://example.test/system-source', 'Test source', 'Test publisher', 'primary', CURRENT_TIMESTAMP
      );
      INSERT INTO public."system_citations" (
        "id", "systemId", "sourceId", "claimKey", "provenanceLabel", "updatedAt"
      ) SELECT 'rollback-guard-system-citation', "id", 'rollback-guard-source', 'status', 'primary-source-backed', CURRENT_TIMESTAMP
        FROM public."systems" ORDER BY "id" LIMIT 1;`,
    ],
    [
      'explainer citation',
      'explainer_citations',
      `INSERT INTO public."content_sources" (
        "id", "canonicalUrl", "title", "publisher", "sourceType", "updatedAt"
      ) VALUES (
        'rollback-guard-source', 'https://example.test/explainer-source', 'Test source', 'Test publisher', 'primary', CURRENT_TIMESTAMP
      );
      INSERT INTO public."explainer_citations" (
        "id", "explainerId", "sourceId", "claimKey", "provenanceLabel", "updatedAt"
      ) SELECT 'rollback-guard-explainer-citation', "id", 'rollback-guard-source', 'overview', 'primary-source-backed', CURRENT_TIMESTAMP
        FROM public."explainers" ORDER BY "id" LIMIT 1;`,
    ],
    [
      'media asset',
      'media_assets',
      `INSERT INTO public."media_assets" (
        "id", "origin", "attribution", "license", "depictedEntity", "storageMode", "updatedAt"
      ) VALUES (
        'rollback-guard-media', 'https://example.test/media', 'Test attribution', 'Test license', 'Test entity', 'remote', CURRENT_TIMESTAMP
      );`,
    ],
    [
      'search document',
      'search_documents',
      `INSERT INTO public."search_documents" (
        "id", "entityType", "entityId", "title", "href", "facets", "searchableText", "sourceUpdatedAt", "updatedAt"
      ) VALUES (
        'rollback-guard-search', 'test', 'rollback-guard-entity', 'Test search', '/test', '{}'::jsonb,
        'test searchable text', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      );`,
    ],
    [
      'event cluster',
      'event_clusters',
      `INSERT INTO public."event_clusters" (
        "id", "fingerprint", "updatedAt"
      ) VALUES (
        'rollback-guard-cluster', 'rollback-guard-fingerprint', CURRENT_TIMESTAMP
      );`,
    ],
  ])('blocks rollback when a foundation %s contains data', (_kind, table, insertSql) => {
    runFile(testDatabase, migrationPath)
    dockerPsql(testDatabase, insertSql)

    expect(runFileExpectingFailure(testDatabase, rollbackPath)).toContain('foundation data exists after migration')
    expect(dockerPsql(testDatabase, `SELECT count(*) FROM public."${table}";`)).not.toBe('0')
  })

  it.each([
    ['issue', false],
    ['delivery', true],
  ])('blocks rollback when a newsletter %s exists', (_kind, includeDelivery) => {
    runFile(testDatabase, migrationPath)
    dockerPsql(testDatabase, `
      INSERT INTO public."newsletter_issues" (
        "id", "weekKey", "coverageStart", "coverageEnd", "selectedContent", "renderedPreview", "updatedAt"
      ) VALUES (
        'rollback-guard-issue', 'rollback-guard-week', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        '{}'::jsonb, 'test preview', CURRENT_TIMESTAMP
      );
      ${includeDelivery ? `
        INSERT INTO public."newsletter_deliveries" (
          "id", "issueId", "subscriberId", "updatedAt"
        ) SELECT 'rollback-guard-delivery', 'rollback-guard-issue', "id", CURRENT_TIMESTAMP
          FROM public."newsletter_subscribers" ORDER BY "id" LIMIT 1;
      ` : ''}
    `)

    expect(runFileExpectingFailure(testDatabase, rollbackPath)).toContain('digest issues or deliveries exist')
  })

  it('clean rollback restores original values, columns, defaults, and foundation schema', () => {
    const contractsBefore = contractState()
    const subscribersBefore = subscriberState()

    runFile(testDatabase, migrationPath)
    runFile(testDatabase, rollbackPath)

    expect(contractState()).toBe(contractsBefore)
    expect(subscriberState()).toBe(subscribersBefore)
    expect(dockerPsql(testDatabase, `
      SELECT count(*)
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND column_name IN (
          'weeklyDigestEnabled', 'breakingAlertsEnabled', 'breakingAlertsConsentedAt',
          'preferenceTokenRevision', 'categoryOrigin', 'classificationLabel', 'provenanceLabel'
        );
    `)).toBe('0')
    expect(dockerPsql(testDatabase, `
      SELECT count(*)
      FROM pg_class
      WHERE relnamespace = 'public'::regnamespace
        AND relname IN (
          'content_sources', 'system_citations', 'explainer_citations', 'media_assets',
          'search_documents', 'newsletter_issues', 'newsletter_deliveries', 'event_clusters'
        );
    `)).toBe('0')
    expect(dockerPsql(testDatabase, `
      SELECT column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'contracts' AND column_name = 'status';
    `)).toBe("'active'::text")
    expect(dockerPsql(testDatabase, `
      SELECT column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'newsletter_subscribers' AND column_name = 'alertsEnabled';
    `)).toBe('true')
  })

  it('fails a second migration run before making destructive changes', () => {
    runFile(testDatabase, migrationPath)
    const contractsAfterFirstRun = contractState()
    const subscribersAfterFirstRun = subscriberState()
    const foundationCountsAfterFirstRun = dockerPsql(testDatabase, `
      SELECT (SELECT count(*) FROM public."search_documents") || ',' ||
             (SELECT count(*) FROM public."newsletter_issues") || ',' ||
             (SELECT count(*) FROM public."newsletter_deliveries");
    `)

    runFileExpectingFailure(testDatabase, migrationPath)

    expect(contractState()).toBe(contractsAfterFirstRun)
    expect(subscriberState()).toBe(subscribersAfterFirstRun)
    expect(dockerPsql(testDatabase, `
      SELECT (SELECT count(*) FROM public."search_documents") || ',' ||
             (SELECT count(*) FROM public."newsletter_issues") || ',' ||
             (SELECT count(*) FROM public."newsletter_deliveries");
    `)).toBe(foundationCountsAfterFirstRun)
  })

  it('refuses a pre-existing search function name collision without overwriting it', () => {
    dockerPsql(testDatabase, `
      CREATE FUNCTION public.sync_article_search_document() RETURNS trigger AS $function$
      BEGIN
        RETURN NEW;
      END;
      $function$ LANGUAGE plpgsql;
    `)
    const functionBefore = dockerPsql(testDatabase, `
      SELECT pg_get_functiondef('public.sync_article_search_document()'::regprocedure);
    `)

    runFileExpectingFailure(testDatabase, migrationPath)

    expect(dockerPsql(testDatabase, `
      SELECT pg_get_functiondef('public.sync_article_search_document()'::regprocedure);
    `)).toBe(functionBefore)
    expect(dockerPsql(testDatabase, `
      SELECT count(*)
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'topics';
    `)).toBe('0')
  })
})
