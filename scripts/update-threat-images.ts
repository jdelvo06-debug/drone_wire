import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const threatImages: Record<string, string> = {
  'shahed-136': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Military_equipment_displayed_for_the_44th_Iranian_revolution_anniversary_rally_-_Shahed_136.jpg',
  'shahed-131': 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Shahed-131_retrieved_by_the_US_military.jpg',
  'shahed-238': 'https://upload.wikimedia.org/wikipedia/commons/7/73/August_2024_National_Aerospace_Park_tour_for_journalists_%2820%29.jpg',
  'lancet-3': 'https://upload.wikimedia.org/wikipedia/commons/1/1c/ZALA_Lancet_at_IDEX_2025.jpg',
  'orlan-10': 'https://upload.wikimedia.org/wikipedia/commons/7/76/UAV_Orlan-10.JPG',
  'zala-421-16e': 'https://upload.wikimedia.org/wikipedia/commons/9/91/ZALA_421-16E_Army-2022_2022-08-20_2390.jpg',
  'eleron-3': 'https://upload.wikimedia.org/wikipedia/commons/2/22/Eleron-3_-_IDELF-2008-197.jpg',
  'kub-bla': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/KUB-E_loitering_munition_at_IDEX_2023.jpg',
  'weaponized-fpv-drones': 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2505/9066503/1000w_q95.jpg',
  'mugin-5-pro': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Small_and_large_UAV_with_satcom.jpg',
  'mohajer-6': 'https://upload.wikimedia.org/wikipedia/commons/3/35/8-%28Drone_Mohajer_6-_Army_ground_force%29-%D9%BE%D9%87%D9%BE%D8%A7%D8%AF_%D9%85%D9%87%D8%A7%D8%AC%D8%B1_6-_%D9%86%DB%8C%D8%B1%D9%88%DB%8C_%D8%B2%D9%85%DB%8C%D9%86%DB%8C_%D8%A7%D8%B1%D8%AA%D8%B4.jpg',
  'ababil-3': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Ababil-3_in_flight.jpg',
  'bayraktar-tb2': 'https://upload.wikimedia.org/wikipedia/commons/6/62/Bayraktar_TB2_S-IHA_TurkishArmy_Teknofest2021_%282%29.jpg',
  'wing-loong-ii': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Wing_Loong_II_fron_view.jpg',
  'ch-4b': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/CH-4B_Indonesian_Air_Force_79th_Armed_Forces_Day_parade_2024_%281%29.jpg',
}

async function main() {
  console.log('Updating threat system images...\n')

  for (const [slug, imageUrl] of Object.entries(threatImages)) {
    try {
      const result = await prisma.system.update({
        where: { slug },
        data: { imageUrl },
      })
      console.log(`✓ ${result.name} (${slug})`)
    } catch (error: any) {
      if (error.code === 'P2025') {
        console.log(`✗ ${slug} — not found in database, skipping`)
      } else {
        console.error(`✗ ${slug} — error: ${error.message}`)
      }
    }
  }

  console.log('\nDone!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
