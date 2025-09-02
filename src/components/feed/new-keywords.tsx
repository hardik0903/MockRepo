'use client';
import { useEffect, useState } from 'react';
import { fetchNewKeywords } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';

export function NewKeywords() {
  const [keywords, setKeywords] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKeywords() {
      try {
        const data = await fetchNewKeywords();
        setKeywords(data);
      } catch (error) {
        console.error("Failed to fetch new keywords:", error);
      } finally {
        setLoading(false);
      }
    }
    loadKeywords();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Newly Discovered Keywords
        </CardTitle>
        <CardDescription>The latest batch of keywords discovered by the AI.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
            </div>
        ) : keywords && keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                    <Badge key={keyword} variant="default">{keyword}</Badge>
                ))}
            </div>
        ) : (
          <p className="text-sm text-muted-foreground">No new keywords found.</p>
        )}
      </CardContent>
    </Card>
  );
}
