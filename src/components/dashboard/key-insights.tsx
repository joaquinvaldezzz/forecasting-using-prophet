"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const insights = [
  {
    title: "Rice Price Stabilization",
    description: "Rice prices expected to stabilize in Q3 2024 due to improved supply chain",
    impact: "high",
    date: "2024-05-30",
  },
  {
    title: "Vegetable Market Trends",
    description: "Vegetable prices showing seasonal patterns with expected peak in Q4",
    impact: "medium",
    date: "2024-05-29",
  },
  {
    title: "Meat Supply Chain",
    description: "New meat processing facilities to come online, potentially affecting prices",
    impact: "high",
    date: "2024-05-28",
  },
];

export function KeyInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Insights & Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {insights.map((insight) => (
            <div key={insight.title} className="flex flex-col gap-2 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{insight.title}</div>
                <Badge
                  variant="outline"
                  className={
                    insight.impact === "high"
                      ? "border-emerald-500/24 text-emerald-500"
                      : "border-yellow-500/24 text-yellow-500"
                  }
                >
                  {insight.impact === "high" ? "High Impact" : "Medium Impact"}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">{insight.description}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(insight.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
