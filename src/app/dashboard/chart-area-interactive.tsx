"use client";

import { useRef } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { exportChartToCSV, exportChartToPDF, exportChartToPNG } from "@/lib/chart-export";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  rice: {
    label: "Rice",
    color: "var(--chart-1)",
  },
  vegetables: {
    label: "Vegetables",
    color: "var(--chart-4)",
  },
  meat: {
    label: "Meat",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: Array<{
    month: string;
    rice: number;
    vegetables: number;
    meat: number;
  }>;
}

/**
 * The chart area interactive.
 *
 * @param props The props to apply to the chart area interactive.
 * @param props.data The data to display in the chart.
 * @returns The rendered chart area interactive.
 */
export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const chartRef = useRef<HTMLDivElement>(null);
  const handleExport = async (format: "csv" | "png" | "pdf") => {
    if (chartRef.current == null || data.length === 0) return;

    const filename = `food-price-forecasts-${new Date().toISOString().split("T")[0]}`;

    switch (format) {
      case "csv":
        exportChartToCSV(data, `${filename}.csv`);
        break;
      case "png":
        await exportChartToPNG(chartRef.current, `${filename}.png`);
        break;
      case "pdf":
        await exportChartToPDF(chartRef.current, `${filename}.pdf`);
        break;
    }
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Latest food price forecasts</CardTitle>

        <CardAction>
          <div className="flex gap-2">
            <Button
              disabled={data.length === 0}
              size="sm"
              variant="outline"
              onClick={() => {
                void handleExport("csv");
              }}
            >
              Export CSV
            </Button>
            <Button
              disabled={data.length === 0}
              size="sm"
              variant="outline"
              onClick={() => {
                void handleExport("png");
              }}
            >
              Export PNG
            </Button>
            <Button
              disabled={data.length === 0}
              size="sm"
              variant="outline"
              onClick={() => {
                void handleExport("pdf");
              }}
            >
              Export PDF
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer className="aspect-auto h-64 w-full" config={chartConfig} ref={chartRef}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillRice" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-rice)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-rice)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillVegetables" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-vegetables)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-vegetables)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMeat" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-meat)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-meat)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              minTickGap={32}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dot" />}
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
            />
            <Area
              type="natural"
              dataKey="rice"
              fill="url(#fillRice)"
              stackId="a"
              stroke="var(--color-rice)"
            />
            <Area
              type="natural"
              dataKey="vegetables"
              fill="url(#fillVegetables)"
              stackId="a"
              stroke="var(--color-vegetables)"
            />
            <Area
              type="natural"
              dataKey="meat"
              fill="url(#fillMeat)"
              stackId="a"
              stroke="var(--color-meat)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
