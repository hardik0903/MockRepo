'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchLeaderboard, fetchCampaigns, fetchTrendingKeywords } from '@/lib/api';
import type { Campaigns, TrendingKeywords } from '@/lib/types';
import { Trophy, BarChart3, Cloud } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { TrendingKeywords as TrendingKeywordsCloud } from '@/components/dashboard/trending-keywords';

interface CampaignStats {
  antiIndia: number;
  notAnti: number;
}

export function TodaysInsights() {
  const [leader, setLeader] = useState<string | null>(null);
  const [campaignStats, setCampaignStats] = useState<CampaignStats | null>(null);
  const [keywords, setKeywords] = useState<TrendingKeywords | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [leaderboardData, campaignsData, keywordsData] = await Promise.all([
          fetchLeaderboard(),
          fetchCampaigns(),
          fetchTrendingKeywords(),
        ]);

        // Leaderboard
        if (leaderboardData) {
          const topUser = Object.entries(leaderboardData).sort(([, a], [, b]) => b - a)[0];
          setLeader(topUser ? topUser[0] : 'N/A');
        }

        // Campaigns
        if (campaignsData) {
          const stats: CampaignStats = { antiIndia: 0, notAnti: 0 };
          Object.values(campaignsData).forEach(global => {
            Object.values(global).forEach(local => {
              if (local.label === 'anti-india') {
                stats.antiIndia += 1;
              } else {
                stats.notAnti += 1;
              }
            });
          });
          setCampaignStats(stats);
        }

        // Keywords
        setKeywords(keywordsData);

      } catch (error) {
        console.error("Failed to load insights:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const chartData = campaignStats ? [
    { name: 'Anti-India', count: campaignStats.antiIndia, fill: 'hsl(var(--destructive))' },
    { name: 'Not Anti-India', count: campaignStats.notAnti, fill: 'hsl(var(--primary))' },
  ] : [];

  return (
    <div className="py-16 md:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-silver-fade">
          Today's Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Cards */}
          <div className="space-y-8">
            <Card className="bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <CardTitle>Most Hateful Account</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-10 w-48" /> : (
                  <p className="text-3xl font-bold text-destructive">{leader || 'N/A'}</p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <BarChart3 className="w-8 h-8 text-primary" />
                  <CardTitle>Campaign Breakdown</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-48 w-full" /> : (
                   <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                   </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Right Word Cloud */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Cloud className="w-8 h-8 text-primary" />
                  <CardTitle>Trending Keywords</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="min-h-[400px]">
                {loading ? <Skeleton className="h-full w-full" /> : (
                    keywords ? <TrendingKeywordsCloud /> : <p className="text-muted-foreground">Could not load keywords.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
