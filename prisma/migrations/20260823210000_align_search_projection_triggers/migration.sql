BEGIN;

DO $$
BEGIN
  IF to_regclass('public.search_documents') IS NULL
     OR to_regprocedure('public.sync_article_search_document()') IS NULL
     OR to_regprocedure('public.sync_system_search_document()') IS NULL
     OR to_regprocedure('public.sync_explainer_search_document()') IS NULL
     OR to_regprocedure('public.sync_contract_search_document()') IS NULL THEN
    RAISE EXCEPTION 'search projection foundation must be applied before trigger alignment';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.sync_article_search_document() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public."search_documents" WHERE "entityType" = 'article' AND "entityId" = OLD."id";
    RETURN OLD;
  END IF;
  IF NEW."status" <> 'published' THEN
    DELETE FROM public."search_documents" WHERE "entityType" = 'article' AND "entityId" = NEW."id";
    RETURN NEW;
  END IF;
  INSERT INTO public."search_documents" ("id", "entityType", "entityId", "title", "href", "aliases", "facets", "searchableText", "category", "imageUrl", "provenanceLabel", "sourceUpdatedAt", "createdAt", "updatedAt")
  VALUES ('article:' || NEW."id", 'article', NEW."id", NEW."title", '/articles/' || NEW."id", COALESCE(NEW."topics", ARRAY[]::TEXT[]), jsonb_build_object('source', NEW."sourceName"), concat_ws(' ', NEW."title", NEW."excerpt", NEW."aiSummary", NEW."content", NEW."sourceName", array_to_string(NEW."topics", ' ')), NEW."category", NEW."imageUrl", NEW."provenanceLabel", NEW."updatedAt", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  ON CONFLICT ("entityType", "entityId") DO UPDATE SET "title" = EXCLUDED."title", "href" = EXCLUDED."href", "aliases" = EXCLUDED."aliases", "facets" = EXCLUDED."facets", "searchableText" = EXCLUDED."searchableText", "category" = EXCLUDED."category", "imageUrl" = EXCLUDED."imageUrl", "provenanceLabel" = EXCLUDED."provenanceLabel", "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt", "embedding" = NULL, "updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.sync_system_search_document() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN DELETE FROM public."search_documents" WHERE "entityType" = 'system' AND "entityId" = OLD."id"; RETURN OLD; END IF;
  INSERT INTO public."search_documents" ("id", "entityType", "entityId", "title", "aliases", "facets", "searchableText", "category", "imageUrl", "provenanceLabel", "sourceUpdatedAt", "createdAt", "updatedAt", "href")
  VALUES ('system:' || NEW."id", 'system', NEW."id", NEW."name", array_prepend(NEW."slug", COALESCE(NEW."relatedSystems", ARRAY[]::TEXT[])), jsonb_build_object('manufacturer', NEW."manufacturer", 'country', NEW."country", 'status', NEW."status"), concat_ws(' ', NEW."name", NEW."description", NEW."content", NEW."manufacturer", NEW."country", array_to_string(NEW."relatedSystems", ' '), array_to_string(NEW."specifications", ' ')), NEW."category", NEW."imageUrl", NEW."provenanceLabel", NEW."updatedAt", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '/systems/' || NEW."slug")
  ON CONFLICT ("entityType", "entityId") DO UPDATE SET "title" = EXCLUDED."title", "href" = EXCLUDED."href", "aliases" = EXCLUDED."aliases", "facets" = EXCLUDED."facets", "searchableText" = EXCLUDED."searchableText", "category" = EXCLUDED."category", "imageUrl" = EXCLUDED."imageUrl", "provenanceLabel" = EXCLUDED."provenanceLabel", "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt", "embedding" = NULL, "updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.sync_explainer_search_document() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN DELETE FROM public."search_documents" WHERE "entityType" = 'explainer' AND "entityId" = OLD."id"; RETURN OLD; END IF;
  INSERT INTO public."search_documents" ("id", "entityType", "entityId", "title", "aliases", "facets", "searchableText", "category", "imageUrl", "provenanceLabel", "sourceUpdatedAt", "createdAt", "updatedAt", "href")
  VALUES ('explainer:' || NEW."id", 'explainer', NEW."id", NEW."title", array_prepend(NEW."slug", COALESCE(NEW."relatedSystems", ARRAY[]::TEXT[])), jsonb_build_object('difficulty', NEW."difficulty"), concat_ws(' ', NEW."title", NEW."description", NEW."content", array_to_string(NEW."relatedSystems", ' '), array_to_string(NEW."keyFeatures", ' ')), NEW."category", NEW."imageUrl", NEW."provenanceLabel", NEW."updatedAt", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '/explainers/' || NEW."slug")
  ON CONFLICT ("entityType", "entityId") DO UPDATE SET "title" = EXCLUDED."title", "href" = EXCLUDED."href", "aliases" = EXCLUDED."aliases", "facets" = EXCLUDED."facets", "searchableText" = EXCLUDED."searchableText", "category" = EXCLUDED."category", "imageUrl" = EXCLUDED."imageUrl", "provenanceLabel" = EXCLUDED."provenanceLabel", "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt", "embedding" = NULL, "updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.sync_contract_search_document() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN DELETE FROM public."search_documents" WHERE "entityType" = 'contract' AND "entityId" = OLD."id"; RETURN OLD; END IF;
  INSERT INTO public."search_documents" ("id", "entityType", "entityId", "title", "aliases", "facets", "searchableText", "category", "imageUrl", "provenanceLabel", "sourceUpdatedAt", "createdAt", "updatedAt", "href")
  VALUES ('contract:' || NEW."id", 'contract', NEW."id", NEW."title", CASE WHEN NEW."contractNumber" IS NULL THEN COALESCE(NEW."relatedSystems", ARRAY[]::TEXT[]) ELSE array_prepend(NEW."contractNumber", COALESCE(NEW."relatedSystems", ARRAY[]::TEXT[])) END, jsonb_build_object('agency', NEW."agency", 'company', NEW."company", 'status', NEW."status"), concat_ws(' ', NEW."title", NEW."description", NEW."company", NEW."agency", NEW."office", NEW."location", NEW."contractNumber", array_to_string(NEW."relatedSystems", ' ')), NEW."category", NULL, CASE WHEN NEW."sourceUrl" IS NULL THEN 'unverified' ELSE 'secondary-source-backed' END, NEW."updatedAt", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CASE WHEN NEW."contractNumber" IS NULL THEN '/contracts' ELSE '/contracts?search=' || NEW."contractNumber" END)
  ON CONFLICT ("entityType", "entityId") DO UPDATE SET "title" = EXCLUDED."title", "href" = EXCLUDED."href", "aliases" = EXCLUDED."aliases", "facets" = EXCLUDED."facets", "searchableText" = EXCLUDED."searchableText", "category" = EXCLUDED."category", "provenanceLabel" = EXCLUDED."provenanceLabel", "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt", "embedding" = NULL, "updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER contract_search_document_trigger ON public."contracts";
CREATE TRIGGER contract_search_document_trigger
AFTER INSERT OR DELETE OR UPDATE OF "title", "contractNumber", "agency", "company", "office", "location", "relatedSystems", "status", "description", "category", "sourceUrl"
ON public."contracts" FOR EACH ROW EXECUTE FUNCTION public.sync_contract_search_document();

COMMIT;
