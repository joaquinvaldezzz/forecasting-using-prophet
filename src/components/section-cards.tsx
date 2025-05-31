import { Fragment } from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { formatAsCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InsightsData {
  insights: Array<{
    commodity: string;
    current_price: number;
    average_price: number;
    price_change: number;
    trend: string;
  }>;
}

/**
 * The section cards.
 *
 * @param props The props to apply to the section cards.
 * @param props.insights The insights data.
 * @returns The rendered section cards.
 */
export function SectionCards({ insights }: InsightsData) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {insights.map((insight) => (
        <Fragment key={insight.commodity}>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription className="capitalize">{insight.commodity}</CardDescription>
              <CardTitle className="text-2xl font-semibold tracking-tight tabular-nums @[250px]/card:text-3xl">
                {formatAsCurrency(insight.current_price)}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {insight.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
                  {insight.price_change}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {insight.trend} <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                {insight.price_change}% change in the last 12 months
              </div>
            </CardFooter>
          </Card>
        </Fragment>
      ))}
    </div>
  );
}
