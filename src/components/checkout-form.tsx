"use client";

import { createCheckoutSession } from "@/app/actions/checkout";
import type { CheckoutPlan } from "@/lib/plans";
import { insforge } from "@/lib/insforge";
import Link from "next/link";
import { useEffect, useState } from "react";

type CheckoutFormProps = {
  label?: string;
  plan?: CheckoutPlan;
  className?: string;
};

export function CheckoutForm({
  label = "Start PulsoFit Pro",
  plan = "monthly",
  className = "",
}: CheckoutFormProps) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) {
    return (
      <button
        className={`focus-ring inline-flex h-14 items-center justify-center rounded-md bg-[#178a41] px-8 text-base font-semibold text-white opacity-70 ${className}`}
        disabled
        type="button"
      >
        Checking account...
      </button>
    );
  }

  if (!user) {
    return (
      <Link
        className={`focus-ring inline-flex h-14 items-center justify-center rounded-md bg-[#178a41] px-8 text-base font-semibold text-white shadow-[0_14px_34px_rgba(23,138,65,0.24)] transition hover:bg-[#0f6f32] ${className}`}
        href="/login"
      >
        Sign in to subscribe
      </Link>
    );
  }

  return (
    <form action={createCheckoutSession}>
      <input type="hidden" name="plan" value={plan} />
      <input type="hidden" name="insforgeUserId" value={user.id} />
      <input type="hidden" name="customerEmail" value={user.email} />
      <button
        type="submit"
        className={`focus-ring inline-flex h-14 items-center justify-center rounded-md bg-[#178a41] px-8 text-base font-semibold text-white shadow-[0_14px_34px_rgba(23,138,65,0.24)] transition hover:bg-[#0f6f32] ${className}`}
      >
        {label}
      </button>
    </form>
  );
}
