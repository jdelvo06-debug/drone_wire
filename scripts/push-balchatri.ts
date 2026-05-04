import { config } from 'dotenv'
config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const r = await prisma.system.updateMany({
    where: { slug: 'bal-chatri' },
    data: { imageUrl: '/images/systems/bal-chatri.png' }
  })
  console.log('Updated:', r.count)
  
  const v = await prisma.system.findFirst({ where: { slug: 'bal-chatri' }, select: { name: true, imageUrl: true } })
  console.log('Verified:', JSON.stringify(v))
  
  const withImg = await prisma.system.count({ where: { imageUrl: { not: null } } })
  const total = await prisma.system.count()
  console.log(`\nDB: ${withImg}/${total} — ${total - withImg} null`)
  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
