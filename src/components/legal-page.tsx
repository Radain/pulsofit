import Link from "next/link";
import { LegalFooter } from "@/components/legal-footer";
import { SiteHeader } from "@/components/site-header";
import type { LegalPage } from "@/lib/legal-content";

export function LegalPageView({ page }: { page: LegalPage }) {
  return (
    <div className="app-shell min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[980px] px-5 py-14 sm:px-8">
        <Link
          href="/pricing"
          className="focus-ring inline-flex rounded-md text-sm font-semibold text-[#178a41]"
        >
          Back to pricing
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase text-[#178a41]">
          PulsoFit legal
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#101418] sm:text-5xl">
          {page.title}
        </h1>
        <p className="mt-4 text-sm text-[#657168]">
          Ultima actualizacion: {page.updatedAt}
        </p>
        <p className="mt-6 rounded-md border border-[#e6e1d8] bg-white p-4 text-sm leading-6 text-[#657168]">
          Este texto es una base operativa para un MVP en Espana/UE. Antes de
          vender de forma publica, completa los datos legales del titular y
          revisa el texto con asesoramiento profesional.
        </p>

        <div className="mt-10 space-y-8">
          {page.sections.map((section) => (
            <section
              className="rounded-md border border-[#e6e1d8] bg-white p-6"
              key={section.heading}
            >
              <h2 className="text-xl font-semibold text-[#101418]">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-[#4d584f]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <LegalFooter />
    </div>
  );
}
