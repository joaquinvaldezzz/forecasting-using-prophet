import { Fragment } from "react";

import { ForecastingTools } from "@/components/forecast/forecasting-tools";
import { SiteHeader } from "@/components/site-header";

/**
 * The forecasting tools page.
 *
 * @returns The rendered page.
 */
export default function Page() {
  return (
    <Fragment>
      <SiteHeader title="Forecasting Tools" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main mx-auto flex w-full max-w-6xl flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <ForecastingTools />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
