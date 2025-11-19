"use client";

import { useState } from "react";
import BuildingCard from "./BuildingCard";

type Building = {
  id: number;
  name: string;
  address: string;
  type: string;
};

type BuildingFilterProps = {
  buildings: Building[];
};

const BUILDING_TYPES = ["ALL", "CLASSIC", "DELUXE", "PLAZA", "SUITE", "UNIV_APT"];

const getTypeDisplayName = (type: string): string => {
  const displayNames: Record<string, string> = {
    ALL: "All Types",
    CLASSIC: "Classic",
    DELUXE: "Deluxe",
    PLAZA: "Plaza",
    SUITE: "Suite",
    UNIV_APT: "University Apartment",
  };
  return displayNames[type] || type;
};

export default function BuildingFilter({ buildings }: BuildingFilterProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["ALL"]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleTypeToggle = (type: string) => {
    if (type === "ALL") {
      // If ALL is clicked, clear all other selections
      setSelectedTypes(["ALL"]);
    } else {
      setSelectedTypes((prev) => {
        // Remove ALL if it's selected
        const withoutAll = prev.filter((t) => t !== "ALL");
        
        // Toggle the selected type
        if (withoutAll.includes(type)) {
          // If already selected, remove it
          const newSelection = withoutAll.filter((t) => t !== type);
          // If nothing is selected, default to ALL
          return newSelection.length === 0 ? ["ALL"] : newSelection;
        } else {
          // If not selected, add it
          const newSelection = [...withoutAll, type];
          
          // If all 5 types are now selected, switch back to ALL
          const allSpecificTypes = ["CLASSIC", "DELUXE", "PLAZA", "SUITE", "UNIV_APT"];
          const hasAllTypes = allSpecificTypes.every(t => newSelection.includes(t));
          
          if (hasAllTypes) {
            return ["ALL"];
          }
          
          return newSelection;
        }
      });
    }
  };

  const filteredBuildings = buildings.filter((building) => {
    // Filter by type
    const matchesType =
      selectedTypes.includes("ALL") || selectedTypes.includes(building.type);

    // Filter by search query (case-insensitive, partial match)
    const matchesSearch =
      searchQuery === "" ||
      building.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search for a building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md rounded-lg border-2 border-gray-400 px-4 py-3 text-lg text-gray-600 placeholder:text-gray-400 shadow-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {BUILDING_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeToggle(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedTypes.includes(type)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {getTypeDisplayName(type)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBuildings.length === 0 ? (
            <p className="text-gray-600 col-span-full">
              No buildings found for this filter.
            </p>
          ) : (
            filteredBuildings.map((building) => (
              <BuildingCard key={building.id} building={building} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

