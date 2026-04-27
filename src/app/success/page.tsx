import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getInsforgeAdmin } from "@/lib/insforge-server";
import { getStripe } from "@/lib/stripe";

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

async function syncCheckoutSession(sessionId?: string) {
  if (!sessionId) {
    return false;
  }

  const session = await getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  const insforgeUserId =
    session.client_reference_id ?? session.metadata?.insforgeUserId;

  if (!insforgeUserId || !session.customer) {
    return false;
  }

  const subscription =
    typeof session.subscription === "string" ? null : session.subscription;
  const stripeSubscription = subscription as
    | (typeof subscription & {
        current_period_end?: number;
        cancel_at_period_end?: boolean;
      })
    | null;
  const priceId = subscription?.items.data[0]?.price.id ?? null;
  const interval = subscription?.items.data[0]?.price.recurring?.interval ?? null;

  const insforge = getInsforgeAdmin();

  const { data: existing } = await insforge.database
    .from("subscriptions")
    .select("id")
    .eq("user_id", insforgeUserId)
    .maybeSingle();

  const payload = {
    user_id: insforgeUserId,
    stripe_customer_id:
      typeof session.customer === "string" ? session.customer : session.customer.id,
    stripe_subscription_id: subscription?.id ?? null,
    stripe_price_id: priceId,
    plan: "pro",
    interval,
    status: subscription?.status ?? "active",
    current_period_end: stripeSubscription?.current_period_end
      ? new Date(stripeSubscription.current_period_end * 1000).toISOString()
      : null,
    cancel_at_period_end: stripeSubscription?.cancel_at_period_end ?? false,
  };

  if (existing?.id) {
    await insforge.database
      .from("subscriptions")
      .update(payload)
      .eq("id", existing.id);
  } else {
    await insforge.database.from("subscriptions").insert(payload);
  }

  await insforge.database
    .from("profiles")
    .update({ plan: "pro" })
    .eq("user_id", insforgeUserId);

  return true;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  const synced = await syncCheckoutSession(sessionId).catch((error) => {
    console.error("Failed to sync checkout session", error);
    return false;
  });

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
            {synced
              ? "Your subscription checkout completed and PulsoFit Pro is active on your account."
              : "Your subscription checkout completed. If Pro is not visible yet, wait a moment and refresh the app."}
          </p>
          <Link
            href="/app"
            className="focus-ring mt-8 inline-flex h-12 items-center justify-center rounded-md bg-[#178a41] px-6 text-sm font-semibold text-white"
          >
            Open app
          </Link>
        </section>
      </main>
    </div>
  );
}
