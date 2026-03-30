"use client";

import type { Locale } from "@/lib/locale";
import { TestsSummary } from "@/components/tests-summary";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Database, GitCompare } from "lucide-react";

interface VerificationViewProps {
  locale: Locale;
}

export function VerificationView({ locale }: VerificationViewProps) {
  const de = locale === "de";

  return (
    <div className="space-y-8">
      {/* Two-column: Source-validated vs Internal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 space-y-2 border-teal-200/60 dark:border-teal-900/40">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
            <Database className="h-5 w-5" aria-hidden />
            <h2 className="text-sm font-bold uppercase tracking-wide">
              {de ? "Quelldaten-validiert" : "Source-validated"}
            </h2>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed">
            {de
              ? "13 Tests vergleichen die generierten Daten direkt mit gecachten Originaldaten von Eurostat (lfsa_egai2d, nama_10_a64_e) und der Verdienststrukturerhebung 2022 der Statistik Austria (OGD_veste403). Diese Tests prüfen: ISCO-Beschäftigungssummen, NACE-Sektortotale, VSE-Gehaltsabgleich, Ranking-Korrelation und Datenaktualität."
              : "13 tests compare generated data directly against cached originals from Eurostat (lfsa_egai2d, nama_10_a64_e) and the Structure of Earnings Survey 2022 from Statistics Austria (OGD_veste403). These verify: ISCO employment sums, NACE sector totals, VSE pay matching, ranking correlation, and data freshness."}
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center gap-2 text-foreground/60">
            <ShieldCheck className="h-5 w-5" aria-hidden />
            <h2 className="text-sm font-bold uppercase tracking-wide">
              {de ? "Interne Konsistenz" : "Internal consistency"}
            </h2>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed">
            {de
              ? "86 Tests prüfen die interne Konsistenz der generierten Daten: Vollständigkeit aller Felder, ISCO-08-Strukturregeln, Beschäftigungsverteilung (HHI, Schiefe), Gehaltsplausibilität (Gini, P90/P10), KI-Expositionsverteilung, Outlook-Bias und Kreuzvalidierung zwischen Dimensionen."
              : "86 tests check internal consistency of generated data: field completeness, ISCO-08 structural rules, employment distribution (HHI, skewness), pay plausibility (Gini, P90/P10), AI exposure distribution, outlook bias, and cross-dimensional validation."}
          </p>
        </Card>
      </div>

      {/* Methodology note */}
      <Card className="p-5 space-y-3 bg-muted/30">
        <div className="flex items-center gap-2 text-foreground/60">
          <GitCompare className="h-5 w-5" aria-hidden />
          <h2 className="text-sm font-bold uppercase tracking-wide">
            {de ? "Wissenschaftliche Methodik" : "Scientific methodology"}
          </h2>
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed">
          {de
            ? "Jeder Test folgt einem wissenschaftlichen Format: Eine These formuliert die erwartete Eigenschaft der Daten (z.B. \"Akademische Berufe haben eine höhere KI-Exposition als Handwerksberufe\"). Eine Antithese beschreibt, was ein Scheitern für die Datenqualität bedeuten würde. Der Test produziert dann ein Urteil mit konkreter Evidenz. Klicken Sie auf einen einzelnen Test, um These, Antithese und Evidenz einzusehen."
            : "Each test follows a scientific format: a thesis states the expected property of the data (e.g. \"Professionals have higher AI exposure than craft workers\"). An antithesis describes what failure would mean for data quality. The test then produces a verdict with concrete evidence. Click any individual test to inspect its thesis, antithesis, and evidence."}
        </p>
      </Card>

      {/* The actual test suite */}
      <TestsSummary locale={locale} />

      {/* Data pipeline note */}
      <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
        <p>
          {de
            ? "Quelldaten gecacht in src/lib/real-data.ts (zuletzt abgerufen: 28. M\u00e4rz 2026). Aktualisierung: npx tsx scripts/fetch-real-data.ts && npx tsx scripts/generate-occupations.ts"
            : "Source data cached in src/lib/real-data.ts (last fetched: 28 March 2026). To refresh: npx tsx scripts/fetch-real-data.ts && npx tsx scripts/generate-occupations.ts"}
        </p>
        <p>
          {de
            ? "Alle Quelldaten sind als Open Government Data frei herunterladbar. Die Pipeline ist deterministisch \u2014 kein LLM wird zur Buildzeit aufgerufen."
            : "All source data is freely downloadable as Open Government Data. The pipeline is deterministic \u2014 no LLM is called at build time."}
        </p>
      </div>
    </div>
  );
}
