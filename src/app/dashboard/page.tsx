import { Fragment } from "react";
import type { Metadata } from "next";

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
  const insights = await fetch("http://127.0.0.1:5000/api/insights").then(
    async (res) => (await res.json()) as InsightsData[],
  );
  const data = await fetch("http://127.0.0.1:5000/api/price-trends/2023").then(
    async (res) => (await res.json()) as PriceTrendsData[],
  );

  return (
    <Fragment>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
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
