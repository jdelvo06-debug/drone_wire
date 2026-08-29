# DroneWire Remediation Release Runbook

**Prepared:** 2026-08-23
**State:** Historical release reference; active product direction is `docs/free-plan-transition.md`

> The current plan is to remain on the free tier, make Preview no-write against the shared Production database, and defer newsletter delivery. Use this runbook only for technical release gates that still apply to a specific approved change; do not treat its newsletter launch sequence as required work.

This runbook separates repository changes from production operations. Do not apply the migration, configure secrets, send email, repair content, drain the AI backlog, or deploy without a separate approval for that action.

## Required release order

1. Create independent 32-byte-or-longer `RATE_LIMIT_SECRET` and `UNSUBSCRIBE_SECRET` values. Set them in every Vercel environment with `vercel env`; do not reuse `ADMIN_SECRET` in production.
2. Confirm the Gmail account authorizes the exact `FROM_EMAIL` identity and that `ADMIN_EMAIL` is a neutral monitored mailbox.
3. Review and back up the production database, then apply `prisma/migrations/20260822190000_add_request_rate_limits/migration.sql` through the approved migration workflow.
4. Dry-run `prisma/migrations/20260823143000_add_full_remediation_foundation/migration.sql` against a restored backup. Review the companion `rollback.sql`, query plans, expected row counts, subscriber-preference conversion, and extension/index runtime before approving production application.
5. Enable and verify Vercel BotID for the protected routes. The server-side rate limiter fails closed if request verification or the persistence layer is unavailable.
6. Before Vercel preview work, obtain installation approval and upgrade the local CLI from 55.0.0 to 59.5.0 or newer. No CLI upgrade was performed during local remediation.
7. Revalidate the production dependency audit before preview. Next 15.5.23's nested PostCSS dependency is overridden to audited PostCSS 8.5.26; `npm audit --omit=dev` is clean. Keep that override explicit and retest it on every Next or PostCSS update; do not use `npm audit fix --force`. Vercel's official deployment documentation directs projects to install and deploy BotID, but the installed 1.5.11 artifact still does not declare a package license or include a license file, so do not infer broader redistribution rights from package metadata.
8. After the schema migration, run `npm run backfill:search` without `--apply` and reconcile the per-entity counts and projection SHA-256. An approved production projection requires `--mode=projection --apply --production-approved`, every `--expected-<entity>` count, `--expected-total`, the exact `--expected-sha256`, and `--export=/absolute/out-of-repository/search-projection.json`. It checkpoints the existing projection with owner-only permissions, atomically upserts deterministic rows with null embeddings, makes no provider call, and preserves stale rows. Disposable applies require `--disposable-approved`, a loopback URL, and the connected database comment `dronewire-disposable-restore-only`. Production stale deletion is prohibited. Embedding generation remains a separate future implementation and approval.
9. Run `npm run correct:known-catalog` without `--apply`. Review its exact before/after decisions, evidence classes, unresolved items, and packet SHA-256. An approved application must include `--apply`, an outside-repository approval artifact signed by Jeremy for every exact field/image decision, an outside-repository pre-change/rollback export, and an outside-repository apply report. The command refuses the current database unless the provenance/media schema exists, refuses baseline drift, refuses existing artifacts, limits writes to the sealed packet, verifies untouched fields in the transaction, and re-reads every changed record after commit.
10. Run `npm run remediate:articles` without `--apply`; review normalization, relevance, and event-cluster counts. The approved apply path requires the same out-of-repository export pattern.
11. Deploy to a preview first. Run lint, type-check, Jest, build, API quota/concurrency tests, and browser smoke at 320, 390, 768, 1024, and 1440 px.
12. Configure `DIGEST_TEST_RECIPIENT` only after email-test approval. Each weekly issue is atomically moved through `preview` → `testing` → `approved` only after the synthetic delivery succeeds; real recipients are then claimed in batches of 25.
    Each delivery uses a deterministic RFC Message-ID. A stale claim is reconciled against Gmail's sent mailbox before retry; an unavailable reconciliation is retried in bounded attempts and then held as `manual_review` rather than blindly resent. Consent is rechecked at claim time and immediately before each send.
13. Roll out production with an observed rollback point. Verify 429 responses include `Retry-After`, raw IP addresses are not stored, and normal contact/newsletter/search/view behavior still works.

## Production-data gates

- Run `npm run audit:categories` as a read-only report.
- Export the affected article identifiers and current category values before any repair.
- Review the normalization and relevance report editorially. Unrecognized values become `general` with an unverified classification label rather than being silently guessed.
- Process `pending_ai` only in bounded, resumable batches after provider cost and failure metrics are visible.
- Keep batches at or below 50 articles and digest deliveries at or below 25 recipients. Reconcile quarantine/failure codes and unique delivery rows after each batch.
- Run `npm run audit:media`; review broken MIME/status results, duplicate URLs, variant identity, license, and attribution before approving any controlled copy.
- Confirm malformed category count reaches zero and spot-check filters, badges, related content, and subscriber preferences.

## Scheduled-job ownership and freshness

| Job | Current scheduler | Expected freshness | Operational owner |
|---|---|---:|---|
| News scrape | Vercel cron, daily 06:00 UTC | Last success under 26 hours | Unassigned; assign before release |
| AI processing | Vercel cron, daily 08:00 UTC | Last success under 26 hours; backlog age tracked | Unassigned; assign before release |
| Search embedding generation | Not scheduled; separate future operation | No production expectation until separately implemented and approved | Unassigned; assign before release |
| Contract scrape | External/Hermes or manual route | Weekly | Unverified; confirm before release |
| Article alerts | Scheduler not present in `vercel.json` | Defined by editorial SLA | Unverified; confirm before release |
| Weekly digest preview/send | Hermes, proposed Monday 08:00 America/New_York plus follow-up retry | One issue per Eastern week | Not scheduled; separate Hermes approval required |
| Media integrity audit | Hermes, proposed monthly authenticated run | Monthly | Not scheduled; separate Hermes approval required |

Vercel log-based alerts should cover cron 5xx responses, feed degradation, AI-provider failures, Gmail delivery failures, and rising `pending_ai` age. Cloud alert creation is not part of this local change.

## Rollback

- Roll application code back to the prior verified deployment if request protection, subscription, or rendering regresses.
- Keep the rate-limit table during application rollback; it contains HMAC-derived keys, not raw IP addresses, and is safe to remove later through an approved migration.
- Unsubscribe status changes are authoritative consent events and must never be rolled back.
- Article normalization and backlog processing require their own export/checkpoint and rollback procedure.
- Do not roll back subscriber consent data. The foundation rollback removes preference columns and is suitable only before live preference changes or digest delivery; after that point, use a forward corrective migration.

## Still requires read-only verification

Deployment SHA/settings/logs, Cloudflare DNS/firewall/mail authentication, Supabase RLS/backups/query plans, Gmail delivery/bounces, provider quotas, scheduler history, Core Web Vitals, and complete accessibility certification remain outside current access.
