# DroneWire Architecture

## System Overview

DroneWire is an AI-curated intelligence platform for counter-UAS (Unmanned Aerial Systems) news and analysis. The system automatically aggregates content from multiple sources, processes it with AI, and presents it through a modern web interface.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DRONEWIRE SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │  RSS Feeds  │    │  DoD Site   │    │   Manual    │    │  AI Service │  │
│  │  (News)     │    │ (Contracts) │    │   Input     │    │ (AbacusAI)  │  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘  │
│         │                  │                  │                  │         │
│         ▼                  ▼                  ▼                  │         │
│  ┌─────────────────────────────────────────────────────┐        │         │
│  │                   CRON JOBS (Vercel)                │        │         │
│  │  ┌──────────────┐  ┌──────────────┐                 │        │         │
│  │  │ scrape-news  │  │scrape-contract│                │        │         │
│  │  │  (6 AM UTC)  │  │  (manual)    │                 │        │         │
│  │  └──────┬───────┘  └──────┬───────┘                 │        │         │
│  │         │                 │                         │        │         │
│  │         └────────┬────────┘                         │        │         │
│  │                  ▼                                  │        │         │
│  │         ┌──────────────┐                            │        │         │
│  │         │  process-ai  │◄───────────────────────────┼────────┘         │
│  │         │  (8 AM UTC)  │                            │                  │
│  │         └──────┬───────┘                            │                  │
│  └────────────────┼────────────────────────────────────┘                  │
│                   │                                                       │
│                   ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                     SUPABASE POSTGRESQL                             │  │
│  │  ┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐ │  │
│  │  │Articles ││Explainer││ Systems ││Contracts││  Tags  ││RssFeeds │ │  │
│  │  └─────────┘└─────────┘└─────────┘└─────────┘└─────────┘└─────────┘ │  │
│  └─────────────────────────────┬───────────────────────────────────────┘  │
│                                │                                          │
│                                ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                      NEXT.JS APPLICATION                            │  │
│  │  ┌─────────────────────────────────────────────────────────────┐   │  │
│  │  │                    API ROUTES (/api)                        │   │  │
│  │  │  /articles  /contracts  /explainers  /newsletter  /contact  │   │  │
│  │  └─────────────────────────────────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────────────────────────────────────┐   │  │
│  │  │                    PAGE ROUTES                              │   │  │
│  │  │   /  /articles  /systems  /explainers  /contracts  /about   │   │  │
│  │  └─────────────────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                │                                          │
│                                ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                         VERCEL EDGE                                 │  │
│  │                   https://drone-wire.vercel.app                     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Content Ingestion

```
RSS Feeds ──► rss-scraper.ts ──► content-extractor.ts ──► Database (raw)
                    │
                    ▼
              Filter by keywords
              (counter-UAS related)
```

**Sources:**
- Defense News RSS feeds
- Drone industry publications
- Government announcements
- Technology news (filtered)

### 2. AI Processing

```
Database (raw) ──► ai-processor.ts ──► AbacusAI API ──► Database (enriched)
                        │
                        ▼
                  Generates:
                  - Summary
                  - Key points
                  - "Why it matters"
                  - Auto-tags
                  - Confidence score
```

### 3. Content Delivery

```
User Request ──► Next.js Server Component ──► Prisma Query ──► PostgreSQL
                        │
                        ▼
                  Render React Component
                        │
                        ▼
                  HTML Response to Browser
```

## Database Schema

### Core Entities

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐       │
│  │   Article   │         │    Tag      │         │  Explainer  │       │
│  ├─────────────┤         ├─────────────┤         ├─────────────┤       │
│  │ id          │◄───┐    │ id          │    ┌───►│ id          │       │
│  │ title       │    │    │ name        │    │    │ title       │       │
│  │ content     │    │    │ slug        │    │    │ slug        │       │
│  │ aiSummary   │    │    │ category    │    │    │ content     │       │
│  │ keyPoints[] │    │    └─────────────┘    │    │ category    │       │
│  │ whyItMatters│    │          ▲            │    │ difficulty  │       │
│  │ sourceUrl   │    │          │            │    │ keyFeatures │       │
│  │ imageUrl    │    │    ┌─────┴─────┐      │    │ advantages  │       │
│  │ publishedAt │    │    │           │      │    │ disadvantage│       │
│  │ confidence  │    │    │           │      │    │ views       │       │
│  │ status      │    ├────┤ArticleTag │      │    └─────────────┘       │
│  └─────────────┘    │    │           │      │          ▲               │
│                     │    └───────────┘      │          │               │
│                     │                       │    ┌─────┴─────┐         │
│                     │    ┌───────────┐      │    │           │         │
│                     └────┤ExplainerTag├─────┘    │ExplainerTag│        │
│                          │           │           │           │         │
│                          └───────────┘           └───────────┘         │
│                                                                         │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐       │
│  │   System    │         │  Contract   │         │  RssFeed    │       │
│  ├─────────────┤         ├─────────────┤         ├─────────────┤       │
│  │ id          │         │ id          │         │ id          │       │
│  │ name        │         │ title       │         │ name        │       │
│  │ slug        │         │ description │         │ url         │       │
│  │ category    │         │ awardAmount │         │ category    │       │
│  │ manufacturer│         │ contractor  │         │ isActive    │       │
│  │ country     │         │ awardDate   │         │ lastFetched │       │
│  │ status      │         │ sourceUrl   │         └─────────────┘       │
│  │ specs[]     │         └─────────────┘                               │
│  │ combatRecord│                                  ┌─────────────┐       │
│  └─────────────┘                                  │ Newsletter  │       │
│        ▲                                          │ Subscriber  │       │
│        │                                          ├─────────────┤       │
│  ┌─────┴─────┐                                    │ id          │       │
│  │ SystemTag │                                    │ email       │       │
│  │           │                                    │ status      │       │
│  └───────────┘                                    └─────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Article Status Flow

