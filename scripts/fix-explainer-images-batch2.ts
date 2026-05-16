import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const updates = [
  // --- Iron-Dome-USMC clones ---
  {
    slug: 'cuas-command-and-control-platforms',
    title: 'C-UAS Command and Control — The Brain of the Operation',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2506/9092748/1000w_q95.jpg',
    source: 'DVIDS — DedroneTracker C2 display for counter-drone operations',
  },
  {
    slug: 'naval-cuas-drone-defense-at-sea',
    title: 'Naval C-UAS — Drone Defense at Sea',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2401/8193137/1000w_q95.jpg',
    source: 'DVIDS — USS Mason destroyer watch in Red Sea, Operation Prosperity Guardian',
  },
  // --- NULL explainers ---
  {
    slug: 'ai-machine-learning-drone-detection',
    title: 'AI and Machine Learning in Drone Detection',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2604/9627810/1000w_q95.jpg',
    source: 'DVIDS — NPS low-cost AI-driven counter-drone technology',
  },
  {
    slug: 'directed-energy-weapons-cuas',
    title: 'Directed Energy Weapons for C-UAS',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7141613/1000w_q95.jpg',
    source: 'DVIDS — Target drone during high energy laser engagement, White Sands',
  },
  {
    slug: 'coyote-interceptor-deep-dive',
    title: 'Coyote Drone Interceptor Deep Dive',
    imageUrl: 'https://prd-sc102-cdn.rtx.com/raytheon/-/media/rtx/news-images/2026/02/block-2-launcha-1920x1080.jpg',
    source: 'RTX Raytheon — Coyote Block 2+ launch against drone swarm, 2026',
  },
  {
    slug: 'electronic-warfare-against-drones',
    title: 'Electronic Warfare Against Drones',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2505/9049667/1000w_q95.jpg',
    source: 'DVIDS — Soldiers train to counter drone threats with C-sUAS jammers',
  },
  {
    slug: 'drone-swarm-tactics-saturation',
    title: 'Drone Swarm Tactics and Saturation Attacks',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2511/9398623/1000w_q95.jpg',
    source: 'DVIDS — MFRC drone swarm demonstration',
  },
  {
    slug: 'shorad-revival-short-range-air-defense',
    title: 'SHORAD Revival: Short-Range Air Defense Returns',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/1909/5721034/1000w_q95.jpg',
    source: 'DVIDS — Counter UAS MMHEL, SHORAD integration',
  },
  {
    slug: 'allied-interoperability-cuas',
    title: 'Allied Interoperability in Counter-UAS',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2605/9666148/1000w_q95.jpg',
    source: 'DVIDS — NATO allied forces during SWORD 26 exercise, multinational C-UAS',
  },
  {
    slug: 'counter-fpv-tactics',
    title: 'Counter-FPV Tactics and Technology',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2604/9607299/1000w_q95.jpg',
    source: 'DVIDS — Soldiers testing Archer Block 1 FPV drone, counter-FPV operations',
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
    const old = existing.imageUrl || 'NULL'
    await prisma.explainer.update({ where: { slug }, data: { imageUrl } })
    console.log(`UPDATED: "${title}" (${source.split(' — ')[0]})`)
    updated++
  }

  const total = await prisma.explainer.count()
  const withImg = await prisma.explainer.count({ where: { imageUrl: { not: null } } })

  console.log(`\n--- Batch 2: Updated ${updated}, Failed ${failed} ---`)
  console.log(`Explainers: ${total} total, ${withImg} with images, ${total - withImg} null`)
}

main()
  .then(() => prisma.$disconnect().then(() => process.exit(0)))
  .catch((e) => { console.error(e); prisma.$disconnect().then(() => process.exit(1)) })
