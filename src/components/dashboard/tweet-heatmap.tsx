'use client';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { tweetHeatmapData } from '@/lib/mock-data';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

// This is a separate component to handle the heatmap layer logic
// It's necessary because we need to use hooks from the Maps library
function HeatmapComponent() {
  const map = google.maps.event.getSharedInstance();
  const [heatmapLayer, setHeatmapLayer] =
    useState<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!map) return;

    const data = tweetHeatmapData.map(
      item => new google.maps.LatLng(item.lat, item.lng)
    );

    const layer = new google.maps.visualization.HeatmapLayer({
      data: data,
      radius: 20,
    });
    layer.setMap(map);
    setHeatmapLayer(layer);

    return () => {
      if (layer) {
        layer.setMap(null);
      }
    };
  }, [map]);

  return null;
}

export function TweetHeatmap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-96 rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/10 text-destructive-foreground p-8">
        <AlertTriangle className="h-10 w-10 mb-4 text-destructive" />
        <h3 className="text-xl font-semibold">Google Maps API Key Missing</h3>
        <p className="text-center mt-2 text-sm">
          Please add your Google Maps API key to a `.env.local` file to display
          the heatmap.
          <br />
          <code className="bg-destructive/20 text-destructive-foreground/80 px-1 py-0.5 rounded-sm text-xs">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
          </code>
        </p>
      </div>
    );
  }

  const position = { lat: 37.7749, lng: -122.4194 }; // San Francisco

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <APIProvider apiKey={apiKey} libraries={['visualization']}>
        <Map
          defaultCenter={position}
          defaultZoom={3}
          mapId="sentinelx-map"
          disableDefaultUI={true}
          gestureHandling="greedy"
        >
          <HeatmapComponent />
        </Map>
      </APIProvider>
    </div>
  );
}
