import type { Metadata } from "next";
import { DashboardApp } from "@/components/dashboard-app";

export const metadata: Metadata = {
  title: "App",
  description: "PulsoFit isolated training workspace.",
};

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;

  return <DashboardApp initialMode={params.plan === "pro" ? "pro" : "free"} />;
}
