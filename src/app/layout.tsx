import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";

const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(fontSans.variable, fontMono.variable, "antialiased")}>{children}</body>
    </html>
  );
}
