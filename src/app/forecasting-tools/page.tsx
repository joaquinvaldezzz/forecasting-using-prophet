import { Fragment } from "react";
import type { Metadata } from "next";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Forecasting Tools",
};

interface ForecastData {
  rice: {
    forecast: Array<{
      ds: string;
      price: number;
      lower_bound: number;
      upper_bound: number;
    }>;
  };
  vegetables: {
    forecast: Array<{
      ds: string;
      price: number;
      lower_bound: number;
      upper_bound: number;
    }>;
  };
  meat: {
    forecast: Array<{
      ds: string;
      price: number;
      lower_bound: number;
      upper_bound: number;
    }>;
  };
}

/**
 * The forecasting tools page.
 *
 * @returns The rendered page.
 */
export default async function Page() {
  const data = await fetch("http://127.0.0.1:5000/api/forecast").then(
    async (res) => (await res.json()) as ForecastData,
  );

  return (
    <Fragment>
      <SiteHeader title="Forecasting Tools" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card">
                <ChartAreaInteractive title="Rice" data={data.rice.forecast} />
                <ChartAreaInteractive title="Vegetables" data={data.vegetables.forecast} />
                <ChartAreaInteractive title="Meat" data={data.meat.forecast} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
