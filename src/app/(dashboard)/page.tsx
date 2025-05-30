import { Card } from "@/components/ui/card";
import { KeyInsights } from "@/components/dashboard/key-insights";
import { PriceForecastSummary } from "@/components/dashboard/price-forecast-summary";
import { PriceTrendsChart } from "@/components/dashboard/price-trends-chart";

export default function DashboardPage() {
  return (
    <main className="container mx-auto space-y-6 p-6">
      <h1 className="mb-8 text-4xl font-bold">Food Price Forecast Dashboard</h1>

      {/* Summary Section */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <PriceForecastSummary />
        </Card>
        <Card className="p-6">
          <KeyInsights />
        </Card>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">NCR Food Price Trends (2018-2025)</h2>
          <PriceTrendsChart />
        </Card>
      </section>
    </main>
  );
}
