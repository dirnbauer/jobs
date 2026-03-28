import type { Metadata } from "next";
import { buildSubpageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = raw === "de" ? "de" : "en";
  return buildSubpageMetadata(locale, "datenschutz");
}

export default function DatenschutzLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
