import { prisma } from "../lib/prisma/client";

async function main() {
  const buildings = [
    // CLASSIC
    {
      name: "Dykstra Hall",
      address: "401 Charles E Young Drive West",
      type: "CLASSIC" as const,
      latitude: 34.0700,
      longitude: -118.4500,
    },
    {
      name: "Sproul Hall",
      address: "350 De Neve Drive",
      type: "CLASSIC" as const,
      latitude: 34.0725,
      longitude: -118.4503,
    },
    {
      name: "Rieber Hall",
      address: "310 De Neve Drive",
      type: "CLASSIC" as const,
      latitude: 34.0717,
      longitude: -118.4515,
    },
    {
      name: "Hedrick Hall",
      address: "250 De Neve Drive",
      type: "CLASSIC" as const,
      latitude: 34.0735,
      longitude: -118.4524,
    },

    // DELUXE
    {
      name: "Sproul Cove",
      address: "330 De Neve Drive",
      type: "DELUXE" as const,
      latitude: 34.0716,
      longitude: -118.4509,
    },
    {
      name: "Sproul Landing",
      address: "380 De Neve Drive",
      type: "DELUXE" as const,
      latitude: 34.0716,
      longitude: -118.4501,
    },
    {
      name: "De Neve Holly",
      address: "345 De Neve Drive",
      type: "DELUXE" as const,
      latitude: 34.0710,
      longitude: -118.4519,
    },
    {
      name: "De Neve Gardenia",
      address: "470 Gayley Avenue",
      type: "DELUXE" as const,
      latitude: 34.0708,
      longitude: -118.4524,
    },
    {
      name: "Olympic Hall",
      address: "267 De Neve Drive",
      type: "DELUXE" as const,
      latitude: 34.0725,
      longitude: -118.4535,
    },
    {
      name: "Centennial Hall",
      address: "265 De Neve Drive",
      type: "DELUXE" as const,
      latitude: 34.0730,
      longitude: -118.4539,
    },

    // PLAZA
    {
      name: "De Neve Acacia",
      address: "341 Charles E Young Drive West",
      type: "PLAZA" as const,
      latitude: 34.0704,
      longitude: -118.4498,
    },
    {
      name: "De Neve Birch",
      address: "361 Charles E Young Drive West",
      type: "PLAZA" as const,
      latitude: 34.0704,
      longitude: -118.4504,
    },
    {
      name: "De Neve Cedar",
      address: "301 Charles E Young Drive West",
      type: "PLAZA" as const,
      latitude: 34.0710,
      longitude: -118.4499,
    },
    {
      name: "De Neve Dogwood",
      address: "321 Charles E Young Drive West",
      type: "PLAZA" as const,
      latitude: 34.0710,
      longitude: -118.4504,
    },
    {
      name: "De Neve Evergreen",
      address: "331 Charles E Young Drive West",
      type: "PLAZA" as const,
      latitude: 34.0707,
      longitude: -118.4512,
    },
    {
      name: "De Neve Fir",
      address: "381 Charles E Young Drive West",
      type: "PLAZA" as const,
      latitude: 34.0702,
      longitude: -118.4510,
    },
    {
      name: "Sunset Village Canyon Point",
      address: "200 De Neve Drive",
      type: "PLAZA" as const,
      latitude: 34.0736,
      longitude: -118.4507,
    },
    {
      name: "Sunset Village Delta Terrace",
      address: "200 De Neve Drive",
      type: "PLAZA" as const,
      latitude: 34.0730,
      longitude: -118.4511,
    },
    {
      name: "Sunset Village Courtside",
      address: "200 De Neve Drive",
      type: "PLAZA" as const,
      latitude: 34.0737,
      longitude: -118.4499,
    },
    {
      name: "Rieber Terrace",
      address: "270 De Neve Drive",
      type: "PLAZA" as const,
      latitude: 34.0727,
      longitude: -118.4521,
    },
    {
      name: "Rieber Vista",
      address: "280 De Neve Drive",
      type: "PLAZA" as const,
      latitude: 34.0722,
      longitude: -118.4521,
    },
    {
      name: "Hedrick Summit",
      address: "240 De Neve Drive",
      type: "PLAZA" as const,
      latitude: 34.0740,
      longitude: -118.4528,
    },

    // SUITE
    {
      name: "Saxon Suites",
      address: "325 De Neve Drive",
      type: "SUITE" as const,
      latitude: 34.0717,
      longitude: -118.4531,
    },
    {
      name: "Hitch Suites",
      address: "245 De Neve Drive",
      type: "SUITE" as const,
      latitude: 34.0736,
      longitude: -118.4537,
    },

    // UNIV_APT
    {
      name: "Gayley Towers",
      address: "565 Gayley Avenue",
      type: "UNIV_APT" as const,
      latitude: 34.0688,
      longitude: -118.4498,
    },
    {
      name: "Westwood Palm",
      address: "475 Gayley Avenue",
      type: "UNIV_APT" as const,
      latitude: 34.0701,
      longitude: -118.4520,
    },
    {
      name: "Westwood Chateau",
      address: "456 Landfair Avenue",
      type: "UNIV_APT" as const,
      latitude: 34.0694,
      longitude: -118.4516,
    },
    {
      name: "Landfair",
      address: "625 Landfair Avenue",
      type: "UNIV_APT" as const,
      latitude: 34.0664,
      longitude: -118.4491,
    },
    {
      name: "Landfair Vista",
      address: "510 Landfair Avenue",
      type: "UNIV_APT" as const,
      latitude: 34.0685,
      longitude: -118.4506,
    },
    {
      name: "Glenrock",
      address: "558 Glenrock Avenue",
      type: "UNIV_APT" as const,
      latitude: 34.0670,
      longitude: -118.4507,
    },
    {
      name: "Glenrock West",
      address: "555 Glenrock Avenue",
      type: "UNIV_APT" as const,
      latitude: 34.0667,
      longitude: -118.4512,
    },
    {
      name: "Levering Terrace",
      address: "885 Levering Avenue",
      type: "UNIV_APT" as const,
      latitude: 34.0634,
      longitude: -118.4494,
    },
    {
      name: "Gayley Court",
      address: "715 Gayley Avenue",
      type: "UNIV_APT" as const,
      latitude: 34.0651,
      longitude: -118.4482,
    },
    {
      name: "Gayley Heights",
      address: "10995 Le Conte Avenue",
      type: "UNIV_APT" as const,
      latitude: 34.0640,
      longitude: -118.4488,
    },
    {
      name: "Laurel",
      address: "920 Weyburn Place",
      type: "UNIV_APT" as const,
      latitude: 34.0627,
      longitude: -118.4497,
    },
    {
      name: "Tipuana",
      address: "900 Weyburn Place",
      type: "UNIV_APT" as const,
      latitude: 34.0632,
      longitude: -118.4499,
    },
    {
      name: "Palo Verde",
      address: "910 Weyburn Place",
      type: "UNIV_APT" as const,
      latitude: 34.0629,
      longitude: -118.4505,
    },
  ];

  console.log("Seeding buildings...");

  for (const building of buildings) {
    const existing = await prisma.building.findFirst({
      where: {
        name: building.name,
        address: building.address,
      },
    });

    if (!existing) {
      await prisma.building.create({
        data: building,
      });
      console.log(`Created: ${building.name}`);
    } else {
      console.log(`Already exists: ${building.name}`);
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
