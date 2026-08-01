import { config } from 'dotenv'
config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.system.update({
    where: { slug: 'bal-chatri' },
    data: { imageUrl: 'https://dronewire.org/bal-chatri.png' }
  })

  const v = await prisma.system.findFirst({
    where: { slug: 'bal-chatri' },
    select: { name: true, imageUrl: true }
  })
  console.log('Updated to:', v?.imageUrl)

  const total = await prisma.system.count()
  const withImgs = await prisma.system.count({ where: { imageUrl: { not: null } } })
  console.log(`FINAL: ${withImgs}/${total} — 100%`)
  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
