import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const explainers = [
  {
    title: 'Drone Classification — Groups 1 through 5',
    slug: 'drone-classification-groups-1-through-5',
    description: 'How NATO and the DoD categorize unmanned aircraft by weight, speed, and altitude — and why knowing your Groups matters for counter-drone planning.',
    category: 'concepts',
    difficulty: 'beginner',
    readTime: 10,
    featured: true,
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2506/9107830/1000w_q95.jpg',
    whatItIs: "The NATO/DoD Group 1-5 classification system categorizes unmanned aircraft systems (UAS) by maximum takeoff weight, operating altitude, and airspeed. It's the universal shorthand used by military planners, C-UAS operators, and defense industry to describe what kind of drone they're facing or defending against.",
    howItWorks: 'Each Group is defined by three parameters: weight (from under 20 lbs for Group 1 to over 1,320 lbs for Group 5), altitude (from under 1,200 ft to over 18,000 ft), and speed (from under 100 knots to over 250 knots). As you go up in Groups, the drones get bigger, faster, fly higher, and require more sophisticated detection and defeat mechanisms.',
    keyFeatures: ['Five-tier classification system', 'Based on weight, altitude, and speed', 'Used across NATO and allied forces', 'Determines appropriate countermeasures'],
    advantages: ['Universal language across forces', 'Directly maps to C-UAS capability requirements', 'Simple to understand and apply', 'Drives acquisition and planning decisions'],
    disadvantages: ['Blurred lines between Groups 2 and 3', 'Does not account for autonomy level', 'Commercial drones increasingly straddle categories', 'Does not address swarming behavior'],
    realWorldUse: 'Every C-UAS system in the DoD inventory is evaluated against which Group threats it can engage. A DroneDefender handheld jammer works against Group 1 and some Group 2. A Coyote Block 2 interceptor targets Group 2-3. Patriot batteries defend against Group 4-5. The Group classification is the first question any C-UAS planner asks when assessing a threat.',
    content: `# Drone Classification — Groups 1 through 5

Every conversation about counter-drone operations starts with the same question: "What Group are we talking about?" Understanding the NATO/DoD Group classification system is essential for anyone working in C-UAS, because the Group determines everything — what sensors can detect it, what effectors can defeat it, and how much time you have to react.

## Where the Groups Came From

The classification system originated from NATO Standardization Agreement (STANAG) 4670, which defined unmanned aircraft categories for airworthiness and interoperability purposes. The U.S. DoD adopted the framework and expanded it into the five-tier Group system used today. While originally intended for organizing friendly UAS operations, the system became equally useful for categorizing threats — because a Shahed-136 and a ScanEagle may have different origins, but they occupy similar Group categories with similar countermeasure requirements.

## The Five Groups, Defined

### Group 1 — Micro / Mini UAS

**Weight:** Up to 20 lbs (9 kg)
**Altitude:** Below 1,200 ft AGL
**Airspeed:** Under 100 knots

These are the drones that dominate the modern battlefield and create the hardest C-UAS problems. DJI Mavics, FPV racing drones converted to strike platforms, hand-launched ISR platforms like the RQ-11 Raven. They are small enough to carry in a backpack, cheap enough to be expendable, and their tiny radar cross-section makes them difficult to detect at range.

In Ukraine, Group 1 FPV drones carrying RPG warheads have destroyed more armored vehicles than any other threat. A soldier can carry a dozen in a rucksack. That changes the math entirely — when your adversary can put eyes and explosives on target for approximately $500 per unit, the cost-exchange ratio against traditional air defense becomes untenable.

### Group 2 — Small UAS

**Weight:** 21-55 lbs (10-25 kg)
**Altitude:** Below 3,500 ft AGL
**Airspeed:** Under 250 knots

The ScanEagle and its peers live here. These are catapult-launched, runway-independent platforms that provide persistent ISR for hours at a time. Group 2 systems are still small enough to evade many traditional air defense radars but large enough to carry meaningful sensor payloads.

From a C-UAS perspective, Group 2 represents the "persistent stare" threat — a drone that can orbit your position for 12+ hours, feeding real-time intelligence to artillery or strike coordination. Detecting and tracking a Group 2 at range requires purpose-built counter-drone radar, not the air search radar designed for fighter-sized targets.

### Group 3 — Medium Tactical UAS

**Weight:** 55-1,320 lbs (25-600 kg)
**Altitude:** Below 18,000 ft MSL
**Airspeed:** Under 250 knots

This is where things get serious. The RQ-7 Shadow, the Turkish Bayraktar TB2, and — critically — the Iranian Shahed-136 loitering munition all fall into Group 3. These platforms carry substantial payloads, operate at altitudes that make MANPADS engagement difficult, and have the range to strike targets hundreds of kilometers from their launch point.

Group 3 is the hardest category for C-UAS planners. They are too big for handheld jammers and too small for many traditional air defense systems to track reliably. The Shahed-136 in particular has proven this — it is a Group 3 drone that costs around $20,000 to produce but requires missiles costing hundreds of thousands of dollars to intercept. Ukraine has shown that massed Group 3 attacks can exhaust even sophisticated air defense networks through sheer volume.

### Group 4 — Medium Altitude Long Endurance (MALE)

**Weight:** Over 1,320 lbs (600+ kg)
**Altitude:** Below 18,000 ft MSL
**Airspeed:** Any

The MQ-1 Predator, MQ-9 Reaper, and their international equivalents define Group 4. These are full-scale aircraft — capable of carrying Hellfire missiles, operating for 24+ hours, and requiring dedicated runways and ground control stations. They show up clearly on conventional air defense radar and can be engaged by systems like Patriot, NASAMS, or fighter aircraft.

From a C-UAS perspective, Group 4 is the "known problem" — they are detectable, trackable, and engageable with existing air defense architectures. The challenge is less about detection and more about the rules of engagement and the political-military context in which these platforms operate.

### Group 5 — High Altitude Long Endurance (HALE)

**Weight:** Over 1,320 lbs (600+ kg)
**Altitude:** Above 18,000 ft MSL
**Airspeed:** Any

The RQ-4 Global Hawk and its strategic ISR peers occupy Group 5. These operate at airliner altitudes and are essentially indistinguishable from manned aircraft on radar. They are defended by the same air defense systems that protect against manned aviation threats.

## Why Groups Matter for C-UAS

The Group system is not just taxonomy — it directly drives capability requirements:

**Sensors.** Detecting a Group 1 FPV drone requires specialized radar with high update rates and the signal processing to distinguish a 500g quadcopter from a bird. Detecting a Group 4 Reaper uses the same radar you would use for a MiG-29. The sensor problem space changes completely across Groups.

**Effectors.** A Group 1 drone can be defeated by RF jamming, directed energy, or even a well-aimed shotgun. A Group 3 Shahed requires radar-guided guns or missile interceptors. A Group 5 Global Hawk needs a full-scale air defense engagement. The cost per engagement scales dramatically.

**Timeline.** Group 1 threats might give you 30 seconds from detection to impact. Group 3 loitering munitions might give you minutes. Group 4-5 aircraft operations play out over hours. Your entire kill chain architecture depends on which timeline you are operating against.

**Cost Exchange.** This is the central problem C-UAS faces. A Group 1 FPV costs $500. A Group 3 Shahed costs $20,000. Intercepting either with a $100,000+ missile is unsustainable at scale. This is why directed energy weapons and electronic warfare matter — they change the cost equation by making the marginal cost per engagement approach zero.

## The Gray Areas

The Groups are not perfect. The line between Group 2 and Group 3 is fuzzy, and some commercial platforms straddle categories depending on configuration. A heavily modified DJI Matrice might push into Group 2 weight territory. A small loitering munition might meet Group 3 range requirements while keeping Group 2 weight.

More importantly, the Groups do not capture autonomy — arguably the most important variable in modern drone threats. A GPS-guided autonomous Group 3 drone is fundamentally different from a manually-piloted Group 3 drone, even if they share weight and altitude characteristics. The classification system is evolving, but for now, it remains the essential starting point for any C-UAS conversation.`,
  },
  {
    title: 'C-UAS Command and Control — The Brain of the Operation',
    slug: 'cuas-command-and-control-platforms',
    description: 'How C2 platforms like FAAD C2, SkyTracker, and SAPIENT tie sensors and effectors together into a unified counter-drone system — and why "open architecture" is not just a buzzword.',
    category: 'concepts',
    difficulty: 'intermediate',
    readTime: 12,
    featured: true,
    imageUrl: 'https://www.navalnews.com/wp-content/uploads/2023/08/Iron-Dome-USMC.jpg',
    whatItIs: 'C-UAS Command and Control (C2) platforms are the software and hardware systems that fuse data from multiple sensors — radar, RF, EO/IR, acoustic — into a single integrated picture, then route threats to the appropriate effectors. Think of it as the brain that connects the eyes and the fists.',
    howItWorks: "Multiple sensors detect drone signatures independently. The C2 platform ingests all these feeds, correlates them into unified tracks — ensuring the same drone is not shown as five separate targets — assesses threat priority, and presents the operator with engagement options — all in seconds, using standardized data formats that allow different vendors' equipment to interoperate.",
    keyFeatures: ['Multi-sensor fusion', 'Standardized data interfaces', 'Automated threat prioritization', 'Vendor-agnostic architecture'],
    advantages: ['Single operator can manage multiple sensors', 'Reduces cognitive overload during swarms', 'Enables best-of-breed sensor/effector mixing', 'Records data for after-action analysis'],
    disadvantages: ['Integration complexity between vendors', 'Latency can be fatal at short ranges', 'Standardization remains incomplete', 'Cyber vulnerability at the integration layer'],
    realWorldUse: 'FAAD C2 (Forward Area Air Defense Command and Control) is the DoD primary C-UAS C2 platform, deployed at bases worldwide. It integrates sensors from multiple vendors and routes threats to everything from Coyote interceptors to electronic warfare systems, all through a single operator interface.',
    content: `# C-UAS Command and Control — The Brain of the Operation

A radar finds a drone. An RF sensor detects its control signal. A camera confirms it visually. Three different systems, three different vendors, three different data formats. Without a Command and Control platform to fuse these inputs, you have three confused operators looking at three partial pictures while the drone flies through your defenses.

C2 is the least glamorous part of counter-drone operations, but it is the part that determines whether the expensive sensors and effectors actually work together or just create expensive confusion.

## The Core Problem: Sensor Fragmentation

No single sensor can reliably detect all drone threats. Radar struggles with small, slow-moving objects near the ground. RF sensors cannot detect autonomous drones that are not transmitting. EO/IR cameras are degraded by weather and darkness. Acoustic sensors have limited range.

The solution is layering multiple sensor types — but that creates a new problem. If five sensors each detect the same drone, you need to know it is one drone, not five. If each sensor speaks a different data language, you cannot correlate their inputs. If each effector requires a different engagement interface, your operator cannot respond fast enough.

C2 platforms solve this by serving as the universal translator and traffic controller at the center of the C-UAS system.

## How C2 Fusion Works

### Ingest

The C2 platform connects to every sensor in the architecture — radar via ASTERIX or proprietary protocols, RF sensors via their API, cameras via video streams, ADS-B receivers for cooperative aircraft tracking. Each sensor feed arrives in its own format, at its own update rate, with its own coordinate system.

### Correlate

This is the hard part. The C2 platform must determine that the radar contact at bearing 045, range 3.2 km is the same object as the RF detection at frequency 2.4 GHz and the visual track in camera number 3. This requires sophisticated algorithms — Kalman filters for motion prediction, coordinate transforms to align different reference frames, and temporal synchronization to match detections that arrive at slightly different times.

Poor correlation creates "ghost tracks" — phantom targets that exist only because the system failed to merge sensor inputs. In a swarm attack scenario, ghost tracks can make 10 drones look like 30, overwhelming the operator with false contacts.

### Prioritize

Once tracks are fused, the C2 platform assesses threat priority. A drone heading directly toward the flight line at high speed ranks higher than one orbiting at the perimeter. A drone exhibiting hostile behavior patterns ranks higher than one that might be a hobbyist. The system assigns threat scores that determine which targets the operator sees first and which get engagement priority.

### Engage

The C2 platform presents the operator with engagement options based on the threat characteristics, available effectors, and rules of engagement. The operator selects the response — jam, intercept, or monitor — and the C2 platform routes the command to the appropriate system, whether that is an electronic warfare system, a kinetic interceptor, or a directed energy weapon.

## Key C2 Platforms

### FAAD C2

Forward Area Air Defense Command and Control is the DoD workhorse C-UAS C2 platform. Originally developed for short-range air defense, FAAD C2 has been adapted for counter-drone operations and now integrates sensors and effectors from dozens of vendors. It provides a single operator interface for the entire C-UAS kill chain and is deployed at U.S. bases worldwide.

### SAPIENT

The UK SAPIENT (Sensing for Asset Protection with Integrated Electronic Networked Technology) standard takes a different approach — rather than building a single C2 platform, it defines the interfaces that let different vendors' systems interoperate. SAPIENT-compliant sensors and effectors can plug into any SAPIENT-compliant C2 system, creating a true open architecture marketplace.

### SkyTracker

Dedrone SkyTracker C2 platform focuses on the civilian and critical infrastructure market. It integrates Dedrone own RF sensors with third-party radar and camera systems, providing a C2 solution for airports, prisons, and stadiums where military-grade FAAD C2 would be overkill.

## Why Open Architecture Matters

"Open architecture" is the most abused phrase in defense acquisition, but in C-UAS C2 it means something specific and important:

**Vendor lock-in is a vulnerability.** If your C2 platform only works with one vendor sensors, you cannot take advantage of better technology from other companies. If that vendor goes out of business or discontinues a product, your entire C-UAS system needs replacement.

**Threats evolve faster than contracts.** The drone threat changes every six months — new frequencies, new autonomy, new tactics. An open architecture C2 platform lets you integrate new sensors as they become available without rebuilding the entire system.

**Competition drives down costs.** When sensors and effectors compete on performance rather than platform compatibility, the government gets better capabilities at lower prices.

The SAPIENT standard represents the most mature effort to create true C-UAS interoperability. The U.S. is moving in the same direction with the JIATF-401 mandate for modular open systems approaches, but the integration challenge remains substantial.

## The Operator Experience

The best C2 platform is the one that lets a tired operator at 3 AM make the right decision in three seconds. That means:

- **Decluttered display.** Only show what matters. A dozen sensor feeds merged into clean tracks, not a dozen separate windows.
- **Automated recommendations.** The system suggests the best engagement option based on threat characteristics and available resources.
- **Graceful degradation.** When a sensor drops offline or a communications link fails, the system keeps working with what remains.
- **Record everything.** Every detection, track, and engagement decision is recorded for after-action analysis and — when things go wrong — accountability.

C-UAS C2 is the difference between a collection of expensive sensors and a functioning air defense system. It is not the flashy part, but it is the part that makes everything else work.`,
  },
  {
    title: 'Mobile and Dismounted C-UAS — Defense That Moves With the Fight',
    slug: 'mobile-dismounted-cuas-defense',
    description: 'How vehicle-mounted and man-packable counter-drone systems protect maneuver forces on the move — M-SHORAD, MadIS, and the unique challenges of countering drones from a moving platform.',
    category: 'systems',
    difficulty: 'intermediate',
    readTime: 11,
    featured: false,
    imageUrl: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2308/7984704/1000w_q95.jpg',
    whatItIs: 'Mobile C-UAS systems are vehicle-mounted or man-portable counter-drone solutions designed to protect maneuver forces on the move, rather than fixed sites like air bases. They include short-range air defense vehicles (M-SHORAD), Marine Corps integrated systems (MadIS), and dismounted electronic warfare kits carried by infantry.',
    howItWorks: 'Mobile systems integrate detection sensors and effectors onto tactical vehicles or into man-packable configurations. They use compact radars, RF detectors, and EO/IR cameras optimized for size and power constraints, paired with vehicle-mounted guns, missiles, or EW systems — all designed to operate while moving, with crew served by the vehicle own soldiers or Marines.',
    keyFeatures: ['Vehicle-mounted or man-portable', 'On-the-move capability', 'Integrated sensors and effectors', 'Organic to maneuver units'],
    advantages: ['Protects forces where fixed systems cannot reach', 'Reduces dependence on base defense laydown', 'Operates at the tactical edge', 'Organic capability — no coordination delays'],
    disadvantages: ['Power and weight constraints limit capability', 'On-the-move tracking is harder than static', 'Crew training burden on already-loaded units', 'Limited magazine depth for kinetic effectors'],
    realWorldUse: 'M-SHORAD Strykers are deployed with U.S. Army units in Europe, providing mobile counter-drone and short-range air defense for maneuver brigades. The Marine Corps MadIS has been deployed on JLTVs with Marine Expeditionary Units, while dismounted DroneDefender and Dronebuster systems are carried at the squad level in multiple theaters.',
    content: `# Mobile and Dismounted C-UAS — Defense That Moves With the Fight

Fixed-site C-UAS protects air bases, headquarters, and critical infrastructure. But maneuver forces operating beyond the wire cannot bring the base defense suite with them. They need counter-drone protection that moves at their speed, operates on their vehicles, and does not require a dedicated C-UAS platoon to employ.

Mobile C-UAS is the answer — and it is one of the hardest problems in the counter-drone enterprise.

## Why Mobile C-UAS Is Different

Protecting a fixed site from drones is architecturally straightforward, if not technically easy. You have permanent power infrastructure. You can position sensors at optimal locations and calibrate them precisely. Your operators work in climate-controlled shelters with multiple displays. Your rules of engagement for airspace above your own base are clear.

Now take that problem and put it on a Stryker moving at 45 mph through contested terrain.

**Power constraints.** A fixed-site radar can draw from the base power grid. A vehicle-mounted radar draws from the vehicle alternator, competing with communications gear, electronic warfare systems, and the vehicle own systems. Everything must be sized for the available power budget.

**Sensor placement.** Fixed sites can position sensors on towers with clear 360-degree coverage. Vehicle-mounted sensors are limited to what fits on the vehicle, in positions that may be blocked by the vehicle own structure, antennas, or other equipment.

**On-the-move tracking.** A static radar filters out ground clutter through careful siting and calibration. A moving radar must filter out the motion of its own platform, the vibration of the vehicle, and terrain features passing through the field of view — while still detecting small, slow drones against cluttered backgrounds.

**Operator workload.** The fixed-site C-UAS operator focuses on one mission. The vehicle crew is also navigating, communicating, maintaining security, and performing their primary combat function. The C-UAS interface must be simple enough to use under combat stress without becoming a full-time task.

## Major Mobile C-UAS Systems

### M-SHORAD (Maneuver Short-Range Air Defense)

The U.S. Army M-SHORAD program puts a complete short-range air defense and counter-drone suite on a Stryker A1 vehicle. The system includes:

- **MHR radar:** A multi-mission hemispheric radar providing 360-degree detection of Group 1-3 UAS, rotary-wing aircraft, and fixed-wing threats
- **XM914 30mm cannon:** Fires proximity-fuzed ammunition effective against drone targets
- **Stinger missile pods:** For longer-range engagement of larger threats
- **Coyote interceptor integration:** On some variants, the ability to launch Coyote Block 2 kinetic interceptors
- **Electronic warfare suite:** For non-kinetic defeat of drone control links and GPS

M-SHORAD is organic to maneuver brigades, meaning it moves with the formation rather than being attached from a separate air defense unit. This is a fundamental shift — air defense as an organic maneuver capability rather than a separate branch asset.

### MadIS (Marine Air Defense Integrated System)

The Marine Corps MadIS takes a modular approach, mounting different C-UAS configurations on JLTVs and MRZR all-terrain vehicles:

- **MadIS Increment 1:** On JLTV, pairing the RADA MHR radar with EW systems and a 30mm cannon
- **Light-MadIS:** On MRZR, providing a highly mobile but capability-limited option for expeditionary operations
- **Dismounted MadIS:** Man-portable components that can be carried by Marines operating on foot

The Marine Corps emphasizes expeditionary capability — systems light enough to come off landing craft and operate in austere conditions without established infrastructure.

### Dismounted Systems

At the smallest scale, individual soldiers and Marines carry handheld C-UAS systems:

- **DroneDefender:** A rifle-shaped RF jammer that disrupts drone control and GPS signals at close range
- **Dronebuster:** A compact handheld jammer with selectable frequency bands
- **Smart Shooter SMASH:** An optics system that mounts on standard rifles, using AI to calculate precise aim points against small drone targets

These systems give squad-level forces organic counter-drone capability without adding significant weight or requiring specialized operators. They are limited in range and capability but provide a critical last line of defense.

## The Tactical Reality

Mobile C-UAS changes how maneuver forces think about air defense:

**It is no longer a separate echelon.** When every Stryker company has organic M-SHORAD, counter-drone becomes a company-level task rather than something coordinated at brigade or division. This speeds response time but requires every maneuver leader to understand C-UAS employment.

**Coverage is never complete.** A few M-SHORAD vehicles cannot provide umbrella coverage for an entire brigade. Mobile C-UAS provides point defense for key assets rather than area defense. Commanders must decide what to protect and accept risk elsewhere.

**The cost equation shifts.** Every Stinger missile fired at a $500 drone is a loss for the defense. Mobile C-UAS relies increasingly on guns and electronic warfare because they offer better cost-exchange ratios. Directed energy weapons are the next frontier — providing unlimited magazine depth at near-zero marginal cost per engagement.

## Future Direction

The mobile C-UAS problem is evolving rapidly:

- **Directed energy integration:** The Army DE-MSHORAD prototype puts a 50kW laser on a Stryker, providing silent, invisible, cost-free engagements
- **Autonomous C-UAS vehicles:** Unmanned ground vehicles carrying C-UAS sensors could provide distributed detection without risking crews
- **Networked fires:** Mobile sensors cueing effectors on other platforms across the formation — your radar finds it, someone else gun kills it
- **AI-assisted target recognition:** Reducing operator workload by automating the detect-track-identify portion of the kill chain

Mobile C-UAS is the hardest variant of the counter-drone problem, but it is also the most necessary — because the fight does not stay at the air base.`,
  },
]

async function main() {
  console.log(`Seeding ${explainers.length} new explainers...\n`)

  for (const data of explainers) {
    // Check if slug already exists
    const existing = await prisma.explainer.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      console.log(`SKIP: "${data.title}" — slug already exists`)
      continue
    }

    await prisma.explainer.create({ data })
    console.log(`CREATED: "${data.title}"`)
  }

  const total = await prisma.explainer.count()
  console.log(`\nTotal explainers in DB: ${total}`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
