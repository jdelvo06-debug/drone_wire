# Changelog

All notable changes to DroneWire are documented in this file.

---

## [Unreleased]

### Local Domain, Mail, and Operations Reconciliation

This work remains local and uncommitted; it has not been pushed or deployed.

**Changes:**
- Kept `https://dronewire.org` as the canonical URL through `SITE_URL`, app metadata, RSS output, email links, and health tooling.
- Preserved `ADMIN_SECRET` bearer hardening for the two admin maintenance routes without changing cron routes.
- Limited public email links and RSS metadata to the reachable `info@dronewire.org` and `tips@dronewire.org` aliases.
- Documented that public Cloudflare Email Routing MX is live, only the `info@` and `tips@` aliases are intentional, and catch-all is disabled.
- Documented outbound Gmail API delivery: the sender is hard-coded in `lib/services/email.ts`, while production `FROM_EMAIL` is legacy/unused.
- Added documented AI model defaults (`deepseek-v4-flash` primary, `glm-5.2` fallback) and production override variables.
- Extended the public-only health script to require HTTP 200 plus `status: "healthy"` from `/api/health/ai`; removed unauthenticated cron-route probes so the script invokes no authenticated or mutating endpoints.
- Replaced the obsolete `next lint` command with direct ESLint and removed unused Resend/React Email dependencies.
- Retained UI copy/entity escaping cleanup and the canonical Bal Chatri URL update without running any database-writing script.

**Current ground truth:**
- Database: 4,669 articles / 3,296 published / 111 systems / 40 explainers / 228 contracts / 13 RSS feeds / 2,430 embeddings.
- Production `GET https://dronewire.org/api/health/ai`: HTTP 200 with healthy status.
- Production Vercel configuration includes `ADMIN_SECRET`, `OLLAMA_MODEL`, `OLLAMA_FALLBACK_MODEL`, `SITE_URL`, Gmail OAuth variables, and legacy/unused `FROM_EMAIL`.

## [1.7.2] - 2026-05-16

### Contract Title Fix — Human-Readable Display

All 210 contracts were displaying raw award IDs (`W50S8U24FA042`) instead of meaningful titles. The `cleanTitle()` function in the USASpending scraper was a straight passthrough of the award ID field.

**Changes:**
- Rewrote `cleanTitle()` to extract the first sentence from the `Description` field, apply smart title case (preserves acronyms like UAS/CRG, lowercases small words mid-title), and cap at 80 chars with ellipsis truncation.
- Expanded the upsert path to sync all fields (`title`, `company`, `agency`, `office`, `category`, `status`) on existing records — previously only updated `value` and `description`.
- Seed script refreshed all 210 existing contracts with regenerated titles.
- Deployed via Vercel auto-deploy from push to main (commit `28571ed`).
- QA verified: 0 raw contract numbers, 0 ALL-CAPS titles, correct sort order, $253M top contract renders readable title.
- Updated NEXTSESSION.md, docs/changelog.md, docs/project-status.md, PROJECT_REFERENCE.md.

## [1.7.1] - 2026-05-10

### Explainer Image Stability — DVIDS Eradication

After the May 9 DVIDS CDN migration (`d1ldvf68ux039x` → `d2cto119c3bgok`) killed 22 explainer images, a mechanical URL swap restored 200 OK on all — but a follow-up vision audit revealed 7 images were completely wrong content and 2 were too generic. All 9 replaced, plus the remaining 13 DVIDS-linked explainers also moved to Commons. The explainer library is now 100% Wikimedia Commons-sourced and immune to DVIDS CDN migrations.

**Changes:**
- Ran full vision audit on all 24 DVIDS-linked explainer images.
- Replaced 7 content mismatches (e.g., Arab SF for loitering munitions, Cobra helicopters for urban C-UAS, train hauling tanks for C2 platforms).
- Replaced 2 marginal fits (sailor with binoculars for naval C-UAS, generic soldier for allied interoperability).
- Remaining 15 DVIDS-linked explainers were also migrated to Commons in the batch.
- Result: 40/40 explainer images are now Commons-stable — zero DVIDS links remain.
- Triggered Vercel production redeploy; live at drone-wire.vercel.app.
- Updated PROJECT_REFERENCE.md, docs/project-status.md, and docs/changelog.md.
- Updated NEXTSESSION.md with full DVIDS Content Verification Pass section.

