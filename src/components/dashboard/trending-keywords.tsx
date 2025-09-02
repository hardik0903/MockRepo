'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchTrendingKeywords } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface WordData {
  text: string;
  value: number;
}

const WordCloud = ({ data }: { data: WordData[] }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const colorPalette = [
    'hsl(var(--primary))',
    'hsl(var(--foreground))',
    'hsl(var(--muted-foreground))',
    'hsl(var(--accent))',
  ];

  const renderedWords = useMemo(() => {
    if (!data.length) return null;

    const counts = data.map(d => d.value);
    const min = Math.min(...counts);
    const max = Math.max(...counts);

    return data.map((word, i) => {
      const fontSize = 16 + (word.value - min) / (max - min) * 56; // Scale font size from 16px to 72px
      const color = colorPalette[i % colorPalette.length];
      const randomX = Math.random() * 40 - 20;
      const randomY = Math.random() * 40 - 20;

      return (
        <span
          key={word.text}
          style={{
            fontSize: `${fontSize}px`,
            color: color,
            padding: '4px 8px',
            transform: `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 30 - 15}deg)`,
            opacity: isMounted ? 1 : 0,
            transition: `opacity 0.5s ease-in-out ${i * 0.05}s`,
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
        >
          {word.text}
        </span>
      );
    });
  }, [data, isMounted]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4 leading-none">
        {renderedWords}
    </div>
  );
};


export function TrendingKeywords() {
  const [keywords, setKeywords] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKeywords() {
      try {
        const data = await fetchTrendingKeywords();
        setKeywords(data);
      } catch (error) {
        console.error("Failed to fetch trending keywords:", error);
      } finally {
        setLoading(false);
      }
    }
    loadKeywords();
  }, []);

  const wordData: WordData[] = useMemo(() => {
    if (!keywords) return [];
    return Object.entries(keywords).map(([text, value]) => ({ text, value }));
  }, [keywords]);

  return (
    <Card className="h-full flex flex-col bg-transparent border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl">Trending Hate Keywords</CardTitle>
        <CardDescription>A dynamic word cloud of the most frequently detected hateful keywords.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center min-h-[400px]">
        {loading ? (
          <Skeleton className="w-full h-[400px]" />
        ) : keywords ? (
          <div className="w-full h-full">
            <WordCloud data={wordData} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Could not load keywords.</p>
        )}
      </CardContent>
    </Card>
  );
}
