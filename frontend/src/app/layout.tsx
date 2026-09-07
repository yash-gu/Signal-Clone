import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/context/Providers";
import AppLayout from "@/components/layout/AppLayout";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "Signal Desktop Clone",
  description: "A functional clone of the Signal messaging application.",
  openGraph: {
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/icon.png"],
  },
  icons: {
    icon: [
      { url: '/icon.png?v=2', type: 'image/png' },
    ],
    shortcut: ['/icon.png'],
    apple: [
      { url: '/icon.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
  },
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
      <body className="bg-surface text-on-surface font-body-md text-body-md antialiased" style={{ overscrollBehavior: 'none' }}>
        <ToastProvider>
          <Providers>
            <AppLayout>
              {children}
            </AppLayout>
          </Providers>
        </ToastProvider>
      </body>
    </html>
  );
}
