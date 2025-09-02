"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { userEngagementData } from "@/lib/mock-data"

const chartConfig = {
  likes: {
    label: "Likes",
    color: "hsl(var(--chart-1))",
  },
  retweets: {
    label: "Retweets",
    color: "hsl(var(--chart-2))",
  },
  replies: {
    label: "Replies",
    color: "hsl(var(--chart-5))",
  },
}

export function UserEngagementChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={userEngagementData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="likes" fill="var(--color-likes)" radius={4} />
          <Bar dataKey="retweets" fill="var(--color-retweets)" radius={4} />
          <Bar dataKey="replies" fill="var(--color-replies)" radius={4} />
        </BarChart>
      </ChartContainer>
  )
}
