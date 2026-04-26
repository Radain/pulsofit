import Link from "next/link";
import { Brand } from "./brand";

const nav = [
  { href: "/#product", label: "Product" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e6e1d8]/80 bg-[#fbfaf6]/86 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1500px] items-center justify-between px-5 sm:px-8">
        <Brand />
        <nav className="hidden items-center gap-10 text-sm font-medium text-[#2e3731] md:flex">
          {nav.map((item) => (
            <Link
              className="focus-ring rounded-md transition hover:text-[#178a41]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/pricing"
          className="focus-ring inline-flex h-11 items-center justify-center rounded-md bg-[#178a41] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(23,138,65,0.22)] transition hover:bg-[#0f6f32]"
        >
          Subscribe
        </Link>
      </div>
    </header>
  );
}
