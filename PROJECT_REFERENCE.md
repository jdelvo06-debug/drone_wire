# DroneWire C-UAS Hub — Project Reference

**Last updated:** 2026-08-01
**Status:** Production, active maintenance

---

## Repository

- **GitHub:** https://github.com/jdelvo06-debug/drone_wire
- **Branch:** `main`
- **Local clone:** `~/projects/drone_wire/app/`
- **Session tracker:** `~/projects/drone_wire/NEXTSESSION.md`
- **Git status as of doc refresh:** dirty local worktree with domain/mail/docs/ops changes pending commit

---

## Deployment

- **Platform:** Vercel
- **Live URL:** https://dronewire.org
- **Framework:** Next.js 14.2.28, App Router
- **Build command:** `prisma generate && next build`
- **Dev server:** `cd ~/projects/drone_wire/app && npm run dev`
- **Local port:** 3002
- **Public AI health:** `GET https://dronewire.org/api/health/ai` currently returns HTTP 200 with `status: "healthy"`
- **Verified production variables in this reconciliation:** `ADMIN_SECRET`, `OLLAMA_MODEL`, `OLLAMA_FALLBACK_MODEL`, `SITE_URL`, Gmail OAuth variables, and legacy/unused `FROM_EMAIL`

---

## Email and Domain

- **Canonical site:** `https://dronewire.org`
- **Custom domain:** Vercel serves the canonical `https://dronewire.org` URL; production `SITE_URL` matches it.
- **Inbound mail:** public Cloudflare Email Routing MX records are live for `dronewire.org`.
- **Forwarding rules:** the only intentional inbound aliases are `info@dronewire.org` and `tips@dronewire.org`.
- **Catch-all:** disabled; only intentional aliases receive mail.
- **Outbound app email:** Gmail API using `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN`.
- **Sender identity:** currently hard-coded in `lib/services/email.ts`; the production `FROM_EMAIL` variable is legacy/unused and should not be treated as active configuration.

---

## Database

- **Provider:** Supabase PostgreSQL
- **ORM:** Prisma
- **Connection:** `DATABASE_URL` in `.env.local` and Vercel env vars
- **Production connection:** Supabase transaction pooler, port 6543, `pgbouncer=true`
- **Local TLS note:** Mac Mini/Zscaler may require `NODE_TLS_REJECT_UNAUTHORIZED=0` for local scripts
- **Schema file:** `prisma/schema.prisma`

### Current Ground-Truth Counts

| Metric | Value |
|---|---:|
| Articles | 4,669 |
| Published articles | 3,296 |
| Systems | 111 |
| Explainers | 40 |
| Contracts | 228 |
| RSS feeds | 13 |
| Embeddings | 2,430 |

---

## Key Application Areas

### Systems

- **Pages:** `/systems`, `/systems/[slug]`
- **API:** `app/api/systems/route.ts`
- **Primary model:** `System`
- **Current gap:** null image coverage is resolved; remaining image risk is quality/audit confidence
- **Audit script:** `scripts/vision-audit-images.ts`
- **Fix scripts:** `scripts/fix-images-curated.ts`, `scripts/push-one.ts`

### Contracts

- **Page:** `/contracts`
- **API:** `app/api/contracts/route.ts`
- **Cron route:** `app/api/cron/scrape-contracts/route.ts`
- **Scraper:** `lib/services/usaspending-scraper.ts`
- **Old scraper:** `lib/services/contract-scraper.ts` (SAM.gov, kept for reference)
- **Seed script:** `scripts/seed-contracts.ts`
- **External refresh:** Hermes cron job `e2e48f408dee`, Mondays 9 AM EST
- **Contract title state:** title cleanup is resolved; `cleanTitle()` now uses USASpending descriptions with smart title case and QA found no raw contract-number titles in the sampled set

### Explainers

- **Pages:** `/explainers`, `/explainers/[slug]`
- **Seed script:** `scripts/seed-explainers.ts`
- **Current state:** 40 DB explainers
- **Recent fix:** FeaturedExplainers now queries DB as an async server component

### Articles / News

- **Pages:** `/articles`, `/articles/[id]`
- **API:** `app/api/articles/route.ts`, `app/api/articles/[id]/route.ts`
- **RSS route:** `app/feed.xml/route.ts`
- **Scraper:** `lib/services/rss-scraper.ts`
- **AI processor:** `lib/services/ai-processor.ts`

---

## Key Files

### Docs

| Path | Purpose |
|---|---|
| `README.md` | Project overview, setup, commands |
| `PROJECT_REFERENCE.md` | Operator reference and current state |
| `docs/project-status.md` | Current project status and roadmap |
| `docs/changelog.md` | Release and change history |
| `docs/architecture.md` | Architecture and data flow |
| `../NEXTSESSION.md` | Durable next-work tracker |

