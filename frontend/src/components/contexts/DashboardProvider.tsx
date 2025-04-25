"use client";
import { DashboardProvider as OriginalDashboardProvider } from "@/contexts/DashboardContext";

// This is a simple wrapper component to facilitate dynamic importing
export default function DashboardProvider({ children }: { children: React.ReactNode }) {
  return <OriginalDashboardProvider>{children}</OriginalDashboardProvider>;
}