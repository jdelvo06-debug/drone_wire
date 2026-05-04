/**
 * Seed contracts from USASpending.gov — wipes ghost data, populates real awards.
 * Run: npx tsx --require dotenv/config scripts/seed-contracts.ts
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import { scrapeContracts } from '../lib/services/usaspending-scraper'

const prisma = new PrismaClient()

async function main() {
  // 1. Wipe ghost contracts ($0 or TBD)
  const ghostCount = await prisma.contract.count({
    where: {
      OR: [
        { value: 0 },
        { company: 'TBD' },
      ],
    },
  })
  console.log(`Ghost contracts to purge: ${ghostCount}`)

  const deleted = await prisma.contract.deleteMany({
    where: {
      OR: [
        { value: 0 },
        { company: 'TBD' },
      ],
    },
  })
  console.log(`Deleted: ${deleted.count}`)

  // 2. Scrape real contracts from USASpending.gov
  console.log('\nScraping USASpending.gov...')
  const result = await scrapeContracts()

  console.log(`\n── Results ──`)
  console.log(`  Added:   ${result.contractsAdded}`)
  console.log(`  Updated: ${result.contractsUpdated}`)
  console.log(`  Skipped: ${result.contractsSkipped}`)
  if (result.errors.length > 0) {
    console.log(`  Errors:  ${result.errors.length}`)
    result.errors.forEach((e) => console.log(`    ⚠ ${e}`))
  }

  // 3. Final count
  const total = await prisma.contract.count()
  console.log(`\nTotal contracts in DB: ${total}`)

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
