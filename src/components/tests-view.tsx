"use client";

import { useState } from "react";
import { dataTests } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, XCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestsViewProps {
  locale: Locale;
}

interface TestResult {
  id: string;
  passed: boolean;
  actual: string;
  expected: string;
}

const testsById = new Map(dataTests.map((t) => [t.id, t]));

const TEST_GROUPS = [
  {
    id: "integrity",
    labelEn: "Dataset integrity",
    labelDe: "Datenintegrität",
    descriptionEn: "Coverage, sources, slugs, and required base fields.",
    descriptionDe: "Abdeckung, Quellen, Slugs und erforderliche Basisfelder.",
    testIds: [
      "total-employment",
      "no-zero-jobs",
      "no-zero-pay",
      "education-valid",
      "unique-slugs",
      "has-source",
      "occupation-count",
    ],
  },
  {
    id: "occupation-structure",
    labelEn: "Occupation-first structure",
    labelDe: "Occupation-first Struktur",
    descriptionEn: "Checks for ISCO codes, major families, and family labels that drive navigation.",
    descriptionDe: "Prüfungen für ISCO-Codes, Hauptfamilien und Familienlabels, die Navigation und Struktur tragen.",
    testIds: [
      "isco-fields-present",
      "isco-major-matches-code",
      "isco-family-labels-consistent",
      "isco-family-coverage",
    ],
  },
  {
    id: "pay",
    labelEn: "Pay distribution",
    labelDe: "Gehaltsverteilung",
    descriptionEn: "Median levels, dispersion, wage bill, and education ladder plausibility.",
    descriptionDe: "Plausibilitätschecks für Median, Streuung, Lohnsumme und Bildungsleiter.",
    testIds: [
      "pay-range",
      "salary-gini",
      "salary-cv",
      "education-pay-ladder",
      "weighted-median-pay",
      "wage-bill",
      "education-extreme-share",
    ],
  },
  {
    id: "ai",
    labelEn: "AI scoring",
    labelDe: "KI-Scoring",
    descriptionEn: "Bounds, spread, rationale quality, and directional patterns for exposure and outlook.",
    descriptionDe: "Grenzen, Spannweite, Begründungen und Richtungslogik für Exposition und Ausblick.",
    testIds: [
      "exposure-range",
      "outlook-range",
      "exposure-span",
      "exposure-pay-correlation",
      "physical-low-exposure",
      "knowledge-high-exposure",
      "exposure-rationale-length",
      "outlook-unbiased",
    ],
  },
  {
    id: "sector",
    labelEn: "Sector context",
    labelDe: "Sektor-Kontext",
    descriptionEn: "ÖNACE cross-checks stay as supporting context for the occupation-first model.",
    descriptionDe: "ÖNACE-Checks bleiben als wirtschaftlicher Kontext für das occupation-first Modell erhalten.",
    testIds: [
      "manufacturing-total",
      "it-total",
      "services-share",
      "health-total",
      "construction-range",
      "nace-sections-all",
      "employment-hhi",
      "trade-sector-g",
    ],
  },
] as const;

