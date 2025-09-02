'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { fetchLocationData } from '@/lib/api';
import type { LocationData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { LocationList } from '@/components/geolocation/location-list';
import { LocationMap } from '@/components/geolocation/location-map';

export function GeolocationClient() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchLocationData();
        setLocationData(data);
      } catch (error) {
        console.error("Failed to fetch location data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Tweet Geolocation Heatmap</CardTitle>
            <CardDescription>Visualizing the geographic distribution of analyzed tweets.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <Skeleton className="w-full h-[600px] rounded-lg" />
            ) : locationData ? (
                <LocationMap data={locationData} />
            ) : (
                <div className="w-full h-[600px] flex items-center justify-center rounded-lg bg-muted/50">
                    <p className="text-muted-foreground">Could not load map data.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <LocationList data={locationData} loading={loading} />
      </div>
    </div>
  );
}
