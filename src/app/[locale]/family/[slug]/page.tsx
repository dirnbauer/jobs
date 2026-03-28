import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BranchCharts } from "@/components/branch-charts";
import { Card } from "@/components/ui/card";
import { austrianOccupations } from "@/lib/data";
import { explorerQueryString } from "@/lib/explorer-params";
import {
  buildOccupationFamilySummaries,
  getOccupationFamilyBySlug,
} from "@/lib/market-groups";
import type { Locale } from "@/lib/locale";

export function generateStaticParams() {
  return buildOccupationFamilySummaries(austrianOccupations).map(({ family }) => ({
    slug: family.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = raw === "de" ? "de" : "en";
  const family = getOccupationFamilyBySlug(slug);
  if (!family) return { title: locale === "de" ? "ISCO-Familie" : "ISCO family" };

  const summary = buildOccupationFamilySummaries(austrianOccupations).find(
    (entry) => entry.family.slug === slug
  );
  const title = locale === "de" ? family.labelDe : family.labelEn;
  const desc =
    locale === "de"
      ? `${summary?.rows.length ?? 0} Berufsgruppen · ${(summary?.stats.totalJobs ?? 0).toLocaleString("de-AT")} Jobs · Ø KI-Exposition ${(summary?.stats.avgExposure ?? 0).toFixed(1)}/10`
      : `${summary?.rows.length ?? 0} occupation groups · ${(summary?.stats.totalJobs ?? 0).toLocaleString("en-US")} jobs · avg AI exposure ${(summary?.stats.avgExposure ?? 0).toFixed(1)}/10`;

  return {
    title: `${title} — KI-Exposition Österreich`,
    description: desc,
    openGraph: { title, description: desc },
  };
}

const DEFAULT_EXPLORER = explorerQueryString({
  q: "",
  sort: "exposure-desc",
  exMin: 0,
  exMax: 10,
});

export default async function FamilyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = raw === "de" ? "de" : "en";
  const de = locale === "de";
  const family = getOccupationFamilyBySlug(slug);
  if (!family) notFound();

  const summary = buildOccupationFamilySummaries(austrianOccupations).find(
    (entry) => entry.family.slug === slug
  );
  if (!summary) notFound();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Link
          href={`/${locale}?view=families`}
          className="text-sm text-primary hover:underline underline-offset-2 inline-flex items-center gap-1"
        >
          ← {de ? "Zurück zu ISCO-Familien" : "Back to ISCO families"}
        </Link>
      </div>

      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">ISCO {family.major}</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {de ? family.labelDe : family.labelEn}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {de ? family.blurbDe : family.blurbEn}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3 border-border/70">
          <div className="text-[10px] uppercase text-muted-foreground font-semibold">
            {de ? "Gruppen" : "Groups"}
          </div>
          <div className="text-xl font-bold tabular-nums">{summary.rows.length}</div>
        </Card>
        <Card className="p-3 border-border/70">
          <div className="text-[10px] uppercase text-muted-foreground font-semibold">
            {de ? "Jobs" : "Jobs"}
          </div>
          <div className="text-xl font-bold tabular-nums">
            {summary.stats.totalJobs.toLocaleString(de ? "de-AT" : "en-US")}
          </div>
        </Card>
        <Card className="p-3 border-border/70">
          <div className="text-[10px] uppercase text-muted-foreground font-semibold">Ø KI</div>
          <div className="text-xl font-bold tabular-nums">{summary.stats.avgExposure.toFixed(1)}</div>
        </Card>
        <Card className="p-3 border-border/70">
          <div className="text-[10px] uppercase text-muted-foreground font-semibold">€</div>
          <div className="text-xl font-bold tabular-nums">€{Math.round(summary.avgPay / 1000)}K</div>
        </Card>
      </div>

      <Card className="p-4 sm:p-6 border-border/70 bg-linear-to-br from-card to-muted/15">
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {de
            ? "Interaktive Auswertung der Beschäftigung und Exposition innerhalb dieser ISCO-Familie."
            : "Interactive breakdown of employment and exposure inside this ISCO family."}
        </p>
        <BranchCharts
          rows={summary.rows}
          locale={de ? "de" : "en"}
          branchLabel={de ? family.labelDe : family.labelEn}
        />
      </Card>

      <div>
        <h2 className="text-sm font-semibold mb-3">
          {de ? "Berufsgruppen in dieser Familie" : "Occupation groups in this family"}
        </h2>
        <ul className="space-y-2 text-sm">
          {summary.rows.map((o) => (
            <li key={o.slug}>
              <Link
                href={`/${locale}/beruf/${o.slug}?${DEFAULT_EXPLORER}`}
                className="text-primary hover:underline underline-offset-2"
              >
                {de ? o.titleDe : o.title}
              </Link>
              <span className="text-muted-foreground">
                {" "}
                · {(o.jobs ?? 0).toLocaleString(de ? "de-AT" : "en-US")} · KI {o.exposure ?? "—"}/10
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
