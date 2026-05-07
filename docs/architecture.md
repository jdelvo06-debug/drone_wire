# DroneWire Architecture

**Last updated:** 2026-05-07

DroneWire is a production Counter-UAS intelligence hub. It combines an RSS-backed article pipeline, AI enrichment, a C-UAS systems database, an explainer library, and a real defense-contract tracker backed by Supabase PostgreSQL.

---

## System Overview

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DRONEWIRE SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌────────────────┐    ┌─────────────┐                  │
│  │ RSS Feeds   │    │ USASpending.gov │    │ Manual Data │                  │
│  │ News Intel  │    │ Contract Awards │    │ Images/Seeds│                  │
│  └──────┬──────┘    └───────┬────────┘    └──────┬──────┘                  │
│         │                   │                    │                         │
│         ▼                   ▼                    ▼                         │
│  ┌──────────────┐   ┌────────────────────┐  ┌────────────────────┐        │
│  │ scrape-news  │   │ scrape-contracts   │  │ Seed/Fix Scripts   │        │
│  │ Vercel cron  │   │ Manual/Hermes cron │  │ Local maintenance  │        │
│  └──────┬───────┘   └─────────┬──────────┘  └─────────┬──────────┘        │
│         │                     │                       │                   │
│         ▼                     ▼                       ▼                   │
│  ┌──────────────┐     ┌─────────────────────────────────────────────┐     │
│  │ process-ai   │────►│           SUPABASE POSTGRESQL               │     │
│  │ Vercel cron  │     │ Articles, Systems, Contracts, Explainers    │     │
│  └──────────────┘     │ Tags, Subscribers, Contact Submissions       │     │
│                       └────────────────────┬────────────────────────┘     │
│                                            │                              │
│                                            ▼                              │
│                       ┌─────────────────────────────────────────────┐     │
│                       │              NEXT.JS APP                    │     │
│                       │ Pages, Server Components, API Routes        │     │
│                       └────────────────────┬────────────────────────┘     │
│                                            │                              │
│                                            ▼                              │
│                       ┌─────────────────────────────────────────────┐     │
│                       │                 VERCEL                      │     │
│                       │          https://drone-wire.vercel.app       │     │
│                       └─────────────────────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Runtime Stack

- **Frontend/backend framework:** Next.js 14.2.28, App Router
- **Language:** TypeScript
- **Database:** Supabase PostgreSQL
- **ORM:** Prisma 6.7.0
- **Styling:** Tailwind CSS with Radix/shadcn-style UI components
- **Email:** Resend
- **Deployment:** Vercel
- **Testing:** Jest

---

## Data Flow

### 1. Article Ingestion

```text
RSS Feeds
  └─► rss-scraper.ts
        └─► content-extractor.ts
              └─► Article records in Supabase
                    └─► ai-processor.ts
                          └─► summaries, key points, why-it-matters, tags
```

Vercel cron routes:

- `/api/cron/scrape-news` — daily at 6 AM UTC
- `/api/cron/process-ai` — daily at 8 AM UTC

### 2. Contract Ingestion

```text
USASpending.gov Awards API
  └─► lib/services/usaspending-scraper.ts
        └─► scripts/seed-contracts.ts or /api/cron/scrape-contracts
              └─► Contract records in Supabase
```

Notes:

- SAM.gov scraping was replaced by USASpending.gov for reliability.
- Vercel Hobby tier only has two cron slots, so the contract refresh is scheduled externally through Hermes and can also be triggered manually.

### 3. Systems Database Maintenance

```text
Manual source research / DVIDS / manufacturer assets / re-hosted assets
  └─► scripts/fix-images-curated.ts or scripts/push-one.ts
        └─► System.imageUrl updates in Supabase
              └─► scripts/vision-audit-images.ts validates visual match quality
```

Current image state:

- 115 systems total
- 103 systems with image URLs
- 12 systems with null image URLs
- Separate quality issue: last vision audit included PASS, FAIL, UNCERTAIN, and ERROR results

### 4. Explainers Maintenance

