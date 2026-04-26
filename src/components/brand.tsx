import { Activity } from "lucide-react";
import Link from "next/link";

export function Brand() {
  return (
    <Link
      href="/"
      className="focus-ring inline-flex items-center gap-3 rounded-md"
      aria-label="PulsoFit home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-md border border-[#dce8de] bg-white text-[#178a41] shadow-sm">
        <Activity size={21} strokeWidth={2.2} />
      </span>
      <span className="text-xl font-semibold tracking-[0] text-[#101418]">
        PulsoFit
      </span>
    </Link>
  );
}
