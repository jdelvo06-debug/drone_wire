# DroneWire Project Status

**Last Updated:** 2026-05-16
**Status:** Production, active maintenance
**Version:** 1.7.2
**Live Site:** https://drone-wire.vercel.app

---

## Current State

Verified against the live Supabase database on **2026-05-07**.

| Area | Current State |
|---|---:|
| Articles | 2,924 |
| Systems | 115 |
| Systems with images | 115 |
| Systems missing images | 0 |
| Explainers | 40 |
| Contracts | 208 |
| Contract value | about $2.34B |

---

## Working Features

| Feature | Status | Notes |
|---|---|---|
| Home Page | Working | Hero, featured articles, latest intel, newsletter CTA |
| Articles List | Working | RSS-backed intelligence feed with pagination/filtering |
| Article Detail | Working | AI summaries, key points, tags, why-it-matters content |
| Systems Database | Working | 115 C-UAS systems; all currently have image URLs |
| System Detail | Working | Specs, combat record, related systems, manufacturer/country/status |
| Explainers Library | Working | 40 structured explainers in DB and seed file |
| Explainer Detail | Working | Rich explainer content with structured fields |
| Featured Explainers | Working | Async server component queries DB directly |
| Contracts Page | Working | 208 real USASpending award records |
| About Page | Working | Project information |
| Dark/Light Mode | Working | Theme toggle in header |
| Mobile Responsive | Working | Responsive navigation |
| Newsletter Signup | Working | Resend integration |
| Contact Form | Working | Saves to DB; email notifications need ADMIN_EMAIL if desired |

---

## Data Pipeline

| Component | Status | Schedule/Trigger |
|---|---|---|
| RSS Scraping | Active | Vercel cron: daily 6 AM UTC |
| AI Processing | Active | Vercel cron: daily 8 AM UTC |
| Contract Scraping | Active | USASpending.gov scraper; weekly Hermes cron + manual route |
| System Image Audit | Manual | `scripts/vision-audit-images.ts` |
| System Image Fixes | Manual | `scripts/fix-images-curated.ts`, `scripts/push-one.ts` |
| Explainer Seeding | Manual | `scripts/seed-explainers.ts` |

---

## Infrastructure Status

### Vercel Deployment

| Setting | Value |
|---|---|
| Platform | Vercel Hobby Tier |
| Runtime | Node.js 20.x |
| Build Command | `prisma generate && next build` |
| Cron Jobs | 2 of 2 Vercel cron slots used |
| Production Domain | https://drone-wire.vercel.app |
| Deployment Model | Push to `main` auto-deploys |

### Supabase Database

| Setting | Value |
|---|---|
| Provider | Supabase PostgreSQL |
| Region | us-west-2 |
| Connection | Transaction pooler |
| Port | 6543 |
| ORM | Prisma |
| Local env file | `.env.local` |

### Environment Variables

| Variable | Status |
|---|---|
| DATABASE_URL | Configured |
| OPENAI_API_KEY | Configured where AI processing is used |
| CRON_SECRET | Configured |
| RESEND_API_KEY | Configured |
| ADMIN_EMAIL | Follow-up if contact notification emails are desired |

---

## Active Issues / Follow-Ups

### High Priority

1. **System image quality backlog**
   - Ground truth from DB: 115/115 systems have image URLs.
   - Remaining image work is quality-focused: FAIL/UNCERTAIN audit results.
   - Many are the result of DVIDS CloudFront thumbnail URLs returning 404.
   - Explainers: fully resolved — 40/40 Commons-sourced, zero DVIDS links.

2. **Image audit backlog**
   - Last full vision audit found many images that were generic, uncertain, failed, or inaccessible.
   - Current known audit result: 43 PASS, 13 FAIL, 49 UNCERTAIN, 10 ERROR from the 115-system audit.
   - This is separate from the null-image count.

3. **Contract title display** ✅ RESOLVED (2026-05-16)
   - Contracts were displaying raw award IDs (`W50S8U24FA042`) instead of meaningful titles.
   - Fixed: `cleanTitle()` rewritten to extract first sentence from descriptions with smart title case.
   - Upsert path expanded to sync all fields on existing records, not just value.
   - QA verified: 0 raw IDs, 0 ALL-CAPS, correct sort/structure across 210 contracts.
   - Deployed via Vercel auto-deploy from commit `28571ed`.

### Medium Priority

- Configure `ADMIN_EMAIL` if contact form email notifications matter.
- Review Vercel deployment health after each data/script change.

### Future Enhancements

- Admin dashboard improvements
- Analytics and metrics
- Email alerts for breaking C-UAS news
- Better article relationship/recommendation features
- More robust image hosting strategy for manufacturer/DoD assets that block hotlinking

---

## Roadmap

### Completed

- Production deployment to Vercel
- Supabase PostgreSQL database integration
- Prisma schema and data access
- RSS scraping pipeline
- AI article processing
- Newsletter signup with Resend
- Systems database and system detail pages
- Contracts tracker page
- USASpending.gov contract data pipeline
- Explainers library with 40 explainers
- FeaturedExplainers server component fix
- Seed file reconciliation for explainers
- Initial image sourcing and audit workflow

### In Progress

- System image accuracy and null-image cleanup
- Documentation hygiene and session tracker discipline
- Contract title verification

### Next Recommended Work

1. Confirm whether image work after the May 5 tracker update exists outside git/DB.
2. Review the remaining FAIL/UNCERTAIN image audit backlog.
3. Decide whether to re-run the full vision audit after the null-image sourcing pass.
4. Verify contract titles.

---

## Quick Commands

### Development

```bash
cd ~/projects/drone_wire/app
npm run dev
```

Dev server:

```text
http://localhost:3002
```

### Build and Test

```bash
npm run build
npm test
npm run lint
```

### Database Scripts

```bash
# Seed/update explainers
NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/seed-explainers.ts

# Seed/update systems
NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/seed-systems.ts

# Refresh contracts from USASpending.gov
NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/seed-contracts.ts

# Audit system images
NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/vision-audit-images.ts
```

### Manual Cron Routes

```bash
# News scrape
curl https://drone-wire.vercel.app/api/cron/scrape-news \
  -H "Authorization: Bearer $CRON_SECRET"

# AI processing
curl https://drone-wire.vercel.app/api/cron/process-ai \
  -H "Authorization: Bearer $CRON_SECRET"

# Contract scrape
curl https://drone-wire.vercel.app/api/cron/scrape-contracts \
  -H "Authorization: Bearer $CRON_SECRET"
```

### Deployment

```bash
git push origin main
```

---

## Monitoring

### Vercel

- Logs: https://vercel.com/jeremy-delvauxs-projects/drone-wire/logs
- Deployments: https://vercel.com/jeremy-delvauxs-projects/drone-wire/deployments
- Analytics: https://vercel.com/jeremy-delvauxs-projects/drone-wire/analytics

### Supabase

- Project: https://supabase.com/dashboard/project/qbeioesktbpvdlgzrgsm
- Use Table Editor, SQL Editor, and logs for database checks.

---

## Contact & Support

- Repository: https://github.com/jdelvo06-debug/drone_wire
- Documentation: `README.md`, `PROJECT_REFERENCE.md`, and `/docs`
- Session tracker: `../NEXTSESSION.md`
