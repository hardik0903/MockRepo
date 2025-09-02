'use client';
import { useEffect, useState } from 'react';
import { fetchTrendingKeywords } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export function TrendingKeywords() {
  const [keywords, setKeywords] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKeywords() {
      try {
        const data = await fetchTrendingKeywords();
        const sortedKeywords = Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
        setKeywords(sortedKeywords);
      } catch (error) {
        console.error("Failed to fetch trending keywords:", error);
      } finally {
        setLoading(false);
      }
    }
    loadKeywords();
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Trending Hate Keywords</CardTitle>
        <CardDescription>Top 20 most frequently detected hateful keywords.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {loading ? (
            <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-8" />
                    </div>
                ))}
            </div>
        ) : keywords ? (
            <ScrollArea className="h-[400px]">
                <div className="space-y-4 pr-4">
                    {Object.entries(keywords).map(([keyword, count]) => (
                        <div key={keyword} className="flex justify-between items-center gap-4">
                            <span className="text-sm font-medium truncate">{keyword}</span>
                            <Badge variant="secondary">{count}</Badge>
                        </div>
                    ))}
                </div>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground">Could not load keywords.</p>
        )}
      </CardContent>
    </Card>
  );
}
