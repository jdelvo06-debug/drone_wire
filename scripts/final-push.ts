import { config } from 'dotenv'
config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const res = await prisma.system.updateMany({
    where: { slug: 'bal-chatri' },
    data: { imageUrl: 'https://i.postimg.cc/tTv5N8d3/bal-chatri.png' }
  })
  console.log('Updated:', res.count)

  const v = await prisma.system.findFirst({
    where: { slug: 'bal-chatri' },
    select: { name: true, imageUrl: true }
  })
  console.log('Verified:', JSON.stringify(v))

  const total = await prisma.system.count()
  const withImgs = await prisma.system.count({ where: { imageUrl: { not: null } } })
  const nulls = await prisma.system.count({ where: { imageUrl: null } })
  console.log(`\nFINAL: ${withImgs}/${total} with images, ${nulls} null`)

  if (nulls === 0) console.log('✓ CLEAN SWEEP — 100% coverage')
  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
