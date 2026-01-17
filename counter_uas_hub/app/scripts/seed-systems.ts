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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2504/8998477/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2210/7480650/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2202/7057424/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2509/9326581/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2502/8867746/1000w_q95.jpg',
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
    imageUrl: 'https://cdn.northropgrumman.com/-/media/Project/Northrop-Grumman/ngc/what-we-do/mission-solutions/delivering-to-army-capacity-scale-speed/ibcs-northrop-grumman-produced-engagement-operations-center.jpg',
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
    imageUrl: 'https://cdn.northropgrumman.com/-/media/IBCS-operations-center-at-White-Sands-Missile-Range-New-New-Mexico.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2509/9326581/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2506/9092756/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2502/8867746/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2202/7057424/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2509/9326581/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2509/9326581/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2506/9092756/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2509/9326581/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2509/9326581/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2506/9092756/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2309/8010601/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2509/9326581/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2202/7057424/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2202/7057424/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2502/8867746/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2502/8867746/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2509/9326581/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2506/9092756/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2509/9326581/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2502/8867746/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2509/9326581/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2202/7057424/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2506/9092756/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2202/7057424/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2509/9326581/1000w_q95.jpg',
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
    imageUrl: null,
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
    imageUrl: 'https://cdn.northropgrumman.com/-/media/Project/Northrop-Grumman/ngc/what-we-do/mission-solutions/c-uas/AiON-Counter-UAS-hero-001.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2204/7143773/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2506/9092756/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2502/8867746/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2502/8867746/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2509/9326581/1000w_q95.jpg',
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
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2202/7057424/1000w_q95.jpg',
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
