export type CatalogEntityType = 'system' | 'explainer'
export type CatalogFieldValue = string | number | boolean | null | string[]

export interface CatalogCorrectionSource {
  canonicalUrl: string
  title: string
  publisher: string
  sourceType: 'government' | 'manufacturer' | 'research' | 'reporting'
  provenanceLabel: 'primary-source-backed' | 'vendor-reported' | 'secondary-source-backed'
  claimKeys: string[]
  evidenceSummary: string
}

export interface CatalogEvidenceAssessment {
  confirmedFacts: string[]
  vendorClaims: string[]
  analysis: string[]
  unresolved: string[]
}

export interface CatalogMediaDefinition {
  url: string
  origin: string
  attribution: string
  license: string
  depictedEntity: string
  depictedVariant: string | null
  storageMode: 'remote' | 'controlled-copy'
  verificationState: 'verified-topic-match' | 'unverified'
  sourceUrl: string
}

export interface CatalogCorrection {
  entityType: CatalogEntityType
  slug: string
  reason: string
  baselineSha256: string
  changes: Record<string, CatalogFieldValue>
  evidence: CatalogEvidenceAssessment
  mediaVerificationState?: string
  media?: CatalogMediaDefinition
  sources: CatalogCorrectionSource[]
}

const RTX_KURFS_IMAGE = 'https://prd-sc102-cdn.rtx.com/raytheon/-/media/ray/what-we-do/counter-uas/sensors/ku-band-radio-frequency-system/450277_mlids_-00066-stmt-a-2022-070_16x9.jpg'