```
pending ──► processing ──► published
                │
                ▼
             failed
```

## Component Architecture

### Frontend Components

```
/components
├── /ui                    # Shadcn/UI primitives (49 components)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
│
├── /layout               # Application shell
│   ├── header.tsx        # Navigation, search, theme toggle
│   ├── footer.tsx        # Links, newsletter signup
│   └── mobile-nav.tsx    # Responsive navigation
│
├── /home                 # Landing page sections
│   ├── hero-section.tsx
│   ├── featured-articles.tsx
│   ├── latest-intel.tsx
│   └── newsletter-cta.tsx
│
├── /articles             # Article-related components
│   ├── article-card.tsx
│   ├── article-list.tsx
│   ├── article-detail.tsx
│   └── article-filters.tsx
│
├── /explainers           # Explainer-related components
│   ├── explainer-card.tsx
│   ├── explainer-grid.tsx
│   └── explainer-content.tsx
│
├── /systems              # System-related components
│   └── systems-header.tsx  # Search and filter controls
│
└── /contracts            # Contract-related components
    ├── contract-table.tsx
    └── contract-filters.tsx
```

### State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │  TanStack Query │    │     Zustand     │                    │
│  │  (Server State) │    │  (Client State) │                    │
│  ├─────────────────┤    ├─────────────────┤                    │
│  │ - Article lists │    │ - UI state      │                    │
│  │ - Pagination    │    │ - Filter state  │                    │
│  │ - Search results│    │ - Modal state   │                    │
│  │ - Caching       │    │                 │                    │
│  └─────────────────┘    └─────────────────┘                    │
│                                                                 │
│  ┌─────────────────┐                                           │
│  │      Jotai      │                                           │
│  │  (Atomic State) │                                           │
│  ├─────────────────┤                                           │
│  │ - Theme         │                                           │
│  │ - Preferences   │                                           │
│  └─────────────────┘                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## API Design

### RESTful Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List articles (paginated, filterable) |
| GET | `/api/articles/[id]` | Get single article |
| GET | `/api/contracts` | List contracts (paginated, sortable) |
| GET | `/api/explainers` | List explainers (filterable) |
| GET | `/api/systems` | List systems (category, status, country filters) |
| POST | `/api/systems` | Increment system view count |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/stats` | Get live database counts |
| GET | `/feed.xml` | RSS feed output |

### Admin Endpoints (Protected by CRON_SECRET)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/reprocess-images` | Get image stats |
| POST | `/api/admin/reprocess-images` | Reprocess articles missing images |
| GET | `/api/admin/seed-explainers` | Get explainer seed status |
| POST | `/api/admin/seed-explainers` | Seed explainers to database |

### Cron Endpoints (Protected by CRON_SECRET)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cron/scrape-news` | Scrape RSS feeds (daily 6 AM UTC) |
| GET | `/api/cron/scrape-contracts` | Scrape SAM.gov contracts (manual) |
| GET | `/api/cron/process-ai` | AI processing (daily 8 AM UTC) |

### Query Parameters

**Articles:**
```
GET /api/articles?page=1&limit=10&status=published&tag=counter-uas&search=drone
```

**Contracts:**
```
GET /api/contracts?page=1&limit=20&sortBy=awardDate&sortDir=desc
```

## Infrastructure

### Vercel Deployment

```
GitHub (main branch)
        │
        ▼ (auto-deploy on push)
┌───────────────────────────────┐
│        VERCEL                 │
├───────────────────────────────┤
│  Build: prisma generate &&    │
│         next build            │
│                               │
│  Runtime: Node.js 20.x        │
│                               │
│  Cron Jobs:                   │
│  - scrape-news (6 AM UTC)     │
│  - process-ai (8 AM UTC)      │
│                               │
│  Edge Network: Global CDN     │
└───────────────────────────────┘
        │
        ▼
┌───────────────────────────────┐
│      SUPABASE                 │
├───────────────────────────────┤
│  PostgreSQL Database          │
│  Region: us-west-2            │
│  Connection: Transaction      │
│              Pooler (6543)    │
└───────────────────────────────┘
```

### Environment Configuration

| Environment | Database | Cron | Domain |
|-------------|----------|------|--------|
| Development | Supabase (pooler) | Manual | localhost:3000 |
| Production | Supabase (pooler) | Vercel | drone-wire.vercel.app |

## Security

### Authentication
- Cron endpoints protected by `CRON_SECRET` header
- No user authentication (public content)

### Data Validation
- Zod schemas for API input validation
- Prisma for SQL injection protection
- Content sanitization for user inputs

### Environment Variables
- Sensitive keys stored in Vercel environment
- `.env` excluded from git
- Separate keys for development/production
