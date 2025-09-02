import { StatsCards } from "@/components/dashboard/stats-cards";
import { TweetAnalyzer } from "@/components/dashboard/tweet-analyzer";
import { TrendingKeywords } from "@/components/dashboard/trending-keywords";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-12">
      <TweetAnalyzer />
      <StatsCards />
      <Separator />
      <TrendingKeywords />
    </div>
  );
}
