"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const modelMetrics = {
  accuracy: 92,
  mae: 2.3,
  mse: 5.8,
  r2: 0.89,
};

const trainingPhases = [
  {
    name: "New Subscribers",
    value: "26,864",
    change: "+3.4%",
    items: [
      { label: "Individual", value: "4,279" },
      { label: "Team", value: "4,827" },
      { label: "Enterprise", value: "3,556" },
    ],
  },
  {
    name: "Reason for upgrading",
    items: [
      { label: "Needed access to premium tools", value: "4,279" },
      { label: "Enhanced assistance and protection", value: "4,827" },
      { label: "Faster, more reliable experience", value: "3,556" },
      { label: "Scaling up operations", value: "6,987" },
    ],
  },
];

export function ModelTraining() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Accuracy</div>
              <div className="text-2xl font-bold">{modelMetrics.accuracy}%</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">MAE</div>
              <div className="text-2xl font-bold">{modelMetrics.mae}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">MSE</div>
              <div className="text-2xl font-bold">{modelMetrics.mse}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">R²</div>
              <div className="text-2xl font-bold">{modelMetrics.r2}</div>
            </div>
          </div>

          <div className="space-y-6">
            {trainingPhases.map((phase) => (
              <div key={phase.name} className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">{phase.name}</div>
                  {phase.value && (
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-semibold">{phase.value}</div>
                      {phase.change && (
                        <div className="text-sm text-emerald-500">{phase.change}</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  {phase.items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground">{item.label}</div>
                      <div className="font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
