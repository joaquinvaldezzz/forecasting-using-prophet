import type { Metadata } from "next";

import { Navigation } from "@/components/layout/navigation";

import "./globals.css";

export const metadata: Metadata = {
  title: "Food Price Forecast Dashboard",
  description: "Interactive dashboard for food price forecasting and analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-w-80 antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
