# DRONE_Wire Architecture

## High-Level System Overview

DroneWire is an AI-curated intelligence hub focused on drone warfare, counter-UAS (Unmanned Aerial Systems) technology, defense contracts, and related policy. The application serves as a centralized platform for defense professionals, analysts, and enthusiasts to stay informed about developments in the counter-drone landscape.

### Core Capabilities

1. **Automated News Aggregation** - RSS feed scraping with keyword filtering for counter-UAS relevant content
2. **AI-Powered Analysis** - Automatic generation of summaries, key points, and contextual analysis using LLMs
3. **Counter-UAS Systems Database** - Comprehensive catalog of 72+ counter-UAS systems across 10+ countries
4. **Defense Contract Tracking** - Integration with SAM.gov API for DoD contract opportunities
5. **Real-time Alerts** - Email notifications for high-confidence breaking news
6. **Educational Content** - Explainer articles with structured content for learning about C-UAS technology

```
+---------------------+     +---------------------+     +---------------------+
|   External Sources  |     |    DroneWire App    |     |      End Users      |
|---------------------|     |---------------------|     |---------------------|
| - RSS Feeds (10+)   |---->|  Next.js 14 (App    |---->| - Web Interface     |
| - SAM.gov API       |     |  Router + Server    |     | - Newsletter        |
| - Manual Seeding    |     |  Components)        |     | - Breaking Alerts   |
+---------------------+     +---------------------+     +---------------------+
                                     |
                                     v
                            +---------------------+
                            |   AI Processing     |
                            |---------------------|
                            |   OpenAI (GPT-4o)   |
                            |                     |
                            +---------------------+
                                     |
                                     v
                            +---------------------+
                            |     Database        |
                            |---------------------|
                            | PostgreSQL          |
                            | (Supabase hosted)   |
                            +---------------------+
```

---

## Component Architecture

### Directory Structure

```
/DRONE_Wire/
└── /counter_uas_hub/app/          # Main application root
    ├── /app/                       # Next.js App Router
    │   ├── /api/                   # API Routes
    │   │   ├── /articles/          # Article CRUD
    │   │   ├── /contracts/         # Contract queries
    │   │   ├── /systems/           # C-UAS systems
    │   │   ├── /cron/              # Automated jobs
    │   │   │   ├── /scrape-news/   # RSS scraping
    │   │   │   ├── /process-ai/    # AI enrichment
    │   │   │   ├── /scrape-contracts/ # SAM.gov
    │   │   │   └── /send-alerts/   # Email alerts
    │   │   ├── /newsletter/        # Subscriptions
    │   │   ├── /contact/           # Contact form
    │   │   └── /admin/             # Admin endpoints
    │   ├── /articles/              # Article pages
    │   │   └── /[id]/              # Dynamic detail
    │   ├── /systems/               # Systems pages
    │   │   └── /[slug]/            # Dynamic detail
    │   ├── /explainers/            # Explainer pages
    │   │   └── /[slug]/            # Dynamic detail
    │   ├── /contracts/             # Contracts page
    │   ├── /admin/                 # Admin dashboard
    │   ├── layout.tsx              # Root layout
    │   └── page.tsx                # Home page
    │
    ├── /components/
    │   ├── /ui/                    # Shadcn/UI (49 components)
    │   ├── /home/                  # Home page sections
    │   ├── /layout/                # Header, Footer, Navigation
    │   ├── /articles/              # Article components
    │   ├── /systems/               # Systems components
    │   ├── /explainers/            # Explainer components
    │   └── /contracts/             # Contract components
    │
    ├── /lib/
    │   ├── /services/              # Business logic
    │   │   ├── rss-scraper.ts      # RSS feed processing
    │   │   ├── ai-processor.ts     # AI summary generation
    │   │   ├── contract-scraper.ts # SAM.gov integration
    │   │   ├── content-extractor.ts # Full article extraction
    │   │   ├── alerts.ts           # Breaking news alerts
    │   │   └── email.ts            # Resend integration
    │   ├── /constants/
    │   │   ├── rss-feeds.ts        # Feed URLs & keywords
    │   │   └── images.ts           # Image validation
    │   ├── db.ts                   # Prisma client singleton
    │   ├── logger.ts               # Logging utility
    │   └── utils.ts                # Helpers (cn, etc.)
    │
    ├── /hooks/                     # Custom React hooks
    ├── /scripts/                   # Seeding scripts
    │   ├── seed-rss-feeds.ts
    │   ├── seed-systems.ts
    │   └── seed-explainers.ts
    │
    ├── /prisma/
    │   └── schema.prisma           # Database models
    │
    └── vercel.json                 # Cron configuration
```

