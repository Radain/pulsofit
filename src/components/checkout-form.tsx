import { createCheckoutSession } from "@/app/actions/checkout";
import type { CheckoutPlan } from "@/lib/plans";

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
  return (
    <form action={createCheckoutSession}>
      <input type="hidden" name="plan" value={plan} />
      <button
        type="submit"
        className={`focus-ring inline-flex h-14 items-center justify-center rounded-md bg-[#178a41] px-8 text-base font-semibold text-white shadow-[0_14px_34px_rgba(23,138,65,0.24)] transition hover:bg-[#0f6f32] ${className}`}
      >
        {label}
      </button>
    </form>
  );
}
