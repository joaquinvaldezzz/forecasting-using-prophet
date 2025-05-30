import { Card } from "@/components/ui/card";
import { ForecastingTools } from "@/components/forecast/forecasting-tools";

export default function ForecastingToolsPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-8 text-4xl font-bold">Forecasting Tools</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <ForecastingTools />
        </Card>
      </div>
    </main>
  );
}
