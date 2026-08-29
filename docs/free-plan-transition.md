# DroneWire Free-Plan Transition Plan

**Owner:** Jeremy / Cortana  
**Purpose:** Keep DroneWire useful, inexpensive, and maintainable without building for traffic or operations we do not have.

## Decision

DroneWire remains on the Supabase Free plan and Vercel's no-cost path for now.

The project is a low-traffic, privately developed C-UAS intelligence hub. We will optimize for:

- Useful public browsing and search
- Reliable low-volume ingestion
- Safe Preview testing
- No accidental database churn
- No accidental email or AI spend
- Reversible, locally verified changes

We are **not** optimizing for a newsletter business, high public traffic, multi-tenant production, or unattended bulk processing.

## Operating rules

- Preserve Jeremy's existing dirty work. Never reset, clean, stash, stage, commit, push, deploy, or overwrite unrelated changes.
- Production database writes, Vercel settings, secrets, migrations, email, schedules, and provider changes each require their own approval.
- Preview must never mutate the shared Production database.
- Public browsing must not invoke AI processing.
- Do not delete articles merely to reduce numbers. Reduce write-heavy behavior first; trim content only if measured storage or performance requires it.
- Treat the current database counts as evidence to refresh, not as permanent plan values.

## Target architecture

```text
Production: dronewire.org → Vercel Production → Supabase Production
Preview:    temporary URL  → Vercel Preview    → read-only/sample-safe behavior
```

Preview may use representative production-shaped data for UI testing, but it must not write view counts, rate-limit rows, content, subscriber records, or other operational state.

## Execution phases

### Phase 0 — Protect the current tree

- [ ] Keep the current dirty work intact.
- [ ] Maintain one scoped file list for each implementation slice.
- [ ] Run focused tests before and after each slice.
- [ ] Do not bundle unrelated remediation work into this transition.

### Phase 1 — Make Preview harmless

**Status:** Code complete and independently reviewed; deployment pending separate approval.

- [x] Detect `VERCEL_ENV=preview` explicitly.
- [x] Keep Preview search functional for UI testing.
- [x] Skip BotID and database-backed rate limiting for Preview search.
- [x] Make Preview view tracking return a successful no-op.
- [x] Prove Preview does not call Prisma for rate-limit or view writes.
- [x] Prove Production keeps its existing request protection and view behavior.
- [x] Run focused Jest tests, lint, TypeScript, and build where practical.

Verification: 3 focused Jest suites / 13 tests passed; `npm run lint` passed; `npm run build` passed; `git diff --check` passed; independent review verdict APPROVED. Follow-up full-suite integration gate: one stale source-text assertion in `__tests__/security-headers.test.ts` (it expected the pre-safeguard `NODE_ENV`-only guard text) was updated to assert both the production and not-preview conditions; full suite then passed 42/42 suites, 312 tests, 23 skipped (pre-existing). No deployment or external configuration change was made.

No Vercel deployment or environment-setting change is included in this phase.

### Phase 2 — Reduce unnecessary public writes

**Status:** Complete. Controller verification passed (5 suites / 18 tests, lint, build, diff-check); independent review verdict APPROVED; reviewer's only finding (missing duplicate-send test) fixed and passing.

- [x] Measure which routes write most often before changing behavior.
- [x] Keep view counts only if their value justifies the write cost; otherwise make tracking opt-in, sampled, or remove it.
- [x] Keep rate-limit records bounded with expiration cleanup or a low-write alternative.
- [x] Confirm search uses bounded result limits and does not call AI during ordinary browsing.
- [ ] Add caching where it reduces repeated reads without making content stale or unsafe.

Measured baseline (2026-08-28, read-only): DB 103 MB of the 500 MB free cap; `request_rate_limits` at 0 rows (daily purge working); articles 4,881 (3,765 published / 1,114 pending / 2 failed, ~48 new per week); subscribers 3 (weekly digest disabled for all, zero emails ever sent). Changes applied: daily AI-processing default batch reduced 25 → 5 (manual `?limit=` still allowed up to 50); view beacon now fires only when `NEXT_PUBLIC_VERCEL_ENV === 'production'` (local dev and Preview send nothing). Search confirmed lexical/trigram-only during ordinary browsing — no per-query AI or embedding calls in the active federated path.

### Phase 3 — Retire newsletter pressure

**Status:** Complete. Controller verification passed; independent review verdict APPROVED (including extra newsletter lifecycle suites, 3 suites / 13 tests).

- [x] Remove the newsletter signup call-to-action from public navigation and homepage.
- [x] Keep existing subscriber data intact until its disposition is explicitly decided.
- [x] Disable or remove newsletter cron/delivery paths from the active operating plan.
- [x] Do not send a synthetic or real newsletter unless Jeremy separately requests it.
- [x] Preserve unsubscribe behavior if existing subscriber records remain.

Applied: signup CTA removed from the homepage and article sidebars; header and footer confirmed to contain no signup links; `/api/newsletter/*`, `/preferences`, and `/unsubscribe` routes preserved intact for the three existing subscribers; no subscriber data touched; no digest/alert cron is scheduled in `vercel.json` (only scrape-news and process-ai run daily).

This phase is a product simplification, not a database deletion operation.

### Phase 4 — Constrain background processing

- [ ] Keep RSS ingestion limited to the useful active source set.
- [ ] Keep AI processing bounded, resumable, and manually reviewable.
- [ ] Do not drain the full pending-article backlog automatically.
- [ ] Test GLM-5.3-Flash on a small offline/controlled sample before changing production routing.
- [ ] Use AI for background classification, cleanup, image review, or coding—not for every public request.
- [ ] Disable unused provider integrations and scheduled jobs only after read-only verification.

