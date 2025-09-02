'use client';
import { useEffect, useState } from 'react';
import { fetchMostViral } from '@/lib/api';
import type { MostViral as MostViralType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function MostViral() {
  const [users, setUsers] = useState<[string, number][] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMostViral();
        const sortedData = Object.entries(data).sort(([, a], [, b]) => b - a);
        setUsers(sortedData);
      } catch (error) {
        console.error("Failed to fetch most viral users:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Viral Accounts</CardTitle>
        <CardDescription>Users sorted by their cumulative engagement score.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
                {loading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-6 w-16" />
                        </div>
                    ))
                ) : users && users.length > 0 ? (
                    users.map(([username, score]) => (
                        <div key={username} className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{username.substring(1, 3).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">{username}</span>
                             </div>
                             <span className="font-bold text-primary">{score.toFixed(2)}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Could not load most viral accounts.</p>
                )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
