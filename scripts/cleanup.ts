import { config } from 'dotenv'
config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const KEEPERS = ['bal-chatri'] // keep

async function main() {
  // Get all null-image systems
  const nulls = await prisma.system.findMany({
    where: { imageUrl: null },
    select: { slug: true, name: true, manufacturer: true, country: true }
  })
  
  const toDelete = nulls.filter(s => !KEEPERS.includes(s.slug))
  
  console.log(`Keeping: Bal Chatri`)
  console.log(`Deleting ${toDelete.length}:\n`)
  toDelete.forEach(s => console.log(`  ✕ ${s.name} (${s.manufacturer || '?'}, ${s.country || '?'})`))
  
  // Execute
  const slugs = toDelete.map(s => s.slug)
  const result = await prisma.system.deleteMany({
    where: { slug: { in: slugs } }
  })
  
  console.log(`\nDeleted: ${result.count}`)
  
  // Final count
  const remaining = await prisma.system.count()
  const withImages = await prisma.system.count({ where: { imageUrl: { not: null } } })
  console.log(`\nDB now: ${remaining} total, ${withImages} with images, ${remaining - withImages} null`)
  
  // Show what's left null
  const stillNull = await prisma.system.findMany({
    where: { imageUrl: null },
    select: { name: true }
  })
  if (stillNull.length) {
    console.log(`\nStill null: ${stillNull.map(s => s.name).join(', ')}`)
  } else {
    console.log(`\n✓ Zero null-image systems remaining.`)
  }
  
  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
