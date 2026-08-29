BEGIN;

SET LOCAL lock_timeout = '10s';

LOCK TABLE
  "contracts",
  "newsletter_subscribers",
  "articles",
  "systems",
  "explainers",
  "event_clusters",
  "content_sources",
  "system_citations",
  "explainer_citations",
  "media_assets",
  "search_documents",
  "newsletter_issues",
  "newsletter_deliveries",
  "foundation_rollback_guard_checksums"
  IN SHARE ROW EXCLUSIVE MODE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "newsletter_issues")
     OR EXISTS (SELECT 1 FROM "newsletter_deliveries") THEN
    RAISE EXCEPTION 'Foundation rollback refused: digest issues or deliveries exist; use a forward corrective migration';
  END IF;

  IF (SELECT "checksum" FROM "foundation_rollback_guard_checksums" WHERE "fieldName" = 'contracts.status')
     IS DISTINCT FROM
     (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "status") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "contracts") THEN
    RAISE EXCEPTION 'Foundation rollback refused: contract status changed after migration; use a forward corrective migration';
  END IF;

  IF (SELECT "checksum" FROM "foundation_rollback_guard_checksums" WHERE "fieldName" = 'newsletter_subscribers.alertsEnabled')
     IS DISTINCT FROM
     (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "alertsEnabled") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "newsletter_subscribers") THEN
    RAISE EXCEPTION 'Foundation rollback refused: subscriber alertsEnabled changed after migration; use a forward corrective migration';
  END IF;

  IF (SELECT "checksum" FROM "foundation_rollback_guard_checksums" WHERE "fieldName" = 'newsletter_subscribers.weeklyDigestEnabled')
     IS DISTINCT FROM
     (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "weeklyDigestEnabled") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "newsletter_subscribers") THEN
    RAISE EXCEPTION 'Foundation rollback refused: subscriber weeklyDigestEnabled changed after migration; use a forward corrective migration';
  END IF;

  IF (SELECT "checksum" FROM "foundation_rollback_guard_checksums" WHERE "fieldName" = 'newsletter_subscribers.breakingAlertsEnabled')
     IS DISTINCT FROM
     (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "breakingAlertsEnabled") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "newsletter_subscribers") THEN
    RAISE EXCEPTION 'Foundation rollback refused: subscriber breakingAlertsEnabled changed after migration; use a forward corrective migration';
  END IF;

  IF (SELECT "checksum" FROM "foundation_rollback_guard_checksums" WHERE "fieldName" = 'newsletter_subscribers.breakingAlertsConsentedAt')
     IS DISTINCT FROM
     (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "breakingAlertsConsentedAt") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "newsletter_subscribers") THEN
    RAISE EXCEPTION 'Foundation rollback refused: subscriber breakingAlertsConsentedAt changed after migration; use a forward corrective migration';
  END IF;

  IF (SELECT "checksum" FROM "foundation_rollback_guard_checksums" WHERE "fieldName" = 'newsletter_subscribers.preferenceTokenRevision')
     IS DISTINCT FROM
     (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "preferenceTokenRevision") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "newsletter_subscribers") THEN
    RAISE EXCEPTION 'Foundation rollback refused: subscriber preferenceTokenRevision changed after migration; use a forward corrective migration';
  END IF;

  IF (SELECT "checksum" FROM "foundation_rollback_guard_checksums" WHERE "fieldName" = 'articles.foundationFields')
     IS DISTINCT FROM
     (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array(
       "id", "topics", "categoryOrigin", "classificationLabel", "provenanceLabel", "aiProcessedAt",
       "aiLastAttemptAt", "aiNextRetryAt", "aiFailureCode", "aiQuarantinedAt", "aiProcessingStartedAt",
       "generatedContent", "eventClusterId", "isClusterRepresentative", "relevanceScore", "exclusionReason"
     ) ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "articles") THEN
    RAISE EXCEPTION 'Foundation rollback refused: article foundation fields changed after migration; use a forward corrective migration';
  END IF;

  IF (SELECT "checksum" FROM "foundation_rollback_guard_checksums" WHERE "fieldName" = 'systems.provenanceLabel')
     IS DISTINCT FROM
     (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "provenanceLabel") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "systems") THEN
    RAISE EXCEPTION 'Foundation rollback refused: system foundation fields changed after migration; use a forward corrective migration';
  END IF;

  IF (SELECT "checksum" FROM "foundation_rollback_guard_checksums" WHERE "fieldName" = 'explainers.provenanceLabel')
     IS DISTINCT FROM
     (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "provenanceLabel") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "explainers") THEN
    RAISE EXCEPTION 'Foundation rollback refused: explainer foundation fields changed after migration; use a forward corrective migration';
  END IF;

  IF EXISTS (SELECT 1 FROM "event_clusters")
     OR EXISTS (SELECT 1 FROM "content_sources")
     OR EXISTS (SELECT 1 FROM "system_citations")
     OR EXISTS (SELECT 1 FROM "explainer_citations")
     OR EXISTS (SELECT 1 FROM "media_assets")
     OR EXISTS (SELECT 1 FROM "search_documents") THEN
    RAISE EXCEPTION 'Foundation rollback refused: foundation data exists after migration; use a forward corrective migration';
  END IF;
