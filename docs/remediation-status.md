# DroneWire Remediation Status

> **Active direction:** Use `docs/free-plan-transition.md` as the canonical plan. DroneWire remains on the free plan; Preview must be harmless/read-only; newsletter delivery and full automatic AI-backlog processing are deferred. This status file records the broader audit history and may contain superseded counts or proposals.

**Last updated:** 2026-08-23 11:01 EDT
**Repository:** `/Users/jeremydelvaux/projects/drone_wire/app`
**Live site:** https://dronewire.org
**Overall state:** Local implementation and QA in progress; production changes are not approved.

## Plain-English summary

The current work added a large amount of supporting code for better security, provenance, article processing, search, contracts, newsletters, images, accessibility, and SEO.

That does **not** mean all public content has been corrected yet.

The simple distinction is:

- **The machinery exists locally:** code, models, tests, scripts, and migration files.
- **The warehouse is not fully cleaned:** article backfills, image repairs, title review, provenance metadata, production deployment, and editorial verification remain outstanding.
- **One bounded production data repair has been applied:** Packet 1 corrected contract award dates and source URLs only. No schema migration, email, scheduling, deployment, commit, or push occurred.

## Verified current inventory

Verified from the local application/database on 2026-08-23:

| Area | Current state | Evidence/status |
|---|---:|---|
| Articles | 4,845 | Local `/api/health` database check |
| Systems | 111 | Local `/api/systems` pagination total |
| Explainers | 40 | Local `/api/health` database check |
| Contracts | 228 | Local `/api/health` and `/api/contracts` |
| RSS feeds | 12/13 active | Local `/api/health` |
| Pipeline freshness | Last article about 9 hours old | Local `/api/health` |
| Media audit failures | 15 confirmed/uncertain failures: 2×404, 2×HTML, 1×403, 1×octet-stream, 9×429 uncertain | Backfill not complete |
| Reused image URLs | 2 | Requires review |
| Missing media metadata | 151 records | Provenance/license metadata does not exist yet |

`NEXTSESSION.md` still says 115 systems. The current local API/database reports 111. The 111 count is the current working value, but production parity still needs confirmation before any final completion claim.

## Verified local code gates

After the CTA repair, the following passed locally:

- ESLint: passed with zero warnings
- TypeScript: passed
- Jest: 29 suites, 182 tests passed
- Production build: passed; 20 static pages generated
- Prisma schema validation: passed when `.env.local` is loaded
- Git whitespace check: passed
- Built-app browser smoke: passed at 390px and 1440px for the repaired homepage CTA

Expected non-blocking warnings remain:

- Prisma generator output path deprecation warning
- Browserslist database age warning
- Production dependency audit: one high and one moderate PostCSS-related advisory; automatic fix requires a breaking Next 16 upgrade

## Completed and independently verified

### Homepage CTA repair

The blank `View Explainers` button was fixed in:

- `components/home/hero-section.tsx`
- `__tests__/hero-section.test.tsx`

The label, icon, transparent background, visible outline, hover styling, and responsive layout were verified in a built local application at 390px and 1440px.

No commit or push was performed.

### Local implementation gates

The broad remediation tree currently builds and passes the automated suite. This verifies code-level behavior and test coverage, not that every data backfill or editorial correction has been applied.

## Article ingestion and AI model status

DroneWire has three separate article-processing layers:

1. **Feed ingestion:** `rss-parser` reads the configured RSS/Atom feeds in `lib/services/rss-scraper.ts`.
2. **Source extraction:** native `fetch` plus Cheerio/site-specific selectors in `lib/services/content-extractor.ts` retrieves and cleans article pages. This layer does not use GPT or another AI model.
3. **AI analysis:** `lib/services/ai-processor.ts` sends extracted article text to the Ollama Cloud OpenAI-compatible API at `https://ollama.com/v1`.

Current model routing in code:

- Primary default: `deepseek-v4-flash`
- Fallback default: `glm-5.2`
- Embeddings: OpenAI `text-embedding-3-small`

Production health check on 2026-08-23 reported:

