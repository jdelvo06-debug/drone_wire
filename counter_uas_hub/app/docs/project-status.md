# DroneWire Project Status

**Last Updated:** January 12, 2026

---
**Live Site:** https://drone-wire.vercel.app
**Status:** Production (Live)

---

## Current State

### Working Features

| Feature | Status | Notes |
|---------|--------|-------|
| Home Page | ✅ Working | Hero, featured articles, newsletter CTA |
| Articles List | ✅ Working | 10 articles, pagination, filtering |
| Article Detail | ✅ Working | AI summaries, key points, tags |
| Explainers Library | ✅ Working | 23 explainers with categories |
| Explainer Detail | ✅ Working | Full content, sidebar with features |
| Contracts Page | ✅ Working | DoD contracts with sorting |
| About Page | ✅ Working | Project information |
| Dark/Light Mode | ✅ Working | Theme toggle in header |
| Mobile Responsive | ✅ Working | Responsive navigation |
| Newsletter Signup | ✅ Working | Welcome emails via Resend |
| Contact Form | ✅ Working | Needs ADMIN_EMAIL env var for notifications |

### Data Pipeline

| Component | Status | Schedule |
|-----------|--------|----------|
| RSS Scraping | ✅ Active | Daily 6 AM UTC (Vercel cron) |
| AI Processing | ✅ Active | Daily 8 AM UTC (Vercel cron) |
| Contract Scraping (SAM.gov) | ✅ Active | Trigger via curl (free tier limit) |

### Database

| Metric | Count |
|--------|-------|
| Articles | 14 |
| Explainers | 23 |
| Contracts | 1 |
| Tags | Multiple |
| RSS Feeds | Configured |

---

## Infrastructure Status

### Vercel Deployment

| Setting | Value |
|---------|-------|
| Platform | Vercel (Hobby Tier) |
| Node.js | 20.x |
| Build Command | `prisma generate && next build` |
| Cron Jobs | 2 of 2 (free tier max) |
| Domain | drone-wire.vercel.app |

### Supabase Database

| Setting | Value |
|---------|-------|
| Plan | Free Tier |
| Region | us-west-2 (AWS) |
| Connection | Transaction Pooler (IPv4) |
| Port | 6543 |
| Tables | 10 |

### Environment Variables (Vercel)

| Variable | Status |
|----------|--------|
| DATABASE_URL | ✅ Configured (pooler URL) |
| ABACUSAI_API_KEY | ✅ Configured |
| ROUTELLM_API_KEY | ✅ Configured |
| CRON_SECRET | ✅ Configured |
| SAM_GOV_API_KEY | ✅ Configured |
| RESEND_API_KEY | ✅ Configured |
| ADMIN_EMAIL | ⚠️ Not set (defaults to admin@dronewire.com) |

---

## Known Issues

### Active Issues

| Issue | Severity | Workaround |
|-------|----------|------------|
| No email notifications | Medium | Forms save to DB only |
| manifest.json 404 | Low | PWA not configured |

### Resolved Issues

| Issue | Resolution Date | Solution |
|-------|-----------------|----------|
| Article images missing | 2026-01-12 | Enhanced extraction + reprocessor API |
| Contract scraper 403 | 2026-01-12 | Switched to SAM.gov Opportunities API |
| Database connection (IPv4) | 2026-01-11 | Use Transaction pooler |
| Cron job limit | 2026-01-11 | Reduced to 2 jobs |
| Module resolution error | 2026-01-11 | Removed outputFileTracingRoot |
| Node.js version | 2026-01-11 | Pinned to 20.x |
| Prisma build error | 2026-01-11 | Added to build command |
| Static generation | 2026-01-11 | Added force-dynamic |

---

## Roadmap

### Completed (Priority 1)
- [x] Set up Supabase database
- [x] Seed initial data (RSS feeds, tags, explainers)
- [x] Test scraping pipeline
- [x] Deploy to Vercel
- [x] Fix production database connection

### Completed (Priority 2)
- [x] Search functionality improvements (header search now functional)
- [x] Related articles section (embedding-based similarity)
- [x] Dynamic related explainers (based on article category)
- [x] Dynamic trending topics (real tag counts from database)

### In Progress (Priority 3)
- [x] Email integration with Resend (RESEND_API_KEY configured)
- [x] Newsletter welcome emails (working)
- [ ] Contact form notifications - **TODO: Set ADMIN_EMAIL in Vercel**
- [x] RSS feed output (/feed.xml)

### Completed (Priority 4 - UI/UX Polish)
- [x] Dynamic stats section (real database counts via /api/stats)
- [x] Fixed category badges (removed pipe-separated display)
- [x] Fixed article excerpt truncation (proper line-clamp)
- [x] Fixed explainer title truncation in sidebar
- [x] Seeded 23 comprehensive counter-UAS explainers

### Future (Priority 4)
- [ ] Admin dashboard improvements
- [ ] AI-powered related articles
- [ ] Email alerts for breaking news
- [ ] Analytics and metrics

---

## Quick Commands

### Development
```bash
cd /counter_uas_hub/app
npm run dev                    # Start dev server
npx prisma studio              # Database GUI
```

### Manual Cron Triggers
```bash
# Scrape news
curl https://drone-wire.vercel.app/api/cron/scrape-news \
  -H "Authorization: Bearer $CRON_SECRET"

# Process with AI
curl https://drone-wire.vercel.app/api/cron/process-ai \
  -H "Authorization: Bearer $CRON_SECRET"

# Scrape contracts (manual only)
curl https://drone-wire.vercel.app/api/cron/scrape-contracts \
  -H "Authorization: Bearer $CRON_SECRET"

# Image stats
curl https://drone-wire.vercel.app/api/admin/reprocess-images \
  -H "Authorization: Bearer $CRON_SECRET"

# Reprocess missing images
curl -X POST https://drone-wire.vercel.app/api/admin/reprocess-images \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"limit": 20}'

# Get live stats
curl https://drone-wire.vercel.app/api/stats

# Seed explainers (check status)
curl https://drone-wire.vercel.app/api/admin/seed-explainers \
  -H "Authorization: Bearer $CRON_SECRET"

# Seed explainers (trigger)
curl -X POST https://drone-wire.vercel.app/api/admin/seed-explainers \
  -H "Authorization: Bearer $CRON_SECRET"
```

### Deployment
```bash
git push origin main           # Auto-deploys to Vercel
```

---

## Monitoring

### Vercel Dashboard
- **Logs:** https://vercel.com/jeremy-delvauxs-projects/drone-wire/logs
- **Deployments:** https://vercel.com/jeremy-delvauxs-projects/drone-wire/deployments
- **Analytics:** https://vercel.com/jeremy-delvauxs-projects/drone-wire/analytics

### Supabase Dashboard
- **Project:** https://supabase.com/dashboard/project/qbeioesktbpvdlgzrgsm
- **Database:** Table Editor, SQL Editor
- **Logs:** Database logs and API logs

---

## Contact & Support

- **Repository:** GitHub (private)
- **Issues:** Track in GitHub Issues
- **Documentation:** `/docs` folder
