"use client";

import { useState, useTransition } from "react";
import { generateTrendingKeywords } from "@/ai/flows/trending-keyword-generation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const placeholderJson = JSON.stringify(
  {
    id: "123456789",
    text: "Just announced our new AI-powered analytics platform at the #FutureTech conference! It's going to revolutionize data insights. #AI #BigData",
    author: "TechInnovator",
  },
  null,
  2
);

export function TweetAnalyzer() {
  const [jsonInput, setJsonInput] = useState(placeholderJson);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAnalyze = () => {
    let tweetText = "";
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (typeof parsedJson.text !== "string") {
        throw new Error("JSON must have a 'text' property of type string.");
      }
      tweetText = parsedJson.text;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid JSON",
        description: (error as Error).message,
      });
      return;
    }

    setKeywords([]);
    startTransition(async () => {
      const result = await generateTrendingKeywords({ tweet: tweetText });
      if (result && result.keywords) {
        setKeywords(result.keywords);
      } else {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "Could not extract keywords from the tweet.",
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Paste tweet JSON here..."
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows={8}
        className="font-mono text-xs"
      />
      <Button onClick={handleAnalyze} disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Analyze Tweet
      </Button>
      {keywords.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-sm">Generated Keywords:</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
              <Badge key={i} variant="secondary">
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
