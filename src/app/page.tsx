import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Globe, Library, ShieldCheck, Rss } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    title: 'Advanced AI Analysis',
    description: 'Leverage cutting-edge AI to analyze tweet content, identify hate speech, and discover emerging keywords in real-time.',
  },
  {
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: 'Geolocation Heatmaps',
    description: 'Visualize the geographic origins of tweets on an interactive map to understand regional trends and campaign hotspots.',
  },
  {
    icon: <Rss className="h-10 w-10 text-primary" />,
    title: 'Real-time Feed',
    description: 'Monitor a live feed of the most viral and most hateful tweets, keeping you updated on the latest online activity.',
  },
  {
    icon: <Library className="h-10 w-10 text-primary" />,
    title: 'Campaign Tracking',
    description: 'Organize and explore global and local campaigns, tracking their descriptions and associated labels (anti-india vs. not-anti).',
  },
];

export default function HomePage() {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
          <ShieldCheck className="h-24 w-24 text-primary mb-6" />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-silver-fade">
            SentinelX
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Detecting Threats, Defending Truth.
          </p>
          <Link href="/dashboard">
            <Button size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-16 md:py-24 px-4 md:px-8 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-silver-fade">
            How SentinelX Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-muted/40 border-primary/20">
                <CardHeader className="flex flex-row items-center gap-4">
                  {feature.icon}
                  <CardTitle className="text-2xl font-semibold m-0">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
