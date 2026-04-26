export const MONTHLY_PRICE_CENTS = 1499;
export const ANNUAL_PRICE_CENTS = 15290;

export type CheckoutPlan = "monthly" | "yearly";

type EnvLike = Record<string, string | undefined> & {
  STRIPE_PRICE_ID?: string;
  STRIPE_YEARLY_PRICE_ID?: string;
};

export const plans = {
  free: {
    name: "PulsoFit Free",
    priceCents: 0,
    billingLabel: "Free",
    weeklyWorkoutLimit: 3,
    habitLimit: 3,
    recoveryInsights: false,
    historyDays: 7,
    features: [
      "3 planned workouts per week",
      "3 daily habits",
      "Basic weekly intensity view",
      "Manual workout start/pause",
    ],
    restrictions: [
      "Recovery score is preview-only",
      "No adaptive plan adjustments",
      "No extended progress history",
    ],
  },
  proMonthly: {
    name: "PulsoFit Pro Monthly",
    priceCents: MONTHLY_PRICE_CENTS,
    billingLabel: "14,99 EUR / month",
    checkoutPlan: "monthly" satisfies CheckoutPlan,
    weeklyWorkoutLimit: 7,
    habitLimit: 5,
    recoveryInsights: true,
    historyDays: 90,
    features: [
      "Adaptive weekly training plans",
      "Habit tracking and consistency scoring",
      "Recovery-aware workout guidance",
      "Progress cockpit with intensity trends",
      "Stripe-powered subscription checkout",
    ],
  },
  proYearly: {
    name: "PulsoFit Pro Yearly",
    priceCents: ANNUAL_PRICE_CENTS,
    billingLabel: "152,90 EUR / year",
    checkoutPlan: "yearly" satisfies CheckoutPlan,
    savingsPercent: 15,
    weeklyWorkoutLimit: 7,
    habitLimit: 5,
    recoveryInsights: true,
    historyDays: 90,
    features: [
      "Everything in monthly Pro",
      "15% annual discount",
      "One annual payment",
      "Same friendly refund policy",
    ],
  },
} as const;

export function formatEuro(cents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function getCheckoutPriceId(plan: FormDataEntryValue | string | null, env: EnvLike) {
  if (plan === "monthly") {
    return env.STRIPE_PRICE_ID ?? null;
  }

  if (plan === "yearly") {
    return env.STRIPE_YEARLY_PRICE_ID ?? null;
  }

  return null;
}
