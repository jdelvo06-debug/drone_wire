import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // SUNGUR — TURDEF press image (verified 200)
  const res = await prisma.system.updateMany({
    where: { name: { contains: 'sungur', mode: 'insensitive' } },
    data: {
      imageUrl: 'https://cdn.turdef.com/images/articles/1884/v1680216586/075eeac6_6452_4eec_a59a_905af6b150bd_5a2a9eab9b.jpg'
    }
  })
  console.log('Updated:', res.count)

  // Verify
  const sys = await prisma.system.findFirst({
    where: { name: { contains: 'sungur', mode: 'insensitive' } },
    select: { name: true, imageUrl: true }
  })
  console.log('Verified:', sys)
}

main().then(() => prisma.$disconnect())