- Primary `deepseek-v4-flash`: unavailable
- Fallback `glm-5.2`: available
- Overall AI status: degraded

Therefore, production article summaries are currently using GLM 5.2 fallback behavior whenever the primary is unavailable. The audit covered AI processing resilience, pending/failed records, generic summaries, and article quality, but it did not yet perform a controlled model-quality comparison. Do not switch models blindly. First verify why DeepSeek is unavailable and benchmark both models on the same representative article sample for factuality, source fidelity, category accuracy, valid structured output, latency, and cost.

## Article-quality pilot result

A read-only 28-article pilot compared DeepSeek V4 Flash and GLM 5.2 using identical source text and prompts.

- DeepSeek remains primary: quality score 0.723, 27/28 valid structured outputs, average latency 8.33 seconds.
- GLM remains fallback: quality score 0.702, 23/28 valid structured outputs, average latency 3.73 seconds.
- Both models are available; the earlier DeepSeek alert was a model-list alias false negative.
- Extraction is the larger quality problem: 16/28 clean, 7/28 missing fresh content, 5/28 with navigation/cookie/footer/ad debris, and 3/28 broken or misleading image flags.
- Five existing published summaries had generic openings.
- No article records were changed.

The next article packet must repair extraction quality before processing the 1,162 pending articles. Do not switch models based on this pilot alone.

## Article repair milestone progress

- Controlled batch attempted: 10 articles
- Approved and applied: 1 article — SKYLOCK C-UAS
- Held for source/fidelity review: 9 articles
- Article counts remain unchanged: 4,845 total; 3,681 published; 1,162 pending; 2 failed
- The 100-article milestone is not yet complete. Continue with controlled batches and apply only individually approved results.


- Published: 3,681
- Awaiting AI processing: 1,162
- Failed: 2
- 2,241 records use non-canonical category values, mostly pipe-delimited. All can be reduced to a recognized primary category, but the current `categoryOrigin` report logic is wrong and must be corrected before applying normalization.
- All 4,845 articles have null read time.
- All 4,845 lack structured provenance because the provenance schema has not been migrated.
- 1,164 records lack AI summaries: the 1,162 pending records plus two failed records. No published article is missing its AI summary.
- 122 proposed event clusters contain 285 articles; the current algorithm would suppress 163 cards. This requires review, not automatic application.
- 247 records score below the relevance threshold. Sampling found both genuine irrelevant records and false positives; do not blanket-exclude them.
- 145 published summaries use generic openings and 548 content fields/166 excerpts contain possible extraction debris. Both require bounded editorial review.
- Source-link HTTP health for all 4,845 article URLs remains unverified.

## Contract findings from the latest dry run

- All 228 contracts are currently marked `active`; do not blanket-convert them to `Not reported`.
- No confirmed exact or business-key duplicates were found.
- Nine repeated-title groups contain 25 distinct awards, not confirmed duplicates.
- Nine titles are numeric identifiers even though none exactly equals its contract number.
- All required basic fields are populated, but all 228 award dates are within five minutes of ingestion/scrape timestamps. They appear to be scrape timestamps rather than authoritative award dates.
- 208 records are concentrated on May 4, 2026.
- All 228 URLs are syntactically valid USASpending links, but 46 non-DoD records use a hard-coded DoD `_9700_` path segment and require reconstruction.
- Duration and location are absent for all 228 contracts.
- No confirmed or inferred system relationships exist, and no alias registry currently supports safe inference.

## Packet 1 contract repair — applied and verified

Applied 2026-08-23 at 16:15 UTC using the guarded ARM64 apply tool.

Changed only:

- `awardDate`: 228/228 authoritative dates
- `sourceUrl`: 161/161 corrected canonical URLs

Verified after commit:

- Post-apply raw-SQL snapshot SHA-256: `97570d476904051b742ba46347d99da2175fdf0e31bafbf6e55d5494e4d6f36b`
- Contract count: 228
- Statuses still `active`: 228
- Statuses changed to `Not reported`: 0
- Untouched fields: verified unchanged
- Database rollback export: `/private/tmp/dronewire-contract-packet1-apply-20260823/contract-pre-apply.json`
- Apply report: `/private/tmp/dronewire-contract-packet1-apply-20260823/contract-apply-report.json`

