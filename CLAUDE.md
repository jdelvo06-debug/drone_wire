# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DroneWire is a Next.js 14 web application serving as an AI-curated intelligence hub for drone warfare, counter-UAS technology, defense contracts, and related policy. The main application code lives in `/counter_uas_hub/app/`.

**Live Site:** https://drone-wire.vercel.app

## Commands

All commands should be run from the `/counter_uas_hub/app/` directory:

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint

# Seed RSS feeds and tags
npx tsx scripts/seed-rss-feeds.ts

# Prisma commands
npx prisma generate    # Regenerate Prisma client after schema changes
npx prisma db push     # Push schema changes to database
npx prisma studio      # Open database GUI

# Manually trigger cron jobs (for testing)
curl http://localhost:3000/api/cron/scrape-news -H "Authorization: Bearer $CRON_SECRET"
curl http://localhost:3000/api/cron/scrape-contracts -H "Authorization: Bearer $CRON_SECRET"
curl http://localhost:3000/api/cron/process-ai -H "Authorization: Bearer $CRON_SECRET"
```

## Deployment

### Vercel Configuration
- **Platform:** Vercel (hobby tier)
- **Node.js Version:** 20.x (specified in `.nvmrc` and `package.json` engines)
- **Build Command:** `prisma generate && next build`
- **Cron Jobs:** 2 jobs configured (free tier limit)
  - `/api/cron/scrape-news` - Daily at 6 AM UTC
  - `/api/cron/process-ai` - Daily at 8 AM UTC

### Database (Supabase)
- **Provider:** Supabase PostgreSQL (free tier)
- **Connection:** Transaction pooler (IPv4 compatible)
- **Host:** `aws-0-us-west-2.pooler.supabase.com:6543`
- **Important:** Must use `?pgbouncer=true` for Prisma compatibility

### Environment Variables (Vercel)
- `DATABASE_URL` - Supabase pooler connection string
- `ABACUSAI_API_KEY` - AI processing key
- `ROUTELLM_API_KEY` - Alternative AI routing key
- `CRON_SECRET` - Authentication for cron endpoints
- `SAM_GOV_API_KEY` - SAM.gov API key for contract data
- `RESEND_API_KEY` - Resend API key for transactional emails
- `ADMIN_EMAIL` - Admin email for contact form notifications (optional)

## Architecture

### Tech Stack
- **Framework:** Next.js 14.2.28 with App Router and Server Components
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL via Prisma ORM (Supabase hosted)
- **Styling:** Tailwind CSS with dark mode support
- **UI Components:** Shadcn/UI (49 components in `/components/ui/`)
- **State Management:** Zustand + Jotai + TanStack Query
- **Forms:** React Hook Form + Zod validation
- **AI Processing:** AbacusAI / RouteLLM

### Directory Structure

```
/counter_uas_hub/app/
├── /app                    # Next.js App Router
│   ├── /api
│   │   ├── /articles      # Articles REST API (GET, POST)
│   │   ├── /contracts     # Contracts REST API
│   │   ├── /explainers    # Explainers REST API
│   │   ├── /cron          # Automated scraping endpoints
│   │   │   ├── /scrape-news
│   │   │   ├── /scrape-contracts
│   │   │   └── /process-ai
│   │   ├── /contact
│   │   └── /newsletter
│   ├── /articles          # Article listing and detail pages
│   │   └── /[id]          # Dynamic article detail
│   ├── /explainers        # Educational content pages
│   │   └── /[slug]        # Dynamic explainer detail
│   ├── /systems           # Counter-UAS systems database
│   │   └── /[slug]        # Dynamic system detail
│   ├── /contracts         # Defense contracts pages
│   ├── /admin             # Admin dashboard (stats)
│   ├── /about             # About page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── /components
│   ├── /ui                # Shadcn/UI primitives (49 components)
│   ├── /home              # Home page sections
│   ├── /layout            # Header, Footer, Navigation
│   ├── /articles          # Article components
│   ├── /explainers        # Explainer components
│   ├── /systems           # Systems components
│   └── /contracts         # Contract components
├── /hooks                 # Custom React hooks
├── /lib
│   ├── /services          # Data pipeline services
│   │   ├── rss-scraper.ts       # RSS feed scraping
│   │   ├── content-extractor.ts # Full article extraction
│   │   ├── ai-processor.ts      # AI summary generation
│   │   └── contract-scraper.ts  # DoD contracts scraping
│   ├── /constants
│   │   └── rss-feeds.ts   # Feed URLs and keywords
│   ├── db.ts              # Prisma client singleton
│   └── utils.ts           # Utility functions (cn helper)
├── /scripts
│   ├── seed-rss-feeds.ts  # RSS feeds seeding
│   ├── seed-explainers.ts # Explainers seeding
│   └── seed-systems.ts    # Systems database seeding
├── /prisma
│   └── schema.prisma      # Database models
├── vercel.json            # Cron job configuration
├── .nvmrc                 # Node.js version (20)
└── package.json           # Dependencies and scripts
```

### Key Data Models (Prisma)

- **Article** - News articles with AI summaries, tags, sources
- **Explainer** - Educational guides with difficulty levels, categories
- **System** - Counter-UAS systems (C2, sensors, effectors, integrated)
- **Contract** - Government defense contracts (DoD)
- **Tag** - Categories for articles/explainers/systems (many-to-many)
- **NewsletterSubscriber** - Email subscriptions
- **RssFeed** - Content aggregation sources

### C-UAS Systems Database

The Systems section (`/systems`) provides a comprehensive database of counter-UAS technologies:

**Categories:**
- `integrated` - Complete C-UAS solutions (FS-LIDS, MADIS, Iron Dome, Drone Dome)
- `sensor` - Detection systems (KURFS, AN/TPQ-50 LSTAR, DroneShield RfPatrol)
- `effector` - Defeat systems (Coyote, THOR, DroneDefender)

**Status Types:** `operational`, `contracted`, `development`, `prototype`, `retired`

**Current Systems (13):**
- US: FS-LIDS, M-LIDS, MADIS, L-MADIS, KURFS, AN/TPQ-50 LSTAR, Coyote Block 2+/3, THOR, DroneDefender
- Israel: Iron Dome, Drone Dome
- Australia: DroneShield RfPatrol

**Image Sources:** System images are sourced from DVIDS (DoD public domain), manufacturer websites (Raytheon, Rafael, SRC Inc., DroneShield, AFRL), and defense publications.

**Seeding:** `npx tsx scripts/seed-systems.ts`

### API Routes

**Frontend APIs:**
- `GET /api/articles` - Paginated articles with filtering/search
- `GET /api/articles/[id]` - Single article detail
- `GET /api/contracts` - Paginated contracts with sorting
- `GET /api/explainers` - Paginated explainers with filtering
- `GET /api/systems` - Paginated systems with category/status filters
- `POST /api/systems` - Increment system view count
- `POST /api/newsletter/subscribe` - Newsletter subscription
- `POST /api/contact` - Contact form submission

**Cron Endpoints (authenticated via CRON_SECRET):**
- `GET /api/cron/scrape-news` - Scrape RSS feeds for new articles
- `GET /api/cron/scrape-contracts` - Scrape DoD contracts
- `GET /api/cron/process-ai` - Generate AI summaries and tags

## Data Pipeline

The scraping pipeline runs automatically via Vercel cron:
1. **scrape-news** (6 AM UTC) - Fetches RSS feeds, filters by counter-UAS keywords
2. **process-ai** (8 AM UTC) - Generates AI summaries, key points, and auto-tags

Manual triggers available for:
- **scrape-contracts** - DoD contract announcements (trigger manually as needed)

Keywords for filtering are defined in `/lib/constants/rss-feeds.ts`.

## Development Patterns

- Use `cn()` utility from `/lib/utils.ts` for conditional Tailwind classes
- Prisma client is a singleton exported from `/lib/db.ts`
- All pages using Prisma must have `export const dynamic = 'force-dynamic'`
- Shadcn components use Radix UI primitives - check existing `/components/ui/` first
- Dark/light theming via `next-themes` with `ThemeProvider` wrapper

## Known Issues & Solutions

### Supabase IPv4 Connection
Supabase free tier requires Transaction pooler for IPv4 networks (like Vercel):
- Use `pooler.supabase.com:6543` not `db.supabase.co:5432`
- Add `?pgbouncer=true` to connection string for Prisma

### Vercel Free Tier Limits
- Max 2 cron jobs (scrape-contracts runs manually)
- Node.js 20.x required (not 24.x)

### Static Generation Errors
Pages using Prisma at build time will fail. Add to each page:
```typescript
export const dynamic = 'force-dynamic'
```
