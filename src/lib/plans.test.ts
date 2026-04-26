import { describe, expect, it } from "vitest";
import {
  ANNUAL_PRICE_CENTS,
  MONTHLY_PRICE_CENTS,
  getCheckoutPriceId,
  plans,
} from "./plans";

describe("PulsoFit plans", () => {
  it("keeps the free plan usable but restricted", () => {
    expect(plans.free.priceCents).toBe(0);
    expect(plans.free.weeklyWorkoutLimit).toBe(3);
    expect(plans.free.habitLimit).toBe(3);
    expect(plans.free.recoveryInsights).toBe(false);
  });

  it("applies a 15 percent annual discount rounded to cents", () => {
    expect(MONTHLY_PRICE_CENTS * 12).toBe(17988);
    expect(ANNUAL_PRICE_CENTS).toBe(15290);
    expect(plans.proYearly.savingsPercent).toBe(15);
  });

  it("selects the correct Stripe price id by billing period", () => {
    const env = {
      STRIPE_PRICE_ID: "price_monthly",
      STRIPE_YEARLY_PRICE_ID: "price_yearly",
    };

    expect(getCheckoutPriceId("monthly", env)).toBe("price_monthly");
    expect(getCheckoutPriceId("yearly", env)).toBe("price_yearly");
  });

  it("returns null for invalid or missing checkout plans", () => {
    expect(getCheckoutPriceId("free", {})).toBeNull();
    expect(getCheckoutPriceId("monthly", {})).toBeNull();
    expect(getCheckoutPriceId("yearly", {})).toBeNull();
  });
});
