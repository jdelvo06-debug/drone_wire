/**
 * Verified System Image Update Script
 *
 * Updates system imageUrls in the database after verifying each URL returns HTTP 200.
 * Every system gets a UNIQUE image URL — no duplicates allowed.
 * Systems without a verified URL are set to null (category icon fallback).
 *
 * Usage: npx tsx scripts/update-system-images-verified.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function dvids(yymm: string, id: string): string {
  return `https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/${yymm}/${id}/1000w_q95.jpg`
}

// Each system slug mapped to a UNIQUE image URL.
// Sources: DVIDS (dvidshub.net), Raytheon/RTX press, manufacturer sites.
const IMAGE_MAP: Record<string, string | null> = {
  // ── US Integrated Systems ──────────────────────────────────────────
  'fs-lids':
    'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/what-we-do/advanced-technology/counter-uas/photo-gallery/fs_lids-coyote-0922-stmt-a-peo-22-216_16x9.jpg',
  'm-lids':
    'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/rmd/what-we-do/counter-uas/photo-gallery/mlids-coyote-launch-09-22-stmt-a-peo-22-216_16x9.jpg',
  'madis': dvids('2501', '8842589'),
  'l-madis': dvids('2407', '8557798'),
  'm-shorad': dvids('2104', '6612523'),
  'de-m-shorad': dvids('2506', '9107830'),
  'vampire': dvids('1804', '4274524'),
  'lpws': dvids('2408', '8661016'),

  // ── US Sensors ─────────────────────────────────────────────────────
  'kurfs':
    'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/what-we-do/counter-uas/sensors/ku-band-radio-frequency-system/450277_mlids_-00066-stmt-a-2022-070_16x9.jpg',
  'lstar': dvids('1908', '5643452'),
  'gator': dvids('2310', '8053964'),
  'droneshield-rfpatrol': dvids('2506', '9092756'),
  'wescam-mx-15d': dvids('1902', '5139655'), // WESCAM turret maintenance at Fleet Readiness Center

  // ── US Effectors ───────────────────────────────────────────────────
  'coyote-block-2':
    'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/rmd/what-we-do/counter-uas/2020-02/images/coyote_hero.jpg',
  'coyote-block-3':
    'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/what-we-do/counter-uas/photo-gallery/coyote-21-peo-23-264-1920x1080.jpg',
  'thor': dvids('2603', '9574959'), // Counter UAS Battery Activation
  'dronedefender': dvids('2106', '6702930'),
  'ninja': dvids('1707', '3566022'),
  'apkws-ii': dvids('2504', '8998477'),
  'dronebuster': dvids('2204', '7143773'),
  'drake': dvids('1510', '2246276'),
  'stinger-fim-92': dvids('2305', '7783422'),
  'xm914-chain-gun': dvids('2404', '8334521'),
  'odin': dvids('2201', '7017559'),
  'helws': dvids('2003', '6150720'),
  'phaser':
    'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/rmd/what-we-do/counter-uas/effectors/phaser-high-power-microwave-system/2020-02/images/phaser_high_powered_hero_lg_0.jpg',
  'dronehunter-f700': dvids('2503', '8939726'),
  'nightfighter-s': dvids('2108', '6766080'),
  'bal-chatri': dvids('2205', '7169412'),
  'modi': dvids('2504', '8998140'),
  'alps': dvids('2312', '8164058'),
  'ifpc-hpm': dvids('2505', '9006618'), // IFPC-HPM briefing during Balikatan 2025
  'ifpc-increment-2': dvids('2305', '7788895'),
  'corian': dvids('2302', '7624897'),
  'corvus-raven': dvids('2404', '8335966'),

  // ── US C2 Systems ──────────────────────────────────────────────────
  'faad-c2': dvids('2307', '7917490'), // FAAD C2 at U.S. Army Fires Center of Excellence Fort Sill
  'ibcs': dvids('2312', '8164010'), // Integrated Battle Command System Redstone Arsenal
  'medusa-c2': dvids('2504', '9004625'), // Air Force TOC-L enhances joint force C2
  'adsi': dvids('2102', '6507229'), // IAMD Battle Command System test White Sands
  'toc-l': dvids('2306', '7837924'),

  // ── US Autonomous / AI ─────────────────────────────────────────────
  'aion': dvids('2511', '9380412'), // Anvil interceptor launch, USNORTHCOM C-sUAS kit
  'lattice': dvids('2511', '9380405'), // Anvil from Lattice-controlled C-sUAS kit Minot AFB
  'maven-smart-system': dvids('2603', '9552226'), // Digital Shield counter-drone tech Estonia
  'roadrunner': dvids('2509', '9334599'), // Anduril Anvil effector during Falcon Peak 25
  'pulsar': dvids('2511', '9380389'), // Pulsar unit single-core assembly at Minot AFB
  'mric': dvids('2401', '8200207'), // MRIC static display Marine Corps Base Quantico

  // ── US Other ───────────────────────────────────────────────────────
  'skyhunter': dvids('2509', '9326581'), // Falcon Peak 25.2 C-UAS tech demo
  'dedronetracker': dvids('2603', '9552233'), // Digital Shield counter-drone NATO
  'reactor': dvids('2509', '9296380'), // Operation Return of Condor C-UAS testing
  'sting': dvids('2511', '9398161'),
  'as3-surveyor': dvids('2506', '9090346'),

  // ── Israeli Systems ────────────────────────────────────────────────
  'iron-dome': dvids('2108', '6798384'), // Iron Dome test [Image 4 of 10]
  'drone-dome': null, // Israeli Rafael system — no verified DVIDS photo available
  'iron-beam': dvids('1412', '1680542'),
  'smartshooter': dvids('2604', '9593823'), // 2nd LAAD SMASH 2000L range Camp Lejeune
  'iron-drone': dvids('2507', '9199404'), // 1st AD showcases FPV drone tech
  'enforceair': null, // Israeli D-Fend commercial product — no DVIDS

  // ── Australian (DroneShield) Systems ───────────────────────────────
  'dronegun-tactical': dvids('2507', '9177628'), // Soldier takes down UAS with DroneGun Mk4
  'dronesentry-c2': dvids('2509', '9296388'), // DroneSentry on LMTV, Operation Return of Condor
  'dronesentry-x': dvids('2509', '9296375'), // Counter-drone testing equipment Fort Hood
  'droneoptid': dvids('2509', '9296384'), // DroneShield C-UAS industry testing Fort Hood

  // ── European Systems ───────────────────────────────────────────────
  // These are primarily non-US systems with limited DVIDS coverage.
  // Set to null — the admin UI will show category icon fallback.
  'parade': null, // French PARADE — no unique DVIDS photo
  'mantis': null, // German MANTIS — no unique DVIDS photo
  'falcon-shield': dvids('2603', '9552222'), // Counter-drone system at Digital Shield Estonia
  'jey-cuas': null, // EU Joint European — no unique DVIDS photo
  'boreades': null, // French BOREADES — no unique DVIDS photo
  'airguard': null, // German Hensoldt product — no DVIDS coverage
  'thundershield': null, // French ThunderShield — no unique DVIDS photo
  'giraffe-1x': null, // Swedish Saab — no unique DVIDS photo

  // ── UK/Other ───────────────────────────────────────────────────────
  'crow': null, // UK/Spain — no unique DVIDS photo
  'orcus': null, // UK/Spain ORCUS — no unique DVIDS photo
  'leonidas': dvids('2603', '9574502'), // Counter UAS Battery Activation [Image 1]
}

async function verifyUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    })
    clearTimeout(timeout)
    return res.status === 200
  } catch {
    return false
  }
}

async function main() {
  console.log('=== Verified System Image Update ===\n')

  const slugs = Object.keys(IMAGE_MAP)
  console.log(`Total systems in map: ${slugs.length}\n`)

  // Check for duplicate URLs
  const urlToSlugs = new Map<string, string[]>()
  for (const [slug, url] of Object.entries(IMAGE_MAP)) {
    if (url) {
      const existing = urlToSlugs.get(url) || []
      existing.push(slug)
      urlToSlugs.set(url, existing)
    }
  }

  const dupes = [...urlToSlugs.entries()].filter(([, s]) => s.length > 1)
  if (dupes.length > 0) {
    console.log('ERROR: Duplicate URLs detected:')
    for (const [url, systems] of dupes) {
      console.log(`  ${url}`)
      console.log(`    Used by: ${systems.join(', ')}`)
    }
    process.exit(1)
  }

  console.log('No duplicate URLs found.\n')

  // Verify and update
  let verified = 0
  let skipped = 0
  let nulled = 0
  const warnings: string[] = []

  for (const [slug, url] of Object.entries(IMAGE_MAP)) {
    if (url === null) {
      // Set to null (remove image)
      await prisma.system.update({
        where: { slug },
        data: { imageUrl: null },
      })
      nulled++
      console.log(`  [NULL]  ${slug}`)
      continue
    }

    const ok = await verifyUrl(url)
    if (ok) {
      await prisma.system.update({
        where: { slug },
        data: { imageUrl: url },
      })
      verified++
      console.log(`  [  OK]  ${slug}`)
    } else {
      warnings.push(`${slug}: ${url}`)
      skipped++
      console.log(`  [SKIP]  ${slug} — URL returned non-200`)
    }
  }

  console.log('\n=== Summary ===')
  console.log(`  Verified & updated: ${verified}`)
  console.log(`  Set to null:        ${nulled}`)
  console.log(`  Skipped (failed):   ${skipped}`)
  console.log(`  Total processed:    ${slugs.length}`)

  if (warnings.length > 0) {
    console.log('\nWarnings — these URLs failed HEAD check:')
    for (const w of warnings) {
      console.log(`  ⚠ ${w}`)
    }
  }

  console.log('\nDone.')
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('Fatal error:', err)
  prisma.$disconnect()
  process.exit(1)
})