### Phase 5 — Content and quality only where valuable

- [ ] Preserve the existing article library unless measured storage, query, or quality data requires reduction.
- [ ] Prioritize system records, explainers, contracts, search, and the most useful recent articles.
- [ ] Continue image and provenance work in bounded batches.
- [ ] Do not pursue a 1,000-plus article repair campaign merely to make a dashboard number green.

### Phase 6 — Release decision

**Status:** Production deployed 2026-08-29 (build drone-wire-igg9tq789, commit 8118364 lineage after 11 build attempts).

- [x] Complete local tests/build/lint and focused Preview-boundary QA.
- [x] Review the exact diff and dirty-tree scope.
- [x] Deploy to production after clean-checkout build verification.
- [x] Run browser/API smoke against the live site.

Live smoke (2026-08-29): homepage 200, /articles /systems /explainers all 200, /api/health 200, search API returns 403 "Access denied" to unauthenticated curl (BotID bot-blocking working as designed in production), newsletter CTA confirmed absent from rendered homepage, request_rate_limits table remains at 0 rows from the smoke (blocked requests never reach the rate limiter), system view totals unchanged.

Deploy notes: the release required 10 intermediate fix commits to close the gap between the dirty working tree and the committed tree (missing untracked modules, Next 15 async params/searchParams migrations, Prisma schema + migrations, ai-processor and content-extractor quality contracts). Clean-checkout build verification (fresh clone + npm install + tsc + build) is now mandatory before any future push meant to build remotely — the working tree must never again be treated as proof the commit builds.

## GLM-5.3-Flash evaluation

**Status:** Article-quality pilot complete (2026-08-28). Report: `/private/tmp/dronewire-glm53-pilot-20260828.json` (28 samples, read-only DB transaction, glm-5.3-flash vs glm-5.3 on identical prompts). Vision pilot complete (2026-08-28). Report: `/private/tmp/dronewire-glm53-vision-pilot-20260828.json` (20 systems, read-only).

**Vision pilot results (glm-5.3-flash grading system images):**

- 20 systems sampled, 18 images fetched, 17 model verdicts
- Verdicts: 13 usable, 4 wrong-subject, 0 degraded, 0 broken
- Model-vs-HTTP agreement: **17/17 (100%)** on the comparable set — every image the model graded as fetchable/usable matched its actual HTTP status; the two fetch-failed images (hotlink 403, network error) were correctly excluded rather than misgraded
- Average model latency: 9.6s per image
- 1 JSON truncation failure (bal-chatri) — fixed by raising the script's max_tokens from 300 to 1200 after the run
- The 4 wrong-subject catches are real catalog defects: DroneOptID (FPV monitor, not the product), DedroneTracker (armored vehicles), DroneSentry-C2 (soldier with vehicle), Silent Archer (brand logo). These are exactly the misfiled images the media-audit backlog was meant to find — a human reviewer would need to check each URL manually to catch these.

Assessment: **glm-5.3-flash vision is a keeper for the image-audit lane.** It reliably distinguishes real C-UAS hardware from mismatched stock imagery, agrees with ground-truth HTTP status 100% on this sample, and its wrong-subject catches are actionable catalog fixes, not noise. Next step for this lane: extend the pilot to all 111 systems as a bounded monthly Hermes job (still read-only reporting; any actual imageUrl corrections stay human-approved).

Measured results (28 samples, 22 clean extraction):

| Metric | glm-5.3-flash | glm-5.3 | July baseline DeepSeek v4 flash | July baseline GLM 5.2 |
|---|---:|---:|---:|---:|
| Valid structured outputs | 28/28 | 28/28 | 27/28 | 23/28 |
| Average quality score | 0.709 | 0.716 | 0.723 | 0.702 |
| Average source fidelity | 0.706 | 0.718 | — | — |
| Category matches | 19/28 | 18/28 | — | — |
| Average latency | 15.1s | 20.0s | 8.3s | 3.7s |

Assessment: both GLM 5.3 models produce fully valid structured output (100% vs DeepSeek's 96%), but quality scores land in the same band as the current production pair. Latency is 2–5× worse than the July models, which is irrelevant for a 5-article daily background batch. The July conclusion holds: extraction quality — not model choice — remains the bottleneck. Recommendation: keep production routing (deepseek-v4-flash primary, glm-5.2 fallback); treat glm-5.3-flash as the proven fallback candidate if DeepSeek's structured-output reliability degrades. No routing change made.

Evaluation sample (for future rounds):

- 10–20 representative articles
- 5–10 C-UAS system records or image-review cases
- A small coding/review task

Score:

- Structured-output validity
- Source fidelity and hallucination rate
- Category/entity accuracy
- Image-review usefulness
- Latency
- Failure/retry behavior
- Relative provider cost or quota impact

No production model switch occurs from benchmark claims alone.

## Explicitly deferred or removed from the active plan

- Weekly newsletter launch
- Default delivery to existing subscribers
- Breaking-alert rollout
- Full automatic AI-backlog drain
- Separate paid Supabase project
- Public-scale capacity planning
- Preview writes to shared Production state

## Done standard

This transition is complete when:

1. Preview can demonstrate the important UI without mutating Production.
2. Production browsing and search remain functional.
3. No newsletter or AI action runs unexpectedly.
4. Background jobs are bounded and understood.
5. Local verification supports every claimed behavior.
6. Any Vercel, database, email, or deployment action has a separate approval record.

## Canonical planning note

This document supersedes the product-direction portions of `docs/superpowers/plans/2026-08-23-dronewire-full-remediation.md` and the newsletter-heavy portions of `docs/remediation-runbook.md`. The older documents remain useful as audit history and technical reference, but their scope should not be treated as a commitment to complete every proposed feature.
