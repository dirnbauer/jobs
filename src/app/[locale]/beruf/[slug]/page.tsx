import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BerufDetailClient } from "@/components/beruf-detail-client";
import { austrianOccupations } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import { getVseSupplementForIsco } from "@/lib/vse-supplement";

export function generateStaticParams() {
  return austrianOccupations.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = raw === "de" ? "de" : "en";
  const occ = austrianOccupations.find((o) => o.slug === slug);
  if (!occ) return { title: locale === "de" ? "Beruf" : "Occupation" };

  const title = locale === "de" ? occ.titleDe : occ.title;
  const family = locale === "de" ? occ.iscoLabelDe : occ.iscoLabel;
  const desc =
    locale === "de"
      ? `${family} · KI-Exposition ${occ.exposure ?? "—"}/10 · ${(occ.jobs ?? 0).toLocaleString("de-AT")} Beschäftigte in Österreich (Schätzung).`
      : `${family} · AI exposure ${occ.exposure ?? "—"}/10 · ${(occ.jobs ?? 0).toLocaleString("en-US")} employees in Austria (estimate).`;

  return {
    title: `${title} — ${locale === "de" ? "KI-Exposition Österreich" : "AI Exposure Austria"}`,
    description: desc,
    openGraph: { title, description: desc },
  };
}

export default async function BerufPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = raw === "de" ? "de" : "en";
  const occ = austrianOccupations.find((o) => o.slug === slug);
  if (!occ) notFound();
  const vseSupplement = getVseSupplementForIsco(occ.isco08);

  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">…</div>}>
      <BerufDetailClient occ={occ} locale={locale} vseSupplement={vseSupplement} />
    </Suspense>
  );
}
