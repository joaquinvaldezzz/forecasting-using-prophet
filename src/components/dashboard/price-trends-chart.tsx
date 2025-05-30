"use client";

import { useId } from "react";
import { CartesianGrid, Line, LineChart, Rectangle, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { CustomTooltipContent } from "@/components/charts-extra";

const data = [
  { year: "2018", rice: 35, vegetables: 25, meat: 250 },
  { year: "2019", rice: 38, vegetables: 28, meat: 260 },
  { year: "2020", rice: 42, vegetables: 32, meat: 270 },
  { year: "2021", rice: 40, vegetables: 30, meat: 265 },
  { year: "2022", rice: 43, vegetables: 33, meat: 275 },
  { year: "2023", rice: 45, vegetables: 35, meat: 280 },
  { year: "2024", rice: 48, vegetables: 38, meat: 285 },
  { year: "2025", rice: 50, vegetables: 40, meat: 290 },
];

const chartConfig = {
  rice: {
    label: "Rice",
    color: "var(--chart-1)",
  },
  vegetables: {
    label: "Vegetables",
    color: "var(--chart-2)",
  },
  meat: {
    label: "Meat",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

interface CustomCursorProps {
  fill?: string;
  pointerEvents?: string;
  height?: number;
  points?: Array<{ x: number; y: number }>;
  className?: string;
}

function CustomCursor(props: CustomCursorProps) {
  const { fill, pointerEvents, height, points, className } = props;

  if (!points || points.length === 0) {
    return null;
  }

  const { x, y } = points[0]!;
  return (
    <>
      <Rectangle
        x={x - 12}
        y={y}
        fill={fill}
        pointerEvents={pointerEvents}
        width={24}
        height={height}
        className={className}
        type="linear"
      />
      <Rectangle
        x={x - 1}
        y={y}
        fill={fill}
        pointerEvents={pointerEvents}
        width={1}
        height={height}
        className="recharts-tooltip-inner-cursor"
        type="linear"
      />
    </>
  );
}

export function PriceTrendsChart() {
  const id = useId();

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle>NCR Food Price Trends</CardTitle>
            <div className="flex items-start gap-2">
              <div className="text-2xl font-semibold">2018-2025</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div aria-hidden="true" className="size-1.5 shrink-0 rounded-xs bg-chart-1"></div>
              <div className="text-[13px]/3 text-muted-foreground/50">Rice</div>
            </div>
            <div className="flex items-center gap-2">
              <div aria-hidden="true" className="size-1.5 shrink-0 rounded-xs bg-chart-2"></div>
              <div className="text-[13px]/3 text-muted-foreground/50">Vegetables</div>
            </div>
            <div className="flex items-center gap-2">
              <div aria-hidden="true" className="size-1.5 shrink-0 rounded-xs bg-chart-3"></div>
              <div className="text-[13px]/3 text-muted-foreground/50">Meat</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-60 w-full [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-(--chart-1)/15 [&_.recharts-rectangle.recharts-tooltip-inner-cursor]:fill-white/20"
        >
          <LineChart accessibilityLayer data={data} margin={{ left: -12, right: 12, top: 12 }}>
            <defs>
              <linearGradient id={`${id}-gradient-1`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--chart-2)" />
                <stop offset="100%" stopColor="var(--chart-1)" />
              </linearGradient>
              <linearGradient id={`${id}-gradient-2`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--chart-3)" />
                <stop offset="100%" stopColor="var(--chart-2)" />
              </linearGradient>
              <linearGradient id={`${id}-gradient-3`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--chart-4)" />
                <stop offset="100%" stopColor="var(--chart-3)" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="2 2" stroke="var(--border)" />
            <XAxis dataKey="year" tickLine={false} tickMargin={12} stroke="var(--border)" />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `₱${value}`}
              interval="preserveStartEnd"
            />
            <ChartTooltip
              content={
                <CustomTooltipContent
                  colorMap={{
                    rice: "var(--chart-1)",
                    vegetables: "var(--chart-2)",
                    meat: "var(--chart-3)",
                  }}
                  labelMap={{
                    rice: "Rice",
                    vegetables: "Vegetables",
                    meat: "Meat",
                  }}
                  dataKeys={["rice", "vegetables", "meat"]}
                  valueFormatter={(value) => `₱${value}/kg`}
                />
              }
              cursor={<CustomCursor fill="var(--chart-1)" />}
            />
            <Line
              type="linear"
              dataKey="rice"
              stroke={`url(#${id}-gradient-1)`}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: "var(--chart-1)",
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
            />
            <Line
              type="linear"
              dataKey="vegetables"
              stroke={`url(#${id}-gradient-2)`}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: "var(--chart-2)",
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
            />
            <Line
              type="linear"
              dataKey="meat"
              stroke={`url(#${id}-gradient-3)`}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: "var(--chart-3)",
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
