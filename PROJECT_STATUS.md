# Project Status

## Overview
- **Project Name**: DroneWire
- **Status**: Active
- **Last Updated**: 2026-02-21
- **Port**: 3002
- **Deployment**: Vercel

## Description
An AI-curated intelligence hub for drone warfare, counter-UAS technology, defense contracts, and related policy.

## Current Focus
Exa AI search integration — expanding content discovery beyond RSS feeds.

## To-Do List
- [ ] **Process remaining ~74 pending AI articles** (run `process-ai` cron ~8 more times, 10 articles per batch)
- [ ] Add more C-UAS systems to database (currently 72+)
- [ ] Improve AI summaries quality
- [ ] Enhance defense contract tracking
- [ ] Set up dedicated ports per project to avoid conflicts

## Recommended Next Steps
1. **Finish processing Exa articles** — 81 new articles discovered, 10 processed so far, ~74 remaining with `status: 'pending_ai'`
2. Review Exa-sourced article quality and adjust semantic queries if needed
3. Monitor Exa costs (~$0.03/day, ~$0.90/month)
4. Add more countries' C-UAS systems to database
5. Add more educational explainer content

## Recent Accomplishments
- **Exa AI search integration** (2026-02-21) — Added semantic web search to scrape-news pipeline, discovering 81 new articles from sources RSS feeds miss (niche blogs, think tanks, international outlets)
- Switched AI provider from RouteLLM/AbacusAI to OpenAI direct
- Fixed broken system image URLs with verified DVIDS sources
- Added Jest testing framework
- Live site deployed at drone-wire.vercel.app
- 72+ C-UAS systems documented
- Automated RSS scraping working
- AI-powered summaries and tagging
- Newsletter subscription system

## Notes
- Tech stack: Next.js 14, TypeScript, PostgreSQL (Supabase), Vercel deployment
- Port 3002 hardcoded in `npm run dev` script — conflicts with other projects possible
- `EXA_API_KEY` added to Vercel env vars (2026-02-21)
