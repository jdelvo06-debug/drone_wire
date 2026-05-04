// One-shot: push SUNGUR image
import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const res = await prisma.system.updateMany({
    where: { name: { contains: 'sungur', mode: 'insensitive' } },
    data: { imageUrl: 'https://cdn.turdef.com/images/articles/1884/v1680216586/075eeac6_6452_4eec_a59a_905af6b150bd_5a2a9eab9b.jpg' }
  })
  console.log('Updated:', res.count)

  const sys = await prisma.system.findFirst({
    where: { name: { contains: 'sungur', mode: 'insensitive' } },
    select: { name: true, imageUrl: true }
  })
  console.log('Verified:', JSON.stringify(sys))
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
