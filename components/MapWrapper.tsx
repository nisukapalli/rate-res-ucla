'use client';

import dynamic from "next/dynamic";

type Building = {
  id: number;
  name: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
};

type MapWrapperProps = {
  buildings?: Building[];
};

// Import Map dynamically to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-lg border-2 border-gray-400 bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500 text-lg">Loading map...</p>
    </div>
  ),
});

export default function MapWrapper({ buildings = [] }: MapWrapperProps) {
  return <Map buildings={buildings} />;
}