## [1.7.0] - 2026-05-07

### Project State Refresh

Documentation and project state were reconciled against the live Supabase database and recent git/session history.

**Current verified counts:**
- Systems: 115 total
- Systems with images: 115/115
- Systems missing images: 0
- Contracts: 208 real awards
- Contract value: about $2.34B
- Explainers: 40
- Articles: 2,924

### Systems Database and Image Work

Major C-UAS system database expansion and image remediation work occurred after the January 1.6.0 release.

**Changes:**
- Expanded the systems database from 72 to 115 records after removing 14 obscure or unsourceable systems from the broader working set.
- Reached temporary 100% image coverage during the May 3 image sprint.
- Ran vision-based image audits to identify incorrect, generic, uncertain, and unreachable imagery.
- Re-hosted blocked/vision-inaccessible images where needed, including RTX/Raytheon CDN images via postimages.org.
- Added local/public handling for the Bal Chatri image, then later set Bal Chatri back to null after the AI-generated image was flagged as unsuitable.
- Ran `scripts/fix-images-curated.ts` against 28 hand-curated image fixes.
- Result of the curated fix batch: 15 successful updates, 13 systems set to null because DVIDS CloudFront thumbnail URLs returned 404.
- Bayraktar TB2 was fixed with a Wikipedia Commons runway image and verified as reachable.

**May 7 image resourcing pass:**
- Restored 115/115 system image URL coverage.
- Added verified/reachable sources for LPWS, Leonidas, Iron Drone, Roadrunner, IFPC Increment 2, CORVUS-RAVEN, Falcon Shield, ALPS, TOC-L, IFPC-HPM, ODIN, and Bal Chatri.
- Added a stable local JPG asset for Bal Chatri converted from a real Defense One field photo source.

**Known image sourcing constraints:**
- DVIDS CloudFront thumbnails are unreliable and can 404 later.
- BAE Systems pages are blocked by Imperva/hCaptcha.
- Anduril product imagery often uses canvas/video rendering that is difficult to scrape directly.
- Some manufacturer assets block hotlinking or vision inspection and may require download/re-host.

### Contracts Data Pipeline

**Changed:**
- Replaced ghost/demo contract records with real USASpending.gov award data.
- Added `lib/services/usaspending-scraper.ts` for C-UAS keyword searches across 2022–2026.
- Populated 208 real awards totaling about $2.34B.
- Updated `app/api/cron/scrape-contracts/route.ts` to use the USASpending scraper instead of the deprecated SAM.gov scraper.
- Scheduled weekly contract refresh outside Vercel's two-cron limit using Hermes cron job `e2e48f408dee`, Mondays at 9 AM EST.

**Known follow-up:**
- Verify whether the contracts page still displays `contractNumber` where meaningful titles should be shown.

### Explainers Library

**Changed:**
- Reconciled `scripts/seed-explainers.ts` with the database.
- Exported and added 7 database-only orphan explainers back into the seed file.
- Current state: 40 explainers in the database and 40 in the seed file.
- Converted FeaturedExplainers to an async server component that queries the database directly.
- Removed the dead `ExplainersGrid` component.

### Deployment and Git

**Recent commits:**
- `b676cc9` — reconcile seed file with DB; export 7 orphan explainers; include prior batch scripts
- `674b755` — swap cron route from deprecated SAM.gov scraper to USASpending scraper
- `e364c88` — convert FeaturedExplainers to async server component; remove dead ExplainersGrid
- `861d11c` — add PROJECT_REFERENCE.md with full project map
- `3aeae46` — add USASpending.gov contract scraper, Bal Chatri image, 100% system coverage checkpoint

---

## [1.6.0] - 2026-01-24

