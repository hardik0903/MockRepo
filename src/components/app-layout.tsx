import React from 'react';
import {
  BarChart2,
  BrainCircuit,
  LayoutDashboard,
  Map,
  Menu,
  MessageSquare,
  Search,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from './icons';

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'network-graph', label: 'Network Graph', icon: BrainCircuit },
  { id: 'heatmap', label: 'Heatmap', icon: Map },
  { id: 'trending-keywords', label: 'Trending Keywords', icon: BarChart2 },
  { id: 'tweet-analyzer', label: 'Tweet Analyzer', icon: MessageSquare },
];

function SidebarNav() {
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Icons.logo className="h-6 w-6 text-primary" />
              <span className="">SentinelX</span>
            </a>
          </div>
          <div className="flex-1">
            <SidebarNav />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <a href="/" className="flex items-center gap-2 font-semibold">
                  <Icons.logo className="h-6 w-6 text-primary" />
                  <span className="">SentinelX</span>
                </a>
              </div>
              <SidebarNav />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://picsum.photos/100/100" alt="User Avatar" data-ai-hint="person" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
