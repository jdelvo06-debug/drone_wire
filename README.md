# DroneWire — Counter-UAS Hub

DroneWire is a Counter-Unmanned Aircraft Systems (C-UAS) intelligence hub built for tracking drone defense systems, defense contracts, explainers, and current news.

**Live site:** https://dronewire.org
**Repository:** https://github.com/jdelvo06-debug/drone_wire
**Local app path:** `~/projects/drone_wire/app/`

---

## Current Status

Audit snapshot from 2026-08-22 (production data was not modified):

- **Articles:** 4,840 total / 3,663 published / 1,175 pending AI / 2 failed
- **Systems:** 111
- **Contracts:** 228
- **Explainers:** 40
- **RSS feeds:** 13
- **Embeddings:** not re-counted in the full audit
- **AI health:** degraded at audit time: primary unavailable, fallback available

Image coverage was not re-audited during this reconciliation; historical image-audit notes are not current database-count evidence.

---

## Core Features

### Systems Database

- C-UAS systems across sensors, effectors, command-and-control, and integrated systems
- System detail pages with manufacturer, country, status, specs, combat record, and related systems
- Search and filters by category, status, country, and manufacturer
- Image audit workflow for validating that images actually match the system

### Contracts Tracker

- Real DoD award data populated from USASpending.gov
- Contract list with sorting, filters, stats cards, and expandable details
- Current database contains 228 contract records

### Explainers Library

- 40 structured C-UAS explainers
- Fields include what it is, how it works, key features, advantages, disadvantages, real-world use, and related systems
- Featured explainers are rendered from the database using an async server component

### Articles and Intelligence Feed

- RSS ingestion from defense, drone, technology, and government sources
- AI enrichment for summaries, key points, why-it-matters sections, tags, and confidence scoring
- RSS output at `/feed.xml`

### Newsletter and Contact

- Newsletter signup with Gmail API welcome emails when OAuth credentials are configured
- Contact form saves submissions to the database
- Contact notifications use `ADMIN_EMAIL`; outbound identity uses `FROM_EMAIL`
- Subscriber-specific signed unsubscribe links immediately suppress future sends
- Public Cloudflare Email Routing MX is live; the only intentional inbound aliases are `info@dronewire.org` and `tips@dronewire.org`, with catch-all disabled
- Outbound site email uses Gmail API OAuth credentials

---

## Tech Stack

- **Framework:** Next.js 15.5.23, App Router
- **Language:** TypeScript
- **Database:** Supabase PostgreSQL
- **ORM:** Prisma 6.7.0
- **Styling:** Tailwind CSS, shadcn/ui-style components, Radix UI
- **Email:** Gmail API for outbound site email; Cloudflare Email Routing for inbound domain aliases
- **Deployment:** Vercel
- **Testing:** Jest

---

## Local Development

```bash
cd ~/projects/drone_wire/app
npm install
npm run dev
```

The dev server runs on:

```text
http://localhost:3002
```

Useful commands:

```bash
npm run build          # Prisma generate + Next build
npm test               # Jest test suite
npm run lint           # ESLint
npm run health:local   # Local health check
npm run health         # Production health check
```

---

## Environment Variables

Local secrets live in `.env.local` and are not committed.

Common variables:

```text
DATABASE_URL
OPENAI_API_KEY
CRON_SECRET
ADMIN_SECRET
RATE_LIMIT_SECRET
UNSUBSCRIBE_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
ADMIN_EMAIL
FROM_EMAIL
OLLAMA_API_KEY
OLLAMA_MODEL
OLLAMA_FALLBACK_MODEL
SITE_URL
```

Notes:

- Supabase uses the transaction pooler URL for Vercel compatibility.
- AI processing defaults to `OLLAMA_MODEL=deepseek-v4-flash` with `OLLAMA_FALLBACK_MODEL=glm-5.2`; production can override both.
- `SITE_URL` is `https://dronewire.org` in production and drives canonical metadata and email links.
- `.env.example` contains placeholders only. Do not copy secrets into it.
- `FROM_EMAIL` must exactly match an identity authorized by the configured Gmail account.
- On the Mac Mini, local DB/script runs may need `NODE_TLS_REJECT_UNAUTHORIZED=0` because of the Zscaler TLS proxy.

---

## Data and Maintenance Scripts

Key scripts live in `scripts/`.

- `seed-systems.ts` — seed/update C-UAS systems
- `seed-contracts.ts` — replace contract data using USASpending.gov results
- `seed-explainers.ts` — seed/update explainers
- `seed-procurement-data.ts` — seed procurement/intel fields
- `vision-audit-images.ts` — audit all system images with vision checks
- `fix-images-curated.ts` — batch-update system image URLs
- `push-one.ts` — utility for single-system image pushes
- `cleanup.ts` — cleanup script used during system list reduction
- `audit-article-categories.ts` — read-only report of category values and malformed rows
- `benchmark-vector-query.ts` — read-only `EXPLAIN ANALYZE` for a selected related-article vector query

When writing DB update scripts, prefer standalone TypeScript files under `scripts/` and run them with `npx tsx`. Avoid stuffing multi-line database updates into shell one-liners.

---

## Deployment

Production is hosted on Vercel. Deployment actions are intentionally outside this local reconciliation.

Build command:

```bash
prisma generate && next build
```

Production URL:

```text
https://dronewire.org
```

---

## Documentation Map

- `README.md` — project overview and local setup
- `PROJECT_REFERENCE.md` — operator reference, paths, scripts, current state
- `docs/project-status.md` — current project status and roadmap
- `docs/changelog.md` — release/change history
- `docs/architecture.md` — architecture and data flow
- `../NEXTSESSION.md` — durable working tracker for the next DroneWire session

---

## Current Next Work

1. Follow `docs/remediation-runbook.md`; migration, production data, email, cloud settings, and deployment remain approval-gated.
2. Run a fresh vision audit before treating historical image-quality results as current.
3. Re-run production health checks after domain or data-pipeline changes.
