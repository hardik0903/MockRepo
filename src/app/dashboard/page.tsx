import { StatsCards } from "@/components/dashboard/stats-cards";
import { TweetAnalyzer } from "@/components/dashboard/tweet-analyzer";
import { TrendingKeywords } from "@/components/dashboard/trending-keywords";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TweetAnalyzer />
        </div>
        <div>
          <TrendingKeywords />
        </div>
      </div>
    </div>
  );
}