Still outstanding for contracts:

- Review and apply the nine proposed readable titles separately, including correcting the source typo `Arial` → `Aerial`.
- Do not change contract statuses without a separate data-policy decision.
- Verify the public contracts page reflects corrected dates and URLs in browser smoke.

## Packet 2 contract title repair — applied and verified

Applied 2026-08-23 after Jeremy approved the finalized nine-title mapping.

Changed only the `title` field on these nine contracts:

- `SPE8EL22F16S3` → Counter Unmanned Aerial System Camera
- `SPE8EL22F174W` → Counter Unmanned Aerial System Unit
- `SPE8EL22FW0EJ` → EnforceAir Counter-UAS System
- `SPE8EL25F1F2H` → Counter-UAS System Spares — Module A
- `SPE8EL23FJ255` → Optic, C-UAS
- `SPE8EL25FJ0R6` → C-UAS Optic
- `SPE8EL24FJ31C` → C-UAS Optic
- `SPE8EL26FH0TF` → Nightfighter Mini Counter-UAS System
- `SPE8EL26FJ1Y1` → Ghoul Counter-UAS System

Verified after commit:

- Post-title raw-SQL snapshot SHA-256: `398037f83cb25ff25404057562b4018ad08d7f6a4cc96b58a055cb0cd9db6d77`
- Contract count: 228
- Active statuses: 228
- Untouched fields: verified unchanged
- Title apply report: `/private/tmp/dronewire-contract-title-apply-20260823/contract-title-apply-report.json`
- Title rollback export: `/private/tmp/dronewire-contract-title-apply-20260823/contract-title-pre-apply.json`

Remaining contract UI issue: production renders UTC-midnight award dates one day early in Eastern time. This is a separate display fix and was not included in either data packet.


The audit covered all 111 systems and 40 explainers. Fifteen image requests failed or remain uncertain: two 404s, two HTML responses, one 403, one `application/octet-stream`, and nine Wikimedia 429 responses. Two image URLs are reused. All 151 records lack media provenance/license metadata because the media schema has not been migrated.


Codex reports that the following local capabilities now exist:

- Claim-level provenance and bibliographies
- Legacy/unverified warnings
- Media attribution fields
- Known catalog correction definitions
- Article category normalization
- Relevance screening
- Event clustering
- AI retry/quarantine lifecycle
- Read-time calculation
- Federated search support
- Contract filters, facets, pagination, responsive cards, and CSV export
- Weekly digest preview and consent/preference infrastructure
- SSRF and DNS-rebinding controls
- Mobile navigation and accessibility repairs
- Metadata, freshness, social-link, and overflow repairs

These items are **not considered fully complete** until their real database behavior and public rendering are verified through dry runs, before/after counts, representative content review, and browser smoke.

## Foundation migration — applied and verified

The isolated restore prerequisite was satisfied locally, and the reviewed foundation migration was applied to production on 2026-08-23 with explicit approval.

- Local restore evidence: `/private/tmp/dronewire-foundation-backup-20260823/evidence.md`
- Production pre-apply backup: `/private/tmp/dronewire-foundation-production-preapply-20260823/public-data.sql`
- Production backup SHA-256: `1c948a8e9688a2e1e80a55516fefb22b5dd8a74a7cde473850f0d31bce03d070`
- Production apply report: `/private/tmp/dronewire-foundation-production-preapply-20260823/apply-report.md`
- Production data changes: none
- Contract statuses: 228 active; 0 `Not reported`
- Active subscribers with alerts enabled: 3
- Foundation tables: 9
- Rollback guard checksum rows: 9
- `pg_trgm` and `vector`: present
- Search triggers: 4
- Search-document indexes: 9

## Request-rate-limit migration — applied and verified

Applied 2026-08-24 after a fresh production data backup.

