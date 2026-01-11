import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { prisma } from '@/lib/db';
import { isRelevantContract } from '@/lib/constants/rss-feeds';
import { Decimal } from '@prisma/client/runtime/library';

const parser = new Parser({
  timeout: 30000,
  headers: {
    'User-Agent': 'DroneWire/1.0 (Counter-UAS Intelligence Hub)',
  },
});

const DOD_CONTRACTS_RSS = 'https://www.defense.gov/News/Contracts/rss/';

export interface ContractScrapingResult {
  contractsAdded: number;
  contractsUpdated: number;
  contractsSkipped: number;
  errors: string[];
}

interface ParsedContract {
  title: string;
  description: string;
  company: string;
  agency: string;
  value: number;
  awardDate: Date;
  sourceUrl: string;
  contractNumber: string | null;
  category: string;
}

// Extract contract value from text like "$642,000,000" or "642 million"
function parseContractValue(text: string): number {
  // Try to find dollar amounts
  const patterns = [
    /\$([0-9,]+(?:\.[0-9]+)?)\s*(million|billion)?/i,
    /([0-9,]+(?:\.[0-9]+)?)\s*(million|billion)?\s*dollars?/i,
    /\$([0-9,]+(?:\.[0-9]+)?)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let value = parseFloat(match[1].replace(/,/g, ''));
      const multiplier = match[2]?.toLowerCase();

      if (multiplier === 'billion') {
        value *= 1_000_000_000;
      } else if (multiplier === 'million') {
        value *= 1_000_000;
      }

      return value;
    }
  }

  return 0;
}

// Extract company name (usually the first part of the contract announcement)
function extractCompany(text: string): string {
  // DoD format often starts with company name followed by location
  const match = text.match(/^([^,]+),\s*[A-Z][a-z]+/);
  if (match) {
    return match[1].trim();
  }

  // Try to find company before "has been awarded" or "was awarded"
  const awardMatch = text.match(/^(.+?)\s+(?:has been|was)\s+awarded/i);
  if (awardMatch) {
    return awardMatch[1].trim();
  }

  return 'Unknown Contractor';
}

// Extract agency from text
function extractAgency(text: string): string {
  const agencies: Record<string, string[]> = {
    'U.S. Army': ['army', 'u.s. army'],
    'U.S. Navy': ['navy', 'u.s. navy', 'naval'],
    'U.S. Air Force': ['air force', 'u.s. air force', 'usaf'],
    'U.S. Marine Corps': ['marine corps', 'marines', 'usmc'],
    'DARPA': ['darpa', 'defense advanced research'],
    'Space Force': ['space force', 'ussf'],
    'Missile Defense Agency': ['missile defense agency', 'mda'],
    'Defense Logistics Agency': ['defense logistics', 'dla'],
    'Department of Defense': ['department of defense', 'dod', 'osd'],
  };

  const lowerText = text.toLowerCase();

  for (const [agency, keywords] of Object.entries(agencies)) {
    if (keywords.some((k) => lowerText.includes(k))) {
      return agency;
    }
  }

  return 'Department of Defense';
}

// Generate a contract number from content if not provided
function generateContractNumber(title: string, date: Date): string {
  // Try to extract contract number from title (format like "W911NF-24-C-0001")
  const contractMatch = title.match(/([A-Z0-9]{4,}-\d{2}-[A-Z]-\d{4})/);
  if (contractMatch) {
    return contractMatch[1];
  }

  // Generate a unique identifier based on title hash and date
  const hash = title.split('').reduce((a, b) => {
    const h = (a << 5) - a + b.charCodeAt(0);
    return h & h;
  }, 0);

  return `DOD-${date.toISOString().slice(0, 10).replace(/-/g, '')}-${Math.abs(hash).toString(16).slice(0, 6).toUpperCase()}`;
}

