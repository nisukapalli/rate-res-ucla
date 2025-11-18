'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

type Building = {
  id: number;
  name: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
};

type MapProps = {
  buildings?: Building[];
};

// Westwood coordinates (UCLA area)
const WESTWOOD_CENTER: [number, number] = [34.0689, -118.4452];

// Define bounds to restrict map view to Westwood area
const WESTWOOD_BOUNDS: [[number, number], [number, number]] = [
  [34.0300, -118.4900], // Southwest corner
  [34.1100, -118.4000], // Northeast corner
];

// Helper function to create colored marker icons
const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

// Get marker color based on building type
const getMarkerColor = (type: string): string => {
  const typeUpper = type.toUpperCase();
  switch (typeUpper) {
    case 'CLASSIC':
      return '#4F46E5'; // indigo-600
    case 'DELUXE':
      return '#CA8A04'; // yellow-600
    case 'PLAZA':
      return '#10B981'; // emerald-500
    case 'SUITE':
      return '#D946EF'; // fuchsia-500
    case 'UNIV_APT':
      return '#14B8A6'; // teal-500
    default:
      return '#6B7280'; // gray
  }
};

function MapContent() {
  const map = useMap();
  
  useEffect(() => {
    // Force map to update its size after mount
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

export default function Map({ buildings = [] }: MapProps) {
  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={WESTWOOD_CENTER}
        zoom={15}
        minZoom={13}
        maxZoom={18}
        maxBounds={WESTWOOD_BOUNDS}
        maxBoundsViscosity={0.8}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg z-0"
        style={{ height: '100%', width: '100%' }}
      >
        {/* CartoDB Voyager */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        
        {/* Building Markers */}
        {buildings.map((building) => {
          const coordinates: [number, number] = [building.latitude, building.longitude];
          const markerColor = getMarkerColor(building.type);
          const icon = createColoredIcon(markerColor);
          const slug = building.name.replace(/\s+/g, "_");
          
          return (
            <Marker
              key={building.id}
              position={coordinates}
              icon={icon}
            >
              <Popup>
                <div className="p-1">
                  <Link href={`/housing/${slug}`}>
                    <h3 className="font-semibold text-sm text-gray-900 leading-tight hover:text-blue-600 cursor-pointer">
                      {building.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-600 leading-tight mb-0.5">{building.address}</p>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium text-white`} style={{ backgroundColor: markerColor }}>
                    {building.type}
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        <MapContent />
      </MapContainer>
    </div>
  );
}