- Backup: `/private/tmp/dronewire-rate-limit-preapply-20260824/public-data.sql`
- Backup SHA-256: `47017ce4bc4d975df07eed4230367eeb868ba6fdd5f3a6b4a1e778233c019279`
- `request_rate_limits`: present
- Rows: 0
- Indexes: 3 including the primary key
- Canonical counts preserved: 4,860 articles; 228 contracts; 111 systems; 40 explainers
- Active contracts: 228
- Active subscribers: 3

The migration made no canonical data changes. Execution note: the three migration statements succeeded with ON_ERROR_STOP, but the invocation did not add psql `--single-transaction`; no partial failure occurred. Secrets remain missing and deployment is still blocked.

The migration is now complete. The catalog-correction packet remains separate and still requires explicit approval. Production rollback has not been run.

## Catalog correction packet — applied and verified

Applied 2026-08-23 after explicit approval of the refreshed AUDS packet.

- Records changed: 7
- Field decisions applied: 97
- Packet SHA-256: `b14ec173f02d8240e24906a041e46db39c483cae1dbb8fd5a3bd7ab9bdf6cacc`
- Post-commit raw-SQL snapshot SHA-256: `e09fa251bd427ab364015c48e96d7bcf579374ad198cbfe1e76c5af8d0cf04d8`
- Apply report: `/private/tmp/dronewire-catalog-apply-20260823-final/catalog-apply-report.json`
- Rollback export: `/private/tmp/dronewire-catalog-apply-20260823-final/catalog-pre-apply.json`
- Content sources: 16
- System citations: 58
- Explainer citations: 19
- Media assets: 2
- Active contracts preserved: 228
- Active subscribers preserved: 3

Affected records: KuRFS, AN/MPQ-64 Sentinel, P-HEL, RAPIDFire, AUDS, Coyote Block 1, and JIATF 401. The AUDS URL is current and live; its citation title/summary retain the disclosed PDF-era wording for later cleanup.

Public extraction verified all seven corrected routes. Browser harness smoke was unavailable in this run; no browser screenshot claim is made.

The catalog apply guard was corrected to compare record sets independent of packet/read order after a false verification failure. Full lint, TypeScript, Jest, build, and diff-check passed after the fix.


The project will not process the entire 1,162-article backlog before improving the rest of the product. The approved sequence is:

1. Repair and review approximately 100 articles in controlled batches: 10, then 25, then 25, then 40. Stop if quality slips.
2. Complete factual, provenance, and image work for all 111 systems and 40 explainers.
3. Finish website/platform work: search, accessibility, SEO, freshness, performance, and preview/production verification.
4. Return to the remaining article backlog after the rest of the product is in a credible state.

The 100-article target is a milestone, not permission for unattended bulk processing. Every batch requires clean extraction, structured-output validation, human review flags, pre-change export, explicit write approval, and post-write reconciliation.

## Still outstanding

### Content and data

- Complete editorial/media review for all 111 systems and 40 explainers
- Resolve 15 confirmed/uncertain media failures and review 2 reused image URLs
- Populate or disposition 151 missing media metadata records
- Run article category normalization as a dry-run report
- Review article relevance and duplicate-cluster results
- Review article AI-processing backlog and quarantine results
- Verify the public contracts page after the applied date, source URL, and title repairs; do not change contract statuses without a separate decision
- Verify known catalog corrections against authoritative sources
- Confirm all consequential claims have appropriate provenance labels/citations

### Production and infrastructure

- Restore-backup migration dry run — complete
- Production foundation migration — applied and verified
- Request-rate-limit migration — applied and verified
- Required production secrets and request-protection configuration — configured for Production; Preview verification complete
- Preview safeguard code — locally verified and independently reviewed; deployment still pending separate approval
- Production deployment approval
- Production accessibility and axe audit
- Dependency decision for remaining PostCSS advisories
- Vercel CLI upgrade decision
- Scheduler ownership and Hermes schedule approval
- Synthetic email test approval
- Any real newsletter delivery approval

### P0 release-blocking security backlog

