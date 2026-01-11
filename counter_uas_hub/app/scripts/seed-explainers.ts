import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const explainersData = [
  {
    title: 'Iron Dome Air Defense System',
    slug: 'iron-dome-air-defense-system',
    description: "Israel's comprehensive multi-layered air defense system designed to intercept rockets, artillery shells, and mortars.",
    category: 'systems',
    difficulty: 'beginner',
    readTime: 8,
    featured: true,
    imageUrl: 'https://www.navalnews.com/wp-content/uploads/2023/08/Iron-Dome-USMC.jpg',
    whatItIs: "The Iron Dome is Israel's mobile all-weather air defense system, designed to intercept and destroy short-range rockets and artillery shells fired from distances of 4 to 70 kilometers away.",
    howItWorks: 'The system uses radar to detect incoming projectiles, calculates their trajectory, and fires interceptor missiles to neutralize threats that pose a danger to populated areas.',
    keyFeatures: ['Multi-layered Defense', 'AI Targeting', 'High Success Rate', 'Mobile Platform'],
    advantages: ['High interception rate (>90%)', 'Selective targeting', 'Quick deployment', 'Cost-effective for high-value targets'],
    disadvantages: ['High cost per interception', 'Limited against saturation attacks', 'Dependent on early warning systems'],
    realWorldUse: 'Successfully deployed in multiple conflicts, protecting Israeli cities from thousands of rocket attacks.',
    content: `# Iron Dome Air Defense System

The Iron Dome represents one of the most successful short-range air defense systems in modern military history. Developed by Israel's Rafael Advanced Defense Systems, this mobile, all-weather air defense system has revolutionized how nations think about protecting civilian populations from rocket and artillery threats.

## System Overview

The Iron Dome is designed to intercept and destroy short-range rockets and artillery shells fired from distances of 4 to 70 kilometers away. Unlike traditional air defense systems that attempt to intercept all incoming projectiles, Iron Dome uses sophisticated radar and computational systems to determine which incoming threats actually pose a danger to populated areas or strategic assets.

## How It Works

### Detection Phase
The system begins with the EL/M-2084 radar system, which can detect incoming projectiles within seconds of launch. This multi-mission radar can track multiple targets simultaneously while determining their trajectory and impact point.

### Decision Phase
Advanced computational algorithms calculate whether each detected projectile will land in a populated area or hit strategic infrastructure. Projectiles calculated to land in open areas are ignored, making the system highly cost-effective.

### Interception Phase
For threats deemed dangerous, the system launches Tamir interceptor missiles. These missiles use electro-optical sensors and steering fins to precisely intercept targets, with detonation occurring close to the threat to minimize debris falling on protected areas.

## Key Components

**Battle Management & Weapon Control (BMC) Unit**: The brain of the system, processing radar data and making engagement decisions within seconds.

**Detection & Tracking Radar**: Provides 360-degree coverage and can simultaneously track dozens of incoming projectiles.

**Interceptor Missiles**: Each launcher contains 20 Tamir missiles, with each missile costing approximately $40,000-$50,000.

## Operational History

Since becoming operational in 2011, Iron Dome has intercepted thousands of rockets, mortars, and artillery shells. During Operation Protective Edge in 2014, the system achieved a 90% success rate against rockets fired toward populated areas.

## International Interest

The success of Iron Dome has generated significant international interest, with the United States purchasing several batteries and considering integration with American air defense networks. Other nations have expressed interest in similar capabilities.

## Limitations and Challenges

While highly effective, Iron Dome faces several challenges:
- **Cost Exchange Ratio**: Expensive interceptors against cheap rockets
- **Saturation Attacks**: Can be overwhelmed by simultaneous launches
- **Sophisticated Threats**: Less effective against precision-guided munitions
- **Range Limitations**: Only covers short to medium range threats

## Future Developments

Israel continues to enhance Iron Dome capabilities, including:
- Integration with other defense layers (David's Sling, Arrow systems)
- Improved sensors and interceptors
- Naval and mobile variants
- Counter-drone capabilities

The Iron Dome system has fundamentally changed the strategic calculus in asymmetric warfare, providing a technological solution to the challenge of protecting civilians from rocket attacks.`,
  },
  {
    title: 'Radio Frequency Jamming Technology',
    slug: 'rf-jamming-technology',
    description: 'How RF jammers disrupt drone communications, GPS navigation, and control systems to neutralize UAV threats.',
    category: 'countermeasures',
    difficulty: 'intermediate',
    readTime: 12,
    featured: true,
    imageUrl: 'https://www.l3harris.com/sites/default/files/styles/1440_x_810/public/2023-03/58142-EW-Overview-Infographic_2880x1620-smaller.png',
    whatItIs: 'RF jamming technology disrupts radio frequency communications between drones and their operators by overwhelming the targeted frequency bands with interference signals.',
    howItWorks: 'Jammers emit powerful radio signals on the same frequencies used by drones for communication and navigation, effectively blocking or disrupting these critical links.',
    keyFeatures: ['Signal Disruption', 'Multi-frequency', 'Directional Control', 'Variable Power'],
    advantages: ['Non-kinetic neutralization', 'Reusable', 'Immediate effect', 'Scalable power levels'],
    disadvantages: ['Spectrum interference', 'Limited by line-of-sight', 'Power requirements', 'Potential collateral disruption'],
    realWorldUse: 'Widely deployed by military and security forces worldwide for drone defense at airports, government facilities, and military bases.',
    content: `# Radio Frequency Jamming Technology

RF jamming represents one of the most widely deployed counter-drone technologies in use today. By disrupting the radio frequency communications that drones depend on for control and navigation, RF jammers provide a non-kinetic method for neutralizing UAV threats without causing physical damage to surrounding infrastructure.

## Technical Principles

### Frequency Disruption
RF jammers work by transmitting powerful radio signals on the same frequencies used by target drones. These interference signals effectively "jam" or block the communication links between the drone and its operator, as well as GPS navigation signals that many drones rely on for positioning and autonomous flight.

### Signal Processing
Modern jammers use sophisticated signal processing techniques to identify and target specific drone communication protocols. This allows for more precise jamming that minimizes interference with other radio systems operating in the same area.

## Types of RF Jamming Systems

### Omnidirectional Jammers
These systems broadcast interference signals in all directions, creating a protective "bubble" around the jammer. While effective for area protection, they consume more power and may interfere with friendly communications.

### Directional Jammers
More sophisticated systems that can focus jamming energy in specific directions, allowing for targeted engagement of individual threats while minimizing collateral interference.

### Smart Jammers
Advanced systems that can automatically detect drone signals and adaptively jam only the frequencies being used by detected threats, reducing interference with other systems.

## Frequency Bands

Modern counter-drone jammers typically target several key frequency bands:

**2.4 GHz ISM Band**: Used by many consumer drones for control communications
**5.8 GHz Band**: Common for video transmission and some control links
**GPS L1 (1.575 GHz)**: Primary civilian GPS frequency
**GPS L2 (1.227 GHz)**: Military and precision GPS applications
**433/915 MHz**: Used by some drone systems and RC controllers

## Deployment Scenarios

### Fixed Site Protection
Permanent installations at critical facilities like airports, power plants, and government buildings use high-power jammers to create persistent protection zones.

### Mobile Operations
Vehicle-mounted and portable jammers provide tactical flexibility for military and law enforcement operations, allowing rapid deployment in response to emerging threats.

### Personal Protection
Smaller handheld jammers offer protection for VIPs and small-scale security operations, though with limited range and effectiveness.

## Operational Effectiveness

The effectiveness of RF jamming depends on several factors:
- **Power Output**: Higher power generally equals greater range and effectiveness
- **Frequency Coverage**: Broader spectrum coverage increases probability of success
- **Environmental Factors**: Urban environments may limit effectiveness due to signal reflection and obstruction
- **Drone Technology**: More sophisticated drones may have jamming-resistant features

## Limitations and Challenges

### Spectrum Management
RF jammers can interfere with legitimate radio systems, including emergency communications, air traffic control, and cellular networks. Careful frequency planning and coordination with spectrum regulators is essential.

### Adaptive Threats
Advanced drones may employ frequency hopping, encryption, or other techniques to resist jamming. The ongoing technological arms race requires continuous jamming system updates.

### Legal Considerations
Use of RF jammers is heavily regulated in most countries, with restrictions on who can operate them and in what circumstances. Unauthorized use can result in significant legal penalties.

### Power Requirements
Effective jamming, especially at longer ranges, requires substantial electrical power, limiting deployment options and operational duration for portable systems.

## Future Developments

The evolution of RF jamming technology continues to advance:
- **AI-Enhanced Detection**: Machine learning algorithms for better threat identification
- **Adaptive Jamming**: Systems that can modify their approach in real-time based on target behavior
- **Miniaturization**: Smaller, more portable systems with improved battery life
- **Multi-Domain Integration**: Combining RF jamming with other counter-drone technologies

RF jamming remains a cornerstone of modern counter-drone defense, offering a balance of effectiveness, reusability, and non-destructive neutralization that makes it suitable for a wide range of operational scenarios.`,
  },
  {
    title: 'Drone Swarm Attack Tactics',
    slug: 'drone-swarm-attack-tactics',
    description: 'Understanding coordinated UAV attacks, swarm intelligence, and their implications for modern warfare.',
    category: 'threats',
    difficulty: 'advanced',
    readTime: 15,
    featured: false,
    imageUrl: 'https://deweb-519a7.b-cdn.net/post-images/6d174962-0c18-4bc8-abe6-1852765d4ed4.webp',
    whatItIs: 'Drone swarm attacks involve coordinating multiple unmanned aerial vehicles to overwhelm traditional air defense systems through sheer numbers and synchronized tactics.',
    howItWorks: 'Swarm attacks use distributed AI and communication protocols to coordinate multiple drones, allowing them to adapt in real-time, share intelligence, and execute complex multi-vector attacks.',
    keyFeatures: ['Coordinated Attack', 'AI Swarm Logic', 'Overwhelming Defense', 'Adaptive Behavior'],
    advantages: ['Overwhelms point defenses', 'Distributed resilience', 'Cost-effective scaling', 'Adaptive tactics'],
    disadvantages: ['Complex coordination required', 'Communication vulnerabilities', 'Limited individual payload', 'Regulatory restrictions'],
    realWorldUse: 'Observed in conflicts in Ukraine, Middle East, and demonstrated in military exercises worldwide, showing potential to revolutionize modern warfare.',
    content: `# Drone Swarm Attack Tactics

The emergence of drone swarm technology represents one of the most significant tactical developments in modern warfare. By coordinating dozens or hundreds of unmanned aerial vehicles, military forces can execute complex, multi-vector attacks that can overwhelm traditional air defense systems and fundamentally change the nature of aerial combat.

## Tactical Principles

### Distributed Operations
Unlike traditional air attacks that rely on a few high-value platforms, drone swarms distribute risk across many low-cost units. The loss of individual drones does not compromise the overall mission, making swarms inherently resilient to defensive countermeasures.

### Overwhelming Defense
Swarm tactics are designed to saturate enemy air defenses by presenting more targets than can be effectively engaged. This numerical superiority forces defenders to make difficult prioritization decisions and often allows portions of the swarm to reach their objectives.

### Adaptive Coordination
Modern swarm algorithms enable drones to adapt their tactics in real-time based on battlefield conditions, enemy responses, and mission objectives. This adaptive capability makes swarms unpredictable and difficult to counter with static defensive measures.

## Attack Patterns

### Wave Attacks
Sequential waves of drones approach targets from different directions and altitudes, forcing defenders to engage multiple threat vectors simultaneously while preserving swarm strength for follow-on attacks.

### Saturation Attacks
Simultaneous launch of maximum available drones to overwhelm point defenses through sheer numbers, accepting higher individual losses in exchange for mission success.

### Decoy and Strike
Mixed formations using cheaper decoy drones to mask the approach of more capable strike platforms, forcing defenders to reveal positions and expend interceptors on false targets.

### Swarming Convergence
Drones approach from widely dispersed locations, converging on targets at predetermined times to concentrate effects while minimizing exposure to area defenses.

## Technological Enablers

### Artificial Intelligence
Machine learning algorithms enable swarm coordination without constant human control, allowing rapid decision-making and adaptive responses to changing battlefield conditions.

### Communication Networks
Mesh networking protocols allow drones to share information and coordinate actions even when individual units are jammed or destroyed, maintaining swarm cohesion.

### Miniaturization
Advances in electronics, sensors, and propulsion have enabled effective weapons systems to be packaged in increasingly small and inexpensive platforms.

### GPS-Denied Navigation
Modern swarms incorporate multiple navigation systems including visual odometry, terrain matching, and inertial guidance to operate in GPS-denied environments.

## Counter-Swarm Challenges

### Detection Difficulties
Small individual radar cross-sections and low flight altitudes make swarm detection challenging for traditional air defense radars.

### Engagement Economics
The cost disparity between expensive interceptor missiles and cheap drones creates unfavorable engagement economics for defenders.

### Multiple Vector Defense
Defending against attacks from multiple directions simultaneously requires distributed defensive systems and careful coordination.

### Electronic Warfare Limitations
While jamming can disrupt some swarm communications, distributed mesh networks and autonomous operation modes limit EW effectiveness.

## Future Developments

### Heterogeneous Swarms
Future swarms will likely combine different drone types with specialized roles including ISR, strike, decoy, and electronic warfare platforms operating in coordination.

### Artificial Intelligence Evolution
More sophisticated AI algorithms will enable even more complex coordination and adaptive behavior, potentially including real-time tactical innovation.

The proliferation of drone swarm technology represents a fundamental shift in military tactics that will require new approaches to both offensive operations and defensive planning.`,
  },
  {
    title: 'Laser Weapon Systems (LAWS)',
    slug: 'laser-weapon-systems',
    description: 'High-energy laser systems for counter-UAS applications, including power requirements and effectiveness.',
    category: 'countermeasures',
    difficulty: 'intermediate',
    readTime: 10,
    featured: false,
    imageUrl: 'https://www.lockheedmartin.com/content/dam/lockheed-martin/rms/photo/directed-energy/DE-Hero-Morphius.png',
    whatItIs: 'Laser Weapon Systems (LAWS) are directed-energy weapons that use focused light beams to disable or destroy targets, offering precise, cost-effective counter-UAS capabilities.',
    howItWorks: 'High-energy lasers generate intense focused light beams that heat target materials to the point of structural failure, causing drones to crash or malfunction.',
    keyFeatures: ['Directed Energy', 'Precision Targeting', 'Low Cost Per Shot', 'Silent Operation'],
    advantages: ['Near-instantaneous engagement', 'Unlimited magazine depth', 'Precise targeting', 'Minimal collateral damage'],
    disadvantages: ['High power requirements', 'Weather dependent', 'Limited range', 'Expensive initial setup'],
    realWorldUse: 'Deployed by military forces for base protection, tested on naval vessels, and increasingly used for airport security and critical infrastructure protection.',
    content: `# Laser Weapon Systems (LAWS)

Directed-energy weapons represent the cutting edge of counter-drone technology, offering unprecedented precision and cost-effectiveness for neutralizing UAV threats. High-Energy Laser (HEL) systems have evolved from science fiction concepts to operational reality.

## Technical Foundation

### Laser Physics
Laser weapons operate by concentrating photons into a highly focused, coherent beam of light. When this concentrated energy strikes a target, it rapidly heats the material, causing thermal stress, melting, or combustion that leads to structural failure.

### Power Generation
Modern tactical laser systems typically operate in the 10-100 kilowatt range, with strategic systems reaching megawatt power levels. These systems require substantial electrical generation and cooling infrastructure.

### Beam Control
Sophisticated adaptive optics compensate for atmospheric distortion, maintaining beam focus and intensity over operational ranges.

## Counter-Drone Effectiveness

Drones present ideal targets for laser weapons due to their:
- Lightweight construction materials
- Exposed critical components
- Limited defensive capabilities
- Predictable flight patterns

## Advantages and Limitations

### Strategic Advantages
- **Cost Per Shot**: Extremely low marginal cost after initial investment
- **Speed of Light Engagement**: Near-instantaneous target engagement
- **Precision**: Surgical targeting with minimal collateral damage
- **Deep Magazine**: No ammunition constraints beyond electrical power

### Technical Limitations
- **Atmospheric Attenuation**: Weather significantly impacts effectiveness
- **Power Requirements**: Substantial electrical generation and cooling needs
- **Range Limitations**: Current systems limited to line-of-sight engagements

Laser weapon systems represent a transformational technology for counter-drone operations, offering unique advantages that complement traditional kinetic and electronic warfare approaches.`,
  },
  {
    title: 'Counter-UAS Policy Framework',
    slug: 'counter-uas-policy-framework',
    description: 'Legal and policy considerations for implementing counter-drone measures in civilian and military contexts.',
    category: 'policy',
    difficulty: 'beginner',
    readTime: 7,
    featured: false,
    imageUrl: 'https://i2.wp.com/opiniojuris.org/wp-content/uploads/scales-justice-wooden-gavel-earth-globe-d-rendering-isolated-white-background-183332238.jpg',
    whatItIs: 'The Counter-UAS Policy Framework encompasses the legal, regulatory, and operational guidelines governing the deployment and use of counter-drone technologies.',
    howItWorks: 'Policy frameworks establish clear authorities, procedures, and limitations for counter-UAS operations while balancing security needs with civil liberties and airspace management.',
    keyFeatures: ['Legal Framework', 'Civilian Protection', 'International Law', 'Operational Guidelines'],
    advantages: ['Clear operational authority', 'Legal protection', 'Standardized procedures', 'International coordination'],
    disadvantages: ['Complex approval processes', 'Jurisdictional challenges', 'Technology lag', 'Enforcement difficulties'],
    realWorldUse: 'Implemented by governments worldwide to regulate counter-drone operations at airports, government facilities, and public events while protecting civilian airspace rights.',
    content: `# Counter-UAS Policy Framework

The rapid proliferation of unmanned aircraft systems has created an urgent need for comprehensive policy frameworks that address the legal, regulatory, and operational challenges of counter-drone operations.

## Legal Foundation

### Constitutional Considerations
Counter-UAS operations must respect constitutional protections including:
- **Fourth Amendment Rights**: Protection against unreasonable searches and seizures
- **Due Process**: Fair procedures for drone seizure and owner notification
- **Property Rights**: Recognition of legitimate drone ownership and operation
- **Privacy Protection**: Safeguarding personal information collected during operations

### Statutory Authority
Legislative frameworks typically address:
- **Federal Agency Powers**: Defining which agencies have counter-UAS authority
- **State and Local Authority**: Clarifying jurisdictional boundaries and limitations
- **Criminal Penalties**: Establishing sanctions for malicious drone use
- **Civil Liability**: Protecting authorized counter-UAS operators from lawsuits

## Operational Authorities

### Federal Level
National governments typically reserve certain counter-UAS authorities:
- **Critical Infrastructure Protection**: Defense of nuclear facilities, major airports
- **Military Operations**: Force protection and combat zone operations
- **Border Security**: Protection of international boundaries

### State and Local Level
Regional authorities often address:
- **Public Event Security**: Protection of sports events, concerts, and gatherings
- **Government Facilities**: State and municipal building security
- **Emergency Response**: Natural disasters and crisis situations

## Implementation Best Practices

### Stakeholder Engagement
Effective policy development requires:
- **Industry Consultation**: Input from drone manufacturers and operators
- **Civil Society**: Privacy advocates and civil liberties organizations
- **Technical Experts**: Academic and industry expertise
- **Public Participation**: Community input and feedback

Counter-UAS policy frameworks must evolve continuously to address emerging technologies and changing threat environments.`,
  },
  {
    title: 'Patriot Missile Defense System',
    slug: 'patriot-missile-defense',
    description: 'Advanced surface-to-air missile system capabilities against aircraft, cruise missiles, and ballistic missiles.',
    category: 'systems',
    difficulty: 'intermediate',
    readTime: 11,
    featured: true,
    imageUrl: 'https://cloudfront-us-east-2.images.arcpublishing.com/reuters/WXJDS4WZEVN4DHF3PB7BBLIOF4.jpg',
    whatItIs: 'The Patriot (Phased Array Tracking Radar to Intercept of Target) is a mobile surface-to-air missile system providing area defense against aircraft, cruise missiles, and ballistic missiles.',
    howItWorks: 'The system uses phased-array radar for detection and tracking, with command-guided interceptor missiles that use semi-active homing for precise target engagement.',
    keyFeatures: ['Long Range', 'Multi-Target', 'Mobile Platform', 'Phased Array Radar'],
    advantages: ['Proven combat effectiveness', 'Multi-threat capability', 'Mobile deployment', 'NATO interoperability'],
    disadvantages: ['High cost per intercept', 'Complex logistics', 'Large radar signature', 'Limited against maneuvering targets'],
    realWorldUse: 'Deployed by multiple NATO allies and partners, extensively used in Middle East conflicts, and continuously upgraded for modern threats including hypersonic weapons.',
    content: `# Patriot Missile Defense System

The MIM-104 Patriot represents one of the most successful and widely deployed air defense systems in modern military history.

## System Overview

### Historical Development
The Patriot system was developed by Raytheon in the 1970s as a replacement for the Nike Hercules air defense system. Its first major combat deployment occurred during the 1991 Gulf War.

### Current Configuration
Modern Patriot systems integrate multiple subsystems:
- **AN/MPQ-53/65 Radar Set**: Phased-array radar for detection, tracking, and guidance
- **AN/MSQ-104 Engagement Control Station**: Command and control center
- **M901 Launching Station**: Mobile platform carrying up to four interceptor missiles

## Technical Capabilities

### Radar System
- **Detection Range**: Up to 160 kilometers against aircraft targets
- **Tracking Capability**: Simultaneous tracking of over 100 targets
- **Electronic Counter-Countermeasures**: Resistance to jamming and deception

### Missile Interceptors
**PAC-2**: Range up to 160km against aircraft, 20km against ballistic missiles
**PAC-3**: Enhanced point defense with hit-to-kill technology
**PAC-3 MSE**: Extended range and improved performance

## Combat Effectiveness

Patriot systems have engaged targets in multiple conflicts:
- **Gulf War (1991)**: Initial ballistic missile defense operations
- **Iraq War (2003)**: Protection of coalition forces
- **Saudi Arabia (2017-present)**: Defense against Houthi missile attacks
- **Ukraine (2023)**: Successful intercepts of advanced Russian missiles

The Patriot missile defense system continues to evolve as a cornerstone of allied air defense.`,
  },
]

async function seedExplainers() {
  console.log('Starting explainer seeding...')

  for (const explainer of explainersData) {
    const existing = await prisma.explainer.findUnique({
      where: { slug: explainer.slug },
    })

    if (existing) {
      console.log(`Explainer "${explainer.title}" already exists, skipping...`)
      continue
    }

    await prisma.explainer.create({
      data: explainer,
    })
    console.log(`Created explainer: ${explainer.title}`)
  }

  console.log('Explainer seeding complete!')
}

seedExplainers()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
