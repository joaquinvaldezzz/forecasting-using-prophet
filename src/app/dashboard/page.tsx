import { Fragment } from "react";
import type { Metadata } from "next";

import { fetchWithFallback } from "@/lib/api-client";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";

import { ChartAreaInteractive } from "./chart-area-interactive";

export const metadata: Metadata = {
  title: "Dashboard",
};

interface PriceTrendsData {
  month: string;
  rice: number;
  vegetables: number;
  meat: number;
}

interface InsightsData {
  commodity: string;
  current_price: number;
  average_price: number;
  price_change: number;
  trend: string;
}

/**
 * The dashboard page.
 *
 * @returns The rendered page.
 */
export default async function Page() {
  const [insights, data] = await Promise.all([
    fetchWithFallback<InsightsData[]>("/api/insights", []),
    fetchWithFallback<PriceTrendsData[]>("/api/price-trends/2023", []),
  ]);

  const hasData = insights.length > 0 || data.length > 0;

  return (
    <Fragment>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          {!hasData && (
            <div className="mx-4 mt-4 rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground lg:mx-6">
              Unable to load live dashboard data. Displaying offline view.
            </div>
          )}
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards insights={insights} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive data={data} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
