"use client";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { SocketProvider } from "./SocketContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>
        {children}
      </SocketProvider>
    </AuthProvider>
  );
}
