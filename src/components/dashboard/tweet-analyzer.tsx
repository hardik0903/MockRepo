'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud, FileJson, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeTweet } from '@/lib/api';
import type { AnalyzeResult, TweetInput } from '@/lib/types';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

const placeholderJson: TweetInput = {
  tid: "user_id_123",
  tusername: "@example_user",
  tlocation: "Some City, Country",
  tretweets: "150",
  tlikes: "2000",
  tcomments: "45",
  tdescription: "This is an example tweet description for analysis..."
};

const formatPlaceholder = (obj: object) => JSON.stringify(obj, null, 2);

export function TweetAnalyzer() {
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileAnalyze = async (file: File) => {
    setResult(null);
    setIsPending(true);

    try {
      const fileContent = await file.text();
      const tweetData: TweetInput = JSON.parse(fileContent);

      // Basic validation
      if (!tweetData.tdescription || typeof tweetData.tdescription !== 'string') {
        throw new Error("JSON must have a 'tdescription' property of type string.");
      }

      const analysisResult = await analyzeTweet(tweetData);
      setResult(analysisResult);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Invalid File or Analysis Failed',
        description: error instanceof Error ? error.message : "Could not process the file. Please ensure it's a valid JSON.",
      });
      setSelectedFile(null); // Clear the file on error
    } finally {
      setIsPending(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      handleFileAnalyze(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  });

  const getResultColor = (category: string) => {
    switch (category.toLowerCase()) {
        case 'anti-india':
            return 'text-destructive';
        case 'not-anti':
            return 'text-green-500';
        default:
            return 'text-accent';
    }
  };


  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Tweet Analyzer</CardTitle>
        <CardDescription>
          Upload or drag and drop a tweet data JSON file to analyze its content.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
            <div
              {...getRootProps()}
              className={cn(
                'flex-grow border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors',
                isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
              )}
            >
              <input {...getInputProps()} />
              {selectedFile && !isPending ? (
                 <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileJson className="w-12 h-12" />
                    <p className="font-semibold">{selectedFile.name}</p>
                    <p className="text-xs">Drop another file to replace</p>
                    <Button variant="ghost" size="sm" className="mt-2" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setResult(null);}}>
                        <X className="mr-2 h-4 w-4" /> Clear
                    </Button>
                 </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud className="w-12 h-12" />
                    <p className="font-semibold">
                      {isDragActive ? 'Drop the file here ...' : "Drag 'n' drop or click to upload"}
                    </p>
                    <p className="text-xs">JSON file required</p>
                </div>
              )}
            </div>
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
                    <p className={cn(
                        "text-3xl font-bold capitalize tracking-wider",
                        getResultColor(result.flaggedtype.category)
                    )}>
                    {result.flaggedtype.category.replace(/_/g, ' ')}
                    </p>
                </div>
            )}
            </div>
        </div>
      </CardContent>
       <CardFooter className="text-xs text-muted-foreground">
        Required JSON format: {`{ "tid": "...", "tusername": "...", ... }`}
      </CardFooter>
    </Card>
  );
}
