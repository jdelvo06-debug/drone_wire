# DroneWire Full Remediation Implementation Plan — Historical Audit Reference

> **Planning update:** Product direction changed on 2026-08-28. Use `docs/free-plan-transition.md` as the canonical active plan. This document remains the technical audit backlog and historical reference; its newsletter, large-scale backlog, and unrestricted Preview objectives are not current commitments.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every finding from the 2026-08-23 DroneWire content and visual audit through phased, reversible local changes and approval-gated production releases.

**Architecture:** Preserve and stabilize the current dirty tree before layering changes. Use Prisma/PostgreSQL as the source of truth for provenance, catalog media, article quality, federated search, and newsletter delivery state. Keep production migrations, secrets, schedulers, real email, pushes, and deployments behind explicit approval gates.

**Tech Stack:** Next.js App Router, TypeScript, Prisma, Supabase PostgreSQL with pgvector and pg_trgm, Tailwind CSS, Jest, Gmail API, Vercel, Hermes scheduler.

**Spec:** `CODEX_CONTENT_VISUAL_AUDIT_PROMPT.md` and the remediation decisions recorded in the originating Codex task.

## Global Constraints

- Preserve all pre-existing modified and untracked work; never reset, clean, stash, overwrite, or revert it.
- Never display automated content as verified; use only the approved provenance and AI labels.
- Do not migrate production data, configure secrets, schedule Hermes, send real email, push, or deploy without separate approval.
- Copy imagery locally only when public-domain or reuse rights are explicit; otherwise retain a monitored origin URL.
- Complete all 111 systems, all 40 explainers, and every audit finding before declaring the program complete.

---

## Approved Product Decisions

- Stabilize the current dirty tree and preserve the existing remediation.
- Use hybrid claim-level provenance: consequential claims receive claim citations; narrative receives a bibliography.
- Publish automatically with visible source, conflict, confidence, and AI labels.
- Keep legacy records visible with unverified warnings during backfill.
- Build hybrid federated search across articles, systems, explainers, and contracts.
- Deliver an automated weekly digest Monday at 8:00 AM America/New_York through Hermes.
- Enable weekly delivery for existing active subscribers and disable breaking alerts until explicit opt-in.
- Use hybrid controlled image storage.
- Remove the broken GitHub and X/Twitter links.
- Use phased, reversible releases and finish with a production re-audit.

## Revised Execution Order — Jeremy Decision

Do not process the entire 1,162-article backlog before improving the rest of the product. Execute in this order:

1. Repair approximately 100 articles in controlled batches: 10, then 25, then 25, then 40. Stop if quality slips.
2. Complete factual, provenance, and image work for all 111 systems and 40 explainers.
3. Finish website/platform work: search, accessibility, SEO, freshness, performance, and preview/production verification.
4. Return to the remaining article backlog after the rest of the product is in a credible state.

The 100-article target is a milestone, not permission for unattended bulk processing. Every article batch requires clean extraction, structured-output validation, human review flags, pre-change export, explicit write approval, and post-write reconciliation.

## Public Interfaces and Data Contracts

### Provenance

- `ContentSource`: canonical URL, title, publisher, source type, publication/access dates, license, archive URL, and link health.
- `SystemCitation` and `ExplainerCitation`: entity/source relation, claim key, optional evidence, stance, provenance label, and last checked date.
- `MediaAsset`: controlled/remote URL, origin, attribution, license, depicted entity and variant, checksum, storage mode, and verification state.
- Approved public labels: `primary-source-backed`, `vendor-reported`, `secondary-source-backed`, `partially-sourced`, `unverified`, `conflicting`, and `ai-generated`.
- Consequential claim keys include manufacturer, status, range, price, procurement, NDAA/JIATF status, combat record, indexed specifications, and content headings.

### Article quality

- Preserve `Article.category` as the canonical primary category.
- Split pipe-delimited values; first recognized value becomes primary, remaining values become topics, and unknown values become `general` with an unverified classification label.
- Add event clustering, relevance/exclusion state, processing lifecycle fields, origin labels, and calculated read time.
- Never delete duplicate source articles; listings show one representative and expose the remaining sources.

### Federated search

```ts
type SearchEntityType = 'article' | 'system' | 'explainer' | 'contract'

interface FederatedSearchResult {
  entityType: SearchEntityType
  id: string
  title: string
  href: string
  snippet: string
  category: string | null
  imageUrl: string | null
  provenanceLabel: string
  score: number
}
```

- `GET /api/search` accepts `q`, `types`, `limit`, and `mode=hybrid`.
- Exact and alias matches rank first; remaining results use full-text, trigram, and vector reciprocal-rank fusion.
- Header searches route to `/search?q=...`.

### Newsletter

- `NewsletterIssue`: unique week, coverage dates, selected content, rendered preview, status, counts, timestamps, and failure summary.
- `NewsletterDelivery`: unique issue/subscriber delivery, provider message ID, attempt count, status, and error code.
- Subscriber state adds weekly-digest consent and separate breaking-alert consent.
- `POST /api/cron/send-weekly-digest` is CRON-secret protected and idempotent.

## Release Tasks

### Release 0: Stabilize the current tree

- [ ] Capture an out-of-repository tracked patch, untracked archive, inventory, and checksums.
- [ ] Review every existing change against the audit and repository rules.
- [ ] Run `git diff --check`, lint, TypeScript, Jest, build, and 390/768/1440 browser smoke.
- [ ] Reconcile documentation with fresh read-only database evidence.
- [ ] Exit only when no existing work is lost and baseline gates are green.

### Release 1: Foundation and existing remediation

