import { prisma } from "@/lib/prisma/client";
import BuildingCard from "@/components/housing/BuildingCard";

export default async function HousingPage() {
  const buildings = await prisma.building.findMany({
    orderBy: {
      name: "asc",
    },
  });

  type Building = (typeof buildings)[0];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {buildings.map((building: Building) => (
            <BuildingCard key={building.id} building={building} />
          ))}
        </div>
      </div>
    </div>
  );
}

