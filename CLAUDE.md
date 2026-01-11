# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DroneWire is a Next.js 14 web application serving as an AI-curated intelligence hub for drone warfare, counter-UAS technology, defense contracts, and related policy. The main application code lives in `/counter_uas_hub/app/`.

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

# Manually trigger scraping (for testing)
curl http://localhost:3000/api/cron/scrape-news -H "Authorization: Bearer $CRON_SECRET"
curl http://localhost:3000/api/cron/scrape-contracts -H "Authorization: Bearer $CRON_SECRET"
curl http://localhost:3000/api/cron/process-ai -H "Authorization: Bearer $CRON_SECRET"
```

## Architecture

### Tech Stack
- **Framework:** Next.js 14 with App Router and Server Components
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL via Prisma ORM
- **Styling:** Tailwind CSS with dark mode support
- **UI Components:** Shadcn/UI (49 components in `/components/ui/`)
- **State Management:** Zustand + Jotai + TanStack Query
- **Forms:** React Hook Form + Zod validation
- **Package Manager:** Yarn

### Directory Structure

```
/counter_uas_hub/app/
├── /app                    # Next.js App Router
│   ├── /api
│   │   ├── /articles      # Articles REST API
│   │   ├── /contracts     # Contracts REST API
│   │   ├── /cron          # Automated scraping endpoints
│   │   │   ├── /scrape-news
│   │   │   ├── /scrape-contracts
│   │   │   └── /process-ai
│   │   ├── /contact
│   │   └── /newsletter
│   ├── /articles          # Article pages
│   ├── /explainers        # Educational content pages
│   ├── /contracts         # Defense contracts pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── /components
│   ├── /ui                # Shadcn/UI primitives
│   ├── /home              # Home page sections
│   ├── /layout            # Header, Footer
│   ├── /articles          # Article components
│   ├── /explainers        # Explainer components
│   └── /contracts         # Contract components
├── /hooks                 # Custom React hooks
├── /lib
│   ├── /services          # Data pipeline services
│   │   ├── rss-scraper.ts       # RSS feed scraping
│   │   ├── content-extractor.ts # Full article extraction
│   │   ├── ai-processor.ts      # AbacusAI integration
│   │   └── contract-scraper.ts  # DoD contracts scraping
│   ├── /constants
│   │   └── rss-feeds.ts   # Feed URLs and keywords
│   ├── db.ts              # Prisma client singleton
│   └── utils.ts           # Utility functions (cn helper)
├── /scripts
│   └── seed-rss-feeds.ts  # Database seeding script
├── /prisma
│   └── schema.prisma      # Database models
└── vercel.json            # Cron job configuration
```

### Key Data Models (Prisma)

- **Article** - News articles with AI summaries, tags, sources
- **Explainer** - Educational guides with difficulty levels
- **Contract** - Government defense contracts
- **Tag** - Categories for articles/explainers (many-to-many via junction tables)
- **NewsletterSubscriber** - Email subscriptions
- **RssFeed** - Content aggregation sources

### API Routes

**Frontend APIs:**
- `GET /api/articles` - Paginated articles with filtering
- `GET /api/contracts` - Paginated contracts with sorting
- `POST /api/newsletter/subscribe` - Newsletter subscription
- `POST /api/contact` - Contact form submission

**Cron Endpoints (automated via Vercel):**
- `GET /api/cron/scrape-news` - Scrape RSS feeds for new articles
- `GET /api/cron/scrape-contracts` - Scrape DoD contracts
- `GET /api/cron/process-ai` - Process articles with AbacusAI

## Data Pipeline

The scraping pipeline runs automatically:
1. **scrape-news** (every 4 hours) - Fetches RSS feeds, filters by counter-UAS keywords, stores articles
2. **scrape-contracts** (daily at 6 AM) - Fetches DoD contract announcements
3. **process-ai** (15 min after scraping) - Generates AI summaries, key points, and auto-tags

Keywords for filtering are defined in `/lib/constants/rss-feeds.ts`.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `ABACUSAI_API_KEY` - AbacusAI integration key
- `CRON_SECRET` - Secret for authenticating cron requests

## Patterns

- Use the `cn()` utility from `/lib/utils.ts` for conditional Tailwind classes
- Prisma client is a singleton exported from `/lib/db.ts`
- Shadcn components use Radix UI primitives - check existing `/components/ui/` before adding new ones
- Dark/light theming via `next-themes` with `ThemeProvider` wrapper
