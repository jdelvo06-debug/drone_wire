# DroneWire

An AI-curated intelligence hub for drone warfare, counter-UAS technology, defense contracts, and related policy.

**Live Site:** [https://drone-wire.vercel.app](https://drone-wire.vercel.app)

## Features

- **News Aggregation** - Automated RSS scraping with AI-powered summaries and tagging
- **C-UAS Systems Database** - Comprehensive database of 72+ counter-UAS systems across 10+ countries
- **Defense Contracts** - Tracking of DoD drone and counter-drone contracts
- **Educational Explainers** - In-depth guides on drone technology and policy
- **Newsletter** - Email subscription for updates
- **Dark/Light Theme** - Full theme support

## Tech Stack

- **Framework:** Next.js 14 (App Router, Server Components)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL via Prisma ORM (Supabase hosted)
- **Styling:** Tailwind CSS with dark mode
- **UI Components:** Shadcn/UI (Radix primitives)
- **State Management:** Zustand, Jotai, TanStack Query
- **AI Processing:** AbacusAI / RouteLLM
- **Email:** Resend
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20.x (see `.nvmrc`)
- PostgreSQL database (Supabase recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/DRONE_Wire.git
cd DRONE_Wire/counter_uas_hub/app

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

### Environment Variables

Create a `.env` file in `/counter_uas_hub/app/`:

```env
DATABASE_URL="postgresql://..."
ABACUSAI_API_KEY="..."
CRON_SECRET="..."
SAM_GOV_API_KEY="..."
RESEND_API_KEY="..."
ADMIN_EMAIL="..."
```

### Database Setup

```bash
# Push schema to database
npx prisma db push

# Seed initial data
npx tsx scripts/seed-rss-feeds.ts
npx tsx scripts/seed-systems.ts
npx tsx scripts/seed-explainers.ts
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run health` | Run production health check |
| `npm run health:local` | Run local health check |

### Prisma Commands

```bash
npx prisma generate    # Regenerate client after schema changes
npx prisma db push     # Push schema changes to database
npx prisma studio      # Open database GUI
```

## Project Structure

```
/counter_uas_hub/app/
├── /app                    # Next.js App Router
│   ├── /api               # API routes
│   │   ├── /cron          # Automated scraping endpoints
│   │   └── ...            # REST APIs
│   ├── /articles          # News articles pages
│   ├── /contracts         # Defense contracts pages
│   ├── /explainers        # Educational content
│   └── /systems           # C-UAS systems database
├── /components
│   ├── /ui                # Shadcn/UI primitives
│   └── ...                # Feature components
├── /lib
│   ├── /services          # Data pipeline services
│   └── /constants         # Configuration
├── /prisma                # Database schema
└── /scripts               # Seeding scripts
```

## Data Pipeline

Automated cron jobs handle data collection:

1. **scrape-news** (6 AM UTC) - Fetches RSS feeds, filters by counter-UAS keywords
2. **process-ai** (8 AM UTC) - Generates AI summaries, key points, and auto-tags

## C-UAS Systems Database

72+ counter-UAS systems organized by:

**Categories:**
- `integrated` - Complete C-UAS solutions
- `sensor` - Detection systems
- `effector` - Defeat systems
- `c2` - Command & Control

**Countries:** USA, Israel, Australia, Germany, France, UK, and more

## Deployment

Deployed on Vercel with Supabase PostgreSQL.

### Vercel Configuration

- Node.js 20.x
- Build: `prisma generate && next build`
- 2 cron jobs (free tier limit)

### Supabase Notes

Use Transaction pooler for Vercel compatibility:
- Host: `aws-0-us-west-2.pooler.supabase.com:6543`
- Add `?pgbouncer=true` to connection string

## License

MIT
