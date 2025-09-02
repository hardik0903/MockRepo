import type { LocationData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

export function LocationList({ data, loading }: { data: LocationData | null, loading: boolean }) {
    const sortedLocations = data ? Object.entries(data).sort(([,a],[,b]) => b-a) : [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Locations by Tweet Count</CardTitle>
                <CardDescription>Breakdown of tweet origins.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[650px] pr-4">
                    <div className="space-y-4">
                        {loading ? (
                            [...Array(10)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-6 w-12" />
                                </div>
                            ))
                        ) : sortedLocations.length > 0 ? (
                            sortedLocations.map(([location, count]) => (
                                <div key={location} className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <span className="text-sm font-medium truncate">{location}</span>
                                    </div>
                                    <Badge variant="secondary" className="flex-shrink-0">{count}</Badge>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">No location data available.</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
