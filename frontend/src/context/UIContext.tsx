"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isLeftRailVisible: boolean;
  toggleLeftRail: () => void;
  activeView: "main" | "settings";
  setActiveView: (view: "main" | "settings") => void;
  searchTargetId: number | null;
  setSearchTargetId: (id: number | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isLeftRailVisible, setIsLeftRailVisible] = useState(true);
  const [activeView, setActiveView] = useState<"main" | "settings">("main");
  const [searchTargetId, setSearchTargetId] = useState<number | null>(null);

  const toggleLeftRail = () => {
    setIsLeftRailVisible(prev => !prev);
  };

  return (
    <UIContext.Provider value={{ isLeftRailVisible, toggleLeftRail, activeView, setActiveView, searchTargetId, setSearchTargetId }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
