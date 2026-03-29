"use client";

import { useEffect, useRef, useState } from "react";
import { dataTests } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, PlayCircle, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestsSummaryProps {
  locale: Locale;
}

interface TestResult {
  id: string;
  passed: boolean;
  actual: string;
  expected: string;
}

interface TestLogEntry {
  id: string;
  passed?: boolean;
  name: string;
  actual?: string;
  expected?: string;
  summary?: boolean;
}

const TEST_GROUPS = [
  { id: "integrity", labelEn: "Integrity", labelDe: "Integrität", testIds: ["total-employment", "no-zero-jobs", "no-zero-pay", "education-valid", "unique-slugs", "has-source", "occupation-count"] },
  { id: "occupation-structure", labelEn: "ISCO structure", labelDe: "ISCO-Struktur", testIds: ["isco-fields-present", "isco-major-matches-code", "isco-family-labels-consistent", "isco-family-coverage"] },
  { id: "pay", labelEn: "Pay", labelDe: "Gehalt", testIds: ["pay-range", "salary-gini", "salary-cv", "education-pay-ladder", "weighted-median-pay", "wage-bill", "education-extreme-share"] },
  { id: "ai", labelEn: "AI scoring", labelDe: "KI-Scoring", testIds: ["exposure-range", "outlook-range", "exposure-span", "exposure-pay-correlation", "physical-low-exposure", "knowledge-high-exposure", "exposure-rationale-length", "outlook-unbiased"] },
  { id: "sector", labelEn: "Sectors", labelDe: "Sektoren", testIds: ["manufacturing-total", "it-total", "services-share", "health-total", "construction-range", "nace-sections-all", "employment-hhi", "trade-sector-g"] },
] as const;

const STREAM_DELAY_MS = 24;

const testsById = new Map(dataTests.map((t) => [t.id, t]));