END $$;

DROP TRIGGER IF EXISTS article_search_document_trigger ON "articles";
DROP TRIGGER IF EXISTS system_search_document_trigger ON "systems";
DROP TRIGGER IF EXISTS explainer_search_document_trigger ON "explainers";
DROP TRIGGER IF EXISTS contract_search_document_trigger ON "contracts";
DROP FUNCTION IF EXISTS sync_article_search_document();
DROP FUNCTION IF EXISTS sync_system_search_document();
DROP FUNCTION IF EXISTS sync_explainer_search_document();
DROP FUNCTION IF EXISTS sync_contract_search_document();

DROP TABLE IF EXISTS "newsletter_deliveries";
DROP TABLE IF EXISTS "newsletter_issues";
DROP TABLE IF EXISTS "search_documents";
DROP TABLE IF EXISTS "media_assets";
DROP TABLE IF EXISTS "explainer_citations";
DROP TABLE IF EXISTS "system_citations";
DROP TABLE IF EXISTS "content_sources";

ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "articles_eventClusterId_fkey";
DROP TABLE IF EXISTS "event_clusters";

ALTER TABLE "articles"
  DROP COLUMN IF EXISTS "topics",
  DROP COLUMN IF EXISTS "categoryOrigin",
  DROP COLUMN IF EXISTS "classificationLabel",
  DROP COLUMN IF EXISTS "provenanceLabel",
  DROP COLUMN IF EXISTS "aiProcessedAt",
  DROP COLUMN IF EXISTS "aiLastAttemptAt",
  DROP COLUMN IF EXISTS "aiNextRetryAt",
  DROP COLUMN IF EXISTS "aiFailureCode",
  DROP COLUMN IF EXISTS "aiQuarantinedAt",
  DROP COLUMN IF EXISTS "aiProcessingStartedAt",
  DROP COLUMN IF EXISTS "generatedContent",
  DROP COLUMN IF EXISTS "eventClusterId",
  DROP COLUMN IF EXISTS "isClusterRepresentative",
  DROP COLUMN IF EXISTS "relevanceScore",
  DROP COLUMN IF EXISTS "exclusionReason";

ALTER TABLE "systems" DROP COLUMN IF EXISTS "provenanceLabel";
ALTER TABLE "explainers" DROP COLUMN IF EXISTS "provenanceLabel";

ALTER TABLE "newsletter_subscribers"
  DROP COLUMN IF EXISTS "weeklyDigestEnabled",
  DROP COLUMN IF EXISTS "breakingAlertsEnabled",
  DROP COLUMN IF EXISTS "breakingAlertsConsentedAt",
  DROP COLUMN IF EXISTS "preferenceTokenRevision";

DROP TABLE IF EXISTS "foundation_rollback_guard_checksums";

-- pg_trgm is intentionally retained because other schemas in the database may use it.

COMMIT;
