"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { austrianOccupations } from "@/lib/data";
import type { ColorMode } from "@/lib/colors";
import { exposureColor, outlookColor, payColor, eduColor, LEGEND_CONFIG } from "@/lib/colors";
import { useLocale } from "@/lib/locale-context";
import { TreemapCanvas } from "@/components/treemap-canvas";
import { StatsPanel } from "@/components/stats-panel";
import { Card } from "@/components/ui/card";

type MainTab = "treemap" | "explorer" | "families" | "sectors";

const JobsExplorer = dynamic(
  () => import("@/components/jobs-explorer").then((mod) => mod.JobsExplorer),
  { loading: () => <ViewSkeleton /> }
);

const FamilyGrid = dynamic(
  () => import("@/components/family-grid").then((mod) => mod.FamilyGrid),
  { loading: () => <ViewSkeleton /> }
);

const SegmentGrid = dynamic(
  () => import("@/components/segment-grid").then((mod) => mod.SegmentGrid),
  { loading: () => <ViewSkeleton /> }
);

function getMainTab(searchParams: ReturnType<typeof useSearchParams>): MainTab {
  const view = searchParams.get("view");
  if (view === "explorer" || view === "families") return view;
  if (view === "sectors" || view === "segment") return "sectors";
  if (
    searchParams.has("q") ||
    searchParams.has("sort") ||
    searchParams.has("min") ||
    searchParams.has("max")
  ) {
    return "explorer";
  }
  return "treemap";
}

