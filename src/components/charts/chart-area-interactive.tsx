"use client";

import { useId, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, Rectangle, XAxis, YAxis } from "recharts";

import { exportChartToCSV, exportChartToPDF, exportChartToPNG } from "@/lib/chart-export";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomTooltipContent } from "@/components/charts-extra";

/**
 * The chart data.
 *
 * @param props The props.
 * @returns The rendered chart data.
 */
interface ChartData {
  month: string;
  [key: string]: string | number;
}

/**
 * The chart area interactive props.
 *
 * @param props The props.
 * @returns The rendered chart area interactive props.
 */
interface ChartAreaInteractiveProps {
  title: string;
  years: string[];
  fetchData: (year: string) => Promise<ChartData[]>;
  config: ChartConfig;
  defaultYear?: string;
  exportPrefix?: string;
}

/**
 * The custom cursor props.
 *
 * @param props The props.
 * @returns The rendered custom cursor props.
 */
interface CustomCursorProps {
  fill?: string;
  pointerEvents?: string;
  height?: number;
  points?: Array<{ x: number; y: number }>;
  className?: string;
}

/**
 * The custom cursor.
 *
 * @param props The props.
 * @returns The rendered custom cursor.
 */
function CustomCursor(props: CustomCursorProps) {
  const { fill, pointerEvents, height, points, className } = props;

  if (points == null || points.length === 0) {
    return null;
  }

  const { x, y } = points[0];
  return (
    <>
      <Rectangle
        className={className}
        width={24}
        type="linear"
        fill={fill}
        height={height}
        pointerEvents={pointerEvents}
        x={x - 12}
        y={y}
      />
      <Rectangle
        className="recharts-tooltip-inner-cursor"
        width={1}
        type="linear"
        fill={fill}
        height={height}
        pointerEvents={pointerEvents}
        x={x - 1}
        y={y}
      />
    </>
  );
}

/**
 * The chart area interactive.
 *
 * @param props The props.
 * @param props.title The title of the chart.
 * @param props.years The years of the chart.
 * @param props.fetchData The fetch data function.
 * @param props.config The config of the chart.
 * @param props.defaultYear The default year of the chart.
 * @param props.exportPrefix The export prefix of the chart.
 * @returns The rendered chart area interactive.
 */
export function ChartAreaInteractive({
  title,
  years,
  fetchData,
  config,
  defaultYear = years[0],
  exportPrefix = "chart",
}: ChartAreaInteractiveProps) {
  const id = useId();
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  const { data: chartData, isLoading } = useQuery({
    queryKey: ["chartData", selectedYear],
    queryFn: async () => await fetchData(selectedYear),
  });

  const getAverageValue = (key: string) => {
    if (chartData == null) {
      return 0;
    }
    const sum = chartData.reduce((acc, curr) => acc + Number(curr[key]), 0);
    return Math.round(sum / chartData.length);
  };

  const getValueChange = (key: string) => {
    if (chartData == null || chartData.length < 2) return 0;
    const firstValue = Number(chartData[0][key]);
    const lastValue = Number(chartData[chartData.length - 1][key]);
    return Math.round(((lastValue - firstValue) / firstValue) * 100);
  };

  const handleExport = async (format: "csv" | "png" | "pdf") => {
    if (chartRef.current == null || chartData == null) return;

    const filename = `${exportPrefix}-${selectedYear}-${new Date().toISOString().split("T")[0]}`;

    switch (format) {
      case "csv":
        exportChartToCSV(chartData, `${filename}.csv`);
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
    <Card className="gap-4">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle>{title}</CardTitle>
            <div className="flex items-start gap-2">
              <div className="text-2xl font-semibold">{selectedYear}</div>
              {!isLoading && chartData != null && (
                <div className="text-sm text-muted-foreground">
                  {chartData.length} months of data
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {Object.entries(config).map(([key, { label, color }]) => (
              <div className="flex items-center gap-2" key={key}>
                <div
                  className="size-1.5 shrink-0 rounded-xs"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                ></div>
                <div className="text-[13px]/3 text-muted-foreground/50">
                  {label} (₱{getAverageValue(key)}/kg)
                  {!isLoading && chartData != null && (
                    <span className={getValueChange(key) >= 0 ? "text-red-500" : "text-green-500"}>
                      {getValueChange(key) >= 0 ? " ↑" : " ↓"} {Math.abs(getValueChange(key))}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              disabled={isLoading || chartData == null}
              size="sm"
              variant="outline"
              onClick={() => {
                void handleExport("csv");
              }}
            >
              Export CSV
            </Button>
            <Button
              disabled={isLoading || chartData == null}
              size="sm"
              variant="outline"
              onClick={() => {
                void handleExport("png");
              }}
            >
              Export PNG
            </Button>
            <Button
              disabled={isLoading || chartData == null}
              size="sm"
              variant="outline"
              onClick={() => {
                void handleExport("pdf");
              }}
            >
              Export PDF
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem value={year} key={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef}>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[240px] w-full" />
            </div>
          ) : (
            <ChartContainer
              className="aspect-auto h-60 w-full [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-(--chart-1)/15 [&_.recharts-rectangle.recharts-tooltip-inner-cursor]:fill-white/20"
              config={config}
            >
              <LineChart
                data={chartData}
                margin={{ left: -12, right: 12, top: 12 }}
                accessibilityLayer
              >
                <defs>
                  {Object.entries(config).map(([key, { color }], index) => (
                    <linearGradient
                      id={`${id}-gradient-${index + 1}`}
                      key={key}
                      x1="0"
                      x2="1"
                      y1="0"
                      y2="0"
                    >
                      <stop offset="0%" stopColor={color} />
                      <stop offset="100%" stopColor={color} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 2" vertical={false} />
                <XAxis dataKey="month" stroke="var(--border)" tickLine={false} tickMargin={12} />
                <YAxis
                  axisLine={false}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => `₱${value}`}
                  tickLine={false}
                />
                <ChartTooltip
                  cursor={<CustomCursor fill={Object.values(config)[0]?.color} />}
                  content={
                    <CustomTooltipContent
                      valueFormatter={(value) => `₱${value}/kg`}
                      dataKeys={Object.keys(config)}
                      colorMap={
                        Object.fromEntries(
                          Object.entries(config).map(([key, { color }]) => [key, color ?? ""]),
                        ) as Record<string, string>
                      }
                      labelMap={
                        Object.fromEntries(
                          Object.entries(config).map(([key, { label }]) => [key, label ?? ""]),
                        ) as Record<string, string>
                      }
                    />
                  }
                />
                {Object.entries(config).map(([key, { color }], index) => (
                  <Line
                    strokeWidth={2}
                    type="linear"
                    dataKey={key}
                    dot={false}
                    key={key}
                    stroke={`url(#${id}-gradient-${index + 1})`}
                    activeDot={{
                      r: 5,
                      fill: color,
                      stroke: "var(--background)",
                      strokeWidth: 2,
                    }}
                  />
                ))}
              </LineChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
