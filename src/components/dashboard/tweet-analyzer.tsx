'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeTweet } from '@/lib/api';
import type { AnalyzeResult, TweetInput } from '@/lib/types';

const placeholderJson: TweetInput = {
  tid: "",
  tusername: "",
  tlocation: "",
  tretweets: "",
  tlikes: "",
  tcomments: "",
  tdescription: ""
};

const formatPlaceholder = (obj: object) => JSON.stringify(obj, null, 2);

export function TweetAnalyzer() {
  const [jsonInput, setJsonInput] = useState(formatPlaceholder(placeholderJson));
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    let tweetData: TweetInput;
    try {
      const parsedJson = JSON.parse(jsonInput);
      // Basic validation
      if (!parsedJson.tdescription || typeof parsedJson.tdescription !== 'string') {
        throw new Error("JSON must have a 'tdescription' property of type string.");
      }
      tweetData = parsedJson;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Invalid JSON',
        description: error instanceof Error ? error.message : "The provided text is not valid JSON.",
      });
      return;
    }

    setResult(null);
    setIsPending(true);

    try {
      const analysisResult = await analyzeTweet(tweetData);
      setResult(analysisResult);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the tweet. Please try again.',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Tweet Analyzer</CardTitle>
        <CardDescription>
          Paste tweet data in JSON format to analyze its content.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
            <p className="text-sm font-medium">Input Tweet JSON</p>
            <Textarea
                placeholder="Paste tweet JSON here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={12}
                className="font-mono text-xs flex-grow"
            />
        </div>
        <div className="flex flex-col gap-4">
            <p className="text-sm font-medium">Analysis Result</p>
            <div className="flex-grow rounded-md border bg-muted/50 p-4 flex items-center justify-center">
            {isPending && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
            {!isPending && !result && (
                <p className="text-sm text-muted-foreground text-center">
                Results will be displayed here after analysis.
                </p>
            )}
            {result && (
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Detected Category</p>
                    <p className="text-2xl font-bold capitalize text-accent">
                    {result.flaggedtype.category.replace(/_/g, ' ')}
                    </p>
                </div>
            )}
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalyze} disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Analyze Tweet
        </Button>
      </CardFooter>
    </Card>
  );
}
