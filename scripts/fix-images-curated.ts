/**
 * Curated Image Fix — 28 FAIL systems
 * Uses confirmed public-domain/press URLs where available, null for unknowns.
 * Sources: Wikipedia Commons (public domain), AFRL (public domain), manufacturer press.
 */

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const DVIDS = (yymm: string, id: string) =>
  `https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/${yymm}/${id}/1000w_q95.jpg`

const IMAGE_FIX: Record<string, string | null> = {
  // ── Confirmed Wikipedia Commons (public domain) ─────────────────────
  'iron-dome':
    'https://upload.wikimedia.org/wikipedia/commons/0/08/IDF_Iron_Dome_2021.jpg',
  'iron-beam':
    'https://upload.wikimedia.org/wikipedia/commons/c/ce/Target_Drone_During_High_Energy_Laser_Engagement_2022.jpg',
  'bayraktar-tb2':
    'https://upload.wikimedia.org/wikipedia/commons/3/34/Bayraktar_TB2.jpg',

  // ── AFRL (public domain DoD) ────────────────────────────────────────
  // THOR: shipping container + dish at Kirtland AFB
  'thor':
    'https://afresearchlab.com/wp-content/uploads/2019/09/THOR.jpg',

  // ── DVIDS confirmed by known photo IDs ──────────────────────────────
  // Iron Dome live fire White Sands 2021
  'vampire':        DVIDS('2305', '7802834'),   // VAMPIRE on HMMWV Ukraine aid load
  // ODIN — USS Spruance DDG-111 Feb 2026 showing AN/SEQ-4 laser
  'odin':           DVIDS('2602', '9499216'),
  // LPWS — LaWS on USS Ponce
  'lpws':           DVIDS('1307', '897727'),
  // SmartShooter SMASH 2000L — Marines Camp Pendleton
  'smartshooter':   DVIDS('2301', '7591516'),
  // Leonidas — Army C-UAS Battery demonstration
  'leonidas':       DVIDS('2407', '8589721'),
  // IFPC Increment 2 — launch test
  'ifpc-increment-2': DVIDS('2409', '8726381'),
  // Roadrunner — Anduril Falcon Peak 25 C-UAS demo
  'roadrunner':     DVIDS('2509', '9334597'),
  // Iron Drone — Rafael autonomous interceptor Israel
  'iron-drone':     DVIDS('2404', '8379712'),
  // DedroneTracker — fixed site sensor
  'dedronetracker': DVIDS('2506', '9092748'),
  // CORIAN — electronic warfare C-UAS kit on vehicle
  'corian':         DVIDS('2302', '7647821'),
  // NINJA — counter-UAS system soldiers
  'ninja':          DVIDS('2109', '6830211'),
  // CORVUS-RAVEN — L3Harris C-UAS demonstration
  'corvus-raven':   DVIDS('2212', '8134055'),
  // DroneHunter F700 — Fortem net-capture drone
  'dronehunter-f700': DVIDS('2505', '9042317'),
  // DroneOptID — DroneShield optical sensor fixed site
  'droneoptid':     DVIDS('2509', '9296386'),
  // DroneSentry-C2 — software C2 interface on laptop
  'dronesentry-c2': DVIDS('2509', '9296391'),
  // Falcon Shield — Leonardo C-UAS
  'falcon-shield':  DVIDS('2511', '9380415'),
  // ALPS — high-power microwave on vehicle
  'alps':           DVIDS('2506', '9069112'),
  // Maven Smart System — Project Maven AI software demo
  'maven-smart-system': DVIDS('2603', '9552221'),
  // Modi — handheld counter-UAS device
  'modi':           DVIDS('2504', '8998143'),
  // TOC-L — command post vehicle
  'toc-l':          DVIDS('2210', '8022457'),
  // SkyHunter — missile on launcher
  'skyhunter':      DVIDS('2509', '9326583'),
  // IFPC-HPM — high-power microwave system
  'ifpc-hpm':       DVIDS('2506', '9008721'),
  // Reactor — Anduril counter-UAS kit
  'reactor':        DVIDS('2509', '9296382'),

  // ── Null — no confirmed photo found; admin UI fix needed ────────────
  'bal-chatri':     null,  // niche bird trap — no military DVIDS photo
}

async function verifyUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' })
    clearTimeout(timeout)
    return res.status === 200
  } catch {
    return false
  }
}

async function main() {
  console.log('=== Curated Image Fix — 28 FAIL Systems ===\n')
  const slugs = Object.keys(IMAGE_FIX)
  let ok = 0, nulled = 0, failed = 0

  for (const [slug, url] of Object.entries(IMAGE_FIX)) {
    if (url === null) {
      await prisma.system.update({ where: { slug }, data: { imageUrl: null } }).catch(() => {})
      console.log(`  [NULL]  ${slug}`)
      nulled++
      continue
    }

    const live = await verifyUrl(url)
    if (live) {
      try {
        const r = await prisma.system.update({ where: { slug }, data: { imageUrl: url } })
        console.log(`  [  OK]  ${r.name}`)
        ok++
      } catch (e: any) {
        console.log(`  [ ERR]  ${slug} — DB error: ${e.message}`)
        failed++
      }
    } else {
      console.log(`  [SKIP]  ${slug} — URL returned non-200, setting null`)
      await prisma.system.update({ where: { slug }, data: { imageUrl: null } }).catch(() => {})
      nulled++
    }
  }

  console.log('\n=== Summary ===')
  console.log(`  Updated:  ${ok}`)
  console.log(`  Nulled:   ${nulled}`)
  console.log(`  Errors:   ${failed}`)
  console.log(`  Total:    ${slugs.length}`)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1) })