### Contracts Page Improvements

Major UI refresh for the contracts tracker with real data integration and improved visual hierarchy.

**Stats Cards (Real Data):**
- Total Contract Value - fetched from API aggregates
- Total Contracts - from pagination total count
- Average Value - calculated from all contracts
- Largest Contract - maximum contract value
- Added loading spinners while data fetches
- Shows "TBD" for contracts with $0 value

**Table Visual Hierarchy:**
- Simplified to 6 columns (merged Agency into Contractor cell)
- Alternating row backgrounds for easier scanning
- Relative time display under dates ("3 days ago", "2 weeks ago")
- Larger, bolder value display
- Status badges with colored indicator dots (emerald/blue/red)
- Category badges with subtle colored backgrounds and borders

**Enhanced Expanded Details:**
- Two-column grid layout (description + quick info sidebar)
- Icons for each info item (Calendar, Clock, DollarSign, MapPin)
- Clean "View on SAM.gov" external link
- Better spacing and visual separation

**API Enhancements:**
- Added `byAgency` aggregation (top 10 agencies by contract value)
- Added `byMonth` aggregation (monthly contract values, last 12 months)
- Supports future chart/dashboard features

**Files Modified:**
- `app/api/contracts/route.ts` - Added aggregation queries
- `components/contracts/contracts-header.tsx` - Real data fetching, loading states
- `components/contracts/contracts-table.tsx` - Complete visual refresh

---

## [1.5.0] - 2026-01-16

### C-UAS Systems Database Expansion

Major expansion of the Systems database from 13 to 72 systems with comprehensive imagery.

**Systems Added (59 new):**
- **US Systems:** M-SHORAD, DE M-SHORAD, AN/TPS-80 G/ATOR, VAMPIRE, APKWS II, NINJA, Dronebuster, DRAKE, LPWS, IFPC-HPM, IFPC Increment 2, MRIC, SkyHunter, DroneHunter F700, Phaser, ODIN, Stinger FIM-92, XM914 Chain Gun, Modi, ALPS, MEDUSA C2, ADSI, AiON, Lattice, DedroneTracker, Reactor, TOC-L, Maven Smart System, Leonidas, Roadrunner, Pulsar, HELWS, CORIAN, CORVUS-RAVEN, WESCAM MX-15D, Bal Chatri, NightFighter S
- **Australian Systems:** DroneSentry-C2, DroneGun Tactical, DroneSentry-X, DroneOptID
- **Israeli Systems:** Iron Beam, SmartShooter, Iron Drone, EnforceAir
- **European Systems:** PARADE (France), MANTIS (Germany), Falcon Shield (Italy), JEY-CUAS (EU), BOREADES (France), AirGuard (Germany), ThunderShield (France), Giraffe 1X (Sweden)
- **Other:** Crow/ORCUS (UK/Spain), AS3 Surveyor (Poland), Sting (Ukraine)

**Image Infrastructure:**
- All 72 systems had working images from DVIDS CloudFront CDN at the time of release.
- Replaced blocked manufacturer URLs (Rafael, Lockheed Martin, Northrop Grumman, RTX, etc.) with DVIDS public domain images.
- Standardized DVIDS thumbnail URL pattern: `https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/YYMM/IMAGE_ID/1000w_q95.jpg`
- Updated seed scripts to use upsert for reliable updates.

**Explainer Image Fixes:**
- Fixed 3 broken explainer images (C-UAS Kill Chain, LAWS, THAAD).
- Updated `seed-explainers.ts` to use upsert instead of skip-if-exists.

**Files Modified:**
- `scripts/seed-systems.ts`
- `scripts/seed-explainers.ts`
- `app/api/admin/seed-explainers/route.ts`

---

## [1.4.0] - 2026-01-15

### Systems Database (New Feature)

Added new "Systems" tab showcasing Counter-UAS systems including C2 systems, sensors, effectors, and integrated solutions.

