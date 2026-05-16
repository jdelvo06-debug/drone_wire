/**
 * USASpending.gov Contract Scraper — replaces SAM.gov Opportunities API
 * Pulls real DoD C-UAS / counter-drone awarded contracts with dollar values.
 * No API key required. Open government data.
 */

import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { Decimal } from '@prisma/client/runtime/library';

const USASPENDING_API = 'https://api.usaspending.gov/api/v2/search/spending_by_award/';

export interface ContractScrapingResult {
  contractsAdded: number;
  contractsUpdated: number;
  contractsSkipped: number;
  errors: string[];
}

interface RawAward {
  'Award ID'?: string;
  'Recipient Name'?: string;
  'Description'?: string;
  'Award Amount'?: number;
  'Action Date'?: string;
  'Awarding Agency'?: string;
  'Awarding Sub Agency'?: string;
  'Contract Award Type'?: string;
  generated_internal_id?: string;
  naics_code?: string;
  naics_description?: string;
  psc_code?: string;
  psc_description?: string;
}

interface ParsedContract {
  title: string;
  description: string;
  company: string;
  agency: string;
  office: string | null;
  value: number;
  awardDate: Date;
  sourceUrl: string;
  contractNumber: string;
  category: string;
  naicsCode: string | null;
  pscCode: string | null;
}

// ── Categorization ────────────────────────────────────────────────────

function categorizeContract(text: string, naics: string | null, psc: string | null): string {
  const lower = text.toLowerCase();

  if (lower.includes('counter-uas') || lower.includes('counter-drone') || lower.includes('c-uas') || lower.includes('c-suas'))
    return 'counter-uas';
  if (lower.includes('counter unmanned') || lower.includes('anti-drone') || lower.includes('anti drone'))
    return 'counter-uas';
  if (lower.includes('surveillance') || lower.includes('isr') || lower.includes('reconnaissance'))
    return 'surveillance';
  if (lower.includes('research') || lower.includes('development') || lower.includes('r&d') || lower.includes('sbir') || lower.includes('sttr'))
    return 'research';
  if (lower.includes('training') || lower.includes('exercise'))
    return 'training';
  if (lower.includes('electronic warfare') || lower.includes('jamming') || lower.includes('jammer'))
    return 'electronic-warfare';
  if (lower.includes('radar') || lower.includes('sensor'))
    return 'sensors';
  if (lower.includes('laser') || lower.includes('directed energy') || lower.includes('microwave') || lower.includes('hpm'))
    return 'directed-energy';
  if (lower.includes('kinetic') || lower.includes('interceptor') || lower.includes('munition') || lower.includes('coyote'))
    return 'kinetic';
  if (lower.includes('manufacturing') || lower.includes('production') || lower.includes('supply'))
    return 'manufacturing';

  return 'general';
}

