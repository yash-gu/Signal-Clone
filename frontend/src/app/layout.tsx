import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/layout/TopNav";
import LeftRail from "@/components/layout/LeftRail";

export const metadata: Metadata = {
  title: "Signal Desktop Clone",
  description: "A functional clone of the Signal messaging application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <TopNav />
        <LeftRail />
        <div className="pl-16">
          <main className="pt-16 w-full min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
