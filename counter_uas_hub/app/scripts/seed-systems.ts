import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface SystemData {
  name: string
  slug: string
  description: string
  category: string
  manufacturer: string
  country: string
  status: string
  primaryCapability: string
  specifications?: string[]
  platforms?: string[]
  deployedBy?: string[]
  inServiceDate?: string
  detectionRange?: string
  effectiveRange?: string
  whatItIs?: string
  howItWorks?: string
  keyFeatures?: string[]
  advantages?: string[]
  disadvantages?: string[]
  combatRecord?: string
  relatedSystems?: string[]
  featured?: boolean
  content: string
  imageUrl?: string
}

const systemsData: SystemData[] = [
  // INTEGRATED SYSTEMS
  {
    name: 'FS-LIDS',
    slug: 'fs-lids',
    description: 'Fixed-Site Low, Slow, Small UAS Integrated Defeat System - the US Army primary fixed-site counter-UAS solution providing comprehensive detection, tracking, and defeat capabilities.',
    category: 'integrated',
    manufacturer: 'SRC Inc.',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Integrated detection, tracking, and defeat of Group 1-3 UAS threats at fixed installations using multi-sensor fusion and layered effectors.',
    specifications: [
      'Multi-sensor detection suite',
      'Radar detection range: 10+ km',
      'EO/IR tracking capability',
      'RF detection and geolocation',
      'Integrated command and control',
      'Modular effector integration',
    ],
    platforms: ['Fixed Site'],
    deployedBy: ['US Army', 'US Air Force'],
    inServiceDate: '2020',
    whatItIs: 'FS-LIDS (Fixed-Site Low, Slow, Small UAS Integrated Defeat System) is the US Army designated fixed-site counter-UAS system, designed to protect critical installations from small drone threats through a layered defense approach.',
    howItWorks: 'The system combines multiple sensors including radar, electro-optical/infrared cameras, and RF detection to identify and track UAS threats. Once a threat is confirmed, operators can employ various defeat mechanisms including RF jamming, GPS spoofing, or kinetic interceptors depending on the situation.',
    keyFeatures: [
      'Multi-sensor fusion for reduced false alarms',
      'Layered defense architecture',
      'Modular and scalable design',
      'Remote operation capability',
      'Integration with existing air defense networks',
    ],
    advantages: [
      'Comprehensive 360-degree coverage',
      'Multiple defeat options',
      'Proven combat effectiveness',
      'Continuous upgrades and improvements',
    ],
    disadvantages: [
      'Fixed installation only',
      'High initial acquisition cost',
      'Requires trained operators',
      'Power infrastructure requirements',
    ],
    combatRecord: 'Deployed to multiple overseas bases and has successfully detected and defeated numerous UAS intrusions.',
    relatedSystems: ['M-LIDS', 'KURFS', 'Coyote'],
    featured: true,
    content: `## Overview

FS-LIDS represents the US Army's primary solution for protecting fixed installations against the growing threat of small unmanned aerial systems. Developed by SRC Inc., the system integrates multiple sensors and effectors into a cohesive defensive capability.

## Development History

The system emerged from urgent operational needs identified during deployments to the Middle East, where bases faced increasing drone threats from adversary forces. The Army selected SRC's solution following competitive evaluation.

## Operational Concept

FS-LIDS employs a detect-track-identify-defeat methodology:

1. **Detection**: Multiple sensors scan for potential threats
2. **Tracking**: Confirmed contacts are continuously monitored
3. **Identification**: System helps operators classify threats
4. **Defeat**: Appropriate countermeasures are employed

## Future Development

The Army continues to enhance FS-LIDS with improved sensors and new effector options as the threat evolves.`,
  },
  {
    name: 'M-LIDS',
    slug: 'm-lids',
    description: 'Mobile Low, Slow, Small UAS Integrated Defeat System - vehicle-mounted C-UAS capability for convoy protection and maneuver forces.',
    category: 'integrated',
    manufacturer: 'SRC Inc.',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Mobile counter-UAS protection for convoy operations and maneuver units, providing on-the-move detection and defeat capabilities.',
    specifications: [
      'Vehicle-mounted system',
      'On-the-move detection capability',
      'Rapid deployment time',
      'Integrated radar and EO/IR',
      'Electronic warfare effectors',
    ],
    platforms: ['MRAP', 'JLTV', 'Stryker'],
    deployedBy: ['US Army'],
    inServiceDate: '2021',
    whatItIs: 'M-LIDS is the mobile variant of the LIDS family, designed to provide counter-UAS protection for Army units during movement and at temporary locations.',
    howItWorks: 'Mounted on tactical vehicles, M-LIDS uses radar and EO/IR sensors to detect threats while on the move. Electronic warfare systems provide primary defeat capability, allowing engagement without stopping.',
    keyFeatures: [
      'On-the-move operation',
      'Rapid setup at halt locations',
      'Integrated with vehicle systems',
      'Autonomous threat detection',
    ],
    advantages: [
      'Mobile protection capability',
      'Quick deployment',
      'Reduced crew requirements',
    ],
    disadvantages: [
      'Limited range compared to fixed systems',
      'Power constraints from vehicle',
      'Size/weight limitations',
    ],
    relatedSystems: ['FS-LIDS', 'L-MADIS'],
    featured: false,
    content: `## Overview

M-LIDS addresses the critical need for mobile counter-UAS protection, allowing units to maintain defensive capability during movement operations.`,
  },
  {
    name: 'MADIS',
    slug: 'madis',
    description: 'Marine Air Defense Integrated System - the USMC primary ground-based air defense system against UAS and low-altitude threats.',
    category: 'integrated',
    manufacturer: 'Multiple (Systems Integration)',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Ground-based air defense against UAS, rotary-wing, and low-altitude fixed-wing threats for Marine Corps expeditionary forces.',
    specifications: [
      'Multi-mission air defense',
      'Radar and EO/IR sensors',
      'Stinger missile integration',
      'Electronic warfare suite',
      'Vehicle-mounted configuration',
    ],
    platforms: ['JLTV'],
    deployedBy: ['US Marine Corps'],
    inServiceDate: '2019',
    whatItIs: 'MADIS is the Marine Corps answer to the growing UAS threat, providing an integrated solution that combines detection sensors with multiple effector options on a mobile platform.',
    howItWorks: 'The system uses a combination of radar, EO/IR, and RF sensors to detect and track aerial threats. Operators can engage with electronic warfare for soft kill or Stinger missiles for hard kill depending on the threat.',
    keyFeatures: [
      'Multi-mission capability (C-UAS and low-altitude air defense)',
      'Expeditionary design',
      'Networked with Marine air defense',
      'Multiple engagement options',
    ],
    advantages: [
      'Versatile threat engagement',
      'Proven Stinger missile',
      'Deployable by amphibious ships',
    ],
    disadvantages: [
      'Limited magazine depth',
      'Requires support infrastructure',
    ],
    combatRecord: 'Deployed with Marine units to multiple theaters.',
    relatedSystems: ['L-MADIS', 'Stinger'],
    featured: true,
    content: `## Overview

MADIS provides the Marine Corps with an organic air defense capability tailored for expeditionary operations.`,
  },
  {
    name: 'L-MADIS',
    slug: 'l-madis',
    description: 'Light Marine Air Defense Integrated System - lightweight vehicle-mounted C-UAS solution for rapid deployment.',
    category: 'integrated',
    manufacturer: 'Polaris Defense',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Lightweight counter-UAS capability for expeditionary forces, providing detection and electronic warfare defeat from a highly mobile platform.',
    specifications: [
      'MRZR vehicle platform',
      'EO/IR detection',
      'RF detection and jamming',
      'GPS denial capability',
      'Lightweight and air-transportable',
    ],
    platforms: ['MRZR'],
    deployedBy: ['US Marine Corps', 'US Navy'],
    inServiceDate: '2018',
    whatItIs: 'L-MADIS is a lightweight, rapidly deployable counter-UAS system designed for expeditionary operations where larger systems cannot be employed.',
    howItWorks: 'Mounted on an all-terrain vehicle, L-MADIS uses EO/IR and RF sensors to detect UAS threats. Electronic warfare systems jam command links and GPS signals to defeat threats.',
    keyFeatures: [
      'Highly mobile platform',
      'Quick reaction capability',
      'Minimal logistics footprint',
      'Effective against Group 1-2 UAS',
    ],
    advantages: [
      'Rapid deployment',
      'Low operating cost',
      'Easy to transport',
    ],
    disadvantages: [
      'Limited to soft-kill effects',
      'Shorter detection range',
      'Crew exposed to elements',
    ],
    combatRecord: 'Successfully employed in multiple deployments, including notable intercepts in the Middle East.',
    relatedSystems: ['MADIS', 'DroneDefender'],
    featured: false,
    content: `## Overview

L-MADIS fills a critical gap in Marine Corps air defense, providing a lightweight option for units that need rapid C-UAS capability.`,
  },

  // SENSORS
  {
    name: 'KURFS',
    slug: 'kurfs',
    description: 'Ku-band Radio Frequency System - high-resolution tactical radar optimized for detection and tracking of small UAS.',
    category: 'sensor',
    manufacturer: 'SRC Inc.',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'High-resolution radar detection and tracking of small, low-flying UAS and other aerial threats at tactical ranges.',
    specifications: [
      'Ku-band frequency operation',
      'Detection range: 10+ km for small UAS',
      'High update rate tracking',
      '360-degree coverage capability',
      'Low probability of intercept',
      'Trailer or vehicle mounted',
    ],
    platforms: ['Trailer', 'Vehicle'],
    deployedBy: ['US Army', 'US Marine Corps'],
    inServiceDate: '2017',
    detectionRange: '10+ km for Group 1-2 UAS',
    whatItIs: 'KURFS is a purpose-built counter-UAS radar operating in the Ku-band frequency range, optimized for detecting the small radar cross-sections of tactical drones.',
    howItWorks: 'The radar uses advanced signal processing to detect and track small objects with low radar cross-sections. High update rates allow continuous tracking of maneuvering targets.',
    keyFeatures: [
      'Optimized for small UAS detection',
      'All-weather operation',
      'Integration with C2 systems',
      'Automatic threat classification',
    ],
    advantages: [
      'Excellent small UAS detection',
      'Long range performance',
      'Low false alarm rate',
    ],
    disadvantages: [
      'Requires setup time',
      'Power requirements',
      'Line of sight limitations',
    ],
    relatedSystems: ['FS-LIDS', 'LSTAR'],
    featured: true,
    content: `## Overview

KURFS represents the state of the art in counter-UAS radar technology, providing critical detection capability for layered defense systems.`,
  },
  {
    name: 'AN/TPQ-50 LSTAR',
    slug: 'lstar',
    description: 'Lightweight Surveillance and Target Acquisition Radar - multi-mission radar with C-UAS detection capability.',
    category: 'sensor',
    manufacturer: 'SRC Inc.',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Multi-mission radar providing counter-fire target acquisition, air surveillance, and UAS detection capabilities.',
    specifications: [
      'L-band frequency operation',
      'Counter-fire and air surveillance modes',
      'UAS detection capability',
      'Lightweight and portable',
      'Rapid deployment',
    ],
    platforms: ['Ground', 'Vehicle'],
    deployedBy: ['US Army', 'US Marine Corps'],
    inServiceDate: '2013',
    detectionRange: '20+ km for air targets',
    whatItIs: 'LSTAR is a multi-mission radar that provides units with counter-fire target acquisition while also offering air surveillance and UAS detection modes.',
    howItWorks: 'The radar operates in L-band and uses electronic beam steering for rapid target acquisition. Software modes allow optimization for different mission sets.',
    keyFeatures: [
      'Multi-mission capability',
      'Light enough for sling-load transport',
      'Quick setup time',
      'Networked operation',
    ],
    advantages: [
      'Versatile mission set',
      'Combat proven',
      'Excellent reliability',
    ],
    disadvantages: [
      'Not optimized specifically for C-UAS',
      'Limited against very small UAS',
    ],
    relatedSystems: ['KURFS', 'AN/TPQ-36'],
    featured: false,
    content: `## Overview

LSTAR provides units with organic radar capability that can address multiple threat types including UAS.`,
  },

  // EFFECTORS
  {
    name: 'Coyote Block 2+',
    slug: 'coyote-block-2',
    description: 'Expendable kinetic interceptor drone designed specifically for counter-UAS missions, defeating threats through direct collision.',
    category: 'effector',
    manufacturer: 'Raytheon',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Kinetic defeat of Group 1-3 UAS threats through direct collision intercept, providing a hard-kill option for C-UAS systems.',
    specifications: [
      'Tube-launched interceptor',
      'Autonomous terminal guidance',
      'All-weather capability',
      'Reusable launcher',
      'Low cost per intercept',
    ],
    platforms: ['Ground Launcher', 'FS-LIDS'],
    deployedBy: ['US Army'],
    inServiceDate: '2021',
    effectiveRange: '5+ km',
    whatItIs: 'Coyote Block 2+ is a small, tube-launched interceptor drone that autonomously tracks and collides with enemy UAS to destroy them.',
    howItWorks: 'The Coyote is launched from a ground-based tube launcher. After launch, it receives target data from the integrated C2 system and uses onboard sensors for terminal guidance to impact the target.',
    keyFeatures: [
      'All-weather intercept capability',
      'Low collateral damage',
      'Cost-effective per engagement',
      'Rapid reload capability',
    ],
    advantages: [
      'Effective against electronic warfare resistant drones',
      'Kinetic kill ensures defeat',
      'Day/night operation',
    ],
    disadvantages: [
      'Single use effector',
      'Logistics burden',
      'Not effective against swarms',
    ],
    combatRecord: 'Multiple successful intercepts in combat conditions.',
    relatedSystems: ['Coyote Block 3', 'FS-LIDS'],
    featured: true,
    content: `## Overview

Coyote provides US forces with a proven kinetic intercept capability against UAS threats that may be resistant to electronic warfare countermeasures.`,
  },
  {
    name: 'Coyote Block 3',
    slug: 'coyote-block-3',
    description: 'Advanced variant of the Coyote interceptor featuring a proximity warhead for improved defeat probability.',
    category: 'effector',
    manufacturer: 'Raytheon',
    country: 'United States',
    status: 'contracted',
    primaryCapability: 'Enhanced kinetic defeat of UAS threats using proximity-fused warhead for increased probability of kill.',
    specifications: [
      'Proximity warhead',
      'Enhanced seeker',
      'Improved range',
      'Backward compatible launcher',
    ],
    platforms: ['Ground Launcher', 'FS-LIDS'],
    deployedBy: ['US Army'],
    inServiceDate: '2024',
    effectiveRange: '7+ km',
    whatItIs: 'Coyote Block 3 is the next-generation interceptor that adds a proximity-fused warhead to increase probability of kill without requiring direct impact.',
    howItWorks: 'Similar to Block 2+ but detonates near the target rather than requiring direct collision, allowing engagement of more maneuverable targets.',
    keyFeatures: [
      'Proximity warhead',
      'Higher probability of kill',
      'Effective against maneuvering targets',
    ],
    advantages: [
      'Improved kill probability',
      'Effective against agile targets',
      'Backward compatible',
    ],
    disadvantages: [
      'Higher cost per round',
      'Increased blast effects',
    ],
    relatedSystems: ['Coyote Block 2+', 'APKWS'],
    featured: false,
    content: `## Overview

Coyote Block 3 represents the evolution of the Coyote interceptor family with enhanced defeat mechanisms.`,
  },
  {
    name: 'THOR',
    slug: 'thor',
    description: 'Tactical High-power Operational Responder - directed energy system using high-power microwave to defeat drone swarms.',
    category: 'effector',
    manufacturer: 'AFRL / Leidos',
    country: 'United States',
    status: 'development',
    primaryCapability: 'High-power microwave directed energy defeat of multiple UAS simultaneously, providing counter-swarm capability.',
    specifications: [
      'High-power microwave emitter',
      'Wide beam coverage',
      'Rapid engagement capability',
      'Deep magazine (limited by power)',
      'Containerized system',
    ],
    platforms: ['Container', 'Fixed Site'],
    deployedBy: ['US Air Force'],
    inServiceDate: '2024',
    effectiveRange: 'Classified',
    whatItIs: 'THOR is a directed energy weapon that uses high-power microwave emissions to disable the electronics of enemy drones, potentially defeating multiple targets simultaneously.',
    howItWorks: 'The system generates a high-power microwave beam that overwhelms and damages electronic components in target UAS, causing them to crash or lose control.',
    keyFeatures: [
      'Counter-swarm capability',
      'Near-instantaneous engagement',
      'Deep magazine',
      'Low cost per shot',
    ],
    advantages: [
      'Can engage multiple targets',
      'Very low cost per engagement',
      'Speed of light engagement',
    ],
    disadvantages: [
      'Power intensive',
      'Atmospheric effects',
      'Collateral effects on friendly electronics',
    ],
    relatedSystems: ['PHASER', 'FS-LIDS'],
    featured: false,
    content: `## Overview

THOR represents a leap forward in C-UAS capability, offering the potential to defeat drone swarms that would overwhelm traditional kinetic defenses.`,
  },
  {
    name: 'DroneDefender',
    slug: 'dronedefender',
    description: 'Handheld RF jammer for point defense against small UAS, providing individual operators with C-UAS capability.',
    category: 'effector',
    manufacturer: 'Battelle',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Handheld RF jamming to disrupt drone control links and GPS navigation, forcing UAS to land or return home.',
    specifications: [
      'Handheld operation',
      'Battery powered',
      'Multi-band jamming',
      'Directional antenna',
      'Weight: ~15 lbs',
    ],
    platforms: ['Handheld'],
    deployedBy: ['US Military', 'US Secret Service', 'Various Allied Nations'],
    inServiceDate: '2016',
    effectiveRange: '400-1000m',
    whatItIs: 'DroneDefender is a rifle-style handheld device that allows individual operators to defeat small drones by jamming their control links.',
    howItWorks: 'The operator aims the directional antenna at a drone and activates jamming on common control frequencies. This disrupts the drone command link, typically causing it to land or activate return-to-home functions.',
    keyFeatures: [
      'No special training required',
      'Immediate availability',
      'Non-kinetic defeat',
      'Portable protection',
    ],
    advantages: [
      'Instant C-UAS capability',
      'Easy to use',
      'Effective against commercial drones',
    ],
    disadvantages: [
      'Limited range',
      'Ineffective against autonomous drones',
      'Requires line of sight',
      'May affect friendly systems',
    ],
    relatedSystems: ['L-MADIS', 'DroneGun'],
    featured: false,
    content: `## Overview

DroneDefender provides a last line of defense capability that can be issued to individual personnel for immediate drone threats.`,
  },

  // INTERNATIONAL SYSTEMS
  {
    name: 'Drone Dome',
    slug: 'drone-dome',
    description: 'Israeli comprehensive C-UAS system combining radar, EO/IR, and multiple effector options for layered defense.',
    category: 'integrated',
    manufacturer: 'Rafael Advanced Defense Systems',
    country: 'Israel',
    status: 'operational',
    primaryCapability: 'End-to-end counter-UAS solution providing detection, tracking, and defeat using soft and hard kill options.',
    specifications: [
      'Multi-sensor detection suite',
      'Laser effector option',
      'RF jamming capability',
      'Modular configuration',
      'All-weather operation',
    ],
    platforms: ['Vehicle', 'Fixed Site'],
    deployedBy: ['Israel Defense Forces', 'Export customers'],
    inServiceDate: '2016',
    detectionRange: '10+ km',
    effectiveRange: 'Varies by effector',
    whatItIs: 'Drone Dome is Rafael combat-proven counter-UAS system that has been deployed operationally by Israel and exported to multiple countries.',
    howItWorks: 'The system uses radar and EO/IR for detection, then employs jamming or directed energy laser for defeat depending on the configuration.',
    keyFeatures: [
      'Combat proven in Israel',
      'Multiple effector options',
      'Laser defeat capability',
      'Export availability',
    ],
    advantages: [
      'Extensive operational experience',
      'Modular configuration',
      'Hard and soft kill options',
    ],
    disadvantages: [
      'Export restrictions',
      'Laser effector cost',
    ],
    combatRecord: 'Extensive operational use by Israeli forces against drone threats from Gaza and Lebanon.',
    relatedSystems: ['Iron Dome', 'C-UAS'],
    featured: false,
    content: `## Overview

Drone Dome represents one of the most combat-tested C-UAS systems in the world, benefiting from Israel extensive experience facing drone threats.`,
  },
  {
    name: 'Iron Dome',
    slug: 'iron-dome',
    description: 'Israeli mobile air defense system with demonstrated capability against small UAS in addition to rockets and missiles.',
    category: 'integrated',
    manufacturer: 'Rafael Advanced Defense Systems',
    country: 'Israel',
    status: 'operational',
    primaryCapability: 'Mobile air defense against short-range rockets, artillery, mortars, and increasingly UAS threats.',
    specifications: [
      'Tamir interceptor missile',
      'EL/M-2084 radar',
      'Battle management system',
      'Mobile deployment',
      'High intercept rate',
    ],
    platforms: ['Mobile Launcher'],
    deployedBy: ['Israel Defense Forces', 'US Army'],
    inServiceDate: '2011',
    detectionRange: '70+ km',
    effectiveRange: '4-70 km',
    whatItIs: 'Iron Dome is Israel premier short-range air defense system that has successfully intercepted thousands of rockets and demonstrated capability against UAS.',
    howItWorks: 'The system radar detects incoming threats and calculates impact points. If the target will hit a populated area, a Tamir missile is launched to intercept.',
    keyFeatures: [
      'Very high intercept rate (90%+)',
      'Cost-effective engagement logic',
      'Proven in combat',
      'Networked defense',
    ],
    advantages: [
      'Outstanding combat record',
      'Proven against diverse threats',
      'Continuous improvement',
    ],
    disadvantages: [
      'High cost per intercept for UAS',
      'Over-matched for small drones',
      'Requires infrastructure',
    ],
    combatRecord: 'Thousands of successful intercepts including against enemy drones.',
    relatedSystems: ['Drone Dome', 'David Sling'],
    featured: false,
    content: `## Overview

While primarily designed for rocket defense, Iron Dome has demonstrated effective capability against UAS threats as well.`,
  },
  {
    name: 'DroneShield RfPatrol',
    slug: 'droneshield-rfpatrol',
    description: 'Wearable RF detection device providing early warning of drone activity for dismounted personnel.',
    category: 'sensor',
    manufacturer: 'DroneShield',
    country: 'Australia',
    status: 'operational',
    primaryCapability: 'Passive RF detection and identification of drone control signals, providing wearable early warning capability.',
    specifications: [
      'Wearable form factor',
      'Passive detection',
      'Multi-band coverage',
      'Drone identification library',
      'Battery operated',
    ],
    platforms: ['Wearable'],
    deployedBy: ['Various military and security forces'],
    inServiceDate: '2019',
    detectionRange: '1-2 km',
    whatItIs: 'RfPatrol is a pocket-sized RF detector that alerts dismounted personnel to nearby drone activity by detecting control signals.',
    howItWorks: 'The device passively monitors common drone control frequencies and alerts the user via vibration or display when signals matching drone patterns are detected.',
    keyFeatures: [
      'Wearable design',
      'Passive operation',
      'No emissions',
      'Drone type identification',
    ],
    advantages: [
      'Personal early warning',
      'Easy to carry',
      'Does not reveal position',
    ],
    disadvantages: [
      'Detection only, no defeat',
      'Limited against autonomous drones',
      'RF environment dependent',
    ],
    relatedSystems: ['DroneGun', 'RfOne'],
    featured: false,
    content: `## Overview

RfPatrol provides individual personnel with organic drone detection capability without requiring dedicated C-UAS systems.`,
  },
]

