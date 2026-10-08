import { Fragment } from "react";
import type { Metadata } from "next";

import { fetchWithFallback } from "@/lib/api-client";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Forecasting Tools",
};

interface ForecastItem {
  ds: string;
  lower_bound: number;
  price: number;
  upper_bound: number;
}

interface ForecastData {
  meat: {
    forecast: ForecastItem[];
  };
  rice: {
    forecast: ForecastItem[];
  };
  vegetables: {
    forecast: ForecastItem[];
  };
}

const fallbackData: ForecastData = {
  meat: { forecast: [] },
  rice: { forecast: [] },
  vegetables: { forecast: [] },
};

/**
 * The forecasting tools page.
 *
 * @returns The rendered page.
 */
export default async function Page() {
  const data = await fetchWithFallback<ForecastData>("/api/forecast", fallbackData);

  const hasData =
    data.rice.forecast.length > 0 ||
    data.vegetables.forecast.length > 0 ||
    data.meat.forecast.length > 0;

  return (
    <Fragment>
      <SiteHeader title="Forecasting Tools" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          {!hasData && (
            <div className="mx-4 mt-4 rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground lg:mx-6">
              Unable to load live forecast data. Displaying offline view.
            </div>
          )}
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card">
                <ChartAreaInteractive data={data.rice.forecast} title="Rice" />
                <ChartAreaInteractive data={data.vegetables.forecast} title="Vegetables" />
                <ChartAreaInteractive data={data.meat.forecast} title="Meat" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
