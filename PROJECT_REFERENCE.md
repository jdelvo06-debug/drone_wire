# DroneWire C-UAS Hub — Project Reference

**Last updated:** 2026-05-03 21:15 EST

---

## Repository

- **GitHub:** https://github.com/jdelvo06-debug/drone_wire
- **Branch:** `main`
- **Local clone:** `~/projects/drone_wire/app/`
- **Git initialized:** Yes — re-initialized 2026-05-03 after directory structure mismatch with old commits

---

## Deployment

- **Platform:** Vercel (auto-deploys from `main` on push)
- **Live URL:** https://drone-wire.vercel.app
- **Framework:** Next.js 14 (App Router)
- **Dev server:** `cd ~/projects/drone_wire/app && npm run dev` → port 3002

---

## Database

- **Provider:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Connection:** `DATABASE_URL` in `.env.local` (not committed)
- **Tables:** `systems` (115 rows), `contracts` (208 rows), `explainers`, `articles`, `newsletter_subscribers`, `contact_submissions`
- **Schema file:** `prisma/schema.prisma`

---

## Key Files

### Services
| Path | Purpose |
|---|---|
| `lib/services/usaspending-scraper.ts` | Contracts scraper — USASpending.gov Awards API (free, no auth). Searches 8 C-UAS keywords, pulls 2022-2026. |
| `lib/services/contract-scraper.ts` | Old SAM.gov scraper (replaced — kept for reference) |
| `lib/services/rss-scraper.ts` | RSS news feed scraper |
| `lib/services/ai-processor.ts` | AI article processing pipeline |

### Scripts
| Path | Purpose |
|---|---|
| `scripts/seed-contracts.ts` | Wipes ghost data, runs usaspending-scraper, populates contracts table |
| `scripts/seed-systems.ts` | Seeds C-UAS systems data |
| `scripts/seed-explainers.ts` | Seeds explainer articles |
| `scripts/seed-procurement-data.ts` | Seeds procurement intel on systems (TRL, price range, JIATF status) |
| `scripts/fix-images-curated.ts` | Batch image URL updates for systems |
| `scripts/vision-audit-images.ts` | Vision-based audit of all system images |
| `scripts/push-one.ts` | Generic single-system image push utility |
| `scripts/cleanup.ts` | Deleted 14 obscure/no-image systems |

### API Routes (App Router)
| Path | Purpose |
|---|---|
| `app/api/contracts/route.ts` | Contracts API — GET with pagination, filters, aggregates |
| `app/api/systems/route.ts` | Systems API |
| `app/api/articles/route.ts` | Articles API |
| `app/api/cron/scrape-contracts/route.ts` | Cron endpoint for contract scraping |

### Public Assets
| Path | Purpose |
|---|---|
| `public/bal-chatri.png` | AI-generated Bal Chatri image (SOCOM handheld C-sUAS detector) |
| `public/images/systems/bal-chatri.png` | Duplicate copy (scripts may have created) |
| `public/images/` | System and article images |

---

## Session Tracker

- **Path:** `~/projects/drone_wire/NEXTSESSION.md`
- Read this first on any new session to know where things stand.

---

## Current State (May 3, 2026)

| Metric | Value |
|---|---|
| Systems with images | 115/115 (100%) |
| Contracts in DB | 208 real awards |
| Total contract value | $2.34B |
| Known issues | TLS proxy (Zscaler on Mac Mini), esbuild arch mismatch (x64 on arm64) |
| Bal Chatri image | Live at `https://drone-wire.vercel.app/bal-chatri.png` |

---

## Dev Environment

- **Machine:** Mac Mini M4 (32GB/512GB)
- **User:** Jeremy Delvaux (`jeremydelvaux@Mac-mini.local`)
- **Node:** Via `.nvmrc` — runs x64 on arm64 (needs `npm rebuild esbuild` after installs)
- **TLS:** Zscaler corporate proxy — some APIs need `NODE_TLS_REJECT_UNAUTHORIZED=0`

---

## Next Up

- [ ] Fix contract titles — currently showing contractNumber instead of meaningful titles
- [ ] Vision audit on existing images (`scripts/vision-audit-images.ts`)
- [ ] Set up weekly cron for contract refresh