export function TestsSummary({ locale }: TestsSummaryProps) {
  const de = locale === "de";
  const [results, setResults] = useState<TestResult[]>(() =>
    dataTests.map((t) => ({ id: t.id, ...t.test() }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [runLog, setRunLog] = useState<TestLogEntry[]>([]);
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!logRef.current) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [runLog]);

  const waitForPaint = (ms = STREAM_DELAY_MS) =>
    new Promise((resolve) => window.setTimeout(resolve, ms));

  const runTests = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setExpanded(true);
    setRunLog([
      {
        id: `start-${Date.now()}`,
        name: de ? "Neustart gestartet" : "Restart started",
        actual: de
          ? `0/${dataTests.length} Prüfungen abgeschlossen`
          : `0/${dataTests.length} checks completed`,
        summary: true,
      },
    ]);

    const t0 = performance.now();
    const nextResults = new Map(results.map((result) => [result.id, result]));
    let passedCount = 0;

    await waitForPaint();

    for (const [index, test] of dataTests.entries()) {
      const result = test.test();
      const nextResult = { id: test.id, ...result };
      nextResults.set(test.id, nextResult);
      passedCount += result.passed ? 1 : 0;

      setResults(dataTests.map((candidate) => nextResults.get(candidate.id) ?? { id: candidate.id, passed: false, actual: "", expected: "" }));
      setRunLog((prev) => [
        ...prev,
        {
          id: `${test.id}-${index}`,
          passed: result.passed,
          name: `[${index + 1}/${dataTests.length}] ${de ? test.nameDe : test.name}`,
          actual: result.actual,
          expected: result.expected,
        },
      ]);

      await waitForPaint();
    }

    const elapsed = performance.now() - t0;
    setRunLog((prev) => [
      ...prev,
      {
        id: `summary-${Date.now()}`,
        name: de
          ? `Durchlauf beendet in ${elapsed.toFixed(0)} ms`
          : `Run finished in ${elapsed.toFixed(0)} ms`,
        actual: de
          ? `${passedCount}/${dataTests.length} Tests bestanden`
          : `${passedCount}/${dataTests.length} tests passed`,
        summary: true,
      },
    ]);
    setIsRunning(false);
  };

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const allPassed = passed === total;
  const resultsById = new Map(results.map((r) => [r.id, r]));

  const groupedTests = TEST_GROUPS.map((group) => {
    const tests = group.testIds.map((id) => testsById.get(id)).filter(Boolean) as (typeof dataTests)[number][];
    const passedCount = tests.filter((t) => resultsById.get(t.id)?.passed).length;
    return { ...group, tests, passedCount };
  });

  return (
    <Card className="p-5 space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold">
            {de ? "Datenverifizierung" : "Data Verification"}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant={allPassed ? "default" : "destructive"} className="text-xs px-2 py-0.5">
              {passed}/{total} {de ? "bestanden" : "passed"}
            </Badge>
            <Button
              type="button"
              onClick={runTests}
              disabled={isRunning}
              size="sm"
              variant="outline"
              className="h-7 text-xs"
            >
              {isRunning ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" aria-hidden />
              ) : (
                <PlayCircle className="mr-1 h-3 w-3" aria-hidden />
              )}
              {isRunning
                ? (de ? "Neustart läuft…" : "Restarting…")
                : (de ? "Neu starten" : "Restart")}
            </Button>
          </div>
        </div>

        {(runLog.length > 0 || isRunning) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/45">
                {de ? "Inline-Ausgabe" : "Inline output"}
              </div>
              <div className="text-[11px] text-foreground/45">
                {isRunning
                  ? (de ? `Prüfe ${dataTests.length} Regeln…` : `Checking ${dataTests.length} rules…`)
                  : (de ? "Letzter Durchlauf abgeschlossen" : "Latest run completed")}
              </div>
            </div>

            <div
              ref={logRef}
              aria-live="polite"
              className="max-h-52 overflow-y-auto rounded-xl border border-border/70 bg-neutral-950 px-3 py-2 font-mono text-[11px] leading-5 text-neutral-100 shadow-inner"
            >
              <div className="space-y-1.5">
                {runLog.map((entry) => (
                  <div key={entry.id} className="space-y-0.5">
                    <div className="flex items-start gap-2">
                      <span
                        className={
                          entry.summary
                            ? "text-sky-300"
                            : entry.passed
                              ? "text-emerald-300"
                              : "text-rose-300"
                        }
                      >
                        {entry.summary ? ">" : entry.passed ? "PASS" : "FAIL"}
                      </span>
                      <span className="text-neutral-100">{entry.name}</span>
                    </div>
                    {entry.actual ? (
                      <div className="pl-11 text-neutral-400">
                        {de ? "Ist:" : "Actual:"} {entry.actual}
                      </div>
                    ) : null}
                    {entry.expected ? (
                      <div className="pl-11 text-neutral-500">
                        {de ? "Soll:" : "Expected:"} {entry.expected}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-foreground/70">
        {de
          ? "Über 30 automatisierte Integritätsprüfungen verifizieren Beschäftigungssummen, Entgeltplausibilität, ISCO-Konsistenz und KI-Einflussverteilung."
          : "30+ automated integrity checks verify employment totals, earnings plausibility, ISCO consistency, and AI impact distribution."}
      </p>

      {/* Compact group summary */}
      <div className="flex flex-wrap gap-2">
        {groupedTests.map((g) => (
          <span
            key={g.id}
            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
              g.passedCount === g.tests.length
                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                : "bg-red-500/10 text-red-700 dark:text-red-400"
            }`}
          >
            {g.passedCount === g.tests.length ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {de ? g.labelDe : g.labelEn} {g.passedCount}/{g.tests.length}
          </span>
        ))}
      </div>

      {/* Expandable detail */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-foreground/50 hover:text-foreground/70 transition-colors flex items-center gap-1"
      >
        <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        {expanded ? (de ? "Details ausblenden" : "Hide details") : (de ? "Details anzeigen" : "Show details")}
      </button>

      {expanded && (
        <div className="space-y-3 pt-2 border-t border-border/50">
          {groupedTests.map((group) => (
            <div key={group.id} className="space-y-1">
              <div className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
                {de ? group.labelDe : group.labelEn}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {group.tests.map((t) => {
                  const r = resultsById.get(t.id);
                  return (
                    <div key={t.id} className="flex items-center gap-1.5 text-xs text-foreground/70">
                      {r?.passed ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400 shrink-0" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600 dark:text-red-400 shrink-0" />
                      )}
                      <span className="truncate">{de ? t.nameDe : t.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
