'use client';
import { APIProvider, Map, useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { LocationData } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

const geocodeCache = new Map<string, google.maps.LatLngLiteral>();

async function geocodeLocation(address: string): Promise<google.maps.LatLngLiteral | null> {
    if (geocodeCache.has(address)) {
        return geocodeCache.get(address)!;
    }
    try {
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ address });
        if (response.results[0]) {
            const location = response.results[0].geometry.location;
            const latLng = { lat: location.lat(), lng: location.lng() };
            geocodeCache.set(address, latLng);
            return latLng;
        }
        return null;
    } catch (error) {
        console.error(`Geocoding failed for ${address}:`, error);
        return null;
    }
}

function HeatmapComponent({ data }: { data: LocationData }) {
  const map = useMap();
  const [heatmapData, setHeatmapData] = useState<google.maps.visualization.WeightedLocation[]>([]);

  useEffect(() => {
    if (!map || !data || Object.keys(data).length === 0) return;

    let isMounted = true;
    
    async function processLocations() {
      const promises = Object.entries(data).map(async ([location, count]) => {
        const latLng = await geocodeLocation(location);
        if (latLng) {
          return { location: new google.maps.LatLng(latLng.lat, latLng.lng), weight: count };
        }
        return null;
      });

      const results = await Promise.all(promises);
      if(isMounted) {
          setHeatmapData(results.filter((item): item is google.maps.visualization.WeightedLocation => item !== null));
      }
    }

    processLocations();

    return () => {
        isMounted = false;
    }
  }, [map, data]);


  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      radius: 30,
      map: map
    });

    return () => {
      heatmap.setMap(null);
    };
  }, [map, heatmapData]);

  return null;
}

export function LocationMap({ data }: { data: LocationData }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/10 text-destructive-foreground p-8">
        <AlertTriangle className="h-10 w-10 mb-4 text-destructive" />
        <h3 className="text-xl font-semibold">Google Maps API Key Missing</h3>
        <p className="text-center mt-2 text-sm">
          Please set the NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.
        </p>
      </div>
    );
  }

  const position = { lat: 20.5937, lng: 78.9629 }; // Center of India

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden">
      <APIProvider apiKey={apiKey} libraries={['visualization', 'geocoding']}>
        <Map
          defaultCenter={position}
          defaultZoom={4}
          mapId="sentinel-map"
          disableDefaultUI={true}
          gestureHandling="greedy"
        >
          <HeatmapComponent data={data} />
        </Map>
      </APIProvider>
    </div>
  );
}
