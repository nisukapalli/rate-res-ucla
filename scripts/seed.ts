import { prisma } from "../lib/prisma/client";

async function main() {
  const buildings = [
    // CLASSIC
    {
      name: "Dykstra Hall",
      address: "401 Charles E Young Drive West",
      type: "CLASSIC" as const,
    },
    {
      name: "Sproul Hall",
      address: "350 De Neve Drive",
      type: "CLASSIC" as const,
    },
    {
      name: "Rieber Hall",
      address: "310 De Neve Drive",
      type: "CLASSIC" as const,
    },
    {
      name: "Hedrick Hall",
      address: "250 De Neve Drive",
      type: "CLASSIC" as const,
    },

    // DELUXE
    {
      name: "Sproul Cove",
      address: "330 De Neve Drive",
      type: "DELUXE" as const,
    },
    {
      name: "Sproul Landing",
      address: "380 De Neve Drive",
      type: "DELUXE" as const,
    },
    {
      name: "De Neve Holly",
      address: "345 De Neve Drive",
      type: "DELUXE" as const,
    },
    {
      name: "De Neve Gardenia",
      address: "470 Gayley Avenue",
      type: "DELUXE" as const,
    },
    {
      name: "Olympic Hall",
      address: "267 De Neve Drive",
      type: "DELUXE" as const,
    },
    {
      name: "Centennial Hall",
      address: "265 De Neve Drive",
      type: "DELUXE" as const,
    },

    // PLAZA
    {
      name: "De Neve Acacia",
      address: "341 Charles E Young Drive West",
      type: "PLAZA" as const,
    },
    {
      name: "De Neve Birch",
      address: "361 Charles E Young Drive West",
      type: "PLAZA" as const,
    },
    {
      name: "De Neve Cedar",
      address: "301 Charles E Young Drive West",
      type: "PLAZA" as const,
    },
    {
      name: "De Neve Dogwood",
      address: "321 Charles E Young Drive West",
      type: "PLAZA" as const,
    },
    {
      name: "De Neve Evergreen",
      address: "331 Charles E Young Drive West",
      type: "PLAZA" as const,
    },
    {
      name: "De Neve Fir",
      address: "381 Charles E Young Drive West",
      type: "PLAZA" as const,
    },
    {
      name: "Sunset Village Canyon Point",
      address: "200 De Neve Drive",
      type: "PLAZA" as const,
    },
    {
      name: "Sunset Village Delta Terrace",
      address: "200 De Neve Drive",
      type: "PLAZA" as const,
    },
    {
      name: "Sunset Village Courtside",
      address: "200 De Neve Drive",
      type: "PLAZA" as const,
    },
    {
      name: "Rieber Terrace",
      address: "270 De Neve Drive",
      type: "PLAZA" as const,
    },
    {
      name: "Rieber Vista",
      address: "280 De Neve Drive",
      type: "PLAZA" as const,
    },
    {
      name: "Hedrick Summit",
      address: "240 De Neve Drive",
      type: "PLAZA" as const,
    },

    // SUITE
    {
      name: "Saxon Suites",
      address: "325 De Neve Drive",
      type: "SUITE" as const,
    },
    {
      name: "Hitch Suites",
      address: "245 De Neve Drive",
      type: "SUITE" as const,
    },

    // UNIV_APT
    // TODO: Add more university apartments
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