async function seedSystems() {
  console.log('Starting C-UAS systems seeding...')
  console.log(`Found ${systemsData.length} systems to seed`)

  let created = 0
  let skipped = 0
  let errors = 0

  for (const system of systemsData) {
    try {
      const existing = await prisma.system.findUnique({
        where: { slug: system.slug },
      })

      if (existing) {
        console.log(`  Skipping "${system.name}" - already exists`)
        skipped++
        continue
      }

      await prisma.system.create({
        data: {
          name: system.name,
          slug: system.slug,
          description: system.description,
          content: system.content,
          category: system.category,
          manufacturer: system.manufacturer,
          country: system.country,
          status: system.status,
          primaryCapability: system.primaryCapability,
          specifications: system.specifications || [],
          platforms: system.platforms || [],
          deployedBy: system.deployedBy || [],
          inServiceDate: system.inServiceDate,
          detectionRange: system.detectionRange,
          effectiveRange: system.effectiveRange,
          whatItIs: system.whatItIs,
          howItWorks: system.howItWorks,
          keyFeatures: system.keyFeatures || [],
          advantages: system.advantages || [],
          disadvantages: system.disadvantages || [],
          combatRecord: system.combatRecord,
          relatedSystems: system.relatedSystems || [],
          featured: system.featured || false,
          imageUrl: system.imageUrl || null,
        },
      })

      console.log(`  Created: ${system.name}`)
      created++
    } catch (error) {
      console.error(`  Error creating "${system.name}":`, error)
      errors++
    }
  }

  console.log('\n--- Seeding Complete ---')
  console.log(`Created: ${created}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Errors: ${errors}`)

  const total = await prisma.system.count()
  console.log(`Total systems in database: ${total}`)
}

seedSystems()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
