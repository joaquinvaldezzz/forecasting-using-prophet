import { Inter } from "next/font/google";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { Providers } from "./providers";

import "./globals.css";

interface CustomCSSProperties extends CSSProperties {
  "--sidebar-width": string;
  "--header-height": string;
}

const inter = Inter({ subsets: ["latin"] });

const sidebarStyles: CustomCSSProperties = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-w-80 text-pretty antialiased")}>
        <Providers>
          <SidebarProvider style={sidebarStyles}>
            <AppSidebar variant="inset" />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
