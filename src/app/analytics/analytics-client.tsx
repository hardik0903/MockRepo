'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { NetworkGraph3D } from '@/components/dashboard/network-graph-3d';
import { Leaderboard } from '@/components/analytics/leaderboard';
import { fetchNetworkGraph } from '@/lib/api';
import type { NetworkGraphData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export function AnalyticsClient() {
  const [graphData, setGraphData] = useState<NetworkGraphData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchNetworkGraph();
        setGraphData(data);
      } catch (error) {
        console.error("Failed to fetch network graph data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>3D Network Graph</CardTitle>
            <CardDescription>Relationships between campaigns, users, and keywords.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <Skeleton className="w-full h-[500px] rounded-lg" />
            ) : graphData ? (
                <NetworkGraph3D data={graphData} />
            ) : (
                <div className="w-full h-[500px] flex items-center justify-center rounded-lg bg-muted/50">
                    <p className="text-muted-foreground">Could not load graph data.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Leaderboard />
      </div>
    </div>
  );
}
