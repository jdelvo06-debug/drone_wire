export interface RssFeedConfig {
  name: string;
  url: string;
  category: 'defense-news' | 'contracts' | 'industry';
}

export const RSS_FEEDS: RssFeedConfig[] = [
  // Defense News Sources
  {
    name: 'Defense News',
    url: 'https://www.defensenews.com/arc/outboundfeeds/rss/',
    category: 'defense-news',
  },
  {
    name: 'Breaking Defense',
    url: 'https://breakingdefense.com/feed/',
    category: 'defense-news',
  },
  {
    name: 'Defense One',
    url: 'https://www.defenseone.com/rss/all/',
    category: 'defense-news',
  },
  {
    name: 'Military Times',
    url: 'https://www.militarytimes.com/arc/outboundfeeds/rss/',
    category: 'defense-news',
  },
  {
    name: 'The War Zone',
    url: 'https://www.thedrive.com/the-war-zone/feed',
    category: 'defense-news',
  },
  {
    name: 'C4ISRNET',
    url: 'https://www.c4isrnet.com/arc/outboundfeeds/rss/',
    category: 'defense-news',
  },
  // Drone Industry Sources
  {
    name: 'DroneLife',
    url: 'https://dronelife.com/feed/',
    category: 'industry',
  },
  {
    name: 'sUAS News',
    url: 'https://www.suasnews.com/feed/',
    category: 'industry',
  },
  {
    name: 'Commercial UAV News',
    url: 'https://www.commercialuavnews.com/feed.xml',
    category: 'industry',
  },
  // Government Contract Sources
  {
    name: 'DoD Contracts',
    url: 'https://www.defense.gov/News/Contracts/rss/',
    category: 'contracts',
  },
];

// Keywords for filtering relevant counter-UAS content
export const COUNTER_UAS_KEYWORDS = [
  // Core terms
  'counter-uas',
  'counter-drone',
  'anti-drone',
  'c-uas',
  'cuas',
  // Drone defense
  'drone defense',
  'drone detection',
  'drone jammer',
  'drone jamming',
  'drone intercept',
  'drone threat',
  'drone swarm',
  'drone attack',
  // UAS terms
  'unmanned aerial',
  'unmanned aircraft',
  'small uas',
  'suas',
  'uav threat',
  'fpv drone',
  // Technologies
  'electronic warfare',
  'rf jammer',
  'rf jamming',
  'directed energy',
  'laser defense',
  'high-power microwave',
  'hpm weapon',
  // Air defense
  'air defense',
  'short-range air defense',
  'shorad',
  'manpads',
  // Specific systems
  'iron dome',
  'coyote drone',
  'roadrunner',
  'droneshield',
  'anduril',
  'dedrone',
  'drone gun',
  'skydio',
  // Radar/sensors
  'drone radar',
  'drone sensor',
  'drone tracking',
  'acoustic detection',
  // Military contexts
  'ukraine drone',
  'russian drone',
  'shahed',
  'lancet',
  'orlan',
  'switchblade',
  'loitering munition',
];

// Keywords for contract filtering (broader to catch defense contracts)
export const CONTRACT_KEYWORDS = [
  ...COUNTER_UAS_KEYWORDS,
  'air defense system',
  'electronic attack',
  'radar system',
  'surveillance system',
  'defense contract',
  'unmanned system',
  'autonomous system',
];

// Helper to check if text contains relevant keywords
export function isRelevantContent(text: string): boolean {
  const lowerText = text.toLowerCase();
  return COUNTER_UAS_KEYWORDS.some((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  );
}

export function isRelevantContract(text: string): boolean {
  const lowerText = text.toLowerCase();
  return CONTRACT_KEYWORDS.some((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  );
}
