'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud, FileJson, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeTweet } from '@/lib/api';
import type { AnalyzeResult, TweetInput } from '@/lib/types';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';


export function TweetAnalyzer() {
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileAnalyze = async (file: File) => {
    setResult(null);
    setIsPending(true);
    setSelectedFile(file);

    try {
      const fileContent = await file.text();
      const tweetData: TweetInput = JSON.parse(fileContent);

      if (!tweetData.tdescription || typeof tweetData.tdescription !== 'string') {
        throw new Error("JSON must have a 'tdescription' property of type string.");
      }

      const analysisResult = await analyzeTweet(tweetData);
      setResult(analysisResult);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : "Could not process the file. Please ensure it's a valid JSON.",
      });
      setSelectedFile(null); 
    } finally {
      setIsPending(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileAnalyze(acceptedFiles[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  });

  const category = result?.flaggedtype?.category?.toLowerCase();
  const isAntiIndia = category === 'anti-india';

  return (
    <div className="w-full text-center py-16 px-4">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 text-silver-fade">
            Analyze a Tweet
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            The core of SentinelX. Upload a tweet's data in JSON format to get an instant analysis and update all platform metrics.
        </p>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div
              {...getRootProps()}
              className={cn(
                'relative h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors',
                isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
              )}
            >
              <input {...getInputProps()} />
              <div className="z-10 flex flex-col items-center gap-2 text-muted-foreground">
                {isPending ? (
                    <Loader2 className="w-12 h-12 animate-spin" />
                ) : (
                    <>
                    <UploadCloud className="w-12 h-12" />
                    <p className="font-semibold mt-4">
                      {isDragActive ? 'Drop the file here...' : "Drag & drop or click to upload"}
                    </p>
                    <p className="text-xs">JSON file required</p>
                    </>
                )}
              </div>
            </div>

            <div className="h-64 rounded-lg bg-muted/30 flex flex-col items-center justify-center p-6">
            {isPending && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
            {!isPending && !result && (
                <div className="text-center text-muted-foreground">
                    <FileJson className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-semibold">Awaiting Analysis</p>
                    <p className="text-sm">Results will appear here.</p>
                </div>
            )}
            {result && (
                <div className="text-center">
                    {isAntiIndia ? (
                        <ShieldAlert className="w-16 h-16 mx-auto text-destructive" />
                    ) : (
                        <ShieldCheck className="w-16 h-16 mx-auto text-green-500" />
                    )}
                    <p className="text-sm text-muted-foreground mt-4">Detected Category</p>
                    <p className={cn(
                        "text-4xl font-bold capitalize tracking-wider mt-1",
                        isAntiIndia ? 'text-destructive' : 'text-green-500'
                    )}>
                        {result.flaggedtype.category.replace(/_/g, ' ')}
                    </p>
                </div>
            )}
            </div>
        </div>
         {selectedFile && !isPending && (
             <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                    Analyzed: <span className="font-medium text-foreground">{selectedFile.name}</span>
                </p>
                 <Button variant="ghost" size="sm" className="mt-1" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setResult(null);}}>
                    <X className="mr-2 h-4 w-4" /> Clear
                </Button>
            </div>
         )}
    </div>
  );
}