- Audit and isolate Preview from unrestricted Production credentials and database access.
- Rotate or independently invalidate credentials potentially exposed through the historical plaintext `.vercel.env` concern: `ADMIN_SECRET`, `CRON_SECRET`, database credentials, and `EXA_API_KEY`.
- Confirm whether `SAM_GOV_API_KEY` is unused, then revoke/remove it if confirmed.
- Configure Preview-specific `SITE_URL` and environment values without exposing secrets.
- Preserve Production and Preview separation and verify protected routes after rotation.

This backlog must be completed before preview is considered release-ready. Secret values must never be stored in repository files, chat, evidence reports, or logs.

## Approval decisions still required from Jeremy

These are proposals, not approved decisions:

- Whether existing active subscribers should receive weekly digest by default
- Whether existing active contract statuses may be changed to `Not reported`
- Whether automatic publication of AI-assisted content is acceptable
- Whether Hermes should schedule the weekly digest or media audit
- Whether controlled local image copies are authorized for each asset/license
- Whether to upgrade Next.js to address the remaining PostCSS advisories
- Whether to migrate production data after dry-run review

## Current dirty-tree state

The repository is intentionally uncommitted and contains work from multiple remediation areas:

- 128 existing dirty paths
- 0 staged paths

Do not reset, clean, stash, overwrite, stage, commit, or push this state without an explicit file-scope decision.

The exact file inventory still needs to be classified into feature groups before any commit is considered.

## Required workflow from here

### Phase 1 — Protect and classify

1. Preserve the current tree.
2. Classify the current dirty paths into security/foundation, provenance/content, search, contracts, newsletter, visual/SEO/accessibility, tests, docs, and generated artifacts.
3. Do not commit the entire tree as one batch.

### Phase 2 — Article milestone

1. Complete the controlled 10-article repair batch.
2. Review the result and authorize the next 25-article batch only if all 10 pass.
3. Repeat for 25, then 40, until approximately 100 articles are repaired.
4. Keep manual-review, blocked, thin, or debris-contaminated records out of automatic batches.
5. Export before/after reports and reconcile every applied batch.

### Phase 3 — Systems and explainers

1. Complete claim/source review for all 111 systems and 40 explainers.
2. Repair confirmed factual issues and image mismatches.
3. Add or verify provenance and media metadata.
4. Run public route and browser visual QA.

### Phase 4 — Website and platform

1. Finish search/discovery, accessibility, SEO, freshness, and performance work.
2. Verify preview behavior and public rendering.
3. Resolve remaining dependency and production approval gates.

### Phase 5 — Remaining article backlog

Return to the remaining article records after the 100-article milestone, systems/explainers, and website/platform work are in a credible state.

### Supporting gate — Contracts and article review

Before any data write, produce plain-English before/after reports showing:

- Records affected
- Fields changing
- Why each change is recommended
- Source/provenance basis
- Records that remain uncertain
- Rollback/export location

### Supporting gate — Migration review

Review the foundation migration and rollback against a restored backup. Pay particular attention to:

- Existing contract statuses being changed
- Existing subscriber preference defaults
- Index/extension runtime
- Foreign keys and rollback guards
- Expected row counts

### Supporting gate — Preview and final QA

Only after approval:

1. Configure approved preview secrets.
2. Deploy preview.
3. Run API, browser, accessibility, content, and image smoke checks.
4. Review the preview results.
5. Obtain separate approval before production migration or deployment.

## Source documents

- Full implementation plan: `docs/superpowers/plans/2026-08-23-dronewire-full-remediation.md`
- Release runbook: `docs/remediation-runbook.md`
- Content/visual audit brief: `CODEX_CONTENT_VISUAL_AUDIT_PROMPT.md`
- Project continuity: `../NEXTSESSION.md`

## Recovery instruction

If this project is resumed after context loss:

1. Read this file first.
2. Read `AGENTS.md`.
3. Run `git status --short --branch`.
4. Do not assume Codex-reported counts or completion claims are current.
5. Reconcile the database counts and dirty-tree inventory.
6. Continue with the next unchecked phase above.
7. Keep all migration, email, scheduler, deployment, commit, and push actions approval-gated.
