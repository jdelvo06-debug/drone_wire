# DroneWire Full Audit — Codex Plan Brief

You are auditing the DroneWire Counter-UAS intelligence hub in **read-only Plan mode**. Do not implement fixes yet.

## Repository and production

- Repo: `/Users/jeremydelvaux/projects/drone_wire/app`
- Continuity file: `/Users/jeremydelvaux/projects/drone_wire/NEXTSESSION.md`
- Live site: `https://dronewire.org`
- Stack to verify: Next.js, TypeScript, Prisma, Supabase/PostgreSQL, Tailwind, Jest, Vercel, Cloudflare, RSS/news ingestion, Gmail API email, external image sources.

## Safety boundaries

- Read and inspect only. Do not edit, format, delete, reset, stash, stage, commit, push, deploy, restart, migrate, seed, or mutate production/cloud data.
- Preserve all existing dirty work.
- Never print secrets or full environment-variable values.
- Database checks must be read-only.
- Do not send email or trigger external write operations.
- Mark anything inaccessible as **UNVERIFIED** rather than guessing.

## First steps

1. Read `AGENTS.md`, `README*`, project documentation, `NEXTSESSION.md`, `package.json`, lockfiles, configs, Prisma schema, and deployment files.
2. Check git status, branch, remotes, recent commits, and untracked/modified files.
3. Map the architecture, routes, data models, scripts, tests, deployment path, and external integrations before evaluating individual files.
4. Verify current production and database counts instead of trusting historical notes.

## Audit areas

Audit the entire project across these areas:

1. **Repository health:** documentation accuracy, stale files, TODOs, dependencies, Node/version drift, scripts, configs, CI, and deployment assumptions.
2. **Application correctness:** routes, server/client boundaries, API handlers, data loading, pagination, search, filtering, caching, errors, loading/empty states, 404/500 behavior, and broken links.
3. **Database/data integrity:** current counts, duplicates, orphans, nulls, malformed URLs, invalid relationships, indexes, constraints, and query efficiency.
4. **Articles:** duplicate or syndicated content, missing metadata/provenance, bad dates, broken sources, weak summaries, categorization, tags, rendering, SEO, and editorial usefulness.
5. **Systems catalog:** manufacturer/name consistency, capabilities, sources, relationships, duplicates, missing fields, image URLs, broken images, low-quality or mismatched images, and detail-page behavior. Review but do not run write-capable image scripts.
6. **Explainers:** structure, source quality, images, internal links, related content, completeness, formatting, mobile readability, SEO, and overlap.
7. **Contracts:** title quality, vendor/agency/value/date/status consistency, sources, duplicates, filters, responsive presentation, and relationships to systems/articles.
8. **Visual UX:** inspect real rendered pages at desktop, tablet, and mobile sizes. Check hierarchy, navigation, density, typography, contrast, cards, images, long content, overflow, touch targets, focus states, loading/error/empty states, and whether the product feels credible for a professional C-UAS audience.
9. **Accessibility:** semantic HTML, heading structure, labels, alt text, keyboard access, focus visibility, contrast, forms, modals, tables, screen-reader concerns, and reduced-motion behavior.
10. **SEO/discoverability:** metadata, canonical URLs, Open Graph, sitemap, robots, RSS, structured data, breadcrumbs, internal linking, pagination, indexability, redirects, and 404 behavior.
11. **Performance:** query cost, bundle size, image optimization, layout shift, caching/revalidation, repeated calls, article payloads, search performance, mobile performance, and serverless limits. Use Lighthouse or equivalent only if available; do not invent scores.
12. **Security/privacy:** admin auth, middleware coverage, bearer/cookie handling, token comparison, redirects, CSRF, XSS/Markdown rendering, URL validation, SSRF, rate limiting, contact handling, error leakage, public API exposure, Supabase/RLS assumptions, headers, dependencies, and logging. Static/read-only review only; do not attack production.
13. **Integrations/operations:** Supabase, PostgreSQL, Prisma, Vercel, Cloudflare DNS/email, RSS feeds, Gmail API, image hosts, analytics, search, cron, GitHub Actions, webhooks, AI/embedding/vector services, monitoring, and alerting. For each, document purpose, code/config location, failure behavior, retry/timeout handling, observability, active/stale/broken/unverified status, and recommended health checks.
14. **Local versus production parity:** compare routes, content, metadata, features, deployment commit/version, image behavior, APIs, environment assumptions, and caching where safely possible.
15. **Testing maturity:** inspect Jest/tests, type/lint/build gates, CI, missing API/data/browser/accessibility/visual/integration coverage, and flaky or misleading tests. Run safe checks only and record exact commands/results.

## Evidence standard

Every meaningful finding must include evidence: file and line/symbol, route, query/result, production URL, command output, or browser observation. Classify findings as:

- **Confirmed defect**
- **Plausible risk requiring more verification**
- **Stale documentation/configuration**
- **Recommendation**
- **Unverified due to access/tooling limits**

Do not recommend a rewrite simply because a newer framework exists. Prefer targeted, maintainable work that fits the current project.

## Required plan output

Return a concise but evidence-backed report with:

1. **Executive verdict:** current health, biggest risks, readiness, confidence level, and limitations.
2. **Verified inventory:** current counts for articles, systems, explainers, contracts, images, feeds, routes, tests, integrations, and deployment state, with verification method.
3. **Critical findings:** P0/P1 first, each with severity, evidence, impact, correction, verification, and estimated effort.
4. **Prioritized backlog:** P1 through P4, separating confirmed defects from recommendations.
5. **Audit matrix:** domain, status, evidence, key finding, next action, confidence.
6. **Phased roadmap:** immediate safety/data risks; correctness/reliability; content/data quality; visual/accessibility; performance/SEO; integrations/observability; optional modernization.
7. **Bounded implementation packets:** short name, goal, scope, likely files, acceptance criteria, non-goals, verification commands, and production/database risk.
8. **What is already good:** identify strengths worth preserving.
9. **Unverified items:** state exactly what access or tooling is needed.
10. **Recommendation:** identify the single best first remediation packet and why.

End by stating that the repository should remain read-only until Jeremy approves a specific remediation packet.
