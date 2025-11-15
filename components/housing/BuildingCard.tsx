import Link from "next/link";

type Building = {
  id: number;
  name: string;
  address: string;
  type: string;
};

type BuildingCardProps = {
  building: Building;
};

export default function BuildingCard({ building }: BuildingCardProps) {
  const slug = building.name.replace(/\s+/g, "_");

  return (
    <Link
      href={`/housing/${slug}`}
      className="block p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all bg-white"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {building.name}
      </h2>
      <p className="text-sm text-gray-600 mb-2">{building.address}</p>
      <p className="text-sm text-blue-600 font-medium">{building.type}</p>
    </Link>
  );
}