### Major Components

#### 1. Data Ingestion Layer
- **RSS Scraper** (`/lib/services/rss-scraper.ts`) - Fetches articles from 10+ defense news sources
- **Contract Scraper** (`/lib/services/contract-scraper.ts`) - Queries SAM.gov API for drone/UAS contracts
- **Content Extractor** (`/lib/services/content-extractor.ts`) - Extracts full article text from source URLs

#### 2. AI Processing Layer
- **AI Processor** (`/lib/services/ai-processor.ts`) - Generates summaries, key points, and auto-tags using GPT-4o
- **Embedding Generation** - Optional vector embeddings for similarity search (requires OpenAI API key)

#### 3. Notification Layer
- **Alerts Service** (`/lib/services/alerts.ts`) - Identifies high-confidence articles for breaking news
- **Email Service** (`/lib/services/email.ts`) - Handles transactional emails via Resend

#### 4. Presentation Layer
- **Server Components** - Data fetching and rendering
- **Client Components** - Interactive elements (theme toggle, forms, etc.)
- **Shadcn/UI** - 49 pre-built accessible components

---

## Data Flow

### 1. News Article Pipeline

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        DAILY CRON PIPELINE                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   6:00 AM UTC                           8:00 AM UTC                      │
│   ┌─────────────┐                      ┌─────────────┐                   │
│   │ scrape-news │                      │ process-ai  │                   │
│   │ (Vercel)    │                      │ (Vercel)    │                   │
│   └──────┬──────┘                      └──────┬──────┘                   │
│          │                                    │                          │
│          v                                    v                          │
│   ┌─────────────┐                      ┌─────────────┐                   │
│   │ Fetch RSS   │                      │ Get pending │                   │
│   │ feeds (10+) │                      │ articles    │                   │
│   └──────┬──────┘                      └──────┬──────┘                   │
│          │                                    │                          │
│          v                                    v                          │
│   ┌─────────────┐                      ┌─────────────┐                   │
│   │ Filter by   │                      │ Extract     │                   │
│   │ keywords    │                      │ full content│                   │
│   │ (60+ terms) │                      │ from URL    │                   │
│   └──────┬──────┘                      └──────┬──────┘                   │
│          │                                    │                          │
│          v                                    v                          │
│   ┌─────────────┐                      ┌─────────────┐                   │
│   │ Dedupe &    │                      │ Call AI     │                   │
│   │ categorize  │                      │ (OpenAI)    │                   │
│   └──────┬──────┘                      └──────┬──────┘                   │
│          │                                    │                          │
│          v                                    v                          │
│   ┌─────────────┐                      ┌─────────────┐                   │
│   │ Save to DB  │                      │ Update with │                   │
│   │ status:     │                      │ - aiSummary │                   │
│   │ pending_ai  │                      │ - keyPoints │                   │
│   └─────────────┘                      │ - whyItMatters                  │
│                                        │ - tags      │                   │
│                                        │ - confidence│                   │
│                                        │ status:     │                   │
│                                        │ published   │                   │
│                                        └─────────────┘                   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2. Contract Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Manual      │     │ SAM.gov API │     │ Parse &     │     │ Save to     │
│ Trigger     │────>│ Query       │────>│ Categorize  │────>│ Database    │
│ (scrape-    │     │ (drone,UAS, │     │ Contract    │     │             │
│  contracts) │     │  counter-   │     │             │     │             │
│             │     │  uas, etc.) │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### 3. Alert Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Article     │     │ Check       │     │ Match       │     │ Send via    │
│ Published   │────>│ confidence  │────>│ Subscriber  │────>│ Resend      │
│ (>0.8)      │     │ threshold   │     │ Preferences │     │             │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

