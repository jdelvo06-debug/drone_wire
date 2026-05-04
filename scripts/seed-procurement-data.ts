import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ProcurementData {
  slug: string
  trl: number
  trlLabel: string
  estimatedPriceRange: string
  procurementStatus: string
  ndaaCompliant: boolean
  targetSet: string
  defeatMechanism: string
  unitWeightKg?: number
  jiatf401Approved: boolean
}

const procurementData: ProcurementData[] = [
  {
    slug: 'dronebuster',
    trl: 9,
    trlLabel: 'Production (TRL 9)',
    estimatedPriceRange: '$60K–$80K/unit',
    procurementStatus: 'DoD contract; JIDO recommended; 2,500+ deployed worldwide',
    ndaaCompliant: true,
    targetSet: 'Group 1-2',
    defeatMechanism: 'EW (Jam + GNSS Spoof)',
    unitWeightKg: 3.2,
    jiatf401Approved: true,
  },
  {
    slug: 'dronegun-tactical',
    trl: 9,
    trlLabel: 'Production (TRL 9)',
    estimatedPriceRange: '$30K–$50K/unit',
    procurementStatus: 'COTS; NATO allies; Belgium €2.8M contract; 50+ countries',
    ndaaCompliant: false,
    targetSet: 'Group 1-2',
    defeatMechanism: 'EW (Jam)',
    unitWeightKg: 7.3,
    jiatf401Approved: false,
  },
  {
    slug: 'dronesentry-x',
    trl: 9,
    trlLabel: 'Production (TRL 8-9)',
    estimatedPriceRange: '$100K–$200K',
    procurementStatus: 'COTS; military contracts globally',
    ndaaCompliant: false,
    targetSet: 'Group 1-2',
    defeatMechanism: 'EW + Detection (RF/radar)',
    jiatf401Approved: false,
  },
  {
    slug: 'smartshooter',
    trl: 9,
    trlLabel: 'Production (TRL 9)',
    estimatedPriceRange: '$10K–$15K/sight',
    procurementStatus: 'U.S. Army adoption; UK MoD selected; SOCOM tested',
    ndaaCompliant: false,
    targetSet: 'Group 1',
    defeatMechanism: 'Kinetic (AI fire-control sight)',
    unitWeightKg: 1.2,
    jiatf401Approved: false,
  },
  {
    slug: 'enforceair',
    trl: 9,
    trlLabel: 'Production (TRL 9)',
    estimatedPriceRange: '$200K–$400K/system',
    procurementStatus: 'JIATF-401 approved (fmr. JCO); FAA use; Secret Service use',
    ndaaCompliant: false,
    targetSet: 'Group 1-2',
    defeatMechanism: 'RF Cyber-Takeover (non-jamming)',
    unitWeightKg: 15.0,
    jiatf401Approved: true,
  },
  {
    slug: 'coyote-block-2',
    trl: 9,
    trlLabel: 'Production (TRL 9)',
    estimatedPriceRange: '$80K–$100K/round',
    procurementStatus: 'U.S. Army LRIP; 4,574 interceptors ordered',
    ndaaCompliant: true,
    targetSet: 'Group 1-2',
    defeatMechanism: 'Kinetic (tube-launched interceptor)',
    jiatf401Approved: true,
  },
  {
    slug: 'coyote-block-3',
    trl: 8,
    trlLabel: 'LRIP (TRL 7-8)',
    estimatedPriceRange: 'Lower cost (reusable)',
    procurementStatus: 'Army tested Feb 2026; swarm defeat demonstrated',
    ndaaCompliant: true,
    targetSet: 'Group 1-2',
    defeatMechanism: 'EW (Non-kinetic airborne effector)',
    jiatf401Approved: false,
  },
  {
    slug: 'roadrunner',
    trl: 8,
    trlLabel: 'Production (TRL 7-8)',
    estimatedPriceRange: '$100K–$250K est.',
    procurementStatus: 'SOCOM interest; rapid acquisition',
    ndaaCompliant: true,
    targetSet: 'Group 1-2',
    defeatMechanism: 'Kinetic (Autonomous interceptor)',
    jiatf401Approved: false,
  },
  {
    slug: 'dronehunter-f700',
    trl: 9,
    trlLabel: 'Production (TRL 8-9)',
    estimatedPriceRange: '$100K–$200K/unit',
    procurementStatus: 'Multiple DoD contracts; integrated with SkyDome',
    ndaaCompliant: true,
    targetSet: 'Group 1-3',
    defeatMechanism: 'Kinetic (Autonomous interceptor w/ net capture)',
    jiatf401Approved: false,
  },
  {
    slug: 'leonidas',
    trl: 9,
    trlLabel: 'Production (TRL 8-9)',
    estimatedPriceRange: '$10M+ per system',
    procurementStatus: 'U.S. Army IFPC-HPM; material release 2025; defeats fiber-optic drones',
    ndaaCompliant: true,
    targetSet: 'Group 1-2+ (swarm capable)',
    defeatMechanism: 'Directed Energy (High-Power Microwave)',
    jiatf401Approved: true,
  },
  {
    slug: 'pulsar',
    trl: 8,
    trlLabel: 'Production (TRL 7-8)',
    estimatedPriceRange: '$100K–$250K est.',
    procurementStatus: 'SOCOM interest; rapid acquisition program',
    ndaaCompliant: true,
    targetSet: 'Group 1-2',
    defeatMechanism: 'EW (Software-defined detect/ID/track/defeat)',
    unitWeightKg: 11.0,
    jiatf401Approved: false,
  },
  {
    slug: 'dronedefender',
    trl: 9,
    trlLabel: 'Production (TRL 9)',
    estimatedPriceRange: '$30K–$50K',
    procurementStatus: 'DoD deployed; earlier generation system',
    ndaaCompliant: true,
    targetSet: 'Group 1',
    defeatMechanism: 'EW (Jam)',
    unitWeightKg: 6.8,
    jiatf401Approved: false,
  },
  {
    slug: 'drone-dome',
    trl: 9,
    trlLabel: 'Production (TRL 9)',
    estimatedPriceRange: '$1M+ (full system)',
    procurementStatus: 'UK MoD operational; DoD recommended; G7 summit protection',
    ndaaCompliant: false,
    targetSet: 'Group 1-3',
    defeatMechanism: 'EW + Laser + Detection',
    jiatf401Approved: true,
  },
  {
    slug: 'dedronetracker',
    trl: 8,
    trlLabel: 'Production (TRL 8)',
    estimatedPriceRange: '$50K–$100K',
    procurementStatus: 'Axon acquisition Oct 2024; NATO partnership',
    ndaaCompliant: true,
    targetSet: 'Group 1-2',
    defeatMechanism: 'EW (AI-powered smart jammer)',
    jiatf401Approved: false,
  },
  {
    slug: 'helws',
    trl: 8,
    trlLabel: 'Production (TRL 8)',
    estimatedPriceRange: 'Classified',
    procurementStatus: 'U.S. Army prototype; Fort Sill testing',
    ndaaCompliant: true,
    targetSet: 'Group 1-2',
    defeatMechanism: 'Directed Energy (High-Energy Laser)',
    jiatf401Approved: false,
  },
  {
    slug: 'phaser',
    trl: 9,
    trlLabel: 'Production (TRL 9)',
    estimatedPriceRange: 'Classified',
    procurementStatus: 'AFRL developed; Kirtland AFB tested; USAF interest',
    ndaaCompliant: true,
    targetSet: 'Group 1-2 (swarm)',
    defeatMechanism: 'Directed Energy (High-Power Microwave)',
    jiatf401Approved: false,
  },
]

async function main() {
  console.log('Seeding procurement intelligence data...\n')

  let updated = 0
  let notFound = 0

  for (const data of procurementData) {
    const { slug, ...fields } = data
    const result = await prisma.system.updateMany({
      where: { slug },
      data: fields,
    })

    if (result.count > 0) {
      console.log(`  Updated: ${slug}`)
      updated++
    } else {
      console.log(`  Not found: ${slug}`)
      notFound++
    }
  }

  console.log(`\nDone. Updated: ${updated}, Not found: ${notFound}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
