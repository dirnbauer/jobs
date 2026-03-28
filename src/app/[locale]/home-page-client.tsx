"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { austrianOccupations } from "@/lib/data";
import type { ColorMode } from "@/lib/colors";
import { greenRedCSS, LEGEND_CONFIG } from "@/lib/colors";
import { howItWorksCopy } from "@/lib/how-it-works-copy";
import { useLocale } from "@/lib/locale-context";
import { TreemapCanvas } from "@/components/treemap-canvas";
import { StatsPanel } from "@/components/stats-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FamilyGrid } from "@/components/family-grid";
import { JobsExplorer } from "@/components/jobs-explorer";
import { SegmentGrid } from "@/components/segment-grid";

type MainTab = "treemap" | "explorer" | "families" | "sectors" | "how";

export default function HomePageClient() {
  const [colorMode, setColorMode] = useState<ColorMode>("outlook");
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const de = locale === "de";

  const mainTab = useMemo<MainTab>(() => {
    const v = searchParams.get("view");
    if (v === "explorer" || v === "families" || v === "sectors" || v === "how") return v;
    if (
      searchParams.has("q") ||
      searchParams.has("sort") ||
      searchParams.has("min") ||
      searchParams.has("max")
    ) {
      return "explorer";
    }
    return "treemap";
  }, [searchParams]);

  const setMainTab = useCallback(
    (next: MainTab) => {
      const sp = new URLSearchParams(searchParams.toString());
      if (next === "treemap") sp.delete("view");
      else sp.set("view", next);
      const qs = sp.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const hiw = de ? howItWorksCopy.de : howItWorksCopy.en;

  const legendCfg = LEGEND_CONFIG[colorMode];
  const legendLow = de ? legendCfg.lowDe : legendCfg.low;
  const legendHigh = de ? legendCfg.highDe : legendCfg.high;

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {de
            ? "KI-Exposition am österreichischen Arbeitsmarkt"
            : "AI exposure across Austria’s labour market"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
          {de ? (
            <>
              <strong className="text-foreground/90">
                Welche Berufe werden durch generative KI-Modelle am stärksten verändert?
              </strong>{" "}
              71 Berufsgruppen (ISCO-08) bilden die Primärebene; ÖNACE-Wirtschaftsabschnitte liefern den
              sektoralen Kontext. Alle Beschäftigungs- und Entgeltdaten stammen aus amtlichen, öffentlich
              zugänglichen Quellen (Eurostat, Statistik Austria Open Government Data) und sind vollständig
              reproduzierbar.
            </>
          ) : (
            <>
              <strong className="text-foreground/90">
                Which occupations are most affected by generative AI models?
              </strong>{" "}
              71 occupation groups (ISCO-08) form the primary layer; ÖNACE economic sections provide
              sectoral context. All employment and earnings data originate from official, publicly
              accessible sources (Eurostat, Statistik Austria Open Government Data) and are fully
              reproducible.
            </>
          )}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed max-w-3xl border-l-2 border-(--webcon-primary,#1b7a95)/40 pl-3">
          {de ? (
            <>
              <strong className="text-foreground/85">Hinweis:</strong> Konzept und Bewertungsrahmen basieren auf{" "}
              <a
                href="https://karpathy.ai/jobs/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline font-medium"
                style={{ color: "var(--webcon-primary, #1b7a95)" }}
              >
                Karpathys US Job Market Visualizer
              </a>
              ; Datenquellen, Informationsarchitektur und Methodik wurden für den
              österreichischen Arbeitsmarkt vollständig neu aufgebaut — alle Daten sind aus amtlichen Quellen
              nachprüfbar und reproduzierbar (webconsulting.at).
            </>
          ) : (
            <>
              <strong className="text-foreground/85">Credit:</strong> Concept and scoring rubric based on{" "}
              <a
                href="https://karpathy.ai/jobs/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline font-medium"
                style={{ color: "var(--webcon-primary, #1b7a95)" }}
              >
                Andrej Karpathy&apos;s US Job Market Visualizer
              </a>
              ; data sources, information architecture, and methodology were rebuilt
              entirely for the Austrian labour market — all data is verifiable from official sources
              and fully reproducible (webconsulting.at).
            </>
          )}
        </p>
      </div>

      {/* Main tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-muted/40 border border-border/60">
        {(
          [
            { id: "treemap" as const, label: de ? "Treemap" : "Treemap" },
            { id: "explorer" as const, label: de ? "Berufe-Explorer" : "Job explorer" },
            { id: "families" as const, label: de ? "ISCO-Familien" : "ISCO families" },
            { id: "sectors" as const, label: de ? "Sektoren" : "Sectors" },
            { id: "how" as const, label: de ? "Einordnung & Methodik" : "Context & method" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMainTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mainTab === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mainTab === "explorer" && <JobsExplorer locale={locale} />}

      {mainTab === "families" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground max-w-2xl">
            {de
              ? "Primäre Navigationsebene: offizielle ISCO-08-Hauptgruppen (1-stellig). Jede Karte zeigt Beschäftigte, KI-Expositionsgrad und Medianentgelt innerhalb derselben Berufsfamilie."
              : "Primary navigation layer: official ISCO-08 major groups (1-digit). Each card shows employed persons, AI exposure score, and median earnings within the same occupation family."}
          </p>
          <FamilyGrid locale={locale} />
        </div>
      )}

      {mainTab === "sectors" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground max-w-2xl">
            {de
              ? "Sekundäre Perspektive: ÖNACE-2025-Wirtschaftsabschnitte als sektoraler Kontext. Jede Karte aggregiert die zugeordneten Berufsgruppen."
              : "Secondary perspective: ÖNACE 2025 economic sections as sectoral context. Each card aggregates the assigned occupation groups."}
          </p>
          <SegmentGrid locale={locale} />
        </div>
      )}

      {mainTab === "how" && (
        <Card className="p-4 sm:p-5 border-border/70 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-base font-semibold text-foreground">{hiw.detailsSummary}</h2>
          <p>{hiw.lead}</p>
          <p>{hiw.areaColor}</p>
          <div>
            <p className="font-medium text-foreground mb-1">{hiw.bandsTitle}</p>
            <p className="mb-2">{hiw.bandsIntro}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>{hiw.band01}</li>
              <li>{hiw.band23}</li>
              <li>{hiw.band45}</li>
              <li>{hiw.band67}</li>
              <li>{hiw.band810}</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">{hiw.dataTitle}</p>
            <p>{hiw.dataBody}</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">{hiw.caveatTitle}</p>
            <p>{hiw.caveatBody}</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">{hiw.atTitle}</p>
            <p>{hiw.atBody}</p>
          </div>
          <p className="text-xs border-t border-border/50 pt-3">
            {de ? (
              <>
                Familien- und Sektor-Seiten: Diagramme mit{" "}
                <a
                  href="https://ui.shadcn.com/charts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  shadcn/ui Charts
                </a>{" "}
                (Recharts, animiert).
              </>
            ) : (
              <>
                Family and sector pages: charts use{" "}
                <a
                  href="https://ui.shadcn.com/charts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  shadcn/ui Charts
                </a>{" "}
                (Recharts, animated).
              </>
            )}
          </p>
        </Card>
      )}

      {mainTab === "treemap" && (
        <>
          <Card className="p-3 border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20">
            <div className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 text-sm shrink-0 mt-0.5">✓</span>
              <div className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">
                  {de ? "Nachprüfbare, reproduzierbare Datengrundlage" : "Verifiable, reproducible data pipeline"}
                </strong>{" "}
                {de
                  ? "Jeder Datenpunkt ist auf eine amtliche Quelle rückführbar. Beschäftigung: Eurostat lfsa_egai2d (Mikrozensus-Arbeitskräfteerhebung 2024) nach ISCO-08. Entgelte: Verdienststrukturerhebung 2022 (Statistik Austria OGD) nach ISCO-08. Alle Rohdaten sind als Open Government Data frei herunterladbar; die Generierungspipeline (scripts/generate-occupations.ts) ist quelloffen und jederzeit reproduzierbar. 30+ automatisierte Integritätsprüfungen verifizieren den Datensatz bei jeder Regeneration. Quellenlinks und Downloadpfade unter Quellen."
                  : "Every data point is traceable to an official source. Employment: Eurostat lfsa_egai2d (Mikrozensus-Arbeitskräfteerhebung 2024) by ISCO-08. Earnings: Structure of Earnings Survey 2022 (Statistik Austria OGD) by ISCO-08. All raw data is freely downloadable as Open Government Data; the generation pipeline (scripts/generate-occupations.ts) is open-source and fully reproducible. 30+ automated integrity checks verify the dataset on every regeneration. Source links and download paths under Sources."}
              </div>
            </div>
          </Card>

          <details>
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none">
              {de ? "Unterschiede zur US-Originalversion" : "Differences from the US original"}
            </summary>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground pl-4">
              {(de
                ? [
                    "Datenquellen: Eurostat lfsa_egai2d, nama_10_a64_e, Statistik Austria Verdienststrukturerhebung 2022 statt US Bureau of Labor Statistics",
                    "Informationsarchitektur: berufsbasiert nach ISCO-08 statt sektorbasiert nach SOC",
                    "Routenstruktur: /occupation, /family, /sector mit Weiterleitungen für Altpfade",
                    "Entgeltangaben: EUR Bruttojahresentgelt einschließlich 13. und 14. Monatsgehalt",
                    "ISCO-Hauptgruppen und ÖNACE-Wirtschaftsabschnitte parallel dargestellt",
                    "Visualisierungen und Navigationsstruktur nach Berufsgruppen statt ausschließlich nach Wirtschaftsabschnitten",
                    "Zweisprachige Benutzeroberfläche (Deutsch/Englisch)",
                    "Technologie: Next.js, TypeScript, shadcn/ui, webconsulting Design System",
                  ]
                : [
                    "Data sources: Eurostat lfsa_egai2d, nama_10_a64_e, Statistik Austria Structure of Earnings Survey 2022 instead of US Bureau of Labor Statistics",
                    "Information architecture: occupation-based by ISCO-08 instead of sector-based by SOC",
                    "Route structure: /occupation, /family, /sector with redirects for legacy paths",
                    "Earnings: EUR gross annual including 13th and 14th month salary",
                    "ISCO major groups and ÖNACE economic sections displayed in parallel",
                    "Visualisations and navigation structured by occupation group instead of solely by economic section",
                    "Bilingual user interface (German/English)",
                    "Technology: Next.js, TypeScript, shadcn/ui, webconsulting design system",
                  ]
              ).map((change, i) => (
                <li key={i} className="list-disc">
                  {change}
                </li>
              ))}
            </ul>
          </details>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {de ? "Ebene" : "Layer"}
              </h2>
              <div className="flex gap-1">
                {(
                  [
                    { mode: "outlook" as const, label: de ? "Ausblick" : "Outlook" },
                    { mode: "pay" as const, label: de ? "Medianentgelt" : "Median earnings" },
                    { mode: "education" as const, label: de ? "Ausbildung" : "Education" },
                    { mode: "exposure" as const, label: de ? "KI-Exposition" : "AI Exposure" },
                  ] as const
                ).map(({ mode, label }) => (
                  <Button
                    key={mode}
                    variant={colorMode === mode ? "secondary" : "ghost"}
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setColorMode(mode)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span>{legendLow}</span>
              <GradientLegend colorMode={colorMode} />
              <span>{legendHigh}</span>
            </div>
          </div>

          <Card className="p-3 bg-muted/30 text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">
              {de ? "Diagramm lesen" : "Reading the chart"}
            </strong>{" "}
            {de
              ? "Jede Kachel repräsentiert eine ISCO-08-Berufsgruppe. Größere Fläche = höhere Erwerbstätigenzahl. Die Farbgebung folgt dem aktivierten Layer: Ausblick (grün = wachsend, rot = rückläufig), Medianentgelt, Ausbildungsniveau oder KI-Expositionsgrad. Gruppierung nach ISCO-Hauptgruppe (Familie); der ÖNACE-Wirtschaftsabschnitt bleibt im Tooltip sichtbar. Alle dargestellten Beschäftigungs- und Entgeltwerte sind aus amtlichen Quellen reproduzierbar."
              : "Each tile represents one ISCO-08 occupation group. Larger area = higher number of employed persons. Colour follows the active layer: outlook (green = growing, red = declining), median earnings, education level, or AI exposure score. Tiles are grouped by ISCO major group (family); the ÖNACE economic section remains visible in the tooltip. All displayed employment and earnings figures are reproducible from official sources."}
          </Card>

          <StatsPanel data={austrianOccupations} colorMode={colorMode} locale={locale} />

          <TreemapCanvas data={austrianOccupations} colorMode={colorMode} locale={locale} />
        </>
      )}
    </div>
  );
}

function GradientLegend({ colorMode }: { colorMode: ColorMode }) {
  const steps = 20;
  const colors = Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return colorMode === "exposure" ? greenRedCSS(t, 1) : greenRedCSS(1 - t, 1);
  });

  const gradient = `linear-gradient(to right, ${colors.join(", ")})`;

  return (
    <div
      className="w-20 h-2 rounded-sm"
      style={{ background: gradient }}
    />
  );
}
