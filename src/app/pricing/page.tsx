import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { CheckoutForm } from "@/components/checkout-form";
import { LegalFooter } from "@/components/legal-footer";
import { SiteHeader } from "@/components/site-header";
import { formatEuro, plans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start PulsoFit Free, monthly Pro for 14,99 EUR, or yearly Pro with 15% savings.",
};

const trustSignals = [
  { icon: Dumbbell, label: "Usable free plan" },
  { icon: HeartPulse, label: "Recovery signals in Pro" },
  { icon: ShieldCheck, label: "Stripe-hosted checkout" },
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const params = await searchParams;
  const checkoutIssue = params.checkout === "missing-price";
  const checkoutError = params.checkout === "error";

  return (
    <div className="app-shell min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8">
        <section className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-[#178a41]">
              Plans that do not trap people
            </p>
            <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[0] text-[#101418] sm:text-6xl">
              Start free, upgrade only when the coaching signals matter.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#657168]">
              PulsoFit Free is usable for weekly training. Pro adds adaptive
              planning, recovery intelligence, and longer progress history.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              {trustSignals.map((item) => (
                <span
                  className="inline-flex items-center gap-2 rounded-md border border-[#e6e1d8] bg-white px-4 py-3 text-sm font-semibold"
                  key={item.label}
                >
                  <item.icon size={17} className="text-[#178a41]" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-[#e6e1d8] bg-white p-5 text-sm leading-6 text-[#657168]">
            <p className="font-semibold text-[#101418]">Fair payments policy</p>
            <p className="mt-2">
              EU consumers keep their statutory 14-day withdrawal rights. On top
              of that, PulsoFit offers a no-questions refund for the first 30
              days of a first paid subscription. Annual customers can cancel
              future renewal and request a refund under the same friendly policy.
            </p>
            <Link
              href="/legal/refunds"
              className="focus-ring mt-4 inline-flex rounded-md font-semibold text-[#178a41]"
            >
              Read refund policy
            </Link>
          </div>
        </section>

        {checkoutIssue ? (
          <p className="mt-8 rounded-md border border-[#f3ad3e]/50 bg-[#fff7e6] p-4 text-sm text-[#6d4a06]">
            Checkout needs the matching Stripe price environment variable before
            it can redirect to Stripe.
          </p>
        ) : null}

        {checkoutError ? (
          <p className="mt-8 rounded-md border border-[#f07053]/50 bg-[#fff1ed] p-4 text-sm text-[#74311f]">
            Stripe Checkout could not start. Please retry in a moment.
          </p>
        ) : null}

        <section className="mt-10 grid gap-5 lg:grid-cols-3">
          <article className="rounded-md border border-[#e2ddd4] bg-white p-6">
            <p className="text-sm font-semibold uppercase text-[#178a41]">
              Free
            </p>
            <h2 className="mt-4 text-3xl font-semibold">{plans.free.name}</h2>
            <p className="mt-4 text-4xl font-semibold">
              0 EUR{" "}
              <span className="block text-sm font-medium text-[#657168]">
                forever
              </span>
            </p>
            <div className="mt-8 border-y border-[#eee8df] py-6">
              {plans.free.features.map((feature) => (
                <div className="mb-4 flex items-center gap-3 last:mb-0" key={feature}>
                  <span className="grid h-5 w-5 place-items-center rounded-sm bg-[#178a41] text-white">
                    <Check size={13} />
                  </span>
                  <span className="text-sm font-medium text-[#2e3731]">
                    {feature}
                  </span>
                </div>
              ))}
              {plans.free.restrictions.map((restriction) => (
                <div
                  className="mt-4 flex items-center gap-3 text-[#657168]"
                  key={restriction}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-sm border border-[#d8d2c8]">
                    <X size={12} />
                  </span>
                  <span className="text-sm">{restriction}</span>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard"
              className="focus-ring mt-8 inline-flex h-12 w-full items-center justify-center rounded-md border border-[#d8d2c8] bg-white text-sm font-semibold"
            >
              Start free
            </Link>
          </article>

          <article className="rounded-md border border-[#178a41] bg-white p-6 shadow-[0_24px_80px_rgba(23,138,65,0.12)]">
            <p className="inline-flex items-center gap-2 rounded-md bg-[#edf6ef] px-3 py-2 text-sm font-semibold text-[#178a41]">
              <Sparkles size={16} />
              Monthly Pro
            </p>
            <h2 className="mt-6 text-3xl font-semibold">PulsoFit Pro</h2>
            <p className="mt-4 text-4xl font-semibold">
              {formatEuro(plans.proMonthly.priceCents)}{" "}
              <span className="block text-sm font-medium text-[#657168]">
                per month
              </span>
            </p>
            <div className="mt-8 border-y border-[#eee8df] py-6">
              {plans.proMonthly.features.map((feature) => (
                <div className="mb-4 flex items-center gap-3 last:mb-0" key={feature}>
                  <span className="grid h-5 w-5 place-items-center rounded-sm bg-[#178a41] text-white">
                    <Check size={13} />
                  </span>
                  <span className="text-sm font-medium text-[#2e3731]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <CheckoutForm className="w-full" plan="monthly" />
            </div>
          </article>

          <article className="rounded-md border border-[#e2ddd4] bg-white p-6">
            <p className="inline-flex items-center gap-2 rounded-md bg-[#fff7e6] px-3 py-2 text-sm font-semibold text-[#8a5c05]">
              Save {plans.proYearly.savingsPercent}%
            </p>
            <h2 className="mt-6 text-3xl font-semibold">PulsoFit Pro Annual</h2>
            <p className="mt-4 text-4xl font-semibold">
              {formatEuro(plans.proYearly.priceCents)}{" "}
              <span className="block text-sm font-medium text-[#657168]">
                per year
              </span>
            </p>
            <p className="mt-2 text-sm text-[#657168]">
              Equivalent to 12,74 EUR/month, billed once yearly.
            </p>
            <div className="mt-8 border-y border-[#eee8df] py-6">
              {plans.proYearly.features.map((feature) => (
                <div className="mb-4 flex items-center gap-3 last:mb-0" key={feature}>
                  <span className="grid h-5 w-5 place-items-center rounded-sm bg-[#178a41] text-white">
                    <Check size={13} />
                  </span>
                  <span className="text-sm font-medium text-[#2e3731]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <CheckoutForm
                className="w-full"
                label="Start annual Pro"
                plan="yearly"
              />
            </div>
          </article>
        </section>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-[#657168]">
          Payments are handled by Stripe Checkout. PulsoFit does not store card
          numbers. You can cancel renewal without explaining why.
        </p>
      </main>
      <LegalFooter />
    </div>
  );
}
