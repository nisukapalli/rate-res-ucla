import { prisma } from "@/lib/prisma/client";
import BuildingFilter from "@/components/housing/BuildingFilter";

export default async function HousingPage() {
  const buildings = await prisma.building.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return <BuildingFilter buildings={buildings} />;
}