function cleanTitle(awardId: string, desc: string): string {
  const normalized = (desc || '').replace(/\s+/g, ' ').trim();
 
  if (!normalized) {
    return (awardId || 'C-UAS Contract Award').slice(0, 200);
  }
 
  const sentenceMatch = normalized.match(/^[^.!?]+/);
  const firstSentence = (sentenceMatch?.[0] || normalized).trim();
  const excerpt = firstSentence.length > 80 ? `${firstSentence.slice(0, 80).trimEnd()}...` : firstSentence;
 
  const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to']);
  const cased = excerpt
    .split(' ')
    .map((word, idx) => {
      if (!word) return word;
 
      const parts = word.split('-');
      const casedParts = parts.map((part, partIdx) => {
        if (!part) return part;
        if (/^[A-Z0-9]{2,5}$/.test(part)) return part;
 
        const lower = part.toLowerCase();
        if (idx > 0 && partIdx > 0 && smallWords.has(lower)) return lower;
        if (idx > 0 && partIdx === 0 && smallWords.has(lower)) return lower;
 
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      });
 
      return casedParts.join('-');
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
 
  return cased.slice(0, 200);
}

function parseAgency(raw: RawAward): { agency: string; office: string | null } {
  const agency = raw['Awarding Agency'] || 'Department of Defense';
  const office = raw['Awarding Sub Agency'] || null;
  return { agency, office };
}

// ── Main Scraper ──────────────────────────────────────────────────────

export async function scrapeContracts(): Promise<ContractScrapingResult> {
  const result: ContractScrapingResult = {
    contractsAdded: 0,
    contractsUpdated: 0,
    contractsSkipped: 0,
    errors: [],
  };

  const searchTerms = [
    'counter unmanned', 'counter UAS', 'counter drone', 'C-UAS', 'anti drone',
    'drone defense', 'counter sUAS', 'unmanned aircraft defeat',
  ];

  const allAwards: RawAward[] = [];
  const seenIds = new Set<string>();

  // Fetch up to 3 pages per keyword set
  for (const term of searchTerms) {
    for (let page = 1; page <= 3; page++) {
      try {
        const payload = {
          filters: {
            keywords: [term],
            award_type_codes: ['A', 'B', 'C', 'D'], // contracts only
            time_period: [{ start_date: '2022-01-01', end_date: '2026-05-03' }],
          },
          fields: [
            'Award ID', 'Recipient Name', 'Description', 'Award Amount',
            'Action Date', 'Awarding Agency', 'Awarding Sub Agency',
            'Contract Award Type', 'generated_internal_id',
            'naics_code', 'naics_description', 'psc_code', 'psc_description',
          ],
          sort: 'Award Amount',
          order: 'desc',
          limit: 50,
          page,
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(USASPENDING_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          result.errors.push(`USASpending HTTP ${response.status} for "${term}" page ${page}`);
          break;
        }

        const data = (await response.json()) as {
          results?: RawAward[];
          page_metadata?: { hasNext?: boolean };
        };

        const awards = data.results || [];

        for (const a of awards) {
          const id = a.generated_internal_id || a['Award ID'];
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            allAwards.push(a);
          }
        }

        if (!data.page_metadata?.hasNext) break;

        // Rate limit: small pause
        await new Promise((r) => setTimeout(r, 300));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown';
        if (msg.includes('abort')) {
          result.errors.push(`Timeout for "${term}" page ${page}`);
        } else {
          result.errors.push(`Error "${term}" page ${page}: ${msg}`);
        }
        break;
      }
    }
  }

  logger.debug(`USASpending: fetched ${allAwards.length} unique awards`);

  // Parse and store
  for (const raw of allAwards) {
    try {
      const awardId = raw['Award ID'] || '';
      const description = (raw['Description'] || '').slice(0, 2000);
      const company = raw['Recipient Name'] || 'Unknown Contractor';
      const value = raw['Award Amount'] || 0;
      const dateStr = raw['Action Date'];
      const awardDate = dateStr ? new Date(dateStr) : new Date();
      const { agency, office } = parseAgency(raw);
      const naicsCode = raw.naics_code || null;
      const pscCode = raw.psc_code || null;
      const combinedText = `${awardId} ${description} ${company} ${agency}`;
      const category = categorizeContract(combinedText, naicsCode, pscCode);
      const title = cleanTitle(awardId, description);
      const sourceUrl = `https://www.usaspending.gov/award/CONT_AWD_${awardId}_9700_-NONE-_-NONE-`;
      const contractNumber = awardId;

      if (!contractNumber || value <= 0) {
        result.contractsSkipped++;
        continue;
      }

      // Upsert by contract number
      const existing = await prisma.contract.findUnique({
        where: { contractNumber },
      });

      if (existing) {
        const needsUpdate =
          existing.value.toNumber() !== value ||
          existing.title !== title ||
          existing.description !== description ||
          existing.company !== company ||
          existing.agency !== agency ||
          existing.office !== office ||
          existing.category !== category ||
          existing.status !== 'active';
 
        if (needsUpdate) {
          await prisma.contract.update({
            where: { id: existing.id },
            data: {
              value: new Decimal(value),
              title,
              description,
              company,
              agency,
              office,
              category,
              status: 'active',
            },
          });
          result.contractsUpdated++;
        } else {
          result.contractsSkipped++;
        }
      } else {
        await prisma.contract.create({
          data: {
            contractNumber,
            title,
            description,
            company,
            agency,
            office,
            value: new Decimal(value),
            awardDate,
            sourceUrl,
            category,
            status: 'active',
          },
        });
        result.contractsAdded++;
      }
    } catch (err) {
      result.errors.push(`DB error for ${raw['Award ID']}: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  }

  return result;
}

// ── Stats ─────────────────────────────────────────────────────────────

export async function getContractStats() {
  const [total, totalValue, byAgency, byCategory] = await Promise.all([
    prisma.contract.count(),
    prisma.contract.aggregate({ _sum: { value: true } }),
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
