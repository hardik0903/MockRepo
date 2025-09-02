'use client';
import { useEffect, useState } from 'react';
import { fetchMostHated } from '@/lib/api';
import type { MostHated as MostHatedType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export function MostHated() {
  const [tweets, setTweets] = useState<MostHatedType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMostHated();
        setTweets(data);
      } catch (error) {
        console.error("Failed to fetch most hated tweets:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Hated Tweets</CardTitle>
        <CardDescription>Tweets sorted by the highest hate score.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
                {loading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))
                ) : tweets && tweets.length > 0 ? (
                    tweets.map((item, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-sm">Hate Score</span>
                                <span className="text-sm font-bold text-destructive">{item.hate_score.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">{item.tweet}</p>
                            {index < tweets.length - 1 && <Separator />}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Could not load most hated tweets.</p>
                )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
