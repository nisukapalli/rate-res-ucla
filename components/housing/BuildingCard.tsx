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

const getBuildingTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    CLASSIC: "border-indigo-600 bg-indigo-50",
    DELUXE: "border-yellow-600 bg-yellow-50",
    PLAZA: "border-emerald-500 bg-emerald-50",
    SUITE: "border-fuchsia-500 bg-fuchsia-50",
    UNIV_APT: "border-teal-500 bg-teal-50",
  };
  return colorMap[type] || "border-gray-300 bg-white";
};

export default function BuildingCard({ building }: BuildingCardProps) {
  const slug = building.name.replace(/\s+/g, "_");
  const colorClasses = getBuildingTypeColor(building.type);

  return (
    <Link
      href={`/housing/${slug}`}
      className={`block p-6 border-2 rounded-lg hover:shadow-lg transition-all ${colorClasses}`}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {building.name}
      </h2>
      <p className="text-sm text-gray-600 mb-2">{building.address}</p>
      <p className="text-sm text-blue-600 font-medium">{building.type}</p>
    </Link>
  );
}

