# DroneWire Project Status

**Last Updated:** January 11, 2026
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
| Explainers Library | ✅ Working | 24 explainers with categories |
| Explainer Detail | ✅ Working | Full content, sidebar with features |
| Contracts Page | ✅ Working | DoD contracts with sorting |
| About Page | ✅ Working | Project information |
| Dark/Light Mode | ✅ Working | Theme toggle in header |
| Mobile Responsive | ✅ Working | Responsive navigation |
| Newsletter Signup | ✅ Working | Form submission (no email yet) |
| Contact Form | ✅ Working | Form submission (no email yet) |

### Data Pipeline

| Component | Status | Schedule |
|-----------|--------|----------|
| RSS Scraping | ✅ Active | Daily 6 AM UTC (Vercel cron) |
| AI Processing | ✅ Active | Daily 8 AM UTC (Vercel cron) |
| Contract Scraping | ⚠️ Manual | Trigger via curl (free tier limit) |

### Database

| Metric | Count |
|--------|-------|
| Articles | 10 |
| Explainers | 24 |
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

---

## Known Issues

### Active Issues

| Issue | Severity | Workaround |
|-------|----------|------------|
| No article images | Low | Placeholder shown |
| No email notifications | Medium | Forms save to DB only |
| manifest.json 404 | Low | PWA not configured |

### Resolved Issues

| Issue | Resolution Date | Solution |
|-------|-----------------|----------|
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

### In Progress (Priority 2)
- [ ] Article detail page enhancements
- [ ] Search functionality improvements
- [ ] Related articles section

### Planned (Priority 3)
- [ ] Email integration with Resend
- [ ] Newsletter confirmation emails
- [ ] Contact form notifications
- [ ] RSS feed output (/feed.xml)

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
