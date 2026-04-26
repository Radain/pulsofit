"use server";

import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";

export async function createCheckoutSession() {
  const priceId = process.env.STRIPE_PRICE_ID;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  if (!priceId) {
    redirect("/pricing?checkout=missing-price");
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/cancel`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  redirect(session.url!);
}
