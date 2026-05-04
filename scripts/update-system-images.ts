import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const imageUpdates = [
  {
    slug: 'm-shorad',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2104/6612523/1000w_q95.jpg',
  },
  {
    slug: 'vampire',
    imageUrl: 'https://www.l3harris.com/sites/default/files/2024-06/ims-gos-eoir-effective-vampire1.jpg',
  },
  {
    slug: 'smartshooter',
    imageUrl: 'https://www.smart-shooter.com/wp-content/uploads/2021/01/SMASH-3000-1.png',
  },
  {
    slug: 'lpws',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2408/8661016/1000w_q95.jpg',
  },
  {
    slug: 'de-m-shorad',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2506/9107830/1000w_q95.jpg',
  },
  {
    slug: 'enforceair',
    imageUrl: 'https://d-fendsolutions.com/wp-content/uploads/EnforceAir-System-Banner-with-EA-PLUS-1.jpg',
  },
  {
    slug: 'iron-drone',
    imageUrl: 'https://www.airoboticsdrones.com/wp-content/uploads/main_pic.jpg',
  },
]

async function updateSystemImages() {
  console.log('Updating system images...\n')

  for (const update of imageUpdates) {
    try {
      const result = await prisma.system.update({
        where: { slug: update.slug },
        data: { imageUrl: update.imageUrl },
      })
      console.log(`✓ Updated: ${result.name}`)
    } catch (error) {
      console.log(`✗ Failed: ${update.slug} - System may not exist`)
    }
  }

  console.log('\n--- Update Complete ---')

  // Show summary of systems with images
  const systemsWithImages = await prisma.system.count({
    where: { imageUrl: { not: null } },
  })
  const totalSystems = await prisma.system.count()

  console.log(`Systems with images: ${systemsWithImages}/${totalSystems}`)
}

updateSystemImages()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
