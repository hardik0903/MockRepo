'use client';
import { useEffect, useState } from 'react';
import { fetchNewKeywords } from '@/lib/api';

export function KeywordTicker() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadKeywords() {
      try {
        const data = await fetchNewKeywords();
        setKeywords(data);
      } catch (error) {
        console.error("Failed to fetch new keywords:", error);
        setKeywords(['Error loading keywords']);
      }
    }
    loadKeywords();
  }, []);

  useEffect(() => {
    if (keywords.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % keywords.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [keywords]);

  if (!keywords.length) {
    return <div className="h-6 w-64 bg-muted/50 rounded-md animate-pulse mt-2"></div>;
  }

  return (
    <div className="w-full max-w-md h-12 flex items-center justify-center overflow-hidden mt-2">
      <div className="relative w-full h-full">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className="absolute w-full h-full flex items-center justify-center transition-opacity duration-1000"
            style={{
              opacity: index === currentIndex ? 1 : 0,
            }}
          >
            <span className="text-primary font-medium bg-primary/10 px-4 py-2 rounded-full text-sm">
              <span className="text-muted-foreground mr-2">Latest keyword discovered:</span>
              {keyword}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
