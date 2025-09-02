"use client";

import { useState, useTransition, Fragment } from "react";
import { generateTrendingKeywords } from "@/ai/flows/trending-keyword-generation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { tweetStream } from "@/lib/mock-data";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type KeywordsState = {
  [tweetId: string]: {
    keywords?: string[];
    isPending: boolean;
  };
};

export function TrendingKeywords() {
  const [keywordsState, setKeywordsState] = useState<KeywordsState>({});
  const { toast } = useToast();

  const handleGenerate = (tweetId: string, tweetText: string) => {
    setKeywordsState((prev) => ({
      ...prev,
      [tweetId]: { ...prev[tweetId], isPending: true },
    }));

    startTransition(async () => {
      const result = await generateTrendingKeywords({ tweet: tweetText });
      if (result && result.keywords) {
        setKeywordsState((prev) => ({
          ...prev,
          [tweetId]: { keywords: result.keywords, isPending: false },
        }));
      } else {
        setKeywordsState((prev) => ({
          ...prev,
          [tweetId]: { ...prev[tweetId], isPending: false },
        }));
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "Could not extract keywords from the tweet.",
        });
      }
    });
  };

  const [_, startTransition] = useTransition();

  return (
    <ScrollArea className="h-96">
      <div className="space-y-4 pr-4">
        {tweetStream.map((tweet, index) => (
          <Fragment key={tweet.id}>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={tweet.avatar} alt={tweet.author} data-ai-hint="person" />
                  <AvatarFallback>
                    {tweet.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{tweet.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {tweet.text}
                  </p>
                </div>
              </div>
              <div className="ml-11">
                {keywordsState[tweet.id]?.keywords ? (
                  <div className="flex flex-wrap gap-1">
                    {keywordsState[tweet.id].keywords?.map((kw) => (
                      <Badge key={kw} variant="secondary">{kw}</Badge>
                    ))}
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerate(tweet.id, tweet.text)}
                    disabled={keywordsState[tweet.id]?.isPending}
                  >
                    {keywordsState[tweet.id]?.isPending ? (
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                       <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Keywords
                  </Button>
                )}
              </div>
            </div>
            {index < tweetStream.length - 1 && <Separator />}
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