### Services

| Path | Purpose |
|---|---|
| `lib/services/usaspending-scraper.ts` | Current contracts scraper using USASpending.gov Awards API |
| `lib/services/contract-scraper.ts` | Deprecated SAM.gov scraper kept for reference |
| `lib/services/rss-scraper.ts` | RSS news feed scraper |
| `lib/services/ai-processor.ts` | AI article processing pipeline |
| `lib/services/image-reprocessor.ts` | Article image reprocessing |
| `lib/services/semantic-search.ts` | Similarity/semantic search support |

### Scripts

| Path | Purpose |
|---|---|
| `scripts/seed-systems.ts` | Seeds/updates C-UAS systems |
| `scripts/seed-contracts.ts` | Refreshes contract data from USASpending.gov |
| `scripts/seed-explainers.ts` | Seeds/updates explainer articles |
| `scripts/seed-procurement-data.ts` | Adds procurement intelligence to systems |
| `scripts/fix-images-curated.ts` | Batch image URL updates for systems |
| `scripts/vision-audit-images.ts` | Vision-based audit of system images |
| `scripts/push-one.ts` | Single-system image update utility |
| `scripts/cleanup.ts` | Cleanup script used during system list reduction |

### API Routes

| Path | Purpose |
|---|---|
| `app/api/articles/route.ts` | Articles API |
| `app/api/articles/[id]/route.ts` | Single article API |
| `app/api/contracts/route.ts` | Contracts API with pagination, filters, aggregates |
| `app/api/systems/route.ts` | Systems API |
| `app/api/stats/route.ts` | Live stats API |
| `app/api/search/route.ts` | Search API |
| `app/api/newsletter/subscribe/route.ts` | Newsletter signup |
| `app/api/contact/route.ts` | Contact form |
| `app/api/cron/scrape-news/route.ts` | News scrape cron endpoint |
| `app/api/cron/process-ai/route.ts` | AI processing cron endpoint |
| `app/api/cron/scrape-contracts/route.ts` | Contract scrape cron endpoint |
| `app/api/admin/*` | Admin/maintenance endpoints protected by secret/auth |

---

## Current Image Situation

### Ground Truth

The current database contains **111 systems** and **40 explainers**. This reconciliation did not re-audit image coverage, so historical image-audit results below should not be read as a current count.

### Context

- Temporary 100% image coverage was reached during the May 3 image sprint.
- Follow-on vision audit and curated fixes invalidated several weak/dead image choices.
- `fix-images-curated.ts` updated 15 records successfully and set 13 to null because DVIDS URLs returned 404.
- Bayraktar TB2 was later fixed with a verified Wikipedia Commons image.
- A May 7 resourcing pass restored 115/115 system image URL coverage, including stable/local fixes for Bal Chatri and ODIN.
- **May 9-10 explainer pass:** DVIDS CDN migration broke 22 explainer images; all migrated then vision-audited. Found 7 content mismatches (wrong subject entirely) and 2 marginal fits (too generic). All 9 replaced with Wikimedia Commons images. Final: 40/40 explainers, all unique, all Commons-stable.
- The larger quality problem remains: some system images may still be generic/uncertain based on the vision audit.

---

## Known Constraints

- DVIDS CloudFront thumbnails are not guaranteed stable.
- Some manufacturer sites block scraping or hotlinking.
- Some product pages render images through video/canvas and do not expose normal image URLs.
- BAE Systems can trigger Imperva/hCaptcha.
- Anduril often uses canvas/video media.
- Re-hosting may be required for blocked sources.
- Database state is authoritative; always query DB before making claims about counts.

---

## Standard Workflows

### Start a DroneWire Session

1. Read `~/projects/drone_wire/NEXTSESSION.md`.
2. Query the live database for current counts.
3. Check git status.
4. Report what is next, not just what was completed.
5. Update `NEXTSESSION.md` after any meaningful batch.

### Run Local Dev Server

```bash
cd ~/projects/drone_wire/app
npm run dev
```

### Run Tests

```bash
cd ~/projects/drone_wire/app
npm test
```

### Build

```bash
cd ~/projects/drone_wire/app
npm run build
```

### Run DB Scripts Locally

```bash
cd ~/projects/drone_wire/app
set -a && source .env.local && set +a
NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/<script-name>.ts
```

### Deploy

```bash
cd ~/projects/drone_wire/app
git push origin main
```

---

## Current Next Up

1. Re-run the vision audit before treating historical PASS/FAIL/UNCERTAIN image results as current.
2. Review any image-quality backlog established by that fresh audit.
3. ~~Verify contract title display.~~ ✅ Fixed (v1.7.2) — `cleanTitle()` rewritten to use descriptions with smart title case. QA verified live.
4. Review any remaining ghost data or stale content across sections.
