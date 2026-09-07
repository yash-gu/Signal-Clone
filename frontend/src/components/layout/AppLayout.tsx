"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import LeftRail from "./LeftRail";
import SettingsView from "@/components/settings/SettingsView";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-surface">Loading...</div>;
  }

  // Unauthenticated layout (Full-screen isolation for Auth Screen)
  if (!token) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-[#121214] flex flex-col relative overflow-hidden">
        {/* Subtle radial light backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 dark:from-neutral-900 dark:via-[#121214] dark:to-[#121214] pointer-events-none" />
        <div className="relative z-10 flex-1 flex flex-col w-full h-full">
          {children}
        </div>
      </div>
    );
  }

  const { isLeftRailVisible, activeView } = useUI();

  // Authenticated layout (Standard app with sidebars and navigation)
  return (
    <div className="w-full h-screen overflow-hidden flex bg-white dark:bg-[#121214]">
      {isLeftRailVisible && <LeftRail />}
      <main className="flex-1 flex h-full min-w-0">
        {activeView === "settings" ? <SettingsView /> : children}
      </main>
    </div>
  );
}
