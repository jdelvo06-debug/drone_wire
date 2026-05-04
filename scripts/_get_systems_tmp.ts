
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const systems = await prisma.system.findMany({
    where: { imageUrl: { not: null } },
    select: { slug: true, name: true, imageUrl: true },
    orderBy: { name: 'asc' }
  })
  console.log(JSON.stringify(systems))
  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
