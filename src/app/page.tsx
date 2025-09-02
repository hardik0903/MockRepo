import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Globe, Library, ShieldCheck, Rss } from 'lucide-react';
import Link from 'next/link';
import { KeywordTicker } from '@/components/home/keyword-ticker';
import { TodaysInsights } from '@/components/home/todays-insights';
import { Icons } from '@/components/icons';

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

const socialProofLogos = [
  { name: 'TechCorp', logo: <Icons.logo className="w-32 h-12 text-muted-foreground" /> },
  { name: 'Innovate Inc.', logo: <Icons.logo className="w-32 h-12 text-muted-foreground" /> },
  { name: 'Data Insights', logo: <Icons.logo className="w-32 h-12 text-muted-foreground" /> },
  { name: 'SecureNet', logo: <Icons.logo className="w-32 h-12 text-muted-foreground" /> },
  { name: 'Global Solutions', logo: <Icons.logo className="w-32 h-12 text-muted-foreground" /> },
];

export default function HomePage() {
  return (
    <div className="w-full relative overflow-hidden">
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
          <ShieldCheck className="h-24 w-24 text-primary mb-6" />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-silver-fade">
            SentinelX
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Detecting Threats, Defending Truth.
          </p>
          <KeywordTicker />
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/dashboard">
              <Button size="lg">
                Go to Dashboard
              </Button>
            </Link>
             <Link href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <TodaysInsights />

        <div id="features" className="py-16 md:py-24 px-4 md:px-8 bg-background/50 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-silver-fade">
              How SentinelX Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-muted/40 border-primary/20 backdrop-blur-sm">
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

        <div className="py-16 md:py-24">
            <div className="max-w-5xl mx-auto px-4">
                <h3 className="text-center text-muted-foreground font-semibold tracking-wider mb-8">TRUSTED BY LEADING ORGANIZATIONS</h3>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                    {socialProofLogos.map(p => (
                        <div key={p.name}>{p.logo}</div>
                    ))}
                </div>
            </div>
        </div>

        <footer className="border-t border-border/50 py-8 px-4 md:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span className="font-semibold">SentinelX</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Powered by Google AI & Google Cloud</span>
                </div>
                <nav className="flex gap-4 text-sm font-medium">
                     <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
                     <Link href="/feed" className="text-muted-foreground hover:text-primary transition-colors">Feed</Link>
                     <Link href="/analytics" className="text-muted-foreground hover:text-primary transition-colors">Analytics</Link>
                </nav>
            </div>
        </footer>

      </div>
    </div>
  );
}
