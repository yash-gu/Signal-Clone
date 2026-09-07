"use client";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { SocketProvider } from "./SocketContext";
import { UIProvider } from "./UIContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