## Database Schema

### Core Models

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Article     │     │      Tag        │     │   ArticleTag    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │     │ articleId (FK)  │
│ title           │     │ name            │     │ tagId (FK)      │
│ content         │     │ slug            │     └─────────────────┘
│ excerpt         │     │ category        │
│ sourceUrl       │     │ color           │
│ sourceName      │     └────────┬────────┘
│ publishedAt     │              │
│ category        │              │
│ status          │              │
│ views           │     ┌────────┴────────┐
│ aiSummary       │     │   ExplainerTag  │
│ whyItMatters    │     │   SystemTag     │
│ keyPoints[]     │     └─────────────────┘
│ confidence      │
│ embedding[]     │
│ alertSent       │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Explainer    │     │     System      │     │    Contract     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │     │ id              │
│ title           │     │ name            │     │ contractNumber  │
│ slug            │     │ slug            │     │ title           │
│ description     │     │ description     │     │ description     │
│ content         │     │ content         │     │ company         │
│ category        │     │ category        │     │ agency          │
│ difficulty      │     │ subcategory     │     │ value           │
│ readTime        │     │ manufacturer    │     │ awardDate       │
│ views           │     │ country         │     │ category        │
│ featured        │     │ status          │     │ status          │
│ whatItIs        │     │ specifications[]│     │ sourceUrl       │
│ howItWorks      │     │ platforms[]     │     └─────────────────┘
│ keyFeatures[]   │     │ deployedBy[]    │
│ advantages[]    │     │ combatRecord    │
│ disadvantages[] │     │ views           │
└─────────────────┘     │ featured        │
                        └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Newsletter      │     │    RssFeed      │     │ ContactSubmission
