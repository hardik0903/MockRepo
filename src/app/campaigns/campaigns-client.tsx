'use client';
import { useEffect, useState } from 'react';
import { fetchCampaigns } from '@/lib/api';
import type { Campaigns } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CampaignsClient() {
  const [campaigns, setCampaigns] = useState<Campaigns | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
        if (data && Object.keys(data).length > 0) {
            setSelectedCampaign(Object.keys(data)[0]);
        }
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedCampaignData = campaigns && selectedCampaign ? campaigns[selectedCampaign] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 h-[calc(100vh-10rem)]">
        <div className="md:col-span-1 h-full">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Global Campaigns</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow p-2">
                    <ScrollArea className="h-full">
                        {loading ? (
                             <div className="space-y-2 p-4">
                                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                             </div>
                        ) : campaigns ? (
                            Object.entries(campaigns).map(([global, locals]) => (
                                <button key={global} onClick={() => setSelectedCampaign(global)} className={`w-full text-left p-2 rounded-md transition-colors ${selectedCampaign === global ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold capitalize">{global.replace(/_/g, ' ')}</span>
                                        <Badge variant="secondary">{Object.keys(locals).length}</Badge>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground p-4">No campaigns found.</p>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-3 h-full">
             <Card className="h-full flex flex-col">
                <CardHeader>
                    {selectedCampaign && <CardTitle className="capitalize">Local Campaigns: {selectedCampaign.replace(/_/g, ' ')}</CardTitle>}
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                        {loading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                        ) : selectedCampaignData ? (
                            <Accordion type="single" collapsible className="w-full" defaultValue={Object.keys(selectedCampaignData)[0]}>
                               {Object.entries(selectedCampaignData).map(([local, data]) => (
                                   <AccordionItem key={local} value={local}>
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-4">
                                                <span className="font-semibold capitalize">{local.replace(/_/g, ' ')}</span>
                                                <Badge variant={data.label === 'anti-india' ? 'destructive' : 'default'}>{data.label.replace(/-/g, ' ')}</Badge>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2">
                                                {data.tdescription.map((desc, i) => (
                                                    <p key={i} className="text-sm text-muted-foreground border-l-2 pl-4 border-primary">{desc}</p>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                   </AccordionItem>
                               ))}
                            </Accordion>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground">Select a global campaign to view details.</p>
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
             </Card>
        </div>
    </div>
  );
}
