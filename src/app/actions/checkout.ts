"use server";

import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import { getCheckoutPriceId } from "@/lib/plans";

export async function createCheckoutSession(formData: FormData) {
  const plan = formData.get("plan");
  const priceId = getCheckoutPriceId(plan, process.env);
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  if (!priceId) {
    redirect("/pricing?checkout=missing-price");
  }

  let sessionUrl: string | null = null;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    sessionUrl = session.url;
  } catch (error) {
    console.error("Stripe checkout session failed", error);
    redirect("/pricing?checkout=error");
  }

  if (!sessionUrl) {
    redirect("/pricing?checkout=error");
  }

  redirect(sessionUrl);
}