**Database:**
- Added `System` model with comprehensive fields (category, manufacturer, country, specifications, combat record, etc.).
- Added `SystemTag` join table for many-to-many tag relationships.
- Categories: c2, sensor, effector, integrated.
- Status types: operational, contracted, development, prototype.

**API:**
- `GET /api/systems` - paginated list with category, status, country, manufacturer, and search filters.
- `POST /api/systems` - increment view count.

**Pages:**
- `/systems` - listing page with featured section, category/status filters, search.
- `/systems/[slug]` - detail page with specifications sidebar, combat record, related systems.

**Navigation:**
- Added "Systems" tab to main navigation.

---

## [1.3.0] - 2026-01-12

### UI/UX Polish

- Created `/api/stats` endpoint for real-time database counts.
- Stats section now fetches live data.
- Removed hardcoded inflated numbers.
- Fixed category badges displaying pipe-separated values.
- Added proper text truncation to article excerpts.
- Fixed explainer titles being cut off in sidebar.
- Created `/api/admin/seed-explainers` endpoint with 24 comprehensive explainers.
- Seeded 17 new counter-UAS explainers to production.

---

## [1.2.0] - 2026-01-12

### Email Integration

- Integrated Resend for transactional emails.
- Newsletter welcome emails now working.
- RSS feed available at `/feed.xml`.
- Contact form saves to database; email notifications require `ADMIN_EMAIL`.

---

## [1.1.0] - 2026-01-12

### Core UX Enhancements

- Header search now functional with results dropdown.
- Related articles section using embedding-based similarity.
- Dynamic related explainers based on article category.
- Trending topics show real tag counts from database.
- Enhanced article image extraction from RSS and content.

---

## [1.0.0] - 2026-01-11

### Initial Production Release

First production deployment of DroneWire to Vercel.

**Live Site:** https://drone-wire.vercel.app

**Features:**
- Articles section with AI-curated news articles, summaries, key points, and auto-tagging
- Explainers library
- Contracts page
- Home page with featured articles, latest intel, and newsletter signup
- About page
- Admin dashboard

**Technical Stack:**
- Next.js 14
- TypeScript
- Prisma ORM with Supabase PostgreSQL
- Tailwind CSS
- shadcn/ui-style components

---

## Deployment History

### 2026-01-11 - Production Fix: Database Connection

**Problem:** Vercel deployment returned 500 errors on database pages.

**Root Cause:** Supabase direct connection on port 5432 requires IPv6; Vercel uses IPv4.

**Solution:** Switched to Supabase transaction pooler on port 6543 with `pgbouncer=true`.

### 2026-01-11 - Production Fix: Cron Job Limit

**Problem:** Vercel deployment failed because Hobby tier allows only two cron jobs.

**Solution:** Kept news scraping and AI processing in Vercel cron. Contract refresh is handled externally/manual.

### 2026-01-11 - Production Fix: Module Resolution Error

**Problem:** Build failed with `Cannot find module 'next/dist/compiled/next-server/server.runtime.prod.js'`.

**Solution:** Removed incorrect `experimental.outputFileTracingRoot` configuration.

### 2026-01-11 - Production Fix: Node.js Version

**Problem:** Build inconsistencies with unsupported Node versions.

**Solution:** Pinned project to Node 20 via `.nvmrc`, `package.json`, and Vercel configuration.

### 2026-01-11 - Production Fix: Prisma Generation

**Problem:** Prisma client was not generated during Vercel builds.

**Solution:** Added `prisma generate` to the build command.

### 2026-01-11 - Production Fix: Static Generation Errors

**Problem:** Build failed when Prisma ran during static page generation.

**Solution:** Marked database-backed pages as dynamic where required.

---

## Pending Work

- Re-run/refresh the image vision audit if updated PASS/FAIL/UNCERTAIN counts are needed.
- Review 49 UNCERTAIN and 13 FAIL vision audit results if high-confidence imagery is required.
- Verify/fix contract title display if still showing contract numbers as titles.
- Configure `ADMIN_EMAIL` in Vercel if contact form email notifications are desired.
- Future: admin dashboard improvements, analytics, alerting, and deeper article relationship features.
