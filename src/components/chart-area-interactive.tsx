"use client";

import { useEffect, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { exportChartToCSV, exportChartToPDF, exportChartToPNG } from "@/lib/chart-export";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  price: {
    label: "Price",
    color: "var(--primary)",
  },
  upper_bound: {
    label: "Upper bound",
    color: "var(--primary)",
  },
  lower_bound: {
    label: "Lower bound",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  title: string;
  data: Array<{
    ds: string;
    price: number;
    lower_bound: number;
    upper_bound: number;
  }>;
}

/**
 * The chart area interactive.
 *
 * @param props The props to apply to the chart area interactive.
 * @param props.title The title of the chart.
 * @param props.data The data to display in the chart.
 * @returns The rendered chart area interactive.
 */
export function ChartAreaInteractive({ title, data }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("90d");
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData =
    data.length > 0
      ? data.filter((item) => {
          const date = new Date(item.ds);
          const referenceDate = new Date("2025-05-31");
          let daysToSubtract = 90;
          if (timeRange === "30d") {
            daysToSubtract = 30;
          } else if (timeRange === "7d") {
            daysToSubtract = 7;
          }
          const startDate = new Date(referenceDate);
          startDate.setDate(startDate.getDate() - daysToSubtract);
          return date >= startDate;
        })
      : [];

  const handleExport = async (format: "csv" | "png" | "pdf") => {
    if (chartRef.current == null || filteredData.length === 0) return;

    const filename = `${title}-${new Date().toISOString().split("T")[0]}`;

    switch (format) {
      case "csv":
        exportChartToCSV(filteredData, `${filename}.csv`);
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
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription>
          <span className="hidden @[540px]/card:block">Total for the last 3 months</span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription> */}
        <CardAction>
          <div className="flex gap-2">
            <Button
              disabled={filteredData.length === 0}
              size="sm"
              variant="outline"
              onClick={() => {
                void handleExport("csv");
              }}
            >
              Export CSV
            </Button>
            <Button
              disabled={filteredData.length === 0}
              size="sm"
              variant="outline"
              onClick={() => {
                void handleExport("png");
              }}
            >
              Export PNG
            </Button>
            <Button
              disabled={filteredData.length === 0}
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
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillLowerBound" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-lower_bound)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-lower_bound)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillUpperBound" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-upper_bound)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-upper_bound)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="ds"
              minTickGap={32}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (typeof value === "string") {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }
                return "";
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => {
                    if (typeof value === "string") {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }
                    return "";
                  }}
                />
              }
            />
            <Area
              type="natural"
              dataKey="price"
              fill="url(#fillLowerBound)"
              stackId="a"
              stroke="var(--color-lower_bound)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