// Categorize contract based on content
function categorizeContract(text: string): string {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('counter-uas') || lowerText.includes('counter-drone') || lowerText.includes('c-uas')) {
    return 'counter-uas';
  }
  if (lowerText.includes('surveillance') || lowerText.includes('isr') || lowerText.includes('reconnaissance')) {
    return 'surveillance';
  }
  if (lowerText.includes('research') || lowerText.includes('development') || lowerText.includes('r&d')) {
    return 'research';
  }
  if (lowerText.includes('training') || lowerText.includes('exercise')) {
    return 'training';
  }
  if (lowerText.includes('electronic warfare') || lowerText.includes('jamming')) {
    return 'electronic-warfare';
  }
  if (lowerText.includes('radar') || lowerText.includes('sensor')) {
    return 'sensors';
  }

  return 'general';
}

function parseContractFromRss(item: { title?: string; link?: string; pubDate?: string; content?: string; contentSnippet?: string }): ParsedContract | null {
  if (!item.title) return null;

  const content = item.contentSnippet || item.content || item.title;
  const combinedText = `${item.title} ${content}`;

  // Check if relevant to counter-UAS/defense
  if (!isRelevantContract(combinedText)) {
    return null;
  }

  const value = parseContractValue(combinedText);
  const awardDate = item.pubDate ? new Date(item.pubDate) : new Date();

  return {
    title: item.title,
    description: content.slice(0, 2000),
    company: extractCompany(content),
    agency: extractAgency(content),
    value,
    awardDate,
    sourceUrl: item.link || '',
    contractNumber: generateContractNumber(item.title, awardDate),
    category: categorizeContract(combinedText),
  };
}

export async function scrapeContracts(): Promise<ContractScrapingResult> {
  const result: ContractScrapingResult = {
    contractsAdded: 0,
    contractsUpdated: 0,
    contractsSkipped: 0,
    errors: [],
  };

  try {
    console.log('Scraping DoD contracts RSS feed...');
    const feed = await parser.parseURL(DOD_CONTRACTS_RSS);

    for (const item of feed.items) {
      try {
        const contract = parseContractFromRss(item);

        if (!contract) {
          result.contractsSkipped++;
          continue;
        }

        // Check if contract already exists
        const existing = await prisma.contract.findFirst({
          where: {
            OR: [
              { contractNumber: contract.contractNumber },
              { sourceUrl: contract.sourceUrl },
            ],
          },
        });

        if (existing) {
          // Update if value changed
          if (existing.value.toNumber() !== contract.value && contract.value > 0) {
            await prisma.contract.update({
              where: { id: existing.id },
              data: {
                value: new Decimal(contract.value),
                description: contract.description,
              },
            });
            result.contractsUpdated++;
          } else {
            result.contractsSkipped++;
          }
          continue;
        }

        // Create new contract
        await prisma.contract.create({
          data: {
            title: contract.title,
            description: contract.description,
            company: contract.company,
            agency: contract.agency,
            value: new Decimal(contract.value),
            awardDate: contract.awardDate,
            sourceUrl: contract.sourceUrl,
            contractNumber: contract.contractNumber,
            category: contract.category,
            status: 'active',
          },
        });

        result.contractsAdded++;
        console.log(`Added contract: ${contract.title.slice(0, 50)}... ($${contract.value.toLocaleString()})`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(`Error processing contract: ${errorMsg}`);
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(`Failed to fetch contracts RSS: ${errorMsg}`);
    console.error('Contract scraping error:', error);
  }

  return result;
}

// Get contract statistics
export async function getContractStats() {
  const [total, totalValue, byAgency, byCategory] = await Promise.all([
    prisma.contract.count(),
    prisma.contract.aggregate({
      _sum: { value: true },
    }),
    prisma.contract.groupBy({
      by: ['agency'],
      _count: true,
      _sum: { value: true },
    }),
    prisma.contract.groupBy({
      by: ['category'],
      _count: true,
    }),
  ]);

  return {
    totalContracts: total,
    totalValue: totalValue._sum.value?.toNumber() || 0,
    byAgency,
    byCategory,
  };
}
