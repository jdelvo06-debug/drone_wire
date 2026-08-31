# AI Processor Queue Selection Fix — Fresh-First with Recency Window

**Repo:** `/Users/jeremydelvaux/projects/drone_wire/app`
**Branch/worktree:** `main` (clean; work on a new branch `fix/ai-queue-selection`)
**Goal:** The daily AI-processing batch prioritizes genuinely fresh articles so the site publishes current news instead of draining a 6-month-old backlog oldest-first.

## Background (context for the builder)

The production incident (2026-08-30): the site stopped publishing for 3 days. Root cause: `processPendingArticles()` in `lib/services/ai-processor.ts` selects `orderBy: { publishedAt: 'asc' }` with no recency bound. The pending queue held ~1,100 items, the oldest of which were 837 unfetchable Feb–Apr Exa-dump items (vendor homepages, Facebook/LinkedIn posts, dead PDFs). Each daily cron run (limit 5) pulled the 5 oldest, all failed, and nothing published. The junk was quarantined manually (reversible: `aiQuarantinedAt` + `exclusionReason: 'exa-dump-unfetchable-2026-05'`), but ~104 March items still sit ahead of 19 fresh August items. Oldest-first is the wrong default for a news site.

## Scope

- `lib/services/ai-processor.ts` — ONLY the selection query in `processPendingArticles()` (lines ~611-623) and the matching re-claim `updateMany` guard (~637-652).
- `__tests__/ai-processor-resilience.test.ts` — add fail-first behavioral tests for the new selection logic (this file already mocks prisma; follow its existing patterns).

## Required behavior

Replace `orderBy: { publishedAt: 'asc' }` with a two-tier selection:

1. **Fresh tier (first):** articles with `publishedAt >= now - 30 days`, ordered NEWEST-first (`publishedAt: 'desc'`), taken first up to the limit.
2. **Backlog tier (fallback):** if fewer than `limit` fresh articles are eligible, fill the remainder from older pending articles ordered oldest-first (`publishedAt: 'asc'`) — the current behavior, as a fallback only.

Implementation options (builder's choice, but must satisfy the acceptance criteria):
- Two queries (fresh first, then backlog fill) and concatenate; or
- One query ordered by a computed tier with raw SQL; or
- Any equivalent approach that keeps the existing eligibility filters (`status: 'pending_ai'`, `aiRetryCount < 5`, `aiQuarantinedAt: null`, retry-timing and stale-claim guards) intact for BOTH tiers.

The re-claim `updateMany` guard (which prevents double-processing) must continue to match whatever the selection returns.

Do NOT change:
- Batch size default (5) or the `?limit=` cap (50) in `app/api/cron/process-ai/route.ts`.
- The per-article processing pipeline (`processArticleWithAI`), provider fallback, retry backoff (`nextAiRetryState`), quarantine mechanics, or the pause-every-five pacing.
- The `scrape-news` cron or RSS/Exa ingestion.

## Acceptance criteria

- [ ] When fresh (<30 days old) eligible articles exist, they are selected FIRST, newest-first, ahead of older items.
- [ ] When fresh items alone fill the limit, NO backlog items are selected.
- [ ] When fresh items are fewer than the limit, the remainder comes from the oldest eligible backlog items (existing ASC behavior preserved as fallback).
- [ ] When NO fresh items exist, selection degrades to exactly today's behavior (oldest-first across all eligible).
- [ ] All existing eligibility guards (quarantine skip, retry cap, retry timing, stale-claim) still apply to both tiers.
- [ ] New fail-first tests cover all four selection scenarios above.
- [ ] Existing test suite passes unmodified except for the new/updated selection tests: `npm test` (42 suites / 312 tests baseline; 23 pre-existing skips are expected).
- [ ] `npm run lint` passes. `npx tsc --noEmit` passes. `NODE_ENV=production npm run build` passes.

## Verification commands

```bash
cd /Users/jeremydelvaux/projects/drone_wire/app
npm test
npm run lint
npx tsc --noEmit
NODE_ENV=production npm run build
```

## Non-goals

- No database writes or data cleanup of any kind (the manual quarantine already applied; do not touch it).
- No deployment, no push, no PR, no commit unless explicitly authorized.
- No changes to scraping, digest, alerts, or search subsystems.
- No UI changes. No dependency updates. No schema/migration changes.
- Do not "drain" the backlog by processing it faster — the fix is ordering, not throughput.

## Builder boundary

- Inspect `AGENTS.md` at the repo root first; the tree is clean on `main` — if you find unrelated dirty work, preserve it untouched.
- Use existing project patterns (see `__tests__/ai-processor-resilience.test.ts` for the prisma-mock pattern).
- Do not push, open a PR, merge, deploy, alter credentials/providers, restart services, or make database/cloud mutations.
- Do not commit unless Jeremy explicitly authorizes a local commit for this packet.
- End with a compact SITREP: changed files, tests/build results, remaining risks, commit status.