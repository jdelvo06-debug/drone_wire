import { config } from 'dotenv'
config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const batch = [
  { match: 'Type 11', url: 'https://live.staticflickr.com/4667/39227773454_8c3a8d57bc_b.jpg' },
  { match: 'PARADE', url: 'https://www.nae.fr/wp-content/uploads/2022/05/Parade_visuel-1170x610-1-1080x610.jpg' }
]

async function main() {
  for (const sys of batch) {
    const existing = await prisma.system.findFirst({
      where: { name: { contains: sys.match, mode: 'insensitive' } },
      select: { slug: true, name: true }
    })
    if (!existing) { console.log(`NOT FOUND: ${sys.match}`); continue }
    await prisma.system.update({ where: { slug: existing.slug }, data: { imageUrl: sys.url } })
    const v = await prisma.system.findFirst({ where: { slug: existing.slug }, select: { name: true, imageUrl: true } })
    console.log(`Pushed: ${JSON.stringify(v)}`)
  }
  const count = await prisma.system.count({ where: { imageUrl: { not: null } } })
  const total = await prisma.system.count()
  console.log(`\nTOTAL: ${count}/${total} with images, ${total - count} null`)
  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
