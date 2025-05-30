import { Card } from "@/components/ui/card";
import { ForecastAssistant } from "@/components/forecast/forecast-assistant";

export default function ForecastAssistantPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-8 text-4xl font-bold">AI Forecast Assistant</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <ForecastAssistant />
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">Tips</h2>
          <ul className="space-y-4 text-gray-600">
            <li>• Ask about specific commodity price trends</li>
            <li>• Request forecasts for different time periods</li>
            <li>• Compare prices between different commodities</li>
            <li>• Get insights about market factors affecting prices</li>
            <li>• Simulate price scenarios based on different conditions</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}
