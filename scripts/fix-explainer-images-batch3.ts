import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const updates = [
  {
    slug: 'kinetic-defeat-interceptor-systems',
    title: 'Kinetic Defeat: Interceptor Drones and Missiles',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2504/8998477/1000w_q95.jpg',
    source: 'DVIDS — APKWS II/C-UAS kinetic intercept test',
  },
  {
    slug: 'loitering-munitions-kamikaze-drones',
    title: 'Loitering Munitions — The Kamikaze Drone',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2109/6830211/1000w_q95.jpg',
    source: 'DVIDS — NINJA counter-drone system, loitering munition defense concept',
  },
  {
    slug: 'multi-layered-air-defense-drones',
    title: 'Multi-Layered Air Defense Against Drones',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2401/8189236/1000w_q95.jpg',
    source: 'DVIDS — THAAD deployment, layered missile defense',
  },
  {
    slug: 'iranian-drone-proliferation',
    title: 'Iranian Drone Proliferation',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2211/7524106/1000w_q95.jpg',
    source: 'DVIDS — Iranian Shahed-136 UAV debris, confirmed link to drone attack',
  },
  {
    slug: 'dod-cuas-strategy-joint-doctrine',
    title: 'DoD Counter-UAS Strategy and Joint Doctrine',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2305/7801988/1000w_q95.jpg',
    source: 'DVIDS — Pentagon aerial view, DoD headquarters',
  },
  {
    slug: 'jiatf-401-pentagons-counter-drone-authority',
    title: 'JIATF-401: The Pentagon\'s New Counter-Drone Authority',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2604/9597745/1000w_q95.jpg',
    source: 'DVIDS — U.S. forces conduct air defense operations, Operation Epic Fury 2026',
  },
  {
    slug: 'fpv-drone-warfare',
    title: 'FPV Drone Warfare',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2602/9538153/1000w_q95.jpg',
    source: 'DVIDS — Counter-UAS FPV drone warfare training',
  },
  {
    slug: 'radar-drone-detection',
    title: 'How Radar Works for Drone Detection',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/1909/5721034/1000w_q95.jpg',
    source: 'DVIDS — Counter UAS MMHEL radar detection system',
  },
]

async function main() {
  let updated = 0
  let failed = 0

  for (const { slug, title, imageUrl, source } of updates) {
    const existing = await prisma.explainer.findUnique({ where: { slug } })
    if (!existing) {
      console.log(`NOT FOUND: "${title}" (${slug})`)
      failed++
      continue
    }
    await prisma.explainer.update({ where: { slug }, data: { imageUrl } })
    console.log(`UPDATED: "${title}" (${source.split(' — ')[0]})`)
    updated++
  }

  const total = await prisma.explainer.count()
  const withImg = await prisma.explainer.count({ where: { imageUrl: { not: null } } })

  console.log(`\n--- Batch 3: Updated ${updated}, Failed ${failed} ---`)
  console.log(`Explainers: ${total} total, ${withImg} with images, ${total - withImg} null`)
}

main()
  .then(() => prisma.$disconnect().then(() => process.exit(0)))
  .catch((e) => { console.error(e); prisma.$disconnect().then(() => process.exit(1)) })
