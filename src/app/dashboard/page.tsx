import type { Metadata } from "next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ActionButtons } from "@/components/action-buttons";
import { AppSidebar } from "@/components/app-sidebar";
import { KeyInsights } from "@/components/dashboard/key-insights";
import { PriceForecastSummary } from "@/components/dashboard/price-forecast-summary";
import { PriceTrendsChart } from "@/components/dashboard/price-trends-chart";

export const metadata: Metadata = {
  title: "Food Price Forecasting Dashboard",
  description: "Monitor and analyze food price trends and forecasts",
};

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="@container px-4 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <header className="flex min-h-20 shrink-0 flex-wrap items-center justify-between gap-3 py-4 transition-all ease-linear">
              {/* Left side */}
              <div className="flex flex-1 items-center gap-2"></div>
              {/* Right side */}
              <ActionButtons />
            </header>

            <div className="overflow-hidden">
              <div className="-m-px grid auto-rows-min *:-ms-px *:-mt-px @2xl:grid-cols-2">
                <PriceForecastSummary />
                <KeyInsights />
                <div className="@2xl:col-span-2">
                  <PriceTrendsChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
