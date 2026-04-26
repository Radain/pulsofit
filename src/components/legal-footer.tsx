import Link from "next/link";

const legalLinks = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/refunds", label: "Refunds" },
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/legal/security", label: "Security" },
];

export function LegalFooter() {
  return (
    <footer className="border-t border-[#e6e1d8] bg-white/68 px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 text-sm text-[#657168] md:flex-row md:items-center md:justify-between">
        <p>(c) 2026 PulsoFit. Fitness software, not medical advice.</p>
        <nav className="flex flex-wrap gap-4" aria-label="Legal links">
          {legalLinks.map((link) => (
            <Link
              className="focus-ring rounded-md transition hover:text-[#178a41]"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
