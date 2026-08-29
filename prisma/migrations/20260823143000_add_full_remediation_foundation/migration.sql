BEGIN;

SET LOCAL lock_timeout = '10s';

CREATE EXTENSION IF NOT EXISTS "pg_trgm";

ALTER TABLE "articles"
  ADD COLUMN "topics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "categoryOrigin" TEXT NOT NULL DEFAULT 'legacy',
  ADD COLUMN "classificationLabel" TEXT NOT NULL DEFAULT 'unverified',
  ADD COLUMN "provenanceLabel" TEXT NOT NULL DEFAULT 'unverified',
  ADD COLUMN "aiProcessedAt" TIMESTAMP(3),
  ADD COLUMN "aiLastAttemptAt" TIMESTAMP(3),
  ADD COLUMN "aiNextRetryAt" TIMESTAMP(3),
  ADD COLUMN "aiFailureCode" TEXT,
  ADD COLUMN "aiQuarantinedAt" TIMESTAMP(3),
  ADD COLUMN "aiProcessingStartedAt" TIMESTAMP(3),
  ADD COLUMN "generatedContent" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "eventClusterId" TEXT,
  ADD COLUMN "isClusterRepresentative" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "relevanceScore" DOUBLE PRECISION,
  ADD COLUMN "exclusionReason" TEXT;

ALTER TABLE "systems"
  ADD COLUMN "provenanceLabel" TEXT NOT NULL DEFAULT 'unverified';

ALTER TABLE "explainers"
  ADD COLUMN "provenanceLabel" TEXT NOT NULL DEFAULT 'unverified';

ALTER TABLE "newsletter_subscribers"
  ADD COLUMN "weeklyDigestEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "breakingAlertsEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "breakingAlertsConsentedAt" TIMESTAMP(3),
  ADD COLUMN "preferenceTokenRevision" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "foundation_rollback_guard_checksums" (
  "fieldName" TEXT NOT NULL,
  "checksum" TEXT NOT NULL,
  CONSTRAINT "foundation_rollback_guard_checksums_pkey" PRIMARY KEY ("fieldName")
);

INSERT INTO "foundation_rollback_guard_checksums" ("fieldName", "checksum")
VALUES
  (
    'contracts.status',
    (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "status") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "contracts")
  ),
  (
    'newsletter_subscribers.alertsEnabled',
    (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "alertsEnabled") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "newsletter_subscribers")
  ),
  (
    'newsletter_subscribers.weeklyDigestEnabled',
    (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "weeklyDigestEnabled") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "newsletter_subscribers")
  ),
  (
    'newsletter_subscribers.breakingAlertsEnabled',
    (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "breakingAlertsEnabled") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "newsletter_subscribers")
  ),
  (
    'newsletter_subscribers.breakingAlertsConsentedAt',
    (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "breakingAlertsConsentedAt") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "newsletter_subscribers")
  ),
  (
    'newsletter_subscribers.preferenceTokenRevision',
    (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "preferenceTokenRevision") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "newsletter_subscribers")
  ),
  (
    'articles.foundationFields',
    (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array(
      "id", "topics", "categoryOrigin", "classificationLabel", "provenanceLabel", "aiProcessedAt",
      "aiLastAttemptAt", "aiNextRetryAt", "aiFailureCode", "aiQuarantinedAt", "aiProcessingStartedAt",
      "generatedContent", "eventClusterId", "isClusterRepresentative", "relevanceScore", "exclusionReason"
    ) ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "articles")
  ),
  (
    'systems.provenanceLabel',
    (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "provenanceLabel") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "systems")
  ),
  (
    'explainers.provenanceLabel',
    (SELECT encode(sha256(convert_to(COALESCE(jsonb_agg(jsonb_build_array("id", "provenanceLabel") ORDER BY "id"), '[]'::jsonb)::text, 'UTF8')), 'hex') FROM "explainers")
  );

