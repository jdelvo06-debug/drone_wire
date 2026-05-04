import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const systems = await prisma.system.findMany({
    where: { name: { in: ['SkyHunter', 'bal-chatri', 'Bal-Chatri', 'Drake', 'AI'] } },
    select: { id: true, name: true, slug: true, imageUrl: true }
  })
  // Also get all systems with imageUrl set
  const all = await prisma.system.findMany({
    where: { imageUrl: { not: null } },
    select: { name: true, slug: true, imageUrl: true },
    orderBy: { name: 'asc' }
  })
  console.log('=== SPECIFIC ===')
  console.log(JSON.stringify(systems, null, 2))
  console.log('\n=== ALL WITH IMAGES ===')
  console.log(`Total: ${all.length}`)
}
main().catch(console.error).finally(() => prisma.$disconnect())
