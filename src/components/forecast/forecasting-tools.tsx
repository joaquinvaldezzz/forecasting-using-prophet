"use client";

import { useId, useState } from "react";
import { CartesianGrid, Line, LineChart, Rectangle, XAxis, YAxis } from "recharts";

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
import { CustomTooltipContent } from "@/components/charts-extra";

const mockData = [
  { year: "2018", rice: 35, vegetables: 25, meat: 250 },
  { year: "2019", rice: 38, vegetables: 28, meat: 260 },
  { year: "2020", rice: 42, vegetables: 32, meat: 270 },
  { year: "2021", rice: 40, vegetables: 30, meat: 265 },
  { year: "2022", rice: 43, vegetables: 33, meat: 275 },
  { year: "2023", rice: 45, vegetables: 35, meat: 280 },
  { year: "2024", rice: 48, vegetables: 38, meat: 285 },
  { year: "2025", rice: 50, vegetables: 40, meat: 290 },
];

const commodities = [
  { value: "rice", label: "Rice" },
  { value: "vegetables", label: "Vegetables" },
  { value: "meat", label: "Meat" },
];

const years = [
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
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

/**
 * The custom cursor component.
 *
 * @param props The props to apply to the cursor.
 * @returns The rendered cursor.
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
 * The forecasting tools component.
 *
 * @returns The rendered forecasting tools.
 */
export function ForecastingTools() {
  const id = useId();
  const [selectedCommodity, setSelectedCommodity] = useState("rice");
  const [selectedYear, setSelectedYear] = useState("2024");

  /**
   * Handles the export of the selected commodity data.
   *
   * @param format The format to export the data in.
   */
  const handleExport = (format: string) => {
    // eslint-disable-next-line no-console -- TODO: Remove this comment when the export functionality is implemented
    console.log(`Exporting ${selectedCommodity} data for ${selectedYear} in ${format} format`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Commodity</label>
          <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select commodity" />
            </SelectTrigger>
            <SelectContent>
              {commodities.map((commodity) => (
                <SelectItem value={commodity.value} key={commodity.value}>
                  {commodity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem value={year.value} key={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="gap-4">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <CardTitle>Price Forecast Chart</CardTitle>
              <div className="flex items-start gap-2">
                <div className="text-2xl font-semibold">
                  {selectedCommodity.charAt(0).toUpperCase() + selectedCommodity.slice(1)}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="size-1.5 shrink-0 rounded-xs bg-chart-1" aria-hidden="true"></div>
                <div className="text-[13px]/3 text-muted-foreground/50">Historical</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 shrink-0 rounded-xs bg-chart-3" aria-hidden="true"></div>
                <div className="text-[13px]/3 text-muted-foreground/50">Forecast</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-auto h-60 w-full [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-(--chart-1)/15 [&_.recharts-rectangle.recharts-tooltip-inner-cursor]:fill-white/20"
            config={chartConfig}
          >
            <LineChart
              data={mockData}
              margin={{ left: -12, right: 12, top: 12 }}
              accessibilityLayer
            >
              <defs>
                <linearGradient id={`${id}-gradient`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="var(--chart-2)" />
                  <stop offset="100%" stopColor="var(--chart-1)" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="2 2" vertical={false} />
              <XAxis dataKey="year" stroke="var(--border)" tickLine={false} tickMargin={12} />
              <YAxis
                axisLine={false}
                interval="preserveStartEnd"
                tickFormatter={(value) => `₱${value}`}
                tickLine={false}
              />
              <ChartTooltip
                cursor={<CustomCursor fill="var(--chart-1)" />}
                content={
                  <CustomTooltipContent
                    valueFormatter={(value) => `₱${value}/kg`}
                    dataKeys={[selectedCommodity]}
                    colorMap={{
                      [selectedCommodity]: "var(--chart-1)",
                    }}
                    labelMap={{
                      [selectedCommodity]:
                        selectedCommodity.charAt(0).toUpperCase() + selectedCommodity.slice(1),
                    }}
                  />
                }
              />
              <Line
                strokeWidth={2}
                type="linear"
                dataKey={selectedCommodity}
                dot={false}
                stroke={`url(#${id}-gradient)`}
                activeDot={{
                  r: 5,
                  fill: "var(--chart-1)",
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={() => {
            handleExport("csv");
          }}
        >
          Export CSV
        </Button>
        <Button
          onClick={() => {
            handleExport("png");
          }}
        >
          Export PNG
        </Button>
        <Button
          onClick={() => {
            handleExport("pdf");
          }}
        >
          Export PDF
        </Button>
      </div>
    </div>
  );
}
