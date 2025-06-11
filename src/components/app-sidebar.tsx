"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { IconChartHistogram, IconDashboard, IconInnerShadowTop } from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";

const data = {
  user: {
    name: "Joaquin Valdez",
    email: "javaldez1642qc@student.fatima.edu.ph",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Forecasting Tools",
      url: "/forecasting-tools",
      icon: IconChartHistogram,
    },
  ],
};

/**
 * The app sidebar.
 *
 * @param props The props to apply to the sidebar.
 * @returns The rendered sidebar.
 */
export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!" asChild>
              <Link href="#">
                <IconInnerShadowTop className="size-5" />
                <span className="text-base font-semibold">Untitled</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
