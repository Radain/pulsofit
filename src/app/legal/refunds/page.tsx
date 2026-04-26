import type { Metadata } from "next";
import { LegalPageView } from "@/components/legal-page";
import { getLegalPage } from "@/lib/legal-content";

const page = getLegalPage("refunds")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function RefundsPage() {
  return <LegalPageView page={page} />;
}
