"use client";

import { Card } from "@/components/ui/card";

export function PriceForecastSummary() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Price Forecast Summary</h2>
      <div className="grid grid-cols-1 gap-4">
        <Card className="p-4">
          <h3 className="font-medium">Rice</h3>
          <p className="text-sm text-muted-foreground">
            Current: ₱45/kg | Forecast: ₱48/kg (+6.7%)
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium">Vegetables</h3>
          <p className="text-sm text-muted-foreground">
            Current: ₱35/kg | Forecast: ₱38/kg (+8.6%)
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium">Meat</h3>
          <p className="text-sm text-muted-foreground">
            Current: ₱280/kg | Forecast: ₱285/kg (+1.8%)
          </p>
        </Card>
      </div>
    </div>
  );
}