- [ ] Complete request limits, BotID integration, signed unsubscribe, view tracking, URL sanitization, security headers, framework/tooling alignment, canonical metadata, JSON-LD, custom error pages, and the release runbook.
- [ ] Test route failure behavior, idempotency, security headers, metadata, and production-shaped rendering.
- [ ] Keep the rate-limit migration, secrets, BotID settings, preview, and production deployment approval-gated.

### Release 2: Provenance and factual trust

- [ ] Add provenance/media schema and migrations with rollback notes.
- [ ] Add source rendering, approved labels, bibliographies, and legacy warnings.
- [ ] Correct KURFS, KuRFS/Sentinel, P-HEL, RapidFire, AUDS, Coyote Block 1, and JIATF-401 records and imagery.
- [ ] Backfill all systems and explainers from the approved source hierarchy.
- [ ] Detect and display conflicts rather than choosing silently.
- [ ] Add explicit AI-generation methodology and labels.

### Release 3: Article quality and processing

- [ ] Normalize category and source-name values through a dry-run report and rollback export.
- [ ] Add non-destructive event clustering and representative selection.
- [ ] Add relevance screening and retain excluded records with reasons.
- [ ] Reprocess generic summaries and extraction debris under bounded quality rules.
- [ ] Calculate read time and apply the neutral missing-image treatment.
- [ ] Process oldest AI work first in batches of 50, five attempts maximum, exponential backoff, and terminal quarantine.

### Release 4: Image integrity and governance

- [ ] Create controlled catalog assets only for public-domain/permissively licensed images.
- [ ] Retain monitored origin URLs when local copying is not authorized.
- [ ] Validate HTTP, MIME, dimensions, depicted variant, license, attribution, and duplicate use.
- [ ] Produce a Hermes-ready monthly image-audit endpoint without scheduling it until approved.

### Release 5: Contracts tracker

- [ ] Replace split UI state with one contracts explorer state model synchronized to the URL.
- [ ] Return data-derived facets and honor every visible filter.
- [ ] Add bounded, formula-safe UTF-8 CSV export with identical filters.
- [ ] Render mobile cards below the tablet breakpoint and the semantic sortable table above it.
- [ ] Show unavailable source fields as “Not reported.”
- [ ] Infer related systems only through the controlled alias registry and label them inferred.
- [ ] Cache and profile aggregates so cached API p95 remains below two seconds.

### Release 6: Federated discovery

- [ ] Add and backfill `SearchDocument` for all four entity types. (Projection implementation complete; production backfill remains separately gated.)
- [x] Maintain search projections when source entities change.
- [x] Populate aliases and normalize related-system references.
- [x] Add `/search` with typed results, filters, loading, failure, empty, and fuzzy-match states.
- [x] Benchmark the approved eleven representative queries.

### Release 6A: Preview security and release boundary

- [ ] Isolate Preview from unrestricted Production credentials and database access.
- [ ] Rotate or independently invalidate credentials potentially exposed through the historical plaintext `.vercel.env` concern.
- [ ] Confirm and remove/revoke unused legacy provider credentials, including `SAM_GOV_API_KEY` if unused.
- [ ] Configure and verify Preview-specific `SITE_URL` and protected-route secrets.
- [ ] Run clean preview deployment and browser/API/security smoke after isolation is complete.

### Release 7: Weekly digest and consent

- [ ] Persist a preview issue before any delivery.
- [ ] Select five deduplicated eligible articles, two recent contracts, and one sourced catalog record from the prior seven days.
- [ ] Send in resumable batches of 25 with unique delivery records and no duplicate retries.
- [ ] Enable weekly digest and disable breaking alerts for existing active subscribers.
- [ ] Make breaking alerts a separate unchecked opt-in.
- [ ] Add signed preference management for digest, alerts, categories, and full unsubscribe.
- [ ] Produce the authenticated Hermes-ready Monday 8:00 AM ET endpoint and retry behavior without scheduling or sending until approved.

### Release 8: Visual UX, accessibility, SEO, and freshness

- [ ] Use mobile navigation below `lg`.
- [ ] Normalize markdown H1 headings under each page title.
- [ ] Correct contrast tokens and preserve visible focus.
- [ ] Replace hard-coded explainer counts with database counts including `concepts`.
- [ ] Remove broken social links, use a dynamic year, and add a working favicon.
- [ ] Surface truthful feed/catalog freshness.
- [ ] Keep DroneLife disabled until three consecutive successes or retire it.
- [ ] Verify rendered canonical, Open Graph, JSON-LD, sitemap, RSS, robots, manifest, and 404 behavior.

### Release 9: Final audit

- [ ] Re-run the full content, image, information-quality, visual, accessibility, freshness, SEO, and discoverability audit.
- [ ] Reconcile database, sitemap, and production counts.
- [ ] Verify every finding by ID and report anything still unverified.
- [ ] Prepare production approvals and rollback points without performing gated actions.

## Verification Gates

Every release must pass:

```bash
git diff --check
npm run lint
npx tsc --noEmit
npm test -- --runInBand
npm run build
```

Also required:

- Browser smoke at 320, 390, 768, 1024, and 1440 pixels.
- Keyboard-only walkthrough and visible-focus check.
- Zero serious/critical automated accessibility findings.
- API tests for validation, filtering, rate limits, idempotency, and failure states.
- No secrets, subscriber addresses, or private telemetry in logs or fixtures.
- Data exports, expected counts, bounded writes, reconciliation, and rollback evidence before any approved data repair.

## Production Approval Sequence

1. Local gates pass.
2. Exact diff and migration review.
3. Separate approval for required secrets, migrations, schedulers, or email tests.
4. Preview deployment and smoke.
5. Separate production deployment approval.
6. Production smoke, reconciliation, and observed rollback window.

Before any Vercel work, upgrade the local Vercel CLI to 59.5.0 or newer only after separate installation approval.
