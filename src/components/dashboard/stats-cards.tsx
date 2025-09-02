'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchLeaderboard, fetchMostViral, fetchMostHated, fetchCampaigns } from '@/lib/api';
import { Angry, BarChart, TrendingUp, Users } from 'lucide-react';

interface Stat {
  title: string;
  value: string | null;
  Icon: React.ElementType;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stat[]>([
    { title: 'Most Hateful Account', value: null, Icon: Angry },
    { title: 'Average Engage Score', value: null, Icon: TrendingUp },
    { title: 'Average Hate Score', value: null, Icon: BarChart },
    { title: 'Total Global Campaigns', value: null, Icon: Users },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [leaderboard, mostViral, mostHated, campaigns] = await Promise.all([
          fetchLeaderboard(),
          fetchMostViral(),
          fetchMostHated(),
          fetchCampaigns(),
        ]);

        const newStats: Stat[] = [...stats];

        // Most Hateful Account
        if (leaderboard) {
          const mostHateful = Object.entries(leaderboard).sort(([, a], [, b]) => b - a)[0];
          newStats[0].value = mostHateful ? mostHateful[0] : 'N/A';
        }

        // Average Engage Score
        if (mostViral) {
          const scores = Object.values(mostViral);
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          newStats[1].value = avg.toFixed(2);
        }

        // Average Hate Score
        if (mostHated) {
          const scores = mostHated.map(t => t.hate_score);
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          newStats[2].value = avg.toFixed(2);
        }

        // Total Global Campaigns
        if (campaigns) {
          newStats[3].value = Object.keys(campaigns).length.toString();
        }

        setStats(newStats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // You could set error states for each card here
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <div className="text-2xl font-bold">{stat.value || 'N/A'}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
