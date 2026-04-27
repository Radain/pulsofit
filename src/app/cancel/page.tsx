import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function CancelPage() {
  return (
    <div className="app-shell min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-5 text-center">
        <section className="rounded-md border border-[#e6e1d8] bg-white p-8 shadow-[0_24px_80px_rgba(36,31,23,0.08)]">
          <ArrowLeft className="mx-auto text-[#f07053]" size={42} />
          <h1 className="mt-6 text-4xl font-semibold tracking-[0]">
            Checkout canceled
          </h1>
          <p className="mt-4 text-[#657168]">
            No subscription was started. You can review the plan or keep
            exploring the product demo.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="focus-ring inline-flex h-12 items-center justify-center rounded-md bg-[#178a41] px-6 text-sm font-semibold text-white"
            >
              Return to pricing
            </Link>
            <Link
              href="/login"
              className="focus-ring inline-flex h-12 items-center justify-center rounded-md border border-[#d8d2c8] bg-white px-6 text-sm font-semibold"
            >
              Enter free app
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
