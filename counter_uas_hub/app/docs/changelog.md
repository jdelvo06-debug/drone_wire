# Changelog

All notable changes to DroneWire are documented in this file.

## [1.4.0] - 2026-01-15

### Systems Database (New Feature)

Added new "Systems" tab showcasing Counter-UAS systems including C2 systems, sensors, effectors, and integrated solutions.

**Database:**
- Added `System` model with comprehensive fields (category, manufacturer, country, specifications, combat record, etc.)
- Added `SystemTag` join table for many-to-many tag relationships
- Categories: c2 (Command & Control), sensor, effector, integrated
- Status types: operational, contracted, development, prototype

**API:**
- `GET /api/systems` - Paginated list with category, status, country, manufacturer, and search filters
- `POST /api/systems` - Increment view count

**Pages:**
- `/systems` - Listing page with featured section, category/status filters, search
- `/systems/[slug]` - Detail page with specifications sidebar, combat record, related systems

**Components:**
- `components/systems/systems-header.tsx` - Search and filter controls

**Seed Data (13 systems):**
- US Integrated: FS-LIDS, M-LIDS, MADIS, L-MADIS
- US Sensors: KURFS, LSTAR
- US Effectors: Coyote Block 2+, Coyote Block 3, THOR, DroneDefender
- Allied: Drone Dome (Israel), Iron Dome (Israel), DroneShield RfPatrol (Australia)

**Navigation:**
- Added "Systems" tab to main navigation (between Articles and Explainers)

**Files Created:**
- `prisma/schema.prisma` (updated with System, SystemTag models)
- `app/api/systems/route.ts`
- `app/systems/page.tsx`
- `app/systems/[slug]/page.tsx`
- `components/systems/systems-header.tsx`
- `scripts/seed-systems.ts`

**Files Modified:**
- `components/layout/header.tsx` (navigation)

**Known Limitation:**
- System images currently use placeholder icons by category (photos pending - need verified public domain/DoD images)

---

## [1.3.0] - 2026-01-12

### UI/UX Polish (Priority 4)

**Stats Section Improvements:**
- Created `/api/stats` endpoint for real-time database counts
- Stats section now fetches live data (articles, contracts, explainers)
- Removed hardcoded inflated numbers

**Visual Fixes:**
- Fixed category badges displaying pipe-separated values (now shows primary only)
- Added proper text truncation to article excerpts (`line-clamp-2`)
- Fixed explainer titles being cut off in sidebar (removed `line-clamp-1`)

**Content Seeding:**
- Created `/api/admin/seed-explainers` endpoint with 24 comprehensive explainers
- Seeded 17 new counter-UAS explainers to production (23 total)

**Files Changed:**
- `app/api/stats/route.ts` (new)
- `app/api/admin/seed-explainers/route.ts` (new)
- `components/home/stats-section.tsx`
- `components/home/news-section.tsx`
- `components/home/featured-explainers.tsx`

---

## [1.2.0] - 2026-01-12

### Email Integration (Priority 3)

- Integrated Resend for transactional emails
- Newsletter welcome emails now working
- RSS feed available at `/feed.xml`
- Contact form saves to database (email notifications pending ADMIN_EMAIL)

**Files Changed:**
- `lib/services/email.ts` (new)
- `app/api/newsletter/subscribe/route.ts`
- `app/feed.xml/route.ts` (new)

---

## [1.1.0] - 2026-01-12

### Core UX Enhancements (Priority 2)

- Header search now functional with results dropdown
- Related articles section using embedding-based similarity
- Dynamic related explainers based on article category
- Trending topics show real tag counts from database
- Enhanced article image extraction from RSS and content

**Files Changed:**
- `components/layout/header.tsx`
- `components/articles/related-articles.tsx` (new)
- `components/articles/related-explainers.tsx` (new)
- `lib/services/rss-scraper.ts`
- `lib/services/content-extractor.ts`

---

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

### Priority 5: Future Enhancements
- [ ] System images (need verified public domain/DoD photos)
- [ ] Admin dashboard improvements
- [ ] AI-powered related articles (embeddings)
- [ ] Email alerts for breaking news
- [ ] Analytics and metrics

### TODO
- [ ] Set ADMIN_EMAIL in Vercel for contact form notifications
- [ ] Add public domain images to Systems database

---

## Version History Summary

| Version | Date | Description |
|---------|------|-------------|
| 1.4.0 | 2026-01-15 | Systems database with 13 C-UAS systems |
| 1.3.0 | 2026-01-12 | UI/UX polish, dynamic stats, explainer seeding |
| 1.2.0 | 2026-01-12 | Email integration (Resend), RSS feed |
| 1.1.0 | 2026-01-12 | Search, related articles, image extraction |
| 1.0.0 | 2026-01-11 | Initial production release |
