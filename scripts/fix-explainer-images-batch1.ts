import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const updates = [
  {
    slug: 'civilian-airport-drone-defense',
    title: 'Civilian Airport Drone Defense',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2502/8857967/1000w_q95.jpg',
    source: 'DVIDS — SMDC radar team supporting C-UAS mission at Yuma Proving Ground',
  },
  {
    slug: 'drone-classification-groups-1-through-5',
    title: 'Drone Classification — Groups 1 through 5',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/UAV_Comparison.jpg',
    source: 'Wikimedia Commons — UAV size comparison chart (public domain)',
  },
  {
    slug: 'laser-weapon-systems',
    title: 'Laser Weapon Systems (LAWS)',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7141613/1000w_q95.jpg',
    source: 'DVIDS — Target drone during high energy laser engagement, White Sands Missile Range',
  },
  {
    slug: 'non-kinetic-defeat-spoofing-cyber',
    title: 'Non-Kinetic Defeat — GPS Spoofing, Protocol Manipulation, and Cyber Takedowns',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2603/9552220/1000w_q95.jpg',
    source: 'DVIDS — Digital Shield event, counter-drone electronic warfare demonstration, Estonia',
  },
  {
    slug: 'red-teaming-adversarial-drone-testing',
    title: 'Red Teaming — How Adversarial Drone Testing Makes C-UAS Better',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2605/9662979/1000w_q95.jpg',
    source: 'DVIDS — Project Flytrap force-on-force C-UAS testing, Lithuania May 2026',
  },
  {
    slug: 'counter-uas-policy-framework',
    title: 'Counter-UAS Policy Framework',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2502/8863170/1000w_q95.jpg',
    source: 'DVIDS — Titan C-UAS defense system, Exercise NEXUS FORGE, Schofield Barracks',
  },
  {
    slug: 'drone-swarm-attack-tactics',
    title: 'Drone Swarm Attack Tactics',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2603/9592718/1000w_q95.jpg',
    source: 'DVIDS — XVIII Airborne Corps drone swarm demonstration',
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
    await prisma.explainer.update({
      where: { slug },
      data: { imageUrl },
    })
    console.log(`UPDATED: "${title}"`)
    console.log(`  old: ${old}`)
    console.log(`  new: ${imageUrl}`)
    console.log(`  src: ${source}`)
    console.log('')
    updated++
  }

  console.log(`---`)
  console.log(`Updated: ${updated}, Failed: ${failed}`)

  // Show final counts
  const total = await prisma.explainer.count()
  const withImg = await prisma.explainer.count({
    where: { imageUrl: { not: null } },
  })
  console.log(`\nExplainers: ${total} total, ${withImg} with images, ${total - withImg} null`)
}

main()
  .then(() => prisma.$disconnect().then(() => process.exit(0)))
  .catch((e) => {
    console.error(e)
    prisma.$disconnect().then(() => process.exit(1))
  })
