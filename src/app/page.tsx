import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Globe, Library, ShieldCheck, Rss, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { BackgroundRipple } from '@/components/ui/background-ripple';
import { Input } from '@/components/ui/input';
import { CampaignBubbleChart } from '@/components/home/campaign-bubble-chart';


const features = [
  {
    icon: <BrainCircuit className="h-8 w-8 text-white" />,
    title: 'Advanced AI Analysis',
    description: 'Leverage cutting-edge AI to analyze tweet content, identify hate speech, and discover emerging keywords in real-time.',
  },
  {
    icon: <Globe className="h-8 w-8 text-white" />,
    title: 'Geolocation Heatmaps',
    description: 'Visualize the geographic origins of tweets on an interactive map to understand regional trends and campaign hotspots.',
  },
  {
    icon: <Rss className="h-8 w-8 text-white" />,
    title: 'Real-time Feed',
    description: 'Monitor a live feed of the most viral and most hateful tweets, keeping you updated on the latest online activity.',
  },
  {
    icon: <Library className="h-8 w-8 text-white" />,
    title: 'Campaign Tracking',
    description: 'Organize and explore global and local campaigns, tracking their descriptions and associated labels.',
  },
];

const AnimatedGetStartedButton = () => (
    <Link href="/dashboard">
        <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-800 px-6 font-medium text-neutral-50 transition-all duration-300 hover:bg-neutral-900">
            <span className="relative">Get Started</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20"></div>
            </div>
        </button>
    </Link>
);

const ThreeDCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="group w-[300px] [perspective:1000px] p-5">
        <div className="relative h-full w-full rounded-xl border-2 border-neutral-300 bg-neutral-100/70 p-6 text-neutral-800 shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(18deg)]">
            <div className="relative z-10 flex flex-col gap-4">
                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-white">
                    {icon}
                 </div>
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="text-sm text-neutral-600">{description}</p>
                <span className="text-sm font-bold text-neutral-800">See More &rarr;</span>
            </div>
        </div>
    </div>
)


export default function HomePage() {
  return (
    <div className="w-full relative overflow-hidden bg-white text-black">
      <BackgroundRipple className="absolute inset-0" />
      
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center md:justify-items-start px-8 md:px-16 pt-32 pb-16">
            <div className="text-center md:text-left">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-neutral-600 to-neutral-900 bg-clip-text text-transparent">
                    SentinelX
                </h1>
                <p className="mt-4 text-xl md:text-2xl text-neutral-600 max-w-md">
                    Detecting Threats, Defending Truth.
                </p>
                <div className="mt-8">
                   <Link href="/dashboard">
                    <button className="group relative flex items-center bg-neutral-800 text-white font-medium py-3 pl-6 pr-12 rounded-lg overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl">
                        Get started
                        <div className="absolute right-0 top-0 h-full w-10 bg-white flex items-center justify-center transform transition-all duration-300 group-hover:w-full">
                        <ArrowRight className="h-6 w-6 text-neutral-800 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </button>
                   </Link>
                </div>
            </div>
             <div className="w-full max-w-md">
                <Card className="bg-white/50 backdrop-blur-sm border-neutral-300">
                    <CardHeader>
                        <CardTitle className="text-neutral-800 text-2xl font-bold">Analyze a Tweet</CardTitle>
                        <CardContent className="text-neutral-600 p-0 pt-2">Enter tweet data to get an instant analysis.</CardContent>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                       <Input placeholder="Paste JSON here..." className="bg-white/70 border-neutral-400 text-black placeholder:text-neutral-500" />
                       <Link href="/dashboard" className="w-full">
                        <Button className="w-full bg-neutral-800 hover:bg-neutral-900 text-white">Send</Button>
                       </Link>
                    </CardContent>
                </Card>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-8">
            <div className="container mx-auto flex flex-wrap justify-center gap-8">
                {features.map(feature => (
                    <div key={feature.title} className="group w-[300px] [perspective:1000px] p-1">
                        <div className="relative h-full w-full rounded-xl border-2 border-neutral-700 bg-neutral-800 p-6 text-white shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(18deg)]">
                             <div className="absolute inset-0 h-full w-full rounded-xl bg-black/80 px-12 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                <div className="flex min-h-full flex-col items-center justify-center">
                                    <p>{feature.description}</p>
                                </div>
                            </div>
                            <div className="relative z-10 flex flex-col gap-4 [backface-visibility:hidden]">
                                {feature.icon}
                                <h3 className="text-2xl font-bold">{feature.title}</h3>
                                <span className="text-sm font-semibold">Hover to learn more</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
        
        {/* Brand Statement Section */}
        <section className="py-24 px-8 md:px-16 bg-neutral-100">
            <div className="container mx-auto">
                <div className="max-w-3xl">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-neutral-600 to-neutral-900 bg-clip-text text-transparent">What is SentinelX?</h2>
                    <p className="mt-6 text-lg text-neutral-700 leading-relaxed">
                        SentinelX is an advanced AI platform designed to safeguard digital discourse by detecting and analyzing anti-India narratives on social media. It performs deep text analysis in real-time to classify threats, identify propaganda campaigns, and extract hateful keywords. As a self-improving system, SentinelX constantly learns from new data to adapt to evolving tactics. We deliver the critical intelligence necessary to protect online discourse and neutralize misinformation campaigns effectively.
                    </p>
                </div>
            </div>
        </section>
        
        {/* Campaign Visualization Section */}
        <section className="py-24 px-8 bg-white">
             <div className="container mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-neutral-600 to-neutral-900 bg-clip-text text-transparent">Campaign Explorer</h2>
                <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
                    An interactive visualization of global and local campaigns. Bubble size represents the volume of activity. Click to dive deeper.
                </p>
                <div className="mt-12 w-full h-[600px] max-w-4xl mx-auto">
                    <CampaignBubbleChart />
                </div>
             </div>
        </section>

        <footer className="border-t border-neutral-200 py-8 px-4 md:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-neutral-800" />
                    <span className="font-semibold">SentinelX</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span>Powered by Google AI & Google Cloud</span>
                </div>
                <nav className="flex gap-4 text-sm font-medium">
                     <Link href="/dashboard" className="text-neutral-600 hover:text-neutral-900 transition-colors">Dashboard</Link>
                     <Link href="/feed" className="text-neutral-600 hover:text-neutral-900 transition-colors">Feed</Link>
                     <Link href="/analytics" className="text-neutral-600 hover:text-neutral-900 transition-colors">Analytics</Link>
                </nav>
            </div>
        </footer>

      </div>
    </div>
  );
}
