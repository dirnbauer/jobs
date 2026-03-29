"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { austrianOccupations } from "@/lib/data";
import type { ColorMode } from "@/lib/colors";
import { exposureColor, outlookColor, payColor, eduColor, LEGEND_CONFIG } from "@/lib/colors";
import { howItWorksCopy } from "@/lib/how-it-works-copy";
import { useLocale } from "@/lib/locale-context";
import { TreemapCanvas } from "@/components/treemap-canvas";
import { StatsPanel } from "@/components/stats-panel";
import { Card } from "@/components/ui/card";
import { FamilyGrid } from "@/components/family-grid";
import { JobsExplorer } from "@/components/jobs-explorer";
import { SegmentGrid } from "@/components/segment-grid";

type MainTab = "treemap" | "explorer" | "families" | "sectors";

export default function HomePageClient() {
  const [colorMode, setColorMode] = useState<ColorMode>("exposure");
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const de = locale === "de";

  const mainTab = useMemo<MainTab>(() => {
    const v = searchParams.get("view");
    if (v === "explorer" || v === "families" || v === "sectors") return v;
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

  const hiw = de ? howItWorksCopy.de : howItWorksCopy.en;

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
              {de
                ? "KI-Exposition am österreichischen Arbeitsmarkt"
                : "AI Exposure Across Austria\u2019s Labour Market"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              {de ? (
                <>
                  KI wird Berufe verändern — das bedeutet nicht, dass alle arbeitslos werden.
                  Es bedeutet, dass sich <strong className="text-foreground/90">Aufgaben, Werkzeuge und Anforderungen verschieben</strong>.
                  Diese Karte zeigt, welche der 75 österreichischen Berufsgruppen am stärksten betroffen sind.
                </>
              ) : (
                <>
                  AI will transform occupations — that does not mean everyone loses their job.
                  It means <strong className="text-foreground/90">tasks, tools, and requirements shift</strong>.
                  This map shows which of Austria&apos;s 75 occupation groups are most affected.
                </>
              )}
            </p>
            <blockquote className="text-xs sm:text-sm text-muted-foreground/80 italic border-l-2 border-(--webcon-primary,#1b7a95)/40 pl-3 max-w-2xl">
              {de
                ? "\u201EWir werden die Welt mit KI neu aufbauen.\u201C"
                : "\u201CWe\u2019re going to rebuild the world with AI.\u201D"}
              <span className="not-italic text-muted-foreground/60">
                {" \u2014 Guillermo Rauch, CEO Vercel"}
              </span>
            </blockquote>
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
              {de ? "Einfärben nach" : "Color by"}
            </span>
            <div className="inline-flex rounded-lg border border-border/70 bg-muted/30 p-0.5">
              {([
                { mode: "exposure" as const, label: de ? "KI-Exposition" : "AI Exposure" },
                { mode: "outlook" as const, label: de ? "Ausblick" : "Outlook" },
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
            {de
              ? "Jede Kachel = eine Berufsgruppe. Größere Fläche = mehr Beschäftigte. Farbe folgt dem gewählten Layer. Gruppierung nach ISCO-Hauptgruppe; ÖNACE-Abschnitt im Tooltip."
              : "Each tile = one occupation group. Larger area = more employees. Colour follows the selected layer. Grouped by ISCO major group; ÖNACE section visible in tooltip."}
          </Card>

          <StatsPanel data={austrianOccupations} colorMode={colorMode} locale={locale} />

          <TreemapCanvas data={austrianOccupations} colorMode={colorMode} locale={locale} />

          <details>
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none">
              {hiw.detailsSummary}
            </summary>
            <Card className="mt-2 p-4 sm:p-5 border-border/70 space-y-4 text-sm text-muted-foreground leading-relaxed">
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
            </Card>
          </details>
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
                ? "75 Berufsgruppen nach KI-Exposition, Beschäftigung und Entgelt durchsuchen und filtern."
                : "Search and filter 75 occupation groups by AI exposure, employment, and earnings."}
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
                ? "Berufsgruppen aggregiert nach den 10 ISCO-08-Hauptgruppen (1-stellig) — Beschäftigte, KI-Exposition und Medianentgelt je Familie."
                : "Occupation groups aggregated by the 10 ISCO-08 major groups (1-digit) — employment, AI exposure, and median earnings per family."}
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
