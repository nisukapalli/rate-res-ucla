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

const getBuildingTypeBadgeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    CLASSIC: "bg-indigo-600 text-white",
    DELUXE: "bg-yellow-600 text-white",
    PLAZA: "bg-green-700 text-white",
    SUITE: "bg-fuchsia-500 text-white",
    UNIV_APT: "bg-cyan-500 text-white",
  };
  return colorMap[type] || "bg-gray-500 text-white";
};

const formatBuildingType = (type: string): string => {
  const typeMap: Record<string, string> = {
    CLASSIC: "Classic",
    DELUXE: "Deluxe",
    PLAZA: "Plaza",
    SUITE: "Suite",
    UNIV_APT: "University Apartment",
  };
  return typeMap[type] || type;
};

export default function BuildingCard({ building }: BuildingCardProps) {
  const slug = building.name.replace(/\s+/g, "_");
  const badgeColor = getBuildingTypeBadgeColor(building.type);

  return (
    <Link
      href={`/housing/${slug}`}
      className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all bg-white flex flex-col justify-between min-h-[180px]"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {building.name}
        </h2>
        <p className="text-sm text-gray-600">{building.address}</p>
      </div>
      <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${badgeColor} self-start mt-4`}>
        {formatBuildingType(building.type)}
      </span>
    </Link>
  );
}