export default function HomePageClient() {
  const [colorMode, setColorMode] = useState<ColorMode>("exposure");
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const de = locale === "de";
  const mainTab = getMainTab(searchParams);

  const legendCfg = LEGEND_CONFIG[colorMode];
  const legendLow = de ? legendCfg.lowDe : legendCfg.low;
  const legendHigh = de ? legendCfg.highDe : legendCfg.high;

  return (
    <div className="space-y-6">
      {/* ── Treemap view ── */}
      {mainTab === "treemap" && (
        <>
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {de ? "BerufsRadar" : "Job Radar Austria"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              {de ? (
                <>
                  <strong className="text-foreground/90">Österreichischer Arbeitsmarkt unter KI-Einfluss.</strong>{" "}
                  KI wird Berufe verändern — das bedeutet nicht, dass alle arbeitslos werden.
                  Es bedeutet, dass sich <strong className="text-foreground/90">Aufgaben, Werkzeuge und Anforderungen verschieben</strong>.
                  Diese Karte bildet alle 75 österreichischen Berufsgruppen ab — die Farbe zeigt hier den geschätzten KI-Einfluss: von Grün (gering) bis Rot (hoch).
                </>
              ) : (
                <>
                  <strong className="text-foreground/90">AI impact across Austria&apos;s labour market.</strong>{" "}
                  AI will transform occupations — that does not mean everyone loses their job.
                  It means <strong className="text-foreground/90">tasks, tools, and requirements shift</strong>.
                  This map visualises all 75 Austrian occupation groups — colour here indicates estimated AI impact, from green (low) to red (high).
                </>
              )}
            </p>
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground select-none">
                {de ? "Datenquellen & Methodik" : "Data sources & methodology"}
              </summary>
              <div className="mt-2 space-y-2 pl-3 border-l border-border/50">
                <p>
                  {de
                    ? "Beschäftigung: Eurostat lfsa_egai2d (2024). Entgelte: Verdienststrukturerhebung 2022 (Statistik Austria OGD). Klassifikation: ISCO-08 Berufsgruppen, ÖNACE-Wirtschaftsabschnitte. 30+ automatisierte Integritätsprüfungen. Alle Rohdaten als Open Government Data frei herunterladbar."
                    : "Employment: Eurostat lfsa_egai2d (2024). Earnings: Structure of Earnings Survey 2022 (Statistik Austria OGD). Classification: ISCO-08 occupation groups, ÖNACE economic sections. 30+ automated integrity tests. All raw data freely downloadable as Open Government Data."}
                </p>
                <p>
                  {de ? (
                    <>
                      Konzept basiert auf{" "}
                      <a href="https://karpathy.ai/jobs/" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline" style={{ color: "var(--webcon-primary, #1b7a95)" }}>
                        Karpathys US Job Market Visualizer
                      </a>
                      ; Daten und Methodik für Österreich vollständig neu aufgebaut.
                    </>
                  ) : (
                    <>
                      Concept based on{" "}
                      <a href="https://karpathy.ai/jobs/" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline" style={{ color: "var(--webcon-primary, #1b7a95)" }}>
                        Karpathy&apos;s US Job Market Visualizer
                      </a>
                      ; data and methodology rebuilt entirely for Austria.
                    </>
                  )}
                </p>
              </div>
            </details>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {de ? "Kennzahl" : "Metric"}
            </span>
            <div className="inline-flex rounded-lg border border-border/70 bg-muted/30 p-0.5">
              {([
                { mode: "exposure" as const, label: de ? "KI-Einfluss" : "AI Impact" },
                { mode: "outlook" as const, label: de ? "Ausblick 2023–2030" : "Outlook 2023–2030" },
                { mode: "pay" as const, label: de ? "Medianentgelt" : "Median earnings" },
                { mode: "education" as const, label: de ? "Ausbildung" : "Education" },
              ] as const).map(({ mode, label }) => (
                <button
                  key={mode}
                  type="button"
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    colorMode === mode
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setColorMode(mode)}
                >
                  {label}
                </button>
              ))}
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
            {colorMode === "exposure" && (de
              ? "Jede Kachel steht für eine der 75 Berufsgruppen (ISCO-08). Die Fläche ist proportional zur Beschäftigtenzahl. Die Farbe zeigt den KI-Einfluss (0–10): Grün = geringe Substituierbarkeit durch generative KI, Rot = hohe Substituierbarkeit. Gruppierung nach ISCO-Hauptgruppe; ÖNACE-Wirtschaftsabschnitt im Tooltip."
              : "Each tile represents one of 75 occupation groups (ISCO-08). Area is proportional to the number of employed persons. Colour indicates AI impact (0–10): green = low substitutability by generative AI, red = high substitutability. Grouped by ISCO major group; ÖNACE economic section in tooltip."
            )}
            {colorMode === "outlook" && (de
              ? "Jede Kachel steht für eine Berufsgruppe. Die Fläche ist proportional zur Beschäftigtenzahl. Die Farbe zeigt die prognostizierte Beschäftigungsentwicklung 2023–2030 (% p.a.): Grün = Wachstum, Rot = Rückgang. Quelle: WIFO/AMS Mittelfristige Beschäftigungsprognose 2023–2030 (Tabellenband, Dez. 2024)."
              : "Each tile represents one occupation group. Area is proportional to employment. Colour shows projected employment growth 2023–2030 (% p.a.): green = growing, red = declining. Source: WIFO/AMS Medium-Term Employment Forecast 2023–2030 (Tabellenband, Dec. 2024)."
            )}
            {colorMode === "pay" && (de
              ? "Jede Kachel steht für eine Berufsgruppe. Die Fläche ist proportional zur Beschäftigtenzahl. Die Farbe zeigt das geschätzte Bruttojahresentgelt (Median, Vollzeit): Grün = höheres Entgelt, Rot = niedrigeres Entgelt. Basis: Verdienststrukturerhebung 2022 (Statistik Austria), umgerechnet auf Jahresbasis inkl. 13./14. Gehalt."
              : "Each tile represents one occupation group. Area is proportional to employment. Colour shows estimated gross annual earnings (median, full-time): green = higher pay, red = lower pay. Source: Structure of Earnings Survey 2022 (Statistik Austria), converted to annual including 13th/14th salary."
            )}
            {colorMode === "education" && (de
              ? "Jede Kachel steht für eine Berufsgruppe. Die Fläche ist proportional zur Beschäftigtenzahl. Die Farbe zeigt das typische Ausbildungsniveau: Grün = höhere formale Qualifikation (Doktorat, Master), Rot = niedrigere (Pflichtschule, Lehre). Zuordnung nach dem für die Berufsgruppe üblichsten Bildungsabschluss."
              : "Each tile represents one occupation group. Area is proportional to employment. Colour shows the typical education level: green = higher formal qualification (doctoral, master's), red = lower (compulsory school, apprenticeship). Assigned by the most common qualification for each occupation group."
            )}
          </Card>

          <StatsPanel data={austrianOccupations} colorMode={colorMode} locale={locale} />

          <TreemapCanvas data={austrianOccupations} colorMode={colorMode} locale={locale} />

        </>
      )}

      {/* ── Explorer view ── */}
      {mainTab === "explorer" && (
        <>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {de ? "ISCO-08-Berufsgruppen" : "ISCO-08 Occupation Groups"}
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {de
                ? "75 Berufsgruppen nach KI-Einfluss, Beschäftigung und Entgelt durchsuchen und filtern."
                : "Search and filter 75 occupation groups by AI impact, employment, and earnings."}
            </p>
          </div>
          <JobsExplorer locale={locale} />
        </>
      )}

      {/* ── ISCO families view ── */}
      {mainTab === "families" && (
        <>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {de ? "ISCO-08-Hauptgruppen" : "ISCO-08 Major Groups"}
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {de
                ? "Berufsgruppen aggregiert nach den 10 ISCO-08-Hauptgruppen (1-stellig) — Beschäftigte, KI-Einfluss und Medianentgelt je Familie."
                : "Occupation groups aggregated by the 10 ISCO-08 major groups (1-digit) — employment, AI impact, and median earnings per family."}
            </p>
          </div>
          <FamilyGrid locale={locale} />
        </>
      )}

      {/* ── ÖNACE sectors view ── */}
      {mainTab === "sectors" && (
        <>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {de ? "ÖNACE-Wirtschaftsabschnitte" : "ÖNACE Economic Sections"}
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {de
                ? "Sektorale Perspektive: Berufsgruppen nach ÖNACE-Wirtschaftsabschnitten (A\u2013S) gruppiert."
                : "Sectoral perspective: occupation groups grouped by ÖNACE economic sections (A\u2013S)."}
            </p>
          </div>
          <SegmentGrid locale={locale} />
        </>
      )}
    </div>
  );
}

function GradientLegend({ colorMode }: { colorMode: ColorMode }) {
  const steps = 20;
  const colors = Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    switch (colorMode) {
      case "exposure":
        return exposureColor(t * 10, 1);
      case "outlook":
        return outlookColor(-12 + t * 24, 1);
      case "pay":
        return payColor(20000 + t * 80000, 1);
      case "education":
        return eduColor(Math.round(t * 7), 1);
      default:
        return `rgba(128,128,128,1)`;
    }
  });

  const gradient = `linear-gradient(to right, ${colors.join(", ")})`;

  return (
    <div
      className="w-20 h-2 rounded-sm"
      style={{ background: gradient }}
    />
  );
}

function ViewSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-10 rounded-xl bg-muted/60" />
      <div className="h-32 rounded-xl bg-muted/40" />
      <div className="h-48 rounded-xl bg-muted/30" />
    </div>
  );
}