export const KNOWN_CATALOG_CORRECTIONS: CatalogCorrection[] = [
  {
    entityType: 'system', slug: 'kurfs', baselineSha256: 'ef3451d183c3c5374a10d2ea6396c9919435ca04e8257470819ae32a8000f300',
    reason: 'The public record attributes Raytheon KuRFS to SRC Inc. and presents unsupported range and service claims.',
    changes: {
      name: 'KuRFS', manufacturer: 'Raytheon (RTX)',
      description: 'Raytheon’s Ku-band Radio Frequency Sensor is a 360-degree AESA radar for detecting, identifying, and tracking airborne threats, including unmanned aircraft systems.',
      content: `## Identity

KuRFS is Raytheon’s Ku-band Radio Frequency Sensor. It is a distinct radar from the Army’s X-band AN/MPQ-64 Sentinel.

## Documented role

Raytheon describes KuRFS as a 360-degree active electronically scanned array radar that detects, identifies, and tracks airborne threats and cues compatible effectors. GAO identifies the KuRFS family as one of the Army’s formal counter-small-UAS acquisition programs.

## Evidence limits

The public sources reviewed for this packet do not establish the prior 10+ km Group 1-2 range, 2017 in-service date, or Marine Corps deployment claims.`,
      primaryCapability: 'Ku-band detection, identification, precision tracking, and fire-control cueing for unmanned aircraft and other airborne threats.',
      specifications: ['Ku-band operation', 'Active electronically scanned array (AESA)', '360-degree coverage', 'Detects and tracks drones, rockets, artillery, and mortars', 'Fixed-site or vehicle-mounted configuration'],
      detectionRange: null, platforms: ['Fixed site', 'Vehicle-mounted'], inServiceDate: null, deployedBy: ['U.S. Army'],
      whatItIs: 'KuRFS is Raytheon’s Ku-band Radio Frequency Sensor, a 360-degree precision radar used in the U.S. Army’s Low, slow, small unmanned aircraft Integrated Defeat System (LIDS).',
      howItWorks: 'Its AESA electronically steers a Ku-band beam to detect, identify, and track small airborne objects and provide fire-control-quality cueing to compatible effectors.',
      keyFeatures: ['Ku-band AESA radar', '360-degree persistent coverage', 'Precision tracking and fire-control cueing', 'Supports multiple counter-UAS effectors'],
      advantages: [], disadvantages: [], relatedSystems: ['LIDS', 'Coyote'], provenanceLabel: 'partially-sourced',
    },
    evidence: {
      confirmedFacts: ['GAO identifies the KuRFS family as a formal Army C-sUAS acquisition program.'],
      vendorClaims: ['Raytheon identifies itself as the maker and describes 360-degree Ku-band AESA detection, tracking, and weapon cueing.'],
      analysis: ['The RTX-hosted hero is a topic match for KuRFS/LIDS.'],
      unresolved: ['A public authoritative Group 1-2 detection range was not located.', 'The 2017 in-service date and Marine Corps deployment were not confirmed.'],
    },
    media: { url: RTX_KURFS_IMAGE, origin: 'RTX Raytheon', attribution: 'RTX Raytheon product media', license: 'Vendor media; display only', depictedEntity: 'KuRFS', depictedVariant: null, storageMode: 'remote', verificationState: 'verified-topic-match', sourceUrl: 'https://www.rtx.com/raytheon/what-we-do/integrated-air-and-missile-defense/kurfs' },
    sources: [
      { canonicalUrl: 'https://files.gao.gov/reports/GAO-25-107491/index.html', title: 'Army Modernization: Air and Missile Defense Efforts Would Benefit from Applying Leading Practices', publisher: 'U.S. Government Accountability Office', sourceType: 'government', provenanceLabel: 'primary-source-backed', claimKeys: ['status', 'content:army-program'], evidenceSummary: 'GAO describes the KuRFS family as multi-mission precision radars and a formal Army C-sUAS acquisition program.' },
      { canonicalUrl: 'https://www.rtx.com/raytheon/what-we-do/integrated-air-and-missile-defense/kurfs', title: 'KuRFS: Ku-band Radio Frequency Sensor', publisher: 'RTX Raytheon', sourceType: 'manufacturer', provenanceLabel: 'vendor-reported', claimKeys: ['name', 'manufacturer', 'description', 'primaryCapability', 'specifications', 'whatItIs', 'howItWorks', 'keyFeatures', 'imageUrl'], evidenceSummary: 'Raytheon describes KuRFS as its 360-degree Ku-band AESA radar for detection, identification, tracking, and effector cueing.' },
    ],
  },
  {
    entityType: 'system', slug: 'ku-band-sentinel', baselineSha256: '9d3f534a9fd565d978db804bf0c2e3895353f033439697fe5c3a7c8fe54aa6de',
    reason: 'The record merges the KuRFS name and image with the distinct AN/MPQ-64 Sentinel X-band radar.',
    changes: {
      name: 'AN/MPQ-64 Sentinel',
      description: 'The U.S. Army AN/MPQ-64 Sentinel is a mobile three-dimensional X-band phased-array air-defense radar that provides surveillance and fire-control-quality data against UAS, cruise missiles, and fixed- and rotary-wing aircraft.',
      content: `## Identity

The AN/MPQ-64 Sentinel is the U.S. Army’s mobile X-band air-defense radar. It is not the Ku-band Raytheon KuRFS sensor.

## Documented capability

Army sources describe Sentinel A3/A4 as three-dimensional phased-array radars providing persistent surveillance and fire-control-quality track data through air-defense command-and-control systems. Sentinel A3 has a 75 km instrumented range.

## Evidence limits

This packet does not retain the previous Group 1 performance, 0-60 degree elevation, Marine Corps use, or 20+ allied-nation assertions because the reviewed authoritative sources did not establish them.`,
      primaryCapability: 'X-band, 360-degree air surveillance and fire-control-quality tracking for air and missile defense.',
      specifications: ['Three-dimensional X-band phased-array radar', '360-degree coverage', 'Sentinel A3 instrumented range: 75 km', 'Trailer-mounted', 'Supports air-defense command-and-control systems'],
      detectionRange: '75 km instrumented range (Sentinel A3)', inServiceDate: '1995', deployedBy: ['U.S. Army'],
      whatItIs: 'The AN/MPQ-64 Sentinel is the Army’s mobile X-band air-defense radar. It is a separate radar family from the Ku-band Raytheon KuRFS counter-UAS sensor.',
      howItWorks: 'Sentinel provides persistent three-dimensional surveillance and fire-control-quality track data through Army command-and-control systems for UAS, cruise-missile, and aircraft defense.',
      keyFeatures: ['X-band phased-array radar', '360-degree surveillance', 'Fire-control-quality track data', 'Trailer-mounted mobility'],
      advantages: [], disadvantages: [], combatRecord: null, relatedSystems: ['FAAD C2', 'IBCS', 'KuRFS'], imageUrl: null, provenanceLabel: 'primary-source-backed',
    },
    mediaVerificationState: 'variant-mismatch-removed',
    evidence: {
      confirmedFacts: ['Army sources identify Sentinel A3/A4 as AN/MPQ-64, X-band, three-dimensional, 360-degree air-defense radars.', 'The Army reports a 75 km Sentinel A3 instrumented range and 1995 entry into service.'],
      vendorClaims: [], analysis: ['The current hero is the exact image reused by the separate KuRFS record.'],
      unresolved: ['The prior elevation, Group 1 performance, Marine Corps use, and 20+ allied-nation claims were not confirmed.'],
    },
    sources: [
      { canonicalUrl: 'https://api.army.mil/e2/c/downloads/2024/07/19/ab2038a9/u-s-army-portfolio-2024.pdf', title: 'U.S. Army Acquisition Program Portfolio 2024 — Sentinel A3/A4', publisher: 'U.S. Army', sourceType: 'government', provenanceLabel: 'primary-source-backed', claimKeys: ['name', 'description', 'primaryCapability', 'specifications', 'whatItIs', 'howItWorks', 'keyFeatures'], evidenceSummary: 'The Army identifies Sentinel A3/A4 as three-dimensional X-band air-defense radars providing surveillance and fire-control-quality data.' },
      { canonicalUrl: 'https://asc.army.mil/web/access-acquisition-partnership-to-roll-out-new-improved-sentinel-radar/', title: 'Acquisition partnership to roll out new improved Sentinel Radar', publisher: 'U.S. Army Acquisition Support Center', sourceType: 'government', provenanceLabel: 'primary-source-backed', claimKeys: ['detectionRange', 'specifications', 'inServiceDate'], evidenceSummary: 'The Army reports 360-degree X-band operation, a 75 km instrumented range, and 1995 entry into service.' },
    ],
  },
  {
    entityType: 'system', slug: 'p-hel', baselineSha256: '84a2dc7d5cb47cfffa377924c25a4dbc5b50218ea4e2d1a733f0a83a84820070',
    reason: 'The record names the wrong industry team, inflates the demonstrated prototype from 10 kW to 50 kW, adds unsupported missions and transport claims, and uses a LOCUST X3 URL that resolves to HTML.',
    changes: {
      manufacturer: 'SAIC (10 kW integrator) / BlueHalo (laser subsystem; now AeroVironment)',
      description: 'The Palletized High Energy Laser (P-HEL) is a U.S. Army counter-small-UAS prototype developed to protect fixed and semi-fixed sites. The demonstrated 2022 prototype was 10 kW class, with a separate 20 kW follow-on planned.',
      content: `## Program and industry team

The Army demonstrated a 10 kW-class Palletized High Energy Laser prototype in 2022 for fixed and semi-fixed counter-small-UAS site defense. SAIC was the prime integrator; BlueHalo supplied the laser, Liteye Systems and Anduril Industries supplied external sensors, and Rocky Research supplied thermal control and power generation.

## Demonstrated activity

Army reporting says soldiers detected, tracked, and defeated targets during the April 2022 Yuma Proving Ground demonstration. The Army described a separate 20 kW-class follow-on under development by Radiance Technologies.

## Vendor-reported development

AeroVironment, which acquired BlueHalo, now associates LOCUST with P-HEL and makes operational-deployment claims. Those claims remain vendor-reported in this packet.

## Evidence limits

The reviewed authoritative sources do not establish a 50 kW P-HEL, counter-RAM mission, 463L/C-130 compatibility, or a public engagement range.`,
      primaryCapability: 'High-energy-laser defeat of small unmanned aircraft for fixed and semi-fixed site defense.',
      specifications: ['2022 demonstrated prototype: 10 kW class', 'Army-stated follow-on: 20 kW class', 'SAIC integrated the 10 kW prototype', 'BlueHalo supplied the laser subsystem', 'External sensors supplied by Liteye Systems and Anduril Industries'],
      effectiveRange: null, platforms: ['Palletized fixed or semi-fixed site'], status: 'prototype', inServiceDate: null,
      whatItIs: 'P-HEL is an Army prototype counter-small-UAS laser system. The 10 kW prototype integrated by SAIC used a BlueHalo laser subsystem and external sensors from Liteye Systems and Anduril Industries.',
      howItWorks: 'The system detects and tracks small UAS and places high-energy laser energy on the target. Army reporting confirms target kills in a 2022 soldier training and demonstration event but does not publish an engagement range.',
      keyFeatures: ['10 kW-class 2022 prototype', 'Palletized site-defense configuration', 'Integrated sensors, tracking, power, thermal management, and laser effector'],
      advantages: [], disadvantages: [], imageUrl: null, provenanceLabel: 'partially-sourced',
    },
    mediaVerificationState: 'broken-variant-mismatch-removed',
    evidence: {
      confirmedFacts: ['The Army demonstrated a 10 kW-class P-HEL for fixed and semi-fixed site defense in April 2022.', 'The Army names SAIC, BlueHalo, Liteye, Anduril, Rocky Research, and a separate Radiance 20 kW follow-on.'],
      vendorClaims: ['AeroVironment states that LOCUST-equipped P-HEL systems deployed operationally; independent public corroboration was not located.'],
      analysis: ['The current LOCUST X3 URL redirects to an HTML homepage rather than an image and is not a reliable P-HEL variant depiction.'],
      unresolved: ['No authoritative public engagement range, 463L/C-130 claim, 50 kW configuration, or counter-RAM mission was found.'],
    },
    sources: [
      { canonicalUrl: 'https://www.army.mil/article-amp/257011/soldiers_conduct_high_energy_laser_training_and_demonstration_at_yuma_proving_ground', title: 'Soldiers Conduct High Energy Laser Training and Demonstration at Yuma Proving Ground', publisher: 'U.S. Army', sourceType: 'government', provenanceLabel: 'primary-source-backed', claimKeys: ['manufacturer', 'description', 'primaryCapability', 'specifications', 'status', 'whatItIs', 'howItWorks', 'keyFeatures'], evidenceSummary: 'The Army documents the 10 kW prototype, site-defense mission, 2022 demonstration, industry team, and planned 20 kW follow-on.' },
      { canonicalUrl: 'https://www.avinc.com/?avinc_solution_tax=locust', title: 'LOCUST program archive', publisher: 'AeroVironment', sourceType: 'manufacturer', provenanceLabel: 'vendor-reported', claimKeys: ['content:vendor-operational-claim'], evidenceSummary: 'AeroVironment identifies LOCUST as the P-HEL laser and makes deployment claims retained only as vendor-reported.' },
    ],
  },
  {
    entityType: 'system', slug: 'rapidfire', baselineSha256: 'cf2dea045bc971916f5601a2fbabd80dc964d81ac7f883f3dc6ce47121de5984',
    reason: 'The record has outdated ownership, country, status, ammunition, and fielding claims, and its third-party hero returns 404.',
    changes: {
      name: 'RAPIDFire', manufacturer: 'Thales / KNDS France', country: 'France',
      description: 'RAPIDFire is a remotely operated 40 mm close-in defense turret jointly developed by Thales and KNDS France. The naval system is in French Navy service; a land variant is in development.',
      content: `## Configuration and status

RAPIDFire is a remotely operated 40 mm close-in defense system jointly developed by Thales and KNDS France. The naval configuration is in French Navy service. RAPIDFire Land is a distinct developing configuration.

## Documented capability

The French Ministry of Armed Forces reports an optronic, gyro-stabilized turret with up to 140 ready rounds, a rate of fire up to 180 rounds per minute, and an air-target range up to 4,000 metres.

## Ammunition boundary

The turret can use qualified 40CT ammunition. KNDS says the dedicated A3B anti-aerial airburst round remains in development, with full anti-air capability targeted for 2027.`,
      primaryCapability: 'Close-in defense against air and surface threats, including UAS, using a stabilized 40 mm CT40 turret and optronic fire control.',
      specifications: ['40 mm CT40 cased-telescoped weapon', 'French Ministry of Armed Forces rate of fire: up to 180 rounds/minute', 'Up to 140 ready rounds', 'Air-target range: up to 4,000 m', 'A3B anti-aerial airburst ammunition remains in development'],
      effectiveRange: 'Up to 4 km against air targets', platforms: ['Naval vessels', 'Land variant in development'], status: 'operational', inServiceDate: null, deployedBy: ['French Navy'],
      whatItIs: 'RAPIDFire is a Thales/KNDS France 40 mm remotely operated close-in defense system. Naval units are in French Navy service, while RAPIDFire Land is a separate developing configuration.',
      howItWorks: 'The turret combines a gyro-stabilized 40 mm CT40 weapon with optronic tracking and fire control. It selects compatible ammunition for the target; the dedicated A3B anti-aerial round is still being developed.',
      keyFeatures: ['40 mm CT40 weapon', 'Integrated gyro-stabilized optronics', 'Up to 140 ready rounds', 'Naval system operational; land variant developing'],
      disadvantages: [], imageUrl: null, provenanceLabel: 'primary-source-backed',
    },
    mediaVerificationState: 'broken-hero-removed',
    evidence: {
      confirmedFacts: ['The French ministry identifies Thales and KNDS and reports up to 180 rounds/minute, 140 ready rounds, and 4 km air-target range.'],
      vendorClaims: ['KNDS reports French Navy fielding, early-2025 qualification, a developing land variant, and A3B availability targeted for 2027.'],
      analysis: ['The third-party hero returns HTTP 404.'], unresolved: ['The previous record conflated operational naval and developing land configurations.'],
    },
    sources: [
      { canonicalUrl: 'https://www.defense.gouv.fr/systeme-rapidfire-s40sa', title: 'Système RAPIDFire S40SA', publisher: 'French Ministry of Armed Forces', sourceType: 'government', provenanceLabel: 'primary-source-backed', claimKeys: ['manufacturer', 'country', 'description', 'primaryCapability', 'specifications', 'effectiveRange', 'whatItIs', 'howItWorks', 'keyFeatures'], evidenceSummary: 'The ministry lists Thales and KNDS, the system role, up to 180 rounds per minute, 140 ready rounds, and a 4,000 m air-target range.' },
      { canonicalUrl: 'https://knds.com/en/press-releases/thales-and-knds-france-unveil-rapid-fire-land-a-land-based-variant-of-the-40-mm-rapid-fire-naval-defence-system', title: 'Thales and KNDS France unveil RAPIDFire Land', publisher: 'KNDS France', sourceType: 'manufacturer', provenanceLabel: 'vendor-reported', claimKeys: ['status', 'platforms', 'deployedBy', 'specifications:airburst'], evidenceSummary: 'KNDS distinguishes operational naval units from the developing land variant and says A3B is targeted for 2027.' },
    ],
  },
  {
    entityType: 'system', slug: 'auds', baselineSha256: '0b114f4e1d4d3bbcba5033c100689878913b6f3484276434c83be37065c9c1b9',
    reason: 'The record omits Blighter from the UK consortium, labels the system American, includes unsupported component/performance claims, and uses a 404 hero.',
    changes: {
      manufacturer: 'Blighter Surveillance Systems / Chess Dynamics / Enterprise Control Systems', country: 'United Kingdom',
      description: 'AUDS is an integrated counter-UAS system developed by a consortium of UK companies, combining Blighter radar, Chess Dynamics electro-optical tracking, and Enterprise Control Systems radio-frequency inhibition.',
      content: `## Industry team

AUDS was developed by a consortium of UK companies: Blighter Surveillance Systems, Chess Dynamics, and Enterprise Control Systems.

## Vendor-described operation

Blighter states that its electronic-scanning micro-Doppler radar detects the target, cues Chess Dynamics infrared/daylight cameras for identification and tracking, and enables an operator to employ the Enterprise Control Systems RF inhibitor.

## Vendor performance claims

The consortium brochure claims detection at up to 10 km and detect-to-defeat in approximately 10-15 seconds. These are manufacturer claims, not independently verified performance figures.

## Evidence limits

The previous 2+ km jammer range, 100 kg weight, Iraq/Syria combat narrative, and broad deployment list were not confirmed by higher-priority public sources.`,
      primaryCapability: 'Integrated detection, tracking, identification, and non-kinetic RF defeat of unmanned aircraft.',
      specifications: ['Vendor-reported detection range: up to 10 km', 'Electronic-scanning micro-Doppler radar', 'Infrared and daylight cameras with video tracking', 'Non-kinetic RF inhibitor', 'Vendor-reported detect-to-defeat time: 10-15 seconds'],
      effectiveRange: null, platforms: ['Fixed site', 'Vehicle-mounted'], inServiceDate: null, deployedBy: ['Spanish Ministry of Defence'],
      whatItIs: 'AUDS is a UK-developed integrated counter-UAS system using radar, electro-optical tracking, and an RF inhibitor supplied by three consortium companies.',
      howItWorks: 'Blighter radar detects a target and cues the Chess Dynamics electro-optical system for identification and tracking; an operator can then employ the Enterprise Control Systems RF inhibitor.',
      keyFeatures: ['Integrated radar, electro-optical, and RF-inhibition chain', 'Automatic sensor cueing', 'Fixed-site and vehicle configurations'],
      advantages: [], disadvantages: [], combatRecord: null, imageUrl: null, provenanceLabel: 'vendor-reported',
    },
    mediaVerificationState: 'broken-hero-removed',
    evidence: {
      confirmedFacts: [], vendorClaims: ['Blighter identifies the UK consortium and claims up-to-10 km detection and 10-15 second detect-to-defeat performance.', 'Blighter reports Spanish Ministry of Defence selection.'],
      analysis: ['The current hero returns HTTP 404.'], unresolved: ['The prior jammer range, weight, combat narrative, and broad deployment list were not independently confirmed.'],
    },
    sources: [
      { canonicalUrl: 'https://blighter.com/auds-counter-drone-system-enhanced-for-vehicle-deployment-and-to-defeat-swarm-attacks/', title: 'Strategic Counter-UAS Systems — AUDS', publisher: 'Blighter Surveillance Systems', sourceType: 'manufacturer', provenanceLabel: 'vendor-reported', claimKeys: ['manufacturer', 'country', 'description', 'primaryCapability', 'specifications', 'platforms', 'whatItIs', 'howItWorks', 'keyFeatures'], evidenceSummary: 'The brochure identifies the UK consortium and describes the radar, electro-optical, RF-inhibition chain and performance claims.' },
      { canonicalUrl: 'https://blighter.com/spanish-defence-ministry-selects-auds-system-to-detect-and-neutralise-uavs-drones/', title: 'Spanish Defence Ministry Selects AUDS System', publisher: 'Blighter Surveillance Systems', sourceType: 'manufacturer', provenanceLabel: 'vendor-reported', claimKeys: ['deployedBy', 'status'], evidenceSummary: 'Blighter reports the Spanish Defence Ministry selection and identifies the consortium members.' },
    ],
  },
  {
    entityType: 'system', slug: 'coyote-block-1', baselineSha256: '940e7bd8b2c999b3e81ecf4719019aa0080b06f24fc70c81834ba07a305e4869',
    reason: 'The public hero explicitly depicts a 2026 Coyote Block 2 launch, not the historical Block 1 record; authoritative Block 1 evidence remains insufficient for broader field changes.',
    changes: { imageUrl: null }, mediaVerificationState: 'variant-mismatch-removed',
    evidence: {
      confirmedFacts: ['Army and GAO sources document the current Coyote interceptor family and its role in LIDS, but not this record’s Block 1-specific details.'],
      vendorClaims: ['RTX’s current family page documents Block 2 kinetic and Block 3 non-kinetic variants.'],
      analysis: ['The image URL is named block-2-launch and RTX presents the depicted variant as Block 2.'],
      unresolved: ['Block 1 dimensions, range, warhead, service date, deployment, and operational history remain unverified and are deliberately not overwritten.'],
    },
    sources: [
      { canonicalUrl: 'https://files.gao.gov/reports/GAO-25-107491/index.html', title: 'Army Modernization: Air and Missile Defense Efforts Would Benefit from Applying Leading Practices', publisher: 'U.S. Government Accountability Office', sourceType: 'government', provenanceLabel: 'primary-source-backed', claimKeys: ['content:coyote-family'], evidenceSummary: 'GAO describes Coyote launchers and interceptors as current Army C-sUAS programs integrated into fixed and mobile LIDS.' },
      { canonicalUrl: 'https://www.rtx.com/raytheon/what-we-do/integrated-air-and-missile-defense/coyote', title: 'Coyote C-UAS', publisher: 'RTX Raytheon', sourceType: 'manufacturer', provenanceLabel: 'vendor-reported', claimKeys: ['manufacturer', 'content:coyote-family', 'imageUrl'], evidenceSummary: 'RTX distinguishes current Block 2 kinetic and Block 3 non-kinetic variants; it does not validate the Block 1-specific catalog claims.' },
    ],
  },
]

