'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Westwood coordinates (UCLA area)
const WESTWOOD_CENTER: [number, number] = [34.0689, -118.4452];

// Define bounds to restrict map view to Westwood area
const WESTWOOD_BOUNDS: [[number, number], [number, number]] = [
  [34.0300, -118.4900], // Southwest corner
  [34.1100, -118.4000], // Northeast corner
];

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

export default function Map() {
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
        <MapContent />
      </MapContainer>
    </div>
  );
}

