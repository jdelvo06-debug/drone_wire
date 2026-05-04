import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RSS_FEEDS = [
  // Defense News Sources
  {
    name: 'Defense News',
    url: 'https://www.defensenews.com/arc/outboundfeeds/rss/',
    category: 'defense-news',
    description: 'Defense industry news and analysis',
  },
  {
    name: 'Breaking Defense',
    url: 'https://breakingdefense.com/feed/',
    category: 'defense-news',
    description: 'Defense policy and technology news',
  },
  {
    name: 'Defense One',
    url: 'https://www.defenseone.com/rss/all/',
    category: 'defense-news',
    description: 'National security and defense news',
  },
  {
    name: 'Military Times',
    url: 'https://www.militarytimes.com/arc/outboundfeeds/rss/',
    category: 'defense-news',
    description: 'Military news and information',
  },
  {
    name: 'The War Zone',
    url: 'https://www.thedrive.com/the-war-zone/feed',
    category: 'defense-news',
    description: 'Military aviation and defense technology',
  },
  {
    name: 'C4ISRNET',
    url: 'https://www.c4isrnet.com/arc/outboundfeeds/rss/',
    category: 'defense-news',
    description: 'Command, control, communications and ISR',
  },
  // Drone Industry Sources
  {
    name: 'DroneLife',
    url: 'https://dronelife.com/feed/',
    category: 'industry',
    description: 'Commercial drone industry news',
  },
  {
    name: 'sUAS News',
    url: 'https://www.suasnews.com/feed/',
    category: 'industry',
    description: 'Small unmanned aircraft systems news',
  },
  {
    name: 'Commercial UAV News',
    url: 'https://www.commercialuavnews.com/feed.xml',
    category: 'industry',
    description: 'Commercial UAV industry coverage',
  },
  // Government Contract Sources
  {
    name: 'DoD Contracts',
    url: 'https://www.defense.gov/News/Contracts/rss/',
    category: 'contracts',
    description: 'Official DoD contract announcements',
  },
];

const INITIAL_TAGS = [
  // Technologies
  { name: 'Counter-UAS', slug: 'counter-uas', category: 'technology' },
  { name: 'Electronic Warfare', slug: 'electronic-warfare', category: 'technology' },
  { name: 'Directed Energy', slug: 'directed-energy', category: 'technology' },
  { name: 'Radar', slug: 'radar', category: 'technology' },
  { name: 'AI', slug: 'ai', category: 'technology' },
  { name: 'Jamming', slug: 'jamming', category: 'technology' },
  { name: 'Drone Detection', slug: 'drone-detection', category: 'technology' },
  // Countries
  { name: 'USA', slug: 'usa', category: 'country' },
  { name: 'Ukraine', slug: 'ukraine', category: 'country' },
  { name: 'Russia', slug: 'russia', category: 'country' },
  { name: 'Israel', slug: 'israel', category: 'country' },
  { name: 'China', slug: 'china', category: 'country' },
  { name: 'NATO', slug: 'nato', category: 'country' },
  // Companies
  { name: 'Anduril', slug: 'anduril', category: 'company' },
  { name: 'Raytheon', slug: 'raytheon', category: 'company' },
  { name: 'Northrop Grumman', slug: 'northrop-grumman', category: 'company' },
  { name: 'Lockheed Martin', slug: 'lockheed-martin', category: 'company' },
  { name: 'DroneShield', slug: 'droneshield', category: 'company' },
  { name: 'Boeing', slug: 'boeing', category: 'company' },
  // Systems
  { name: 'Coyote', slug: 'coyote', category: 'system-type' },
  { name: 'Iron Dome', slug: 'iron-dome', category: 'system-type' },
  { name: 'Roadrunner', slug: 'roadrunner', category: 'system-type' },
  { name: 'Shahed', slug: 'shahed', category: 'system-type' },
  { name: 'Switchblade', slug: 'switchblade', category: 'system-type' },
];

async function seedRssFeeds() {
  console.log('Seeding RSS feeds...');

  for (const feed of RSS_FEEDS) {
    const result = await prisma.rssFeed.upsert({
      where: { url: feed.url },
      create: {
        name: feed.name,
        url: feed.url,
        category: feed.category,
        description: feed.description,
        isActive: true,
      },
      update: {
        name: feed.name,
        category: feed.category,
        description: feed.description,
      },
    });
    console.log(`  ✓ ${result.name}`);
  }

  console.log(`\nSeeded ${RSS_FEEDS.length} RSS feeds`);
}

async function seedTags() {
  console.log('\nSeeding tags...');

  for (const tag of INITIAL_TAGS) {
    const result = await prisma.tag.upsert({
      where: { slug: tag.slug },
      create: {
        name: tag.name,
        slug: tag.slug,
        category: tag.category,
      },
      update: {
        name: tag.name,
        category: tag.category,
      },
    });
    console.log(`  ✓ ${result.name}`);
  }

  console.log(`\nSeeded ${INITIAL_TAGS.length} tags`);
}

async function main() {
  console.log('Starting database seed...\n');

  try {
    await seedRssFeeds();
    await seedTags();

    console.log('\n✅ Database seeding complete!');
    console.log('\nNext steps:');
    console.log('1. Run the scraper: curl http://localhost:3000/api/cron/scrape-news -H "Authorization: Bearer YOUR_CRON_SECRET"');
    console.log('2. Run AI processing: curl http://localhost:3000/api/cron/process-ai -H "Authorization: Bearer YOUR_CRON_SECRET"');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
