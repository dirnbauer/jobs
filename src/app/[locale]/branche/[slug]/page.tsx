import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BranchCharts } from "@/components/branch-charts";
import { Card } from "@/components/ui/card";
import { austrianOccupations } from "@/lib/data";
import { computeMarketStats } from "@/lib/jobs-aggregate";
import { explorerQueryString } from "@/lib/explorer-params";
import { getBranchBySlug, ONACE_BRANCHES } from "@/lib/onace-branches";
import type { Locale } from "@/lib/locale";

export function generateStaticParams() {
  return ONACE_BRANCHES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = raw === "de" ? "de" : "en";
  const branch = getBranchBySlug(slug);
  if (!branch) return { title: locale === "de" ? "Branche" : "Branch" };
  const title = locale === "de" ? branch.labelDe : branch.labelEn;
  const rows = austrianOccupations.filter((o) => o.onaceSection === branch.section);
  const stats = computeMarketStats(rows);
  const desc =
    locale === "de"
      ? `${rows.length} Berufsgruppen · ${stats.totalJobs.toLocaleString("de-AT")} Jobs · Ø KI-Exposition ${stats.avgExposure.toFixed(1)}/10`
      : `${rows.length} occupation groups · ${stats.totalJobs.toLocaleString("en-US")} jobs · avg AI exposure ${stats.avgExposure.toFixed(1)}/10`;
  return {
    title: `${title} — ${locale === "de" ? "KI-Exposition Österreich" : "AI Exposure Austria"}`,
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

export default async function BranchePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = raw === "de" ? "de" : "en";
  const branch = getBranchBySlug(slug);
  if (!branch) notFound();

  const rows = austrianOccupations.filter((o) => o.onaceSection === branch.section);
  const stats = computeMarketStats(rows);
  const at = computeMarketStats(austrianOccupations);
  const de = locale === "de";
  const label = de ? branch.labelDe : branch.labelEn;

  const avgDiff = stats.avgExposure - at.avgExposure;
  const avgVsAt =
    Math.abs(avgDiff) < 0.05
      ? de
        ? "entspricht dem AT-Durchschnitt"
        : "matches the AT average"
      : avgDiff < 0
        ? de
          ? "unter dem AT-Durchschnitt"
          : "below the AT average"
        : de
          ? "über dem AT-Durchschnitt"
          : "above the AT average";

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Link
          href={`/${locale}?view=segment`}
          className="text-sm text-primary hover:underline underline-offset-2 inline-flex items-center gap-1"
        >
          ← {de ? "Zurück zu Segmenten" : "Back to segments"}
        </Link>
      </div>

      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">ÖNACE {branch.section}</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{label}</h1>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-2xl">
          {de
            ? "Kennzahlen beziehen sich auf ISCO-Berufsgruppen, die diesem ÖNACE-Abschnitt zugeordnet sind (Beschäftigung: LFS/Mikrozensus nach ISCO-08, aufgeteilt mit NACE-Gewichten). Ergänzung zur berufszentrierten Sicht — keine separate Branchen-Erhebung."
            : "Figures cover ISCO occupation groups mapped to this ÖNACE section (employment: LFS/Mikrozensus by ISCO-08, split using NACE weights). Supporting sector context for the occupation-first view — not a standalone industry survey."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3 border-border/70">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
            {de ? "Berufsgruppen" : "Occupation groups"}
          </div>
          <div className="text-xl font-bold tabular-nums mt-0.5">{rows.length}</div>
          <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
            {de ? "ISCO-Aggregate mit Mapping auf diesen Abschnitt" : "ISCO aggregates linked to this section"}
          </p>
        </Card>
        <Card className="p-3 border-border/70">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
            {de ? "Beschäftigte" : "Employees"}
          </div>
          <div className="text-xl font-bold tabular-nums mt-0.5">
            {stats.totalJobs.toLocaleString(de ? "de-AT" : "en-US")}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
            {de ? "Summe über zugeordnete Gruppen" : "Sum across mapped groups"}
          </p>
        </Card>
        <Card className="p-3 border-border/70">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
            {de ? "Ø KI-Exposition" : "Avg. AI exposure"}
          </div>
          <div className="text-xl font-bold tabular-nums mt-0.5">
            {stats.avgExposure.toFixed(1)}
            <span className="text-sm font-medium text-muted-foreground">/10</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
            {de ? "beschäftigungsgewichtet · " : "job-weighted · "}
            {avgVsAt}
          </p>
        </Card>
        <Card className="p-3 border-border/70">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
            {de ? "Hohe Exposition" : "High exposure"}
          </div>
          <div className="text-xl font-bold tabular-nums mt-0.5">{stats.highExposurePct.toFixed(1)}%</div>
          <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
            {de ? "Anteil Beschäftigung bei KI-Score ≥7" : "Share of jobs at AI score ≥7"}
          </p>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground border-l-2 border-primary/35 pl-3 py-1 leading-relaxed">
        {de ? (
          <>
            <span className="text-foreground/90 font-medium">Vergleich Österreich gesamt:</span> Ø KI{" "}
            {at.avgExposure.toFixed(1)}/10 · {at.highExposurePct.toFixed(1)}% bei Score ≥7 ·{" "}
            {at.totalJobs.toLocaleString("de-AT")} Beschäftigte (alle Gruppen).
          </>
        ) : (
          <>
            <span className="text-foreground/90 font-medium">Austria overall:</span> avg AI{" "}
            {at.avgExposure.toFixed(1)}/10 · {at.highExposurePct.toFixed(1)}% at score ≥7 ·{" "}
            {at.totalJobs.toLocaleString("en-US")} employees (all groups).
          </>
        )}
      </p>

      <Card className="p-4 sm:p-6 border-border/70 bg-linear-to-br from-card to-muted/15">
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {de
            ? "Verteilung und größte Gruppen innerhalb dieses Abschnitts (interaktive Diagramme)."
            : "Distribution and largest groups within this section (interactive charts)."}
        </p>
        <BranchCharts rows={rows} locale={de ? "de" : "en"} branchLabel={label} />
      </Card>

      <div>
        <h2 className="text-sm font-semibold mb-3">{de ? "Berufsgruppen in dieser Branche" : "Occupation groups in this branch"}</h2>
        <ul className="space-y-2 text-sm">
          {rows.map((o) => (
            <li key={o.slug}>
              <Link
                href={`/${locale}/beruf/${o.slug}?${DEFAULT_EXPLORER}`}
                className="text-primary hover:underline underline-offset-2"
              >
                {de ? o.titleDe : o.title}
              </Link>
              <span className="text-muted-foreground">
                {" "}
                · {(o.jobs ?? 0).toLocaleString(de ? "de-AT" : "en-US")} · {de ? "KI" : "AI"} {o.exposure ?? "—"}/10
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
