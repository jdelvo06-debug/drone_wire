# DRONE_Wire - Learnings

Things Claude has learned about this project. Updated as we work together.

## Architecture
- Next.js 14 with App Router
- Prisma ORM with Supabase PostgreSQL
- Tailwind CSS + Shadcn/UI (49 components)
- OpenAI (GPT-4o) for AI processing and embeddings
- Exa AI for semantic web search (content discovery beyond RSS)

## Key Files
- `prisma/schema.prisma` — Database schema
- `app/api/` — API routes
- `lib/db.ts` — Prisma client singleton
- `lib/services/rss-scraper.ts` — RSS feed scraping
- `lib/services/exa-searcher.ts` — Exa AI semantic search
- `lib/services/ai-processor.ts` — AI summary generation
- `lib/constants/rss-feeds.ts` — Feed URLs and keywords
- `components/ui/` — Shadcn components

## Gotchas
- `npm run dev` has port hardcoded to 3002 (`-p 3002`) — the `PORT` env var is ignored by the script
- Port 3000 used by Open WebUI (Docker), port 4000 used by Ham Radio app — use 4001+ for DroneWire during dev if 3002 is taken
- `process-ai` cron processes only 10 articles per batch — need multiple runs for large backlogs
- Supabase free tier requires Transaction pooler with `?pgbouncer=true` for Prisma
- All pages using Prisma need `export const dynamic = 'force-dynamic'`

## Working Features
- RSS feed aggregation (10+ feeds, keyword-filtered)
- Exa AI semantic search (6 queries, ~81 articles/run from non-RSS sources)
- AI-powered summaries and tagging (OpenAI GPT-4o)
- Counter-UAS systems database (72 systems)
- Defense contracts scraping (SAM.gov)
- Newsletter subscription
- Breaking news email alerts (Resend)
- Admin dashboard

## Known Issues
- Exa articles need `process-ai` run to get summaries — ~74 pending as of 2026-02-21

## Content Pipeline
1. `scrape-news` cron (6 AM UTC): RSS feeds + Exa AI search -> articles with `status: 'pending_ai'`
2. `process-ai` cron (8 AM UTC): Generates AI summaries, key points, tags -> `status: 'published'`
3. Exa search excludes RSS feed domains automatically to avoid duplicate coverage
4. Exa deduplication: URL match + normalized title similarity against last 14 days