```text
scripts/seed-explainers.ts
  └─► Explainer records in Supabase
        └─► /explainers pages and FeaturedExplainers server component
```

Current state:

- 40 explainers in DB
- 40 explainers in seed file
- Seed and DB reconciled as of May 2026

---

## Database Models

Primary Prisma models:

- `Article`
- `Tag`
- `ArticleTag`
- `ArticleRelation`
- `Explainer`
- `ExplainerTag`
- `Contract`
- `NewsletterSubscriber`
- `RssFeed`
- `ContactSubmission`
- `System`
- `SystemTag`

High-level relationships:

```text
Article ── ArticleTag ── Tag
Article ── ArticleRelation ── Article
Explainer ── ExplainerTag ── Tag
System ── SystemTag ── Tag
```

Core data tables currently used by the public site:

- Articles feed and article detail pages
- Systems list/detail pages
- Contracts tracker
- Explainers library
- Newsletter/contact forms

---

## Application Routes

### Public Pages

- `/` — home page
- `/articles` — article list
- `/articles/[id]` — article detail
- `/systems` — systems list
- `/systems/[slug]` — system detail
- `/explainers` — explainer library
- `/explainers/[slug]` — explainer detail
- `/contracts` — contracts tracker
- `/about` — about page
- `/feed.xml` — RSS output

### API Routes

- `GET /api/articles`
- `GET /api/articles/[id]`
- `GET /api/articles/[id]/related`
- `GET /api/contracts`
- `GET /api/systems`
- `POST /api/systems`
- `GET /api/stats`
- `GET /api/search`
- `POST /api/newsletter/subscribe`
- `POST /api/contact`
- `GET /api/health`

### Admin / Maintenance Routes

- `/api/admin/auth`
- `/api/admin/stats`
- `/api/admin/seed-explainers`
- `/api/admin/reprocess-images`
- `/api/admin/systems/[slug]/image`

### Cron Routes

- `/api/cron/scrape-news`
- `/api/cron/process-ai`
- `/api/cron/scrape-contracts`
- `/api/cron/send-alerts`

Only two cron routes are scheduled in Vercel because of the Hobby tier limit. Additional routes exist for manual or external triggering.

---

## Component Organization

```text
components/
├── articles/      # Article cards, lists, detail, filters, related content
├── contracts/     # Contract stats/header/table components
├── explainers/    # Explainer cards/content/library UI
├── home/          # Landing page sections
├── layout/        # Header, footer, mobile navigation
├── systems/       # Systems search/filter/list UI
└── ui/            # Reusable UI primitives
```

Important recent change:

- Featured explainers are rendered through an async server component that queries Prisma directly.
- The old/dead `ExplainersGrid` component was removed.

---

## Deployment Architecture

```text
GitHub main branch
  └─► Vercel auto-deploy
        └─► Build: prisma generate && next build
              └─► Runtime: Node.js 20.x
                    └─► Supabase transaction pooler
```

Production URL:

```text
https://drone-wire.vercel.app
```

Local dev:

```bash
cd ~/projects/drone_wire/app
npm run dev
```

Local URL:

```text
http://localhost:3002
```

---

## Security and Configuration

- Secrets live in `.env.local` locally and Vercel environment variables in production.
- `.env*` files are excluded from git.
- Cron/admin routes use `CRON_SECRET` or admin auth where implemented.
- Prisma handles parameterized database access.
- Public site does not require user login.

Important environment variables:

- `DATABASE_URL`
- `OPENAI_API_KEY`
- `CRON_SECRET`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`

---

## Operational Notes

- The database is the source of truth for counts and image state.
- `NEXTSESSION.md` is the working tracker, but it can go stale; verify before acting.
- DVIDS CloudFront thumbnail URLs are useful but unreliable long-term.
- Some manufacturer URLs block hotlinking, scraping, or vision API access.
- For complex DB writes, use standalone scripts under `scripts/` and run with `npx tsx`.
- On the Mac Mini, local script/API calls may need `NODE_TLS_REJECT_UNAUTHORIZED=0` because of the Zscaler TLS proxy.