function TestCard({
  t,
  result,
  de,
}: {
  t: (typeof dataTests)[number];
  result: TestResult | undefined;
  de: boolean;
}) {
  return (
    <Card
      className={`p-4 transition-colors ${
        result
          ? result.passed
            ? "border-green-200 dark:border-green-900/50"
            : "border-red-200 dark:border-red-900/50"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {result ? (
            result.passed ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            )
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-medium text-foreground leading-tight">
            {de ? t.nameDe : t.name}
          </div>
          <div className="text-base text-foreground/80 mt-0.5 leading-relaxed">
            {de ? t.descriptionDe : t.description}
          </div>
          {result && (
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
              <span>
                <span className="text-foreground/75">
                  {de ? "Erwartet" : "Expected"}:{" "}
                </span>
                <span className="font-mono text-foreground/80">{result.expected}</span>
              </span>
              <span>
                <span className="text-foreground/75">
                  {de ? "Aktuell" : "Actual"}:{" "}
                </span>
                <span
                  className={`font-mono ${
                    result.passed
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {result.actual}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/** Minimum time to show the running state so the UI visibly updates (fast sync tests). */
const RUN_FEEDBACK_MS = 200;

function formatRunTime(d: Date, de: boolean): string {
  return d.toLocaleTimeString(de ? "de-AT" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function TestsView({ locale }: TestsViewProps) {
  const de = locale === "de";
  const [results, setResults] = useState<TestResult[]>(() =>
    dataTests.map((t) => {
      const r = t.test();
      return { id: t.id, ...r };
    })
  );
  const [ran, setRan] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunAt, setLastRunAt] = useState<Date | null>(() => new Date());

  const runTests = () => {
    if (isRunning) return;
    const t0 = performance.now();
    setIsRunning(true);
    window.setTimeout(() => {
      const res = dataTests.map((t) => {
        const r = t.test();
        return { id: t.id, ...r };
      });
      setResults(res);
      setRan(true);
      setLastRunAt(new Date());
      const elapsed = performance.now() - t0;
      const rest = Math.max(0, RUN_FEEDBACK_MS - elapsed);
      window.setTimeout(() => setIsRunning(false), rest);
    }, 0);
  };

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const resultsById = new Map(results.map((result) => [result.id, result]));
  const groupedTests = TEST_GROUPS.map((group) => {
    const tests = group.testIds
      .map((id) => testsById.get(id))
      .filter((test): test is (typeof dataTests)[number] => Boolean(test));
    const passedCount = tests.filter((test) => resultsById.get(test.id)?.passed).length;
    return { ...group, tests, passedCount };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="text-base text-foreground/80">
          {de
            ? "Über 30 automatisierte Integritätsprüfungen verifizieren den Datensatz nach Beschäftigungssummen, Entgeltplausibilität, ISCO-Konsistenz und Expositionsverteilung. Diese Tests sichern die wissenschaftliche Nachprüfbarkeit und Reproduzierbarkeit der gesamten Pipeline. Nach jeder Regeneration des Datensatzes erneut ausführen."
            : "30+ automated integrity checks verify the dataset for employment totals, earnings plausibility, ISCO consistency, and exposure distribution. These tests ensure the scientific verifiability and reproducibility of the entire pipeline. Re-run them after each dataset regeneration."}
        </div>
        <Button
          type="button"
          onClick={runTests}
          disabled={isRunning}
          size="sm"
          variant="outline"
          className="shrink-0"
          aria-busy={isRunning}
        >
          {isRunning ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <PlayCircle className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          )}
          {isRunning
            ? de
              ? "Läuft…"
              : "Running…"
            : de
              ? "Tests ausführen"
              : "Run Tests"}
        </Button>
      </div>

      {lastRunAt && (
        <p className="text-xs text-foreground/75" aria-live="polite">
          {de ? "Zuletzt ausgeführt:" : "Last run:"}{" "}
          <time dateTime={lastRunAt.toISOString()}>{formatRunTime(lastRunAt, de)}</time>
        </p>
      )}

      {ran && (
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            key={lastRunAt?.getTime() ?? 0}
            variant={passed === total ? "default" : "destructive"}
            className="text-sm px-3 py-1 transition-colors"
          >
            {passed}/{total} {de ? "bestanden" : "passed"}
          </Badge>
          {passed === total && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ {de ? "Alle Tests bestanden!" : "All tests passed!"}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2">
        {groupedTests.map((group) => (
          <Card key={group.id} className="p-3">
            <div className="text-xs uppercase tracking-wide text-foreground/60">
              {de ? group.labelDe : group.labelEn}
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-3">
              <div className="text-lg font-semibold text-foreground">
                {group.passedCount}/{group.tests.length}
              </div>
              <Badge variant={group.passedCount === group.tests.length ? "default" : "destructive"}>
                {de ? "bestanden" : "passed"}
              </Badge>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-foreground/70">
              {de ? group.descriptionDe : group.descriptionEn}
            </p>
          </Card>
        ))}
      </div>

      <div className="space-y-5">
        {groupedTests.map((group) => (
          <section key={group.id} className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  {de ? group.labelDe : group.labelEn}
                </h2>
                <p className="text-sm text-foreground/75 leading-relaxed">
                  {de ? group.descriptionDe : group.descriptionEn}
                </p>
              </div>
              <Badge variant={group.passedCount === group.tests.length ? "default" : "destructive"}>
                {group.passedCount}/{group.tests.length} {de ? "bestanden" : "passed"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
              {group.tests.map((t) => (
                <TestCard
                  key={t.id}
                  t={t}
                  result={resultsById.get(t.id)}
                  de={de}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
