import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  // Get all systems - look for ones that might be wrong
  const all = await prisma.system.findMany({
    select: { name: true, slug: true, imageUrl: true },
    orderBy: { name: 'asc' }
  })
  console.log(JSON.stringify(all, null, 2))
}
main().catch(console.error).finally(() => prisma.$disconnect())