│ Subscriber      │     ├─────────────────┤     ├─────────────────┤
├─────────────────┤     │ id              │     │ id              │
│ id              │     │ name            │     │ name            │
│ email           │     │ url             │     │ email           │
│ firstName       │     │ category        │     │ subject         │
│ interests[]     │     │ isActive        │     │ message         │
│ alertsEnabled   │     │ lastChecked     │     │ type            │
│ alertCategories[]│    │ errorCount      │     │ status          │
│ alertFrequency  │     └─────────────────┘     └─────────────────┘
│ minConfidence   │
└─────────────────┘
```

### System Categories
- **integrated** - Complete C-UAS solutions (FS-LIDS, MADIS, Iron Dome)
- **sensor** - Detection systems (KURFS, DroneShield RfPatrol)
- **effector** - Defeat systems (Coyote, THOR, Iron Beam)
- **c2** - Command & Control (FAAD C2, IBCS, DroneSentry-C2)

---

## Key Technical Decisions

### 1. Next.js 14 with App Router
**Why:** Server Components for optimal performance and SEO, built-in API routes, and excellent Vercel deployment support.
- Server Components by default for data fetching
- Client Components only for interactive elements
- `force-dynamic` export required for pages using Prisma

### 2. PostgreSQL via Prisma + Supabase
**Why:** Relational data with complex relationships (tags, systems, articles), type-safe queries, free hosting.
- Transaction pooler required for Vercel serverless functions
- PgBouncer connection string with `?pgbouncer=true`

### 3. OpenAI for AI Processing
**Why:** Direct GPT-4o access for chat completions and text-embedding-3-small for embeddings.
- JSON response format for structured analysis
- 0.3 temperature for consistent outputs
- Embeddings for article similarity search

### 4. Shadcn/UI Component Library
**Why:** Accessible, customizable Radix primitives with Tailwind styling.
- 49 pre-built components
- Dark/light theme support via next-themes
- Consistent design language

### 5. Vercel Cron Jobs
**Why:** Native integration, free tier supports 2 jobs.
- `scrape-news` at 6 AM UTC daily
- `process-ai` at 8 AM UTC daily
- `scrape-contracts` triggered manually (free tier limit)

### 6. Resend for Transactional Email
**Why:** Modern API, reliable delivery, good free tier.
- Welcome emails for newsletter signups
- Breaking news alerts
- Contact form notifications

### 7. Keyword-Based Filtering
**Why:** Ensures content relevance without expensive AI classification.
- 60+ keywords in `COUNTER_UAS_KEYWORDS` array
- Categories: core terms, technologies, systems, military contexts
- Pre-filters before AI processing to control costs

---

## External Services & APIs

| Service | Purpose | Rate Limits / Notes |
|---------|---------|---------------------|
| **Supabase** | PostgreSQL database hosting | Free tier: 500MB storage, 2GB bandwidth |
| **Vercel** | Hosting & deployment | Hobby tier: 2 cron jobs, 100GB bandwidth |
| **OpenAI** | AI processing (GPT-4o) + embeddings | Pay-per-use, 2s delay between calls |
| **SAM.gov API** | Federal contract opportunities | 1000 requests/day, API key required |
| **Resend** | Transactional email | Free tier: 3000 emails/month |
| **RSS Feeds** | News sources | 10+ feeds, 1s delay between fetches |

### RSS Feed Sources
- Defense News
- Breaking Defense
- Defense One
- Military Times
- The War Zone (The Drive)
- C4ISRNET
- DroneLife
- sUAS News
- Commercial UAV News
- DoD Contracts RSS

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"

# AI Processing
OPENAI_API_KEY="..."                # OpenAI API key (gpt-4o + embeddings)

# External APIs
SAM_GOV_API_KEY="..."               # Federal contracts API
CRON_SECRET="..."                   # Cron job authentication

# Email
RESEND_API_KEY="..."                # Transactional email
ADMIN_EMAIL="admin@example.com"     # Contact form notifications
FROM_EMAIL="DroneWire <noreply@dronewire.com>"

# Application
SITE_URL="https://drone-wire.vercel.app"
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              VERCEL                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                        Edge Network                             │   │
│   │   - Static assets (images, CSS, JS)                            │   │
│   │   - Cached responses                                           │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    v                                    │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    Serverless Functions                         │   │
│   │   - API routes (/api/*)                                        │   │
│   │   - Server Components                                          │   │
│   │   - Cron endpoints                                             │   │
│   │   - Max duration: 300s (5 min) for cron                        │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                      Cron Scheduler                             │   │
│   │   - 0 6 * * * /api/cron/scrape-news                            │   │
│   │   - 0 8 * * * /api/cron/process-ai                             │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    v
┌─────────────────────────────────────────────────────────────────────────┐
│                             SUPABASE                                    │
├─────────────────────────────────────────────────────────────────────────┤
│   PostgreSQL Database                                                   │
│   - Transaction pooler (IPv4 compatible)                               │
│   - Host: aws-0-us-west-2.pooler.supabase.com:6543                     │
│   - PgBouncer enabled for connection pooling                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Security Considerations

1. **Cron Authentication** - All cron endpoints validate `x-vercel-cron` header or `CRON_SECRET` bearer token
2. **XSS Prevention** - HTML escaping for all user-provided data in email templates
3. **Input Validation** - Zod schemas for form validation
4. **Environment Variables** - Sensitive keys never committed, `.env.example` provided
5. **Database Security** - Supabase Row Level Security available (not currently implemented)

---

## Performance Optimizations

1. **Server Components** - Zero client-side JavaScript for static content
2. **Prisma Client Singleton** - Single database connection pool
3. **Rate Limiting** - 1-2 second delays between external API calls
4. **Lazy Loading** - Dynamic imports for heavy components
5. **Image Optimization** - Next.js Image component (when applicable)
6. **Database Indexes** - Optimized queries on frequently filtered columns

---

## Monitoring & Observability

- **Logger** (`/lib/logger.ts`) - Structured logging with log levels
- **Health Check** (`/api/health`) - Database connectivity verification
- **Admin Stats** (`/api/admin/stats`) - Article counts, processing status
- **Feed Error Tracking** - Auto-disable feeds after 5 consecutive failures

---

## Future Considerations

1. **Vector Search** - Embeddings stored in schema, search not yet implemented
2. **Row Level Security** - Supabase RLS for multi-tenant support
3. **Real-time Updates** - Supabase Realtime for live article updates
4. **API Rate Limiting** - Currently no external rate limiting
5. **Caching Layer** - Redis/Upstash for API response caching
6. **Analytics** - User behavior tracking not implemented
