# DroneWire — Counter-UAS Hub

DroneWire is a Counter-Unmanned Aircraft Systems (C-UAS) intelligence hub built for tracking drone defense systems, defense contracts, explainers, and current news.

**Live site:** https://drone-wire.vercel.app
**Repository:** https://github.com/jdelvo06-debug/drone_wire
**Local app path:** `~/projects/drone_wire/app/`

---

## Current Status

Last verified: **2026-05-07** against the live Supabase database.

- **Systems:** 115 total
- **Systems with images:** 103/115
- **Systems missing images:** 12
- **Contracts:** 208 real award records
- **Total contract value:** about $2.34B
- **Explainers:** 40
- **Articles:** 2,924

Current operational gap: **12 system records still need verified product/system images.** The remaining list is tracked in `../NEXTSESSION.md`.

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
- Current database contains 208 real contract awards totaling about $2.34B
- Weekly refresh is handled outside Vercel's free cron limit via Hermes scheduled job

### Explainers Library

- 40 structured C-UAS explainers
- Fields include what it is, how it works, key features, advantages, disadvantages, real-world use, and related systems
- Featured explainers are rendered from the database using an async server component

### Articles and Intelligence Feed

- RSS ingestion from defense, drone, technology, and government sources
- AI enrichment for summaries, key points, why-it-matters sections, tags, and confidence scoring
- RSS output at `/feed.xml`

### Newsletter and Contact

- Newsletter signup with Resend integration
- Contact form saves submissions to the database
- Contact notifications still require `ADMIN_EMAIL` to be configured in production if email alerts are desired

---

## Tech Stack

- **Framework:** Next.js 14.2.28, App Router
- **Language:** TypeScript
- **Database:** Supabase PostgreSQL
- **ORM:** Prisma 6.7.0
- **Styling:** Tailwind CSS, shadcn/ui-style components, Radix UI
- **Email:** Resend
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
npm run lint           # Next lint
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
RESEND_API_KEY
ADMIN_EMAIL
```

Notes:

- Supabase uses the transaction pooler URL for Vercel compatibility.
- On the Mac Mini, local DB/script runs may need `NODE_TLS_REJECT_UNAUTHORIZED=0` because of the Zscaler TLS proxy.
- Vercel free tier only supports two cron jobs. DroneWire currently uses those for news scraping and AI processing.

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

When writing DB update scripts, prefer standalone TypeScript files under `scripts/` and run them with `npx tsx`. Avoid stuffing multi-line database updates into shell one-liners.

---

## Deployment

Production deploys from `main` to Vercel.

```bash
git push origin main
```

Build command:

```bash
prisma generate && next build
```

Production URL:

```text
https://drone-wire.vercel.app
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

1. Resolve the 12 remaining null system images.
2. Review the 49 UNCERTAIN and 13 FAIL results from the last vision audit.
3. Confirm whether contract titles still need cleanup in the UI/database.
4. Keep documentation updated after each major data or deployment change.
