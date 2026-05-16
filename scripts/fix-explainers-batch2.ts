import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

const updates = [
  { slug: 'loitering-munitions-kamikaze-drones', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Switchblade_300_in_flight_%28200902-M-EU630-1102%29_%28cropped%29.jpg' },
  { slug: 'cuas-urban-environments', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/U_S_Army_tests_new_anti-drone_tech_in_Project_Flytrap_%289090333%29.jpg/960px-U_S_Army_tests_new_anti-drone_tech_in_Project_Flytrap_%289090333%29.jpg' },
  { slug: 'cuas-command-and-control-platforms', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Acting_Secretary_of_Defense_Visits_NORAD_and_NORTHCOM_190409-D-BN624-168.jpg/960px-Acting_Secretary_of_Defense_Visits_NORAD_and_NORTHCOM_190409-D-BN624-168.jpg' },
  { slug: 'chinese-commercial-drones-dual-use', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Soldier_with_commercial_drones.jpg' },
  { slug: 'non-kinetic-defeat-spoofing-cyber', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Cyber-Electromagnetic_Activities_at_the_National_Training_Center%2C_January_2018.jpg/960px-Cyber-Electromagnetic_Activities_at_the_National_Training_Center%2C_January_2018.jpg' },
  { slug: 'red-teaming-adversarial-drone-testing', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/CLB_6_Conduct_Test_Flights_Using_A_TRV-150_Drone_While_in_Finland_%288220187%29.jpg/960px-CLB_6_Conduct_Test_Flights_Using_A_TRV-150_Drone_While_in_Finland_%288220187%29.jpg' },
  { slug: 'counter-uas-policy-framework', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Defense.gov_News_Photo_110419-D-WQ296-031_-_Defense_Department_General_Counsel_Jeh_Johnson_conducts_a_Pentagon_press_briefing_on_April_19%2C_2011.jpg/960px-Defense.gov_News_Photo_110419-D-WQ296-031_-_Defense_Department_General_Counsel_Jeh_Johnson_conducts_a_Pentagon_press_briefing_on_April_19%2C_2011.jpg' },
  { slug: 'naval-cuas-drone-defense-at-sea', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/The_Hermione_being_escorted_by_the_USS_Mitscher_%28DDG-57%29_%281%29.jpg/960px-The_Hermione_being_escorted_by_the_USS_Mitscher_%28DDG-57%29_%281%29.jpg' },
  { slug: 'allied-interoperability-cuas', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/NATO_Exercise_Toxic_Trip_23%3B_force_integration_%288040216%29.jpg/960px-NATO_Exercise_Toxic_Trip_23%3B_force_integration_%288040216%29.jpg' },
];

async function main() {
  for (const { slug, url } of updates) {
    await p.explainer.update({ where: { slug }, data: { imageUrl: url } });
    console.log('Updated: ' + slug);
  }
  console.log('DONE - 9 explainers updated');
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
