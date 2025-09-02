'use client';
import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '@/lib/api';
import type { Leaderboard as LeaderboardType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy } from 'lucide-react';

export function Leaderboard() {
  const [users, setUsers] = useState<[string, number][] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchLeaderboard();
        const sortedData = Object.entries(data).sort(([, a], [, b]) => b - a);
        setUsers(sortedData);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getTrophyColor = (index: number) => {
    if (index === 0) return 'text-yellow-400';
    if (index === 1) return 'text-gray-400';
    if (index === 2) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hate Score Leaderboard</CardTitle>
        <CardDescription>Users with the highest cumulative hate scores.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
                {loading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-6 w-16" />
                        </div>
                    ))
                ) : users && users.length > 0 ? (
                    users.map(([username, score], index) => (
                        <div key={username} className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <Trophy className={`w-5 h-5 ${getTrophyColor(index)}`} />
                                <span className="font-medium text-sm">{username}</span>
                             </div>
                             <span className="font-bold text-destructive">{score.toFixed(2)}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Could not load leaderboard data.</p>
                )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
