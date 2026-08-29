# DroneWire Project Status

> **Active direction:** DroneWire remains on the free plan. Preview is being made no-write against shared Production state. Newsletter delivery and unattended full-backlog AI processing are deferred; see `docs/free-plan-transition.md`.

**Last Updated:** 2026-08-22
**Status:** Production; remediation implemented locally and not deployed
**Live Site:** https://dronewire.org

---

## Current State

Read-only audit snapshot from 2026-08-22:

| Area | Current State |
|---|---:|
| Articles | 4,840 |
| Published articles | 3,663 |
| Pending AI | 1,175 |
| Failed articles | 2 |
| Systems | 111 |
| Explainers | 40 |
| Contracts | 228 |
| RSS feeds | 13 |
| Embeddings | Not re-counted in this audit |

---

## Working Features

| Feature | Status | Notes |
|---|---|---|
| Home Page | Working | Hero, featured articles, latest intel, newsletter CTA |
| Articles List | Working | RSS-backed intelligence feed with pagination/filtering |
| Article Detail | Working | AI summaries, key points, tags, why-it-matters content |
| Systems Database | Working | 111 C-UAS systems; image coverage was not re-audited in this reconciliation |
| System Detail | Working | Specs, combat record, related systems, manufacturer/country/status |
| Explainers Library | Working | 40 structured explainers in DB and seed file |
| Explainer Detail | Working | Rich explainer content with structured fields |
| Featured Explainers | Working | Async server component queries DB directly |
| Contracts Page | Working | 228 contract records |
| About Page | Working | Project information |
| Dark/Light Mode | Working | Theme toggle in header |
| Mobile Responsive | Local fix pending deployment | Contract table containment repaired at audited viewports |
| Newsletter Signup | Deferred | Public signup and delivery are not part of the active free-plan rollout; preserve existing data until separately dispositioned |
| Contact Form | Local fix pending deployment | Bounded input, persistent throttling, BotID, and awaited notification behavior |
| Cloudflare Email Routing | Working | Public MX is live; only `info@dronewire.org` and `tips@dronewire.org` are intentional aliases; catch-all is disabled |
| AI Health Endpoint | Degraded at audit time | Primary unavailable; fallback available |

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
| Platform | Vercel |
| Build Command | `prisma generate && next build` |
| Production Domain | https://dronewire.org |
| Public AI Health | Degraded at 2026-08-22 audit; refresh before operational decisions |

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
| ADMIN_SECRET | Configured in production |
| OLLAMA_MODEL / OLLAMA_FALLBACK_MODEL | Configured in production; source defaults are `deepseek-v4-flash` / `glm-5.2` |
| GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN | Configured in production for Gmail API delivery |
| SITE_URL | `https://dronewire.org` |
| RATE_LIMIT_SECRET | Required before remediation deployment; status unverified |
| UNSUBSCRIBE_SECRET | Required before remediation deployment; status unverified |
| FROM_EMAIL | Active source configuration; Gmail authorization must be verified |
| ADMIN_EMAIL | Documented application setting; production presence is not asserted here |

### Email and Domain

| Capability | Current State |
|---|---|
| Website domain | `https://dronewire.org`, matching production `SITE_URL` |
| Inbound aliases | Only `info@dronewire.org` and `tips@dronewire.org` |
| Catch-all | Disabled |
| Outbound app email | Gmail API via OAuth credentials |
| Sender identity | Controlled by `FROM_EMAIL`; authorization and delivery remain unverified |

---

## Active Issues / Follow-Ups

### High Priority

1. **Remediation release gates**
   - Follow `docs/remediation-runbook.md`.
   - Migration, Vercel secrets/BotID, production data repair, email tests, and deployment need separate approval.

2. **Taxonomy and AI backlog**
   - 1,175 articles were `pending_ai`; malformed pipe-delimited category values exist in published data.
   - Run the read-only category audit, export a rollback checkpoint, approve mappings, then repair/process bounded batches.

3. **System image quality backlog**
   - Current DB count: 111 systems.
   - Image coverage was not re-audited in this reconciliation.
   - Run a fresh audit before treating prior FAIL/UNCERTAIN results as current.

4. **Image audit backlog**
   - Historical audits found generic, uncertain, failed, or inaccessible images.
   - Those results predate the current 111-system count and require refresh before use.

5. **Contract title display** ✅ RESOLVED (2026-05-16)
   - Contracts were displaying raw award IDs (`W50S8U24FA042`) instead of meaningful titles.
   - Fixed: `cleanTitle()` rewritten to extract first sentence from descriptions with smart title case.
   - Upsert path expanded to sync all fields on existing records, not just value.
   - QA verified: 0 raw IDs, 0 ALL-CAPS, correct sort/structure across 210 contracts.
   - Deployed via Vercel auto-deploy from commit `28571ed`.

### Medium Priority

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
- Newsletter signup with Gmail API email delivery
- Systems database and system detail pages
- Contracts tracker page
- USASpending.gov contract data pipeline
- Explainers library with 40 explainers
- FeaturedExplainers server component fix
- Seed file reconciliation for explainers
- Initial image sourcing and audit workflow

### In Progress

- System image accuracy review
- Documentation hygiene and session tracker discipline

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
curl https://dronewire.org/api/cron/scrape-news \
  -H "Authorization: Bearer $CRON_SECRET"

# AI processing
curl https://dronewire.org/api/cron/process-ai \
  -H "Authorization: Bearer $CRON_SECRET"

# Contract scrape
curl https://dronewire.org/api/cron/scrape-contracts \
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
