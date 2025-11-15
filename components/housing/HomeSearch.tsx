"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Building = {
  id: number;
  name: string;
  address: string;
  type: string;
};

type HomeSearchProps = {
  buildings: Building[];
};

export default function HomeSearch({ buildings }: HomeSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Building[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const queryLower = searchQuery.toLowerCase().trim();
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 0);
    
    const filtered = buildings.filter((building) => {
      const nameLower = building.name.toLowerCase();
      const nameWords = nameLower.split(/\s+/);
      
      // Check if all query words match at the start of consecutive words in the building name
      let nameWordIndex = 0;
      for (const queryWord of queryWords) {
        let found = false;
        // Look for a match starting from the current position
        while (nameWordIndex < nameWords.length) {
          if (nameWords[nameWordIndex].startsWith(queryWord)) {
            found = true;
            nameWordIndex++; // Move to next word for next query word
            break;
          }
          nameWordIndex++;
        }
        if (!found) {
          return false;
        }
      }
      return true;
    });
    setSearchResults(filtered);
    setShowResults(filtered.length > 0);
  }, [searchQuery, buildings]);

  const handleBuildingClick = (building: Building) => {
    const slug = building.name.replace(/\s+/g, "_");
    router.push(`/housing/${slug}`);
  };


  return (
    <div className="relative w-full max-w-2xl">
      <input
        type="text"
        placeholder="Search for a building..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => {
          if (searchResults.length > 0) setShowResults(true);
        }}
        onBlur={() => {
          // Delay hiding results to allow clicking on them
          setTimeout(() => setShowResults(false), 200);
        }}
        className="w-full rounded-lg border-2 border-gray-400 px-4 py-3 text-lg text-gray-600 placeholder:text-gray-400 shadow-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {searchResults.map((building) => (
            <button
              key={building.id}
              onClick={() => handleBuildingClick(building)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0"
            >
              <div className="font-semibold text-gray-900">
                {building.name}
              </div>
            </button>
          ))}
        </div>
      )}
      {searchQuery.trim() !== "" && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 z-50">
          <p className="text-gray-600">No buildings found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

