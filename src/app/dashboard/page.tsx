import type { Metadata } from "next";
import { DashboardApp } from "@/components/dashboard-app";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Interactive PulsoFit workout dashboard demo.",
};

export default function DashboardPage() {
  return <DashboardApp />;
}
