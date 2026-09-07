"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import TopNav from "./TopNav";
import LeftRail from "./LeftRail";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-surface">Loading...</div>;
  }

  // Unauthenticated layout (Full-screen isolation for Auth Screen)
  if (!token) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
        {/* Subtle radial light backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 pointer-events-none" />
        <div className="relative z-10 flex-1 flex flex-col w-full h-full">
          {children}
        </div>
      </div>
    );
  }

  // Authenticated layout (Standard app with sidebars and navigation)
  return (
    <>
      <div className="hidden md:block">
        <TopNav />
        <LeftRail />
      </div>
      <div className="md:pl-16 w-full min-h-[100dvh] flex flex-col">
        <main className="md:pt-16 w-full flex-1 flex flex-col h-full">
          {children}
        </main>
      </div>
    </>
  );
}
