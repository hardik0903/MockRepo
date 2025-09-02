import { Activity, BarChart, DollarSign, Users } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignPerformanceChart } from "@/components/dashboard/campaign-performance-chart";
import { UserEngagementChart } from "@/components/dashboard/user-engagement-chart";
import { NetworkGraph3D } from "@/components/dashboard/network-graph-3d";
import { TweetHeatmap } from "@/components/dashboard/tweet-heatmap";
import { TrendingKeywords } from "@/components/dashboard/trending-keywords";
import { TweetAnalyzer } from "@/components/dashboard/tweet-analyzer";

export default function Home() {
  return (
    <AppLayout>
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Campaign Activity
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <Card id="overview" className="col-span-full">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <CampaignPerformanceChart />
            </CardContent>
          </Card>
          <Card id="network-graph" className="col-span-full">
            <CardHeader>
              <CardTitle>3D Network Graph</CardTitle>
            </CardHeader>
            <CardContent>
              <NetworkGraph3D />
            </CardContent>
          </Card>
          <Card id="heatmap" className="col-span-full">
            <CardHeader>
              <CardTitle>Tweet Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <TweetHeatmap />
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
          <Card id="trending-keywords">
            <CardHeader>
              <CardTitle>Trending Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendingKeywords />
            </CardContent>
          </Card>
          <Card id="tweet-analyzer">
            <CardHeader>
              <CardTitle>Tweet Analyzer</CardTitle>
            </CardHeader>
            <CardContent>
              <TweetAnalyzer />
            </CardContent>
          </Card>
           <Card id="user-engagement" >
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <UserEngagementChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
