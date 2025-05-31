"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const latestForecasts = [
  {
    commodity: "Rice",
    currentPrice: 48,
    predictedPrice: 50,
    change: "+4.2%",
    trend: "up",
    confidence: "high",
    total: "₱1,439,346",
  },
  {
    commodity: "Vegetables",
    currentPrice: 38,
    predictedPrice: 40,
    change: "+5.3%",
    trend: "up",
    confidence: "medium",
    total: "₱1,426,297",
  },
  {
    commodity: "Meat",
    currentPrice: 285,
    predictedPrice: 290,
    change: "+1.8%",
    trend: "up",
    confidence: "high",
    total: "₱42,379",
  },
];

export function ForecastSummary() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recurring Revenue</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-2xl font-semibold">₱1,439,346</div>
            <div className="flex items-center gap-2">
              <Badge className="border-none bg-emerald-500/24 text-emerald-500">+48.1%</Badge>
            </div>
          </div>

          <div className="grid gap-4">
            {latestForecasts.map((forecast) => (
              <div
                key={forecast.commodity}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <div className="font-medium">{forecast.commodity}</div>
                  <div className="text-sm text-muted-foreground">{forecast.total}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">₱{forecast.predictedPrice}/kg</div>
                    <div className="text-sm text-muted-foreground">{forecast.change} by 2025</div>
                  </div>
                  <Badge
                    variant={forecast.trend === "up" ? "destructive" : "default"}
                    className={
                      forecast.confidence === "high"
                        ? "bg-emerald-500/24 text-emerald-500"
                        : "bg-yellow-500/24 text-yellow-500"
                    }
                  >
                    {forecast.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
