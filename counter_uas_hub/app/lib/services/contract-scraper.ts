import { prisma } from '@/lib/db';
import { Decimal } from '@prisma/client/runtime/library';

// SAM.gov Opportunities API (Contract Awards API is suspended)
const SAM_GOV_API_URL = 'https://api.sam.gov/opportunities/v2/search';
const SAM_GOV_API_KEY = process.env.SAM_GOV_API_KEY || '';

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

// SAM.gov Opportunities API response types
interface SamGovOpportunity {
  noticeId?: string;
  solicitationNumber?: string;
  title?: string;
  description?: string;
  department?: string;
  subTier?: string;
  office?: string;
  postedDate?: string;
  responseDeadLine?: string;
  type?: string;
  baseType?: string;
  archiveType?: string;
  archiveDate?: string;
  naicsCode?: string;
  classificationCode?: string;
  award?: {
    date?: string;
    number?: string;
    amount?: string;
    awardee?: {
      name?: string;
      location?: {
        city?: string;
        state?: string;
      };
    };
  };
  pointOfContact?: Array<{
    fullName?: string;
    email?: string;
  }>;
  uiLink?: string;
}

function parseContractFromSamGov(item: SamGovOpportunity): ParsedContract | null {
  const title = item.title || '';
  const description = item.description || title;
  const contractNumber = item.award?.number || item.solicitationNumber || item.noticeId || '';

  const company = item.award?.awardee?.name || 'TBD';
  const agency = item.department || item.subTier || 'Department of Defense';

  // Since we search by title for relevant terms, all results are relevant
  // Skip only if no title
  if (!title) {
    return null;
  }

  const combinedText = `${title} ${description} ${company} ${agency}`;

  // Parse award amount (can be string like "$1,000,000")
  let value = 0;
  if (item.award?.amount) {
    value = parseContractValue(item.award.amount);
  }

  const dateStr = item.award?.date || item.postedDate;
  const awardDate = dateStr ? new Date(dateStr) : new Date();

  const sourceUrl = item.uiLink || `https://sam.gov/opp/${item.noticeId}/view`;

  return {
    title: title.slice(0, 200) || `Contract ${contractNumber}`,
    description: description.slice(0, 2000),
    company,
    agency,
    value,
    awardDate,
    sourceUrl,
    contractNumber: contractNumber || generateContractNumber(title, awardDate),
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

  if (!SAM_GOV_API_KEY) {
    result.errors.push('SAM_GOV_API_KEY environment variable is not set');
    return result;
  }

  try {
    console.log('Fetching DoD contract opportunities from SAM.gov API...');

    // Get opportunities from the last 6 months (API has 1-year max range)
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 6);

    const formatDate = (d: Date) =>
      `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;

    // Search terms for drone/counter-UAS contracts
    const searchTerms = ['drone', 'UAS', 'counter-uas', 'unmanned', 'anti-drone'];
    const allContracts: SamGovOpportunity[] = [];
    const seenIds = new Set<string>();

    for (const term of searchTerms) {
      try {
        const params = new URLSearchParams({
          api_key: SAM_GOV_API_KEY,
          postedFrom: formatDate(fromDate),
          postedTo: formatDate(toDate),
          title: term,
          limit: '100',
        });

        const response = await fetch(`${SAM_GOV_API_URL}?${params.toString()}`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json() as { opportunitiesData?: SamGovOpportunity[] };
          const opportunities = data.opportunitiesData || [];

          // Deduplicate by noticeId
          for (const opp of opportunities) {
            if (opp.noticeId && !seenIds.has(opp.noticeId)) {
              seenIds.add(opp.noticeId);
              allContracts.push(opp);
            }
          }
          console.log(`Found ${opportunities.length} opportunities for "${term}"`);
        }
      } catch (err) {
        console.error(`Error searching for "${term}":`, err);
      }
    }

    const contracts = allContracts;

    console.log(`Found ${contracts.length} DoD contracts from SAM.gov`);

    for (const item of contracts) {
      try {
        const contract = parseContractFromSamGov(item);

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
    result.errors.push(`Failed to fetch contracts from SAM.gov: ${errorMsg}`);
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
