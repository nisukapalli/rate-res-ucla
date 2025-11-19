import { prisma } from "@/lib/prisma/client";
import MapWrapper from "@/components/MapWrapper";
import Link from "next/link";

export default async function Home() {
  // Fetch buildings
  const buildings = await prisma.building.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Fetch all reviews to calculate building averages
  const reviews = await prisma.review.findMany({
    select: {
      building: true,
      overall: true,
    },
  });

  // Calculate average rating for each building
  const buildingAverages = buildings.map(building => {
    const buildingReviews = reviews.filter(r => r.building === building.name);
    const avgRating = buildingReviews.length > 0
      ? buildingReviews.reduce((sum, r) => sum + r.overall, 0) / buildingReviews.length
      : 0;
    
    return {
      ...building,
      avgRating,
      reviewCount: buildingReviews.length
    };
  });

  // Separate dorms (non-apartments) and apartments
  const dorms = buildingAverages
    .filter(b => b.type !== 'UNIV_APT' && b.reviewCount > 0)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);

  const apartments = buildingAverages
    .filter(b => b.type === 'UNIV_APT' && b.reviewCount > 0)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);

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

  const getBadgeColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      CLASSIC: "bg-indigo-600 text-white",
      DELUXE: "bg-yellow-600 text-white",
      PLAZA: "bg-green-700 text-white",
      SUITE: "bg-fuchsia-500 text-white",
      UNIV_APT: "bg-cyan-500 text-white",
    };
    return colorMap[type] || "bg-gray-500 text-white";
  };

  const getLeftBorderColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      CLASSIC: "border-l-indigo-600",
      DELUXE: "border-l-yellow-600",
      PLAZA: "border-l-green-700",
      SUITE: "border-l-fuchsia-500",
      UNIV_APT: "border-l-cyan-500",
    };
    return colorMap[type] || "border-l-gray-500";
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 4.5) return 'bg-green-600';
    if (rating >= 3.5) return 'bg-green-500';
    if (rating >= 2.5) return 'bg-yellow-500';
    if (rating >= 1.5) return 'bg-orange-500';
    return 'bg-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Two Column Layout */}
        <div className="flex gap-8">
          {/* Left Column - Map */}
          <div className="flex-1">
            <div className="w-full h-[700px] rounded-lg border-2 border-gray-400 overflow-hidden bg-white">
              <MapWrapper buildings={buildings} />
            </div>
          </div>

          {/* Right Column - Top Rated Dorms */}
          <div className="w-96 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Top Dorms */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Rated Dorms</h2>
                {dorms.length === 0 ? (
                  <p className="text-gray-500 text-sm">No reviews yet</p>
                ) : (
                  <div className="space-y-3">
                    {dorms.map((building, index) => (
                      <Link
                        key={building.id}
                        href={`/housing/${building.name.replace(/\s+/g, "_")}`}
                        className={`block p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all border-l-[6px] ${getLeftBorderColor(building.type)}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-lg font-bold text-gray-400 shrink-0">#{index + 1}</span>
                            <h3 className="font-semibold text-sm text-gray-900 leading-tight break-words">{building.name}</h3>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 pt-0.5">
                            <div className={`${getRatingColor(building.avgRating)} text-white px-2 py-1 rounded font-bold text-sm whitespace-nowrap`}>
                              {building.avgRating.toFixed(1)}
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">({building.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Top Rated Apartments */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Rated Apartments</h2>
                {apartments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No reviews yet</p>
                ) : (
                  <div className="space-y-3">
                    {apartments.map((building, index) => (
                      <Link
                        key={building.id}
                        href={`/housing/${building.name.replace(/\s+/g, "_")}`}
                        className={`block p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all border-l-[6px] ${getLeftBorderColor(building.type)}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-lg font-bold text-gray-400 shrink-0">#{index + 1}</span>
                            <h3 className="font-semibold text-sm text-gray-900 leading-tight break-words">{building.name}</h3>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 pt-0.5">
                            <div className={`${getRatingColor(building.avgRating)} text-white px-2 py-1 rounded font-bold text-sm whitespace-nowrap`}>
                              {building.avgRating.toFixed(1)}
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">({building.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
