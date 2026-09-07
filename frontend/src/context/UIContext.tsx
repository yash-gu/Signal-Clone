"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isLeftRailVisible: boolean;
  toggleLeftRail: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isLeftRailVisible, setIsLeftRailVisible] = useState(true);

  const toggleLeftRail = () => {
    setIsLeftRailVisible(prev => !prev);
  };

  return (
    <UIContext.Provider value={{ isLeftRailVisible, toggleLeftRail }}>
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