CREATE TABLE "event_clusters" (
  "id" TEXT NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "representativeArticleId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "event_clusters_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "content_sources" (
  "id" TEXT NOT NULL,
  "canonicalUrl" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "publisher" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "publicationDate" TIMESTAMP(3),
  "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "license" TEXT,
  "archiveUrl" TEXT,
  "linkHealthStatus" TEXT NOT NULL DEFAULT 'unchecked',
  "lastCheckedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "content_sources_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "system_citations" (
  "id" TEXT NOT NULL,
  "systemId" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "claimKey" TEXT NOT NULL,
  "evidenceText" TEXT,
  "stance" TEXT NOT NULL DEFAULT 'supports',
  "provenanceLabel" TEXT NOT NULL,
  "lastCheckedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "system_citations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "explainer_citations" (
  "id" TEXT NOT NULL,
  "explainerId" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "claimKey" TEXT NOT NULL,
  "evidenceText" TEXT,
  "stance" TEXT NOT NULL DEFAULT 'supports',
  "provenanceLabel" TEXT NOT NULL,
  "lastCheckedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "explainer_citations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "media_assets" (
  "id" TEXT NOT NULL,
  "controlledUrl" TEXT,
  "remoteUrl" TEXT,
  "origin" TEXT NOT NULL,
  "attribution" TEXT NOT NULL,
  "license" TEXT NOT NULL,
  "depictedEntity" TEXT NOT NULL,
  "depictedVariant" TEXT,
  "checksum" TEXT,
  "storageMode" TEXT NOT NULL,
  "verificationState" TEXT NOT NULL DEFAULT 'unverified',
  "mimeType" TEXT,
  "width" INTEGER,
  "height" INTEGER,
  "lastCheckedAt" TIMESTAMP(3),
  "sourceId" TEXT,
  "articleId" TEXT,
  "systemId" TEXT,
  "explainerId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "search_documents" (
  "id" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "href" TEXT NOT NULL,
  "aliases" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "category" TEXT,
  "imageUrl" TEXT,
  "facets" JSONB NOT NULL,
  "searchableText" TEXT NOT NULL,
  "provenanceLabel" TEXT NOT NULL DEFAULT 'unverified',
  "embedding" vector(1536),
  "sourceUpdatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "search_documents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "newsletter_issues" (
  "id" TEXT NOT NULL,
  "weekKey" TEXT NOT NULL,
  "coverageStart" TIMESTAMP(3) NOT NULL,
  "coverageEnd" TIMESTAMP(3) NOT NULL,
  "selectedContent" JSONB NOT NULL,
  "renderedPreview" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'preview',
  "eligibleCount" INTEGER NOT NULL DEFAULT 0,
  "deliveredCount" INTEGER NOT NULL DEFAULT 0,
  "failedCount" INTEGER NOT NULL DEFAULT 0,
  "failureSummary" TEXT,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "sendStartedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "newsletter_issues_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "newsletter_deliveries" (
  "id" TEXT NOT NULL,
  "issueId" TEXT NOT NULL,
  "subscriberId" TEXT NOT NULL,
  "providerMessageId" TEXT,
  "attemptCount" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "errorCode" TEXT,
  "lastAttemptAt" TIMESTAMP(3),
  "deliveredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "newsletter_deliveries_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "event_clusters_fingerprint_key" ON "event_clusters"("fingerprint");
CREATE INDEX "event_clusters_representativeArticleId_idx" ON "event_clusters"("representativeArticleId");
CREATE UNIQUE INDEX "content_sources_canonicalUrl_key" ON "content_sources"("canonicalUrl");
CREATE INDEX "content_sources_publisher_idx" ON "content_sources"("publisher");
CREATE INDEX "content_sources_sourceType_idx" ON "content_sources"("sourceType");
CREATE INDEX "content_sources_linkHealthStatus_idx" ON "content_sources"("linkHealthStatus");
CREATE UNIQUE INDEX "system_citations_systemId_sourceId_claimKey_key" ON "system_citations"("systemId", "sourceId", "claimKey");
CREATE INDEX "system_citations_systemId_claimKey_idx" ON "system_citations"("systemId", "claimKey");
CREATE INDEX "system_citations_sourceId_idx" ON "system_citations"("sourceId");
CREATE UNIQUE INDEX "explainer_citations_explainerId_sourceId_claimKey_key" ON "explainer_citations"("explainerId", "sourceId", "claimKey");
CREATE INDEX "explainer_citations_explainerId_claimKey_idx" ON "explainer_citations"("explainerId", "claimKey");
CREATE INDEX "explainer_citations_sourceId_idx" ON "explainer_citations"("sourceId");
CREATE INDEX "media_assets_systemId_idx" ON "media_assets"("systemId");
CREATE INDEX "media_assets_explainerId_idx" ON "media_assets"("explainerId");
CREATE INDEX "media_assets_articleId_idx" ON "media_assets"("articleId");
CREATE INDEX "media_assets_verificationState_idx" ON "media_assets"("verificationState");
CREATE UNIQUE INDEX "search_documents_entityType_entityId_key" ON "search_documents"("entityType", "entityId");
CREATE INDEX "search_documents_entityType_idx" ON "search_documents"("entityType");
CREATE INDEX "search_documents_category_idx" ON "search_documents"("category");
CREATE INDEX "search_documents_provenanceLabel_idx" ON "search_documents"("provenanceLabel");
CREATE INDEX "search_documents_title_trgm_idx" ON "search_documents" USING GIN ("title" gin_trgm_ops);
CREATE INDEX "search_documents_searchable_text_fts_idx" ON "search_documents" USING GIN (to_tsvector('english', "searchableText"));
CREATE INDEX "search_documents_searchable_text_trgm_idx" ON "search_documents" USING GIN ("searchableText" gin_trgm_ops);
CREATE INDEX "search_documents_embedding_hnsw_idx" ON "search_documents" USING hnsw ("embedding" vector_cosine_ops);
CREATE UNIQUE INDEX "newsletter_issues_weekKey_key" ON "newsletter_issues"("weekKey");
CREATE INDEX "newsletter_issues_status_idx" ON "newsletter_issues"("status");
CREATE INDEX "newsletter_issues_coverageStart_coverageEnd_idx" ON "newsletter_issues"("coverageStart", "coverageEnd");
CREATE UNIQUE INDEX "newsletter_deliveries_issueId_subscriberId_key" ON "newsletter_deliveries"("issueId", "subscriberId");
CREATE INDEX "newsletter_deliveries_status_lastAttemptAt_idx" ON "newsletter_deliveries"("status", "lastAttemptAt");
CREATE INDEX "newsletter_deliveries_subscriberId_idx" ON "newsletter_deliveries"("subscriberId");
CREATE INDEX "articles_eventClusterId_isClusterRepresentative_idx" ON "articles"("eventClusterId", "isClusterRepresentative");
CREATE INDEX "articles_relevanceScore_idx" ON "articles"("relevanceScore");
CREATE INDEX "articles_aiNextRetryAt_aiQuarantinedAt_idx" ON "articles"("aiNextRetryAt", "aiQuarantinedAt");
CREATE INDEX "articles_aiProcessingStartedAt_idx" ON "articles"("aiProcessingStartedAt");

ALTER TABLE "articles" ADD CONSTRAINT "articles_eventClusterId_fkey" FOREIGN KEY ("eventClusterId") REFERENCES "event_clusters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "system_citations" ADD CONSTRAINT "system_citations_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "systems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "system_citations" ADD CONSTRAINT "system_citations_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "content_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "explainer_citations" ADD CONSTRAINT "explainer_citations_explainerId_fkey" FOREIGN KEY ("explainerId") REFERENCES "explainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "explainer_citations" ADD CONSTRAINT "explainer_citations_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "content_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "content_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "systems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_explainerId_fkey" FOREIGN KEY ("explainerId") REFERENCES "explainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "newsletter_deliveries" ADD CONSTRAINT "newsletter_deliveries_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "newsletter_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "newsletter_deliveries" ADD CONSTRAINT "newsletter_deliveries_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "newsletter_subscribers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE FUNCTION sync_article_search_document() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM "search_documents" WHERE "entityType" = 'article' AND "entityId" = OLD."id";
    RETURN OLD;
  END IF;
  IF NEW."status" <> 'published' THEN
    DELETE FROM "search_documents" WHERE "entityType" = 'article' AND "entityId" = NEW."id";
    RETURN NEW;
  END IF;
  INSERT INTO "search_documents" ("id", "entityType", "entityId", "title", "href", "aliases", "facets", "searchableText", "category", "imageUrl", "provenanceLabel", "sourceUpdatedAt", "createdAt", "updatedAt")
  VALUES ('article:' || NEW."id", 'article', NEW."id", NEW."title", '/articles/' || NEW."id", ARRAY[]::TEXT[], jsonb_build_object('source', NEW."sourceName"), concat_ws(' ', NEW."title", NEW."excerpt", NEW."aiSummary", NEW."content", NEW."sourceName", array_to_string(NEW."topics", ' ')), NEW."category", NEW."imageUrl", NEW."provenanceLabel", NEW."updatedAt", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  ON CONFLICT ("entityType", "entityId") DO UPDATE SET "title" = EXCLUDED."title", "href" = EXCLUDED."href", "aliases" = EXCLUDED."aliases", "facets" = EXCLUDED."facets", "searchableText" = EXCLUDED."searchableText", "category" = EXCLUDED."category", "imageUrl" = EXCLUDED."imageUrl", "provenanceLabel" = EXCLUDED."provenanceLabel", "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt", "embedding" = NULL, "updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION sync_system_search_document() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN DELETE FROM "search_documents" WHERE "entityType" = 'system' AND "entityId" = OLD."id"; RETURN OLD; END IF;
  INSERT INTO "search_documents" ("id", "entityType", "entityId", "title", "aliases", "facets", "searchableText", "category", "imageUrl", "provenanceLabel", "sourceUpdatedAt", "createdAt", "updatedAt", "href")
  VALUES ('system:' || NEW."id", 'system', NEW."id", NEW."name", array_prepend(NEW."slug", NEW."relatedSystems"), jsonb_build_object('manufacturer', NEW."manufacturer", 'country', NEW."country", 'status', NEW."status"), concat_ws(' ', NEW."name", NEW."description", NEW."content", NEW."manufacturer", array_to_string(NEW."specifications", ' ')), NEW."category", NEW."imageUrl", NEW."provenanceLabel", NEW."updatedAt", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '/systems/' || NEW."slug")
  ON CONFLICT ("entityType", "entityId") DO UPDATE SET "title" = EXCLUDED."title", "href" = EXCLUDED."href", "aliases" = EXCLUDED."aliases", "facets" = EXCLUDED."facets", "searchableText" = EXCLUDED."searchableText", "category" = EXCLUDED."category", "imageUrl" = EXCLUDED."imageUrl", "provenanceLabel" = EXCLUDED."provenanceLabel", "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt", "embedding" = NULL, "updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION sync_explainer_search_document() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN DELETE FROM "search_documents" WHERE "entityType" = 'explainer' AND "entityId" = OLD."id"; RETURN OLD; END IF;
  INSERT INTO "search_documents" ("id", "entityType", "entityId", "title", "aliases", "facets", "searchableText", "category", "imageUrl", "provenanceLabel", "sourceUpdatedAt", "createdAt", "updatedAt", "href")
  VALUES ('explainer:' || NEW."id", 'explainer', NEW."id", NEW."title", array_prepend(NEW."slug", NEW."relatedSystems"), jsonb_build_object('difficulty', NEW."difficulty"), concat_ws(' ', NEW."title", NEW."description", NEW."content", array_to_string(NEW."keyFeatures", ' ')), NEW."category", NEW."imageUrl", NEW."provenanceLabel", NEW."updatedAt", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '/explainers/' || NEW."slug")
  ON CONFLICT ("entityType", "entityId") DO UPDATE SET "title" = EXCLUDED."title", "href" = EXCLUDED."href", "aliases" = EXCLUDED."aliases", "facets" = EXCLUDED."facets", "searchableText" = EXCLUDED."searchableText", "category" = EXCLUDED."category", "imageUrl" = EXCLUDED."imageUrl", "provenanceLabel" = EXCLUDED."provenanceLabel", "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt", "embedding" = NULL, "updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION sync_contract_search_document() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN DELETE FROM "search_documents" WHERE "entityType" = 'contract' AND "entityId" = OLD."id"; RETURN OLD; END IF;
  INSERT INTO "search_documents" ("id", "entityType", "entityId", "title", "aliases", "facets", "searchableText", "category", "imageUrl", "provenanceLabel", "sourceUpdatedAt", "createdAt", "updatedAt", "href")
  VALUES ('contract:' || NEW."id", 'contract', NEW."id", NEW."title", CASE WHEN NEW."contractNumber" IS NULL THEN ARRAY[]::TEXT[] ELSE ARRAY[NEW."contractNumber"] END, jsonb_build_object('agency', NEW."agency", 'company', NEW."company", 'status', NEW."status"), concat_ws(' ', NEW."title", NEW."description", NEW."company", NEW."agency", NEW."contractNumber"), NEW."category", NULL, CASE WHEN NEW."sourceUrl" IS NULL THEN 'unverified' ELSE 'secondary-source-backed' END, NEW."updatedAt", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '/contracts')
  ON CONFLICT ("entityType", "entityId") DO UPDATE SET "title" = EXCLUDED."title", "href" = EXCLUDED."href", "aliases" = EXCLUDED."aliases", "facets" = EXCLUDED."facets", "searchableText" = EXCLUDED."searchableText", "category" = EXCLUDED."category", "provenanceLabel" = EXCLUDED."provenanceLabel", "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt", "embedding" = NULL, "updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER article_search_document_trigger
AFTER INSERT OR DELETE OR UPDATE OF "title", "excerpt", "aiSummary", "content", "sourceName", "category", "imageUrl", "provenanceLabel", "topics", "status"
ON "articles" FOR EACH ROW EXECUTE FUNCTION sync_article_search_document();
CREATE TRIGGER system_search_document_trigger
AFTER INSERT OR DELETE OR UPDATE OF "name", "slug", "relatedSystems", "manufacturer", "country", "status", "description", "content", "specifications", "category", "imageUrl", "provenanceLabel"
ON "systems" FOR EACH ROW EXECUTE FUNCTION sync_system_search_document();
CREATE TRIGGER explainer_search_document_trigger
AFTER INSERT OR DELETE OR UPDATE OF "title", "slug", "relatedSystems", "difficulty", "description", "content", "keyFeatures", "category", "imageUrl", "provenanceLabel"
ON "explainers" FOR EACH ROW EXECUTE FUNCTION sync_explainer_search_document();
CREATE TRIGGER contract_search_document_trigger
AFTER INSERT OR DELETE OR UPDATE OF "title", "contractNumber", "agency", "company", "status", "description", "category", "sourceUrl"
ON "contracts" FOR EACH ROW EXECUTE FUNCTION sync_contract_search_document();

COMMIT;
