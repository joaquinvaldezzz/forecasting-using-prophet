import { PriceTrendsChart } from "@/components/dashboard/price-trends-chart";

/**
 * The home page.
 *
 * @returns The rendered page.
 */
export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Food Price Forecast Dashboard</h1>
            <p className="text-sm text-muted-foreground">Jan 01, 2024 - Dec 31, 2024</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ForecastSummary />
            <KeyInsights />
            <ModelTraining />
          </div> */}
          <PriceTrendsChart />
        </div>
      </div>
    </main>
  );
}
