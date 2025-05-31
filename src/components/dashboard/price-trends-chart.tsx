"use client";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartAreaInteractive } from "@/components/charts/chart-area-interactive";

const years = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

interface PriceData {
  month: string;
  rice: number;
  vegetables: number;
  meat: number;
  [key: string]: string | number;
}

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

function isPriceData(data: unknown): data is PriceData {
  if (data === null || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.month === "string" &&
    typeof d.rice === "number" &&
    typeof d.vegetables === "number" &&
    typeof d.meat === "number"
  );
}

async function fetchPriceData(year: string): Promise<PriceData[]> {
  const response = await fetch(`/api/price-trends/${year}`);
  if (!response.ok) {
    throw new Error("Failed to fetch price data");
  }
  const data = await response.json();
  if (!Array.isArray(data) || !data.every(isPriceData)) {
    throw new Error("Invalid price data format");
  }
  return data;
}

export function PriceTrendsChart() {
  return (
    <ChartAreaInteractive
      title="NCR Food Price Trends"
      config={chartConfig}
      years={years}
      defaultYear="2024"
      exportPrefix="price-trends"
      fetchData={fetchPriceData}
    />
  );
}
