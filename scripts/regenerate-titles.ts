import { config } from 'dotenv';
config({ path: '.env.local' });

import { prisma } from '../lib/db';

// Same logic as the new cleanTitle in usaspending-scraper.ts
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

async function main() {
  const contracts = await prisma.contract.findMany();
  let updated = 0;

  for (const c of contracts) {
    const newTitle = cleanTitle(c.contractNumber || '', c.description || '');
    if (newTitle !== c.title) {
      await prisma.contract.update({
        where: { id: c.id },
        data: { title: newTitle },
      });
      updated++;
    }
  }

  console.log(`Regenerated titles: ${updated} updated out of ${contracts.length} total`);
  await prisma.$disconnect();
}

main().catch(console.error);
