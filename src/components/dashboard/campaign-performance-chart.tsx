"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { campaignPerformanceData as initialData } from "@/lib/mock-data";
import { useState, useEffect } from "react";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-5))",
  },
};

export function CampaignPerformanceChart() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData];
        const lastEntry = newData[newData.length - 1];
        
        // Remove the first element
        newData.shift();

        // Add a new element at the end
        const newMonth = new Date(lastEntry.month);
        newMonth.setMonth(newMonth.getMonth() + 1);

        newData.push({
          month: newMonth.toLocaleString('default', { month: 'short' }),
          desktop: Math.floor(Math.random() * (400 - 100 + 1)) + 100,
          mobile: Math.floor(Math.random() * (450 - 150 + 1)) + 150,
        });

        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Line
          dataKey="desktop"
          type="monotone"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="mobile"
          type="monotone"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
