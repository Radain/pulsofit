import type { Metadata } from "next";
import Link from "next/link";
import { Check, Dumbbell, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";
import { CheckoutForm } from "@/components/checkout-form";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Start PulsoFit Pro for 14,99 EUR per month.",
};

const benefits = [
  "Adaptive weekly training plans",
  "Habit tracking and consistency scoring",
  "Recovery-aware workout guidance",
  "Progress cockpit with intensity trends",
  "Stripe-powered subscription checkout",
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const params = await searchParams;
  const checkoutIssue = params.checkout === "missing-price";

  return (
    <div className="app-shell min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section>
          <p className="text-sm font-semibold uppercase text-[#178a41]">
            PulsoFit Pro
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[0] text-[#101418] sm:text-6xl">
            One focused subscription for your weekly fitness rhythm.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#657168]">
            Start with a clean training cockpit: workouts, habits, recovery,
            and progress signals without spreadsheet drift.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-md border border-[#e6e1d8] bg-white px-4 py-3 text-sm font-semibold">
              <Dumbbell size={17} className="text-[#178a41]" />
              Weekly plans
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-[#e6e1d8] bg-white px-4 py-3 text-sm font-semibold">
              <HeartPulse size={17} className="text-[#178a41]" />
              Recovery signals
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-[#e6e1d8] bg-white px-4 py-3 text-sm font-semibold">
              <ShieldCheck size={17} className="text-[#178a41]" />
              Secure checkout
            </span>
          </div>
        </section>

        <section className="rounded-md border border-[#e2ddd4] bg-white p-6 shadow-[0_24px_80px_rgba(36,31,23,0.09)] sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="inline-flex items-center gap-2 rounded-md bg-[#edf6ef] px-3 py-2 text-sm font-semibold text-[#178a41]">
                <Sparkles size={16} />
                Best for consistent progress
              </p>
              <h2 className="mt-6 text-3xl font-semibold">PulsoFit Pro</h2>
            </div>
            <p className="text-right text-4xl font-semibold">
              14,99{" "}
              <span className="block text-sm font-medium text-[#657168]">
                EUR / month
              </span>
            </p>
          </div>

          <div className="mt-8 border-y border-[#eee8df] py-6">
            {benefits.map((benefit) => (
              <div className="mb-4 flex items-center gap-3 last:mb-0" key={benefit}>
                <span className="grid h-5 w-5 place-items-center rounded-sm bg-[#178a41] text-white">
                  <Check size={13} />
                </span>
                <span className="text-sm font-medium text-[#2e3731]">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {checkoutIssue ? (
            <p className="mt-6 rounded-md border border-[#f3ad3e]/50 bg-[#fff7e6] p-4 text-sm text-[#6d4a06]">
              Checkout needs `STRIPE_PRICE_ID` configured before it can redirect
              to Stripe.
            </p>
          ) : null}

          <div className="mt-8">
            <CheckoutForm className="w-full" />
          </div>
          <Link
            href="/dashboard"
            className="focus-ring mt-4 inline-flex h-12 w-full items-center justify-center rounded-md border border-[#d8d2c8] text-sm font-semibold"
          >
            Preview the dashboard first
          </Link>
          <p className="mt-5 text-center text-xs leading-5 text-[#657168]">
            Payments are handled by Stripe Checkout. Promotion codes are allowed
            when configured in Stripe.
          </p>
        </section>
      </main>
    </div>
  );
}
