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
    imageUrl: 'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/what-we-do/advanced-technology/counter-uas/photo-gallery/fs_lids-coyote-0922-stmt-a-peo-22-216_16x9.jpg',
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
    imageUrl: 'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/rmd/what-we-do/counter-uas/photo-gallery/mlids-coyote-launch-09-22-stmt-a-peo-22-216_16x9.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2501/8842589/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2407/8557798/1000w_q95.jpg',
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
    imageUrl: 'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/what-we-do/counter-uas/sensors/ku-band-radio-frequency-system/450277_mlids_-00066-stmt-a-2022-070_16x9.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/1908/5643452/1000w_q95.jpg',
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
    imageUrl: 'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/rmd/what-we-do/counter-uas/2020-02/images/coyote_hero.jpg',
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
    imageUrl: 'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/what-we-do/counter-uas/photo-gallery/coyote-21-peo-23-264-1920x1080.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2106/6702930/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2108/6798379/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2108/6798379/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2506/9092756/1000w_q95.jpg',
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

  // C2 (COMMAND & CONTROL) SYSTEMS
  {
    name: 'FAAD C2',
    slug: 'faad-c2',
    description: 'Forward Area Air Defense Command and Control - the US Army interim command and control system for short-range air defense and counter-UAS integration.',
    category: 'c2',
    manufacturer: 'Northrop Grumman',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7163851/1000w_q95.jpg',
    primaryCapability: 'Open, multi-domain command and control architecture integrating sensors, effectors, and warning systems for short-range air defense and counter-UAS missions.',
    specifications: [
      'Open architecture design',
      'Multi-domain integration',
      'Real-time sensor fusion',
      'Distributed operations capability',
      'IBCS integration pathway',
      'Coalition interoperability',
    ],
    platforms: ['Command Post', 'Vehicle', 'Fixed Site'],
    deployedBy: ['US Army'],
    inServiceDate: '2022',
    whatItIs: 'FAAD C2 (Forward Area Air Defense Command and Control) is the US Army designated interim command and control system that enables integrated short-range air defense and counter-UAS operations by connecting diverse sensors and effectors.',
    howItWorks: 'The system aggregates data from multiple sensors including radars, EO/IR systems, and RF detectors, presenting a common operational picture. Operators can then assign and coordinate effectors against identified threats while maintaining situational awareness across the defended area.',
    keyFeatures: [
      'Sensor-agnostic integration',
      'Any-sensor-to-any-shooter architecture',
      'Automated threat correlation',
      'Scalable deployment options',
      'Pathway to IBCS integration',
    ],
    advantages: [
      'Rapid deployment capability',
      'Integrates legacy and new systems',
      'Proven in operational deployments',
      'Continuous software updates',
    ],
    disadvantages: [
      'Interim solution pending IBCS',
      'Training requirements for operators',
      'Network dependency',
    ],
    combatRecord: 'Deployed with US Army divisions in the Baltic region and other forward-deployed locations for integrated air defense.',
    relatedSystems: ['IBCS', 'FS-LIDS', 'MADIS'],
    featured: false,
    content: `## Overview

FAAD C2 serves as the critical command and control backbone for US Army short-range air defense and counter-UAS operations, enabling the integration of diverse sensors and effectors into a cohesive defensive capability.

## Development History

Selected by the DoD as the interim C2 system for counter-small UAS procurements, FAAD C2 provides immediate capability while the Army transitions to the fully integrated IBCS architecture.

## Operational Concept

The system enables distributed operations where sensors and effectors need not be co-located. A radar at one location can cue an effector at another, providing flexible defensive coverage.

## Future Integration

FAAD C2 is designed with a clear integration pathway to IBCS, ensuring current investments transition smoothly to the future architecture.`,
  },
  {
    name: 'IBCS',
    slug: 'ibcs',
    description: 'Integrated Air and Missile Defense Battle Command System - the next-generation command and control system enabling any-sensor-to-any-shooter air defense.',
    category: 'c2',
    manufacturer: 'Northrop Grumman',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7163851/1000w_q95.jpg',
    primaryCapability: 'Unified command and control for air and missile defense, connecting sensors and shooters across thousands of miles for integrated engagement operations.',
    specifications: [
      'Any-sensor-to-any-shooter networking',
      'Integrated Fire Control Network',
      'Engagement Operations Center',
      'Distributed battle management',
      'Multi-domain data fusion',
      'Coalition partner integration',
    ],
    platforms: ['Command Post', 'Mobile Command Vehicle'],
    deployedBy: ['US Army', 'Poland'],
    inServiceDate: '2023',
    whatItIs: 'IBCS (Integrated Air and Missile Defense Battle Command System) is the US Army transformational command and control system that replaces eight legacy systems with a single, integrated network enabling unprecedented sensor-to-shooter connectivity.',
    howItWorks: 'IBCS creates a distributed network where any connected sensor can provide targeting data to any available effector. The system uses advanced algorithms to fuse data from multiple sources, providing operators with a single integrated air picture and optimal engagement recommendations.',
    keyFeatures: [
      'Replaces 8 legacy C2 systems',
      'Connect sensors across thousands of miles',
      'Modular, open, scalable architecture',
      'Real-time track correlation',
      'Automated engagement coordination',
    ],
    advantages: [
      'Revolutionary sensor-shooter integration',
      'Dramatically improved defended area',
      'Reduced operator workload',
      'Future-proof architecture',
    ],
    disadvantages: [
      'Complex system integration',
      'High bandwidth requirements',
      'Extended fielding timeline',
    ],
    combatRecord: 'Achieved full-rate production approval in 2023. Initial operational units deploying with enhanced air defense capability.',
    relatedSystems: ['FAAD C2', 'Patriot', 'THAAD'],
    featured: true,
    content: `## Overview

IBCS represents a generational leap in air and missile defense command and control, fundamentally changing how the US Army conducts integrated air defense by enabling any sensor to cue any shooter.

## Development History

Development began in 2009 with Northrop Grumman as prime contractor. After extensive testing, the system achieved full-rate production approval in 2023.

## Operational Concept

The "any-sensor-to-any-shooter" concept means a radar in one location can provide targeting data to a missile battery hundreds of miles away. This distributed architecture dramatically increases defended area and engagement options.

## Fielding Plan

The Army plans to field IBCS to two battalions per year from 2025 through 2031, progressively replacing legacy command and control systems.`,
  },

  // INTERNATIONAL SYSTEMS - NATO ALLIES
  {
    name: 'PARADE',
    slug: 'parade',
    description: 'Protection Déployable Modulaire Anti-Drone - France comprehensive modular counter-UAS system providing 360-degree protection.',
    category: 'integrated',
    manufacturer: 'CS Group / Thales',
    country: 'France',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'Modular, deployable counter-UAS providing detection, identification, and neutralization with 360-degree coverage in all weather conditions.',
    specifications: [
      'Modular C2 architecture',
      'Multi-sensor detection (radar, RF, EO)',
      'Integrated jamming systems',
      '360-degree coverage',
      'All-weather, day/night operation',
      'Transportable configuration',
    ],
    platforms: ['Vehicle', 'Fixed Site', 'Naval'],
    deployedBy: ['French Armed Forces', 'French Navy'],
    inServiceDate: '2024',
    detectionRange: '10+ km',
    whatItIs: 'PARADE (Protection Déployable Modulaire Anti-Drone) is France primary counter-UAS system, developed by a consortium led by CS Group and Thales to protect military installations and high-value events.',
    howItWorks: 'The system combines radar, goniometer, and optronic sensors for detection and tracking. Once a threat is confirmed, operators can employ integrated jamming systems to neutralize the drone by disrupting control links and GPS.',
    keyFeatures: [
      'Combat-proven at Paris 2024 Olympics',
      'Modular and scalable design',
      'Rapid deployment capability',
      'Naval variant available (MAJES)',
    ],
    advantages: [
      'Proven operational effectiveness',
      'All-weather capability',
      'Flexible deployment options',
      'NATO interoperable',
    ],
    disadvantages: [
      'Limited hard-kill options',
      'RF environment dependent',
      'Operator training requirements',
    ],
    combatRecord: 'Deployed during Paris 2024 Olympics, successfully detected and contributed to the arrest of 50+ individuals attempting unauthorized drone flights. French Navy achieved first combat UAS intercept using PARADE-derived MAJES jammer against Houthi drones in Red Sea (December 2024).',
    relatedSystems: ['MAJES', 'Crotale', 'Mistral'],
    featured: true,
    content: `## Overview

PARADE represents France answer to the growing UAS threat, providing military installations and critical events with comprehensive drone detection and defeat capability.

## Development History

Developed under a EUR 350 million contract by a consortium including CS Group, Thales, CerbAir, and other French defense companies. The system achieved operational status in 2024.

## Combat Record

PARADE gained international recognition during the Paris 2024 Olympics where it provided airspace security. The system successfully detected numerous unauthorized drones, leading to over 50 arrests. The naval variant achieved the French Navy first combat drone intercept in December 2024.

## Export Potential

The system modular design and proven effectiveness position it well for export to allied nations seeking comprehensive C-UAS capability.`,
  },
  {
    name: 'ORCUS',
    slug: 'orcus',
    description: 'UK integrated counter-UAS system providing modular, scalable detection, tracking, and defeat capabilities for force protection.',
    category: 'integrated',
    manufacturer: 'Leonardo UK',
    country: 'United Kingdom',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'Modular counter-UAS providing integrated detection, tracking, identification, and electronic defeat for protection of UK military bases.',
    specifications: [
      'Weight: ~3 tonnes',
      'Chinook-deployable',
      'Leonardo Guardian jammer',
      'SKYPERION RF detection',
      'NINJA technology integration',
      'Modular scalable architecture',
    ],
    platforms: ['Vehicle', 'Fixed Site'],
    deployedBy: ['Royal Air Force Regiment', 'UK Armed Forces'],
    inServiceDate: '2024',
    whatItIs: 'ORCUS is the UK primary counter-UAS system developed under the SYNERGIA program, providing RAF Regiment and other UK forces with organic drone defense capability.',
    howItWorks: 'The system integrates multiple sensors including SKYPERION passive RF detection and electro-optical tracking. The Leonardo Guardian electronic warfare system provides defeat capability, acting as an electronic sniper rifle against drone threats.',
    keyFeatures: [
      'Rapidly deployable by helicopter',
      'UK sovereign capability',
      'Integration with US NINJA technology',
      'Scalable to threat level',
    ],
    advantages: [
      'Highly mobile deployment',
      'Combined UK/US technology',
      'Modular growth potential',
      'RAF Regiment operated',
    ],
    disadvantages: [
      'Primarily electronic warfare defeat',
      'Limited kinetic options',
      'Training requirements',
    ],
    combatRecord: 'Achieved Initial Operating Capability in 2024. Deployed for protection of UK military installations at home and overseas.',
    relatedSystems: ['Guardian', 'SKYPERION', 'Drone Dome'],
    featured: false,
    content: `## Overview

ORCUS provides the UK with sovereign counter-UAS capability, enabling rapid response to drone threats at military installations worldwide.

## Development History

Developed under the SYNERGIA program with Leonardo as systems integrator. The system combines UK and US technology to provide comprehensive capability.

## Deployment Concept

Weighing approximately 3 tonnes, ORCUS can be transported by Chinook helicopter for rapid deployment to threatened locations, providing immediate protection capability.`,
  },
  {
    name: 'Crow',
    slug: 'crow',
    description: 'Spanish integrated counter-UAS system combining active and passive sensors with multiple neutralization options.',
    category: 'integrated',
    manufacturer: 'Indra',
    country: 'Spain',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'Integrated detection and neutralization of UAS threats using multi-sensor fusion and adaptive countermeasures.',
    specifications: [
      'Active and passive radar',
      'RF detection sensors',
      'Infrared cameras',
      'Multi-band jamming',
      'Modular architecture',
      'Mobile deployment',
    ],
    platforms: ['Vehicle', 'Fixed Site'],
    deployedBy: ['Spanish Air Force', 'Spanish Army'],
    inServiceDate: '2020',
    detectionRange: 'Several kilometers',
    whatItIs: 'Crow is Indra counter-UAS solution providing Spanish forces with integrated detection and neutralization capability, proven in real operational deployments.',
    howItWorks: 'The system fuses data from multiple sensors including radar, RF detectors, and infrared cameras to detect and classify threats. Smart algorithms select the most appropriate countermeasure to disrupt drone communication and navigation links.',
    keyFeatures: [
      'Multi-sensor detection fusion',
      'Adaptive countermeasure selection',
      'Proven in combat operations',
      'Exportable design',
    ],
    advantages: [
      'Operational experience in Mali',
      'Flexible deployment',
      'Multiple sensor types',
      'Spanish industry support',
    ],
    disadvantages: [
      'Limited range compared to larger systems',
      'Electronic warfare focus',
    ],
    combatRecord: 'Deployed with Spanish Air Force in Mali operations, demonstrating operational effectiveness in real-world conditions.',
    relatedSystems: ['ARACNE', 'Nemus', 'PARADE'],
    featured: false,
    content: `## Overview

Crow provides Spanish forces with proven counter-UAS capability, having been deployed operationally in challenging environments.

## Operational Experience

The Spanish Air Force has employed Crow in real missions including deployments to Mali, providing valuable operational experience and validating the system effectiveness.

## System Evolution

Indra continues to develop the Crow family, with the ARACNE system providing enhanced distributed command and control capabilities.`,
  },
  {
    name: 'MANTIS',
    slug: 'mantis',
    description: 'Modular, Automatic and Network-capable Targeting and Interception System - German short-range air defense system effective against drones.',
    category: 'effector',
    manufacturer: 'Rheinmetall',
    country: 'Germany',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'Automatic detection and kinetic defeat of low-flying air threats including UAS using rapid-fire 35mm guns.',
    specifications: [
      'Six 35mm automatic guns',
      'Rate of fire: 1,000 rounds/minute per gun',
      'Two sensor units',
      'Ground control unit',
      'Programmable ammunition',
      'Automatic engagement mode',
    ],
    platforms: ['Fixed Site', 'Base Protection'],
    deployedBy: ['German Air Force', 'Slovakia'],
    inServiceDate: '2011',
    effectiveRange: '3+ km',
    whatItIs: 'MANTIS (Modular, Automatic and Network-capable Targeting and Interception System) is a German base protection system using rapid-fire guns to defeat incoming threats at close range.',
    howItWorks: 'The system uses radar and electro-optical sensors to detect and track incoming threats. Six 35mm automatic guns with programmable ammunition automatically engage targets, creating a wall of fire for close-in defense.',
    keyFeatures: [
      'Fully automatic engagement',
      'Programmable ammunition',
      'High rate of fire',
      'All-weather operation',
    ],
    advantages: [
      'Proven kinetic defeat',
      'Deep magazine',
      'Multiple simultaneous engagements',
      'Effective against diverse threats',
    ],
    disadvantages: [
      'Fixed installation',
      'Ammunition logistics',
      'Close-range only',
      'Collateral damage potential',
    ],
    combatRecord: 'Originally deployed for German base protection in Afghanistan. Two systems donated to Slovakia in 2023 for air defense.',
    relatedSystems: ['Skyranger', 'Oerlikon', 'C-RAM'],
    featured: false,
    content: `## Overview

MANTIS provides base protection against low-flying threats using proven 35mm gun technology in an automated, networked configuration.

## Development History

Developed by Rheinmetall Air Defence to protect German forward operating bases, MANTIS entered service in 2011 and has since been deployed operationally.

## International Transfer

In February 2023, Germany donated two MANTIS systems to Slovakia to strengthen NATO eastern flank air defense capabilities.`,
  },
  {
    name: 'Falcon Shield',
    slug: 'falcon-shield',
    description: 'Italian comprehensive C-UAS system providing specialized radar and 360-degree electronic surveillance for drone detection and tracking.',
    category: 'integrated',
    manufacturer: 'Leonardo',
    country: 'Italy',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'Comprehensive drone detection and tracking using specialized radar and multi-spectral sensors with electronic defeat capability.',
    specifications: [
      'Specialized C-UAS radar',
      '360-degree electronic surveillance',
      'Multi-spectral sensors',
      'Integrated C2 system',
      'Modular configuration',
      'Exportable design',
    ],
    platforms: ['Vehicle', 'Fixed Site'],
    deployedBy: ['Italian Army', 'Italian Air Force'],
    inServiceDate: '2018',
    detectionRange: '8+ km',
    whatItIs: 'Falcon Shield is Leonardo counter-UAS solution providing Italian forces with comprehensive drone detection and defeat capability using advanced radar and electronic warfare systems.',
    howItWorks: 'The system employs specialized radar optimized for small UAS detection combined with 360-degree electronic surveillance. Threats are tracked and can be engaged with integrated electronic warfare effectors.',
    keyFeatures: [
      'Purpose-built C-UAS radar',
      'Leonardo sensor integration',
      'Scalable architecture',
      'NATO compatible',
    ],
    advantages: [
      'Strong sensor suite',
      'European industry solution',
      'Integration with Leonardo ecosystem',
      'Export availability',
    ],
    disadvantages: [
      'Limited kinetic options',
      'Competition from other European systems',
    ],
    relatedSystems: ['ORCUS', 'JEY-CUAS', 'Drone Dome'],
    featured: false,
    content: `## Overview

Falcon Shield represents Leonardo counter-UAS offering, leveraging the company extensive sensor and electronic warfare expertise for comprehensive drone defense.

## Integration

As part of the broader Leonardo defense portfolio, Falcon Shield can integrate with other company systems for expanded capability.`,
  },

  // EMERGING TECHNOLOGY - DIRECTED ENERGY & AUTONOMOUS
  {
    name: 'Leonidas',
    slug: 'leonidas',
    description: 'High-power microwave directed energy system capable of defeating drone swarms through electromagnetic pulse.',
    category: 'effector',
    manufacturer: 'Epirus',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'Directed energy defeat of multiple UAS simultaneously using high-power microwave emissions to disable electronics.',
    specifications: [
      'Solid-state HPM technology',
      'Software-defined beam forming',
      'Wide-area coverage',
      'Counter-swarm capability',
      'Rapid retargeting',
      'Low cost per engagement',
    ],
    platforms: ['Vehicle', 'Fixed Site', 'Container'],
    deployedBy: ['US Army'],
    inServiceDate: '2024',
    effectiveRange: 'Classified (hundreds of meters)',
    whatItIs: 'Leonidas is a revolutionary high-power microwave (HPM) directed energy weapon system capable of defeating drone swarms by disabling their electronics with electromagnetic pulses.',
    howItWorks: 'The system generates focused high-power microwave beams that overwhelm and damage electronic components in target drones. Unlike lasers that engage one target at a time, HPM can cover a wide area to defeat multiple drones simultaneously.',
    keyFeatures: [
      'Counter-swarm capability',
      'Near-unlimited magazine',
      'Speed-of-light engagement',
      'Effective against autonomous drones',
      'Software-defined operation',
    ],
    advantages: [
      'Defeats drone swarms',
      'Very low cost per shot',
      'Works against autonomous threats',
      'Rapid engagement cycle',
    ],
    disadvantages: [
      'Classified range limitations',
      'Power requirements',
      'Potential collateral effects on friendly electronics',
      'Atmospheric effects',
    ],
    combatRecord: 'Delivered to US Army under $66.1 million contract in 2023. Undergoing operational testing and experimentation.',
    relatedSystems: ['THOR', 'PHASER', 'FS-LIDS'],
    featured: true,
    content: `## Overview

Leonidas represents a breakthrough in counter-UAS technology, offering the first operational capability to defeat drone swarms that would overwhelm traditional kinetic defenses.

## Technology Innovation

Unlike conventional kinetic or even laser systems that engage one target at a time, Leonidas high-power microwave technology can cover a wide area, making it uniquely suited for counter-swarm operations.

## Operational Significance

As adversaries increasingly deploy coordinated drone swarms, Leonidas provides a solution that scales to the threat without the ammunition limitations of kinetic systems or the single-target constraint of lasers.

## Army Integration

Procured under the Indirect Fire Protection Capability-High Power Microwave (IFPC-HPM) program, Leonidas is being integrated into the Army layered air defense architecture.`,
  },
  {
    name: 'Roadrunner',
    slug: 'roadrunner',
    description: 'Autonomous aerial interceptor drone with vertical takeoff, high maneuverability, and optional recovery capability.',
    category: 'effector',
    manufacturer: 'Anduril Industries',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2503/8939726/1000w_q95.jpg',
    primaryCapability: 'Autonomous aerial interception of UAS, cruise missiles, and low-flying aircraft using AI-guided kinetic engagement.',
    specifications: [
      'Vertical takeoff and landing',
      'Twin turbojet propulsion',
      'Vectored thrust maneuverability',
      'Autonomous guidance',
      'Optionally recoverable',
      'Modular warhead options',
    ],
    platforms: ['Ground Launcher'],
    deployedBy: ['US Armed Forces', 'US Marine Corps'],
    inServiceDate: '2024',
    effectiveRange: 'Multiple kilometers',
    whatItIs: 'Roadrunner is a revolutionary autonomous aerial interceptor that can launch vertically, engage diverse air threats, and potentially be recovered for reuse if the threat is neutralized.',
    howItWorks: 'The system launches vertically using twin turbojets with vectored thrust for high maneuverability. Lattice AI autonomy software guides the interceptor to the target. If the threat is defeated by other means, Roadrunner can land and be recovered for reuse.',
    keyFeatures: [
      'First recoverable interceptor',
      'AI-powered autonomy',
      'Vertical launch capability',
      'High maneuverability',
      'Multi-threat capability',
    ],
    advantages: [
      'Potential reusability reduces cost',
      'Effective against diverse threats',
      'Autonomous operation',
      'Rapid deployment',
    ],
    disadvantages: [
      'New technology maturity',
      'Recovery logistics',
      'Unit cost higher than expendable alternatives',
    ],
    combatRecord: 'Combat evaluation with US forces since January 2024. $250 million Pentagon contract awarded October 2024 for 500+ units. $642 million contract with US Marine Corps in 2025.',
    relatedSystems: ['Pulsar', 'Coyote', 'Lattice'],
    featured: true,
    content: `## Overview

Roadrunner represents a paradigm shift in air defense, combining autonomous AI with the revolutionary concept of a potentially recoverable interceptor.

## Innovation

The ability to recover and reuse interceptors that don't need to engage their warhead could dramatically reduce the cost-per-engagement equation that currently favors drone attackers.

## Rapid Scaling

Anduril has demonstrated ability to scale production rapidly, with the Pentagon contract calling for hundreds of units in initial production.

## Marine Corps Adoption

The $642 million Marine Corps contract in 2025 signals broad service adoption of this new interceptor concept.`,
  },
  {
    name: 'Pulsar',
    slug: 'pulsar',
    description: 'AI-infused electronic warfare system providing networked jamming capability across multiple platforms.',
    category: 'effector',
    manufacturer: 'Anduril Industries',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'Networked electronic warfare providing coordinated jamming against drone control links and navigation systems.',
    specifications: [
      'AI-powered signal processing',
      'Networked operation',
      'Multi-platform deployment',
      'Adaptive jamming',
      'Ground, vehicle, and air configurations',
      'Lattice integration',
    ],
    platforms: ['Ground', 'Vehicle', 'Aircraft'],
    deployedBy: ['US Armed Forces'],
    inServiceDate: '2023',
    effectiveRange: 'Varies by configuration',
    whatItIs: 'Pulsar is an AI-infused electronic warfare system that provides networked, coordinated jamming capability against drone threats across multiple deployment configurations.',
    howItWorks: 'The system uses AI algorithms to identify and characterize drone signals, then generates optimized jamming waveforms. Multiple Pulsar units can network together via Lattice for coordinated effects.',
    keyFeatures: [
      'AI-powered adaptation',
      'Networked coordination',
      'Multi-platform flexibility',
      'Integration with Lattice autonomy',
    ],
    advantages: [
      'Rapid adaptation to new threats',
      'Scalable deployment',
      'Software-defined capability',
      'Continuous updates',
    ],
    disadvantages: [
      'Electronic warfare limitations against autonomous drones',
      'Spectrum management requirements',
      'Network dependency for coordination',
    ],
    combatRecord: 'Operationally deployed in multiple global regions since August 2023.',
    relatedSystems: ['Roadrunner', 'Lattice', 'DroneDefender'],
    featured: false,
    content: `## Overview

Pulsar represents the application of AI to electronic warfare, enabling adaptive, networked jamming that can respond to evolving drone threats.

## Networked Operations

Multiple Pulsar systems can coordinate through Anduril Lattice network to provide overlapping coverage and synchronized jamming effects.

## Platform Flexibility

Available in ground, vehicle, and aircraft configurations, Pulsar can be deployed where needed to address specific threat scenarios.`,
  },
  {
    name: 'HELWS',
    slug: 'helws',
    description: 'High Energy Laser Weapon System - compact directed energy system providing precision drone defeat with minimal collateral effects.',
    category: 'effector',
    manufacturer: 'Raytheon (RTX)',
    country: 'United States',
    status: 'development',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2003/6150720/1000w_q95.jpg',
    primaryCapability: 'Precision directed energy defeat of UAS using high-energy laser, providing low cost-per-shot engagement.',
    specifications: [
      'High-energy laser emitter',
      'Precision beam control',
      'Mobile platform integration',
      'Electro-optical tracking',
      'Deep magazine (power limited)',
      'Low cost per engagement',
    ],
    platforms: ['MRZR', 'Vehicle', 'Fixed Site'],
    deployedBy: ['US Air Force'],
    inServiceDate: '2025',
    effectiveRange: 'Several kilometers',
    whatItIs: 'HELWS (High Energy Laser Weapon System) is a compact directed energy weapon that uses a high-energy laser to disable drone threats with precision and minimal collateral damage.',
    howItWorks: 'The system uses electro-optical sensors to track targets and a high-energy laser to heat and damage critical components. The laser can dwell on target until the drone is disabled or destroyed.',
    keyFeatures: [
      'Precision engagement',
      'Low collateral damage',
      'Cost-effective per shot',
      'Silent operation',
    ],
    advantages: [
      'Very low cost per engagement',
      'Precision minimizes collateral',
      'Deep magazine',
      'Speed of light engagement',
    ],
    disadvantages: [
      'Atmospheric effects reduce range',
      'Power requirements',
      'Single target engagement',
      'Dwell time required',
    ],
    combatRecord: 'Delivered to US Air Force for testing. Multiple demonstrations conducted against drone targets.',
    relatedSystems: ['Leonidas', 'THOR', 'DE M-SHORAD'],
    featured: false,
    content: `## Overview

HELWS provides precision directed energy capability in a compact, mobile package suitable for tactical deployment.

## Technology Maturation

The system has undergone extensive testing and demonstration, with the Air Force evaluating operational employment concepts.

## Complementary Capability

HELWS complements high-power microwave systems like Leonidas - lasers provide precision single-target engagement while HPM addresses swarms.`,
  },
  {
    name: 'JEY-CUAS',
    slug: 'jey-cuas',
    description: 'Joint European sYstem for Countering UAS - multinational European R&D program developing next-generation modular C-UAS.',
    category: 'integrated',
    manufacturer: 'Leonardo (consortium lead)',
    country: 'Italy',
    status: 'development',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'Next-generation modular counter-UAS architecture addressing micro to tactical drones with reduced reaction time.',
    specifications: [
      'Modular plug-and-play architecture',
      'Multi-sensor integration',
      '38-enterprise consortium',
      '14 EU countries participating',
      'Radar, EO, RF detection',
      'Advanced C2 integration',
    ],
    platforms: ['Vehicle', 'Fixed Site', 'Naval'],
    deployedBy: ['European Union members'],
    inServiceDate: '2027',
    whatItIs: 'JEY-CUAS (Joint European sYstem for Countering UAS) is a multinational European R&D program developing the next generation of counter-UAS capability with a modular, flexible architecture.',
    howItWorks: 'The system will employ a plug-and-play architecture allowing integration of diverse sensors and effectors. Advanced algorithms will reduce reaction time and improve effectiveness against resilient drone threats.',
    keyFeatures: [
      'Pan-European collaboration',
      'Modular open architecture',
      'Designed for drone resilience',
      'Reduced reaction time',
    ],
    advantages: [
      'European strategic autonomy',
      'Shared R&D investment',
      'Interoperability by design',
      'Addresses next-gen threats',
    ],
    disadvantages: [
      'Multi-nation coordination complexity',
      'Extended development timeline',
      'Not yet operational',
    ],
    relatedSystems: ['Falcon Shield', 'PARADE', 'ORCUS'],
    featured: false,
    content: `## Overview

JEY-CUAS represents Europe collaborative approach to countering the evolving drone threat, pooling expertise from 38 enterprises across 14 countries.

## Strategic Significance

The program aims to provide European strategic autonomy in counter-UAS capability while ensuring interoperability across NATO allies.

## Technology Focus

The system specifically addresses the increasing resilience of modern drones to first-generation countermeasures, emphasizing reduced reaction times and modular flexibility.`,
  },

  // NEW SYSTEMS FROM EXCEL IMPORT

  // US ARMY/JOINT SYSTEMS
  {
    name: 'M-SHORAD',
    slug: 'm-shorad',
    description: 'Maneuver Short-Range Air Defense system mounted on Stryker vehicles, providing mobile air defense with 30mm cannon, Stinger missiles, and radar.',
    category: 'integrated',
    manufacturer: 'General Dynamics Land Systems / Leonardo DRS',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2104/6612523/1000w_q95.jpg',
    primaryCapability: 'Mobile short-range air defense against UAS, rotary-wing, and fixed-wing threats for maneuver forces.',
    specifications: [
      '30mm XM914 Bushmaster chain gun',
      'Stinger missile launcher',
      'Multi-mission hemisphere radar',
      'Stryker A1 vehicle platform',
      'On-the-move engagement capability',
    ],
    platforms: ['Stryker'],
    deployedBy: ['US Army'],
    inServiceDate: '2021',
    effectiveRange: '4+ km (Stinger)',
    whatItIs: 'M-SHORAD (Maneuver Short-Range Air Defense), also known as SGT STOUT, is a Stryker-mounted air defense system that provides organic protection for Army brigade combat teams against drones, helicopters, and low-flying aircraft.',
    howItWorks: 'The system integrates a 30mm cannon, Stinger missiles, and multi-mission radar on a Stryker vehicle. It can detect, track, and engage threats while stationary or on the move, providing continuous protection for maneuver units.',
    keyFeatures: [
      'On-the-move engagement',
      'Multiple weapon systems',
      'Organic to BCT',
      'Day/night capability',
    ],
    advantages: [
      'Mobile protection for maneuver forces',
      'Multiple engagement options',
      'Familiar Stryker platform',
      'Networked air defense',
    ],
    disadvantages: [
      'Limited missile loadout',
      'Single vehicle crew workload',
      'Logistics for multiple munitions',
    ],
    combatRecord: 'Fielded to US Army units in Europe for NATO air defense.',
    relatedSystems: ['DE M-SHORAD', 'Stinger', 'MADIS'],
    featured: false,
    content: `## Overview

M-SHORAD restores organic short-range air defense capability to Army maneuver units, addressing gaps identified during operations against adversaries with UAS and rotary-wing threats.

## Significance

The system represents the Army return to mobile air defense after decades of focusing on fixed-site protection.`,
  },
  {
    name: 'NINJA',
    slug: 'ninja',
    description: 'Negation of Improvised Non-State Joint Aerial Threats - Air Force directed energy system that defeats drones by disrupting RF communications.',
    category: 'effector',
    manufacturer: 'Air Force Research Laboratory',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/1707/3566022/1000w_q95.jpg',
    primaryCapability: 'Non-kinetic UAS defeat by disrupting RF communications between drone and operator.',
    specifications: [
      'Directed energy effector',
      'RF disruption capability',
      'Non-kinetic defeat',
      'Rapid engagement',
    ],
    platforms: ['Fixed Site', 'Vehicle'],
    deployedBy: ['US Air Force'],
    inServiceDate: '2020',
    whatItIs: 'NINJA (Negation of Improvised Non-State Joint Aerial Threats) is an Air Force directed energy system that detects, tracks, and defeats small UAS by disrupting the RF link between drone and operator.',
    howItWorks: 'The system uses directed RF energy to overwhelm the communication link between a drone and its controller, causing the drone to lose control and typically crash or activate failsafe modes.',
    keyFeatures: [
      'Non-kinetic defeat',
      'Rapid target engagement',
      'Low cost per shot',
      'Multiple target capability',
    ],
    advantages: [
      'No ammunition required',
      'Low operational cost',
      'Effective against commercial drones',
    ],
    disadvantages: [
      'Limited against autonomous drones',
      'RF environment dependent',
      'Range limitations',
    ],
    relatedSystems: ['THOR', 'Leonidas', 'ORCUS'],
    featured: false,
    content: `## Overview

NINJA provides Air Force bases with an electronic warfare capability specifically designed to counter the proliferation of small commercial drones.`,
  },
  {
    name: 'VAMPIRE',
    slug: 'vampire',
    description: 'Vehicle-Agnostic Modular Palletized ISR Rocket Equipment - lightweight system using APKWS rockets for counter-UAS and ground attack.',
    category: 'integrated',
    manufacturer: 'L3Harris',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/1804/4274524/1000w_q95.jpg',
    primaryCapability: 'Palletized ISR and precision strike capability using APKWS laser-guided rockets against UAS and ground targets.',
    specifications: [
      'WESCAM MX-10D sighting system',
      'Four APKWS 70mm rocket tubes',
      'Palletized for any vehicle',
      'Laser guidance system',
      'Day/night targeting',
    ],
    platforms: ['Pickup truck', 'Utility vehicle', 'Any flatbed'],
    deployedBy: ['Ukraine', 'NATO partners'],
    inServiceDate: '2022',
    effectiveRange: '5+ km',
    whatItIs: 'VAMPIRE (Vehicle-Agnostic Modular Palletized ISR Rocket Equipment) is a lightweight, palletized weapon system that can be mounted on any vehicle to provide ISR and precision strike capability.',
    howItWorks: 'The system combines an advanced EO/IR sensor with four 70mm APKWS laser-guided rockets. The operator uses the sensor to detect and track targets, then designates with a laser for the rocket to follow.',
    keyFeatures: [
      'Vehicle agnostic mounting',
      'Proven APKWS rockets',
      'Advanced targeting sensor',
      'Rapid deployment',
    ],
    advantages: [
      'Low cost compared to missiles',
      'Fits any vehicle',
      'Combat proven in Ukraine',
      'Dual counter-UAS and ground attack',
    ],
    disadvantages: [
      'Limited magazine (4 rockets)',
      'Requires line of sight',
      'Manual targeting required',
    ],
    combatRecord: 'Combat deployed to Ukraine where it has been used against Russian drones and ground targets.',
    relatedSystems: ['APKWS II', 'Stinger'],
    featured: false,
    content: `## Overview

VAMPIRE emerged as a rapid solution to provide Ukrainian forces with mobile air defense and precision strike capability using commercially available components.

## Combat Use

The system has seen extensive combat use in Ukraine, proving effective against both UAS targets and ground vehicles.`,
  },
  {
    name: 'APKWS II',
    slug: 'apkws-ii',
    description: 'Advanced Precision Kill Weapon System II - laser-guided 70mm rocket providing low-cost precision engagement of UAS and ground targets.',
    category: 'effector',
    manufacturer: 'BAE Systems',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2504/8998477/1000w_q95.jpg',
    primaryCapability: 'Low-cost precision strike against UAS and ground targets using laser-guided 70mm rockets.',
    specifications: [
      '70mm Hydra rocket base',
      'Semi-active laser guidance',
      'Cost: ~$30,000 per round',
      'Multiple warhead options',
      'Compatible with existing launchers',
    ],
    platforms: ['Aircraft', 'Ground launchers', 'VAMPIRE'],
    deployedBy: ['US Air Force', 'US Navy', 'Ukraine'],
    inServiceDate: '2012',
    effectiveRange: '5+ km',
    whatItIs: 'APKWS II (Advanced Precision Kill Weapon System) is a guidance kit that converts unguided 70mm Hydra rockets into precision laser-guided munitions at a fraction of missile cost.',
    howItWorks: 'The APKWS kit adds a laser seeker and guidance fins to standard Hydra rockets. The shooter designates the target with a laser, and the rocket homes in on the reflected energy.',
    keyFeatures: [
      'Converts existing rocket inventory',
      'Low cost precision strike',
      'Multiple platform compatibility',
      'Scalable effects',
    ],
    advantages: [
      'Very low cost (~$30k vs $100k+ missiles)',
      'Uses existing rocket stockpiles',
      'Precision reduces collateral damage',
      'Combat proven',
    ],
    disadvantages: [
      'Requires laser designation',
      'Limited range vs missiles',
      'Smaller warhead than missiles',
    ],
    combatRecord: 'Extensively used by US forces and provided to Ukraine for counter-UAS and ground attack missions.',
    relatedSystems: ['VAMPIRE', 'Hellfire', 'Stinger'],
    featured: false,
    content: `## Overview

APKWS represents a cost-effective revolution in precision strike, enabling forces to engage targets precisely without the expense of full missiles.

## Counter-UAS Role

The system has emerged as an effective counter-UAS weapon due to its low cost and precision, making it economical to engage drones.`,
  },
  {
    name: 'MEDUSA C2',
    slug: 'medusa-c2',
    description: 'Multi-Environmental Domain Unmanned Systems Application - system-of-systems integration platform for C-UAS command and control.',
    category: 'c2',
    manufacturer: 'SYNCRO (Integration)',
    country: 'United States',
    status: 'development',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7143773/1000w_q95.jpg',
    primaryCapability: 'Multi-domain command and control integration for unmanned systems and counter-UAS operations.',
    specifications: [
      'System-of-systems architecture',
      'Interoperable with FAAD-C2',
      'Multi-domain integration',
      'AI-assisted decision support',
    ],
    platforms: ['Command Post', 'Vehicle'],
    deployedBy: ['US Air Force', 'US Marine Corps'],
    inServiceDate: '2025',
    whatItIs: 'MEDUSA C2 (Multi-Environmental Domain Unmanned Systems Application) is an emerging command and control system designed to integrate diverse sensors and effectors across multiple domains.',
    howItWorks: 'The system aggregates data from multiple sensors and platforms, providing operators with a unified picture and AI-assisted recommendations for engaging UAS threats.',
    keyFeatures: [
      'Multi-domain awareness',
      'AI decision support',
      'FAAD-C2 interoperability',
      'Scalable architecture',
    ],
    advantages: [
      'Integrates diverse systems',
      'Reduces operator workload',
      'Future-proof design',
    ],
    disadvantages: [
      'Still in development',
      'Integration complexity',
    ],
    relatedSystems: ['FAAD C2', 'IBCS', 'Reactor'],
    featured: false,
    content: `## Overview

MEDUSA C2 represents the next generation of C-UAS command and control, designed to handle the increasing complexity of multi-domain operations.`,
  },
  {
    name: 'Dronebuster',
    slug: 'dronebuster',
    description: 'Handheld counter-UAS jammer providing GNSS spoofing and control-link jamming for dismounted forces.',
    category: 'effector',
    manufacturer: 'Flex Force',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7143773/1000w_q95.jpg',
    primaryCapability: 'Handheld electronic warfare device for dismounted counter-UAS operations.',
    specifications: [
      'Handheld form factor',
      'GNSS spoofing capability',
      'Control link jamming',
      'Multiple frequency bands',
      'Battery operated',
    ],
    platforms: ['Handheld'],
    deployedBy: ['US Army', 'US Air Force', 'US Joint Forces'],
    inServiceDate: '2018',
    effectiveRange: '500m-1km',
    whatItIs: 'Dronebuster is a handheld counter-UAS jammer that allows individual operators to defeat drones by jamming control links and spoofing GPS signals.',
    howItWorks: 'The operator aims the device at a drone and activates jamming on control frequencies and GPS bands, causing the drone to lose navigation and control.',
    keyFeatures: [
      'Truly portable',
      'GPS spoofing capability',
      'Multi-band operation',
      'Easy to use',
    ],
    advantages: [
      'Individual operator capability',
      'Immediate availability',
      'No logistics burden',
      'Effective against commercial drones',
    ],
    disadvantages: [
      'Limited range',
      'Ineffective against autonomous drones',
      'Battery life limitations',
    ],
    combatRecord: 'Widely deployed with US forces and coalition partners.',
    relatedSystems: ['DroneDefender', 'DRAKE'],
    featured: false,
    content: `## Overview

Dronebuster provides dismounted troops with organic counter-UAS capability, addressing the threat from commercial drones at the tactical level.`,
  },
  {
    name: 'DRAKE',
    slug: 'drake',
    description: 'Drone Restricted Access using Known Electromagnetic Warfare - Navy RF jammer derived from JCREW IED defeat technology.',
    category: 'effector',
    manufacturer: 'Northrop Grumman',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/1510/2246276/1000w_q95.jpg',
    primaryCapability: 'RF jamming for counter-UAS derived from proven counter-IED electronic warfare technology.',
    specifications: [
      'RF jamming capability',
      'Backpack or ship-mounted versions',
      'Derived from JCREW technology',
      'Multiple frequency coverage',
    ],
    platforms: ['Backpack', 'Ship-mounted'],
    deployedBy: ['US Navy'],
    inServiceDate: '2019',
    whatItIs: 'DRAKE (Drone Restricted Access using Known Electromagnetic Warfare) is a Navy counter-UAS jammer that leverages proven counter-IED electronic warfare technology.',
    howItWorks: 'The system transmits RF energy to jam drone control links, leveraging algorithms and hardware developed for the successful JCREW counter-IED program.',
    keyFeatures: [
      'Proven technology base',
      'Multiple form factors',
      'Ship and dismounted variants',
    ],
    advantages: [
      'Mature technology',
      'Navy-specific variants',
      'Proven in operations',
    ],
    disadvantages: [
      'Limited against autonomous drones',
      'RF environment dependent',
    ],
    relatedSystems: ['Dronebuster', 'DroneDefender', 'JCREW'],
    featured: false,
    content: `## Overview

DRAKE extends the Navy proven counter-IED electronic warfare capability to address the emerging drone threat.`,
  },
  {
    name: 'SmartShooter',
    slug: 'smartshooter',
    description: 'Fire control system for individual rifles that improves accuracy against small drones for dismounted patrol.',
    category: 'effector',
    manufacturer: 'Smart Shooter Ltd.',
    country: 'Israel',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'Rifle-mounted fire control system enabling precise engagement of small UAS with standard firearms.',
    specifications: [
      'Rifle-mounted system',
      'Automatic target tracking',
      'Fire control computer',
      'Compatible with multiple rifles',
    ],
    platforms: ['Individual rifle'],
    deployedBy: ['US Army', 'US Marine Corps', 'US Joint Forces'],
    inServiceDate: '2020',
    effectiveRange: '300m',
    whatItIs: 'SmartShooter is a computerized fire control system that mounts on individual rifles, enabling soldiers to accurately engage small, fast-moving targets like drones.',
    howItWorks: 'The system uses a camera and computer to track targets. When the shooter pulls the trigger, the system waits until the rifle is precisely aligned with the target before firing.',
    keyFeatures: [
      'Individual soldier capability',
      'Works with standard rifles',
      'Automatic target tracking',
      'Day/night capable',
    ],
    advantages: [
      'Uses existing rifles and ammunition',
      'Individual soldier C-UAS',
      'Low logistics burden',
      'Quick to deploy',
    ],
    disadvantages: [
      'Short range',
      'Battery dependent',
      'Training required',
    ],
    relatedSystems: ['Dronebuster', 'DroneDefender'],
    featured: false,
    content: `## Overview

SmartShooter provides the ultimate in distributed counter-UAS capability, enabling every rifleman to engage drone threats.`,
  },
  {
    name: 'Iron Beam',
    slug: 'iron-beam',
    description: 'Israeli 100-kilowatt high-energy laser providing low-cost intercept of drones, rockets, and mortars.',
    category: 'effector',
    manufacturer: 'Rafael Advanced Defense Systems / Elbit Systems',
    country: 'Israel',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/1412/1680542/1000w_q95.jpg',
    primaryCapability: 'High-energy laser intercept of UAS, rockets, and mortars at very low cost per engagement.',
    specifications: [
      '100-kilowatt laser',
      'Range: 10 km',
      'Cost per shot: ~$3.50',
      'All-weather capable',
      'Autonomous operation',
    ],
    platforms: ['Vehicle', 'Fixed Site'],
    deployedBy: ['Israel Defense Forces'],
    inServiceDate: '2024',
    effectiveRange: '10 km',
    whatItIs: 'Iron Beam is Israel operational high-energy laser system designed to intercept drones, rockets, and mortars at a fraction of the cost of missile interceptors.',
    howItWorks: 'The system uses a 100-kilowatt laser to burn through the structure of incoming threats. The laser dwells on the target until it is destroyed or disabled.',
    keyFeatures: [
      'Near-unlimited magazine',
      'Extremely low cost per shot',
      'Speed of light engagement',
      'Complements Iron Dome',
    ],
    advantages: [
      'Cost per shot measured in dollars',
      'Deep magazine',
      'Effective against swarms',
      'Combat proven',
    ],
    disadvantages: [
      'Atmospheric effects',
      'Power requirements',
      'Single target at a time',
      'Dwell time needed',
    ],
    combatRecord: 'Operational with IDF, first combat use in 2024 against incoming threats.',
    relatedSystems: ['Iron Dome', 'Drone Dome', 'HELWS'],
    featured: true,
    content: `## Overview

Iron Beam represents a breakthrough in air defense economics, providing intercept capability at pennies per shot compared to thousands of dollars for missiles.

## Combat Deployment

Israel deployed Iron Beam operationally in 2024, marking the first combat use of a high-energy laser for air defense.

## Cost Revolution

At approximately $3.50 per shot versus $50,000+ for Iron Dome interceptors, Iron Beam fundamentally changes the economics of air defense.`,
  },
  {
    name: 'MRIC',
    slug: 'mric',
    description: 'Medium-Range Intercept Capability - Marine Corps system derived from Iron Dome featuring SkyHunter interceptor.',
    category: 'integrated',
    manufacturer: 'Raytheon (RTX) / Rafael',
    country: 'United States',
    status: 'development',
    imageUrl: 'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/what-we-do/integrated-air-and-missile-defense/iron-dome-system/2020-02/images/irondome_hero_lg.jpg',
    primaryCapability: 'Medium-range air defense against cruise missiles and UAS using Iron Dome-derived technology.',
    specifications: [
      'SkyHunter interceptor missile',
      'AN/TPS-80 G/ATOR radar',
      'Iron Dome derived',
      'Marine expeditionary compatible',
    ],
    platforms: ['Vehicle', 'Ground'],
    deployedBy: ['US Marine Corps'],
    inServiceDate: '2025',
    effectiveRange: '70 km',
    whatItIs: 'MRIC (Medium-Range Intercept Capability) is the Marine Corps solution for defending against cruise missiles and larger drones, derived from Israel proven Iron Dome system.',
    howItWorks: 'The system uses the G/ATOR radar for detection and the SkyHunter interceptor (US-produced Tamir) for engagement, providing capability similar to Iron Dome.',
    keyFeatures: [
      'Proven Iron Dome technology',
      'US-produced interceptor',
      'Marine expeditionary design',
      'Cruise missile defense',
    ],
    advantages: [
      'Combat-proven technology',
      'High intercept rate',
      'Extended range coverage',
    ],
    disadvantages: [
      'Cost per intercept',
      'Still in development',
      'Logistics requirements',
    ],
    relatedSystems: ['Iron Dome', 'MADIS', 'Patriot'],
    featured: false,
    content: `## Overview

MRIC provides the Marine Corps with organic medium-range air defense, filling a critical gap between short-range systems and national missile defense.`,
  },
  {
    name: 'IFPC-HPM',
    slug: 'ifpc-hpm',
    description: 'Indirect Fire Protection Capability - High Power Microwave - Army program using Epirus Leonidas for counter-swarm defense.',
    category: 'effector',
    manufacturer: 'Epirus Inc.',
    country: 'United States',
    status: 'development',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'High-power microwave defeat of drone swarms for base and area protection.',
    specifications: [
      'High-power microwave emitter',
      'Wide-area coverage',
      'Counter-swarm capability',
      'Rapid engagement cycle',
    ],
    platforms: ['Vehicle', 'Fixed Site'],
    deployedBy: ['US Army'],
    inServiceDate: '2025',
    whatItIs: 'IFPC-HPM (Indirect Fire Protection Capability - High Power Microwave) is the Army program to field high-power microwave systems for counter-swarm defense.',
    howItWorks: 'The system generates directed microwave energy that disables drone electronics across a wide area, enabling defeat of coordinated swarms.',
    keyFeatures: [
      'Counter-swarm capability',
      'Wide-area effects',
      'Low cost per engagement',
      'Deep magazine',
    ],
    advantages: [
      'Defeats multiple drones simultaneously',
      'Very low cost per shot',
      'Speed of light engagement',
    ],
    disadvantages: [
      'Range limitations',
      'Power requirements',
      'Potential collateral effects',
    ],
    relatedSystems: ['Leonidas', 'THOR', 'FS-LIDS'],
    featured: false,
    content: `## Overview

IFPC-HPM represents the Army solution to the drone swarm threat, leveraging directed energy to defeat multiple targets simultaneously.`,
  },
  {
    name: 'Reactor',
    slug: 'reactor',
    description: 'AI-enabled C2 platform providing modular, scalable command and control with multi-modal sensor fusion.',
    category: 'c2',
    manufacturer: 'Camgian',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7163851/1000w_q95.jpg',
    primaryCapability: 'AI-enabled command and control platform for counter-UAS operations with multi-sensor fusion.',
    specifications: [
      'AI decision aids',
      'Modular/scalable architecture',
      'Sensor agnostic',
      'Effector agnostic',
      'Multi-modal sensor fusion',
    ],
    platforms: ['Command Post', 'Vehicle'],
    deployedBy: ['US Air Force'],
    inServiceDate: '2023',
    whatItIs: 'Reactor is an AI-enabled command and control platform that integrates diverse sensors and effectors for counter-UAS operations.',
    howItWorks: 'The system fuses data from multiple sensor types and uses AI algorithms to provide operators with threat assessments and engagement recommendations.',
    keyFeatures: [
      'AI-powered decision support',
      'Sensor agnostic integration',
      'Modular architecture',
      'Rapid deployment',
    ],
    advantages: [
      'Integrates any sensor or effector',
      'Reduces operator workload',
      'Scalable to mission',
    ],
    disadvantages: [
      'Requires integration effort',
      'Training requirements',
    ],
    relatedSystems: ['FAAD C2', 'MEDUSA C2', 'IBCS'],
    featured: false,
    content: `## Overview

Reactor provides Air Force units with flexible, AI-enabled command and control that can adapt to different sensor and effector configurations.`,
  },
  {
    name: 'TOC-L',
    slug: 'toc-l',
    description: 'Tactical Operations Center - Light - mobile and agile C2 integrating with Maven Smart System.',
    category: 'c2',
    manufacturer: 'Department of the Air Force PEO C3BM',
    country: 'United States',
    status: 'development',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2306/7837924/1000w_q95.jpg',
    primaryCapability: 'Mobile, agile command and control for tactical air operations.',
    specifications: [
      'Mobile deployment',
      'Maven Smart System integration',
      'STITCHES compatibility',
      'Reduced footprint',
    ],
    platforms: ['Mobile'],
    deployedBy: ['US Air Force'],
    inServiceDate: '2025',
    whatItIs: 'TOC-L (Tactical Operations Center - Light) is a lightweight, mobile command and control capability designed for agile operations.',
    howItWorks: 'The system provides deployable C2 capability with integration to AI systems like Maven for enhanced situational awareness.',
    keyFeatures: [
      'Lightweight and mobile',
      'AI integration',
      'Rapid setup',
    ],
    advantages: [
      'Agile deployment',
      'Modern AI integration',
      'Reduced manning',
    ],
    disadvantages: [
      'Limited compared to full TOC',
      'Still in development',
    ],
    relatedSystems: ['Maven Smart System', 'Reactor', 'FAAD C2'],
    featured: false,
    content: `## Overview

TOC-L enables Air Force units to establish command and control quickly in austere locations.`,
  },
  {
    name: 'Maven Smart System',
    slug: 'maven-smart-system',
    description: 'AI-driven software providing unified operating picture for Air Force operations.',
    category: 'c2',
    manufacturer: 'Palantir',
    country: 'United States',
    status: 'development',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7163851/1000w_q95.jpg',
    primaryCapability: 'AI-driven data fusion and unified operating picture for air operations.',
    specifications: [
      'AI-driven analytics',
      'Multi-source data fusion',
      'Unified operating picture',
      'Cloud-native architecture',
    ],
    platforms: ['Software'],
    deployedBy: ['US Air Force'],
    inServiceDate: '2025',
    whatItIs: 'Maven Smart System is Palantir AI-driven software platform providing the Air Force with enhanced situational awareness through data fusion.',
    howItWorks: 'The system aggregates data from multiple sources and applies AI algorithms to create a unified operating picture with predictive analytics.',
    keyFeatures: [
      'AI-powered analysis',
      'Multi-source fusion',
      'Predictive capabilities',
    ],
    advantages: [
      'Enhanced situational awareness',
      'Rapid data processing',
      'Commercial AI capabilities',
    ],
    disadvantages: [
      'Dependency on data quality',
      'Integration requirements',
    ],
    relatedSystems: ['TOC-L', 'IBCS', 'Reactor'],
    featured: false,
    content: `## Overview

Maven Smart System brings commercial AI capabilities to Air Force operations, enhancing decision-making through data fusion and analytics.`,
  },
  {
    name: 'LPWS',
    slug: 'lpws',
    description: 'Land-Based Phalanx Weapon System - 20mm Gatling gun system repurposed from naval CIWS for ground-based C-UAS.',
    category: 'effector',
    manufacturer: 'Raytheon',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2408/8661016/1000w_q95.jpg',
    primaryCapability: 'Close-in kinetic defense using rapid-fire 20mm cannon against UAS and rockets.',
    specifications: [
      '20mm M61A1 Gatling gun',
      'Rate of fire: 3,000-4,500 rpm',
      'Autonomous tracking radar',
      'Ground-mounted CIWS derivative',
    ],
    platforms: ['Fixed Site', 'Ground'],
    deployedBy: ['US Army'],
    inServiceDate: '2005',
    effectiveRange: '2 km',
    whatItIs: 'LPWS (Land-Based Phalanx Weapon System) adapts the proven naval Phalanx CIWS for ground-based defense against rockets, artillery, mortars, and drones.',
    howItWorks: 'The system uses radar to automatically detect and track incoming threats, then engages with high-rate-of-fire 20mm rounds to destroy them.',
    keyFeatures: [
      'Proven Phalanx technology',
      'Automatic engagement',
      'High rate of fire',
      'C-RAM capability',
    ],
    advantages: [
      'Combat proven',
      'Autonomous operation',
      'Effective against diverse threats',
    ],
    disadvantages: [
      'Ammunition consumption',
      'Close range only',
      'Fixed installation',
    ],
    combatRecord: 'Deployed to Iraq and Afghanistan for base protection, successfully engaging rockets and mortars.',
    relatedSystems: ['Phalanx CIWS', 'MANTIS', 'C-RAM'],
    featured: false,
    content: `## Overview

LPWS brings the proven Phalanx CIWS capability ashore, providing bases with automatic close-in defense.`,
  },
  {
    name: 'DE M-SHORAD',
    slug: 'de-m-shorad',
    description: 'Directed Energy Maneuver Short-Range Air Defense - 50-kilowatt laser mounted on Stryker vehicle.',
    category: 'effector',
    manufacturer: 'Raytheon / Kord Technologies',
    country: 'United States',
    status: 'development',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2506/9107830/1000w_q95.jpg',
    primaryCapability: '50-kilowatt high-energy laser for mobile counter-UAS and short-range air defense.',
    specifications: [
      '50-kilowatt laser',
      'Stryker vehicle platform',
      'Mobile operation',
      'Deep magazine',
    ],
    platforms: ['Stryker'],
    deployedBy: ['US Army'],
    inServiceDate: '2024',
    effectiveRange: 'Several kilometers',
    whatItIs: 'DE M-SHORAD (Directed Energy Maneuver Short-Range Air Defense) mounts a 50-kilowatt laser on a Stryker vehicle for mobile counter-UAS operations.',
    howItWorks: 'The laser system tracks and engages aerial threats by dwelling a focused beam on the target until it is destroyed or disabled.',
    keyFeatures: [
      'Mobile laser system',
      'Very low cost per shot',
      'Deep magazine',
      'Silent operation',
    ],
    advantages: [
      'Near-unlimited ammunition',
      'Low cost per engagement',
      'Mobile protection',
    ],
    disadvantages: [
      'Power requirements',
      'Atmospheric effects',
      'Single target engagement',
    ],
    relatedSystems: ['M-SHORAD', 'HELWS', 'Iron Beam'],
    featured: false,
    content: `## Overview

DE M-SHORAD represents the Army vision for mobile directed energy air defense, complementing kinetic M-SHORAD systems.`,
  },
  {
    name: 'IFPC Increment 2',
    slug: 'ifpc-increment-2',
    description: 'Indirect Fire Protection Capability Increment 2 - ground-based system against Group 2-3 UAS using AIM-9X missiles.',
    category: 'integrated',
    manufacturer: 'Raytheon / Dynetics',
    country: 'United States',
    status: 'development',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2305/7788895/1000w_q95.jpg',
    primaryCapability: 'Ground-based air defense against larger UAS and cruise missiles using proven AIM-9X Sidewinder.',
    specifications: [
      'AIM-9X Sidewinder missiles',
      'Multi-mission launcher',
      'Sentinel radar integration',
      'Networked operations',
    ],
    platforms: ['Ground Launcher'],
    deployedBy: ['US Army'],
    inServiceDate: '2025',
    effectiveRange: '10+ km',
    whatItIs: 'IFPC Increment 2 provides the Army with capability against Group 2-3 UAS and cruise missiles using ground-launched AIM-9X Sidewinder missiles.',
    howItWorks: 'The system uses proven AIM-9X air-to-air missiles launched from ground platforms, guided by integrated air defense radars.',
    keyFeatures: [
      'Proven AIM-9X missile',
      'Cruise missile defense',
      'Larger UAS capability',
      'Networked operations',
    ],
    advantages: [
      'Proven missile technology',
      'Extended range',
      'Multi-mission capable',
    ],
    disadvantages: [
      'Cost per engagement',
      'Limited magazine',
    ],
    relatedSystems: ['AIM-9X', 'Patriot', 'MRIC'],
    featured: false,
    content: `## Overview

IFPC Increment 2 addresses the gap between short-range C-UAS systems and strategic air defense by providing capability against medium-sized threats.`,
  },
  {
    name: 'DroneSentry-C2',
    slug: 'dronesentry-c2',
    description: 'DroneShield command and control platform providing sensor-agnostic, AI-powered counter-UAS management.',
    category: 'c2',
    manufacturer: 'DroneShield',
    country: 'Australia',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7163851/1000w_q95.jpg',
    primaryCapability: 'Command and control platform integrating diverse sensors and effectors for counter-UAS operations.',
    specifications: [
      'Sensor-agnostic architecture',
      'AI-powered automation',
      'Browser-based interface',
      'Multi-site management',
    ],
    platforms: ['Software', 'Command Post'],
    deployedBy: ['Military', 'Law Enforcement', 'Critical Infrastructure'],
    inServiceDate: '2020',
    whatItIs: 'DroneSentry-C2 is DroneShield command and control software that integrates diverse sensors and effectors into a unified counter-UAS capability.',
    howItWorks: 'The platform aggregates data from multiple sensor types, applies AI for threat classification, and coordinates effector employment through a browser-based interface.',
    keyFeatures: [
      'Sensor agnostic',
      'AI-powered classification',
      'Browser-based operation',
      'Scalable architecture',
    ],
    advantages: [
      'Integrates any sensor',
      'Easy to deploy',
      'Commercial availability',
    ],
    disadvantages: [
      'Commercial focus',
      'Integration effort required',
    ],
    relatedSystems: ['RfPatrol Mk2', 'FAAD C2', 'Reactor'],
    featured: false,
    content: `## Overview

DroneSentry-C2 provides commercial and government users with flexible command and control for counter-UAS operations.`,
  },
  {
    name: 'CORIAN',
    slug: 'corian',
    description: 'Navy integrated air defense network disrupting drone signals, interoperable with FS-LIDS.',
    category: 'integrated',
    manufacturer: 'Naval Surface Warfare Center',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2302/7624897/1000w_q95.jpg',
    primaryCapability: 'Integrated counter-UAS capability for Navy fixed sites with FS-LIDS interoperability.',
    specifications: [
      'Signal disruption capability',
      'Integrated air defense network',
      'FS-LIDS interoperable',
      'Navy-specific configuration',
    ],
    platforms: ['Fixed Site'],
    deployedBy: ['US Navy'],
    inServiceDate: '2022',
    whatItIs: 'CORIAN is a Navy counter-UAS system that integrates with the broader air defense network and is interoperable with Army FS-LIDS.',
    howItWorks: 'The system disrupts drone control signals while integrating with the Navy air defense network for coordinated response.',
    keyFeatures: [
      'Joint interoperability',
      'Network integration',
      'Signal disruption',
    ],
    advantages: [
      'Interoperable with Army systems',
      'Integrated into Navy air defense',
    ],
    disadvantages: [
      'Fixed site only',
      'Limited information available',
    ],
    relatedSystems: ['FS-LIDS', 'DRAKE', 'FAAD C2'],
    featured: false,
    content: `## Overview

CORIAN provides the Navy with counter-UAS capability that integrates with both Navy air defense and joint Army systems.`,
  },
  {
    name: 'EnforceAir',
    slug: 'enforceair',
    description: 'D-Fend Solutions RF-based detection and mitigation system with cyber-takeover capabilities.',
    category: 'integrated',
    manufacturer: 'D-Fend Solutions',
    country: 'Israel',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'RF-based drone detection with cyber-takeover capability for controlled mitigation.',
    specifications: [
      'Passive RF detection',
      'Cyber-takeover capability',
      'Controlled landing',
      'Non-kinetic defeat',
    ],
    platforms: ['Fixed Site', 'Vehicle', 'Portable'],
    deployedBy: ['Various'],
    inServiceDate: '2018',
    detectionRange: '3+ km',
    whatItIs: 'EnforceAir is an Israeli counter-UAS system that detects drones via RF and can take control of them for safe, controlled landing.',
    howItWorks: 'The system passively detects drone RF signatures, identifies the drone type, then uses cyber techniques to take control and land the drone safely.',
    keyFeatures: [
      'Cyber-takeover capability',
      'Controlled landing',
      'Non-disruptive to other systems',
      'Forensic preservation',
    ],
    advantages: [
      'Controlled defeat preserves evidence',
      'No collateral damage',
      'Non-kinetic solution',
    ],
    disadvantages: [
      'Limited against autonomous drones',
      'Requires vulnerability in drone',
    ],
    combatRecord: 'Evaluated by US DOT&E for military applications.',
    relatedSystems: ['Drone Dome', 'DroneSentry'],
    featured: false,
    content: `## Overview

EnforceAir offers a unique capability to safely take control of hostile drones rather than simply destroying them.`,
  },
  {
    name: 'BOREADES',
    slug: 'boreades',
    description: 'French modular C2 system with SAPIENT protocol compliance integrating radar, RF, and jammers.',
    category: 'c2',
    manufacturer: 'CS GROUP',
    country: 'France',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7163851/1000w_q95.jpg',
    primaryCapability: 'Modular command and control for counter-UAS integrating diverse sensors and effectors.',
    specifications: [
      'SAPIENT protocol compliant',
      'Modular architecture',
      'Radar integration',
      'RF sensor integration',
      'Jammer coordination',
    ],
    platforms: ['Fixed Site', 'Vehicle'],
    deployedBy: ['French Armed Forces'],
    inServiceDate: '2016',
    whatItIs: 'BOREADES is a French C2 system that integrates diverse counter-UAS sensors and effectors using standardized protocols.',
    howItWorks: 'The system aggregates data from radars, RF sensors, and other detectors, then coordinates jamming and other effectors through a unified interface.',
    keyFeatures: [
      'SAPIENT standard compliance',
      'Modular integration',
      'Multi-sensor fusion',
    ],
    advantages: [
      'Standardized integration',
      'Operational since 2016',
      'French industry support',
    ],
    disadvantages: [
      'Primarily French market',
    ],
    relatedSystems: ['PARADE', 'FAAD C2'],
    featured: false,
    content: `## Overview

BOREADES provides French forces with standardized command and control for counter-UAS operations.`,
  },
  {
    name: 'AirGuard',
    slug: 'airguard',
    description: 'Airsight drone detection platform identifying pilot location and flight path for civilian applications.',
    category: 'sensor',
    manufacturer: 'Airsight',
    country: 'Germany',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'Drone detection with pilot localization for airports, prisons, and critical infrastructure.',
    specifications: [
      'RF detection',
      'Pilot location identification',
      'Flight path tracking',
      'Multi-sensor fusion',
    ],
    platforms: ['Fixed Site'],
    deployedBy: ['Airports', 'Prisons', 'Critical Infrastructure'],
    inServiceDate: '2018',
    detectionRange: '5+ km',
    whatItIs: 'AirGuard is a commercial drone detection system designed for airports, prisons, and other critical infrastructure.',
    howItWorks: 'The system uses RF detection to identify drones and locate their operators, providing security personnel with actionable intelligence.',
    keyFeatures: [
      'Pilot location',
      'Flight path prediction',
      'Critical infrastructure focus',
    ],
    advantages: [
      'Operator location capability',
      'Commercial availability',
      'Purpose-built for civilian sites',
    ],
    disadvantages: [
      'Detection only',
      'No defeat capability',
    ],
    relatedSystems: ['DroneSentry', 'RfPatrol'],
    featured: false,
    content: `## Overview

AirGuard provides civilian critical infrastructure with drone detection capability tailored to their unique requirements.`,
  },
  {
    name: 'Iron Drone',
    slug: 'iron-drone',
    description: 'Airobotics autonomous interceptor drone that disables small drones without GPS or RF jamming.',
    category: 'effector',
    manufacturer: 'Airobotics',
    country: 'Israel',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2503/8939726/1000w_q95.jpg',
    primaryCapability: 'Autonomous drone interception without reliance on GPS denial or RF jamming.',
    specifications: [
      'Autonomous operation',
      'Visual tracking',
      'Physical intercept',
      'No GPS/RF jamming required',
    ],
    platforms: ['Ground Launcher'],
    deployedBy: ['Various'],
    inServiceDate: '2021',
    whatItIs: 'Iron Drone is an autonomous interceptor that physically defeats hostile drones without relying on GPS denial or RF jamming.',
    howItWorks: 'The interceptor launches automatically upon threat detection, uses visual tracking to approach the target, and physically disables it.',
    keyFeatures: [
      'Autonomous intercept',
      'Works against autonomous drones',
      'No jamming required',
    ],
    advantages: [
      'Effective against autonomous threats',
      'No RF interference',
      'Fully autonomous',
    ],
    disadvantages: [
      'One interceptor per target',
      'Recovery/reload requirements',
    ],
    relatedSystems: ['Roadrunner', 'Coyote'],
    featured: false,
    content: `## Overview

Iron Drone addresses the challenge of defeating autonomous drones that are immune to RF jamming.`,
  },
  {
    name: 'AS3 Surveyor',
    slug: 'as3-surveyor',
    description: 'Polish/Ukrainian low-cost interceptor using MEROPS systems for counter-UAS operations.',
    category: 'effector',
    manufacturer: 'AS3 / MEROPS',
    country: 'Poland',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2506/9090346/1000w_q95.jpg',
    primaryCapability: 'Low-cost drone intercept using MEROPS targeting system.',
    specifications: [
      'Cost: ~$15,000 per unit',
      'MEROPS integration',
      'Kinetic intercept',
    ],
    platforms: ['Ground Launcher'],
    deployedBy: ['Poland', 'Ukraine'],
    inServiceDate: '2025',
    whatItIs: 'AS3 Surveyor is a low-cost interceptor drone designed to affordably counter enemy UAS.',
    howItWorks: 'The system uses MEROPS targeting to guide the interceptor to hostile drones for kinetic defeat.',
    keyFeatures: [
      'Very low cost',
      'Combat proven design',
      'Simple operation',
    ],
    advantages: [
      'Affordable mass deployment',
      'Effective against diverse targets',
    ],
    disadvantages: [
      'Expendable system',
      'Limited range',
    ],
    combatRecord: 'Operational in Poland and Ukraine.',
    relatedSystems: ['Coyote', 'Sting'],
    featured: false,
    content: `## Overview

AS3 Surveyor provides an affordable intercept solution for nations facing large-scale drone threats.`,
  },
  {
    name: 'Sting',
    slug: 'sting',
    description: 'Wild Hornets NGO ultra-low-cost quad-rotor VTOL interceptor for Ukraine defense.',
    category: 'effector',
    manufacturer: 'Wild Hornets NGO',
    country: 'Ukraine',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2511/9398161/1000w_q95.jpg',
    primaryCapability: 'Ultra-low-cost drone interception using quad-rotor design.',
    specifications: [
      'Cost: ~$2,100 per unit',
      'Quad-rotor VTOL',
      'Kinetic intercept',
      'Simple construction',
    ],
    platforms: ['Ground'],
    deployedBy: ['Ukraine'],
    inServiceDate: '2024',
    whatItIs: 'Sting is an ultra-low-cost interceptor drone developed by volunteers to help Ukraine counter Russian drone attacks.',
    howItWorks: 'The simple quad-rotor design launches to intercept enemy drones, defeating them through collision.',
    keyFeatures: [
      'Extremely low cost',
      'Volunteer produced',
      'Mass producible',
    ],
    advantages: [
      'Cost-effective against expensive targets',
      'Simple to produce',
      'Rapid scaling',
    ],
    disadvantages: [
      'Limited capability',
      'Short range',
      'Expendable',
    ],
    combatRecord: 'Combat deployed in Ukraine.',
    relatedSystems: ['AS3 Surveyor', 'Coyote'],
    featured: false,
    content: `## Overview

Sting demonstrates how ultra-low-cost solutions can address the economics of counter-drone warfare.`,
  },
  {
    name: 'Bal Chatri',
    slug: 'bal-chatri',
    description: 'SOCOM dismounted counter-UAS system for special operations patrol use.',
    category: 'effector',
    manufacturer: 'Various',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2205/7169412/1000w_q95.jpg',
    primaryCapability: 'Dismounted counter-UAS capability for special operations forces on patrol.',
    specifications: [
      'Man-portable',
      'Patrol compatible',
      'Electronic warfare',
    ],
    platforms: ['Handheld', 'Man-portable'],
    deployedBy: ['US Special Operations Command'],
    inServiceDate: '2022',
    whatItIs: 'Bal Chatri is a dismounted counter-UAS system designed for special operations forces conducting patrol operations.',
    howItWorks: 'The system provides SOF operators with portable counter-UAS capability while maintaining their mobility and stealth.',
    keyFeatures: [
      'SOF-specific design',
      'Patrol compatible',
      'Low signature',
    ],
    advantages: [
      'Optimized for special operations',
      'Maintains mobility',
    ],
    disadvantages: [
      'Limited information available',
      'Specialized use',
    ],
    relatedSystems: ['Dronebuster', 'DroneDefender'],
    featured: false,
    content: `## Overview

Bal Chatri provides special operations forces with organic counter-UAS capability during dismounted operations.`,
  },
  {
    name: 'ThunderShield',
    slug: 'thundershield',
    description: 'Thales high-powered microwave system demonstrating operational potential against drone swarms.',
    category: 'effector',
    manufacturer: 'Thales',
    country: 'France',
    status: 'development',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'High-powered microwave defeat of drone swarms.',
    specifications: [
      'High-powered microwave',
      'Wide-area effects',
      'Counter-swarm capability',
    ],
    platforms: ['Vehicle', 'Fixed Site'],
    deployedBy: ['French Armed Forces'],
    inServiceDate: '2026',
    whatItIs: 'ThunderShield is Thales high-powered microwave system designed to defeat drone swarms through electromagnetic effects.',
    howItWorks: 'The system generates focused microwave energy to disable drone electronics across a wide area.',
    keyFeatures: [
      'Counter-swarm capability',
      'Wide-area effects',
      'Low cost per engagement',
    ],
    advantages: [
      'Defeats multiple targets',
      'Deep magazine',
      'European solution',
    ],
    disadvantages: [
      'Still in development',
      'Range limitations',
    ],
    relatedSystems: ['Leonidas', 'THOR', 'IFPC-HPM'],
    featured: false,
    content: `## Overview

ThunderShield represents Europe entry into the high-powered microwave counter-swarm market.`,
  },
  {
    name: 'NightFighter S',
    slug: 'nightfighter-s',
    description: 'Marine Corps portable counter-UAS system for expeditionary operations.',
    category: 'effector',
    manufacturer: 'Various',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2108/6766080/1000w_q95.jpg',
    primaryCapability: 'Portable counter-UAS for Marine Corps expeditionary forces.',
    specifications: [
      'Portable system',
      'Expeditionary design',
      'Electronic warfare',
    ],
    platforms: ['Portable', 'Man-portable'],
    deployedBy: ['US Marine Corps'],
    inServiceDate: '2021',
    whatItIs: 'NightFighter S is a portable counter-UAS system designed for Marine Corps expeditionary operations.',
    howItWorks: 'The system provides Marines with lightweight counter-UAS capability suitable for forward-deployed operations.',
    keyFeatures: [
      'Expeditionary design',
      'Lightweight',
      'Marine-specific',
    ],
    advantages: [
      'Rapid deployment',
      'Low logistics burden',
    ],
    disadvantages: [
      'Limited capability vs larger systems',
    ],
    relatedSystems: ['L-MADIS', 'Dronebuster'],
    featured: false,
    content: `## Overview

NightFighter S provides Marines with organic counter-UAS capability for expeditionary operations.`,
  },
  // HIGH-PRIORITY SYSTEMS FROM NOTEBOOKLM RESEARCH
  {
    name: 'SkyHunter',
    slug: 'skyhunter',
    description: 'U.S. variant of the Israeli Tamir interceptor missile, serving as the primary kinetic effector for the Marine Corps Medium-Range Intercept Capability (MRIC).',
    category: 'effector',
    manufacturer: 'Raytheon / Rafael',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/what-we-do/integrated-air-and-missile-defense/iron-dome-system/2020-02/images/irondome_hero_lg.jpg',
    primaryCapability: 'Short-to-medium range ground-based air defense interceptor for cruise missiles, UAS, and low-flying aircraft.',
    specifications: [
      'Derived from Iron Dome Tamir missile',
      'Cost: ~$180,800 per round (FY25)',
      'Ground-launched interceptor',
      'Active radar seeker',
      'Proximity fuse warhead',
    ],
    platforms: ['MRIC Launcher', 'Ground-based'],
    deployedBy: ['US Marine Corps'],
    inServiceDate: '2024',
    effectiveRange: '4-70 km',
    whatItIs: 'SkyHunter is the American variant of the Tamir interceptor used in Israel\'s Iron Dome system. It was selected as the primary kinetic kill mechanism for the U.S. Marine Corps\' Medium-Range Intercept Capability (MRIC) program to defend fixed sites against aerial threats.',
    howItWorks: 'SkyHunter uses an active radar seeker to home in on targets after launch. The missile is guided toward the threat and detonates its proximity-fused warhead near the target, destroying it with fragmentation. It integrates with the AN/TPS-80 G/ATOR radar for target acquisition.',
    keyFeatures: [
      'Proven Iron Dome heritage',
      'Active radar guidance',
      'Multi-target engagement capability',
      'Integration with G/ATOR radar',
      'Rapid reload capability',
    ],
    advantages: [
      'Combat-proven design from Iron Dome',
      'High intercept probability',
      'Effective against diverse aerial threats',
      'Scalable deployment',
    ],
    disadvantages: [
      'Cost per round (~$180K)',
      'Requires radar support infrastructure',
      'Limited magazine depth',
    ],
    combatRecord: 'Based on Tamir missile with extensive combat record in Israel intercepting thousands of rockets and drones.',
    relatedSystems: ['Iron Dome', 'MRIC', 'G/ATOR'],
    featured: true,
    content: `## Overview

SkyHunter represents the Americanization of Israel's highly successful Tamir interceptor missile. Selected by the Marine Corps for the Medium-Range Intercept Capability (MRIC) program, it provides a proven kinetic solution for defeating cruise missiles, UAS, and other aerial threats.

## Development History

The missile emerged from the U.S.-Israel co-production agreement for Iron Dome components. Raytheon partnered with Rafael to produce the interceptor domestically, ensuring supply chain security and allowing modifications for U.S. operational requirements.

## Technical Capabilities

SkyHunter employs:
- **Active Radar Seeker**: Autonomous terminal guidance
- **Proximity Fuse**: Optimal detonation timing
- **Agile Airframe**: High-G maneuverability for intercept

## MRIC Integration

The Marine Corps awarded Raytheon a $25 million contract in August 2024 for 80 SkyHunter missiles to support initial platoon-level capability. Plans call for 12 MRIC platoons utilizing this interceptor alongside the G/ATOR radar.

## Cost Considerations

At approximately $180,800 per round (FY25 estimate), SkyHunter addresses the cost-curve challenge better than larger missiles like Patriot or SM-2, while providing effective kinetic defeat capability.`,
  },
  {
    name: 'DroneHunter F700',
    slug: 'dronehunter-f700',
    description: 'Autonomous interceptor drone that uses AI-guided nets to capture hostile UAS without kinetic destruction, minimizing collateral damage.',
    category: 'effector',
    manufacturer: 'Fortem Technologies',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2503/8939726/1000w_q95.jpg',
    primaryCapability: 'Autonomous pursuit and non-lethal capture of hostile drones using net-based interception.',
    specifications: [
      'Autonomous AI-guided flight',
      'Net capture system',
      'Parachute recovery of captured drones',
      '85% autonomous capture success rate',
      'Multi-drone coordination capable',
    ],
    platforms: ['Autonomous drone platform'],
    deployedBy: ['US Military', 'Commercial Security'],
    inServiceDate: '2020',
    whatItIs: 'DroneHunter F700 is an autonomous counter-drone interceptor that uses artificial intelligence to pursue and physically capture hostile UAS. Unlike kinetic effectors that destroy targets, it uses a net-based capture system to neutralize threats without creating debris.',
    howItWorks: 'The system uses AI algorithms to autonomously track and pursue hostile drones. Once in range, it deploys a capture net that entangles the target. The captured drone is then either towed to a safe location or lowered with a parachute, preventing damage to people or property below.',
    keyFeatures: [
      'Fully autonomous operation',
      'AI-guided pursuit and capture',
      'Non-destructive neutralization',
      'Forensic evidence preservation',
      'Safe for populated areas',
    ],
    advantages: [
      'No collateral damage from debris',
      'Preserves drone for forensic analysis',
      'Safe for use over populated areas',
      '85% capture success rate',
      'Can operate in GPS-denied environments',
    ],
    disadvantages: [
      'Limited to single-target engagement',
      'Weather dependent operations',
      'Target size limitations',
      'Requires launch infrastructure',
    ],
    combatRecord: 'Deployed for critical infrastructure protection and high-profile event security.',
    relatedSystems: ['FAAD C2', 'Lattice'],
    featured: true,
    content: `## Overview

DroneHunter F700 represents an innovative approach to counter-UAS operations by capturing rather than destroying hostile drones. This non-kinetic solution is particularly valuable in environments where collateral damage from debris is unacceptable.

## Autonomous Operation

The system employs sophisticated AI algorithms that enable:
- **Autonomous Detection**: Integration with ground-based sensors
- **Pursuit Logic**: Optimal intercept trajectory calculation
- **Capture Execution**: Precision net deployment

## Capture Technology

Unlike jammers or kinetic interceptors, DroneHunter physically captures targets using a specialized net system. Once captured, the target can be:
1. Towed to a designated safe area
2. Lowered with an integrated parachute
3. Retrieved for forensic examination

## Operational Advantages

The 85% autonomous capture success rate makes DroneHunter effective for protecting sensitive facilities where traditional kinetic options pose risks. It is integrated with the FAAD C2 architecture, allowing coordinated employment alongside other C-UAS systems.

## Use Cases

Ideal deployment scenarios include:
- Airports and aviation facilities
- Stadiums and large public events
- Critical infrastructure
- Urban environments`,
  },
  {
    name: 'Lattice',
    slug: 'lattice',
    description: 'AI-powered operating system and mission control platform from Anduril that enables sensor fusion, autonomous operations, and multi-asset command across C-UAS architectures.',
    category: 'c2',
    manufacturer: 'Anduril Industries',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7163851/1000w_q95.jpg',
    primaryCapability: 'Software platform providing sensor fusion, autonomous mission control, and multi-domain situational awareness for counter-UAS operations.',
    specifications: [
      'Real-time sensor fusion engine',
      'Multi-asset autonomous control',
      'AI/ML threat classification',
      'Scalable cloud architecture',
      'API integration capability',
    ],
    platforms: ['Software Platform', 'Cloud/Edge'],
    deployedBy: ['US Military', 'US Border Patrol', 'Allied Nations'],
    inServiceDate: '2019',
    whatItIs: 'Lattice is Anduril\'s proprietary operating system that serves as the "brain" of autonomous defense systems. It provides real-time sensor fusion, AI-driven decision support, and the ability to control multiple autonomous assets from a single interface.',
    howItWorks: 'Lattice ingests data from diverse sensors (radar, EO/IR, RF) and uses machine learning algorithms to fuse this information into a unified operational picture. Operators can then command autonomous systems like drones and ground sensors through the platform, with AI handling routine tasks and flagging threats for human decision.',
    keyFeatures: [
      'Real-time multi-sensor fusion',
      'Single-operator multi-asset control',
      'AI-powered threat identification',
      'Autonomous mission execution',
      'Modular architecture',
    ],
    advantages: [
      'Reduces operator workload',
      'Accelerates kill chain timeline',
      'Scalable to large operations',
      'Continuous AI improvement',
    ],
    disadvantages: [
      'Proprietary ecosystem',
      'Integration complexity with legacy systems',
      'Requires significant training',
    ],
    combatRecord: 'Deployed for border security, ISR missions, and base defense operations.',
    relatedSystems: ['Ghost drone', 'Altius', 'Sentry Tower'],
    featured: true,
    content: `## Overview

Lattice represents Anduril's vision for AI-enabled military operations: a software platform that can fuse sensor data, coordinate autonomous systems, and accelerate human decision-making across the kill chain.

## Architecture

The platform operates on three levels:
1. **Edge Processing**: Local AI at sensor nodes
2. **Fusion Engine**: Central data integration
3. **Command Interface**: Operator decision support

## Sensor Fusion

Lattice excels at combining disparate sensor inputs into coherent tracks:
- Radar returns
- RF signatures
- Electro-optical imagery
- Acoustic detections

## Autonomous Control

A single operator using Lattice can simultaneously control multiple autonomous assets including:
- Ghost reconnaissance drones
- Altius strike platforms
- Sentry surveillance towers

## C-UAS Application

For counter-drone missions, Lattice provides:
- Automated threat detection and classification
- Optimal effector selection recommendations
- Engagement authorization workflows
- Battle damage assessment

## Ecosystem Considerations

While powerful, Lattice operates as a vertically integrated system. Organizations must weigh its capabilities against the benefits of open architectures like SAPIENT for multi-vendor interoperability.`,
  },
  {
    name: 'DedroneTracker',
    slug: 'dedronetracker',
    description: 'AI/ML-driven command and control platform providing single-pane-of-glass airspace security through multi-sensor fusion and automated threat response.',
    category: 'c2',
    manufacturer: 'Dedrone (Axon)',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7163851/1000w_q95.jpg',
    primaryCapability: 'AI-powered C2 software for complete drone detection, tracking, identification, and mitigation workflow management.',
    specifications: [
      'AI/ML threat classification',
      'Identifies 200+ drone models',
      'Multi-sensor fusion (RF, radar, optical, acoustic)',
      'Cloud or on-premise deployment',
      'API integration for effectors',
    ],
    platforms: ['Software Platform', 'Cloud/On-Premise'],
    deployedBy: ['US Government', 'Commercial', 'International'],
    inServiceDate: '2014',
    whatItIs: 'DedroneTracker (also known as DedroneTracker.AI) is a comprehensive airspace security platform that uses artificial intelligence and machine learning to detect, track, identify, and help neutralize drone threats through a unified software interface.',
    howItWorks: 'The platform ingests data from multiple sensor types including RF analyzers, radars, acoustic sensors, and PTZ cameras. AI algorithms fuse this data to create unified tracks, classify threats against a database of 200+ known drone signatures, and can automatically cue mitigation systems for operator-authorized response.',
    keyFeatures: [
      'Single-pane-of-glass interface',
      'AI-powered threat identification',
      '200+ drone signature database',
      'Friend/foe discrimination',
      'Automated effector cueing',
    ],
    advantages: [
      'Vendor-agnostic sensor integration',
      'Rapid threat identification',
      'Flexible deployment options',
      'Proven commercial track record',
    ],
    disadvantages: [
      'Subscription-based licensing',
      'Requires quality sensor inputs',
      'Limited to supported effector integrations',
    ],
    combatRecord: 'Deployed at hundreds of sites globally including airports, stadiums, prisons, and government facilities.',
    relatedSystems: ['DroneDefender', 'FAAD C2'],
    featured: false,
    content: `## Overview

DedroneTracker represents one of the leading commercial C-UAS command and control platforms, trusted by hundreds of organizations worldwide for airspace security. Now part of Axon, Dedrone combines extensive drone intelligence with AI-powered operations.

## Platform Capabilities

The system manages the complete DTI-M (Detect, Track, Identify, Mitigate) workflow:

### Detection & Tracking
- RF sensor integration for drone communication detection
- Radar integration for flight path tracking
- Optical sensors for visual confirmation
- Acoustic sensors for audio signature detection

### Identification
DedroneTracker's AI engine can identify over 200 different drone models by their unique signatures, enabling rapid friend/foe discrimination.

### Mitigation
The platform integrates with various effectors and can automatically cue jamming systems, alert security personnel, or initiate other response protocols.

## Deployment Options

- **Cloud-hosted**: Secure SaaS deployment
- **On-premise**: Air-gapped server installation
- **Hybrid**: Combined approach for flexibility

## Use Cases

Dedrone protects:
- Airports and aviation infrastructure
- Correctional facilities
- Sports stadiums and entertainment venues
- Government buildings
- Critical infrastructure`,
  },
  {
    name: 'ODIN',
    slug: 'odin',
    description: 'Optical Dazzling Interdictor, Navy - shipboard directed energy system that blinds drone sensors to defeat ISR threats without kinetic destruction.',
    category: 'effector',
    manufacturer: 'US Navy',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2201/7017559/1000w_q95.jpg',
    primaryCapability: 'Non-destructive defeat of ISR drones by dazzling optical sensors with directed laser energy.',
    specifications: [
      'Low-power laser system',
      'Optical sensor dazzling',
      'Shipboard integration',
      '$261M R&D investment',
      'Low-rate production (2025)',
    ],
    platforms: ['Arleigh Burke-class destroyers', 'Surface combatants'],
    deployedBy: ['US Navy'],
    inServiceDate: '2025',
    whatItIs: 'ODIN (Optical Dazzling Interdictor, Navy), designated AN/SEQ-4, is a shipboard directed energy weapon that uses laser energy to "dazzle" or blind the optical sensors on hostile drones, preventing them from conducting surveillance or targeting.',
    howItWorks: 'Unlike high-energy lasers that burn through targets, ODIN uses lower power to overwhelm and blind drone cameras and sensors. By saturating optical systems with intense light, it renders ISR drones ineffective without physically destroying them, preserving the option for kinetic engagement if needed.',
    keyFeatures: [
      'Non-destructive defeat mechanism',
      'Counter-ISR specialization',
      'Unlimited magazine depth',
      'Low cost per engagement',
      'Scalable to fleet deployment',
    ],
    advantages: [
      'Defeats ISR mission without kinetic response',
      'Near-zero cost per shot',
      'No ammunition logistics',
      'Proportional response option',
    ],
    disadvantages: [
      'Does not destroy target',
      'Limited to optical sensor defeat',
      'Weather dependent',
      'Requires line of sight',
    ],
    combatRecord: 'Developed in response to drone surveillance threats; deployed on Navy destroyers.',
    relatedSystems: ['HELWS', 'DE M-SHORAD'],
    featured: true,
    content: `## Overview

ODIN represents the Navy's approach to the drone ISR problem: rather than expensive kinetic intercepts, use directed energy to blind drone sensors and deny the adversary intelligence. After $261 million in R&D, the system transitioned to low-rate production in 2025.

## Operational Concept

ODIN fills a unique niche in naval C-UAS:
1. **Detection**: Ship sensors identify approaching UAS
2. **Classification**: Threat assessed as ISR platform
3. **Engagement**: ODIN dazzles optical sensors
4. **Effect**: Drone cannot collect useful intelligence

## Technical Approach

Unlike high-energy lasers designed to destroy targets through thermal damage, ODIN uses lower power levels optimized for sensor disruption:
- Overwhelms camera CCDs
- Blinds targeting systems
- Prevents accurate surveillance

## Tactical Value

ODIN provides commanders with a proportional response option. Instead of launching missiles at every drone contact, ships can deny ISR collection while preserving kinetic options for confirmed threats.

## Fleet Integration

Deployed on Arleigh Burke-class destroyers, ODIN complements existing point defense systems like CIWS and RAM, adding a non-kinetic layer to shipboard defense.

## Cost Effectiveness

With effectively unlimited shots limited only by electrical power, ODIN dramatically improves the cost-exchange ratio compared to missile engagements against low-cost drones.`,
  },
  {
    name: 'Phaser',
    slug: 'phaser',
    description: 'High-Power Microwave (HPM) directed energy weapon designed to defeat drone swarms by frying electronics across a wide area with electromagnetic pulses.',
    category: 'effector',
    manufacturer: 'Raytheon',
    country: 'United States',
    status: 'development',
    imageUrl: 'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/rmd/what-we-do/counter-uas/effectors/phaser-high-power-microwave-system/2020-02/images/phaser_high_powered_hero_lg_0.jpg',
    primaryCapability: 'Area-effect defeat of multiple drones simultaneously through high-power microwave energy.',
    specifications: [
      'High-Power Microwave emitter',
      'Wide-area effect cone',
      'Multi-target simultaneous engagement',
      'Solid-state electronics',
      'Trailer or vehicle mounted',
    ],
    platforms: ['Trailer-mounted', 'Vehicle-mounted'],
    deployedBy: ['US Army', 'US Air Force'],
    whatItIs: 'Phaser is a High-Power Microwave (HPM) weapon system that emits concentrated electromagnetic energy to disable drone electronics. Unlike lasers that engage one target at a time, HPM can affect multiple drones simultaneously within its beam cone.',
    howItWorks: 'Phaser generates intense bursts of microwave energy directed at incoming threats. These electromagnetic pulses induce currents in drone electronics, causing component failure, navigation disruption, or complete system shutdown. The wide beam allows engagement of drone swarms that would overwhelm point-defense systems.',
    keyFeatures: [
      'Simultaneous multi-target defeat',
      'Wide area of effect',
      'Deep magazine (unlimited shots)',
      'Effective against swarms',
      'Non-kinetic defeat',
    ],
    advantages: [
      'Only viable counter-swarm solution',
      'Near-zero cost per engagement',
      'No ammunition constraints',
      'Rapid engagement cycle',
    ],
    disadvantages: [
      'May affect friendly electronics',
      'Range limitations',
      'Power generation requirements',
      'Less effective against hardened targets',
    ],
    relatedSystems: ['Leonidas', 'THOR', 'IFPC-HPM'],
    featured: true,
    content: `## Overview

Phaser represents Raytheon's entry into the High-Power Microwave counter-UAS market. As drone swarms emerge as a primary threat, HPM systems like Phaser offer the only practical solution for engaging dozens or hundreds of simultaneous targets.

## The Swarm Problem

Traditional air defense faces a fundamental challenge against swarms:
- Missiles: Limited magazine, high cost per shot
- Guns: Rate of fire insufficient for mass attacks
- Lasers: Engage one target at a time (dwell time)

HPM provides the answer: area-effect defeat of multiple targets simultaneously.

## Technical Principles

Phaser generates focused microwave energy that:
1. Penetrates drone airframes
2. Induces current in electronic circuits
3. Causes component failure or upset
4. Results in loss of control or destruction

## Integration

Phaser is a supported effector within the Army's Forward Area Air Defense Command and Control (FAAD C2) architecture, allowing coordinated employment with kinetic and EW systems.

## Operational Advantages

The "infinite magazine" concept makes HPM economically viable against mass drone attacks where the cost-exchange ratio would favor the attacker with traditional interceptors.

## Limitations

HPM systems can affect unshielded friendly electronics within the beam cone. Employment requires careful coordination and may restrict friendly drone operations in the engagement area.`,
  },
  {
    name: 'AN/TPS-80 G/ATOR',
    slug: 'gator',
    description: 'Ground/Air Task-Oriented Radar - multi-mission AESA radar providing air surveillance, air defense, and counter-fire capabilities for Marine Corps operations.',
    category: 'sensor',
    manufacturer: 'Northrop Grumman',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2310/8053964/1000w_q95.jpg',
    primaryCapability: 'Multi-mission active electronically scanned array radar for air surveillance, air defense, and counter-UAS target acquisition.',
    specifications: [
      'Active Electronically Scanned Array (AESA)',
      'Multi-mission capability',
      '360-degree coverage',
      'Simultaneous air and ground modes',
      'Expeditionary design',
    ],
    platforms: ['Trailer-mounted', 'Expeditionary'],
    deployedBy: ['US Marine Corps'],
    inServiceDate: '2018',
    whatItIs: 'The AN/TPS-80 Ground/Air Task-Oriented Radar (G/ATOR) is the Marine Corps\' premier multi-mission radar system. Using active electronically scanned array technology, it provides air surveillance, air defense fire control, and counter-fire target acquisition from a single expeditionary platform.',
    howItWorks: 'G/ATOR uses AESA technology to electronically steer radar beams without mechanical movement, enabling rapid multi-function operation. It can simultaneously track aircraft, cruise missiles, UAS, and incoming artillery while providing fire control quality tracks to air defense systems like MRIC.',
    keyFeatures: [
      'Multi-mission AESA radar',
      '360-degree surveillance',
      'Air defense fire control',
      'Counter-UAS detection',
      'Counter-fire capability',
    ],
    advantages: [
      'Replaces multiple legacy radars',
      'Reduced logistics footprint',
      'Advanced electronic protection',
      'High reliability solid-state design',
    ],
    disadvantages: [
      'High acquisition cost',
      'Power requirements',
      'Training complexity',
    ],
    combatRecord: 'Fielded with Marine Corps units; primary sensor for MRIC program.',
    relatedSystems: ['MRIC', 'SkyHunter', 'KURFS'],
    featured: false,
    content: `## Overview

The AN/TPS-80 G/ATOR represents a generational leap in Marine Corps ground-based radar capability. By consolidating multiple legacy systems into a single multi-mission platform, G/ATOR reduces the logistics burden while dramatically improving operational capability.

## Multi-Mission Capability

G/ATOR performs three critical functions:
1. **Air Surveillance**: Long-range detection and tracking
2. **Air Defense**: Fire control quality tracks for interceptors
3. **Counter-Fire**: Locating enemy artillery and mortars

## AESA Technology

Active Electronically Scanned Array technology enables:
- Instantaneous beam steering
- Multiple simultaneous functions
- Enhanced electronic protection
- High reliability with no moving parts

## MRIC Integration

G/ATOR serves as the primary sensor for the Medium-Range Intercept Capability (MRIC) program, providing target acquisition and fire control for SkyHunter interceptors.

## Counter-UAS Role

For drone defense, G/ATOR provides:
- Detection of low-RCS UAS targets
- Track quality sufficient for intercept
- Integration with C2 systems
- Persistent surveillance capability

## Expeditionary Design

Designed for Marine Corps expeditionary operations, G/ATOR is:
- Rapidly deployable
- Operable in austere environments
- Compatible with amphibious operations`,
  },
  // ADDITIONAL SYSTEMS FROM NOTEBOOKLM RESEARCH
  {
    name: 'ADSI',
    slug: 'adsi',
    description: 'Air Defense System Integrator - Air Force command and control system providing theater-level interoperability between joint air defense assets.',
    category: 'c2',
    manufacturer: 'US Air Force',
    country: 'United States',
    status: 'operational',
    imageUrl: undefined,
    primaryCapability: 'Theater-level air defense C2 interoperability, bridging Air Force and Army systems for unified air picture management.',
    specifications: [
      'Theater-level C2 system',
      'FAAD C2 interoperability',
      'Multi-service data correlation',
      'Joint air picture management',
    ],
    platforms: ['Fixed Site', 'Theater C2'],
    deployedBy: ['US Air Force', 'US Army'],
    whatItIs: 'ADSI (Air Defense System Integrator) is an Air Force-sponsored command and control system designed to facilitate theater-level interoperability between different air defense systems, serving as a bridge between Air Force and Army C2 architectures.',
    howItWorks: 'ADSI correlates data from multiple air defense sensors and systems across services, creating a unified air picture. It ensures seamless data sharing between the Air Force and Army systems, specifically designed to interoperate with FAAD C2.',
    keyFeatures: [
      'Theater-level integration',
      'Multi-service interoperability',
      'Air picture correlation',
      'FAAD C2 compatible',
    ],
    advantages: [
      'Enables joint operations',
      'Reduces fratricide risk',
      'Unified situational awareness',
    ],
    disadvantages: [
      'Complex integration requirements',
      'Legacy system dependencies',
    ],
    relatedSystems: ['FAAD C2', 'IBCS', 'MEDUSA C2'],
    featured: false,
    content: `## Overview

ADSI serves as the Air Force's solution for integrating air defense data across the joint force. Selected by the DoD as an interim C2 system for counter-small UAS alongside FAAD C2.

## Role in C-UAS

For counter-drone operations, ADSI:
- Correlates sensor data from multiple sources
- Bridges Air Force and Army C2 systems
- Enables theater-level coordination
- Supports joint engagement decisions`,
  },
  {
    name: 'AiON',
    slug: 'aion',
    description: 'Scalable counter-UAS command and control solution designed for edge and cloud operation with AI-powered decision aids.',
    category: 'c2',
    manufacturer: 'Northrop Grumman',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7163851/1000w_q95.jpg',
    primaryCapability: 'Scalable C-UAS command and control with AI decision support, operating on tactical edge hardware or cloud environments.',
    specifications: [
      'Edge and cloud compatible',
      'Tablet-based operation',
      'AI-powered decision aids',
      'Multi-site remote command',
      'Low-cost architecture',
    ],
    platforms: ['Tablet', 'Edge Hardware', 'Cloud'],
    deployedBy: ['US Military'],
    whatItIs: 'AiON is Northrop Grumman\'s scalable counter-UAS command and control solution, engineered to operate on tactical edge hardware like tablets or in cloud environments, enabling operators to command multiple sites remotely with AI-assisted decision-making.',
    howItWorks: 'AiON provides an intuitive user interface with AI-powered decision aids that reduce operator cognitive burden. It can run on lightweight tactical hardware for forward deployment or scale to cloud infrastructure for enterprise-level management of multiple C-UAS sites.',
    keyFeatures: [
      'AI decision support',
      'Edge/cloud flexibility',
      'Intuitive interface',
      'Multi-site management',
      'Low integration risk',
    ],
    advantages: [
      'Reduces operator workload',
      'Flexible deployment options',
      'Low cost and risk',
      'Rapid technology integration',
    ],
    disadvantages: [
      'Newer system with limited fielding',
      'Connectivity dependent for cloud mode',
    ],
    relatedSystems: ['FAAD C2', 'Lattice', 'DedroneTracker'],
    featured: false,
    content: `## Overview

AiON represents Northrop Grumman's modern approach to C-UAS command and control, emphasizing scalability, ease of use, and AI-assisted operations.

## Operational Flexibility

The system's ability to operate on both tactical edge hardware and cloud infrastructure provides flexible deployment options for diverse mission requirements.

## AI Integration

AiON's AI-powered decision aids help operators by prioritizing threats automatically and recommending optimal effector selection.`,
  },
  {
    name: 'Stinger FIM-92',
    slug: 'stinger-fim-92',
    description: 'Man-Portable Air-Defense System (MANPADS) surface-to-air missile serving as the primary short-range kinetic interceptor for multiple C-UAS platforms.',
    category: 'effector',
    manufacturer: 'Raytheon',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2305/7783422/1000w_q95.jpg',
    primaryCapability: 'Short-range air defense against aircraft, helicopters, and UAS using infrared homing guidance.',
    specifications: [
      'Infrared homing seeker',
      'Proximity fuse upgrade for C-UAS',
      'Man-portable or vehicle-mounted',
      'Range: 4.8 km',
      'Altitude: up to 3.8 km',
    ],
    platforms: ['Man-portable', 'M-SHORAD', 'MADIS', 'Avenger'],
    deployedBy: ['US Army', 'US Marine Corps', '30+ allied nations'],
    inServiceDate: '1981',
    effectiveRange: '4.8 km',
    whatItIs: 'The FIM-92 Stinger is the US military\'s primary man-portable air-defense system (MANPADS), a shoulder-fired surface-to-air missile that has been adapted for counter-UAS operations through proximity fuse upgrades.',
    howItWorks: 'Stinger uses passive infrared homing to track the heat signature of airborne targets. The operator acquires the target visually, the seeker locks on to the heat source, and upon firing the missile autonomously guides to intercept. Proximity fuse upgrades allow detonation near small drones.',
    keyFeatures: [
      'Fire-and-forget guidance',
      'Man-portable design',
      'Proven combat record',
      'Proximity fuse for C-UAS',
      'Multi-platform integration',
    ],
    advantages: [
      'Widely deployed and proven',
      'Low operator training burden',
      'Effective against diverse air threats',
      'Strong logistics support base',
    ],
    disadvantages: [
      'Limited effectiveness against small electric drones',
      'Cost per missile (~$38K)',
      'Replacement (NGSRI) in development',
    ],
    combatRecord: 'Extensive combat use from Afghanistan to Ukraine; credited with hundreds of aircraft kills since 1980s.',
    relatedSystems: ['M-SHORAD', 'MADIS', 'Avenger'],
    featured: false,
    content: `## Overview

The FIM-92 Stinger has been the backbone of US short-range air defense for over four decades. Originally designed to counter aircraft and helicopters, it has been adapted for the counter-UAS mission through technology upgrades.

## Evolution for C-UAS

Upgrades include proximity fuse capability for detonation near target without direct hit, and improved seeker sensitivity for small thermal signatures.

## Global Presence

Deployed by over 30 nations, Stinger has seen extensive combat from the Soviet-Afghan War to Ukraine.`,
  },
  {
    name: 'XM914 Chain Gun',
    slug: 'xm914-chain-gun',
    description: '30mm medium-caliber autocannon mounted on mobile air defense vehicles, utilizing proximity-fused ammunition for counter-UAS engagements.',
    category: 'effector',
    manufacturer: 'Northrop Grumman',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2404/8334521/1000w_q95.jpg',
    primaryCapability: 'High-volume kinetic defense against Group 1-2 UAS using programmable proximity-fused ammunition.',
    specifications: [
      '30mm caliber',
      '200 rounds/min rate of fire',
      'XM1198 proximity-fused ammo',
      'Programmable airburst capability',
      'Vehicle-mounted',
    ],
    platforms: ['Stryker (M-SHORAD)', 'JLTV (MADIS)'],
    deployedBy: ['US Army', 'US Marine Corps'],
    inServiceDate: '2021',
    whatItIs: 'The XM914 is a 30mm chain gun mounted on mobile air defense platforms like M-SHORAD and MADIS, providing kinetic defeat capability against small drones using advanced proximity-fused ammunition.',
    howItWorks: 'The gun fires XM1198 proximity-fused rounds that are programmed just before firing with the target\'s range. The rounds detonate near the target, releasing shrapnel that destroys the drone without requiring a direct hit.',
    keyFeatures: [
      'Programmable ammunition',
      'Proximity airburst capability',
      'High rate of fire',
      'Effective against small UAS',
      'Deep magazine',
    ],
    advantages: [
      'Lower cost per engagement than missiles',
      'Large ammunition capacity',
      'Effective against swarming threats',
      'Dual-use against ground targets',
    ],
    disadvantages: [
      'Slower rate of fire than Gatling systems',
      'Limited range vs missiles',
      'Ammunition logistics',
    ],
    relatedSystems: ['M-SHORAD', 'MADIS', 'Stinger FIM-92'],
    featured: false,
    content: `## Overview

The XM914 30mm chain gun provides the kinetic backbone of the Army's M-SHORAD and Marine Corps' MADIS systems.

## Proximity-Fused Ammunition

The key to the XM914's C-UAS effectiveness is the XM1198 ammunition that detonates at programmed distance, using shrapnel pattern to destroy drone without direct hit.`,
  },
  {
    name: 'DroneGun Tactical',
    slug: 'dronegun-tactical',
    description: 'Handheld rifle-shaped RF jamming device for dismounted counter-UAS operations, triggering drone fail-safe protocols.',
    category: 'effector',
    manufacturer: 'DroneShield',
    country: 'Australia',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2404/8335966/1000w_q95.jpg',
    primaryCapability: 'Handheld RF and GNSS jamming to disrupt drone control links and navigation, forcing fail-safe responses.',
    specifications: [
      'Rifle-shaped form factor',
      'RF link disruption',
      'GNSS jamming capability',
      'Directional antenna',
      'Battery powered',
    ],
    platforms: ['Handheld', 'Dismounted'],
    deployedBy: ['Military', 'Law Enforcement', 'Security'],
    whatItIs: 'DroneGun Tactical is a handheld, rifle-shaped radio frequency jamming device designed for dismounted operators to defeat hostile drones by disrupting their control links and GPS navigation.',
    howItWorks: 'The operator aims the DroneGun at the target drone and activates jamming. The device emits RF interference on common drone control frequencies and GNSS bands, triggering the drone\'s fail-safe protocol.',
    keyFeatures: [
      'Intuitive rifle-style operation',
      'Multi-band jamming',
      'Triggers fail-safe protocols',
      'Portable and lightweight',
      'No explosive ordnance',
    ],
    advantages: [
      'Simple operation',
      'Non-kinetic defeat',
      'No collateral damage',
      'Immediate effect',
      'Reusable',
    ],
    disadvantages: [
      'Line-of-sight required',
      'Limited range',
      'May affect friendly systems',
      'Less effective against autonomous drones',
    ],
    relatedSystems: ['DroneSentry-X', 'Dronebuster', 'DroneDefender'],
    featured: false,
    content: `## Overview

DroneGun Tactical represents the "rifle" category of handheld counter-drone jammers, providing dismounted operators with an intuitive point-and-shoot capability against UAS threats.

## Jamming Effect

When activated against a target drone, DroneGun disrupts the RF control link and jams GNSS signals, triggering the drone's programmed fail-safe.`,
  },
  {
    name: 'DroneSentry-X',
    slug: 'dronesentry-x',
    description: 'Vehicle-mounted or expeditionary detect-and-defeat system combining 360-degree RF detection with integrated jamming countermeasures.',
    category: 'integrated',
    manufacturer: 'DroneShield',
    country: 'Australia',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'Mobile detect-and-defeat C-UAS with integrated RF sensors and jamming effectors for on-the-move protection.',
    specifications: [
      '360-degree RF detection',
      'Integrated jamming system',
      'Vehicle or tripod mounted',
      'Ruggedized enclosure',
      'DroneSentry-C2 compatible',
    ],
    platforms: ['Vehicle-mounted', 'Tripod/Fixed'],
    deployedBy: ['Military', 'Security Forces'],
    whatItIs: 'DroneSentry-X is DroneShield\'s expeditionary detect-and-defeat solution, combining 360-degree RF detection sensors with integrated jamming countermeasures in a single ruggedized unit.',
    howItWorks: 'The system continuously scans for drone RF signatures across a 360-degree field. When a threat is detected, it automatically tracks the target and can initiate jamming to disrupt control links.',
    keyFeatures: [
      'Integrated detect and defeat',
      '360-degree coverage',
      'On-the-move capability',
      'Ruggedized design',
      'Tablet-based control',
    ],
    advantages: [
      'All-in-one solution',
      'Mobile protection',
      'Rapid deployment',
      'Autonomous detection',
    ],
    disadvantages: [
      'EW-only defeat mechanism',
      'Power requirements',
      'Limited against autonomous drones',
    ],
    relatedSystems: ['DroneSentry-C2', 'DroneGun Tactical', 'M-LIDS'],
    featured: false,
    content: `## Overview

DroneSentry-X provides expeditionary forces with integrated drone detection and defeat in a single deployable package.

## Deployment Modes

The system supports vehicle-mounted, tripod-mounted, and fixed installation configurations.`,
  },
  {
    name: 'Modi',
    slug: 'modi',
    description: 'Modular wearable electronic warfare system for disrupting drone communications and radio-controlled IEDs, primary effector for L-MADIS.',
    category: 'effector',
    manufacturer: 'Sierra Nevada Corporation',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2504/8998140/1000w_q95.jpg',
    primaryCapability: 'Wearable/vehicle-mounted EW system for disrupting drone control links and defeating radio-controlled IEDs.',
    specifications: [
      'Backpack or vehicle mounted',
      'Dual-use: C-UAS and C-IED',
      'Multi-band jamming',
      'Modular architecture',
      'Battery powered option',
    ],
    platforms: ['Backpack', 'Vehicle-mounted', 'L-MADIS (MRZR)'],
    deployedBy: ['US Marine Corps', 'US Army'],
    inServiceDate: '2020',
    whatItIs: 'Modi is Sierra Nevada Corporation\'s modular electronic warfare system designed for both counter-UAS and counter-IED missions. It serves as the primary non-kinetic defeat mechanism for the Marine Corps\' L-MADIS system.',
    howItWorks: 'Modi generates RF jamming signals across multiple frequency bands to disrupt drone command links and GPS navigation. Its dual-use capability also allows it to defeat radio-controlled improvised explosive devices.',
    keyFeatures: [
      'Dual C-UAS/C-IED capability',
      'Modular configuration',
      'Wearable option',
      'Multi-band coverage',
      'Combat proven',
    ],
    advantages: [
      'Dual-threat utility',
      'Flexible deployment',
      'DoD-selected solution',
      'Dismounted capability',
    ],
    disadvantages: [
      'Battery life limitations for portable use',
      'Less effective against autonomous drones',
      'May affect friendly communications',
    ],
    combatRecord: 'Deployed with Marine Corps units; selected by DoD as interim dismounted/handheld C-UAS solution.',
    relatedSystems: ['L-MADIS', 'DroneGun Tactical', 'DRAKE'],
    featured: false,
    content: `## Overview

Modi represents the U.S. military's approach to dismounted electronic warfare, providing Marines and soldiers with portable capability to defeat both drone and IED threats.

## L-MADIS Integration

Modi serves as the primary electronic warfare effector for the Marine Corps' Light-MADIS system.`,
  },
  {
    name: 'CORVUS-RAVEN',
    slug: 'corvus-raven',
    description: 'Lightweight portable electronic warfare system providing passive drone detection and situational awareness for dismounted soldiers.',
    category: 'sensor',
    manufacturer: 'L3Harris',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2404/8335966/1000w_q95.jpg',
    primaryCapability: 'Passive RF detection of drone threats at extended range with bearing indication for dismounted operators.',
    specifications: [
      'Passive RF detection',
      'Detection range: up to 4 km',
      'Threat bearing display',
      'Lightweight/portable',
      'Battle management integration',
    ],
    platforms: ['Man-portable', 'Dismounted'],
    deployedBy: ['US Military'],
    whatItIs: 'CORVUS-RAVEN is L3Harris\'s lightweight, portable electronic warfare system designed to give dismounted soldiers passive detection of drone threats at ranges up to 4 kilometers.',
    howItWorks: 'The system passively detects RF emissions from drones without emitting signals that could reveal the operator\'s position. When a drone is detected, it displays the bearing to the threat.',
    keyFeatures: [
      'Passive detection (no emissions)',
      'Extended detection range',
      'Bearing indication',
      'Lightweight design',
      'C2 integration',
    ],
    advantages: [
      'Does not reveal operator position',
      'Long detection range for size',
      'Simple operation',
      'Enables early warning',
    ],
    disadvantages: [
      'Detection only (no defeat)',
      'Dependent on drone RF emissions',
      'Cannot detect RF-silent drones',
    ],
    relatedSystems: ['DroneShield RfPatrol', 'Modi', 'ALPS'],
    featured: false,
    content: `## Overview

CORVUS-RAVEN addresses the critical need for dismounted troops to detect drone threats without sophisticated fixed infrastructure.

## Passive Advantage

Unlike active radar or jamming systems, CORVUS-RAVEN emits no detectable signals, maintaining operator concealment.`,
  },
  {
    name: 'DroneOptID',
    slug: 'droneoptid',
    description: 'AI-based computer vision software for detecting, classifying, and identifying specific drone models using electro-optical and infrared camera data.',
    category: 'sensor',
    manufacturer: 'DroneShield',
    country: 'Australia',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7163851/1000w_q95.jpg',
    primaryCapability: 'AI-powered visual drone detection, classification, and identification using EO/IR camera feeds.',
    specifications: [
      'AI/ML computer vision',
      'EO/IR camera integration',
      'Drone model identification',
      'Atmospheric compensation',
      'Multi-spectral fusion',
    ],
    platforms: ['Software', 'Integrated with cameras'],
    deployedBy: ['Military', 'Commercial Security'],
    whatItIs: 'DroneOptID is DroneShield\'s AI-based computer vision engine that uses artificial intelligence to detect, classify, and identify specific drone models from electro-optical and infrared camera imagery.',
    howItWorks: 'The software analyzes video feeds from EO/IR cameras using machine learning algorithms trained on drone imagery. It can detect drones in cluttered environments and identify specific models.',
    keyFeatures: [
      'AI-powered detection',
      'Model-level identification',
      'Environmental compensation',
      'Multi-spectral capability',
      'Continuous learning',
    ],
    advantages: [
      'Visual confirmation of threats',
      'Works in RF-denied environments',
      'Specific drone identification',
      'Complements RF detection',
    ],
    disadvantages: [
      'Weather/visibility dependent',
      'Requires quality camera inputs',
      'Processing requirements',
    ],
    relatedSystems: ['DroneSentry-C2', 'WESCAM MX-15D'],
    featured: false,
    content: `## Overview

DroneOptID represents the visual detection layer of modern C-UAS systems, using artificial intelligence to find and identify drones in camera imagery.

## AI Capabilities

The software provides detection, classification, identification, and tracking of drone targets.`,
  },
  {
    name: 'WESCAM MX-15D',
    slug: 'wescam-mx-15d',
    description: 'Multi-spectral electro-optical/infrared surveillance and targeting turret providing precision target acquisition for C-UAS systems.',
    category: 'sensor',
    manufacturer: 'L3Harris',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: 'Multi-spectral EO/IR surveillance and precision targeting for airborne and ground-based C-UAS applications.',
    specifications: [
      'Multi-spectral EO/IR sensors',
      '4-axis stabilization',
      'Laser designator/rangefinder',
      'Target tracking',
      'Multiple sensor payloads',
    ],
    platforms: ['VAMPIRE system', 'Aircraft', 'Ground vehicles'],
    deployedBy: ['US Military', 'Allied Nations'],
    whatItIs: 'The WESCAM MX-15D is a multi-spectral electro-optical/infrared turret system providing advanced surveillance and precision targeting. The MX-10 variant serves as the sensor payload for the VAMPIRE counter-UAS system.',
    howItWorks: 'The turret combines multiple sensors including daylight cameras, infrared imagers, and laser systems on a highly stabilized 4-axis gimbal. For C-UAS applications, it provides the visual tracking data needed to guide kinetic interceptors like APKWS rockets.',
    keyFeatures: [
      'Multi-spectral imaging',
      'High stabilization',
      'Laser designation',
      'Precision tracking',
      'Platform versatility',
    ],
    advantages: [
      'Proven system with global deployment',
      'Multiple sensor integration',
      'Works from moving platforms',
      'Day/night capability',
    ],
    disadvantages: [
      'Weather dependent',
      'Line-of-sight limited',
      'High cost',
    ],
    combatRecord: 'Widely deployed; key targeting sensor for VAMPIRE systems currently operational in Ukraine.',
    relatedSystems: ['VAMPIRE', 'APKWS II', 'DroneOptID'],
    featured: false,
    content: `## Overview

The WESCAM MX-Series represents L3Harris's family of multi-spectral surveillance and targeting systems.

## VAMPIRE Integration

The MX-10 variant serves as the targeting sensor for the VAMPIRE system, providing guidance data for APKWS rockets.`,
  },
  {
    name: 'Giraffe 1X',
    slug: 'giraffe-1x',
    description: 'Swedish 3D surveillance and air defense radar providing target acquisition data for integrated C-UAS architectures.',
    category: 'sensor',
    manufacturer: 'Saab',
    country: 'Sweden',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7164170/1000w_q95.jpg',
    primaryCapability: '3D air surveillance and target acquisition radar for short-range air defense and C-UAS applications.',
    specifications: [
      '3D AESA radar',
      'Air surveillance mode',
      'Target acquisition capability',
      'Networked operation',
      'Mobile deployment',
    ],
    platforms: ['Vehicle-mounted', 'Trailer'],
    deployedBy: ['US Army', 'Allied Nations'],
    whatItIs: 'The Giraffe 1X is Saab\'s 3D surveillance and air defense command and control radar, providing air surveillance and target acquisition data for short-range air defense systems including C-UAS architectures.',
    howItWorks: 'The radar uses active electronically scanned array (AESA) technology to provide 3D surveillance of the airspace. It is fully supported within the US Army\'s FAAD C2 architecture.',
    keyFeatures: [
      '3D AESA technology',
      'Multi-target tracking',
      'FAAD C2 integration',
      'Mobile configuration',
      'Proven reliability',
    ],
    advantages: [
      'NATO interoperability',
      'FAAD C2 compatible',
      'Flexible deployment',
      'Established logistics',
    ],
    disadvantages: [
      'Foreign system integration considerations',
      'Power requirements',
    ],
    relatedSystems: ['FAAD C2', 'KURFS', 'G/ATOR'],
    featured: false,
    content: `## Overview

The Giraffe radar family from Saab represents Sweden's contribution to allied air defense capabilities.

## FAAD C2 Integration

As a supported sensor within FAAD C2, Giraffe 1X provides surveillance tracks and enables cueing of organic effectors.`,
  },
  {
    name: 'ALPS',
    slug: 'alps',
    description: 'Army Long-Range Persistent Surveillance - passive sensor system providing early warning detection without emitting signals.',
    category: 'sensor',
    manufacturer: 'US Army',
    country: 'United States',
    status: 'operational',
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2312/8164058/1000w_q95.jpg',
    primaryCapability: 'Passive long-range surveillance and early warning without active emissions, cueing other sensors.',
    specifications: [
      'Passive detection',
      'Long-range surveillance',
      'Wide area scanning',
      'No active emissions',
      'Cue-to-track capability',
    ],
    platforms: ['Fixed Site', 'Semi-mobile'],
    deployedBy: ['US Army'],
    whatItIs: 'ALPS (Army Long-Range Persistent Surveillance) is a passive sensor system used for early warning detection, capable of scanning wide areas to identify potential threats without emitting signals that would reveal its location.',
    howItWorks: 'ALPS detects targets through passive means without actively transmitting. When threats are detected, ALPS cues active sensors like radar for precise tracking.',
    keyFeatures: [
      'Completely passive operation',
      'Long-range detection',
      'Wide area coverage',
      'Sensor cueing capability',
      'Low probability of intercept',
    ],
    advantages: [
      'Undetectable by adversary',
      'Persistent surveillance',
      'Early warning capability',
      'Complements active sensors',
    ],
    disadvantages: [
      'Less precise than active radar',
      'Weather/environment dependent',
      'Requires active sensor confirmation',
    ],
    relatedSystems: ['FAAD C2', 'KURFS', 'CORVUS-RAVEN'],
    featured: false,
    content: `## Overview

ALPS provides the US Army with passive surveillance capability, enabling detection of aerial threats without revealing the sensor's presence.

## Passive Advantage

In contested environments, passive sensors offer survivability by not emitting detectable signals.`,
  },

  // ============================================================
  // NEW FRIENDLY C-UAS SYSTEMS (42 additional)
  // ============================================================

  // ============================================================
  // US SYSTEMS
  // ============================================================
  {
    name: 'Coyote Block 1',
    slug: 'coyote-block-1',
    description: 'The original Raytheon Coyote expendable drone interceptor, a tube-launched small UAS designed for both reconnaissance and kinetic defeat of Group 1 drone threats.',
    category: 'effector',
    manufacturer: 'Raytheon (RTX)',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Kinetic intercept of small UAS targets using a tube-launched expendable drone with warhead.',
    specifications: [
      'Length: ~60 cm',
      'Weight: ~5.9 kg',
      'Endurance: ~60 minutes (ISR mode)',
      'Speed: ~60 knots cruise',
      'Warhead: Blast fragmentation',
      'Launch: Pneumatic tube or sonobuoy tube compatible',
    ],
    platforms: ['Ground-launched tube', 'Ship-launched', 'Sonobuoy canister'],
    deployedBy: ['US Army', 'US Navy'],
    inServiceDate: '2018',
    effectiveRange: '~5 km',
    whatItIs: 'Coyote Block 1 is the original variant of the Raytheon Coyote family of small expendable unmanned aircraft systems. Initially developed as a reconnaissance drone, it was adapted for the counter-UAS mission to provide a low-cost kinetic intercept capability against Group 1 drones.',
    howItWorks: 'The Coyote Block 1 is launched from a pneumatic tube launcher and guided toward the target using GPS waypoint navigation and a terminal seeker. On approach, its blast-fragmentation warhead detonates in proximity to the target UAS, destroying it. The system can also be used in a surveillance role with an onboard camera payload.',
    keyFeatures: [
      'Tube-launched for rapid deployment',
      'Dual-use ISR and kinetic intercept',
      'Low cost per round',
      'Compatible with multiple launch platforms',
      'GPS and terminal guidance',
    ],
    advantages: [
      'Very low cost compared to missiles',
      'Rapid reload capability',
      'Effective against Group 1 UAS',
      'Can be networked with detection radars',
    ],
    disadvantages: [
      'Single-use expendable munition',
      'Limited effectiveness against faster Group 2-3 UAS',
      'Requires external cueing from radar or EO sensor',
      'Shorter range than later Coyote variants',
    ],
    combatRecord: 'Deployed to the Middle East for base protection duties and used operationally against small drone threats.',
    relatedSystems: ['Coyote Block 2+', 'Coyote Block 3', 'FS-LIDS'],
    featured: false,
    content: `## Overview

Coyote Block 1 is the foundational variant of the Raytheon Coyote family, originally conceived as a small expendable reconnaissance drone that was later adapted for the counter-UAS mission. Weighing under six kilograms, it can be launched from a pneumatic tube and either loiter for ISR collection or fly a kinetic intercept profile against hostile small drones. It represented one of the earliest purpose-adapted kinetic defeat options for the US military's counter-small-UAS toolkit.

## Development History

The Coyote program began under the Office of Naval Research and Raytheon as a low-cost, expendable ISR platform capable of launch from sonobuoy tubes aboard Navy aircraft. As the small UAS threat emerged in Iraq and Syria in 2016-2017, the Army urgently needed affordable kinetic interceptors. Raytheon adapted the Coyote Block 1 airframe with a blast-fragmentation warhead, enabling it to physically destroy incoming drones. This dual-use heritage gave the program a rapid development timeline, leveraging an already mature air vehicle.

## Operational Concept

In the counter-UAS role, Coyote Block 1 is cued by external sensors such as the KURFS radar or an EO/IR tracker. Upon detection of an inbound threat, an operator launches the Coyote from its tube, and the interceptor navigates to the target area via GPS guidance. In the terminal phase, it uses onboard sensors to close on the threat and detonates its warhead in proximity. Multiple Coyotes can be launched in rapid succession to engage swarm threats.

## Future Development

Coyote Block 1 has been largely superseded by the more capable Block 2+ and Block 3 variants, which offer improved seekers, longer range, and enhanced warheads. However, the Block 1 remains in inventory and continues to serve as a training round and low-cost option. Lessons from Block 1 operations directly informed the design improvements in subsequent variants.`,
  },
  {
    name: 'JCUAS',
    slug: 'jcuas',
    description: 'The Joint Counter-Unmanned Aircraft Systems Office program to deliver a unified, service-wide counter-drone capability through a common command-and-control architecture.',
    category: 'c2',
    manufacturer: 'Various (Program Office: JCO)',
    country: 'United States',
    status: 'development',
    primaryCapability: 'Joint interoperability and unified command-and-control for counter-UAS operations across all military services.',
    specifications: [
      'Common C2 architecture',
      'Multi-sensor data fusion',
      'Cross-service interoperability',
      'Modular open systems approach (MOSA)',
      'Integration with existing air defense networks',
    ],
    platforms: ['Fixed', 'Mobile', 'Dismounted'],
    deployedBy: ['US Army', 'US Marine Corps', 'US Air Force', 'US Navy'],
    inServiceDate: '2025 (incremental fielding)',
    whatItIs: 'JCUAS is the Department of Defense program managed by the Joint Counter-small Unmanned Aircraft Systems Office (JCO) to standardize and unify counter-UAS capabilities across all military services. Rather than a single hardware system, it is an architecture and integration framework ensuring different sensors and effectors can interoperate seamlessly.',
    howItWorks: 'The JCUAS framework establishes common data standards, interfaces, and command-and-control protocols that allow any compliant sensor or effector to plug into a unified counter-UAS network. Threat data from radars, RF detectors, and EO/IR systems is fused into a common operating picture, enabling coordinated engagement by the most appropriate effector regardless of service branch.',
    keyFeatures: [
      'Common operating picture across services',
      'Modular open systems architecture',
      'Sensor and effector agnostic integration',
      'Rapid technology insertion capability',
      'Standardized training and doctrine',
    ],
    advantages: [
      'Eliminates service-specific stovepipes',
      'Enables best-of-breed sensor and effector selection',
      'Reduces duplication of effort and cost',
      'Accelerates fielding of new technologies',
    ],
    disadvantages: [
      'Complex multi-service coordination requirements',
      'Long acquisition timeline',
      'Integration challenges with legacy systems',
      'Depends on consensus across services',
    ],
    relatedSystems: ['FAAD C2', 'IBCS', 'MEDUSA C2'],
    featured: false,
    content: `## Overview

The Joint Counter-Unmanned Aircraft Systems (JCUAS) initiative represents the Department of Defense's effort to move beyond service-specific counter-drone solutions toward a unified, interoperable architecture. Managed by the Joint Counter-small Unmanned Aircraft Systems Office (JCO), the program aims to deliver a common command-and-control backbone that allows any compliant sensor or effector to participate in a joint counter-UAS fight.

## Background

As the small UAS threat proliferated across every theater, each military service developed its own counter-UAS solutions independently. The Army fielded FS-LIDS and M-LIDS, the Marines deployed MADIS, and the Air Force pursued its own programs. This led to interoperability gaps where systems from different services could not share data or coordinate engagements. In 2020, Congress directed the establishment of the JCO to resolve these issues and deliver a joint solution.

## Capabilities

JCUAS employs a modular open systems approach (MOSA) that defines standard interfaces for sensors, effectors, and command-and-control nodes. Any system meeting these interface standards can plug into the JCUAS network, enabling a true best-of-breed approach. The architecture supports multi-domain awareness, fusing data from ground-based radars, shipborne sensors, and airborne platforms into a single common operating picture.

## Future Development

The JCUAS program is being fielded incrementally, with initial capability deliveries focused on establishing the common C2 architecture and integrating the highest-priority existing systems. Future increments will expand the network to include emerging technologies such as directed energy weapons, AI-enabled autonomous engagement, and counter-swarm algorithms. The program represents the DoD's long-term vision for counter-UAS defense.`,
  },
  {
    name: 'SkyTracker',
    slug: 'skytracker',
    description: 'Liteye Systems SkyTracker is an RF-based drone detection and tracking system that passively identifies and geolocates UAS threats by analyzing their radio frequency emissions.',
    category: 'sensor',
    manufacturer: 'Liteye Systems',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Passive RF detection, classification, and tracking of commercial and modified UAS threats.',
    specifications: [
      'Passive RF detection',
      'Detection range: 5+ km',
      '360-degree azimuth coverage',
      'Drone and pilot geolocation',
      'Threat library with 200+ drone signatures',
      'Low size, weight, and power (SWaP)',
    ],
    platforms: ['Fixed site', 'Vehicle-mounted', 'Portable tripod'],
    deployedBy: ['US Army', 'US Air Force', 'US Border Patrol', 'Allied forces'],
    inServiceDate: '2016',
    detectionRange: '5+ km',
    whatItIs: 'SkyTracker is a passive RF detection system developed by Liteye Systems that identifies drones by detecting and analyzing the radio frequency communications between a UAS and its operator. It can simultaneously geolocate both the drone and its ground controller.',
    howItWorks: 'SkyTracker uses an array of RF antennas to passively scan the electromagnetic spectrum for known drone communication protocols. When it detects a signal matching its threat library of over 200 drone types, it triangulates the signal to determine the position of both the drone and its operator. The system provides this data to operators in real time and can cue other sensors or effectors for engagement.',
    keyFeatures: [
      'Passive detection leaves no electronic signature',
      'Simultaneous drone and pilot geolocation',
      'Extensive and updatable threat library',
      'Low power consumption',
      'Integrates with third-party effectors',
    ],
    advantages: [
      'No emissions that could reveal defensive positions',
      'Very low false alarm rate with protocol analysis',
      'Can locate the operator for law enforcement action',
      'Rapid deployment in portable configuration',
    ],
    disadvantages: [
      'Cannot detect autonomous drones without RF emissions',
      'Limited effectiveness against frequency-hopping spread spectrum',
      'Detection-only; requires separate effector',
      'Range limited by RF propagation environment',
    ],
    combatRecord: 'Widely deployed at US military installations domestically and overseas. Used by US Customs and Border Protection for border security operations.',
    relatedSystems: ['AUDS', 'DroneShield RfPatrol', 'DedroneTracker'],
    featured: false,
    content: `## Overview

Liteye Systems' SkyTracker is one of the most widely fielded passive RF drone detection systems in the US military inventory. By analyzing radio frequency emissions from commercial and modified drones, SkyTracker identifies, classifies, and tracks UAS threats while simultaneously geolocating the drone's operator on the ground. Its passive nature means it does not emit any signals that could reveal the location of defensive forces.

## Development History

Liteye Systems, based in Centennial, Colorado, originally developed SkyTracker for the commercial security market before adapting it for military use. The system gained prominence when the US Army selected it as part of its initial counter-UAS toolkit in 2016-2017, deploying units to installations both domestically and in combat theaters. The system has been continuously updated with new drone signatures as the threat landscape evolves.

## Operational Concept

SkyTracker operates as a passive sensor layer in a layered counter-UAS defense. Its RF antennas continuously scan the spectrum for signals matching known drone communication protocols. Upon detection, the system classifies the threat type and provides geolocation data for both the aircraft and its operator. This information can be used to cue active sensors like radars or EO/IR cameras for positive identification, or to direct effectors for engagement. In law enforcement applications, operator geolocation enables apprehension of the pilot.

## Future Development

Liteye continues to expand SkyTracker's threat library and improve its signal processing algorithms to address emerging threats including drones using encrypted or non-standard communication protocols. Integration with AI-based classification engines and expanded frequency coverage are planned upgrades.`,
  },
  {
    name: 'AUDS',
    slug: 'auds',
    description: 'The Anti-UAV Defence System (AUDS) is a combined detect-track-defeat counter-UAS system integrating radar, EO/IR tracking, and directional RF jamming into a single turret.',
    category: 'integrated',
    manufacturer: 'Liteye Systems / Chess Dynamics / Enterprise Control Systems',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Integrated detection, tracking, identification, and RF jamming defeat of small UAS threats.',
    specifications: [
      'Radar detection range: 10 km',
      'EO/IR tracking with thermal imager',
      'Directional RF inhibitor (jammer)',
      'Frequency bands: multiple drone control bands',
      'Rapid deployment time: <15 minutes',
      'Weight: ~100 kg (turret)',
    ],
    platforms: ['Fixed site', 'Vehicle-mounted', 'Tripod-mounted'],
    deployedBy: ['US DoD', 'UK Ministry of Defence', 'Coalition forces'],
    inServiceDate: '2016',
    detectionRange: '10 km',
    effectiveRange: '2+ km (jammer)',
    whatItIs: 'AUDS (Anti-UAV Defence System) is a fully integrated counter-UAS system developed by a consortium of British and American companies. It combines electronic scanning radar for detection, precision EO/IR cameras for tracking and identification, and a high-power directional RF jammer for non-kinetic defeat of drone threats.',
    howItWorks: 'The system uses its Blighter A400 series radar to detect small UAS targets at ranges up to 10 km. Once detected, the Chess Dynamics Hawkeye EO/IR camera system automatically slews onto the target for visual identification. If the target is confirmed hostile, the operator activates the Enterprise Control Systems directional RF inhibitor, which jams the drone control and GPS links, causing the drone to land or return to its launch point.',
    keyFeatures: [
      'All-in-one detect, track, identify, defeat',
      'Directional jamming minimizes collateral interference',
      'Day/night EO/IR tracking capability',
      'Automated slew-to-cue between sensors',
      'Compact form factor for rapid deployment',
    ],
    advantages: [
      'Complete kill chain in a single system',
      'Non-kinetic defeat avoids falling debris hazards',
      'Rapid setup time',
      'Combat-proven system',
    ],
    disadvantages: [
      'RF jamming ineffective against autonomous drones',
      'Limited against multiple simultaneous threats',
      'Requires spectrum management coordination',
      'Jammer range shorter than detection range',
    ],
    combatRecord: 'Deployed to Iraq and Syria by coalition forces starting in 2016, where it was credited with disrupting numerous ISIS drone attacks. Also used for protection of high-profile events and critical infrastructure.',
    relatedSystems: ['SkyTracker', 'DroneShield RfPatrol', 'Blighter A800'],
    featured: false,
    content: `## Overview

The Anti-UAV Defence System (AUDS) is a pioneering integrated counter-UAS solution that combines radar detection, electro-optical tracking, and directional RF jamming into a single, rapidly deployable turret. Developed by a consortium of three companies — Liteye Systems (US), Chess Dynamics (UK), and Enterprise Control Systems (UK) — AUDS was among the first purpose-built counter-drone systems to see operational combat deployment.

## Development History

AUDS emerged from a UK Ministry of Defence requirement for counter-drone capability in the mid-2010s. Chess Dynamics contributed its Hawkeye EO/IR tracking platform, Enterprise Control Systems provided its directional RF jamming technology, and Liteye Systems served as the US distributor and integrator. The system was rapidly fielded to Iraq in 2016 to combat the growing ISIS drone threat, where it became one of the first counter-UAS systems used in combat operations.

## Operational Concept

AUDS operates a three-phase kill chain. First, its electronic scanning radar detects small moving targets in the airspace and classifies potential UAS threats. The system then automatically cues its high-resolution EO/IR camera to the target for visual identification, giving the operator a clear picture of the threat. Once confirmed, the operator activates the directional RF inhibitor, which focuses jamming energy on the drone's control link and GPS receiver, disrupting the operator's ability to control the aircraft and forcing it to land or return home.

## Future Development

The AUDS consortium continues to evolve the system with improved radar processing, expanded jammer frequency coverage to address new drone communication protocols, and integration with kinetic effectors for threats that are resistant to RF jamming. Enhanced AI-based target classification is also being incorporated to reduce operator workload and improve response times against fast-moving threats.`,
  },
  {
    name: 'P-HEL',
    slug: 'p-hel',
    description: 'Palletized High Energy Laser — a 50 kW-class directed energy weapon designed for rapid deployment on standard military pallets, providing counter-UAS and counter-rocket capabilities.',
    category: 'effector',
    manufacturer: 'Raytheon / Kord Technologies',
    country: 'United States',
    status: 'development',
    primaryCapability: 'Directed energy defeat of UAS, rockets, artillery, and mortar threats using a high energy laser.',
    specifications: [
      'Laser power: 50 kW class',
      'Palletized for C-130 transport',
      'Beam director with precision tracking',
      'Power generation self-contained',
      'Compatible with standard 463L pallet',
      'Engagement range: several kilometers',
    ],
    platforms: ['Palletized (air-transportable)', 'Ground vehicle'],
    deployedBy: ['US Army'],
    inServiceDate: '2025 (planned)',
    effectiveRange: 'Several km',
    whatItIs: 'P-HEL (Palletized High Energy Laser) is a US Army program to field a 50 kW-class high energy laser weapon on a standard military pallet, enabling rapid air transport and deployment to any theater. The system is designed to provide an unlimited magazine, low cost-per-shot counter-UAS and counter-RAM (rockets, artillery, mortars) capability.',
    howItWorks: 'P-HEL uses a high-energy solid-state laser focused through a precision beam director to concentrate destructive energy on an incoming threat. The tracking system follows the target and holds the laser on a critical point until the target is disabled or destroyed. The entire system — laser, power supply, cooling, beam director, and fire control — is packaged on a standard 463L pallet for C-130 airlift.',
    keyFeatures: [
      'Unlimited magazine depth (limited only by power)',
      'Very low cost per engagement',
      'Rapid air deployment on standard pallet',
      'Silent and invisible engagement',
      'No explosive ordnance logistics',
    ],
    advantages: [
      'Near-zero cost per shot',
      'Deep magazine eliminates ammunition resupply concerns',
      'Speed of light engagement',
      'Minimal collateral damage',
    ],
    disadvantages: [
      'Performance degrades in rain, fog, dust, and smoke',
      'Requires significant electrical power',
      'Dwell time needed to defeat hardened targets',
      'Thermal management challenges',
    ],
    relatedSystems: ['HELWS', 'DE M-SHORAD', 'IFPC-HPM'],
    featured: false,
    content: `## Overview

The Palletized High Energy Laser (P-HEL) represents the US Army's push to field practical directed energy weapons for the counter-UAS and counter-RAM mission. By packaging a 50 kW-class laser and all supporting equipment onto a standard military pallet, P-HEL can be rapidly transported by C-130 aircraft and set up at forward locations within hours, providing an effectively unlimited magazine of laser engagements.

## Development History

P-HEL emerged from the Army's Rapid Capabilities and Critical Technologies Office (RCCTO) as part of the broader directed energy modernization effort. Raytheon and Kord Technologies developed the system building on experience from earlier laser demonstrators. The program aimed to bridge the gap between laboratory laser demonstrations and practical field-deployable systems by solving the packaging, power, and cooling challenges that had previously limited laser weapon deployability.

## Operational Concept

In operation, P-HEL is cued by external air defense sensors that detect an incoming threat. The system's beam director acquires and tracks the target, then the operator authorizes engagement. The high-energy laser beam is focused on the target's most vulnerable point — for drones, typically the airframe or propulsion system — and held there until the target is destroyed or disabled. Engagement times vary from fractions of a second for small drones to several seconds for more robust targets. The key operational advantage is that the system can engage indefinitely as long as it has electrical power.

## Future Development

The Army plans to scale P-HEL laser power to 100 kW and beyond as solid-state laser technology matures. Integration with the Integrated Air and Missile Defense Battle Command System (IBCS) will enable P-HEL to participate in the broader air defense network. Improved beam control and adaptive optics will enhance performance in challenging atmospheric conditions.`,
  },
  {
    name: 'DroneShield RfOne',
    slug: 'droneshield-rfone',
    description: 'DroneShield RfOne is a fixed-installation RF detection sensor providing continuous, autonomous drone detection and classification for perimeter security.',
    category: 'sensor',
    manufacturer: 'DroneShield',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Fixed-site passive RF detection and classification of UAS threats.',
    specifications: [
      'Passive RF detection',
      'Detection range: 5+ km',
      '360-degree coverage (with multiple units)',
      'Autonomous operation',
      'IP-rated weatherproof enclosure',
      'PoE (Power over Ethernet) capable',
    ],
    platforms: ['Fixed installation', 'Mast-mounted', 'Building-mounted'],
    deployedBy: ['US military', 'Allied forces', 'Critical infrastructure operators'],
    inServiceDate: '2019',
    detectionRange: '5+ km',
    whatItIs: 'DroneShield RfOne is a fixed-site RF drone detection sensor that passively monitors the radio frequency spectrum for drone communication signals. Designed for permanent installation at critical infrastructure, military bases, and airports, it provides continuous autonomous detection and classification of drone threats.',
    howItWorks: 'RfOne passively scans radio frequencies used by commercial and modified drones, analyzing signal characteristics to detect and classify UAS threats. Its onboard processing matches detected signals against a continuously updated library of known drone protocols. Multiple RfOne sensors can be networked together to provide overlapping coverage and geolocation through signal triangulation.',
    keyFeatures: [
      'Fully autonomous operation with no operator required',
      'Continuously updated drone signature library',
      'Network-ready for multi-sensor deployment',
      'All-weather outdoor operation',
      'Low maintenance and power requirements',
    ],
    advantages: [
      'Set-and-forget autonomous operation',
      'No RF emissions to reveal position',
      'Scales easily by adding sensors',
      'Low total cost of ownership',
    ],
    disadvantages: [
      'Cannot detect RF-silent autonomous drones',
      'Detection-only capability',
      'Range dependent on drone RF power output',
      'Requires integration with effectors for complete solution',
    ],
    relatedSystems: ['DroneShield RfPatrol', 'DroneSentry-C2', 'DroneSentry-X'],
    featured: false,
    content: `## Overview

DroneShield RfOne is a purpose-built fixed-installation RF drone detection sensor designed for persistent, autonomous monitoring of airspace around critical sites. Unlike handheld or portable RF detectors, RfOne is optimized for permanent deployment, operating continuously without human intervention while providing real-time alerts when drone activity is detected.

## Development History

DroneShield developed RfOne to complement its existing product line, which included the handheld RfPatrol and the integrated DroneSentry systems. RfOne was designed to fill the need for a cost-effective, standalone RF sensor that could be deployed in large numbers around a perimeter without the complexity of a full integrated C-UAS system. The sensor entered production in 2019 and has been adopted by military and civilian customers worldwide.

## Operational Concept

RfOne sensors are typically mounted on masts, poles, or building rooftops around a facility perimeter. Each sensor continuously scans the RF spectrum for drone communication signals, using advanced signal processing to distinguish drone transmissions from background radio traffic. When a drone is detected, the sensor classifies it by type and reports the detection to a central management system. Multiple RfOne units working in concert can triangulate the drone's position and track its movement in real time.

## Future Development

DroneShield continues to enhance RfOne with improved signal processing algorithms capable of detecting the latest drone communication protocols, including encrypted and frequency-hopping signals. Integration with AI-based classification engines and expanded frequency band coverage are ongoing development priorities. The sensor is also being offered as part of DroneShield's broader ecosystem of detection and defeat products.`,
  },
  {
    name: 'Silent Archer',
    slug: 'silent-archer',
    description: 'SRC Inc. Silent Archer is a mobile, integrated counter-UAS system combining 3D radar, EO/IR sensors, and electronic warfare effectors for detect-through-defeat capability.',
    category: 'integrated',
    manufacturer: 'SRC Inc.',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Mobile integrated detection, tracking, and electronic warfare defeat of UAS threats.',
    specifications: [
      '3D AESA radar',
      'EO/IR camera suite',
      'Electronic attack capabilities',
      'Vehicle-mounted or towable',
      'Rapid deployment: <30 minutes',
      'Detection range: 10+ km',
    ],
    platforms: ['Vehicle-mounted', 'Towable trailer'],
    deployedBy: ['US Army', 'US Air Force', 'Allied forces'],
    inServiceDate: '2019',
    detectionRange: '10+ km',
    effectiveRange: 'Several km (EW)',
    whatItIs: 'Silent Archer is SRC Inc.\'s mobile counter-UAS system that integrates the company\'s AN/TPQ-50-derived 3D AESA radar, electro-optical/infrared cameras, and electronic warfare effectors into a single deployable package. It provides a complete detect-through-defeat capability against Group 1-3 UAS threats.',
    howItWorks: 'Silent Archer uses its 3D radar to detect and track UAS targets at extended range, automatically cueing EO/IR cameras for positive identification. Once a threat is confirmed, the system employs electronic warfare techniques to jam the drone\'s control link and GPS navigation, neutralizing the threat without kinetic engagement. The system can be operated by a single person from a ruggedized control station.',
    keyFeatures: [
      'Complete kill chain in a single mobile system',
      'SRC AESA radar with proven performance',
      'Non-kinetic defeat minimizes collateral risk',
      'Single-operator capable',
      'Rapid deployment and teardown',
    ],
    advantages: [
      'Fully self-contained detection and defeat',
      'Highly mobile for tactical operations',
      'Proven radar technology',
      'Minimal logistics footprint',
    ],
    disadvantages: [
      'EW defeat limited against autonomous drones',
      'Single system coverage area limited',
      'Electronic warfare requires spectrum coordination',
      'No kinetic defeat option in base configuration',
    ],
    combatRecord: 'Deployed operationally for force protection at US military installations and exercises.',
    relatedSystems: ['FS-LIDS', 'AUDS', 'M-LIDS'],
    featured: false,
    content: `## Overview

Silent Archer is SRC Inc.'s answer to the mobile counter-UAS requirement, packaging proven radar, electro-optical, and electronic warfare technologies into a rapidly deployable system. As the maker of the KURFS radar and a key contributor to the FS-LIDS program, SRC leveraged its deep experience in counter-UAS sensing to create a self-contained solution that can deploy anywhere in under 30 minutes.

## Development History

SRC Inc., headquartered in Syracuse, New York, developed Silent Archer building on the technology foundation of its widely fielded AN/TPQ-50 series radars. The company recognized that many operational units needed a complete counter-UAS solution rather than individual sensor components, leading to the integration of radar, cameras, and electronic warfare into a single system. Silent Archer was first demonstrated in 2018 and entered operational service the following year.

## Operational Concept

Silent Archer is designed for rapid deployment to locations where UAS threats emerge. The system can be towed to a site and made operational in under 30 minutes by a small team. Once active, the 3D radar provides continuous surveillance of the surrounding airspace, automatically detecting and tracking potential UAS targets. Targets are handed off to the EO/IR suite for visual identification, and confirmed threats are engaged with electronic warfare effectors that disrupt the drone's ability to navigate and communicate.

## Future Development

SRC continues to enhance Silent Archer with improved radar waveforms for better small-target detection, expanded electronic warfare capabilities, and integration options for kinetic effectors. The company is also exploring AI-driven automation to reduce operator workload and improve reaction times against fast-evolving drone threats.`,
  },
  {
    name: 'Dedrone DedroneRF',
    slug: 'dedrone-dedronerf',
    description: 'Dedrone DedroneRF is a multi-band RF sensor designed for passive detection and classification of drones through analysis of radio frequency communications and signals.',
    category: 'sensor',
    manufacturer: 'Dedrone',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Passive RF-based drone detection and classification for airspace security.',
    specifications: [
      'Multi-band RF scanning',
      'Detection range: up to 5 km',
      'Passive operation',
      'AI-powered classification engine',
      'Drone protocol library: 300+ types',
      'Weatherproof outdoor housing',
    ],
    platforms: ['Fixed installation', 'Portable'],
    deployedBy: ['US DoD', 'Federal agencies', 'Airports', 'Critical infrastructure'],
    inServiceDate: '2017',
    detectionRange: 'Up to 5 km',
    whatItIs: 'DedroneRF is a passive RF sensor that detects and classifies drones by analyzing their radio frequency emissions. Part of the Dedrone ecosystem, it feeds detection data into the DedroneTracker command-and-control platform for integrated airspace awareness.',
    howItWorks: 'The sensor continuously monitors radio frequencies across multiple bands commonly used by drone control links, video downlinks, and telemetry. When a signal matching known drone protocols is detected, AI-powered algorithms classify the drone type and estimate its position. The data is fused with inputs from other sensors (radar, cameras, acoustic) in the DedroneTracker platform.',
    keyFeatures: [
      'AI-driven classification for high accuracy',
      'Extensive protocol library covering 300+ drone types',
      'Seamless integration with DedroneTracker C2',
      'Multi-sensor fusion capable',
      'Over-the-air library updates',
    ],
    advantages: [
      'Very high classification accuracy',
      'No emissions or spectrum authorization required',
      'Scalable from single sensor to large networks',
      'Low total cost of ownership',
    ],
    disadvantages: [
      'Cannot detect RF-silent drones',
      'Detection range varies with environment',
      'Sensor only — no defeat capability',
      'Performance affected by RF congestion in urban areas',
    ],
    relatedSystems: ['DedroneTracker', 'SkyTracker', 'DroneShield RfOne'],
    featured: false,
    content: `## Overview

Dedrone DedroneRF is a specialized RF sensor designed to passively detect and classify unmanned aircraft by analyzing their radio frequency emissions. As a core component of the Dedrone airspace security platform, DedroneRF provides the RF sensing layer that, combined with radar, cameras, and acoustic sensors, delivers comprehensive drone detection and tracking capability.

## Development History

Dedrone, originally founded in Germany and now headquartered in the United States, developed DedroneRF as part of its mission to secure airspace against unauthorized drone activity. The company was one of the first to apply machine learning to drone RF signal classification, building an extensive library of drone communication signatures. The sensor has been adopted by US federal agencies, military installations, airports, and critical infrastructure operators worldwide.

## Operational Concept

DedroneRF sensors are deployed around a protected area, either as standalone units or integrated into a multi-sensor network managed by the DedroneTracker platform. Each sensor passively scans the RF spectrum, using AI algorithms to identify signals associated with drone control links, video feeds, and telemetry. Classified detections are pushed to the central platform where they are fused with data from other sensor types to provide a comprehensive airspace picture. The system can automatically trigger alerts and cue cameras for visual confirmation.

## Future Development

Dedrone is investing in advanced signal processing to detect drones using encrypted, frequency-hopping, and custom communication protocols. The company is also expanding its sensor line with improved range and sensitivity, and deepening integration with effector systems for a complete detect-to-defeat capability.`,
  },
  {
    name: 'Teledyne FLIR R80D SkyRaider',
    slug: 'teledyne-flir-r80d-skyraider',
    description: 'The Teledyne FLIR R80D SkyRaider is a small multi-mission drone system used for reconnaissance, surveillance, and counter-UAS roles by deploying expendable payloads against hostile drones.',
    category: 'effector',
    manufacturer: 'Teledyne FLIR',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Counter-UAS intercept and ISR using a multi-rotor UAS platform carrying deployable payloads.',
    specifications: [
      'Type: Multi-rotor UAS',
      'Endurance: ~30 minutes',
      'Payload capacity: multiple deployable payloads',
      'EO/IR sensor suite',
      'GPS-denied navigation capability',
      'Man-portable and backpackable',
    ],
    platforms: ['Man-portable'],
    deployedBy: ['US Special Operations', 'US Army'],
    inServiceDate: '2021',
    effectiveRange: '~2 km',
    whatItIs: 'The R80D SkyRaider is a small multi-rotor drone developed by Teledyne FLIR that can carry and deploy payloads for counter-UAS intercept missions. It represents a drone-vs-drone approach to the counter-UAS problem, using an interceptor drone to physically neutralize hostile UAS threats.',
    howItWorks: 'SkyRaider is launched by a single operator and flies toward a detected drone threat, guided by an onboard sensor suite. It carries deployable counter-UAS payloads, including net-based capture devices or other effectors, which it uses to physically intercept and disable the hostile drone. The system can also perform ISR missions using its onboard cameras.',
    keyFeatures: [
      'Drone-on-drone intercept capability',
      'Multi-mission ISR and C-UAS',
      'Rapidly deployable by single operator',
      'Deployable payload flexibility',
      'EO/IR sensors for day/night operation',
    ],
    advantages: [
      'Mobile and man-portable',
      'Surgical defeat with minimal collateral risk',
      'Dual-use reconnaissance and C-UAS',
      'No spectrum management concerns for kinetic defeat',
    ],
    disadvantages: [
      'Limited endurance for persistent patrol',
      'Weather-dependent flight operations',
      'Single-threat engagement per sortie',
      'Requires operator piloting skill',
    ],
    relatedSystems: ['DroneHunter F700', 'Iron Drone', 'SkyHunter'],
    featured: false,
    content: `## Overview

The Teledyne FLIR R80D SkyRaider represents the emerging drone-on-drone approach to counter-UAS operations. Rather than relying on ground-based sensors and effectors, SkyRaider takes the fight to the airspace, using an operator-controlled multi-rotor platform to physically intercept and neutralize hostile drones. This approach offers unique advantages in terms of precision and minimized collateral effects.

## Development History

Teledyne FLIR developed the R80D SkyRaider as part of its expanding portfolio of small tactical UAS platforms. Building on the company's extensive experience in EO/IR sensor technology and small drone systems, SkyRaider was designed to address the growing need for a portable, rapidly deployable counter-UAS capability that could be carried and operated by individual soldiers or small teams. The system entered service in 2021 following successful demonstrations and evaluations.

## Capabilities

SkyRaider's multi-rotor platform provides stable flight characteristics ideal for intercept operations. The drone carries deployable payloads — including net-based capture systems — that allow it to disable hostile UAS without explosive ordnance. Its onboard EO/IR sensors provide the operator with real-time imagery for target identification and intercept guidance. When not performing counter-UAS missions, SkyRaider serves as a capable ISR platform for reconnaissance and surveillance.

## Future Development

Teledyne FLIR is developing enhanced autonomous flight capabilities for SkyRaider, including AI-assisted target tracking and autonomous intercept modes that reduce operator workload. Improved payloads and extended endurance through better battery technology are also in development.`,
  },
  {
    name: 'Windtalker',
    slug: 'windtalker',
    description: 'CACI International Windtalker is an electronic warfare system providing RF detection, geolocation, and electronic attack against UAS threats using advanced signal processing.',
    category: 'effector',
    manufacturer: 'CACI International',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Electronic warfare detection and defeat of UAS threats through RF signal manipulation.',
    specifications: [
      'Advanced signal processing',
      'Multi-band RF detection and jamming',
      'Precision geolocation',
      'Protocol-specific targeting',
      'Vehicle-mountable or fixed site',
      'Integrated operator interface',
    ],
    platforms: ['Vehicle-mounted', 'Fixed site', 'Transportable'],
    deployedBy: ['US DoD', 'Intelligence community'],
    inServiceDate: '2019',
    whatItIs: 'Windtalker is CACI International\'s electronic warfare system designed for the counter-UAS mission. It combines sophisticated RF detection and signal analysis with targeted electronic attack capabilities, allowing operators to detect, locate, and defeat drones using electronic means.',
    howItWorks: 'Windtalker detects drone RF emissions using wideband receivers and applies advanced signal processing algorithms to identify the specific communication protocols in use. Once a threat is classified, the system can deploy targeted electronic attack techniques — including jamming, protocol exploitation, and spoofing — to disrupt the drone\'s control link and navigation systems.',
    keyFeatures: [
      'Protocol-aware electronic attack',
      'Precision geolocation of drone and operator',
      'Targeted jamming minimizes collateral interference',
      'Rapid software updates for new threats',
      'Integration with broader air defense networks',
    ],
    advantages: [
      'Highly targeted electronic effects',
      'Can exploit specific drone vulnerabilities',
      'Continuous capability updates via software',
      'Minimal physical logistics burden',
    ],
    disadvantages: [
      'Limited against RF-silent autonomous drones',
      'Classified capabilities limit discussion',
      'Requires trained EW operators',
      'Effectiveness varies by drone type',
    ],
    relatedSystems: ['AUDS', 'Silent Archer', 'MEDUSA C2'],
    featured: false,
    content: `## Overview

CACI International's Windtalker brings advanced electronic warfare capabilities to the counter-UAS fight. Leveraging CACI's decades of experience in signals intelligence and electronic warfare, Windtalker provides military operators with the ability to detect, classify, geolocate, and electronically defeat drone threats using targeted RF techniques that go beyond simple broadband jamming.

## Development History

CACI International, a major US defense contractor with deep roots in signals intelligence and electronic warfare, developed Windtalker to address the Department of Defense's need for more sophisticated electronic counter-UAS capabilities. Traditional broadband jammers proved problematic in congested electromagnetic environments, creating demand for precision electronic attack systems that could target specific drone protocols without disrupting friendly communications. Windtalker was developed to fill this niche.

## Operational Concept

Windtalker operates by first detecting and analyzing drone RF emissions to determine the exact communication protocols in use. This protocol-level understanding enables the system to deploy highly targeted electronic attack techniques — rather than crude broadband jamming, Windtalker can exploit specific vulnerabilities in a drone's communication or navigation systems. This precision approach minimizes electromagnetic interference with friendly systems and allows operations in RF-congested environments.

## Future Development

CACI continues to evolve Windtalker's capabilities through software updates that address new drone communication protocols and platforms. The company is also working on enhanced automation and AI-driven threat classification to reduce the need for specialized electronic warfare operators. Integration with emerging C2 architectures like JCUAS is a priority.`,
  },
  {
    name: 'ML2S',
    slug: 'ml2s',
    description: 'Mobile Low, Slow, Small UAS Integrated Defeat System — a US Air Force mobile counter-UAS system designed to protect air bases and critical assets from small drone threats.',
    category: 'integrated',
    manufacturer: 'Various (USAF Program)',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Mobile detection and defeat of low, slow, and small UAS targets at Air Force installations.',
    specifications: [
      'Multi-sensor detection suite',
      'Radar and RF detection',
      'EO/IR tracking',
      'Electronic warfare defeat',
      'Vehicle-mounted mobile configuration',
    ],
    platforms: ['Vehicle-mounted'],
    deployedBy: ['US Air Force'],
    inServiceDate: '2020',
    whatItIs: 'ML2S (Mobile Low, Slow, Small) is the US Air Force variant of mobile counter-UAS systems designed specifically to address the threat from low-flying, slow-moving, small drones that conventional air defense radars often struggle to detect. It provides mobile protection for airbases and critical Air Force assets.',
    howItWorks: 'ML2S integrates multiple sensor types — radar optimized for small targets, RF detection, and EO/IR cameras — on a mobile platform. The sensor suite detects and tracks small UAS targets while electronic warfare effectors provide non-kinetic defeat capability. The system can relocate to address evolving threat patterns around air base perimeters.',
    keyFeatures: [
      'Optimized for low, slow, small UAS detection',
      'Mobile platform for flexible positioning',
      'Multi-sensor fusion reduces false alarms',
      'Electronic warfare defeat capability',
      'Integration with Air Force air defense networks',
    ],
    advantages: [
      'Purpose-built for small drone threats',
      'Mobility enables dynamic defense',
      'Multi-sensor approach improves detection reliability',
      'Air Force-specific integration',
    ],
    disadvantages: [
      'Limited against high-speed or high-altitude threats',
      'Electronic defeat limited against autonomous drones',
      'Requires trained operators',
      'Limited open-source information on capabilities',
    ],
    relatedSystems: ['FS-LIDS', 'M-LIDS', 'Silent Archer'],
    featured: false,
    content: `## Overview

ML2S, or Mobile Low, Slow, Small UAS Integrated Defeat System, is the US Air Force's solution for protecting airbases and critical assets from the growing threat of small commercial and modified drones. Unlike conventional air defense systems optimized for high-speed aircraft and missiles, ML2S is specifically designed to detect and defeat the low-flying, slow-moving, small unmanned aircraft that have become an increasing concern for base security.

## Development History

The US Air Force developed the ML2S requirement after recognizing that existing base defense systems were not optimized for the small UAS threat. Incidents of unauthorized drones near military airfields, combined with the demonstrated use of small drones in combat by adversaries, drove an urgent requirement for dedicated counter-UAS protection. The Air Force leveraged commercially available technologies and integrated them into a mobile package tailored to the air base defense mission.

## Operational Concept

ML2S operates as a mobile counter-UAS patrol capability, positioning around air base perimeters and critical facilities based on current threat assessments. The system's multi-sensor suite — combining radar optimized for small target detection, passive RF monitoring, and EO/IR cameras — provides layered detection that reduces false alarms while ensuring small drones are detected even at low altitudes. When threats are confirmed, electronic warfare effectors neutralize the drones without kinetic means.

## Future Development

The Air Force continues to refine ML2S capabilities as the small UAS threat evolves. Planned improvements include enhanced detection algorithms for emerging drone types, integration with base-wide security networks, and potential addition of kinetic defeat options for threats resistant to electronic warfare.`,
  },
  {
    name: 'Titan C-UAS',
    slug: 'titan-cuas',
    description: 'Titan C-UAS is a modular, scalable counter-UAS system combining AI-enabled sensor fusion with multiple effector options for layered defense against drone threats.',
    category: 'integrated',
    manufacturer: 'Ascent Vision Technologies',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'AI-enabled sensor fusion and multi-effector C-UAS defense.',
    specifications: [
      'AI-powered target detection and tracking',
      'Multi-sensor fusion (radar, RF, EO/IR)',
      'Multiple effector integration options',
      'Modular and scalable architecture',
      'Remote operation capability',
    ],
    platforms: ['Fixed', 'Vehicle-mounted', 'Portable'],
    deployedBy: ['US military', 'Allied forces'],
    inServiceDate: '2021',
    whatItIs: 'Titan C-UAS is Ascent Vision Technologies\' integrated counter-drone system that uses AI-powered sensor fusion to detect, track, and classify UAS threats, then engages them with integrated effectors including RF jamming, kinetic interceptors, or directed energy options depending on configuration.',
    howItWorks: 'The system fuses data from radar, RF sensors, and EO/IR cameras using AI algorithms that automatically detect, classify, and track UAS targets. Once a threat is confirmed, the operator selects from available effectors — electronic warfare, kinetic, or directed energy — based on the threat type and rules of engagement. AI-assisted tracking keeps effectors locked on target throughout engagement.',
    keyFeatures: [
      'AI-powered automatic detection and classification',
      'Multi-effector flexibility',
      'Modular architecture for mission tailoring',
      'Single-operator capable',
      'Open architecture for technology insertion',
    ],
    advantages: [
      'AI reduces operator workload and response time',
      'Configurable for different threat environments',
      'Scalable from single site to networked defense',
      'Proven in operational evaluations',
    ],
    disadvantages: [
      'AI classification requires training data updates',
      'Complex system integration',
      'Cost varies significantly by configuration',
      'Relatively new entrant in competitive market',
    ],
    relatedSystems: ['FS-LIDS', 'Silent Archer', 'AUDS'],
    featured: false,
    content: `## Overview

Ascent Vision Technologies' Titan C-UAS is a modular counter-drone system that leverages artificial intelligence to automate the detect-track-classify-defeat kill chain. By applying AI to sensor fusion and target classification, Titan reduces the time between detection and engagement while minimizing the burden on human operators — a critical capability when facing multiple simultaneous drone threats.

## Development History

Ascent Vision Technologies, based in Belgrade, Montana, built Titan on its existing expertise in stabilized camera systems and AI-powered tracking software. The company recognized that the counter-UAS market needed more automated solutions as drone swarms and coordinated attacks outpaced human operators' ability to respond. Titan was developed to provide AI-enabled automation while keeping a human in the loop for engagement decisions.

## Capabilities

Titan's core strength is its AI-powered sensor fusion engine, which combines inputs from radar, RF detection, and EO/IR cameras to build a comprehensive air picture. The AI automatically detects potential drone targets, classifies them by type and threat level, and recommends engagement options. Operators can approve engagements with a single action, dramatically reducing the kill chain timeline. The modular effector architecture allows different defeat mechanisms to be plugged in based on the operational environment.

## Future Development

Ascent Vision is developing enhanced AI capabilities for Titan, including counter-swarm algorithms that can prioritize and sequence engagements against multiple simultaneous threats. The company is also expanding its effector integration options and improving the system's ability to operate in GPS-denied environments.`,
  },
  {
    name: 'Black Dart',
    slug: 'black-dart',
    description: 'Black Dart is the US Navy\'s premier counter-UAS technology demonstration and operational evaluation exercise, now also associated with rapidly fieldable C-UAS capabilities.',
    category: 'integrated',
    manufacturer: 'US Navy / NAWCWD',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Counter-UAS technology evaluation, demonstration, and rapid fielding of operational C-UAS capabilities.',
    specifications: [
      'Multi-technology evaluation platform',
      'Live-fire testing capability',
      'Joint service participation',
      'Annual exercise series since 2002',
      'Evaluates detection, tracking, and defeat technologies',
    ],
    platforms: ['Various (evaluation program)'],
    deployedBy: ['US Navy', 'US DoD joint forces'],
    inServiceDate: '2002',
    whatItIs: 'Black Dart is the Department of Defense\'s longest-running counter-UAS exercise and technology evaluation program, managed by the Naval Air Warfare Center Weapons Division (NAWCWD). It evaluates emerging counter-UAS technologies in realistic scenarios and has evolved to include rapidly deployable operational C-UAS kits.',
    howItWorks: 'Black Dart conducts annual live-fire exercises where industry, government, and military participants test their counter-UAS technologies against realistic drone threats. The program evaluates sensors, effectors, and integrated systems, providing data-driven assessments that inform DoD acquisition decisions. Technologies that prove effective can be rapidly transitioned to operational units.',
    keyFeatures: [
      'Longest-running DoD C-UAS exercise program',
      'Live-fire evaluation against real drone targets',
      'Multi-service and multi-agency participation',
      'Direct technology transition pathway',
      'Comprehensive data collection and analysis',
    ],
    advantages: [
      'Real-world performance validation',
      'Accelerated technology transition',
      'Joint interoperability testing',
      'Informs DoD-wide C-UAS investment decisions',
    ],
    disadvantages: [
      'Exercise conditions may not replicate all operational scenarios',
      'Annual cycle limits evaluation frequency',
      'Classified results limit industry feedback',
      'Program rather than fielded system',
    ],
    relatedSystems: ['JCUAS', 'FS-LIDS', 'AUDS'],
    featured: false,
    content: `## Overview

Black Dart stands as the Department of Defense's most established counter-UAS evaluation program, running annually since 2002 — well before small drones became the pervasive battlefield threat they are today. Managed by the Naval Air Warfare Center Weapons Division (NAWCWD), Black Dart evaluates counter-UAS technologies from across industry and government in realistic live-fire scenarios, serving as both a proving ground for new systems and a pathway for rapid technology transition to operational forces.

## Development History

Black Dart began in 2002 as a small Navy exercise focused on evaluating the UAS threat and potential countermeasures. As the drone threat grew dramatically through the 2010s, the program expanded significantly, becoming a major joint service event involving hundreds of participants from the military, government agencies, and defense industry. The program played a key role in identifying and validating many of the counter-UAS technologies now fielded across the DoD.

## Operational Concept

Each Black Dart exercise creates realistic operational scenarios using a variety of UAS threat surrogates — from small commercial quadcopters to larger tactical drones. Participating systems are evaluated on their ability to detect, track, identify, and defeat these threats across different engagement scenarios. The data collected provides quantitative performance assessments that inform DoD acquisition decisions and help identify capability gaps requiring further development.

## Future Development

Black Dart continues to evolve its threat scenarios to match emerging challenges, including drone swarms, autonomous UAS, and coordinated multi-axis attacks. The program is increasingly focused on evaluating integrated, multi-domain counter-UAS architectures rather than individual technologies, reflecting the DoD's shift toward system-of-systems approaches.`,
  },
  {
    name: 'MORFIUS',
    slug: 'morfius',
    description: 'Lockheed Martin MORFIUS (Morphing Reusable Fast Inexpensive UAS System) is a high-speed expendable drone designed to defeat enemy UAS swarms using high-power microwave effects.',
    category: 'effector',
    manufacturer: 'Lockheed Martin',
    country: 'United States',
    status: 'development',
    primaryCapability: 'High-speed intercept and high-power microwave defeat of UAS swarms.',
    specifications: [
      'High-power microwave (HPM) payload',
      'High subsonic speed',
      'Tube-launched deployment',
      'Counter-swarm optimized',
      'Reusable airframe (design goal)',
      'Compact form factor',
    ],
    platforms: ['Tube-launched', 'Ground-based'],
    deployedBy: ['US DoD (planned)'],
    whatItIs: 'MORFIUS is Lockheed Martin\'s concept for a high-speed drone that carries a high-power microwave payload to defeat enemy UAS swarms. By flying into a swarm and emitting a powerful microwave pulse, a single MORFIUS can disable multiple drones simultaneously, offering a cost-effective counter-swarm capability.',
    howItWorks: 'MORFIUS is launched from a tube and flies at high speed toward a detected drone swarm. Upon reaching the swarm, it activates its high-power microwave emitter, generating an electromagnetic pulse that fries the electronics of nearby drones, causing them to crash. The concept aims for the airframe to be recoverable and reusable, reducing cost per engagement.',
    keyFeatures: [
      'Counter-swarm capability with single engagement',
      'High-power microwave defeat mechanism',
      'Cost-effective against mass drone attacks',
      'Rapid deployment from tube launcher',
      'Potential reusability',
    ],
    advantages: [
      'Can defeat multiple drones in single engagement',
      'Cost exchange ratio favorable against swarms',
      'Non-kinetic electronic defeat',
      'Rapid response time',
    ],
    disadvantages: [
      'Still in development and testing',
      'HPM effectiveness depends on target hardening',
      'Potential electromagnetic interference concerns',
      'Reusability goal technically challenging',
    ],
    relatedSystems: ['IFPC-HPM', 'Leonidas', 'Phaser'],
    featured: false,
    content: `## Overview

Lockheed Martin's MORFIUS (Morphing Reusable Fast Inexpensive UAS System) represents an innovative approach to the counter-swarm challenge: using a high-speed drone carrying a high-power microwave payload to disable entire groups of enemy drones in a single pass. In an era where adversaries can field large numbers of inexpensive drones, MORFIUS aims to restore the cost exchange ratio in favor of the defender.

## Development History

MORFIUS was developed by Lockheed Martin's Skunk Works division as part of the defense industry's response to the emerging drone swarm threat. The concept recognized that engaging individual drones in a swarm with missiles or even directed energy weapons would be cost-prohibitive and operationally challenging. By combining a fast, inexpensive drone airframe with a high-power microwave payload, MORFIUS offers the potential to defeat many drones with a single engagement.

## Operational Concept

In operation, MORFIUS would be cued by air defense radars or sensors that detect an incoming drone swarm. The MORFIUS drone is launched from a tube and accelerates to high speed, flying into the heart of the swarm. At the optimal moment, it activates its high-power microwave emitter, generating an intense electromagnetic pulse that disrupts and destroys the electronics of surrounding drones, causing them to lose control and crash. The design goal is for the MORFIUS airframe to survive the engagement and be recovered for reuse.

## Future Development

MORFIUS continues in development with Lockheed Martin refining the airframe, microwave payload, and concept of operations. Key challenges include ensuring the HPM payload is powerful enough to defeat hardened drone electronics, achieving the reusability goal, and integrating MORFIUS into broader air defense architectures. The system represents one of several novel counter-swarm concepts under DoD evaluation.`,
  },
  {
    name: 'CUAS MMHEL',
    slug: 'cuas-mmhel',
    description: 'The Counter-UAS Mobile Multi-Mission High Energy Laser is a US Army directed energy program integrating a high-power laser onto a Stryker vehicle for mobile C-UAS defense.',
    category: 'effector',
    manufacturer: 'Various (US Army program)',
    country: 'United States',
    status: 'development',
    primaryCapability: 'Vehicle-mounted high energy laser for mobile counter-UAS and counter-rocket/artillery/mortar defense.',
    specifications: [
      'Laser power: 50 kW+ class',
      'Platform: Stryker 8x8 vehicle',
      'Mobile and tactically deployable',
      'Precision tracking and beam control',
      'Self-contained power generation',
    ],
    platforms: ['Stryker vehicle'],
    deployedBy: ['US Army (planned)'],
    effectiveRange: 'Several km',
    whatItIs: 'CUAS MMHEL is a US Army directed energy program that mounts a 50 kW-class high energy laser on a Stryker armored vehicle, providing mobile Stryker Brigade Combat Teams with an organic counter-UAS and counter-RAM capability that offers an effectively unlimited magazine.',
    howItWorks: 'The system integrates a high-energy solid-state laser, beam director, power generation, and cooling systems onto a Stryker vehicle chassis. Guided by external air defense sensors or its own detection suite, the laser is aimed at incoming UAS or RAM threats and held on target until the threat is disabled. The vehicle-mounted configuration provides tactical mobility to maneuver with ground forces.',
    keyFeatures: [
      'Tactically mobile on Stryker platform',
      'Unlimited magazine depth',
      'Very low cost per engagement',
      'Speed of light engagement',
      'Organic to brigade combat teams',
    ],
    advantages: [
      'Moves with maneuver forces',
      'No ammunition logistics tail',
      'Extremely low cost per shot',
      'Silent engagement',
    ],
    disadvantages: [
      'Atmospheric attenuation in adverse weather',
      'Significant power and cooling requirements',
      'Dwell time against hardened targets',
      'Still in development/testing phase',
    ],
    relatedSystems: ['DE M-SHORAD', 'P-HEL', 'HELWS'],
    featured: false,
    content: `## Overview

The Counter-UAS Mobile Multi-Mission High Energy Laser (CUAS MMHEL) program represents the US Army's effort to mount practical directed energy weapons on tactical combat vehicles. By integrating a 50 kW-class laser onto the Stryker platform, MMHEL aims to give Stryker Brigade Combat Teams an organic capability to defeat drones and rockets with near-unlimited ammunition at near-zero cost per shot.

## Development History

MMHEL emerged from the Army's broader directed energy modernization initiative, which identified the need for mobile laser weapons that could accompany maneuver forces. Earlier programs demonstrated the feasibility of vehicle-mounted lasers, and MMHEL was designed to transition these demonstrations into an operationally useful capability. The Stryker was selected as the host platform due to its widespread fielding across Army brigade combat teams and its available space, weight, and power margins.

## Operational Concept

In tactical operations, MMHEL vehicles would be positioned within a Stryker formation to provide air defense against drone threats and incoming rockets or mortars. When cued by air defense sensors — either organic to the formation or networked from higher echelon systems — the laser acquires and engages incoming threats at the speed of light. The system can engage dozens of targets in rapid succession without needing to reload, making it particularly effective against swarm attacks or sustained rocket barrages.

## Future Development

The Army plans to increase MMHEL laser power to 100 kW and beyond as technology matures, and to integrate the system into the Integrated Air and Missile Defense architecture via IBCS. Long-term goals include autonomous engagement modes and multi-vehicle coordination for distributed laser defense.`,
  },
  {
    name: 'NASAMS',
    slug: 'nasams',
    description: 'The National Advanced Surface-to-Air Missile System (NASAMS) is a distributed, networked medium-range air defense system with proven capability against UAS targets.',
    category: 'integrated',
    manufacturer: 'Kongsberg / Raytheon (RTX)',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Medium-range integrated air defense with capability against aircraft, cruise missiles, and UAS targets.',
    specifications: [
      'Missile: AIM-120 AMRAAM (surface-launched)',
      'Also fires AIM-9X Sidewinder',
      'Radar: Sentinel AN/MPQ-64',
      'Range: 25+ km (AMRAAM)',
      'Distributed networked architecture',
      'Multiple launcher configurations',
    ],
    platforms: ['Vehicle-towed launchers', 'Fixed site'],
    deployedBy: ['US (National Capital Region)', 'Norway', 'Finland', 'Lithuania', 'Australia', 'Ukraine', '12+ nations'],
    inServiceDate: '1994',
    detectionRange: '75 km (radar)',
    effectiveRange: '25+ km',
    whatItIs: 'NASAMS (National Advanced Surface-to-Air Missile System) is a distributed, networked air defense system co-developed by Kongsberg Defence and Raytheon. While primarily designed for medium-range air defense against aircraft and cruise missiles, NASAMS has demonstrated effective capability against UAS targets and has been employed in the counter-UAS role in Ukraine.',
    howItWorks: 'NASAMS uses a distributed architecture where Sentinel radars detect and track targets, fire distribution centers coordinate engagements, and dispersed launchers fire surface-launched AIM-120 AMRAAM or AIM-9X missiles. The networked design allows sensors and launchers to be spread across a wide area while maintaining coordinated fire control. Against UAS, the system can engage larger drones at extended range.',
    keyFeatures: [
      'Distributed and networked architecture',
      'Multiple missile options (AMRAAM, Sidewinder)',
      'Proven combat record',
      'Scalable from battery to national defense',
      'Cooperative engagement capability',
    ],
    advantages: [
      'Long engagement range',
      'Battle-proven in Ukraine conflict',
      'Multiple missile options for cost optimization',
      'Widely fielded with strong logistics support',
    ],
    disadvantages: [
      'Missile cost too high for small drone targets',
      'Overkill for Group 1-2 UAS threats',
      'Requires significant support infrastructure',
      'Not optimized for low, slow, small targets',
    ],
    combatRecord: 'Supplied to Ukraine where it has been credited with successfully engaging Russian cruise missiles and UAS, including Shahed-136 one-way attack drones. Protects the US National Capital Region.',
    relatedSystems: ['Stinger FIM-92', 'IBCS', 'M-SHORAD'],
    featured: false,
    content: `## Overview

The National Advanced Surface-to-Air Missile System (NASAMS) is a medium-range air defense system co-developed by Norway's Kongsberg Defence and America's Raytheon that has emerged as a significant counter-UAS platform, particularly against larger Group 3 drones and one-way attack UAS. Originally designed for defense against aircraft and cruise missiles, NASAMS has proven highly effective against drone threats in combat in Ukraine.

## Development History

NASAMS was initially developed in the early 1990s as a joint Norwegian-American program to provide a modern, distributed air defense capability using the AIM-120 AMRAAM missile in a surface-launched configuration. The system entered service with Norway in 1994 and has since been adopted by over 12 nations. Its role expanded to include counter-UAS when the proliferation of medium and large drones created a threat that conventional short-range C-UAS systems could not address at sufficient range.

## Operational Concept

NASAMS employs a distributed architecture where multiple sensors, fire control nodes, and missile launchers are networked together across a defended area. The Sentinel AN/MPQ-64 radar detects and tracks targets, and fire distribution centers coordinate engagements across multiple dispersed launchers. Against UAS threats, NASAMS can engage larger drones at ranges exceeding 25 km, providing a medium-range layer of defense that complements shorter-range dedicated C-UAS systems. The ability to fire AIM-9X Sidewinder missiles in addition to AMRAAM provides a lower-cost option for some engagements.

## Future Development

The latest NASAMS III variant includes upgraded radars, new missile integration options, and enhanced networking capabilities. Kongsberg and Raytheon continue to optimize the system for the counter-UAS mission, including integration of lower-cost interceptors that improve the cost exchange ratio against drone targets.`,
  },
  {
    name: 'Phalanx CIWS',
    slug: 'phalanx-ciws',
    description: 'The Raytheon Phalanx Close-In Weapon System, a radar-guided 20mm Gatling gun system used for ship self-defense, with demonstrated capability against UAS and small boat threats.',
    category: 'effector',
    manufacturer: 'Raytheon (RTX)',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Autonomous close-in defense against anti-ship missiles, UAS, and surface threats using radar-guided 20mm cannon.',
    specifications: [
      'Weapon: M61A1 20mm Gatling gun',
      'Rate of fire: 4,500 rounds/minute',
      'Tracking radar: Ku-band',
      'Search radar: digital',
      'Effective range: 1.5 km',
      'Fully autonomous engagement capable',
    ],
    platforms: ['Naval vessels', 'Land-based (C-RAM)'],
    deployedBy: ['US Navy', 'US Army (C-RAM)', '25+ allied navies'],
    inServiceDate: '1980',
    detectionRange: '~5 km',
    effectiveRange: '~1.5 km',
    whatItIs: 'Phalanx CIWS (Close-In Weapon System) is the US Navy\'s last-ditch automated defense system, using a radar-guided 20mm Gatling gun to destroy incoming anti-ship missiles, aircraft, and increasingly UAS targets. The land-based C-RAM variant has been used for counter-rocket and counter-UAS defense at forward operating bases.',
    howItWorks: 'Phalanx uses its own search and track radars to autonomously detect, evaluate, track, and engage incoming threats without requiring external input. The system\'s closed-loop fire control radar tracks both the incoming target and the outgoing stream of 20mm rounds, automatically adjusting aim to bring fire onto target. Against UAS, Phalanx can engage small drone targets in its close-in defense zone.',
    keyFeatures: [
      'Fully autonomous engagement capability',
      'Self-contained sensor and weapon',
      'Extremely high rate of fire',
      'Combat-proven over four decades',
      'Continuous upgrades (Block 1B with EO/IR)',
    ],
    advantages: [
      'Decades of combat-proven reliability',
      'Fully autonomous last-ditch defense',
      'Effective against multiple threat types',
      'Widely fielded with global logistics support',
    ],
    disadvantages: [
      'Short effective range',
      'Limited magazine capacity',
      'Falling debris hazard over populated areas',
      '20mm round may be excessive for small drones',
    ],
    combatRecord: 'Extensively deployed worldwide on US and allied naval vessels. Land-based C-RAM variant deployed to Iraq and Afghanistan for base defense, engaging rockets, mortars, and UAS threats.',
    relatedSystems: ['LPWS', 'XM914 Chain Gun', 'NASAMS'],
    featured: false,
    content: `## Overview

The Phalanx Close-In Weapon System (CIWS) is one of the most iconic and widely deployed weapon systems in the world, serving as the last line of automated defense on US Navy and allied warships for over four decades. While originally designed to defeat anti-ship cruise missiles, the system's radar-guided 20mm Gatling gun has proven effective against UAS targets, and its land-based C-RAM variant has been used for counter-drone defense at forward operating bases.

## Development History

Phalanx was developed by General Dynamics (now Raytheon) in the 1970s and entered service with the US Navy in 1980. The system was the world's first autonomous close-in weapon system, designed to engage incoming missiles that penetrated all other defensive layers. Over its four-decade service life, Phalanx has been continuously upgraded, with the Block 1B variant adding electro-optical and infrared sensors for improved capability against surface targets, helicopters, and small UAS.

## Operational Concept

Phalanx operates autonomously, using its own search radar to scan for threats and its tracking radar to engage them. When a threat enters the engagement zone, the system automatically evaluates it, tracks it, and opens fire with its M61A1 20mm Gatling gun at 4,500 rounds per minute. The fire control system tracks both the target and the bullet stream, making real-time adjustments to walk the rounds onto the target. Against UAS, Phalanx Block 1B uses its EO/IR sensor to complement radar tracking for improved engagement of small, slow-moving drone targets.

## Future Development

Raytheon continues to upgrade Phalanx with improved processing, new engagement algorithms optimized for UAS targets, and enhanced sensor integration. The system is expected to remain in service for decades to come, complementing newer directed energy and missile-based defenses. The land-based C-RAM variant continues to evolve for the base defense and counter-UAS mission.`,
  },
  {
    name: 'CLAWS',
    slug: 'claws',
    description: 'Compact Laser Weapon System — a lightweight, portable directed energy weapon designed for counter-UAS defense at the individual or small unit level.',
    category: 'effector',
    manufacturer: 'Various US defense contractors',
    country: 'United States',
    status: 'prototype',
    primaryCapability: 'Lightweight directed energy defeat of small UAS targets at short range.',
    specifications: [
      'Laser power: 5-10 kW class',
      'Man-portable or light vehicle mountable',
      'Battery or generator powered',
      'Integrated tracking system',
      'Compact form factor',
    ],
    platforms: ['Man-portable', 'Tripod-mounted', 'Light vehicle'],
    deployedBy: ['US DoD (evaluation)'],
    effectiveRange: '~1 km',
    whatItIs: 'CLAWS (Compact Laser Weapon System) is a class of lightweight directed energy weapons designed to provide individual soldiers or small units with an organic counter-UAS laser capability. These systems trade the power of larger laser weapons for extreme portability and rapid deployment.',
    howItWorks: 'CLAWS systems use low-to-medium power solid-state lasers (typically 5-10 kW) focused through a compact beam director with an integrated tracking system. The operator acquires a drone target using optics or cued by external sensors, and the laser beam is held on the target until its structure, optics, or electronics are damaged enough to cause mission failure or destruction.',
    keyFeatures: [
      'Man-portable or easily transported',
      'Virtually unlimited shots with power supply',
      'Low cost per engagement',
      'Minimal collateral damage',
      'Silent operation',
    ],
    advantages: [
      'Extreme portability for dismounted operations',
      'No ammunition logistics',
      'Very precise engagement',
      'Low signature',
    ],
    disadvantages: [
      'Low power limits range and effectiveness',
      'Significantly affected by weather conditions',
      'Requires extended dwell time on target',
      'Limited against hardened or fast targets',
    ],
    relatedSystems: ['HELWS', 'P-HEL', 'THOR'],
    featured: false,
    content: `## Overview

The Compact Laser Weapon System (CLAWS) concept represents the push to miniaturize directed energy weapons to the point where individual soldiers or small units can carry and deploy them against drone threats. While larger laser systems like DE M-SHORAD and P-HEL offer greater power, their size restricts them to vehicle or pallet mounting. CLAWS aims to put laser capability directly in the hands of dismounted forces.

## Development History

Multiple US defense contractors have pursued compact laser weapon concepts under various programs and internal development efforts. The underlying technology has matured rapidly as solid-state laser efficiency has improved and component miniaturization has advanced. CLAWS-class systems represent the lower end of the directed energy power spectrum, typically in the 5-10 kW range, which is sufficient to defeat small commercial drones at short range.

## Operational Concept

In operation, a CLAWS-type system would be deployed by a small unit to provide point defense against drone threats. The operator — or an automated tracking system — acquires the incoming drone and directs the laser beam at it. The lower power of these compact systems means longer dwell times are needed compared to larger laser weapons, but against the thin-skinned, fragile structures of small commercial drones, even a few seconds of laser exposure can melt propellers, blind cameras, or destroy flight control electronics.

## Future Development

Advances in laser efficiency, battery technology, and beam control are steadily improving the capabilities of compact laser systems. As power levels increase and form factors shrink, CLAWS-class weapons may become standard equipment for counter-UAS defense at the squad or platoon level, providing a complementary layer to the larger laser and kinetic systems protecting higher echelons.`,
  },
  {
    name: 'LOCUST',
    slug: 'locust',
    description: 'Low-Cost UAV Swarming Technology — a US Navy program demonstrating the use of tube-launched drone swarms for offensive and counter-UAS saturation attack concepts.',
    category: 'effector',
    manufacturer: 'US Navy / ONR',
    country: 'United States',
    status: 'prototype',
    primaryCapability: 'Demonstration of tube-launched drone swarm technology for saturation attacks and counter-UAS swarming.',
    specifications: [
      'Coyote-based drone swarm elements',
      'Multi-tube launcher system',
      'Autonomous swarm coordination',
      'Rapid sequential launch capability',
      'GPS and inter-drone communication',
    ],
    platforms: ['Ground-launched multi-tube rack', 'Ship-mounted'],
    deployedBy: ['US Navy (demonstration)'],
    whatItIs: 'LOCUST (Low-Cost UAV Swarming Technology) is a US Navy Office of Naval Research program that demonstrated the capability to rapidly launch large numbers of small drones from tube launchers to form autonomous swarms. While primarily an offensive concept, the technology has direct application to counter-UAS operations through swarm-on-swarm engagement.',
    howItWorks: 'LOCUST uses multi-tube launchers to rapidly fire dozens of Coyote-class small drones in quick succession. Once airborne, the drones autonomously form into a swarm using inter-drone communication and AI-based coordination algorithms. The swarm can be directed against surface targets, air targets, or enemy drone swarms, with individual elements maneuvering cooperatively to overwhelm defenses.',
    keyFeatures: [
      'Rapid mass launch of drone swarms',
      'Autonomous swarm coordination',
      'Low cost per swarm element',
      'Scalable swarm size',
      'Counter-swarm application potential',
    ],
    advantages: [
      'Overwhelms point defenses through mass',
      'Very low cost per engagement',
      'Autonomous operation reduces operator burden',
      'Applicable to both offensive and defensive missions',
    ],
    disadvantages: [
      'Swarm coordination technology still maturing',
      'Limited individual drone capability',
      'Communication-dependent swarm cohesion',
      'Concept demonstration, not fielded system',
    ],
    relatedSystems: ['Coyote Block 1', 'MORFIUS', 'Roadrunner'],
    featured: false,
    content: `## Overview

LOCUST (Low-Cost UAV Swarming Technology) is a US Navy Office of Naval Research technology demonstration program that showcased the ability to rapidly launch and autonomously coordinate swarms of small, inexpensive drones. While primarily demonstrated as an offensive capability, LOCUST's swarming technology has direct relevance to the counter-UAS mission, where friendly drone swarms could be used to intercept and overwhelm enemy drone attacks.

## Development History

The LOCUST program was initiated by ONR to explore the military potential of drone swarm technology. Using modified Coyote small UAS as swarm elements, the program demonstrated rapid sequential launch from multi-tube launchers and autonomous swarm formation in flight. The demonstrations, conducted in the mid-2010s, proved that dozens of small drones could be launched in seconds and autonomously coordinate their flight paths using distributed algorithms.

## Operational Concept

In the counter-UAS context, LOCUST-type swarms could be launched to intercept incoming enemy drone swarms. The friendly swarm would autonomously distribute among the incoming threats, with individual elements maneuvering to intercept hostile drones through kinetic impact or proximity effects. The key advantage is mass — by fielding large numbers of inexpensive interceptors, the defender can match or exceed the attacker's numbers, a critical requirement against swarm attacks that overwhelm traditional point defense systems.

## Future Development

While LOCUST itself was a demonstration program, the technologies it proved — rapid mass launch, autonomous swarm coordination, and distributed decision-making — are being incorporated into operational programs across the DoD. The concept of using friendly swarms to counter enemy swarms remains an active area of research and development.`,
  },
  {
    name: 'Coyote BLOS',
    slug: 'coyote-blos',
    description: 'Coyote Beyond Line of Sight — an extended-range variant of the Raytheon Coyote interceptor designed to engage UAS threats at ranges beyond the visual and radar horizon.',
    category: 'effector',
    manufacturer: 'Raytheon (RTX)',
    country: 'United States',
    status: 'development',
    primaryCapability: 'Extended-range kinetic intercept of UAS threats beyond line of sight using enhanced guidance and datalinks.',
    specifications: [
      'Extended range over standard Coyote',
      'Beyond-line-of-sight datalink',
      'Enhanced seeker capability',
      'Tube-launched',
      'Compatible with IFPC launcher architecture',
    ],
    platforms: ['Ground-launched', 'IFPC launch platform'],
    deployedBy: ['US Army (planned)'],
    effectiveRange: 'Extended beyond standard Coyote variants',
    whatItIs: 'Coyote BLOS is an enhanced variant of the Raytheon Coyote interceptor family, designed to engage UAS threats at ranges beyond the line of sight of the launching unit. It incorporates improved guidance, a datalink for mid-course updates, and enhanced seekers for terminal engagement at extended ranges.',
    howItWorks: 'Coyote BLOS is launched from a tube and navigates to the target area using GPS guidance with mid-course updates received via a beyond-line-of-sight datalink. This allows it to be directed by forward observers or networked sensors that can see threats beyond the launcher\'s own sensor horizon. In the terminal phase, the enhanced seeker acquires and homes on the target for kinetic intercept.',
    keyFeatures: [
      'Extended engagement range',
      'Beyond-line-of-sight engagement capability',
      'Datalink for mid-course corrections',
      'Compatible with Coyote family launcher infrastructure',
      'Networked engagement concept',
    ],
    advantages: [
      'Extends defensive perimeter significantly',
      'Can engage threats before they reach defended area',
      'Leverages existing Coyote logistics and training',
      'Networked approach enables forward engagement',
    ],
    disadvantages: [
      'Requires robust datalink infrastructure',
      'Higher cost than standard Coyote variants',
      'Dependent on forward sensor cueing',
      'Still in development',
    ],
    relatedSystems: ['Coyote Block 1', 'Coyote Block 2+', 'Coyote Block 3', 'IFPC Increment 2'],
    featured: false,
    content: `## Overview

Coyote BLOS (Beyond Line of Sight) extends the engagement envelope of the Raytheon Coyote interceptor family to ranges beyond the visual and radar horizon of the launching unit. This capability is critical for engaging UAS threats — particularly larger Group 3 drones and one-way attack UAS — before they reach their intended targets, providing a forward defense layer that complements the shorter-range standard Coyote variants.

## Development History

Coyote BLOS emerged from operational lessons learned with earlier Coyote variants, which were effective but limited to line-of-sight engagements. As the UAS threat evolved to include longer-range one-way attack drones and standoff reconnaissance platforms, the need for an extended-range interceptor became clear. Raytheon developed the BLOS variant with enhanced guidance, a datalink for mid-course updates from networked sensors, and improved terminal seekers.

## Operational Concept

In the BLOS concept of operations, forward-deployed sensors — ground radars, airborne platforms, or networked ally systems — detect UAS threats beyond the line of sight of the launcher unit and transmit targeting data via secure datalinks. The Coyote BLOS is launched and guided to the intercept area using mid-course updates, then transitions to autonomous terminal guidance for the final engagement. This approach pushes the defensive perimeter outward, engaging threats at greater range and providing more reaction time for backup defenses.

## Future Development

Coyote BLOS is being developed as part of the broader Coyote family roadmap and is intended for integration with the IFPC (Indirect Fire Protection Capability) launcher architecture. Future enhancements may include improved seekers for all-weather engagement, enhanced resistance to countermeasures, and integration with AI-driven fire control systems for autonomous engagement of swarm threats.`,
  },
  {
    name: 'CHIMERA',
    slug: 'chimera',
    description: 'Counter Hostile Intelligence and Multi-Environment Reconnaissance Asset — a multi-mission counter-UAS and ISR system designed for contested environments.',
    category: 'integrated',
    manufacturer: 'US Army / RCCTO',
    country: 'United States',
    status: 'development',
    primaryCapability: 'Multi-environment counter-UAS detection and defeat with integrated reconnaissance capability.',
    specifications: [
      'Multi-sensor suite (radar, EO/IR, RF, acoustic)',
      'AI-enabled threat classification',
      'Multi-effector integration',
      'Electronic warfare capabilities',
      'Mobile and deployable configuration',
    ],
    platforms: ['Vehicle-mounted', 'Deployable'],
    deployedBy: ['US Army (development)'],
    whatItIs: 'CHIMERA (Counter Hostile Intelligence and Multi-Environment Reconnaissance Asset) is a US Army development program for an advanced multi-mission system that combines counter-UAS capabilities with intelligence collection and reconnaissance in contested electromagnetic environments.',
    howItWorks: 'CHIMERA integrates multiple sensor types — radar, electro-optical/infrared, radio frequency, and acoustic — with AI-powered processing to detect, classify, and track UAS threats across different environments. The system can operate in electronically contested conditions where GPS and communications may be degraded, using autonomous onboard processing to maintain capability.',
    keyFeatures: [
      'Multi-environment operational capability',
      'AI-enabled autonomous processing',
      'GPS-denied operation',
      'Dual-use C-UAS and ISR',
      'Resilient in contested EM environment',
    ],
    advantages: [
      'Operates in contested electromagnetic environments',
      'Dual-use reduces logistics burden',
      'AI automation enables rapid response',
      'Multi-environment capability',
    ],
    disadvantages: [
      'Still in development phase',
      'Complex multi-mission system',
      'May be too specialized for widespread fielding',
      'Limited public information available',
    ],
    relatedSystems: ['FS-LIDS', 'JCUAS', 'Silent Archer'],
    featured: false,
    content: `## Overview

CHIMERA (Counter Hostile Intelligence and Multi-Environment Reconnaissance Asset) represents the US Army's push toward multi-mission systems that can conduct counter-UAS operations while simultaneously performing intelligence collection and reconnaissance. Designed for contested environments where adversaries actively jam GPS and communications, CHIMERA emphasizes autonomous operation and resilient sensor processing.

## Development History

CHIMERA was developed under the Army's Rapid Capabilities and Critical Technologies Office (RCCTO) in response to lessons learned from modern conflicts where adversaries combine drone attacks with electronic warfare to degrade defensive capabilities. The program recognized that future counter-UAS systems must be able to operate effectively even when the electromagnetic environment is heavily contested, requiring greater autonomy and onboard processing.

## Capabilities

The system combines multiple sensor modalities — including radar, electro-optical/infrared cameras, radio frequency detectors, and acoustic sensors — with AI-powered fusion and classification algorithms. This multi-modal approach provides resilience against adversary countermeasures, as the system can continue to detect and track threats even if individual sensor types are jammed or degraded. The reconnaissance capability allows CHIMERA to characterize the threat environment and collect intelligence on adversary UAS operations.

## Future Development

CHIMERA is progressing through development and testing phases, with the Army evaluating its performance in realistic contested scenarios. Future development will focus on enhanced AI algorithms for autonomous operation, expanded effector integration, and networking with the broader air defense architecture. The multi-mission concept may serve as a model for future C-UAS system design.`,
  },
  {
    name: 'SKYNET Counter-Swarm',
    slug: 'skynet-counter-swarm',
    description: 'An AI-driven counter-swarm system under development by Army Futures Command designed to autonomously detect, classify, and coordinate engagement of multiple simultaneous UAS threats.',
    category: 'c2',
    manufacturer: 'US Army Futures Command',
    country: 'United States',
    status: 'development',
    primaryCapability: 'AI-powered autonomous command and control for counter-swarm UAS defense.',
    specifications: [
      'AI/ML-based threat assessment',
      'Autonomous engagement coordination',
      'Multi-sensor data fusion',
      'Counter-swarm algorithms',
      'Integration with existing effectors',
      'Real-time swarm behavior analysis',
    ],
    platforms: ['Software-defined (runs on existing C2 hardware)'],
    deployedBy: ['US Army (development)'],
    whatItIs: 'SKYNET Counter-Swarm is an AI-driven command-and-control system under development to address the challenge of defending against coordinated drone swarm attacks. The system uses machine learning to analyze swarm behavior, prioritize threats, and autonomously coordinate engagement across multiple effector systems.',
    howItWorks: 'The system ingests sensor data from the air defense network and applies AI algorithms to detect and characterize swarm behavior — including formation patterns, coordination signatures, and attack vectors. It then autonomously allocates defensive assets to threats based on priority and predicted swarm behavior, coordinating multiple effectors to break up the swarm and defeat individual elements efficiently.',
    keyFeatures: [
      'AI-driven swarm behavior analysis',
      'Autonomous threat prioritization',
      'Multi-effector coordination',
      'Real-time adaptive response',
      'Scalable to large swarm sizes',
    ],
    advantages: [
      'Responds faster than human operators against swarms',
      'Optimizes use of limited defensive resources',
      'Adapts to changing swarm tactics in real time',
      'Scales to handle large numbers of threats',
    ],
    disadvantages: [
      'Still in early development',
      'AI decision-making raises policy concerns',
      'Requires extensive training data',
      'Dependent on reliable sensor input',
    ],
    relatedSystems: ['JCUAS', 'FAAD C2', 'IBCS', 'MEDUSA C2'],
    featured: false,
    content: `## Overview

The SKYNET Counter-Swarm system represents Army Futures Command's effort to develop AI-powered command-and-control capabilities specifically designed to counter the emerging threat of coordinated drone swarms. As adversaries develop the ability to field dozens or hundreds of drones in coordinated attacks, traditional human-in-the-loop engagement processes become too slow to respond effectively. SKYNET aims to provide the AI-driven automation needed to match the speed and scale of swarm threats.

## Development History

Army Futures Command initiated the counter-swarm AI effort in response to intelligence assessments and wargaming that showed traditional air defenses being overwhelmed by coordinated drone swarms. The program builds on advances in military AI and machine learning, applying these technologies to the specific problem of swarm detection, characterization, and engagement coordination. The system is designed as a software layer that can run on existing C2 hardware, avoiding the need for new physical infrastructure.

## Operational Concept

When sensors detect an incoming drone swarm, SKYNET's AI engine analyzes the swarm's behavior patterns — its formation, speed, coordination level, and likely attack profile. The AI then generates an optimized engagement plan, allocating available effectors (EW, directed energy, kinetic interceptors) to specific threats based on their assessed priority and the capabilities of each defensive asset. The engagement plan is executed at machine speed, with the AI continuously adapting as the swarm changes behavior or individual elements are defeated.

## Future Development

The program is in early development with a focus on algorithm refinement through simulation and live testing against surrogate swarms. Key challenges include ensuring AI reliability in adversarial conditions, maintaining human oversight of engagement decisions per DoD policy, and building trust in autonomous defensive operations. The system's success could fundamentally change how air defenses operate against mass UAS attacks.`,
  },
  {
    name: 'Reaper Scout',
    slug: 'reaper-scout',
    description: 'A lightweight tactical counter-UAS reconnaissance and intercept drone designed for small-unit operations, providing organic drone detection and kinetic defeat capability.',
    category: 'effector',
    manufacturer: 'Shield AI / US DoD program',
    country: 'United States',
    status: 'development',
    primaryCapability: 'Tactical reconnaissance and counter-UAS intercept using AI-guided autonomous flight.',
    specifications: [
      'Small multi-rotor platform',
      'AI-autonomous flight capability',
      'EO sensor for target acquisition',
      'Kinetic intercept profile',
      'GPS-denied navigation',
      'Man-portable',
    ],
    platforms: ['Man-portable'],
    deployedBy: ['US DoD (evaluation)'],
    whatItIs: 'Reaper Scout is a tactical counter-UAS drone concept that provides small units with an AI-guided autonomous interceptor capable of detecting and kinetically defeating hostile drones in GPS-denied environments. The system leverages advances in autonomous flight and onboard AI processing.',
    howItWorks: 'Reaper Scout is launched by a single operator and uses onboard AI and sensors to autonomously search for, detect, and classify drone threats. Once a hostile drone is identified, the system maneuvers autonomously for a kinetic intercept, using collision to destroy the target. AI-driven navigation enables operation in GPS-denied environments where other systems may be ineffective.',
    keyFeatures: [
      'AI-autonomous operation',
      'GPS-denied capable',
      'Man-portable for small units',
      'Kinetic intercept capability',
      'Onboard threat classification',
    ],
    advantages: [
      'Operates without GPS or external datalinks',
      'Fully autonomous reduces operator burden',
      'Portable for dismounted operations',
      'Low cost per engagement',
    ],
    disadvantages: [
      'Still in development',
      'Single-use interceptor',
      'Limited endurance',
      'AI autonomy raises policy questions',
    ],
    relatedSystems: ['SkyRaider', 'Iron Drone', 'DroneHunter F700'],
    featured: false,
    content: `## Overview

Reaper Scout represents the emerging class of AI-autonomous counter-UAS interceptor drones designed for small-unit tactical operations. As hostile drone threats increasingly appear in GPS-denied and communications-degraded environments, the need for interceptors that can operate autonomously without external guidance has become critical. Reaper Scout addresses this gap with onboard AI processing that enables independent target detection, classification, and kinetic intercept.

## Development History

The Reaper Scout concept emerged from the intersection of advances in autonomous drone navigation — particularly AI-driven visual navigation in GPS-denied environments — and the urgent need for portable counter-UAS capability at the squad and platoon level. Drawing on technology demonstrated by companies like Shield AI and others in autonomous drone flight, the program seeks to deliver a fielded capability that can be carried and employed by individual soldiers.

## Operational Concept

In operation, a soldier launches Reaper Scout from a portable container. The drone autonomously climbs to patrol altitude and begins searching for hostile UAS using its onboard sensors and AI classification engine. When a hostile drone is detected, Reaper Scout autonomously maneuvers to intercept, using collision to destroy both the target and itself. The fully autonomous nature of the engagement means no datalink or GPS is required after launch, making the system effective in the heavily jammed environments of modern warfare.

## Future Development

The program is focused on improving AI classification accuracy to minimize fratricide risk, extending autonomous flight endurance, and reducing unit cost to enable mass employment against swarm threats. Integration with squad-level air defense warning systems is also planned.`,
  },
  {
    name: 'Ku-Band Sentinel',
    slug: 'ku-band-sentinel',
    description: 'The AN/MPQ-64 Sentinel radar, a 3D X-band phased array air defense radar widely used for short-range air defense cueing with demonstrated capability detecting UAS targets.',
    category: 'sensor',
    manufacturer: 'Raytheon (RTX)',
    country: 'United States',
    status: 'operational',
    primaryCapability: '3D air defense surveillance radar providing detection and tracking of low-altitude air threats including UAS for cueing SHORAD systems.',
    specifications: [
      'Type: X-band 3D phased array',
      'Detection range: 75 km (fighter-sized), reduced for small UAS',
      '360-degree rotating antenna',
      'Elevation coverage: 0-60 degrees',
      'Target classification capability',
      'Trailer-mounted for mobility',
    ],
    platforms: ['Trailer-mounted'],
    deployedBy: ['US Army', 'US Marine Corps', '20+ allied nations'],
    inServiceDate: '2003',
    detectionRange: '75 km (conventional air targets)',
    whatItIs: 'The AN/MPQ-64 Sentinel is a widely fielded 3D phased array air surveillance radar that serves as the primary short-range air defense cueing radar for the US Army and many allied nations. While designed for conventional air defense, its detection capability extends to UAS targets, making it a key component of counter-UAS sensor architectures.',
    howItWorks: 'Sentinel uses a rotating X-band phased array antenna to provide 360-degree 3D surveillance of the surrounding airspace. The radar detects and tracks air targets including aircraft, helicopters, cruise missiles, and UAS, providing range, azimuth, elevation, and velocity data. Target tracks are passed to air defense command-and-control systems like FAAD C2 for engagement by SHORAD weapons. Against UAS, the radar can detect larger drones at operationally useful ranges.',
    keyFeatures: [
      '3D phased array detection',
      '360-degree continuous surveillance',
      'Proven in SHORAD air defense role',
      'Trailer-mounted tactical mobility',
      'Widely fielded worldwide',
    ],
    advantages: [
      'Mature, proven radar with global support base',
      'Already integrated with SHORAD fire control',
      'Can detect medium/large UAS at useful ranges',
      'Large installed base across NATO',
    ],
    disadvantages: [
      'Not optimized for very small UAS detection',
      'Struggles with Group 1 micro-drones',
      'Aging design compared to purpose-built C-UAS radars',
      'Requires updates for enhanced UAS detection',
    ],
    combatRecord: 'Deployed worldwide in support of US and allied SHORAD operations. Increasingly used in counter-UAS detection role with software updates to improve small target performance.',
    relatedSystems: ['NASAMS', 'FAAD C2', 'M-SHORAD', 'KURFS'],
    featured: false,
    content: `## Overview

The AN/MPQ-64 Sentinel is one of the most widely deployed short-range air defense radars in the world, serving as the eyes of SHORAD units across the US military and more than 20 allied nations. While originally designed to detect conventional air threats like aircraft and helicopters, the Sentinel's 3D phased array capability has given it a growing role in counter-UAS operations as the primary cueing sensor for integrated air defense systems that now must contend with drone threats.

## Development History

Raytheon developed the Sentinel as a replacement for the aging AN/MPQ-49 Forward Area Alerting Radar (FAAR), providing a modern 3D phased array capability for the SHORAD community. The radar entered service in 2003 and has been continuously upgraded with improved processing and software. As the UAS threat emerged, Sentinel received software updates to improve its ability to detect and track smaller, slower-moving drone targets that were not part of the original design requirements.

## Operational Concept

Sentinel operates as the surveillance and cueing radar for SHORAD batteries, providing the air picture that enables engagement by weapons like Stinger, M-SHORAD, and NASAMS. In the counter-UAS role, Sentinel detects UAS targets within its capability and provides tracks to the fire control system for engagement. The radar is particularly effective against Group 2 and Group 3 UAS that present sufficient radar cross sections, though it is less capable against very small Group 1 drones that require specialized C-UAS radars like KURFS.

## Future Development

Raytheon is developing Sentinel A4 with improved hardware and software specifically aimed at enhancing performance against small UAS and other emerging threats. The upgrade includes a new digital receiver, increased processing power, and counter-UAS optimized waveforms. Sentinel's position as the primary SHORAD radar ensures continued investment in keeping its capabilities relevant against evolving air threats.`,
  },
  {
    name: 'Northrop Grumman FAAD C2 BAIS',
    slug: 'faad-c2-bais',
    description: 'The Battle Area Integrated Sensor module for FAAD C2, extending the Forward Area Air Defense command-and-control system with enhanced sensor fusion for counter-UAS operations.',
    category: 'c2',
    manufacturer: 'Northrop Grumman',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Enhanced sensor fusion and battle management for counter-UAS operations within the FAAD C2 air defense architecture.',
    specifications: [
      'Multi-sensor fusion engine',
      'Counter-UAS specific processing',
      'Integration with FAAD C2 network',
      'Real-time track management',
      'Automated threat assessment',
      'Portable ruggedized hardware',
    ],
    platforms: ['FAAD C2 equipped units'],
    deployedBy: ['US Army'],
    inServiceDate: '2021',
    whatItIs: 'FAAD C2 BAIS (Battle Area Integrated Sensor) is an enhancement to the Army\'s Forward Area Air Defense Command and Control system that adds specialized sensor fusion and battle management capabilities specifically designed for the counter-UAS mission. It enables FAAD C2 to integrate data from C-UAS specific sensors alongside traditional air defense radars.',
    howItWorks: 'BAIS adds a sensor fusion layer to the FAAD C2 system that can ingest and correlate data from counter-UAS specific sensors — RF detectors, small-target radars, acoustic sensors, and EO/IR cameras — alongside tracks from traditional air defense radars. The fused picture provides operators with a comprehensive view of both conventional air threats and UAS activity, enabling coordinated engagement using the most appropriate air defense asset.',
    keyFeatures: [
      'C-UAS specific sensor fusion',
      'Integrates with existing FAAD C2 infrastructure',
      'Multi-sensor track correlation',
      'Automated C-UAS threat assessment',
      'Rapid software updates for new sensor types',
    ],
    advantages: [
      'Leverages existing FAAD C2 investment',
      'Bridges conventional AD and C-UAS operations',
      'Flexible sensor integration',
      'Enhances air defense common operating picture',
    ],
    disadvantages: [
      'Requires FAAD C2 baseline system',
      'Additional training for operators',
      'Integration complexity with diverse sensors',
      'Being overtaken by IBCS modernization',
    ],
    relatedSystems: ['FAAD C2', 'IBCS', 'JCUAS', 'MEDUSA C2'],
    featured: false,
    content: `## Overview

The FAAD C2 Battle Area Integrated Sensor (BAIS) module addresses a critical gap in the Army's air defense architecture: the need to integrate counter-UAS specific sensor data into the established Forward Area Air Defense command-and-control system. As the Army deployed dedicated C-UAS sensors like KURFS and various RF detectors, these new sensors needed to feed into the same command-and-control system that managed traditional air defense operations, and BAIS provides that integration.

## Development History

Northrop Grumman developed BAIS as an enhancement to its existing FAAD C2 system after recognizing that the growing counter-UAS mission required sensor integration capabilities beyond what the original system was designed to handle. Traditional air defense radars and new C-UAS sensors operate on different scales and provide different types of data — BAIS bridges this gap by providing a sensor fusion engine specifically designed to correlate and manage multi-source counter-UAS data.

## Operational Concept

In operation, BAIS runs as a module within the FAAD C2 system, ingesting data from C-UAS sensors deployed across the battalion or brigade area. RF detectors, small-target tracking radars, acoustic sensors, and EO/IR cameras all feed their detections into BAIS, which correlates and fuses these into unified tracks. These C-UAS tracks are then displayed alongside conventional air defense tracks on the FAAD C2 common operating picture, giving air defense commanders a comprehensive view of all air threats and enabling coordinated engagement decisions.

## Future Development

While BAIS continues to serve operational units, the long-term direction for Army air defense command-and-control is IBCS (Integrated Battle Command System), which is designed from the ground up for multi-domain sensor fusion. However, BAIS will remain important during the transition period as units still operating FAAD C2 need counter-UAS integration capability.`,
  },
  // ============================================================
  // ALLIED SYSTEMS
  // ============================================================
  {
    name: 'Martlet',
    slug: 'martlet',
    description: 'Thales Martlet (Lightweight Multirole Missile) is a British lightweight precision-guided missile with a proven counter-UAS role, deployed on helicopters, ships, and ground vehicles.',
    category: 'effector',
    manufacturer: 'Thales UK',
    country: 'United Kingdom',
    status: 'operational',
    primaryCapability: 'Lightweight precision-guided missile for engagement of small surface and air targets including UAS.',
    specifications: [
      'Length: 1.3 m',
      'Weight: 13 kg',
      'Warhead: Blast fragmentation',
      'Guidance: Laser beam riding',
      'Speed: Supersonic',
      'Range: 8+ km',
    ],
    platforms: ['Wildcat helicopter', 'Naval vessels', 'Ground vehicles'],
    deployedBy: ['British Army', 'Royal Navy'],
    inServiceDate: '2021',
    effectiveRange: '8+ km',
    whatItIs: 'Martlet, also known as the Lightweight Multirole Missile (LMM), is a Thales UK precision-guided weapon designed to engage a wide range of small targets including fast boats, light vehicles, and unmanned aircraft. Its laser beam-riding guidance and lightweight form factor make it particularly suitable for the counter-UAS role.',
    howItWorks: 'Martlet uses laser beam-riding guidance — the operator designates the target with a laser and the missile rides the beam to impact. This guidance method provides high accuracy against small, maneuvering targets like drones while being resistant to most countermeasures. The blast-fragmentation warhead is optimized for destroying light targets without excessive collateral damage.',
    keyFeatures: [
      'Very lightweight at only 13 kg',
      'Laser beam-riding guidance for precision',
      'Multi-platform compatibility',
      'Low collateral damage warhead',
      'Supersonic speed',
    ],
    advantages: [
      'Excellent precision against small targets',
      'Very low cost relative to larger missiles',
      'Multi-platform flexibility',
      'Resistant to most countermeasures',
    ],
    disadvantages: [
      'Requires continuous laser designation',
      'Limited warhead for larger targets',
      'Line-of-sight engagement only',
      'Relatively short range compared to larger SAMs',
    ],
    combatRecord: 'Tested against drone targets in UK military exercises. Qualified for counter-UAS use on Wildcat helicopters and Royal Navy vessels.',
    relatedSystems: ['Stinger FIM-92', 'APKWS II', 'RapidFire'],
    featured: false,
    content: `## Overview

The Thales Martlet, designated the Lightweight Multirole Missile (LMM), is a compact precision-guided weapon that has become a key element of the United Kingdom's counter-UAS capability. At just 13 kg, Martlet is light enough to be carried in large numbers on helicopters, ships, and vehicles, yet precise enough to hit small, maneuvering drone targets with high reliability thanks to its laser beam-riding guidance system.

## Development History

Martlet was developed by Thales UK as a lightweight multi-role missile to replace the aging Sea Skua and provide British forces with a precision weapon for engaging small, elusive targets. The program was initiated in the 2000s with the missile entering qualification testing in the 2010s. As the counter-UAS mission gained urgency, Martlet was evaluated and qualified for the anti-drone role, offering a cost-effective guided munition significantly cheaper than full-size air defense missiles.

## Operational Concept

In the counter-UAS role, Martlet is typically deployed on Wildcat helicopters or naval vessels equipped with a laser designator. When a drone threat is detected, the operator designates the target with a laser and launches the Martlet, which rides the laser beam with high precision to intercept the drone. The blast-fragmentation warhead ensures destruction even if the laser spot drifts slightly from a small target. Multiple Martlets can be carried per platform, enabling engagement of several drone threats in a single sortie.

## Future Development

Thales is developing an active laser seeker variant of Martlet that would provide fire-and-forget capability against UAS targets, eliminating the need for continuous operator designation. Integration on additional platforms and enhanced warhead options are also being explored to expand Martlet's utility across the counter-UAS mission.`,
  },
  {
    name: 'RapidFire',
    slug: 'rapidfire',
    description: 'RapidFire is a stabilized 40mm gun turret system developed by CTA International and Thales for naval and ground-based air defense with strong counter-UAS capability.',
    category: 'effector',
    manufacturer: 'CTA International / Thales',
    country: 'United Kingdom',
    status: 'development',
    primaryCapability: 'Rapid-fire 40mm cannon system for close-in air defense and counter-UAS engagement using airburst ammunition.',
    specifications: [
      'Weapon: 40mm CTA (Cased Telescoped Ammunition)',
      'Rate of fire: 200 rounds/minute',
      'Ammunition: A3B programmable airburst',
      'Integrated EO/IR tracking',
      'Stabilized turret for moving platforms',
      'Range: 4+ km effective',
    ],
    platforms: ['Naval vessels', 'Ground vehicles'],
    deployedBy: ['French Navy (planned)', 'UK (evaluation)'],
    effectiveRange: '4+ km',
    whatItIs: 'RapidFire is a stabilized turret weapon system built around the 40mm Cased Telescoped Ammunition (CTA) cannon, combined with Thales fire control and tracking systems. Its use of programmable airburst ammunition makes it particularly effective against small UAS targets, as each round can be programmed to detonate at the precise range of the target, creating a lethal fragment cloud.',
    howItWorks: 'The system uses its integrated EO/IR sensor suite and fire control computer to detect and track UAS targets. When the operator authorizes engagement, the 40mm CTA cannon fires programmable airburst rounds at 200 rounds per minute. Each round is programmed at the muzzle with the precise distance to the target, causing it to detonate in proximity and shower the drone with fragments. This approach dramatically increases hit probability against small targets.',
    keyFeatures: [
      'Programmable airburst ammunition',
      '40mm CTA compact cannon',
      'Integrated EO/IR fire control',
      'High rate of accurate fire',
      'Multi-mission air and surface defense',
    ],
    advantages: [
      'Airburst dramatically increases hit probability vs UAS',
      'Cost-effective ammunition compared to missiles',
      'High sustained rate of fire',
      'Multi-role capability',
    ],
    disadvantages: [
      'Limited range compared to missile systems',
      'Ammunition weight limits magazine depth',
      'Complex ammunition programming system',
      'Still completing development and qualification',
    ],
    relatedSystems: ['Phalanx CIWS', 'AHEAD', 'Martlet'],
    featured: false,
    content: `## Overview

RapidFire is a next-generation close-in weapon system that pairs the compact 40mm Cased Telescoped Ammunition cannon with Thales fire control technology to create a highly effective counter-UAS turret. The system's key advantage is its use of programmable airburst ammunition — each round is electronically programmed as it leaves the barrel to detonate at the exact range of the target, creating a cloud of fragments that dramatically increases the probability of hitting small drone targets.

## Development History

RapidFire emerged from the Franco-British CTA International joint venture, which developed the innovative 40mm Cased Telescoped Ammunition cannon. CTA technology uses a unique telescoped round design where the projectile is contained within the propellant case, resulting in a more compact weapon and ammunition. Thales integrated the CTA cannon with its proven fire control and tracking systems to create RapidFire, initially targeting the naval close-in defense mission with a strong emphasis on counter-UAS capability.

## Operational Concept

Against drone threats, RapidFire's fire control system tracks the target using EO/IR sensors and calculates the precise engagement solution. As each 40mm round is fired, it passes through a muzzle programmer that sets its fuze to detonate at the computed range of the target. At 200 rounds per minute, RapidFire creates a lethal zone of fragments around the target's predicted position, ensuring high kill probability even against small, maneuvering drones. The system can rapidly shift between targets for engagement of multiple threats.

## Future Development

The French Navy has selected RapidFire for installation on future naval vessels, and the system is being evaluated for ground-based air defense applications. Future development includes enhanced autonomous engagement modes, improved tracking algorithms for micro-UAS targets, and integration with broader air defense networks.`,
  },
  {
    name: 'EOS R400S-Mk2',
    slug: 'eos-r400s-mk2',
    description: 'Electro Optic Systems R400S-Mk2 is an Australian remote weapon station with integrated counter-UAS capability using precision tracking and various weapon options.',
    category: 'effector',
    manufacturer: 'Electro Optic Systems (EOS)',
    country: 'Australia',
    status: 'operational',
    primaryCapability: 'Precision remote weapon station with integrated C-UAS tracking and engagement capability.',
    specifications: [
      'Stabilized weapon platform',
      'EO/IR sensor suite with laser rangefinder',
      'AI-assisted target tracking',
      'Compatible with 12.7mm to 30mm weapons',
      'Integrated counter-UAS mode',
      'Weight: ~200 kg (turret)',
    ],
    platforms: ['Ground vehicles', 'Fixed installations', 'Naval vessels'],
    deployedBy: ['Australian Defence Force', 'Export customers'],
    inServiceDate: '2020',
    effectiveRange: '2+ km (weapon dependent)',
    whatItIs: 'The EOS R400S-Mk2 is an advanced remote weapon station developed by Australia\'s Electro Optic Systems that integrates precision EO/IR tracking with AI-assisted target engagement capabilities specifically designed for the counter-UAS mission. It can mount various weapons from 12.7mm machine guns to 30mm cannons.',
    howItWorks: 'The system uses its stabilized EO/IR sensor suite to detect and track UAS targets, with AI-assisted algorithms helping the operator maintain lock on small, fast-moving drones. Once the operator authorizes engagement, the precision fire control system directs the mounted weapon with computer-assisted aiming that compensates for target movement, range, and ballistics. The system can also interface with external air defense radars for cueing.',
    keyFeatures: [
      'AI-assisted drone tracking',
      'Precision stabilized weapon platform',
      'Multiple weapon options',
      'Dedicated counter-UAS engagement mode',
      'Integrated EO/IR sensors',
    ],
    advantages: [
      'Precision kinetic defeat of small UAS',
      'Weapon flexibility for different threats',
      'AI tracking reduces operator workload',
      'Multi-role weapon station',
    ],
    disadvantages: [
      'Limited by weapon effective range',
      'Requires visual acquisition of target',
      'Ammunition expenditure against small targets',
      'Single-target engagement at a time',
    ],
    relatedSystems: ['XM914 Chain Gun', 'Phalanx CIWS', 'LPWS'],
    featured: false,
    content: `## Overview

The Electro Optic Systems (EOS) R400S-Mk2 represents Australia's contribution to the kinetic counter-UAS fight, providing a precision remote weapon station with dedicated AI-assisted drone tracking and engagement capabilities. By combining advanced electro-optical sensing with stabilized weapon mounting and AI-powered tracking, the R400S-Mk2 gives operators the ability to engage small drone targets with conventional firearms at ranges that would be impossible with unassisted shooting.

## Development History

EOS, headquartered in Canberra, Australia, has been a leader in precision electro-optical systems for decades. The R400S series was developed as a next-generation remote weapon station, and the Mk2 variant incorporated specific counter-UAS capabilities in response to the growing drone threat. The company's expertise in optical tracking and AI-powered fire control gave it a natural advantage in addressing the challenge of hitting small, maneuvering drones with kinetic weapons.

## Operational Concept

In counter-UAS operations, the R400S-Mk2 is cued by external radar or its own EO/IR sensors to acquire a drone target. The AI-assisted tracking system locks onto the target and maintains track despite evasive maneuvers, atmospheric distortion, and platform movement. The fire control computer continuously calculates the engagement solution, and when the operator fires, the system delivers precision bursts that account for the target's predicted flight path. This computer-assisted approach makes it practical to engage small drones with conventional ammunition.

## Future Development

EOS is developing enhanced AI tracking algorithms for improved performance against micro-UAS and swarm targets. Integration with directed energy effectors and expanded sensor networking capabilities are also planned. The company is actively pursuing export opportunities as militaries worldwide seek kinetic counter-UAS solutions.`,
  },
  {
    name: 'Type 11 SAM',
    slug: 'type-11-sam',
    description: 'The Japan Ground Self-Defense Force Type 11 short-range surface-to-air missile system, capable of engaging low-altitude targets including UAS.',
    category: 'effector',
    manufacturer: 'Toshiba',
    country: 'Japan',
    status: 'operational',
    primaryCapability: 'Short-range air defense against low-altitude aircraft, helicopters, and UAS threats.',
    specifications: [
      'Missile: infrared-guided SAM',
      'Vehicle-mounted launcher',
      'Range: ~10 km',
      'Low-altitude engagement optimized',
      'Crew: 3-4 operators',
      'All-weather capable',
    ],
    platforms: ['Light tactical vehicle'],
    deployedBy: ['Japan Ground Self-Defense Force'],
    inServiceDate: '2005',
    effectiveRange: '~10 km',
    whatItIs: 'The Type 11 is a Japanese short-range surface-to-air missile system developed by Toshiba for the Japan Ground Self-Defense Force (JGSDF). Designed for low-altitude air defense, the system\'s capability envelope makes it suitable for engaging larger UAS targets operating at medium altitudes.',
    howItWorks: 'The Type 11 uses an infrared-guided missile launched from a vehicle-mounted launcher. The system\'s sensors detect and track low-altitude targets, and the missile homes on the target\'s heat signature after launch. The system is designed for rapid deployment and engagement of targets at short range, making it suitable for point defense of critical assets.',
    keyFeatures: [
      'Optimized for low-altitude targets',
      'Rapid deployment and engagement',
      'Infrared homing guidance',
      'Vehicle-mobile platform',
      'Networked with JGSDF air defense systems',
    ],
    advantages: [
      'Effective against low-altitude threats including UAS',
      'Mobile and rapidly deployable',
      'Proven Japanese defense technology',
      'Integrated with national air defense network',
    ],
    disadvantages: [
      'IR guidance may struggle against low-signature UAS',
      'Overkill against small commercial drones',
      'Limited to JGSDF use',
      'Aging design compared to newer C-UAS systems',
    ],
    relatedSystems: ['Stinger FIM-92', 'NASAMS', 'M-SHORAD'],
    featured: false,
    content: `## Overview

The Type 11 short-range surface-to-air missile system is a Japanese-developed air defense weapon that provides the Japan Ground Self-Defense Force with mobile, low-altitude air defense capability. While designed primarily for conventional air defense against aircraft and helicopters, the Type 11's engagement envelope makes it applicable to the counter-UAS mission against medium and large unmanned aerial systems.

## Development History

Developed by Toshiba for the Japan Ministry of Defense, the Type 11 entered service in 2005 as a replacement for older short-range air defense systems in the JGSDF inventory. The system was designed to address the specific threat of low-altitude attack aircraft and helicopters in the Japanese defense context. As the UAS threat has grown, the Type 11's capability against low-altitude, moderate-speed targets has given it relevance in the counter-drone mission.

## Capabilities

The Type 11 mounts its missile launcher and fire control system on a light tactical vehicle, providing mobility and rapid deployment capability. The infrared-guided missile can engage targets at ranges up to approximately 10 km, with particular effectiveness against low-altitude targets that larger air defense systems may have difficulty tracking. The system can be networked with the JGSDF's broader air defense network for integrated operations.

## Future Development

Japan is evaluating modernization options for its short-range air defense capabilities, including potential upgrades to the Type 11 or replacement with new systems incorporating dedicated counter-UAS capabilities. The increasing UAS threat in the Indo-Pacific region is driving investment in enhanced air defense across all JGSDF units.`,
  },
  {
    name: 'Hyungung Anti-Drone',
    slug: 'hyungung-anti-drone',
    description: 'South Korean anti-drone system combining radar detection, EO/IR tracking, and electronic warfare for protection of critical sites against North Korean UAS incursions.',
    category: 'integrated',
    manufacturer: 'KAIST / South Korean defense industry',
    country: 'South Korea',
    status: 'operational',
    primaryCapability: 'Integrated detection and defeat of small UAS threats targeting critical infrastructure and military sites.',
    specifications: [
      'Multi-sensor detection (radar, EO/IR, RF)',
      'Electronic warfare jamming',
      'Integration with kinetic effectors',
      'Autonomous detection and alert',
      'Hardened against North Korean EW',
    ],
    platforms: ['Fixed site', 'Vehicle-mounted'],
    deployedBy: ['Republic of Korea Armed Forces'],
    inServiceDate: '2020',
    whatItIs: 'The Hyungung anti-drone system is South Korea\'s domestically developed counter-UAS solution, created in direct response to North Korean drone incursions over South Korean territory. It integrates multiple sensor types with electronic warfare and kinetic effectors to detect and defeat small UAS threats.',
    howItWorks: 'The system uses a combination of radar, electro-optical/infrared cameras, and RF sensors to detect small drone targets. AI-assisted processing classifies threats and alerts operators, who can then employ electronic warfare jamming to disrupt drone control links or direct kinetic effectors to destroy the target. The system is designed to operate in the challenging electromagnetic environment near the DMZ.',
    keyFeatures: [
      'Purpose-built for Korean Peninsula threat',
      'Multi-sensor detection suite',
      'Electronic warfare and kinetic defeat options',
      'Hardened for contested environment near DMZ',
      'Rapid alert and response capability',
    ],
    advantages: [
      'Tailored to specific North Korean drone threat',
      'Domestic production ensures security of supply',
      'Hardened against EW countermeasures',
      'Proven against real-world incursions',
    ],
    disadvantages: [
      'Designed for specific threat set',
      'Limited export potential',
      'North Korean drones continue to evolve',
      'Integration challenges with US/allied systems',
    ],
    combatRecord: 'Developed and deployed in response to multiple confirmed North Korean drone incursions over South Korean territory, including incidents in 2014, 2017, and 2022.',
    relatedSystems: ['FS-LIDS', 'AUDS', 'DRDO Anti-Drone System'],
    featured: false,
    content: `## Overview

South Korea's Hyungung anti-drone system was developed as a direct response to repeated North Korean drone incursions over South Korean territory. These provocative flights — which have included reconnaissance drones reaching as far as the Seoul capital area — demonstrated an urgent need for dedicated counter-UAS defenses. The Hyungung system combines detection, tracking, and defeat capabilities tailored to the unique challenges of the Korean Peninsula threat environment.

## Development History

Following the discovery of crashed North Korean reconnaissance drones in South Korean territory in 2014, the Republic of Korea initiated an urgent counter-UAS development program. KAIST (Korea Advanced Institute of Science and Technology) and South Korean defense companies collaborated to develop an integrated solution capable of detecting the small, low-flying drones that North Korea had demonstrated it could fly across the DMZ undetected. The program accelerated after additional incursions in 2017 and 2022.

## Operational Concept

The Hyungung system is deployed at critical sites and along likely drone approach corridors, using its multi-sensor suite to maintain continuous surveillance for small UAS targets. The system's detection capability is specifically optimized for the types of drones known to be in North Korean inventory, including small fixed-wing reconnaissance platforms. When a drone is detected, the system alerts operators and provides tracking data for engagement by electronic warfare or kinetic means, with the goal of both neutralizing the drone and recovering it for intelligence exploitation.

## Future Development

South Korea continues to invest heavily in counter-UAS capabilities as North Korea expands its drone fleet. Future enhancements include integration with national air defense networks, improved detection of stealthy and autonomous drones, and development of directed energy effectors. The experience of defending against real drone incursions provides valuable operational data for system improvement.`,
  },
  {
    name: 'AHEAD',
    slug: 'ahead',
    description: 'Rheinmetall AHEAD (Advanced Hit Efficiency And Destruction) is a programmable airburst ammunition technology used in 35mm and other caliber cannons for highly effective counter-UAS engagement.',
    category: 'effector',
    manufacturer: 'Rheinmetall',
    country: 'Germany',
    status: 'operational',
    primaryCapability: 'Programmable airburst ammunition for air defense cannons, optimized for counter-UAS and counter-RAM engagement.',
    specifications: [
      'Caliber: 35mm (also 30mm, 40mm variants)',
      'Programmable airburst fuze',
      'Sub-projectile payload: ~152 tungsten cylinders per round',
      'Muzzle programming via induction coil',
      'Compatible with Oerlikon guns',
      'Effective range: 4+ km',
    ],
    platforms: ['Oerlikon Revolver Gun Mk3', 'Gepard SPAAG', 'Skynex system', 'Naval mounts'],
    deployedBy: ['German Bundeswehr', 'Multiple NATO and export customers'],
    inServiceDate: '2005',
    effectiveRange: '4+ km',
    whatItIs: 'AHEAD is Rheinmetall\'s programmable airburst ammunition technology that transforms conventional air defense cannons into highly effective counter-UAS weapons. Each round carries approximately 152 tungsten sub-projectiles that are released in a precisely timed airburst pattern at the target\'s range, creating a lethal cone of fragments that dramatically increases hit probability against small drones.',
    howItWorks: 'As each AHEAD round passes through the cannon muzzle, an induction coil programs its electronic time fuze with the exact range to the target, calculated by the fire control system. At the programmed distance, the round ejects its payload of tungsten sub-projectiles in a forward-facing cone pattern. Against a drone target, this creates a wall of high-velocity tungsten fragments that shreds the airframe even without a direct hit.',
    keyFeatures: [
      'Muzzle-programmed electronic time fuze',
      '~152 tungsten sub-projectiles per round',
      'Dramatically higher hit probability vs small targets',
      'Compatible with existing Oerlikon-family guns',
      'Low cost per engagement compared to missiles',
    ],
    advantages: [
      'Extremely effective against small UAS',
      'Far cheaper than missile engagements',
      'High rate of fire with gun platforms',
      'Retrofittable to existing weapons',
    ],
    disadvantages: [
      'Range limited by cannon ballistics',
      'Requires sophisticated fire control system',
      'Tungsten sub-projectiles create ground debris',
      'Heavy ammunition for sustained engagements',
    ],
    combatRecord: 'AHEAD ammunition has been combat-tested and is in operational service with multiple armed forces. Demonstrated highly effective counter-UAS capability in live-fire evaluations.',
    relatedSystems: ['MANTIS', 'RapidFire', 'Phalanx CIWS'],
    featured: false,
    content: `## Overview

Rheinmetall's AHEAD (Advanced Hit Efficiency And Destruction) ammunition technology represents one of the most significant advances in gun-based air defense, and has become a cornerstone of European counter-UAS capability. By programming each round to detonate at the exact range of the target and release a cloud of tungsten sub-projectiles, AHEAD transforms conventional air defense cannons into devastatingly effective anti-drone weapons with hit probabilities far exceeding those of conventional ammunition.

## Development History

Rheinmetall developed AHEAD technology in the late 1990s as a solution to the fundamental challenge of hitting small, fast-moving air targets with gun-based systems. Traditional anti-aircraft ammunition relied on either direct hits (extremely difficult against small targets) or proximity fuzes (effective but expensive). AHEAD's innovation was a muzzle-programmed electronic time fuze that released a payload of tungsten sub-projectiles at precisely the right moment, creating a lethal fragment cloud in the target's path.

## Operational Concept

In the counter-UAS role, AHEAD is employed in weapons like the Oerlikon Revolver Gun and the Rheinmetall Skynex system. The fire control radar tracks the incoming drone and continuously calculates its range. As each round is fired, the muzzle coil programs the fuze with the current target range. At the programmed distance, the round ejects its 152 tungsten cylinders in a forward-facing cone, creating a wall of fragments that intercepts the drone. Even small UAS targets are reliably destroyed by this fragment cloud, making AHEAD one of the most cost-effective gun-based counter-UAS solutions available.

## Future Development

Rheinmetall continues to refine AHEAD for new calibers and platforms, including integration with the latest fire control systems optimized for micro-UAS detection. Extended-range variants and enhanced sub-projectile designs are under development to address evolving drone threats, including hardened military UAS and fast-moving loitering munitions.`,
  },
  {
    name: 'Nexter RAPIDFire',
    slug: 'nexter-rapidfire',
    description: 'Nexter/Thales RAPIDFire is a naval close-in weapon system based on the 40mm CTA cannon designed for French Navy ships, providing high-performance counter-UAS and anti-surface defense.',
    category: 'effector',
    manufacturer: 'Nexter / Thales',
    country: 'France',
    status: 'development',
    primaryCapability: 'Naval close-in weapon system for counter-UAS and anti-surface defense using 40mm CTA airburst ammunition.',
    specifications: [
      'Weapon: 40mm CTA cannon',
      'Rate of fire: 200 rounds/minute',
      'Ammunition: Programmable airburst and point detonation',
      'Integrated Thales fire control',
      'Stabilized naval mount',
      'Range: 4+ km',
    ],
    platforms: ['French Navy FDI-class frigates', 'Other naval vessels'],
    deployedBy: ['French Navy (planned)'],
    effectiveRange: '4+ km',
    whatItIs: 'Nexter RAPIDFire is the French Navy configuration of the RapidFire weapon system, designed for installation on the new FDI-class (Frégate de Défense et d\'Intervention) frigates. It provides close-in defense against anti-ship missiles, UAS, and small surface craft using the advanced 40mm Cased Telescoped Ammunition cannon.',
    howItWorks: 'The system combines the 40mm CTA cannon with Thales naval fire control systems including radar and EO/IR tracking. Against UAS threats, it fires programmable airburst rounds that detonate at the target\'s range, creating a lethal fragment zone. The stabilized naval mount compensates for ship motion to maintain accuracy in sea states.',
    keyFeatures: [
      'Naval-optimized stabilized mount',
      '40mm CTA programmable airburst',
      'Thales integrated fire control',
      'Multi-threat engagement capability',
      'Designed for new French frigates',
    ],
    advantages: [
      'Highly effective airburst vs small UAS',
      'Cost-effective per engagement',
      'Multi-role naval weapon system',
      'Modern fire control integration',
    ],
    disadvantages: [
      'Not yet in operational service',
      'Limited range compared to missile systems',
      'Complex ammunition handling at sea',
      'Single-platform deployment initially',
    ],
    relatedSystems: ['RapidFire', 'Phalanx CIWS', 'AHEAD'],
    featured: false,
    content: `## Overview

Nexter RAPIDFire is the French naval variant of the RapidFire weapon system, selected for installation on the Marine Nationale's next-generation FDI-class frigates. The system brings the revolutionary 40mm Cased Telescoped Ammunition cannon to sea, providing French warships with a modern close-in weapon system optimized for the counter-UAS and anti-surface warfare missions that define contemporary naval threats.

## Development History

The French Navy selected RAPIDFire as the close-in weapon system for its FDI-class frigates, recognizing that the growing naval drone threat required a new approach to ship self-defense. The system builds on the CTA International 40mm cannon technology co-developed by France and the UK, with Nexter handling the naval integration and Thales providing the fire control suite. The program leverages decades of French expertise in naval weapon systems.

## Capabilities

At sea, RAPIDFire's key advantage is its ability to engage small, fast-moving threats — particularly anti-ship drones and loitering munitions — with programmable airburst ammunition. Each 40mm round is programmed at the muzzle to detonate at the target's range, creating a cloud of fragments that is far more likely to hit a small UAS than a single projectile. The stabilized mount compensates for ship motion, maintaining engagement accuracy in rough sea conditions. The system can also engage anti-ship missiles, fast attack craft, and other surface threats.

## Future Development

As the FDI-class frigates enter service, RAPIDFire will become the standard French Navy close-in weapon system. Future development will focus on enhanced autonomous engagement modes, improved tracking algorithms for swarm threats, and potential integration of new ammunition types. The system may also be offered for export as international navies seek modern counter-UAS close-in defense.`,
  },
  {
    name: 'Spike FireFly',
    slug: 'spike-firefly',
    description: 'Rafael Spike FireFly is an Israeli miniature loitering munition designed for precision engagement of small targets including hostile UAS through drone-on-drone intercept.',
    category: 'effector',
    manufacturer: 'Rafael Advanced Defense Systems',
    country: 'Israel',
    status: 'operational',
    primaryCapability: 'Miniature loitering munition for precision engagement of small targets and counter-UAS intercept.',
    specifications: [
      'Weight: ~3 kg',
      'Endurance: ~15 minutes',
      'Range: ~1 km operational radius',
      'EO sensor with real-time video',
      'Man-portable',
      'Warhead: small precision charge',
    ],
    platforms: ['Man-portable', 'Vehicle-launched'],
    deployedBy: ['Israel Defense Forces', 'Export customers'],
    inServiceDate: '2022',
    effectiveRange: '~1 km',
    whatItIs: 'Spike FireFly is a miniature loitering munition developed by Rafael that can be used both as a precision strike weapon against ground targets and as an interceptor against hostile drones. Weighing just 3 kg, it is launched by hand and provides the operator with real-time video for target identification before engaging.',
    howItWorks: 'The operator launches FireFly by hand and controls it via a tablet, receiving real-time video from its onboard camera. In the counter-UAS role, the operator flies FireFly toward a detected drone threat and maneuvers it for a collision intercept, with the small warhead detonating on impact to destroy the hostile drone. The system can also loiter in an area waiting for a drone threat to appear before executing the intercept.',
    keyFeatures: [
      'Ultra-lightweight at 3 kg',
      'Hand-launched by single operator',
      'Real-time video for target identification',
      'Dual-use: precision strike and counter-UAS',
      'Abort and re-engage capability',
    ],
    advantages: [
      'Extremely portable and rapidly deployable',
      'Very low cost per engagement',
      'Precision intercept with visual confirmation',
      'Can be aborted if wrong target identified',
    ],
    disadvantages: [
      'Very short range and endurance',
      'Single-use munition',
      'Limited effectiveness against fast targets',
      'Requires operator piloting skill',
    ],
    combatRecord: 'Evaluated by the IDF for both ground strike and counter-UAS roles. Operational use details are limited due to classification.',
    relatedSystems: ['Iron Drone', 'DroneHunter F700', 'SkyRaider'],
    featured: false,
    content: `## Overview

Rafael's Spike FireFly is a miniature loitering munition that bridges the gap between precision-guided weapons and counter-UAS interceptors. At just 3 kg, it is light enough to be carried and launched by a single soldier, yet capable enough to precisely engage ground targets or intercept hostile drones. This dual-use capability makes FireFly a uniquely versatile tool for infantry units facing both ground and aerial threats.

## Development History

Rafael developed Spike FireFly as part of its broader Spike family of precision-guided weapons, applying miniaturization technology to create the smallest member of the family. The development was driven by the recognition that infantry units needed both a tactical loitering munition for precision strikes and an organic counter-UAS capability. FireFly was designed to address both requirements in a single, ultra-lightweight package that adds minimal burden to the dismounted soldier.

## Operational Concept

In the counter-UAS role, FireFly provides infantry units with an organic drone-on-drone intercept capability. When a hostile drone is detected — by visual observation, portable sensors, or higher-echelon warning — a soldier launches FireFly and uses the tablet controller to fly it toward the threat. The real-time video feed allows positive identification before engagement, and the operator can abort the attack if the target is identified as friendly. For intercept, the operator maneuvers FireFly into a collision course with the hostile drone, destroying it on impact.

## Future Development

Rafael is developing enhanced variants with longer endurance, improved autonomous flight modes for counter-UAS intercept, and enhanced warheads for greater effect. The company is also exploring swarm concepts where multiple FireFly units can be coordinated for defense against multiple simultaneous drone threats.`,
  },
  {
    name: 'SUNGUR',
    slug: 'sungur',
    description: 'SUNGUR is a Turkish man-portable air defense system (MANPADS) developed by Roketsan with effective counter-UAS capability against Group 2-3 drones.',
    category: 'effector',
    manufacturer: 'Roketsan',
    country: 'Turkey',
    status: 'operational',
    primaryCapability: 'Man-portable air defense against low-altitude aircraft, helicopters, and medium-to-large UAS.',
    specifications: [
      'Type: MANPADS (infrared-guided)',
      'Weight: ~16 kg (missile and launcher)',
      'Range: 6+ km',
      'Altitude: up to 4 km',
      'Dual-band IR seeker',
      'IFF interrogator',
    ],
    platforms: ['Man-portable', 'Vehicle pedestal mount'],
    deployedBy: ['Turkish Armed Forces'],
    inServiceDate: '2022',
    effectiveRange: '6+ km',
    whatItIs: 'SUNGUR is Turkey\'s first domestically developed man-portable air defense system, built by Roketsan to replace imported MANPADS. Its modern dual-band infrared seeker provides effective capability against low-flying aircraft and, importantly, medium and large unmanned aerial systems that present sufficient infrared signatures.',
    howItWorks: 'The gunner acquires the target visually or via cueing from higher-echelon air defense systems, locks the dual-band IR seeker onto the target\'s heat signature, and fires. The missile guides autonomously to the target using proportional navigation. The dual-band seeker provides improved resistance to infrared countermeasures and better tracking of low-signature targets like UAS.',
    keyFeatures: [
      'Domestically developed Turkish MANPADS',
      'Dual-band IR seeker for improved tracking',
      'Effective against UAS with sufficient IR signature',
      'IFF system prevents fratricide',
      'Compatible with vehicle pedestal mounts',
    ],
    advantages: [
      'Man-portable for forward deployment',
      'Modern seeker technology',
      'Effective against medium/large UAS',
      'Domestic production reduces foreign dependency',
    ],
    disadvantages: [
      'IR seeker may struggle against small, cool-running drones',
      'Overkill against small commercial UAS',
      'Limited magazine (one round per launcher)',
      'Requires visual acquisition of target',
    ],
    combatRecord: 'Entered service with Turkish Armed Forces. Specific operational use details not publicly available.',
    relatedSystems: ['Stinger FIM-92', 'Type 11 SAM', 'NASAMS'],
    featured: false,
    content: `## Overview

SUNGUR marks Turkey's achievement of domestic man-portable air defense capability, providing Turkish forces with a modern MANPADS that reduces dependence on foreign suppliers. Developed by Roketsan, Turkey's leading missile manufacturer, SUNGUR features a dual-band infrared seeker that gives it improved capability against low-observable targets, including medium and large unmanned aerial systems that may have smaller heat signatures than conventional aircraft.

## Development History

Turkey's development of SUNGUR was driven by both the desire for defense self-sufficiency and the recognition that MANPADS would play an important role in countering the growing UAS threat. Roketsan began development in the 2010s, leveraging its extensive experience in missile seeker and propulsion technology. The dual-band IR seeker — operating in two infrared wavelength bands simultaneously — was a key development achievement, providing improved target discrimination and countermeasure resistance compared to single-band seekers.

## Operational Concept

SUNGUR is employed by air defense teams operating at the forward edge of the battlefield, providing point defense against low-altitude air threats. Against UAS targets, the gunner is typically cued by early warning radar or visual observation. The dual-band seeker acquires the drone's infrared signature, and after lock-on confirmation, the missile is fired to autonomously intercept the target. SUNGUR can also be mounted on light vehicles using a pedestal launcher for mobile air defense operations.

## Future Development

Roketsan is developing enhanced variants with improved seeker sensitivity for better performance against low-signature UAS targets, as well as a vehicle-integrated version with multiple missiles and dedicated fire control radar. Turkey's extensive experience with drone warfare — both operating and defending against UAS — provides valuable feedback for SUNGUR's continued development.`,
  },
  {
    name: 'DRDO Anti-Drone System',
    slug: 'drdo-anti-drone-system',
    description: 'India\'s Defence Research and Development Organisation (DRDO) counter-UAS system providing integrated detection and multi-layer defeat capability for protection of critical assets.',
    category: 'integrated',
    manufacturer: 'DRDO (Defence Research and Development Organisation)',
    country: 'India',
    status: 'operational',
    primaryCapability: 'Integrated counter-UAS detection, tracking, and multi-layer defeat including jamming, laser, and kinetic options.',
    specifications: [
      'Radar detection: 4+ km',
      'EO/IR tracking suite',
      'RF jammer',
      'Laser-based hard kill option',
      'Vehicle-mounted mobile configuration',
      'GNSS spoofing capability',
    ],
    platforms: ['Vehicle-mounted', 'Fixed installation'],
    deployedBy: ['Indian Armed Forces', 'Indian security agencies'],
    inServiceDate: '2020',
    detectionRange: '4+ km',
    effectiveRange: '2+ km',
    whatItIs: 'The DRDO Anti-Drone System is India\'s indigenously developed counter-UAS solution, created to address drone threats to military installations and high-value events. It integrates radar detection, EO/IR tracking, RF jamming, GNSS spoofing, and a laser-based hard-kill capability into a single mobile package.',
    howItWorks: 'The system uses radar and EO/IR sensors to detect and track drone targets. Upon detection, the operator can employ soft-kill measures — RF jamming to disrupt the drone\'s control link and GNSS spoofing to confuse its navigation — or hard-kill options including a directed energy laser for physical destruction of the drone.',
    keyFeatures: [
      'Indigenously developed by India',
      'Multi-layer defeat: jamming, spoofing, and laser',
      'Mobile and rapidly deployable',
      'Integrated sensor and effector suite',
      'Demonstrated at Republic Day events',
    ],
    advantages: [
      'Multiple defeat options for different scenarios',
      'Domestic production and maintenance',
      'Proven in real-world security operations',
      'Laser hard-kill provides definitive defeat',
    ],
    disadvantages: [
      'Detection range limited compared to Western systems',
      'Laser effectiveness in adverse weather',
      'Limited against autonomous drones (for soft-kill)',
      'Still maturing compared to established programs',
    ],
    combatRecord: 'Deployed for security at major Indian national events including Republic Day celebrations in New Delhi. Used operationally for protection of critical sites along borders.',
    relatedSystems: ['AUDS', 'FS-LIDS', 'Hyungung Anti-Drone'],
    featured: false,
    content: `## Overview

The DRDO Anti-Drone System represents India's indigenous answer to the growing unmanned aerial threat, providing Indian armed forces and security agencies with an integrated counter-UAS capability developed entirely within the country. The system combines multiple detection and defeat technologies — including the noteworthy inclusion of a laser-based hard-kill option — into a mobile package that has been deployed operationally for protection of high-value events and critical infrastructure.

## Development History

India's DRDO developed the Anti-Drone System in response to growing security concerns about unauthorized drone activity near military installations, government buildings, and major public events. The urgency increased following reports of drone-based attacks and surveillance incidents in the region. DRDO leveraged its broad technology base across radar, optics, electronic warfare, and laser weapons to create an integrated solution. The system was first publicly demonstrated during India's Republic Day celebrations in 2020.

## Operational Concept

The system operates in a layered defense approach. At the outer layer, radar and EO/IR sensors detect and track incoming drones. The operator then selects the appropriate countermeasure based on the threat and situation. For controlled airspace violations by commercial drones, soft-kill measures — RF jamming and GNSS spoofing — may be sufficient to force the drone to land or return to its launch point. For confirmed hostile threats or situations requiring definitive defeat, the laser effector provides a hard-kill capability that physically destroys the drone in flight.

## Future Development

DRDO is developing enhanced versions with improved detection ranges, more powerful laser effectors, and integration with India's broader air defense networks. The system is being offered for export and is also being adapted for naval applications. India's expanding domestic drone industry provides both a growing threat to defend against and an industrial base to draw upon for counter-UAS technology development.`,
  },
  {
    name: 'ST Engineering C-UAS',
    slug: 'st-engineering-cuas',
    description: 'ST Engineering\'s comprehensive counter-UAS solution for Singapore and export, integrating radar, EO/IR, RF detection, and multi-layer effectors for protection of critical sites.',
    category: 'integrated',
    manufacturer: 'ST Engineering',
    country: 'Singapore',
    status: 'operational',
    primaryCapability: 'Integrated multi-sensor detection and multi-effector defeat of UAS threats for homeland and military defense.',
    specifications: [
      'Multi-sensor suite (radar, EO/IR, RF)',
      'Electronic countermeasures',
      'Net-based drone capture option',
      'AI-powered threat classification',
      'Networked sensor architecture',
      'Mobile and fixed configurations',
    ],
    platforms: ['Fixed site', 'Vehicle-mounted', 'Portable'],
    deployedBy: ['Singapore Armed Forces', 'Singapore Police Force', 'Export customers'],
    inServiceDate: '2019',
    whatItIs: 'ST Engineering\'s C-UAS solution is Singapore\'s comprehensive counter-drone offering, developed by the city-state\'s premier defense company. It provides integrated detection, tracking, classification, and defeat capabilities using a combination of sensors, electronic warfare, and kinetic/non-kinetic effectors tailored for urban and critical infrastructure protection.',
    howItWorks: 'The system deploys a network of sensors including radar, EO/IR cameras, and RF detectors around the protected area. AI-powered processing fuses sensor data to detect, classify, and track UAS threats. Operators can then employ electronic countermeasures to jam the drone\'s control link, deploy interceptor drones with nets, or use other effectors depending on the operational environment and rules of engagement.',
    keyFeatures: [
      'Designed for dense urban environment',
      'AI-powered sensor fusion and classification',
      'Multiple defeat options including drone nets',
      'Scalable networked architecture',
      'Suitable for civilian and military applications',
    ],
    advantages: [
      'Optimized for urban and critical infrastructure protection',
      'Multiple defeat options minimize collateral effects',
      'AI automation handles high-density airspace',
      'Proven Singapore defense technology',
    ],
    disadvantages: [
      'Primarily urban/point defense focus',
      'Limited long-range capability',
      'Relatively small production volumes',
      'Niche export market',
    ],
    relatedSystems: ['AUDS', 'FS-LIDS', 'DRDO Anti-Drone System'],
    featured: false,
    content: `## Overview

ST Engineering's counter-UAS solution reflects Singapore's pragmatic approach to defense — a comprehensive, technologically sophisticated system designed for the specific challenges of protecting a small, densely urbanized island nation. The system integrates multiple sensor types with AI-powered processing and a range of defeat options suitable for use in populated areas where collateral effects must be minimized.

## Development History

Singapore's strategic position and dense urban environment created unique requirements for counter-UAS capability that off-the-shelf military systems could not fully address. ST Engineering, Singapore's largest defense company, developed its C-UAS solution to provide tailored protection for the city-state's critical infrastructure, military installations, and major national events. The system incorporates Singapore's expertise in electronics, AI, and urban security operations.

## Operational Concept

In operation, the system creates a sensor network around the protected area, with radar, EO/IR cameras, and RF detectors providing overlapping coverage. AI algorithms process the combined sensor data to automatically detect and classify UAS threats, distinguishing between authorized drones and potential threats in Singapore's complex airspace. When a threat is confirmed, operators select the appropriate countermeasure — electronic warfare for forced landing, interceptor drones with nets for physical capture, or other effectors as needed. The emphasis on non-destructive capture reflects the urban operating environment where falling drone debris poses significant risk.

## Future Development

ST Engineering continues to enhance its C-UAS offering with improved AI capabilities, longer-range detection, and new effector options. The company is actively pursuing export sales to other city-states and countries facing similar urban drone security challenges. Integration with Singapore's broader Smart Nation sensor network is also being explored for comprehensive urban airspace management.`,
  },
  // ============================================================
  // COMMERCIAL / EXPORT SYSTEMS
  // ============================================================
  {
    name: 'Fortem SkyDome',
    slug: 'fortem-skydome',
    description: 'Fortem Technologies SkyDome is an AI-driven airspace awareness and counter-UAS platform combining TrueView radar, DroneHunter interceptors, and cloud-based command and control.',
    category: 'integrated',
    manufacturer: 'Fortem Technologies',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'Comprehensive AI-driven airspace awareness, drone detection, and autonomous drone-on-drone intercept.',
    specifications: [
      'TrueView radar network',
      'DroneHunter F700 interceptor integration',
      'SkyDome Manager cloud C2',
      'AI-powered classification',
      'Autonomous intercept capability',
      'Distributed sensor architecture',
    ],
    platforms: ['Distributed ground sensors', 'Cloud-based C2'],
    deployedBy: ['US DoD', 'Commercial airports', 'Critical infrastructure', 'Sports venues'],
    inServiceDate: '2019',
    whatItIs: 'Fortem SkyDome is an integrated airspace security platform that combines Fortem\'s TrueView radar network, AI-powered threat classification, DroneHunter autonomous interceptor drones, and cloud-based command-and-control into a comprehensive counter-UAS solution. It provides wide-area airspace awareness and active defense capability.',
    howItWorks: 'The SkyDome platform deploys a network of compact TrueView radars that provide continuous airspace surveillance, detecting and tracking all aerial objects. AI algorithms classify each detection and identify potential UAS threats. When a hostile drone is confirmed, the system can autonomously launch DroneHunter F700 interceptor drones that pursue and capture the threat using a tethered net, safely bringing it to the ground without destructive effects.',
    keyFeatures: [
      'Comprehensive detect-to-defeat solution',
      'AI-powered autonomous operations',
      'Non-destructive drone capture via nets',
      'Cloud-based scalable architecture',
      'Distributed radar network for wide coverage',
    ],
    advantages: [
      'End-to-end integrated solution',
      'Safe non-destructive drone capture',
      'Scalable from single site to wide area',
      'Proven at major public events',
    ],
    disadvantages: [
      'DroneHunter limited by weather conditions',
      'Net capture may not work against all drone types',
      'Requires robust network connectivity',
      'Higher cost than sensor-only solutions',
    ],
    combatRecord: 'Deployed for protection of major events including the Super Bowl, used by DoD for installation protection, and deployed internationally.',
    relatedSystems: ['DroneHunter F700', 'DroneSentry-C2', 'DedroneTracker'],
    featured: false,
    content: `## Overview

Fortem Technologies' SkyDome platform represents one of the most comprehensive commercially available counter-UAS solutions, integrating radar detection, AI-powered classification, autonomous drone-on-drone intercept, and cloud-based command-and-control into a single ecosystem. The system has been deployed for protection of some of the highest-profile events and facilities in the United States, demonstrating its maturity and effectiveness.

## Development History

Fortem Technologies, based in Pleasant Grove, Utah, was founded with the vision of creating autonomous airspace security. The company developed the TrueView radar specifically for drone detection, then created the SkyDome software platform to manage distributed sensor networks, and integrated its DroneHunter interceptor drone for active defeat. This full-stack approach — from sensor to effector to C2 — distinguishes Fortem from companies offering only individual components.

## Operational Concept

SkyDome creates a persistent airspace surveillance bubble using distributed TrueView radars positioned around the protected area. These compact radars detect and track all aerial objects, with the AI engine classifying each as friend, foe, or unknown. When a hostile drone is identified, the system can autonomously scramble DroneHunter interceptors that fly to the target and capture it in a tethered net, safely lowering it to the ground. This non-destructive approach is critical for operations over populated areas where falling drone debris or explosive ordnance would be unacceptable.

## Future Development

Fortem is developing enhanced radar capabilities for longer-range detection of smaller drones, improved AI algorithms for distinguishing drones from birds and other clutter, and faster-response DroneHunter variants for engagement of high-speed threats. The company is also expanding its SkyDome platform for integration with third-party sensors and effectors, positioning it as an open architecture for comprehensive airspace security.`,
  },
  {
    name: 'Dedrone City',
    slug: 'dedrone-city',
    description: 'Dedrone City is an urban-scale counter-UAS platform designed to provide comprehensive drone detection, tracking, and alerting across entire metropolitan areas and critical infrastructure networks.',
    category: 'c2',
    manufacturer: 'Dedrone',
    country: 'United States',
    status: 'operational',
    primaryCapability: 'City-wide drone detection, tracking, and airspace management using distributed sensor networks and centralized AI-powered command and control.',
    specifications: [
      'Multi-sensor network (RF, radar, EO/IR, acoustic)',
      'AI-powered classification and tracking',
      'Cloud-based command and control',
      'City-scale coverage area',
      'UTM integration capability',
      'Real-time alerting and forensics',
    ],
    platforms: ['Distributed urban sensor network', 'Cloud C2'],
    deployedBy: ['Major metropolitan areas', 'Airport authorities', 'Federal security agencies'],
    inServiceDate: '2021',
    whatItIs: 'Dedrone City extends Dedrone\'s airspace security platform to the metropolitan scale, deploying networks of sensors across entire cities to provide comprehensive drone detection, tracking, and management. The platform integrates with unmanned traffic management (UTM) systems to distinguish authorized from unauthorized drone operations.',
    howItWorks: 'Dedrone City deploys a distributed network of RF sensors, radars, cameras, and acoustic detectors across a metropolitan area, all connected to a cloud-based AI platform. The platform continuously monitors the city\'s airspace, classifying all detected drone activity and cross-referencing against authorized flight plans from UTM systems. Unauthorized or suspicious activity triggers automated alerts to security agencies with real-time tracking data and forensic evidence.',
    keyFeatures: [
      'City-scale airspace coverage',
      'UTM system integration',
      'Multi-sensor distributed network',
      'AI-powered classification and alerting',
      'Forensic evidence collection',
    ],
    advantages: [
      'Scales to cover entire metropolitan areas',
      'Integrates with urban airspace management',
      'Automated operation reduces staffing needs',
      'Provides forensic data for law enforcement',
    ],
    disadvantages: [
      'Very high infrastructure investment',
      'Complex multi-sensor network management',
      'Urban RF environment challenging for detection',
      'Detection-only; requires separate effectors',
    ],
    relatedSystems: ['DedroneTracker', 'DedroneRF', 'Fortem SkyDome'],
    featured: false,
    content: `## Overview

Dedrone City takes the counter-UAS mission to the metropolitan scale, providing entire cities with persistent drone detection, tracking, and airspace management capability. As urban drone operations expand — for delivery, inspection, entertainment, and other commercial purposes — the need to distinguish authorized flights from potential threats becomes critical. Dedrone City addresses this challenge with a distributed sensor network and AI-powered command-and-control platform.

## Development History

Dedrone developed its City platform in response to the growing challenge of managing urban airspace as commercial drone operations proliferate. Early counter-UAS systems were designed for single-site protection, but the expanding use of drones in metropolitan areas created demand for city-scale airspace awareness. Dedrone leveraged its existing sensor technology and AI platform to create a scalable solution that could cover metropolitan areas while integrating with emerging unmanned traffic management systems.

## Operational Concept

Dedrone City deploys sensors throughout a metropolitan area — on buildings, utility poles, and other infrastructure — to create a persistent airspace surveillance network. The cloud-based AI platform processes data from all sensors simultaneously, maintaining a real-time picture of all drone activity across the city. Authorized flights registered in UTM systems are tracked and verified, while unregistered or suspicious drone activity triggers automated alerts to security operations centers. The system provides real-time tracking, historical replay, and forensic data for investigation and prosecution.

## Future Development

Dedrone is expanding City's capabilities with improved detection of smaller drones in cluttered urban environments, enhanced integration with advanced air mobility (AAM) traffic management systems, and development of urban-safe effector options for authorized enforcement agencies. As cities worldwide grapple with drone regulation and enforcement, the demand for city-scale counter-UAS capability is expected to grow significantly.`,
  },
  {
    name: 'Blighter A800',
    slug: 'blighter-a800',
    description: 'Blighter Surveillance Systems A800 3D multi-mode radar providing persistent wide-area drone detection and tracking for counter-UAS and perimeter security applications.',
    category: 'sensor',
    manufacturer: 'Blighter Surveillance Systems',
    country: 'United Kingdom',
    status: 'operational',
    primaryCapability: 'Wide-area 3D radar detection and tracking of drones, people, vehicles, and other targets for C-UAS and security.',
    specifications: [
      'Type: FMCW Doppler radar',
      '3D detection (range, azimuth, elevation)',
      'Detection range: 10+ km (small UAS)',
      'Electronic scanning (no mechanical rotation)',
      'AESA technology',
      'Low power consumption',
    ],
    platforms: ['Fixed mast', 'Vehicle-mounted', 'Tripod-portable'],
    deployedBy: ['UK MoD', 'NATO forces', 'Border security agencies'],
    inServiceDate: '2017',
    detectionRange: '10+ km',
    whatItIs: 'The Blighter A800 is a multi-mode 3D electronic scanning radar developed by Blighter Surveillance Systems for persistent detection and tracking of small drones, ground targets, and maritime threats. Using advanced FMCW Doppler technology with no moving parts, it provides reliable, maintenance-free operation for long-term counter-UAS surveillance.',
    howItWorks: 'The A800 uses Frequency Modulated Continuous Wave (FMCW) Doppler technology with an active electronically scanned array to detect and track small moving targets in three dimensions. The radar distinguishes drones from birds and clutter using micro-Doppler signature analysis, which identifies the characteristic blade rotation patterns of multi-rotor drones. With no mechanical moving parts, the radar offers exceptional reliability and minimal maintenance requirements.',
    keyFeatures: [
      '3D detection with electronic scanning',
      'Micro-Doppler analysis for drone classification',
      'No moving parts for high reliability',
      'Multi-mode: air, ground, and maritime',
      'Low power and compact form factor',
    ],
    advantages: [
      'Excellent small drone detection capability',
      'Very high reliability with no moving parts',
      'Advanced clutter rejection and drone classification',
      'Low total cost of ownership',
    ],
    disadvantages: [
      'Sensor only — requires separate effectors',
      'Fixed sector coverage per unit',
      'Performance affected by terrain masking',
      'Requires integration into broader C-UAS solution',
    ],
    combatRecord: 'Deployed globally for border security, critical infrastructure protection, and military counter-UAS applications. Component of the AUDS system.',
    relatedSystems: ['AUDS', 'KURFS', 'Giraffe 1X'],
    featured: false,
    content: `## Overview

The Blighter A800 3D multi-mode radar is a leading sensor for counter-UAS applications, providing wide-area persistent detection and tracking of small drones using advanced electronic scanning technology. Developed by Blighter Surveillance Systems in the United Kingdom, the A800 has earned a strong reputation for its ability to reliably detect and classify small drone targets while rejecting clutter from birds and other false alarm sources.

## Development History

Blighter Surveillance Systems, based in Essex, UK, has been developing electronic scanning radar technology for over two decades. The A800 represents the latest generation of their FMCW radar family, incorporating 3D detection, AESA technology, and advanced signal processing specifically optimized for the counter-UAS mission. The company's radar technology is notably used as the detection component of the AUDS integrated counter-UAS system, where it has seen operational deployment.

## Operational Concept

The A800 is typically deployed at fixed sites or on masts around a perimeter, providing continuous surveillance of the surrounding airspace. The radar's electronic scanning covers a wide sector without mechanical rotation, offering rapid revisit rates and high reliability. When a potential drone target is detected, the radar's micro-Doppler analysis examines the target's signature for the characteristic blade rotation patterns of multi-rotor drones, helping classify the detection as a drone rather than a bird or other false alarm. Confirmed detections are passed to command-and-control systems for operator assessment and potential effector engagement.

## Future Development

Blighter continues to enhance the A800 with improved signal processing for detection of smaller and more evasive drone targets, extended range performance, and better classification algorithms leveraging AI and machine learning. Integration with a broader range of C-UAS command and control platforms is also a development priority.`,
  },
  {
    name: 'Robin IRIS',
    slug: 'robin-iris',
    description: 'Robin Radar Systems IRIS is a purpose-built 3D drone detection radar using holographic antenna technology for high-performance counter-UAS surveillance.',
    category: 'sensor',
    manufacturer: 'Robin Radar Systems',
    country: 'Netherlands',
    status: 'operational',
    primaryCapability: '3D radar detection and tracking of small UAS using patented holographic radar technology.',
    specifications: [
      'Type: 3D holographic radar',
      'Detection range: 5+ km (small UAS)',
      '360-degree mechanical scanning',
      'Altitude measurement capability',
      'Advanced drone classification',
      'Weatherproof outdoor design',
    ],
    platforms: ['Fixed installation', 'Trailer-portable'],
    deployedBy: ['European military and security forces', 'Airports', 'Critical infrastructure'],
    inServiceDate: '2018',
    detectionRange: '5+ km',
    whatItIs: 'Robin Radar Systems IRIS is a dedicated 3D drone detection radar developed in the Netherlands using patented holographic antenna technology. Designed specifically for the counter-UAS mission, IRIS provides reliable detection, tracking, and classification of small drones in the presence of bird clutter — leveraging Robin Radar\'s extensive experience in avian radar systems.',
    howItWorks: 'IRIS uses a rotating antenna with holographic radar technology that provides 3D target measurements including range, azimuth, elevation, and altitude. Advanced classification algorithms — developed from Robin Radar\'s decades of experience in avian radar — reliably distinguish drones from birds based on flight characteristics, radar cross section, and micro-Doppler signatures. This heritage in bird-drone discrimination is a key differentiator for airport and natural environment deployments.',
    keyFeatures: [
      'Patented holographic radar technology',
      '3D detection with altitude measurement',
      'Advanced bird-drone discrimination',
      'Purpose-built for counter-UAS mission',
      'Leverages avian radar heritage',
    ],
    advantages: [
      'Excellent drone-bird discrimination',
      'Full 3D tracking with altitude',
      'Heritage from proven avian radar systems',
      'Optimized specifically for small drone detection',
    ],
    disadvantages: [
      'Sensor only — no defeat capability',
      'Mechanical rotation limits scan rate',
      'Moderate detection range',
      'Niche manufacturer with smaller production scale',
    ],
    relatedSystems: ['Blighter A800', 'KURFS', 'Giraffe 1X'],
    featured: false,
    content: `## Overview

Robin Radar Systems' IRIS radar brings a unique advantage to the counter-UAS sensor market: decades of experience in avian radar technology that translates directly into superior ability to distinguish drones from birds. In environments like airports, nature reserves, and coastal areas where bird clutter creates enormous challenges for drone detection, IRIS's classification heritage provides a significant performance edge over radars designed without this specialized background.

## Development History

Robin Radar Systems, based in The Hague, Netherlands, built its reputation on avian detection radar systems used worldwide at airports and wind farms for bird strike prevention. When the counter-UAS market emerged, Robin recognized that the same challenges of detecting small, slow-moving flying objects in the presence of clutter applied to drone detection. The company developed IRIS by applying its holographic radar technology and classification expertise specifically to the counter-UAS mission, creating a radar purpose-built for drone detection.

## Operational Concept

IRIS is deployed at sites requiring reliable drone detection with minimal false alarms from bird activity. The radar's 360-degree rotating antenna provides continuous 3D surveillance, detecting and tracking all aerial targets. The classification engine — trained on millions of bird and drone observations — analyzes each target's flight behavior, speed profile, radar cross section, and micro-Doppler characteristics to determine whether it is a bird or a drone. This capability is particularly valuable at airports, where bird populations create high-clutter environments that challenge most radar systems.

## Future Development

Robin Radar is developing enhanced IRIS variants with improved detection range, faster scanning rates, and AI-enhanced classification for emerging drone types including fixed-wing and hybrid VTOL platforms. Integration with the growing ecosystem of C-UAS command-and-control platforms and effector systems is a key development priority.`,
  },
  {
    name: 'Hensoldt Spexer 2000',
    slug: 'hensoldt-spexer-2000',
    description: 'Hensoldt Spexer 2000 is a German multi-mission AESA surveillance radar providing high-performance detection of drones, people, vehicles, and low-flying aircraft for C-UAS and border security.',
    category: 'sensor',
    manufacturer: 'Hensoldt',
    country: 'Germany',
    status: 'operational',
    primaryCapability: 'Multi-mission AESA radar for detection and tracking of small UAS, ground targets, and low-flying aircraft.',
    specifications: [
      'Type: AESA (Active Electronically Scanned Array)',
      'Detection range: 10+ km (small UAS)',
      'Multi-beam electronic scanning',
      'Simultaneous air and ground surveillance',
      '3D target tracking',
      'Low probability of intercept',
    ],
    platforms: ['Fixed installation', 'Vehicle-mounted', 'Ship-mounted'],
    deployedBy: ['German Bundeswehr', 'NATO forces', 'Export customers'],
    inServiceDate: '2016',
    detectionRange: '10+ km',
    whatItIs: 'Hensoldt Spexer 2000 is a multi-mission AESA surveillance radar designed by the German sensor specialist Hensoldt for simultaneous air and ground surveillance. Its advanced electronic scanning and signal processing provide reliable detection of small drone targets at extended ranges, making it a key sensor component in European counter-UAS architectures.',
    howItWorks: 'Spexer 2000 uses an active electronically scanned array to create multiple simultaneous beams, enabling parallel surveillance of different sectors and altitudes. This multi-beam approach provides rapid scan coverage and high target update rates essential for tracking small, maneuvering drones. Advanced signal processing discriminates drones from ground clutter and natural objects, providing reliable automated detection and tracking.',
    keyFeatures: [
      'AESA multi-beam technology',
      'Simultaneous air and ground surveillance',
      'Extended small UAS detection range',
      'Low probability of intercept',
      'Multi-mission versatility',
    ],
    advantages: [
      'Long detection range against small UAS',
      'Multi-mission reduces sensor requirements',
      'AESA reliability and flexibility',
      'Established Hensoldt support network',
    ],
    disadvantages: [
      'Sensor only — requires separate effectors',
      'Higher cost than simpler radar systems',
      'Complex system requiring trained operators',
      'Fixed sector coverage per panel',
    ],
    relatedSystems: ['Blighter A800', 'KURFS', 'Giraffe 4A'],
    featured: false,
    content: `## Overview

Hensoldt's Spexer 2000 represents German sensor engineering excellence applied to the counter-UAS challenge. As a multi-mission AESA radar, it provides simultaneous surveillance of both airspace and ground domains, detecting targets ranging from small commercial drones to vehicles and dismounted personnel. This multi-mission capability makes it particularly valuable for integrated security operations where counter-UAS is one of several surveillance requirements.

## Development History

Hensoldt, Germany's leading sensor house, developed the Spexer family of radars to address the growing need for multi-mission surveillance capability. The Spexer 2000 variant was specifically designed for extended-range performance against small, slow targets like drones and dismounted personnel. Drawing on Hensoldt's decades of experience in military radar technology — including the TRML-4D and Giraffe family — Spexer 2000 applies sophisticated AESA techniques to the shorter-range, high-resolution surveillance mission.

## Operational Concept

Spexer 2000 is deployed as a surveillance sensor for perimeter security, border protection, and counter-UAS applications. Its AESA antenna creates multiple electronic beams that simultaneously scan different sectors and altitudes, providing comprehensive coverage with rapid target update rates. The radar's signal processing automatically detects and classifies potential drone targets, passing tracking data to command-and-control systems for operator assessment and potential engagement by connected effectors.

## Future Development

Hensoldt continues to evolve the Spexer platform with enhanced AI-based classification, wider detection coverage, and improved integration with counter-UAS effector systems. The company is also developing variants optimized for specific application scenarios including urban security, naval ship protection, and mobile military deployment. Integration with Hensoldt's broader sensor ecosystem enables comprehensive multi-domain surveillance.`,
  },
  {
    name: 'Saab Giraffe 4A',
    slug: 'saab-giraffe-4a',
    description: 'Saab Giraffe 4A is a Swedish multi-mission AESA radar providing simultaneous air surveillance, counter-battery, and counter-UAS capability in a single deployable system.',
    category: 'sensor',
    manufacturer: 'Saab',
    country: 'Sweden',
    status: 'operational',
    primaryCapability: 'Multi-mission 3D AESA radar for air surveillance, counter-battery, and counter-UAS detection and tracking.',
    specifications: [
      'Type: AESA 3D multi-mission radar',
      'Detection range: 100+ km (air targets)',
      'UAS detection range: 20+ km (depending on target)',
      'Simultaneous air surveillance and counter-battery',
      'Counter-UAS detection mode',
      'Vehicle-mounted mobile configuration',
    ],
    platforms: ['Heavy truck (mobile)', 'Fixed installation'],
    deployedBy: ['Swedish Armed Forces', 'NATO forces', 'Export customers'],
    inServiceDate: '2020',
    detectionRange: '100+ km (air), 20+ km (UAS)',
    whatItIs: 'Saab Giraffe 4A is a state-of-the-art multi-mission AESA radar that performs air surveillance, counter-battery fire locating, and counter-UAS detection simultaneously. Part of the renowned Giraffe radar family, the 4A variant represents the latest in Swedish radar technology, providing a single sensor solution for multiple air defense missions.',
    howItWorks: 'Giraffe 4A uses its AESA antenna to electronically form and steer multiple beams simultaneously, enabling it to perform air surveillance, track ballistic projectiles for counter-battery location, and detect small UAS targets — all at the same time. The radar automatically adjusts its waveform and processing for each mission, optimizing performance against different target types without the operator having to switch modes.',
    keyFeatures: [
      'True multi-mission: air, C-RAM, and C-UAS simultaneously',
      'AESA electronic beam steering',
      'Extended range performance',
      'Part of proven Giraffe radar family',
      'Mobile and rapidly deployable',
    ],
    advantages: [
      'One radar replaces multiple mission-specific sensors',
      'Excellent detection performance across target types',
      'Proven Saab radar technology and support',
      'Fully mobile for tactical deployment',
    ],
    disadvantages: [
      'Large and heavy system for mobile use',
      'High acquisition cost',
      'Sensor only — no effector capability',
      'Complex system requiring specialized operators',
    ],
    combatRecord: 'The Giraffe radar family has been deployed globally and is in operational service with multiple NATO and partner nations.',
    relatedSystems: ['Giraffe 1X', 'KURFS', 'AN/TPS-80 G/ATOR'],
    featured: false,
    content: `## Overview

Saab's Giraffe 4A represents the pinnacle of the renowned Giraffe radar family, providing a true multi-mission capability that simultaneously performs air surveillance, counter-battery fire locating, and counter-UAS detection from a single mobile platform. In an era where military forces need to detect threats ranging from ballistic missiles to micro-drones, Giraffe 4A's ability to address all these missions concurrently without compromise is a significant operational advantage.

## Development History

The Giraffe radar family has been Saab's flagship ground-based radar product line for decades, with successive generations providing increasingly capable multi-role performance. The 4A variant was developed to address the modern multi-threat environment where air defense forces must simultaneously contend with traditional air threats, indirect fire (rockets and artillery), and small unmanned aerial systems. By using advanced AESA technology, Giraffe 4A can allocate radar resources dynamically across all mission areas.

## Operational Concept

In the counter-UAS role, Giraffe 4A leverages its AESA beam agility to dedicate a portion of its radar resources to scanning for small, low-altitude drone targets while simultaneously maintaining its primary air surveillance and counter-battery missions. The radar's advanced signal processing extracts small UAS targets from ground clutter and classifies them, providing early warning and tracking data to air defense command-and-control systems. This integrated approach means units equipped with Giraffe 4A gain counter-UAS awareness without needing to deploy additional dedicated drone detection radars.

## Future Development

Saab continues to evolve Giraffe 4A with enhanced processing for improved small drone detection, AI-assisted classification, and deeper integration with counter-UAS effector systems. The radar's software-defined architecture allows capability updates through software rather than hardware changes, ensuring the system can adapt to emerging UAS threats throughout its service life.`,
  },

  // ============================================================
  // THREAT / ADVERSARY UAS SYSTEMS (15 systems)
  // ============================================================

  // ─── IRANIAN SYSTEMS ───────────────────────────────────────────────
  {
    name: 'Shahed-136',
    slug: 'shahed-136',
    description:
      'Iranian-designed one-way attack drone (loitering munition) with delta-wing configuration, extensively used by Russia under the designation Geran-2 in mass strikes against Ukrainian infrastructure.',
    category: 'threat-loitering',
    manufacturer: 'Iran Aircraft Manufacturing Industrial Company (HESA)',
    country: 'Iran',
    status: 'combat-proven',
    primaryCapability:
      'Long-range one-way attack against fixed targets including critical infrastructure, military positions, and energy facilities using GPS-guided terminal dive.',
    specifications: [
      'Wingspan: ~2.5 m',
      'Length: ~3.5 m',
      'Launch weight: ~200 kg',
      'Warhead: ~40-50 kg high-explosive fragmentation',
      'Range: ~2,000-2,500 km',
      'Cruise speed: ~185 km/h',
      'Engine: Mado MD-550 four-cylinder piston engine (50 hp)',
      'Guidance: Inertial navigation + GPS',
      'Launch method: Rail-launched from truck-mounted racks (typically 5 per launcher)',
      'Endurance: ~10+ hours',
    ],
    platforms: ['Ground-launched from truck-mounted rail systems'],
    deployedBy: [
      'Russia (as Geran-2)',
      'Iran (IRGC)',
      'Houthi forces (Ansar Allah)',
      'Hezbollah',
    ],
    inServiceDate: '2021',
    effectiveRange: '2,000-2,500 km',
    whatItIs:
      'The Shahed-136 is an Iranian-manufactured delta-wing one-way attack unmanned aerial vehicle (OWA-UAV), sometimes called a loitering munition or "kamikaze drone." It is designed to be produced cheaply in large numbers and launched in saturation attacks to overwhelm air defenses. Russia designates its variant the Geran-2.',
    howItWorks:
      'The Shahed-136 is launched from a ground-based rail system, typically mounted on a truck chassis carrying five units. After launch, it follows a pre-programmed GPS waypoint route at low altitude to its target area. The small piston engine provides a distinctive moped-like sound. On reaching the target coordinates, the drone enters a terminal dive, detonating its warhead on impact. It has no real-time operator control or ability to re-target in flight.',
    keyFeatures: [
      'Extremely low unit cost ($20,000-$50,000 estimated)',
      'Simple construction enabling mass production',
      'Delta-wing design for aerodynamic efficiency',
      'Long range for strategic target strikes',
      'Low radar cross-section and thermal signature',
      'Launched in salvos to saturate air defenses',
    ],
    advantages: [
      'Very cheap compared to cruise missiles (cost ratio of 1:100+)',
      'Producible in large quantities with relatively low-tech manufacturing',
      'Effective against fixed infrastructure when used in mass',
      'Low flight altitude complicates radar detection',
      'Forces defenders to expend expensive interceptors on cheap drones',
      'Simple logistics chain',
    ],
    disadvantages: [
      'Slow cruise speed makes it vulnerable to fighters and MANPADS',
      'GPS-only guidance is susceptible to jamming and spoofing',
      'Cannot be retargeted after launch',
      'Limited warhead size compared to cruise missiles',
      'Loud engine provides audible early warning',
      'No electro-optical seeker for precision terminal guidance',
    ],
    combatRecord:
      'First combat use attributed to Houthi attacks on Saudi Arabia and UAE in 2022. Russia began large-scale use of the Shahed-136 (as Geran-2) against Ukraine in September 2022, launching hundreds per month in waves targeting electrical grid infrastructure, heating plants, and civilian areas. During winter 2022-2023, Russia used Shahed-136 swarms alongside cruise missiles to systematically attack Ukrainian energy infrastructure. By early 2024, Russia was reportedly launching 2,000-3,000 Shaheds per month. Ukraine has shot down the majority (claimed 80%+ intercept rate) using a combination of mobile fire groups with machine guns, Gepard self-propelled anti-aircraft guns, and electronic warfare. Despite high intercept rates, the economic asymmetry heavily favors the attacker.',
    relatedSystems: ['Shahed-131', 'Shahed-238', 'Geran-2'],
    featured: false,
    content: `## Overview

The Shahed-136, designated Geran-2 by Russia, is an Iranian-produced one-way attack drone that has become one of the most consequential weapons of the war in Ukraine. Designed as an inexpensive, mass-producible loitering munition, the Shahed-136 embodies a philosophy of overwhelming air defenses through sheer numbers rather than individual sophistication. Its delta-wing planform, simple piston engine, and GPS-guided navigation allow it to be manufactured for an estimated $20,000-$50,000 per unit — a fraction of the cost of cruise missiles.

## Technical Details

The Shahed-136 features a distinctive triangular delta wing with a wingspan of approximately 2.5 meters and a total length of about 3.5 meters. It is powered by a Mado MD-550 four-cylinder piston engine producing around 50 horsepower, giving it a cruise speed of roughly 185 km/h and a range of 2,000 to 2,500 kilometers. The aircraft carries a 40-50 kg high-explosive fragmentation warhead. Navigation relies on a combination of inertial guidance and GPS, with waypoints programmed before launch. The drone is launched from a truck-mounted rail system that typically carries five units, enabling rapid salvo launches.

## Combat History

The Shahed-136 first appeared in combat during Houthi attacks on Saudi Arabia and the UAE. However, it gained global prominence when Russia began mass deployment against Ukraine starting in September 2022. Russia launched waves of Shahed-136 drones, often at night, to target Ukrainian energy infrastructure during the winter of 2022-2023 in an attempt to collapse the electrical grid. The attacks caused widespread blackouts and damage to power stations, transformer substations, and heating facilities. By 2023-2024, Russia had scaled production dramatically, with monthly launch rates reportedly reaching 2,000-3,000 units. Ukraine developed a multi-layered response including mobile fire groups armed with heavy machine guns, Gepard SPAAG systems, electronic warfare units, and adapted air defense missiles, claiming intercept rates above 80%.

## Proliferation and Strategic Impact

Iran has transferred Shahed-136 technology to Russia, which has established domestic production lines reportedly in the Alabuga special economic zone in Tatarstan. The system has also proliferated to non-state actors including Houthi forces and Hezbollah. The Shahed-136 represents a paradigm shift in modern warfare: it forces defenders to expend interceptors costing $100,000-$500,000+ to defeat drones worth $20,000-$50,000, creating an unsustainable cost exchange ratio. This has driven urgent development of cheaper counter-UAS solutions including directed energy weapons and low-cost interceptors.`,
  },
  {
    name: 'Shahed-131',
    slug: 'shahed-131',
    description:
      'Smaller variant of the Shahed-136 one-way attack drone with reduced range and warhead, used alongside its larger sibling in mass saturation attacks.',
    category: 'threat-loitering',
    manufacturer: 'Iran Aircraft Manufacturing Industrial Company (HESA)',
    country: 'Iran',
    status: 'combat-proven',
    primaryCapability:
      'Medium-range one-way attack against tactical and infrastructure targets, complementing the larger Shahed-136 in swarm attacks.',
    specifications: [
      'Wingspan: ~2.0 m',
      'Length: ~2.9 m',
      'Launch weight: ~135 kg',
      'Warhead: ~15-30 kg high-explosive',
      'Range: ~900 km',
      'Cruise speed: ~170-185 km/h',
      'Engine: Small piston engine',
      'Guidance: Inertial navigation + GPS',
      'Launch method: Rail-launched from truck-mounted racks',
    ],
    platforms: ['Ground-launched from truck-mounted rail systems'],
    deployedBy: [
      'Russia (as Geran-1)',
      'Iran (IRGC)',
      'Houthi forces (Ansar Allah)',
    ],
    inServiceDate: '2021',
    effectiveRange: '~900 km',
    whatItIs:
      'The Shahed-131 is a smaller, shorter-range variant of the Shahed-136 one-way attack drone. It carries a reduced warhead and has approximately one-third the range of its larger counterpart but maintains the same basic design philosophy and production simplicity. Russia designates it the Geran-1.',
    howItWorks:
      'Like the Shahed-136, the Shahed-131 is rail-launched from a truck-mounted system and follows pre-programmed GPS waypoints to its target. Its smaller size gives it a marginally reduced radar cross-section. It flies at low altitude and dives into its target on arrival, detonating its warhead on impact.',
    keyFeatures: [
      'Smaller and lighter than Shahed-136',
      'Even lower unit cost than Shahed-136',
      'Compatible with same launch infrastructure',
      'Reduced radar cross-section due to smaller size',
      'Used in mixed salvos with Shahed-136',
    ],
    advantages: [
      'Lower cost than the already cheap Shahed-136',
      'Smaller size complicates visual and radar detection',
      'Same launcher compatibility simplifies logistics',
      'Mass-producible with simple manufacturing',
    ],
    disadvantages: [
      'Smaller warhead limits damage per unit',
      'Reduced range limits to tactical/operational targets',
      'Same GPS-only guidance vulnerability as Shahed-136',
      'Slow cruise speed',
      'No terminal seeker',
    ],
    combatRecord:
      'Deployed alongside the Shahed-136 in Russian attacks on Ukraine, designated Geran-1 by Russian forces. Used in mixed swarms to complicate air defense prioritization. Also used by Houthi forces in attacks against targets in the Red Sea region and Saudi Arabia. The combination of Shahed-131 and Shahed-136 in the same attack complicates defender response by presenting targets of varying size and range profiles.',
    relatedSystems: ['Shahed-136', 'Shahed-238'],
    featured: false,
    content: `## Overview

The Shahed-131 is the smaller sibling of the Shahed-136, sharing the same delta-wing design philosophy but in a more compact form. Designated Geran-1 by Russian forces, it is deployed alongside the larger Shahed-136 in combined attacks to present defenders with mixed threat profiles. Its reduced size and cost make it an even more expendable asset in saturation operations.

## Technical Details

The Shahed-131 has a wingspan of approximately 2.0 meters and a length of about 2.9 meters, making it noticeably smaller than the Shahed-136. It weighs around 135 kg at launch and carries a warhead estimated at 15-30 kg of high explosive. Its range of approximately 900 km is roughly one-third that of the Shahed-136, making it more suited to operational and tactical-depth targets. Like its larger counterpart, it uses inertial navigation with GPS guidance and is powered by a small piston engine.

## Combat History

The Shahed-131 has been employed by Russia in Ukraine alongside the Shahed-136 beginning in late 2022. By mixing both variants in attack waves, Russian forces have sought to complicate air defense responses, as the two variants present slightly different radar and visual signatures. Houthi forces have also employed the Shahed-131 in attacks against targets in Saudi Arabia and the broader Red Sea theater. Exact production and launch numbers are harder to confirm than the Shahed-136, as wartime reporting often does not distinguish between the two variants.

## Proliferation

The Shahed-131 has proliferated along the same channels as the Shahed-136, reaching Russian forces and Iranian proxy groups including the Houthis. Its simpler construction and lower material requirements make it potentially even easier to produce in dispersed facilities, complicating efforts to constrain supply chains.`,
  },
  {
    name: 'Shahed-238',
    slug: 'shahed-238',
    description:
      'Jet-powered variant of the Shahed drone family, significantly faster than the propeller-driven Shahed-136, posing a greater challenge to air defense systems.',
    category: 'threat-drone',
    manufacturer: 'Iran Aircraft Manufacturing Industrial Company (HESA)',
    country: 'Iran',
    status: 'operational',
    primaryCapability:
      'High-speed one-way attack against defended targets, leveraging jet propulsion to reduce defender reaction time and complicate interception.',
    specifications: [
      'Wingspan: ~2.5 m (estimated)',
      'Length: ~3.5 m (estimated)',
      'Engine: Small turbojet (possibly Toloue-10 micro-turbojet)',
      'Cruise speed: ~500-600 km/h (estimated)',
      'Guidance: Inertial + GPS; possibly infrared seeker variant',
      'Launch method: Rail-launched',
      'Range: Unknown, likely reduced vs Shahed-136 due to jet fuel consumption',
    ],
    platforms: ['Ground-launched rail systems'],
    deployedBy: ['Iran (IRGC)'],
    inServiceDate: '2023',
    effectiveRange: 'Unknown, estimated shorter than Shahed-136 due to turbojet fuel consumption',
    whatItIs:
      'The Shahed-238 is a jet-powered evolution of the Shahed-136 one-way attack drone. First displayed by Iran in late 2023, it replaces the slow piston engine with a turbojet, dramatically increasing speed to an estimated 500-600 km/h. It may exist in multiple guidance variants including GPS-guided, infrared-homing, and possibly anti-radiation seeker configurations.',
    howItWorks:
      'The Shahed-238 uses a turbojet engine (possibly a derivative of Iranian micro-turbojet designs) in place of the piston engine on the Shahed-136. This approximately triples the cruise speed, drastically reducing the time available for defenders to detect, track, and engage the incoming threat. Reports suggest it may have multiple seeker options, including an infrared variant for terminal guidance against heat-emitting targets.',
    keyFeatures: [
      'Turbojet propulsion for ~3x speed increase over Shahed-136',
      'Possibly multiple seeker variants (GPS, IR, anti-radiation)',
      'Similar airframe to Shahed-136 family',
      'Designed to overcome defenses that have adapted to slow Shahed-136',
      'Much shorter flight time to target',
    ],
    advantages: [
      'Significantly faster than propeller-driven variants',
      'Reduced defender reaction and engagement time',
      'IR seeker variant could engage targets without GPS',
      'Harder to intercept with gun-based and short-range systems',
      'Potential anti-radiation variant could target radar emitters',
    ],
    disadvantages: [
      'Turbojet significantly increases unit cost',
      'Higher fuel consumption likely reduces range',
      'Turbojet engines more complex to manufacture at scale',
      'Higher thermal signature from jet exhaust',
      'Not yet proven in widespread combat use',
    ],
    combatRecord:
      'First publicly revealed by Iran in late 2023. As of early 2025, the Shahed-238 has not been confirmed in large-scale combat use comparable to the Shahed-136. Intelligence assessments suggest Iran is developing multiple seeker configurations. There are unconfirmed reports of limited testing or use, but the system represents a near-term rather than current mass-deployment threat. Its development is widely viewed as a direct response to Ukraine demonstrating high intercept rates against the slower Shahed-136.',
    relatedSystems: ['Shahed-136', 'Shahed-131'],
    featured: false,
    content: `## Overview

The Shahed-238 represents the next evolutionary step in Iran's one-way attack drone program. Revealed in late 2023, this jet-powered variant of the Shahed airframe addresses the primary vulnerability of the Shahed-136: its slow speed. By replacing the piston engine with a turbojet, Iran has created a weapon that is approximately three times faster, drastically compressing the detection-to-engagement timeline for defenders and rendering many of the counter-tactics developed against the Shahed-136 less effective.

## Technical Details

The Shahed-238 retains a similar delta-wing planform to the Shahed-136 family but is powered by a small turbojet engine, possibly a derivative of the Iranian Toloue-10 micro-turbojet. This gives it an estimated cruise speed of 500-600 km/h compared to the 185 km/h of the Shahed-136. The trade-off is likely reduced range due to significantly higher fuel consumption. Iran has reportedly developed multiple guidance variants, including a standard GPS/INS version, an infrared-seeker version for terminal homing on heat sources, and possibly an anti-radiation seeker variant designed to home in on radar emissions.

## Combat Implications

The Shahed-238 poses a qualitatively different challenge from the Shahed-136. Mobile fire groups using machine guns, which proved highly effective against slow Shaheds, would have far less time to visually acquire, track, and engage a jet-speed target. Electronic warfare systems would need to jam GPS for a much shorter window. The potential IR-seeker variant could negate GPS jamming entirely, homing on the thermal signature of power plants, industrial facilities, or military equipment. An anti-radiation variant would specifically threaten the radar systems used to detect and track the slower Shahed-136.

## Proliferation Concerns

If Iran transfers Shahed-238 technology to Russia as it did with the Shahed-136, it would significantly complicate Ukrainian air defense operations. The speed increase alone would require a fundamental shift in defensive tactics. Western intelligence agencies have flagged the Shahed-238 as a priority concern, and it has driven renewed urgency in developing cost-effective counter-UAS systems capable of engaging faster targets.`,
  },
  // ─── RUSSIAN SYSTEMS ───────────────────────────────────────────────
  {
    name: 'Lancet-3',
    slug: 'lancet-3',
    description:
      'Russian precision loitering munition developed by ZALA Aero (Kalashnikov Group), extensively used in Ukraine for precision strikes against artillery, armored vehicles, and air defense systems.',
    category: 'threat-loitering',
    manufacturer: 'ZALA Aero Group (Kalashnikov Concern)',
    country: 'Russia',
    status: 'combat-proven',
    primaryCapability:
      'Precision strike against high-value tactical targets including artillery systems, armored vehicles, radar installations, and air defense launchers using TV/IR terminal guidance.',
    specifications: [
      'Wingspan: ~2.4 m (X-wing configuration)',
      'Length: ~1.7 m',
      'Launch weight: ~12 kg',
      'Warhead: ~3-5 kg shaped charge/HE-FRAG',
      'Range: ~40 km (Lancet-3); extended range variants reported',
      'Loiter time: ~40 minutes',
      'Speed: ~80-110 km/h cruise; ~300 km/h terminal dive',
      'Guidance: Electro-optical (TV/IR) with AI-assisted target recognition',
      'Launch: Catapult from portable rail',
      'Typically paired with ZALA 421-16E for reconnaissance',
    ],
    platforms: ['Ground-launched catapult', 'Vehicle-mounted launcher'],
    deployedBy: ['Russian Armed Forces'],
    inServiceDate: '2019',
    effectiveRange: '~40 km (extended range variants reported up to 70 km)',
    whatItIs:
      'The Lancet-3 is a precision loitering munition developed by ZALA Aero, a subsidiary of the Kalashnikov Group. It features an unusual X-wing configuration and uses electro-optical guidance with reported AI-assisted target recognition for precision terminal strikes. It has become one of the most effective weapons in Russia\'s arsenal during the war in Ukraine.',
    howItWorks:
      'The Lancet-3 is catapult-launched and flies to a designated area where it loiters while an operator searches for targets using its onboard TV or infrared camera. Once a target is identified, the operator locks on and the drone performs a terminal dive, accelerating to approximately 300 km/h. Later software versions reportedly incorporate AI-assisted target recognition that can identify and track specific vehicle types. It is typically used in conjunction with a ZALA 421-16E reconnaissance drone that locates targets and provides battle damage assessment.',
    keyFeatures: [
      'X-wing aerodynamic configuration',
      'TV and IR dual-mode seeker',
      'AI-assisted automatic target recognition (later variants)',
      'Operator-in-the-loop guidance',
      'Used in hunter-killer teams with ZALA 421-16E ISR drone',
      'Compact and man-portable launch system',
    ],
    advantages: [
      'Very high precision (sub-meter accuracy)',
      'Effective against high-value point targets',
      'Operator can select and verify target before strike',
      'Small size makes detection difficult',
      'AI target recognition reduces operator workload',
      'Low cost relative to guided missiles',
    ],
    disadvantages: [
      'Small warhead limits effectiveness against hardened targets',
      'Limited range compared to cruise missiles or large loitering munitions',
      'Requires datalink for operator control (jammable)',
      'Relatively slow cruise speed',
      'Vulnerable to short-range air defense and EW',
      'Requires paired ISR drone for optimal effectiveness',
    ],
    combatRecord:
      'The Lancet-3 has been one of the most extensively documented weapons of the Ukraine war. Open-source analysis has confirmed hundreds of successful strikes against a wide range of targets including: M777 howitzers, D-30 howitzers, self-propelled guns (2S1, 2S3, PzH 2000), tanks (T-64, Leopard 2), infantry fighting vehicles, trucks, radar systems (including S-300 launchers and radars), boats, and electronic warfare equipment. Lancet strikes are frequently filmed and posted online, providing extensive visual evidence. The system has proven particularly devastating against artillery positions, with some estimates suggesting it has destroyed more Ukrainian artillery pieces than any other single Russian weapon system. Ukraine has responded with improvised cope cages and electronic warfare, but the Lancet remains highly effective.',
    relatedSystems: ['KUB-BLA', 'ZALA 421-16E'],
    featured: false,
    content: `## Overview

The Lancet-3, produced by ZALA Aero (part of the Kalashnikov Group), has emerged as arguably the most effective precision loitering munition in the Ukraine conflict. Its combination of electro-optical terminal guidance, man-in-the-loop control, and increasingly sophisticated AI-assisted target recognition has made it a devastating weapon against high-value tactical targets including artillery systems, armored vehicles, and air defense installations.

## Technical Details

The Lancet-3 features a distinctive X-wing aerodynamic configuration with a wingspan of approximately 2.4 meters and weighs about 12 kg at launch. It carries a shaped-charge or high-explosive fragmentation warhead weighing 3-5 kg. The system is catapult-launched from a portable rail and can loiter for approximately 40 minutes while searching for targets at ranges up to 40 km (with extended-range variants reportedly reaching 70 km). Its seeker offers both television (daylight) and infrared (night/thermal) modes. Later software versions incorporate AI-based automatic target recognition capable of identifying specific vehicle classes.

## Combat History

The Lancet-3 has accumulated an extensive and well-documented combat record in Ukraine. Open-source intelligence analysis has confirmed hundreds of successful precision strikes across a broad spectrum of targets. Notable confirmed kills include Western-supplied equipment such as M777 howitzers and PzH 2000 self-propelled guns, as well as T-64 tanks, S-300 air defense launchers, and various radar systems. The Lancet is typically employed in "hunter-killer" teams with ZALA 421-16E reconnaissance drones providing target acquisition and post-strike battle damage assessment. Its effectiveness has prompted Ukrainian forces to develop countermeasures including improvised overhead protection ("cope cages"), camouflage netting, and electronic warfare jamming of its control datalink.

## Tactical Significance

The Lancet-3 represents a new category of precision weapons that fills the gap between expensive guided missiles and crude unguided munitions. At an estimated cost of $35,000-50,000 per unit, it can destroy targets worth millions of dollars. Its success has driven other nations to accelerate development of similar systems and has reinforced the lesson that even relatively small, inexpensive precision munitions can have outsized tactical impact when employed in sufficient numbers with good intelligence.`,
  },
  {
    name: 'Orlan-10',
    slug: 'orlan-10',
    description:
      'Russia\'s most widely deployed tactical reconnaissance UAV, used extensively for artillery spotting, surveillance, electronic warfare, and communications relay across the Ukrainian front.',
    category: 'threat-drone',
    manufacturer: 'Special Technology Center (STC)',
    country: 'Russia',
    status: 'combat-proven',
    primaryCapability:
      'Tactical reconnaissance, surveillance, artillery fire correction, electronic warfare, and communications relay.',
    specifications: [
      'Wingspan: 3.1 m',
      'Length: 1.8 m',
      'Maximum takeoff weight: 18 kg',
      'Payload: ~5 kg',
      'Endurance: 10-16 hours',
      'Range: 120 km (datalink)',
      'Ceiling: 5,000 m',
      'Speed: 90-150 km/h',
      'Engine: Gasoline piston (various, including converted commercial engines)',
      'Launch: Catapult',
      'Recovery: Parachute',
      'Sensors: Daylight camera, IR camera, optional EW payload',
    ],
    platforms: ['Ground-launched catapult', 'Vehicle-mounted system'],
    deployedBy: ['Russian Armed Forces', 'Russian National Guard (Rosgvardia)'],
    inServiceDate: '2010',
    detectionRange: '25-30 km (optical sensors)',
    effectiveRange: '120 km datalink range',
    whatItIs:
      'The Orlan-10 is Russia\'s workhorse tactical unmanned aerial system, produced by the Special Technology Center in St. Petersburg. It is by far the most numerous UAV in Russian military service, with thousands produced and deployed. It serves primarily as a reconnaissance and artillery fire-correction platform but can also carry electronic warfare payloads.',
    howItWorks:
      'The Orlan-10 is catapult-launched and recovered by parachute. It carries interchangeable payload modules including daylight and infrared cameras for reconnaissance and a suite of electronic warfare payloads for jamming cellular communications and GPS signals. In its primary role, it orbits over the battlefield transmitting real-time video to ground stations, allowing artillery units to observe targets and correct fire. The system typically operates in groups with a ground control station managing up to four aircraft simultaneously.',
    keyFeatures: [
      'Modular payload bay for different mission configurations',
      'Long endurance (10-16 hours)',
      'Electronic warfare capability',
      'Real-time video downlink for artillery correction',
      'One ground station controls up to 4 aircraft',
      'Simple catapult launch / parachute recovery',
    ],
    advantages: [
      'Produced in very large numbers (thousands in service)',
      'Relatively inexpensive',
      'Long endurance for persistent surveillance',
      'Versatile mission profiles (ISR, EW, arty correction)',
      'Simple logistics and operation',
      'Battle-tested extensively',
    ],
    disadvantages: [
      'Uses some Western commercial components (subject to sanctions)',
      'Vulnerable to modern air defense and EW',
      'Limited altitude and speed',
      'Catapult launch limits operational flexibility',
      'Parachute recovery can damage the aircraft',
      'Camera quality inferior to Western equivalents',
    ],
    combatRecord:
      'The Orlan-10 has been Russia\'s primary ISR UAV throughout the war in Ukraine, with thousands of sorties flown. It has been instrumental in directing Russian artillery fire, which has been a primary casualty-producing weapon system. Ukraine has shot down hundreds of Orlan-10s, and captured examples have revealed extensive use of Western commercial components including Canon cameras and various GPS/IMU modules, despite international sanctions. The Orlan-10 was previously used in Syria, supporting Russian operations from 2015 onward. It has also been deployed in EW roles, jamming Ukrainian cellular and GPS communications.',
    relatedSystems: ['Orlan-30', 'ZALA 421-16E', 'Eleron-3'],
    featured: false,
    content: `## Overview

The Orlan-10 is the backbone of Russian tactical unmanned aviation. Produced by the Special Technology Center in St. Petersburg, it is the most widely used UAV in the Russian military, with an estimated 1,000+ units in service at any given time. Its primary mission is reconnaissance and artillery fire correction, making it a critical enabler of Russia's artillery-centric warfighting doctrine.

## Technical Details

The Orlan-10 has a wingspan of 3.1 meters and a maximum takeoff weight of 18 kg. It is powered by a small gasoline piston engine giving it an endurance of 10-16 hours and a maximum speed of about 150 km/h. It operates via a datalink with a range of up to 120 km and can carry approximately 5 kg of interchangeable payloads. Standard payloads include daylight and infrared cameras for surveillance, as well as electronic warfare modules capable of jamming cellular communications and GPS signals. The system is catapult-launched and recovered by parachute. A single ground control station can manage up to four Orlan-10s simultaneously.

## Combat History

The Orlan-10 has been used extensively in both Syria (from 2015) and Ukraine (from 2022). In Ukraine, it has been the primary means by which Russian forces direct artillery fire, serving as airborne eyes for howitzer and multiple-launch rocket system batteries. Ukrainian forces have shot down hundreds, and analysis of captured units has revealed extensive reliance on Western commercial components including Canon EOS cameras, Garmin GPS modules, and various European-manufactured inertial measurement units. This dependency on imported components has been a vulnerability exploited by international sanctions, though Russia has found alternative supply channels.

## Electronic Warfare Role

Beyond reconnaissance, the Orlan-10 carries electronic warfare payloads in some configurations. These can jam cellular communications over a localized area, disrupt GPS signals to interfere with precision-guided weapons, and perform signals intelligence collection. This multi-role capability makes the Orlan-10 a flexible tactical asset that extends well beyond simple surveillance.`,
  },
  {
    name: 'ZALA 421-16E',
    slug: 'zala-421-16e',
    description:
      'Russian tactical reconnaissance UAV produced by ZALA Aero (Kalashnikov Group), frequently used as the ISR component of Lancet loitering munition hunter-killer teams.',
    category: 'threat-drone',
    manufacturer: 'ZALA Aero Group (Kalashnikov Concern)',
    country: 'Russia',
    status: 'combat-proven',
    primaryCapability:
      'Tactical reconnaissance and surveillance, target acquisition for Lancet loitering munitions, battle damage assessment.',
    specifications: [
      'Wingspan: 2.2 m',
      'Length: 1.3 m',
      'Maximum takeoff weight: 8.5 kg',
      'Payload: ~2 kg',
      'Endurance: 4-6 hours',
      'Range: 50 km (datalink)',
      'Ceiling: 3,600 m',
      'Speed: 65-130 km/h',
      'Engine: Electric motor',
      'Launch: Catapult / hand-launched',
      'Recovery: Parachute / belly landing',
      'Sensors: EO/IR camera gimbal',
    ],
    platforms: ['Hand-launched', 'Catapult'],
    deployedBy: ['Russian Armed Forces'],
    inServiceDate: '2012',
    detectionRange: '~15 km (optical sensors)',
    effectiveRange: '50 km datalink range',
    whatItIs:
      'The ZALA 421-16E is a small tactical reconnaissance UAV developed by ZALA Aero, a subsidiary of the Kalashnikov Concern. It is designed for front-line tactical ISR and has become well known for its role as the "eyes" of the Lancet loitering munition system, forming the reconnaissance half of hunter-killer teams.',
    howItWorks:
      'The ZALA 421-16E is launched by catapult or by hand and uses an electric motor for quiet operation. It carries an electro-optical/infrared stabilized camera gimbal that transmits real-time video back to a ground control station. When paired with Lancet loitering munitions, it scouts ahead to locate high-value targets, relays their positions, and then provides post-strike battle damage assessment to confirm target destruction.',
    keyFeatures: [
      'Electric propulsion for low acoustic signature',
      'Stabilized EO/IR camera gimbal',
      'Designed to work as target-finder for Lancet munitions',
      'Compact and portable',
      'Real-time video relay',
    ],
    advantages: [
      'Quiet electric motor complicates acoustic detection',
      'Effective synergy with Lancet hunter-killer concept',
      'Small size and low altitude make it hard to detect',
      'Simple to operate at battalion level',
    ],
    disadvantages: [
      'Limited endurance compared to fuel-powered UAVs',
      'Relatively short range',
      'Vulnerable to electronic warfare jamming',
      'Small payload limits sensor capability',
    ],
    combatRecord:
      'The ZALA 421-16E has been widely used in Ukraine as the reconnaissance element of Lancet hunter-killer teams. It typically flies ahead to locate targets such as artillery pieces, armored vehicles, or air defense systems, then relays coordinates and video to Lancet operators. After a Lancet strike, the ZALA 421-16E orbits to confirm the result. Many of the viral Lancet strike videos that circulate online were filmed from ZALA 421-16E drones observing the attack. Ukraine has downed numbers of these systems, but their small size and low altitude make them difficult targets.',
    relatedSystems: ['Lancet-3', 'KUB-BLA', 'Orlan-10'],
    featured: false,
    content: `## Overview

The ZALA 421-16E is a lightweight tactical reconnaissance UAV that has gained prominence for its role as the scouting element in Russia's Lancet loitering munition system. Produced by ZALA Aero, a subsidiary of the Kalashnikov Group, it forms the "eyes" of a hunter-killer concept that pairs ISR drones with precision strike munitions for rapid detection-to-destruction cycles.

## Technical Details

The ZALA 421-16E features a conventional fixed-wing design with a wingspan of 2.2 meters and a maximum takeoff weight of 8.5 kg. It is powered by an electric motor, giving it quiet operation and an endurance of 4-6 hours. The aircraft carries a stabilized electro-optical/infrared camera gimbal weighing approximately 2 kg that provides real-time video to a ground control station at ranges up to 50 km. It can be hand-launched or catapult-launched and recovers by parachute or belly landing.

## Combat History

In Ukraine, the ZALA 421-16E has become the standard reconnaissance companion to the Lancet-3 loitering munition. Operating at the brigade and battalion level, these drones fly over the forward edge of the battle area searching for high-value targets. When a target is identified, coordinates are passed to Lancet operators who launch and guide the munition to the target. The ZALA 421-16E then orbits to confirm destruction. This combination has proven devastatingly effective against Ukrainian artillery, armor, and air defense systems.

## Tactical Integration

The hunter-killer pairing of the ZALA 421-16E with the Lancet represents an important evolution in small-unit precision strike capability. By giving frontline units organic ISR linked directly to precision munitions, Russia has created a system that can compress the sensor-to-shooter cycle to minutes rather than the hours typical of traditional fire-support coordination.`,
  },
  {
    name: 'Eleron-3',
    slug: 'eleron-3',
    description:
      'Small hand-launched Russian tactical reconnaissance UAV used for front-line surveillance and artillery fire correction.',
    category: 'threat-drone',
    manufacturer: 'Enics JSC',
    country: 'Russia',
    status: 'combat-proven',
    primaryCapability:
      'Short-range tactical reconnaissance, surveillance, and artillery fire correction at the company and battalion level.',
    specifications: [
      'Wingspan: 1.47 m',
      'Length: 0.63 m',
      'Maximum takeoff weight: 4.3 kg',
      'Payload: ~0.8 kg',
      'Endurance: ~2 hours',
      'Range: 25 km',
      'Ceiling: 5,000 m',
      'Speed: 70-130 km/h',
      'Engine: Electric motor',
      'Launch: Hand-launched',
      'Recovery: Parachute',
      'Sensors: EO camera, optional IR',
    ],
    platforms: ['Hand-launched'],
    deployedBy: ['Russian Armed Forces'],
    inServiceDate: '2009',
    detectionRange: '~10 km (optical)',
    effectiveRange: '25 km',
    whatItIs:
      'The Eleron-3 is a small, hand-launched tactical UAV developed by Enics for the Russian military. It is designed for company and battalion-level reconnaissance and has been in service since approximately 2009. It is one of the smallest and simplest UAVs in the Russian military inventory.',
    howItWorks:
      'The Eleron-3 is hand-launched by a single operator and flies pre-programmed routes or under manual control via datalink. Its electric motor provides quiet flight, and it carries a small electro-optical camera that transmits real-time video to a ground station. It is recovered by parachute and breaks down into a man-portable carrying case. The system is designed for simplicity, with minimal training required for operators.',
    keyFeatures: [
      'Hand-launched by single operator',
      'Man-portable in backpack carrying case',
      'Electric propulsion for quiet operation',
      'Simple operation with minimal training',
      'Rugged construction for field conditions',
    ],
    advantages: [
      'Very small and man-portable',
      'Quick to deploy from any location',
      'Quiet electric motor',
      'Minimal operator training required',
      'Low cost',
    ],
    disadvantages: [
      'Very short endurance (~2 hours)',
      'Limited range (25 km)',
      'Small payload limits sensor quality',
      'No IR capability in base configuration',
      'Vulnerable to small arms fire at low altitude',
    ],
    combatRecord:
      'The Eleron-3 has been in Russian service since 2009 and has seen use in Syria and Ukraine. In Ukraine, it supplements larger systems like the Orlan-10 at the tactical level, providing battalion and company commanders with organic ISR capability. Its small size and hand-launch capability make it useful for immediate-area surveillance, but it has been overshadowed by larger, more capable systems and the explosion of commercial FPV drones. Multiple examples have been shot down or captured by Ukrainian forces.',
    relatedSystems: ['Orlan-10', 'ZALA 421-16E'],
    featured: false,
    content: `## Overview

The Eleron-3 is a small hand-launched tactical UAV that provides Russian ground forces with an organic, man-portable reconnaissance capability at the company and battalion level. Developed by Enics JSC, it has been in service since approximately 2009 and represents the lower end of Russia's military drone inventory in terms of size and sophistication.

## Technical Details

The Eleron-3 has a wingspan of just 1.47 meters and weighs 4.3 kg at launch. It is powered by an electric motor and carries approximately 0.8 kg of sensor payload, typically an electro-optical camera. Its endurance is about 2 hours with a datalink range of 25 km. The system is hand-launched by a single operator and recovered by parachute. It packs into a portable carrying case weighing around 15 kg including the ground control station, making it truly man-portable for dismounted infantry.

## Combat History

The Eleron-3 has seen service in both Syria and Ukraine. In the Ukraine conflict, it provides tactical-level surveillance and artillery spotting, complementing the more capable but larger Orlan-10 at the battalion level. Its small size makes it difficult to detect, but its limited endurance and sensor quality mean it is typically used for short-duration reconnaissance tasks in the immediate area of operations. Ukrainian forces have shot down and captured several Eleron-3 units.

## Role in Modern Warfare

The Eleron-3 illustrates the proliferation of small tactical drones down to the lowest echelons of military units. While outperformed by more modern systems, its simplicity and portability ensure it remains a useful tool for commanders needing quick overhead surveillance without waiting for higher-echelon ISR assets. Its niche has been increasingly filled by commercial quadcopters and FPV drones, which often offer superior capability.`,
  },
  {
    name: 'KUB-BLA',
    slug: 'kub-bla',
    description:
      'Russian delta-wing loitering munition developed by ZALA Aero (Kalashnikov Group), designed for strikes against personnel and light vehicles with a significant warhead.',
    category: 'threat-loitering',
    manufacturer: 'ZALA Aero Group (Kalashnikov Concern)',
    country: 'Russia',
    status: 'combat-proven',
    primaryCapability:
      'One-way attack against area targets, personnel concentrations, and light vehicles using a larger warhead than the Lancet.',
    specifications: [
      'Wingspan: ~1.2 m (delta wing)',
      'Length: ~0.95 m',
      'Maximum takeoff weight: ~7 kg',
      'Warhead: ~3 kg high-explosive fragmentation',
      'Endurance: ~30 minutes',
      'Range: ~40 km',
      'Speed: ~80-130 km/h',
      'Engine: Electric motor',
      'Guidance: Electro-optical terminal',
      'Launch: Rail-launched',
    ],
    platforms: ['Ground-launched rail system'],
    deployedBy: ['Russian Armed Forces'],
    inServiceDate: '2019',
    effectiveRange: '~40 km',
    whatItIs:
      'The KUB-BLA (also known as KYB-UAV or ZALA KUB) is a delta-wing loitering munition developed by ZALA Aero as a complement to the Lancet system. While the Lancet is optimized for precision strikes against point targets, the KUB-BLA is designed for strikes against softer area targets with its high-explosive fragmentation warhead.',
    howItWorks:
      'The KUB-BLA is launched from a ground-based rail and uses an electric motor for quiet approach. It carries an electro-optical camera that transmits video to an operator, who can identify targets and direct the drone into a terminal dive. The delta-wing design provides good loitering characteristics. The HE-FRAG warhead is optimized for anti-personnel and anti-material effect against unarmored or lightly armored targets.',
    keyFeatures: [
      'Delta-wing configuration for efficient loitering',
      'Electric propulsion for quiet approach',
      'HE-FRAG warhead for area effect',
      'Operator-guided via video link',
      'Complements Lancet precision strike system',
    ],
    advantages: [
      'Quiet electric motor complicates detection',
      'Effective against personnel and soft targets',
      'Compact and portable',
      'Relatively low cost',
    ],
    disadvantages: [
      'Short endurance (~30 minutes)',
      'Small warhead limits effectiveness against armored targets',
      'Requires datalink for guidance (jammable)',
      'Overshadowed by more successful Lancet system',
    ],
    combatRecord:
      'The KUB-BLA was first confirmed in combat use in early 2022 during the initial phase of Russia\'s invasion of Ukraine. One of the earliest confirmed uses was a KUB-BLA found crashed but unexploded in Kyiv in March 2022, providing Western analysts their first close look at the system. It has seen limited use compared to the Lancet-3, which has proven more versatile and effective. The KUB-BLA appears to be used primarily against softer targets where its fragmentation warhead provides better area effect than the Lancet\'s shaped charge.',
    relatedSystems: ['Lancet-3', 'ZALA 421-16E'],
    featured: false,
    content: `## Overview

The KUB-BLA is a delta-wing loitering munition developed by ZALA Aero as part of the Kalashnikov Group's family of unmanned combat systems. Designed as a companion to the more precise Lancet-3, the KUB-BLA carries a high-explosive fragmentation warhead optimized for area effect against personnel concentrations and light vehicles rather than precision point strikes.

## Technical Details

The KUB-BLA features a delta-wing planform with a wingspan of approximately 1.2 meters and weighs about 7 kg. It is powered by an electric motor, providing approximately 30 minutes of flight time and a range of about 40 km. The system carries a 3 kg HE-FRAG warhead and uses an electro-optical camera for operator-guided terminal attack. It is launched from a ground-based rail system and flies quietly to the target area before the operator selects a target from the video feed and initiates the terminal dive.

## Combat History

The KUB-BLA first appeared in combat in the early days of Russia's full-scale invasion of Ukraine in 2022. An unexploded example found in Kyiv in March 2022 gave Western intelligence agencies their first opportunity to examine the system in detail. However, the KUB-BLA has seen relatively limited deployment compared to the Lancet-3, which has proven more versatile and effective in the Ukrainian theater. The KUB-BLA appears to have a niche role against soft targets where its fragmentation warhead provides superior effect.

## Comparison with Lancet

While both systems are produced by ZALA Aero and share similar operational concepts, the Lancet-3 has clearly emerged as the preferred system. The Lancet offers better precision through its more advanced seeker, longer loiter time, and a shaped-charge warhead effective against armored targets. The KUB-BLA's fragmentation warhead is more suited to anti-personnel use, but the greater versatility of the Lancet has made it the dominant loitering munition in Russian service.`,
  },
  // ─── FPV / COMMERCIAL DRONES ───────────────────────────────────────
  {
    name: 'Weaponized Commercial FPV Drones',
    slug: 'weaponized-fpv-drones',
    description:
      'Modified first-person-view racing drones and commercial quadcopters weaponized with improvised munitions, representing the single largest category of drone threat by volume in the Ukraine conflict.',
    category: 'threat-swarm',
    manufacturer: 'Various (DJI, custom-built, open-source designs)',
    country: 'Various',
    status: 'combat-proven',
    primaryCapability:
      'Low-cost precision strike against vehicles, personnel, and positions using operator-guided first-person-view flight with attached explosive munitions.',
    specifications: [
      'Size: Varies (typically 5-10 inch prop class)',
      'Weight: 0.5-3 kg (varies with payload)',
      'Payload: Typically RPG warhead, grenade, or shaped charge (0.5-2 kg)',
      'Range: 5-15 km (typical FPV radio link)',
      'Speed: 100-180 km/h',
      'Endurance: 10-30 minutes',
      'Cost: $500-$2,000 per unit',
      'Guidance: Operator-guided via FPV video goggles',
      'Power: LiPo battery, electric motors',
    ],
    platforms: ['Hand-launched'],
    deployedBy: [
      'Ukrainian Armed Forces',
      'Russian Armed Forces',
      'Various non-state actors',
    ],
    inServiceDate: '2022 (mass adoption)',
    effectiveRange: '5-15 km',
    whatItIs:
      'Weaponized FPV (First-Person-View) drones are modified commercial racing quadcopters or purpose-built small drones carrying improvised explosive payloads. They have become the single most numerous drone type on the Ukraine battlefield, with both sides launching thousands per month. The concept uses cheap, commercially available drone components combined with improvised warheads to create precision-guided munitions costing $500-$2,000 each.',
    howItWorks:
      'An operator wearing FPV video goggles controls the drone in real-time, seeing through its onboard camera. The pilot flies the drone toward the target at high speed (often 100+ km/h) and guides it directly into the target in a final terminal dive or direct impact. Common payloads include RPG-7 warheads, hand grenades, shaped charges, and various improvised explosive devices attached to the drone frame. Some variants use drop mechanisms to release munitions, while others are true one-way attack systems that crash into the target.',
    keyFeatures: [
      'Extremely low cost ($500-$2,000 per unit)',
      'Widely available commercial components',
      'Real-time operator control via FPV video',
      'High maneuverability and speed',
      'Effective against vehicles, fortifications, and personnel',
      'Can be produced in massive quantities by volunteers and small workshops',
      'Evolving rapidly with new designs appearing weekly',
    ],
    advantages: [
      'Extremely cheap — favorable exchange ratio against any target',
      'Components widely available globally',
      'Rapid iteration of designs and tactics',
      'High precision when guided by skilled operator',
      'Extremely difficult to defend against in volume',
      'Low training barrier (skilled civilian drone pilots adapt quickly)',
      'Agile enough to enter windows, hatches, and other small openings',
    ],
    disadvantages: [
      'Short range limited by radio link (5-15 km)',
      'Vulnerable to electronic warfare and jamming',
      'Requires skilled operator for precision strikes',
      'Small payload limits damage per unit',
      'Weather dependent (wind, rain degrade performance)',
      'Line-of-sight radio link can be blocked by terrain',
      'Battery life limits operational window',
    ],
    combatRecord:
      'FPV drones have become the defining weapon of the Ukraine war from 2023 onward. Both Ukrainian and Russian forces launch thousands per month, with estimates suggesting 50,000-100,000+ FPV drones deployed monthly by mid-2024 across both sides combined. They have destroyed or damaged thousands of armored vehicles, trucks, artillery pieces, and fortified positions. Ukrainian forces have used them to devastating effect against Russian tanks and APCs, often threading through reactive armor or hitting vulnerable points identified through prior reconnaissance. Russian forces have similarly employed them against Ukrainian positions. The phenomenon has spawned massive volunteer production networks, particularly in Ukraine, where civilian drone enthusiasts build and donate thousands of units. This has fundamentally changed the character of ground warfare, making it nearly impossible to operate vehicles or move in the open near the front lines without drone cover.',
    relatedSystems: ['Lancet-3', 'Shahed-136'],
    featured: false,
    content: `## Overview

Weaponized FPV drones represent perhaps the most significant tactical innovation of the Ukraine war and a paradigm shift in ground warfare. Modified from commercial racing drone components or purpose-built using open-source designs, these small quadcopters carrying improvised explosive payloads have become the single most numerous weapon system on the battlefield. Both sides launch thousands per month, creating a constant overhead threat that has fundamentally changed how ground forces operate.

## Technical Details

A typical weaponized FPV drone is built using commercially available components: a carbon fiber frame (5-10 inch propeller class), brushless electric motors, a LiPo battery, a flight controller, and an analog or digital FPV camera transmitting video to the operator's goggles. Total component cost ranges from $500 to $2,000 depending on quality. Warheads vary widely, from RPG-7 rockets and hand grenades to purpose-built shaped charges capable of penetrating armored vehicle roofs. Some designs incorporate 3D-printed tail assemblies to stabilize munitions in flight. The operator controls the drone in real-time via FPV goggles, guiding it at speeds of 100-180 km/h into the target.

## Combat History

FPV drones began appearing in significant numbers in Ukraine in early 2023 and by mid-2023 had become ubiquitous. Both Ukraine and Russia have established massive production networks — Ukraine in particular has leveraged its civilian drone racing community and volunteer networks to produce tens of thousands monthly. By mid-2024, combined monthly deployments across both sides were estimated at 50,000-100,000+ units. These drones have destroyed or damaged thousands of armored vehicles, trucks, howitzers, and defensive positions. Dramatic footage of FPV drones threading through vehicle hatches or striking moving targets has become a staple of the conflict.

## Strategic Implications

The FPV drone revolution has several profound implications for modern warfare. First, it has democratized precision strike, putting guided-munition capability into the hands of individual soldiers at negligible cost. Second, it has made the forward battlefield zone extraordinarily lethal for any exposed personnel or vehicles. Third, it has created an insatiable demand for electronic warfare countermeasures, as jamming the FPV control link is the most effective defense. Fourth, it has raised fundamental questions about the future of armored warfare, as even main battle tanks are vulnerable to $500 drones striking from above. The arms race between FPV drones and electronic countermeasures is driving rapid innovation on both sides.`,
  },
  {
    name: 'Mugin-5 Pro',
    slug: 'mugin-5-pro',
    description:
      'Chinese-manufactured commercial fixed-wing UAV widely available for export, converted for military use by various non-state actors including Houthi forces for long-range attack missions.',
    category: 'threat-drone',
    manufacturer: 'Mugin UAV (China)',
    country: 'China',
    status: 'combat-proven',
    primaryCapability:
      'Long-endurance surveillance or one-way attack platform when modified by non-state actors, leveraging commercial availability and long range.',
    specifications: [
      'Wingspan: 5.0 m',
      'Length: ~3.0 m',
      'Maximum takeoff weight: ~70 kg',
      'Payload capacity: ~15-20 kg',
      'Endurance: ~7-10 hours',
      'Range: ~300+ km',
      'Cruise speed: ~90-120 km/h',
      'Engine: Gasoline piston',
      'Construction: Carbon fiber composite',
      'Launch: Runway or catapult',
      'Commercially available for ~$10,000-$15,000',
    ],
    platforms: ['Ground-launched (runway or catapult)'],
    deployedBy: [
      'Houthi forces (Ansar Allah)',
      'Various non-state armed groups',
    ],
    inServiceDate: 'N/A (commercial product converted for military use)',
    effectiveRange: '300+ km',
    whatItIs:
      'The Mugin-5 Pro is a large commercial fixed-wing UAV manufactured in China and sold openly online for agricultural, survey, and hobby purposes. Its combination of long endurance, large payload capacity, and low cost has made it attractive to non-state actors who modify it to carry explosives for one-way attack missions. It represents the broader threat of commercial drone technology being repurposed for military applications.',
    howItWorks:
      'In its commercial configuration, the Mugin-5 Pro is a conventional fixed-wing UAV with autonomous GPS waypoint navigation. When modified for attack use, the internal payload bay is loaded with explosives and the drone is programmed to fly to target coordinates. Some modifications include upgraded autopilot systems and communications links. The large fuel tank provides endurance of 7-10 hours, enabling strikes at considerable distances from the launch point.',
    keyFeatures: [
      'Commercially available globally via internet purchase',
      'Large payload capacity for its size class',
      'Long endurance with gasoline engine',
      'Carbon fiber construction',
      'Autonomous GPS waypoint navigation',
      'Difficult to regulate due to dual-use nature',
    ],
    advantages: [
      'Freely available on the commercial market',
      'Low cost (~$10,000-$15,000)',
      'Large payload relative to size',
      'Long range and endurance',
      'Carbon fiber construction reduces radar signature',
      'Easy to modify with improvised payloads',
    ],
    disadvantages: [
      'Commercial autopilot systems less reliable than military grade',
      'No hardened or encrypted communications',
      'Vulnerable to basic air defenses',
      'Relatively slow',
      'Requires some technical expertise to modify and operate',
    ],
    combatRecord:
      'Mugin-5 Pro airframes (or close variants) have been identified in Houthi attacks in Yemen and the Red Sea region. US and coalition forces have intercepted modified Mugin-type drones launched by Houthi forces targeting ships and Saudi infrastructure. The platform exemplifies the challenge of dual-use commercial drones: the same airframe sold for agricultural surveying has been recovered carrying explosive payloads in conflict zones across the Middle East. This has led to calls for stricter export controls on large commercial drone airframes.',
    relatedSystems: ['Ababil-3', 'Shahed-136'],
    featured: false,
    content: `## Overview

The Mugin-5 Pro exemplifies one of the most challenging aspects of the modern drone threat: the conversion of commercially available platforms into weapons of war. Manufactured in China and sold globally online for prices as low as $10,000, this large fixed-wing drone has been modified by non-state actors — most notably Houthi forces in Yemen — to carry explosive payloads for long-range one-way attacks. Its case highlights the difficulty of controlling dual-use drone technology proliferation.

## Technical Details

The Mugin-5 Pro is a conventional fixed-wing UAV with a 5-meter wingspan and a maximum takeoff weight of approximately 70 kg. It is powered by a gasoline piston engine that provides 7-10 hours of endurance and can carry 15-20 kg of payload. Construction is primarily carbon fiber composite, which provides structural strength while incidentally reducing radar cross-section. The standard version comes with a commercial autopilot system capable of autonomous GPS waypoint navigation. It can be launched from a short runway or catapult system.

## Weaponization and Combat Use

Houthi forces and other non-state armed groups have modified Mugin-5 Pro airframes (and similar Chinese commercial drones) to carry explosive payloads for one-way attack missions. The large payload bay, originally designed for survey cameras and agricultural equipment, can accommodate significant explosive charges. Modified drones are programmed with target coordinates and launched on one-way missions. Coalition forces operating in the Red Sea and Yemen theater have intercepted several such drones. Recovered airframes have been exhibited by US and Saudi forces as evidence of the dual-use drone threat.

## Regulatory Challenges

The Mugin-5 Pro case has spurred international debate about regulating large commercial drone exports. Unlike military drones, which are subject to export controls such as the Missile Technology Control Regime (MTCR), commercial platforms can be purchased freely online and shipped globally. Efforts to restrict their sale face challenges from the legitimate commercial drone industry, which uses identical platforms for agriculture, surveying, and infrastructure inspection. This regulatory gap continues to be exploited by non-state actors seeking low-cost long-range strike capability.`,
  },
  // ─── IRANIAN MALE/UCAV SYSTEMS ─────────────────────────────────────
  {
    name: 'Mohajer-6',
    slug: 'mohajer-6',
    description:
      'Iranian medium-altitude long-endurance (MALE) unmanned combat aerial vehicle capable of carrying precision-guided munitions, provided to Russia for use in Ukraine.',
    category: 'threat-drone',
    manufacturer: 'Qods Aviation Industry',
    country: 'Iran',
    status: 'combat-proven',
    primaryCapability:
      'Medium-altitude ISR and precision strike using guided bombs and missiles, providing persistent surveillance and armed reconnaissance capability.',
    specifications: [
      'Wingspan: 10 m',
      'Length: 5.67 m',
      'Maximum takeoff weight: ~670 kg',
      'Payload: ~100-150 kg',
      'Endurance: ~12 hours',
      'Ceiling: ~5,500 m (18,000 ft)',
      'Cruise speed: ~150-200 km/h',
      'Range: ~200 km (datalink)',
      'Engine: Rotax 912 piston engine (some variants)',
      'Armament: Qaem-series PGMs, Almas anti-tank missiles',
      'Sensors: EO/IR gimbal, possible SAR radar',
    ],
    platforms: ['Runway-launched'],
    deployedBy: [
      'Iran (IRGC, Artesh)',
      'Russia (transferred units)',
      'Houthi forces (Ansar Allah)',
    ],
    inServiceDate: '2017',
    detectionRange: '~30 km (EO/IR sensors)',
    effectiveRange: '200 km (datalink)',
    whatItIs:
      'The Mohajer-6 is Iran\'s primary medium-altitude long-endurance unmanned combat aerial vehicle (UCAV). Developed by Qods Aviation Industry, it represents a significant step up from earlier Mohajer variants, incorporating precision-guided munition capability and improved sensors. Iran has provided Mohajer-6 units to Russia for use in Ukraine, where they have been employed for reconnaissance and strike missions.',
    howItWorks:
      'The Mohajer-6 operates from conventional runways and is controlled via a ground control station connected by datalink. It carries an electro-optical/infrared sensor gimbal for surveillance and can be armed with Qaem-series precision-guided bombs (GPS/INS and TV-guided) and Almas anti-tank guided missiles. It flies at medium altitude to conduct persistent surveillance and can loiter over an area for extended periods before deploying weapons against identified targets.',
    keyFeatures: [
      'Precision strike capability with multiple munition types',
      'Long endurance for persistent surveillance',
      'Combined ISR and strike in single platform',
      'Qaem PGM family integration',
      'Relatively low cost compared to Western MALE UCAVs',
    ],
    advantages: [
      'Dual ISR/strike capability',
      'Longer endurance than tactical drones',
      'Precision-guided munitions for accurate strikes',
      'Lower cost than comparable Western or Turkish systems',
      'Battle-tested in multiple theaters',
    ],
    disadvantages: [
      'Relatively slow and vulnerable to modern air defenses',
      'Limited ceiling compared to Western MALE UCAVs',
      'Requires runway infrastructure',
      'Datalink range limits operational radius',
      'Limited payload compared to larger UCAV platforms',
      'Engine sourced from Western manufacturers (sanctions vulnerability)',
    ],
    combatRecord:
      'The Mohajer-6 has been used by Iran in surveillance and strike missions in Syria and Iraq. Iran transferred an undisclosed number to Russia in 2022-2023 for use in Ukraine, where they have been employed for reconnaissance and precision strikes against Ukrainian positions. The Ukrainian air force has shot down several Mohajer-6 units, providing Western intelligence with detailed analysis of the platform. The system has also been attributed to Houthi operations in the Red Sea region. Its combat performance has demonstrated a reasonable ISR/strike capability, though it is significantly less capable than Western or Turkish MALE UCAVs.',
    relatedSystems: ['Shahed-136', 'Ababil-3', 'Bayraktar TB2'],
    featured: false,
    content: `## Overview

The Mohajer-6 is Iran's most capable operational MALE (Medium-Altitude Long-Endurance) unmanned combat aerial vehicle. Developed by Qods Aviation Industry, it provides combined intelligence, surveillance, reconnaissance (ISR), and precision strike capabilities. Its provision to Russia for use in Ukraine marked one of the most significant instances of Iranian drone technology transfer and triggered intense international scrutiny.

## Technical Details

The Mohajer-6 has a wingspan of 10 meters and a maximum takeoff weight of approximately 670 kg, with a payload capacity of 100-150 kg. It is powered by a piston engine (some variants reportedly use the Austrian-made Rotax 912) giving it an endurance of approximately 12 hours at a service ceiling of around 5,500 meters. The aircraft carries an EO/IR sensor gimbal for day/night surveillance and can be armed with Qaem-series precision-guided bombs and Almas anti-tank guided missiles. The Qaem series includes GPS/INS-guided and TV-guided variants.

## Combat History

Iran has employed the Mohajer-6 in operations in Syria and Iraq, using it for both surveillance and limited strikes. The most significant combat deployment came when Iran transferred units to Russia in 2022-2023 for use in the Ukraine conflict. Russian forces have used the Mohajer-6 for reconnaissance of Ukrainian positions and precision strikes, though in smaller numbers than the Shahed-136 one-way attack drones. Ukraine's air force has shot down multiple Mohajer-6 units, and wreckage analysis has confirmed the platform's specifications and the use of some Western-sourced components.

## Proliferation and Export

The Mohajer-6's transfer to Russia was a watershed moment in Iranian drone proliferation, demonstrating Iran's willingness to provide advanced armed drone platforms to state actors, not just one-way attack munitions. The transfer triggered additional Western sanctions against Iranian drone programs. The system has also been linked to Houthi operations, though the Houthis may operate earlier Mohajer variants rather than the Mohajer-6 specifically.`,
  },
  {
    name: 'Ababil-3',
    slug: 'ababil-3',
    description:
      'Iranian multi-role UAV operated by Iran and provided to proxy forces including Hezbollah, Houthis, and other Iran-backed groups for reconnaissance and attack missions.',
    category: 'threat-drone',
    manufacturer: 'Iran Aircraft Manufacturing Industrial Company (HESA)',
    country: 'Iran',
    status: 'combat-proven',
    primaryCapability:
      'Tactical ISR and one-way attack capability, used by Iranian proxies for cross-border strikes and surveillance.',
    specifications: [
      'Wingspan: ~3.25 m',
      'Length: ~2.9 m',
      'Maximum takeoff weight: ~83 kg',
      'Payload: ~40 kg (reconnaissance) or warhead for attack variant',
      'Endurance: ~2-4 hours',
      'Range: ~150 km',
      'Ceiling: ~4,300 m (14,000 ft)',
      'Speed: ~200-370 km/h (variants differ)',
      'Engine: Small piston or turbine depending on variant',
      'Launch: Rail launcher or catapult',
      'Variants: Reconnaissance, one-way attack, electronic warfare',
    ],
    platforms: ['Rail launcher', 'Catapult launch'],
    deployedBy: [
      'Iran (IRGC, Artesh)',
      'Hezbollah',
      'Houthi forces (Ansar Allah)',
      'Hamas',
      'Iraqi Shia militias',
    ],
    inServiceDate: '2006 (Ababil-3 variant)',
    effectiveRange: '~150 km',
    whatItIs:
      'The Ababil-3 is an Iranian multi-role UAV that has been one of the most widely proliferated drone systems in the Middle East. The Ababil family has existed since the 1980s Iran-Iraq War, with the Ababil-3 being a modernized variant. It can be configured for reconnaissance or as a one-way attack drone, and has been supplied to virtually every Iranian proxy group in the region.',
    howItWorks:
      'The Ababil-3 is rail-launched or catapult-launched and can be configured for autonomous GPS-guided flight to a target area. In reconnaissance mode, it carries a camera payload and transmits video back to a ground station. In attack mode, it carries an explosive warhead and is programmed to dive into its target. Some variants are recovered by parachute after reconnaissance missions.',
    keyFeatures: [
      'Multi-role configuration (ISR, attack, EW)',
      'Extensively proliferated to non-state actors',
      'Multiple variants optimized for different missions',
      'Simple rail/catapult launch',
      'Autonomous GPS-guided flight',
    ],
    advantages: [
      'Widely available across Iranian proxy network',
      'Multiple mission configurations',
      'Rail launch requires minimal infrastructure',
      'Relatively inexpensive',
      'Proven in multiple theaters',
    ],
    disadvantages: [
      'Limited endurance and range',
      'Basic sensor and guidance technology',
      'Vulnerable to modern air defenses',
      'No precision terminal guidance in most variants',
      'Overshadowed by newer Shahed and Mohajer designs',
    ],
    combatRecord:
      'The Ababil family has one of the longest combat records of any drone system currently in use. Hezbollah operated Ababil variants against Israel as early as 2006 during the Lebanon War, successfully flying drones into Israeli airspace before being intercepted. Houthi forces have used Ababil-type drones (locally designated Qasef) in attacks against Saudi Arabia, UAE, and coalition forces in Yemen since 2015, targeting airports, military bases, and oil facilities. Hamas has also operated Ababil variants from Gaza. Iraqi Shia militias have launched Ababil-type drones at US and coalition bases in Iraq and Syria. The system\'s widespread proliferation to non-state actors has made it one of the most frequently encountered drone threats for Western and allied forces in the Middle East.',
    relatedSystems: ['Shahed-136', 'Mohajer-6', 'Qasef-1'],
    featured: false,
    content: `## Overview

The Ababil-3 is one of the most widely proliferated military drone systems in the world, supplied by Iran to proxy forces across the Middle East. Part of a drone family stretching back to the Iran-Iraq War era, the Ababil-3 represents a modernized version capable of reconnaissance and one-way attack missions. Its operational record spans from Lebanon to Yemen to Iraq, making it a persistent threat across multiple theaters.

## Technical Details

The Ababil-3 has a wingspan of approximately 3.25 meters and a maximum takeoff weight of about 83 kg. Depending on the variant, it can carry approximately 40 kg of payload — either a camera suite for reconnaissance or an explosive warhead for attack. Endurance is 2-4 hours with a range of about 150 km. It is launched from a rail or catapult system, eliminating the need for runways. Navigation is by autonomous GPS waypoint guidance. The design is simple and robust, prioritizing reliability and ease of operation by non-expert personnel.

## Combat History

The Ababil series has seen extensive combat across the Middle East. Hezbollah flew Ababil variants into Israeli airspace during the 2006 Lebanon War, marking one of the first instances of a non-state actor using drones against a modern military. Houthi forces in Yemen operate locally produced variants designated Qasef, which have been used in numerous attacks on Saudi and UAE targets, including Abha International Airport. Iraqi Shia militias have launched Ababil-type drones at US bases in Iraq and Syria. Hamas has operated Ababil variants from Gaza.

## Proliferation Network

The Ababil represents the cornerstone of Iran's drone proliferation strategy: provide simple, effective drone technology to proxy forces to extend Iranian power projection at low cost and with deniability. The technology transfer includes not just complete systems but also manufacturing knowledge, enabling local production of variants in Yemen (Qasef), Lebanon, and elsewhere. This dispersed production model makes the Ababil threat extremely difficult to eliminate through supply-chain interdiction alone.`,
  },
  // ─── TURKISH UCAV ──────────────────────────────────────────────────
  {
    name: 'Bayraktar TB2',
    slug: 'bayraktar-tb2',
    description:
      'Turkish-made medium-altitude long-endurance tactical UCAV that has become the world\'s most combat-proven and widely exported armed drone, used in multiple conflicts across three continents.',
    category: 'threat-drone',
    manufacturer: 'Baykar Defence',
    country: 'Turkey',
    status: 'combat-proven',
    primaryCapability:
      'Medium-altitude persistent ISR and precision strike using laser-guided munitions against ground targets, including armored vehicles, air defense systems, and personnel.',
    specifications: [
      'Wingspan: 12 m',
      'Length: 6.5 m',
      'Maximum takeoff weight: 700 kg',
      'Payload: 150 kg (4 hardpoints)',
      'Endurance: 27 hours (ISR), ~20 hours (armed)',
      'Ceiling: 7,600 m (25,000 ft)',
      'Speed: 130 km/h cruise; 220 km/h max',
      'Range: 150 km (operational radius)',
      'Engine: Rotax 912 (100 hp) — later models use Turkish TEI PD170',
      'Armament: MAM-L/MAM-C smart micro munitions, Roketsan UMTAS missile',
      'Sensors: WESCAM MX-15D EO/IR/laser designator turret',
      'Datalink: Encrypted C-band LOS',
    ],
    platforms: ['Runway-launched (600m minimum)'],
    deployedBy: [
      'Turkey',
      'Ukraine',
      'Azerbaijan',
      'Libya GNA',
      'Ethiopia',
      'Morocco',
      'Poland',
      'UAE',
      'Turkmenistan',
      'Qatar',
      'Niger',
      'Djibouti',
      'Togo',
      'Somalia',
      'Romania',
      'Albania',
      'Rwanda',
    ],
    inServiceDate: '2015',
    detectionRange: '~40 km (WESCAM EO/IR sensors)',
    effectiveRange: '~8 km (MAM-L range); 150 km operational radius',
    whatItIs:
      'The Bayraktar TB2 is a Turkish-designed and manufactured MALE-class tactical UCAV that has become the world\'s most widely exported combat drone. Produced by Baykar Defence, it carries laser-guided micro munitions and has been used in combat in at least six conflicts across three continents. It represents a game-changing proliferation of precision strike capability to countries and forces that previously lacked it. Note: The TB2 is used by both NATO-aligned and non-NATO forces, and in some contexts serves as a threat system.',
    howItWorks:
      'The Bayraktar TB2 operates from conventional runways with a minimum 600m strip. It is controlled via an encrypted C-band line-of-sight datalink from a ground control station. The aircraft carries a WESCAM MX-15D multi-sensor turret with daylight, infrared, and laser designator capabilities. It can carry up to four MAM-L (Smart Micro Munition) laser-guided bombs or MAM-C smaller munitions on under-wing hardpoints. The operator identifies targets through the sensor turret, designates them with the laser, and releases the munition for precision terminal guidance.',
    keyFeatures: [
      'Laser-guided precision munitions (MAM-L, MAM-C)',
      'WESCAM MX-15D multi-sensor turret',
      'Long endurance (27 hours ISR)',
      'Encrypted C-band datalink',
      'Triple-redundant avionics',
      'Automatic takeoff and landing',
      'GPS-denied navigation capability',
    ],
    advantages: [
      'Combat-proven in multiple conflicts',
      'Precision strike with low collateral damage',
      'Long endurance for persistent armed overwatch',
      'Relatively affordable compared to Western MALE UCAVs',
      'Strong Turkish government export support',
      'Effective against armor, air defense, and soft targets',
      'Growing ecosystem of Turkish munitions',
    ],
    disadvantages: [
      'Vulnerable to modern integrated air defense systems (S-300, BUK)',
      'Line-of-sight datalink limits range',
      'Limited payload compared to MQ-9 Reaper class',
      'Rotax engine dependency (Western supply chain)',
      'Relatively slow and non-stealthy',
      'No satellite datalink for beyond-LOS operations',
    ],
    combatRecord:
      'The Bayraktar TB2 has the most extensive combat record of any modern UCAV. In Libya (2019-2020), Turkish-supplied TB2s destroyed Pantsir-S1 air defense systems, armored vehicles, and artillery supporting Haftar\'s LNA forces, demonstrating the vulnerability of Russian-made air defenses to drone attack. In the 2020 Nagorno-Karabakh war, Azerbaijani TB2s devastated Armenian armored columns, artillery positions, and air defense systems in a campaign that shocked military establishments worldwide. In Syria, Turkey used TB2s against Syrian government and Russia-backed forces in Idlib during Operation Spring Shield (2020). In Ethiopia, the government used TB2s against TPLF forces in the Tigray War. In Ukraine, TB2s achieved early successes against Russian convoys and logistics in the first weeks of the 2022 invasion, though their effectiveness diminished as Russia established layered air defenses. The TB2 has catalyzed a global rethinking of air defense, armored warfare, and drone proliferation.',
    relatedSystems: ['Bayraktar Akinci', 'Wing Loong II', 'CH-4B', 'MQ-9 Reaper'],
    featured: false,
    content: `## Overview

The Bayraktar TB2, manufactured by Turkish firm Baykar Defence, is the most combat-proven and widely exported armed drone in the world. It has participated in at least six active conflicts across three continents and has been sold to more than 30 countries. Its combination of precision strike capability, long endurance, and relatively low cost has democratized UCAV capability, putting armed drone technology into the hands of nations and forces that previously could not access it.

## Technical Details

The TB2 has a wingspan of 12 meters and a maximum takeoff weight of 700 kg. It is powered by a Rotax 912 piston engine (with newer models transitioning to the Turkish-made TEI PD170) providing up to 27 hours of endurance. It carries up to 150 kg of payload on four hardpoints, typically Roketsan MAM-L (Smart Micro Munition, 22 kg laser-guided) or MAM-C (smaller variant) precision bombs. The WESCAM MX-15D multi-sensor turret provides daylight, infrared, and laser designation capabilities for targeting. The aircraft communicates via an encrypted C-band line-of-sight datalink with a range of approximately 150 km.

## Combat History

The TB2's combat debut in Libya (2019-2020) set the stage for its global reputation. Operating on behalf of the GNA, TB2s destroyed multiple Pantsir-S1 air defense systems, demonstrating that even modern short-range air defenses were vulnerable to drone attack. The 2020 Nagorno-Karabakh war was an even more decisive demonstration: Azerbaijani TB2s systematically destroyed Armenian armored vehicles, artillery, and air defense systems in a six-week campaign that fundamentally altered the conflict. In Ukraine, TB2s achieved notable early successes against Russian convoys, logistics vehicles, and even naval vessels (contributing to the sinking of patrol boats), though increasing Russian air defense density later reduced their operational freedom.

## Proliferation and Strategic Impact

The TB2 has triggered a global drone arms race. Its success in Libya and Nagorno-Karabakh caused dozens of countries to seek armed drone capability, either purchasing TB2s or accelerating domestic programs. Turkey has leveraged TB2 sales as a diplomatic tool, strengthening relationships across Africa, Central Asia, and Eastern Europe. The drone has also forced a re-evaluation of air defense doctrine, as traditional systems designed to counter manned aircraft proved vulnerable to low-cost drone saturation. The TB2's legacy extends beyond its own capabilities — it has catalyzed a fundamental shift in how nations think about airpower and precision strike.`,
  },
  // ─── CHINESE UCAVs ─────────────────────────────────────────────────
  {
    name: 'Wing Loong II',
    slug: 'wing-loong-ii',
    description:
      'Chinese medium-altitude long-endurance UCAV widely exported to the Middle East and Africa, serving as China\'s primary competitor to the MQ-9 Reaper in the global armed drone market.',
    category: 'threat-drone',
    manufacturer: 'Chengdu Aircraft Industry Group (CAIG/AVIC)',
    country: 'China',
    status: 'combat-proven',
    primaryCapability:
      'Medium-altitude persistent ISR and precision strike with guided bombs and missiles, providing armed reconnaissance capability to export customers.',
    specifications: [
      'Wingspan: 20.5 m',
      'Length: 11.0 m',
      'Maximum takeoff weight: 4,200 kg',
      'Payload: 480 kg (6 hardpoints)',
      'Endurance: ~20 hours',
      'Ceiling: 9,000 m (29,500 ft)',
      'Speed: 280 km/h max; ~200 km/h cruise',
      'Range: ~4,000 km ferry; operational radius varies by datalink',
      'Engine: Turboprop',
      'Armament: BA-7 AKD air-to-ground missile, FT series GPS-guided bombs, LS series laser-guided bombs',
      'Sensors: EO/IR turret with laser designator, SAR radar (optional)',
    ],
    platforms: ['Runway-launched'],
    deployedBy: [
      'United Arab Emirates',
      'Saudi Arabia',
      'Egypt',
      'Pakistan',
      'Kazakhstan',
      'Libya (LNA/Haftar forces)',
      'Algeria',
      'Nigeria',
      'Uzbekistan',
      'Serbia',
      'Indonesia',
    ],
    inServiceDate: '2017',
    detectionRange: '~50 km (EO/IR sensors)',
    effectiveRange: 'Multiple km (guided munitions); varies by weapon type',
    whatItIs:
      'The Wing Loong II (also known as Pterodactyl II or GJ-2 in PLAAF service) is a Chinese MALE-class UCAV that has become one of the most widely exported armed drones globally. Produced by CAIG/AVIC, it is roughly comparable to the General Atomics MQ-9 Reaper in size and role. It has been exported to more than 10 countries, primarily in the Middle East and Africa, filling the market gap left by US restrictions on armed drone exports.',
    howItWorks:
      'The Wing Loong II operates from conventional runways and is controlled via a ground station with datalink. It carries a multi-sensor EO/IR turret with laser designation for target identification and weapon guidance. It can carry a variety of Chinese-made precision munitions including the BA-7 AKD air-to-ground missile (laser-guided), FT-series GPS/INS-guided small-diameter bombs, and LS-series laser-guided bombs on six hardpoints. The turboprop engine provides long endurance for sustained armed overwatch missions.',
    keyFeatures: [
      'Reaper-class size and capability at lower cost',
      'Six hardpoints for multiple munitions',
      'Multiple weapon types (laser-guided, GPS-guided)',
      'Satellite datalink option for beyond-LOS operations (SATCOM variant)',
      'Optional SAR radar for all-weather ISR',
      'Competitive export pricing',
    ],
    advantages: [
      'Available for export without US ITAR restrictions',
      'Significantly cheaper than MQ-9 Reaper',
      'Large payload and long endurance',
      'Growing range of compatible Chinese munitions',
      'China willing to export to countries denied US drones',
      'No political conditions attached to sales',
    ],
    disadvantages: [
      'Less combat-proven than TB2 or MQ-9',
      'Limited post-sale support compared to Western manufacturers',
      'Munition quality and reliability questions',
      'Less mature sensor technology than Western equivalents',
      'Spare parts and maintenance dependency on Chinese supply',
      'Integration challenges reported by some operators',
    ],
    combatRecord:
      'The Wing Loong II has seen combat use primarily in Libya, where UAE-operated examples struck targets supporting Haftar\'s Libyan National Army against GNA forces (2019-2020). This created the unusual situation of Wing Loong IIs and Bayraktar TB2s operating on opposite sides of the same conflict. Saudi Arabia and the UAE have reportedly employed Wing Loong IIs in the Yemen conflict for ISR and strike missions. Egypt has used them for counter-terrorism operations in the Sinai. However, detailed combat performance data is limited compared to the extensively documented TB2, as operators have been less forthcoming about results and there is less open-source coverage of operations.',
    relatedSystems: ['CH-4B', 'CH-5', 'Bayraktar TB2', 'MQ-9 Reaper'],
    featured: false,
    content: `## Overview

The Wing Loong II is China's flagship export armed drone and a key instrument of Chinese defense diplomacy. Roughly comparable to the American MQ-9 Reaper in size and mission profile, it has been exported to more than 10 countries, primarily in the Middle East and Africa. Its success in the export market has been driven by China's willingness to sell armed drones to countries that the United States has refused, filling a significant gap in the global armed drone marketplace.

## Technical Details

The Wing Loong II has a wingspan of 20.5 meters and a maximum takeoff weight of 4,200 kg, making it substantially larger than the Bayraktar TB2 and roughly comparable to the MQ-9 Reaper. It is powered by a turboprop engine providing approximately 20 hours of endurance and a maximum speed of 280 km/h. The aircraft carries up to 480 kg of payload on six hardpoints. Standard armament includes BA-7 AKD laser-guided air-to-ground missiles and FT-series GPS/INS-guided small-diameter bombs. The sensor suite includes an EO/IR turret with laser designator and an optional synthetic aperture radar (SAR) for all-weather operations. A satellite communication (SATCOM) variant enables beyond-line-of-sight operations.

## Combat History

The Wing Loong II's most documented combat use has been in Libya, where UAE-operated examples supported Khalifa Haftar's Libyan National Army. In a notable twist of modern warfare, Wing Loong IIs and Turkish Bayraktar TB2s operated on opposite sides of the same conflict, marking the first drone-vs-drone proxy war. Saudi Arabia and the UAE have reportedly used Wing Loong IIs in Yemen for ISR and targeted strikes. Egypt operates them for counter-terrorism missions in the Sinai Peninsula. While combat results have been less publicly documented than TB2 operations, satellite imagery and open-source intelligence have confirmed Wing Loong II strikes in multiple theaters.

## Export Market Impact

The Wing Loong II has fundamentally reshaped the global armed drone market. By offering a Reaper-class capability at significantly lower cost and without the political conditions attached to US arms sales, China has enabled armed drone capability for countries across the Middle East and Africa. This proliferation has raised concerns among Western defense planners about the spread of precision strike capability and the potential for these systems to be used in ways that conflict with international norms.`,
  },
  {
    name: 'CH-4B',
    slug: 'ch-4b',
    description:
      'Chinese medium-altitude UCAV widely exported across the Middle East and Africa, used in combat in Yemen, Iraq, and other theaters as an affordable armed drone alternative.',
    category: 'threat-drone',
    manufacturer: 'China Aerospace Science and Technology Corporation (CASC)',
    country: 'China',
    status: 'combat-proven',
    primaryCapability:
      'Medium-altitude ISR and precision strike with guided munitions, providing armed drone capability to nations unable to purchase Western equivalents.',
    specifications: [
      'Wingspan: 18 m',
      'Length: 8.5 m',
      'Maximum takeoff weight: 1,330 kg',
      'Payload: 345 kg (4 hardpoints)',
      'Endurance: ~14 hours (ISR), less when armed',
      'Ceiling: 7,000 m (23,000 ft)',
      'Speed: ~230 km/h max; ~150-180 km/h cruise',
      'Range: ~3,000 km ferry; ~250 km operational radius (LOS datalink)',
      'Engine: Piston engine (some sources report a rotary engine)',
      'Armament: AR-1 semi-active laser-guided missile, FT-series GPS-guided bombs',
      'Sensors: EO/IR turret with laser designator',
    ],
    platforms: ['Runway-launched'],
    deployedBy: [
      'Iraq',
      'Jordan',
      'Egypt',
      'Saudi Arabia',
      'Algeria',
      'Pakistan',
      'Turkmenistan',
      'Myanmar',
      'Ethiopia',
    ],
    inServiceDate: '2014',
    detectionRange: '~30 km (EO/IR sensors)',
    effectiveRange: 'Multiple km (guided munitions); 250 km operational radius',
    whatItIs:
      'The CH-4B (Caihong-4B, "Rainbow-4B") is a Chinese medium-altitude UCAV developed by CASC\'s Eleventh Academy (China Academy of Aerospace Aerodynamics). It is the armed variant of the CH-4 series and has been one of China\'s most successful drone exports. It is broadly comparable to the MQ-1 Predator in capability and has been sold to multiple countries in the Middle East, Africa, and Asia.',
    howItWorks:
      'The CH-4B operates from conventional runways using a ground control station with line-of-sight datalink. It carries an EO/IR sensor turret for target identification and laser designation. The aircraft can carry AR-1 semi-active laser-guided missiles and FT-series GPS/INS-guided bombs on four underwing hardpoints. The operator identifies targets through the sensor feed, designates them with the laser, and employs weapons from medium altitude.',
    keyFeatures: [
      'Affordable armed drone capability',
      'AR-1 laser-guided missile integration',
      'EO/IR turret for ISR and targeting',
      'Proven in multiple export markets',
      'Four hardpoints for flexible loadouts',
    ],
    advantages: [
      'Significantly cheaper than Western MALE UCAVs',
      'Available without restrictive export conditions',
      'Combat-proven in multiple theaters',
      'Reasonable endurance for persistent operations',
      'Large existing operator base ensures continued support',
    ],
    disadvantages: [
      'Reports of reliability issues from some operators',
      'Piston engine limits performance at altitude',
      'Less capable sensors than Western equivalents',
      'AR-1 missile reportedly has accuracy limitations',
      'Lower payload than Wing Loong II or MQ-9',
      'Maintenance challenges reported in desert environments',
    ],
    combatRecord:
      'The CH-4B has seen combat use in multiple theaters. Iraq has been the most prominent operator, using CH-4Bs against ISIS targets in Anbar and Nineveh provinces from 2015 onward, with documented strikes against vehicle convoys, fighting positions, and individual targets. However, Iraqi operators have reportedly experienced reliability and accuracy issues. Saudi Arabia and the UAE have employed CH-4Bs in the Yemen conflict, though they have reportedly supplemented them with Wing Loong IIs due to performance concerns. Jordan operates CH-4Bs and has used them for border security and counter-terrorism. Egypt and Algeria maintain CH-4B fleets for ISR and potential strike missions. Myanmar has reportedly used CH-4Bs in internal operations against ethnic armed groups.',
    relatedSystems: ['Wing Loong II', 'CH-5', 'Bayraktar TB2', 'MQ-1 Predator'],
    featured: false,
    content: `## Overview

The CH-4B (Caihong-4B, or "Rainbow-4B") is one of China's most successful military drone exports and a significant contributor to armed drone proliferation globally. Developed by CASC, it provides a Predator-class armed reconnaissance capability at a fraction of the cost of Western equivalents. It has been sold to at least nine countries and has seen combat use in Iraq, Yemen, and other theaters.

## Technical Details

The CH-4B has a wingspan of 18 meters and a maximum takeoff weight of 1,330 kg. It is powered by a piston engine providing approximately 14 hours of endurance in ISR configuration and a maximum speed of about 230 km/h. The aircraft carries up to 345 kg of payload on four underwing hardpoints. Standard armament includes AR-1 semi-active laser-guided missiles and FT-series GPS/INS-guided small-diameter bombs. The sensor suite features an EO/IR turret with integrated laser designator for both surveillance and weapon guidance.

## Combat History

Iraq became the first country to use the CH-4B in combat, employing it against ISIS targets from approximately 2015 onward. Iraqi CH-4Bs conducted strikes against vehicle convoys, fighting positions, and personnel in Anbar and Nineveh provinces. However, Iraqi military sources have reportedly raised concerns about the reliability and accuracy of both the drone and its AR-1 missiles. Saudi Arabia and the UAE have used CH-4Bs in the Yemen conflict, though operational reports suggest mixed results, with some users supplementing or replacing CH-4Bs with Wing Loong IIs or Bayraktar TB2s for more demanding missions.

## Market Position and Limitations

The CH-4B occupies a significant niche in the global drone market as an affordable entry point for armed drone capability. However, it faces increasing competition from both the larger, more capable Wing Loong II (also Chinese) and the smaller but more combat-proven Bayraktar TB2 (Turkish). Reports of reliability and accuracy issues from some operators have affected its reputation, and several countries have sought to diversify their drone fleets rather than relying solely on the CH-4B. Despite these challenges, its low cost and lack of export restrictions ensure continued demand from budget-constrained armed forces seeking basic armed drone capability.`,
  },

]

async function seedSystems() {
  console.log('Starting C-UAS systems seeding...')
  console.log(`Found ${systemsData.length} systems to seed`)

  let created = 0
  let updated = 0
  let errors = 0

  for (const system of systemsData) {
    try {
      const existing = await prisma.system.findUnique({
        where: { slug: system.slug },
      })

      const systemData = {
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
      }

      if (existing) {
        await prisma.system.update({
          where: { slug: system.slug },
          data: systemData,
        })
        console.log(`  Updated: ${system.name}`)
        updated++
      } else {
        await prisma.system.create({
          data: systemData,
        })
        console.log(`  Created: ${system.name}`)
        created++
      }
    } catch (error) {
      console.error(`  Error with "${system.name}":`, error)
      errors++
    }
  }

  console.log('\n--- Seeding Complete ---')
  console.log(`Created: ${created}`)
  console.log(`Updated: ${updated}`)
  console.log(`Errors: ${errors}`)

  const total = await prisma.system.count()
  console.log(`Total systems in database: ${total}`)
}

seedSystems()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