export const KNOWN_EXPLAINER_CORRECTIONS: CatalogCorrection[] = [
  {
    entityType: 'explainer', slug: 'jiatf-401-pentagons-counter-drone-authority', baselineSha256: '59058eb349751f526f32fdc29ebe1f2261ebfcdacae758c9c57a5ceec1ffeded',
    reason: 'The explainer presents unsupported budget, RDT&E, Replicator, sunset, staffing, and single-buyer claims as fact instead of separating the public record from analysis.',
    changes: {
      title: 'JIATF 401: The Defense Department’s Counter-UAS Task Force',
      description: 'JIATF 401 is the Defense Department task force established in August 2025 to align authorities and resources and accelerate delivery of joint counter-small-UAS capabilities.',
      whatItIs: 'Joint Interagency Task Force 401 was established in August 2025 as a joint and interagency organization reporting to the Deputy Secretary of Defense. Its public mission is to align authorities and resources and rapidly deliver counter-small-UAS capabilities.',
      howItWorks: 'Public releases show the task force coordinating policy, testing and evaluation, capability assessment, procurement pathways, training, and fielding. Its documented initiatives include common test criteria and a counter-UAS marketplace.',
      keyFeatures: ['Reports to the Deputy Secretary of Defense', 'Joint and interagency counter-small-UAS coordination', 'Common test-and-evaluation criteria', 'Counter-UAS capability marketplace', 'Capability delivery, training, and fielding support'],
      advantages: [], disadvantages: [],
      realWorldUse: 'In 2026, JIATF 401 published common test-and-evaluation criteria, announced an initial-operational-capability counter-UAS marketplace, supported testing at Joint Base Andrews, and partnered in a multicommand qualification event at Camp Guernsey.',
      content: `## Establishment and mission

The Defense Department announced Joint Interagency Task Force 401 in August 2025 as a joint and interagency organization for synchronizing counter-small-UAS efforts. The task force reports to the Deputy Secretary of Defense and is intended to align authorities and resources so capabilities reach operational users faster.

## Publicly documented work

JIATF 401's public record includes policy coordination, common test-and-evaluation criteria, a capability marketplace, joint training and qualification, and capability delivery. These activities span evidence generation, procurement pathways, training, and fielding rather than a single weapon or acquisition program.

## 2026 examples

Official releases document common test criteria, a counter-UAS marketplace at initial operational capability, testing at Joint Base Andrews, and a multicommand qualification event at Camp Guernsey.

## Analysis

The direct reporting chain and cross-department mission may reduce coordination friction, but the reviewed public sources do not prove that JIATF 401 is a single buyer, controls every counter-UAS research program, or can independently approve any effort below a fixed dollar threshold.

## Evidence limits

DroneWire does not publish the previous $50 million approval threshold, all-RDT&E consolidation, Replicator 2 absorption, 36-month sunset, or staffing assertions as confirmed facts because this packet did not locate authoritative public support for them.`,
      provenanceLabel: 'primary-source-backed',
    },
    evidence: {
      confirmedFacts: ['The August 2025 DOD release says JIATF 401 reports to the Deputy Secretary and aligns authorities and resources to deliver joint C-sUAS capabilities.', 'Official 2026 releases document common test criteria, a capability marketplace, Joint Base Andrews testing, and Camp Guernsey qualification.'],
      vendorClaims: [], analysis: ['Potential coordination benefits are labeled analysis.'],
      unresolved: ['The prior $50 million threshold, comprehensive RDT&E control, Replicator 2 absorption, 36-month sunset, staffing, and single-buyer claims are removed.'],
    },
    media: { url: 'https://d2cto119c3bgok.cloudfront.net/thumbs/photos/2603/9576416/1000w_q95.jpg', origin: 'Defense Visual Information Distribution Service', attribution: 'U.S. Air Force photo distributed by DVIDS', license: 'Public domain; verify DVIDS asset restrictions', depictedEntity: 'Counter-UAS testing at Joint Base Andrews', depictedVariant: null, storageMode: 'remote', verificationState: 'verified-topic-match', sourceUrl: 'https://www.dvidshub.net/news/561042/air-force-army-team-up-counter-drone-testing-joint-base-andrews-collaboration-with-jiatf-401' },
    sources: [
      { canonicalUrl: 'https://www.defense.gov/News/Releases/Release/Article/4289621/dod-establishes-joint-interagency-task-force-to-deliver-affordable-c-suas-capab/', title: 'DOD Establishes Joint Interagency Task Force to Deliver Affordable C-sUAS Capabilities', publisher: 'U.S. Department of Defense', sourceType: 'government', provenanceLabel: 'primary-source-backed', claimKeys: ['title', 'description', 'whatItIs', 'howItWorks', 'keyFeatures', 'content:establishment-and-mission'], evidenceSummary: 'The establishment release documents the reporting chain, joint/interagency structure, alignment role, and capability-delivery mission.' },
      { canonicalUrl: 'https://www.war.gov/News/Releases/Release/Article/4429866/the-standard-guidelines-for-test-and-evaluation-of-counter-unmanned-aircraft-sy/', title: 'The Standard Guidelines for Test and Evaluation of Counter-Unmanned Aircraft Systems Technologies', publisher: 'U.S. Department of War', sourceType: 'government', provenanceLabel: 'primary-source-backed', claimKeys: ['howItWorks', 'keyFeatures', 'realWorldUse', 'content:publicly-documented-work'], evidenceSummary: 'The release documents common test-and-evaluation criteria adopted by JIATF 401.' },
      { canonicalUrl: 'https://www.war.gov/serve-from-netstorage/News/News-Stories/Article/Article/4413359/joint-interagency-task-force-announces-counter-uas-marketplace/index.html', title: 'Joint Interagency Task Force Announces Counter-UAS Marketplace', publisher: 'U.S. Department of War', sourceType: 'government', provenanceLabel: 'primary-source-backed', claimKeys: ['howItWorks', 'keyFeatures', 'realWorldUse', 'content:publicly-documented-work'], evidenceSummary: 'The release documents the marketplace’s initial operational capability and procurement pathway.' },
      { canonicalUrl: 'https://www.dvidshub.net/news/561042/air-force-army-team-up-counter-drone-testing-joint-base-andrews-collaboration-with-jiatf-401', title: 'Air Force, Army Team Up for Counter-Drone Testing at Joint Base Andrews', publisher: 'Defense Visual Information Distribution Service', sourceType: 'government', provenanceLabel: 'primary-source-backed', claimKeys: ['realWorldUse', 'content:2026-examples', 'imageUrl'], evidenceSummary: 'Official military reporting documents JIATF 401-supported testing and supplies the retained topic-matched image.' },
      { canonicalUrl: 'https://www.dvidshub.net/video/1008641/afgsc-jiatf-401-conduct-multi-command-c-suas-qualification-camp-guernsey', title: 'AFGSC, JIATF 401 Conduct Multi-Command C-sUAS Qualification at Camp Guernsey', publisher: 'Defense Visual Information Distribution Service', sourceType: 'government', provenanceLabel: 'primary-source-backed', claimKeys: ['realWorldUse', 'content:2026-examples'], evidenceSummary: 'Official military media documents JIATF 401 participation in the multicommand C-sUAS qualification event at Camp Guernsey.' },
    ],
  },
]

export const ALL_KNOWN_CATALOG_CORRECTIONS = [...KNOWN_CATALOG_CORRECTIONS, ...KNOWN_EXPLAINER_CORRECTIONS]
