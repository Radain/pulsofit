import type { Metadata } from "next";
import { LoginPanel } from "@/components/login-panel";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Login",
  description: "Enter the isolated PulsoFit app workspace.",
};

export default function LoginPage() {
  return (
    <div className="app-shell min-h-screen">
      <SiteHeader />
      <LoginPanel />
    </div>
  );
}
