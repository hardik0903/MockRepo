'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchLeaderboard, fetchMostViral, fetchMostHated, fetchCampaigns } from '@/lib/api';
import { Angry, BarChart, TrendingUp, Users, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Stat {
  title: string;
  value: string | null;
  Icon: React.ElementType;
  description: string;
  progress?: number;
  progressColor?: string;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stat[]>([
    { title: 'Most Hateful Account', value: null, Icon: Trophy, description: 'The user with the highest hate score.' },
    { title: 'Average Engage Score', value: null, Icon: TrendingUp, description: 'Avg. virality across all tweets.' },
    { title: 'Average Hate Score', value: null, Icon: BarChart, description: 'Avg. hate score across all tweets.' },
    { title: 'Total Global Campaigns', value: null, Icon: Users, description: 'Unique global campaigns identified.' },
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
          const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
          newStats[1].value = avg.toFixed(2);
          newStats[1].progress = Math.min(avg * 10, 100); // Scale to 0-100
          newStats[1].progressColor = "bg-primary";
        }

        // Average Hate Score
        if (mostHated && mostHated.length > 0) {
          const scores = mostHated.map(t => t.hate_score);
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          newStats[2].value = avg.toFixed(2);
          newStats[2].progress = avg * 100; // Assuming score is 0-1
          newStats[2].progressColor = "bg-destructive";
        }

        // Total Global Campaigns
        if (campaigns) {
          newStats[3].value = Object.keys(campaigns).length.toString();
        }

        setStats(newStats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className={cn(index === 0 && 'bg-muted/50 border-primary/50')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className={cn("text-3xl font-bold tracking-tighter", index === 3 && "lg:text-5xl")}>{stat.value || 'N/A'}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                {stat.progress !== undefined && (
                    <Progress value={stat.progress} className="h-2 mt-4" indicatorClassName={stat.progressColor} />
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
