import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function SuccessPage() {
  return (
    <div className="app-shell min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-5 text-center">
        <section className="rounded-md border border-[#e6e1d8] bg-white p-8 shadow-[0_24px_80px_rgba(36,31,23,0.08)]">
          <CheckCircle2 className="mx-auto text-[#178a41]" size={42} />
          <h1 className="mt-6 text-4xl font-semibold tracking-[0]">
            Welcome to PulsoFit Pro
          </h1>
          <p className="mt-4 text-[#657168]">
            Your subscription checkout completed. Enter the isolated app
            workspace to continue with PulsoFit Pro.
          </p>
          <Link
            href="/app?plan=pro"
            className="focus-ring mt-8 inline-flex h-12 items-center justify-center rounded-md bg-[#178a41] px-6 text-sm font-semibold text-white"
          >
            Open app
          </Link>
        </section>
      </main>
    </div>
  );
}
