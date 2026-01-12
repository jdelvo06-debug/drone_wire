# Changelog

All notable changes to DroneWire are documented in this file.

## [1.0.0] - 2026-01-11

### Initial Production Release

First production deployment of DroneWire to Vercel.

**Live Site:** https://drone-wire.vercel.app

### Features
- **Articles Section** - AI-curated news articles with summaries, key points, and auto-tagging
- **Explainers Library** - 24 educational guides on counter-UAS systems and technologies
- **Contracts Page** - DoD defense contract tracking
- **Home Page** - Featured articles, latest intel, newsletter signup
- **About Page** - Project information
- **Admin Dashboard** - Basic statistics (articles, sources, processing rates)

### Data Pipeline
- RSS feed scraping from multiple defense/drone news sources
- AI processing via AbacusAI for summaries and categorization
- Automated daily cron jobs (scrape-news at 6 AM, process-ai at 8 AM UTC)

### Technical Stack
- Next.js 14.2.28 with App Router
- TypeScript (strict mode)
- Prisma ORM with Supabase PostgreSQL
- Tailwind CSS with dark mode
- 49 Shadcn/UI components

---

## Deployment History

### 2026-01-11 - Production Fix: Database Connection

**Problem:** Vercel deployment returning 500 errors on all database pages.

**Root Cause:** Supabase direct connection (port 5432) requires IPv6, but Vercel uses IPv4.

**Solution:**
1. Changed DATABASE_URL to use Transaction pooler:
   - From: `db.qbeioesktbpvdlgzrgsm.supabase.co:5432`
   - To: `aws-0-us-west-2.pooler.supabase.com:6543`
2. Added `?pgbouncer=true` for Prisma compatibility

**Files Changed:**
- Vercel Environment Variables (DATABASE_URL)
- `.env` (local development)

---

### 2026-01-11 - Production Fix: Cron Job Limit

**Problem:** Vercel deployment failing with "Your plan allows your team to create up to 2 Cron Jobs".

**Solution:** Reduced cron jobs from 4 to 2 in `vercel.json`:
- Kept: `scrape-news`, `process-ai`
- Removed: `scrape-contracts`, `send-alerts` (can be triggered manually)

**Files Changed:**
- `vercel.json`

---

### 2026-01-11 - Production Fix: Module Resolution Error

**Problem:** Build failing with "Cannot find module 'next/dist/compiled/next-server/server.runtime.prod.js'"

**Root Cause:** Experimental `outputFileTracingRoot` config pointing to wrong directory.

**Solution:** Removed experimental config from `next.config.js`:
```javascript
// Removed:
experimental: {
  outputFileTracingRoot: path.join(__dirname, '../'),
}
```

**Files Changed:**
- `next.config.js`

---

### 2026-01-11 - Production Fix: Node.js Version

**Problem:** Build inconsistencies with Node.js 24.x on Vercel.

**Solution:**
1. Created `.nvmrc` with Node 20
2. Added `engines` field to `package.json`
3. Changed Vercel Node.js setting to 20.x

**Files Changed:**
- `.nvmrc` (created)
- `package.json`

---

### 2026-01-11 - Production Fix: Prisma Generation

**Problem:** PrismaClientInitializationError on Vercel - client not generated.

**Solution:** Added prisma generate to build command:
```json
"build": "prisma generate && next build"
```

**Files Changed:**
- `package.json`

---

### 2026-01-11 - Production Fix: Static Generation Errors

**Problem:** Build failing when Prisma runs during static page generation.

**Solution:** Added `export const dynamic = 'force-dynamic'` to all pages using Prisma:
- `app/articles/page.tsx`
- `app/articles/[id]/page.tsx`
- `app/explainers/page.tsx`
- `app/explainers/[slug]/page.tsx`
- `app/admin/page.tsx`

**Files Changed:**
- Multiple page components

---

## Pending Features

### Priority 2: Core UX Enhancements
- [ ] Full-text search with highlighted results
- [ ] Related articles on detail pages

### Priority 3: Engagement Features
- [ ] Email integration (Resend)
- [ ] Newsletter confirmation emails
- [ ] RSS feed output (`/feed.xml`)

### Priority 4: Enhancements
- [ ] AI-powered related articles (embeddings)
- [ ] Email alerts for breaking news
- [ ] Enhanced admin analytics

---

## Version History Summary

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-01-11 | Initial production release |
