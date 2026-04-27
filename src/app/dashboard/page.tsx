import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "PulsoFit dashboard moved to the app workspace.",
};

export default function DashboardPage() {
  redirect("/app");
}
