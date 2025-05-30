"use client";

import { Card } from "@/components/ui/card";

export function KeyInsights() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Key Insights</h2>
      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="font-medium">Rice Price Trend</h3>
          <p className="text-sm text-muted-foreground">
            Expected to increase by 5% in Q3 2024 due to supply chain disruptions
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium">Vegetable Market</h3>
          <p className="text-sm text-muted-foreground">
            Seasonal factors will likely cause price fluctuations in Q2
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium">Meat Products</h3>
          <p className="text-sm text-muted-foreground">
            Stable prices expected through Q3 with minor seasonal adjustments
          </p>
        </Card>
      </div>
    </div>
  );
}
