"use client";

import { useEffect, useRef, useState } from "react";
import { dataTests } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, PlayCircle, Loader2, ChevronDown, FlaskConical, Search, Layers, BarChart3, Factory, Coins, Cpu, TrendingUp, GitCompare, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
  { id: "completeness", labelEn: "Data Completeness", labelDe: "Datenvollständigkeit", icon: Search, source: false, descEn: "All fields populated, bilingual, sources traceable", descDe: "Alle Felder befüllt, zweisprachig, Quellen nachvollziehbar" },
  { id: "isco", labelEn: "ISCO-08 Structure", labelDe: "ISCO-08-Struktur", icon: Layers, source: false, descEn: "Code format, family consistency, coverage of all 9 major groups", descDe: "Codeformat, Familienkonsistenz, Abdeckung aller 9 Hauptgruppen" },
  { id: "employment", labelEn: "Employment Distribution", labelDe: "Beschäftigungsverteilung", icon: BarChart3, source: false, descEn: "Total employment, concentration (HHI), skewness, partition identity", descDe: "Gesamtbeschäftigung, Konzentration (HHI), Schiefe, Partitionsidentität" },
  { id: "sectors", labelEn: "Sector Totals", labelDe: "Sektorsummen", icon: Factory, source: false, descEn: "NACE section employment ranges vs Eurostat ballparks", descDe: "NACE-Abschnittsbeschäftigung im Vergleich zu Eurostat-Größenordnungen" },
  { id: "pay", labelEn: "Earnings & Pay", labelDe: "Gehalt & Entlohnung", icon: Coins, source: false, descEn: "Pay range, Gini, P90/P10, education ladder, ISCO pay hierarchy", descDe: "Gehaltsspanne, Gini, P90/P10, Bildungsleiter, ISCO-Gehaltshierarchie" },
  { id: "exposure", labelEn: "AI Exposure", labelDe: "KI-Exposition", icon: Cpu, source: false, descEn: "Score range, correlations with pay/education, sector patterns", descDe: "Score-Bereich, Korrelationen mit Gehalt/Bildung, Sektormuster" },
  { id: "outlook", labelEn: "Outlook & Growth", labelDe: "Ausblick & Wachstum", icon: TrendingUp, source: false, descEn: "WIFO/AMS forecast bias, variance, sector-level patterns", descDe: "WIFO/AMS-Prognose-Bias, Varianz, Sektormuster" },
  { id: "cross", labelEn: "Cross-Validation", labelDe: "Kreuzvalidierung", icon: GitCompare, source: false, descEn: "Multi-dimensional checks: exposure-outlook independence, bilingual parity", descDe: "Mehrdimensionale Prüfungen: Expositions-Ausblick-Unabhängigkeit, zweisprachige Parität" },
  { id: "source", labelEn: "Source Data (Eurostat/VSE)", labelDe: "Quelldaten (Eurostat/VSE)", icon: Landmark, source: true, descEn: "Row-by-row comparison against original Eurostat + Statistik Austria data", descDe: "Zeile-für-Zeile-Vergleich mit Eurostat- und Statistik-Austria-Originaldaten" },
];

function renderGroupIcon(Icon: LucideIcon) {
  return <Icon className="h-3.5 w-3.5" aria-hidden />;
}

const STREAM_DELAY_MS = 12;

const testsById = new Map(dataTests.map((t) => [t.id, t]));

export function TestsSummary({ locale }: TestsSummaryProps) {
  const de = locale === "de";
  const [results, setResults] = useState<TestResult[]>(() =>
    dataTests.map((t) => ({ id: t.id, ...t.test() }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
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

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const groupedTests = TEST_GROUPS.map((group) => {
    const tests = dataTests.filter((t) => t.group === group.id);
    const passedCount = tests.filter((t) => resultsById.get(t.id)?.passed).length;
    return { ...group, tests, passedCount };
  });

  const selectedTestObj = selectedTest ? testsById.get(selectedTest) : null;
  const selectedResult = selectedTest ? resultsById.get(selectedTest) : null;

  return (
    <Card className="p-5 space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold flex items-center gap-2">
            <FlaskConical className="h-4 w-4" aria-hidden />
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
                  ? (de ? `Prüfe ${dataTests.length} Hypothesen…` : `Testing ${dataTests.length} hypotheses…`)
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
          ? `${total} wissenschaftlich fundierte Hypothesentests verifizieren Beschäftigungssummen, Entgeltplausibilität, ISCO-Konsistenz, KI-Exposition und Arbeitsmarktstruktur.`
          : `${total} hypothesis-driven tests verify employment totals, earnings plausibility, ISCO consistency, AI exposure scoring, and labor-market structure.`}
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
        {expanded ? (de ? "Details ausblenden" : "Hide details") : (de ? "Alle Tests anzeigen" : "Show all tests")}
      </button>

      {expanded && (
        <div className="space-y-2 pt-2 border-t border-border/50">
          {groupedTests.map((group) => (
            <div key={group.id} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between text-xs font-medium text-foreground/60 uppercase tracking-wide hover:text-foreground/80 transition-colors py-1"
              >
                <span className="flex items-center gap-1.5">
                  {renderGroupIcon(group.icon)}
                  {de ? group.labelDe : group.labelEn}
                  <span className="text-[10px] font-normal normal-case tracking-normal text-foreground/40">
                    ({group.passedCount}/{group.tests.length})
                  </span>
                  {group.source && (
                    <span className="text-[9px] font-bold normal-case tracking-normal px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400">
                      {de ? "ORIGINALDATEN" : "SOURCE DATA"}
                    </span>
                  )}
                </span>
                <ChevronDown className={`h-3 w-3 transition-transform ${expandedGroups.has(group.id) ? "rotate-180" : ""}`} />
              </button>

              {expandedGroups.has(group.id) && (
                <>
                <p className="text-[11px] text-foreground/45 pl-6 -mt-0.5 mb-1">
                  {de ? group.descDe : group.descEn}
                </p>
                <div className="space-y-0.5 pl-1">
                  {group.tests.map((t) => {
                    const r = resultsById.get(t.id);
                    const isSelected = selectedTest === t.id;
                    return (
                      <div key={t.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedTest(isSelected ? null : t.id)}
                          className={`w-full flex items-start gap-1.5 text-xs text-left py-0.5 rounded px-1 transition-colors ${
                            isSelected ? "bg-foreground/5" : "hover:bg-foreground/[0.02]"
                          }`}
                        >
                          {r?.passed ? (
                            <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                          )}
                          <span className="text-foreground/70">{de ? t.nameDe : t.name}</span>
                        </button>

                        {/* Scientific detail panel */}
                        {isSelected && selectedTestObj && (
                          <div className="ml-5 mt-1 mb-2 space-y-2 rounded-lg border border-border/40 bg-muted/30 p-3 text-xs">
                            {/* Thesis */}
                            <div>
                              <div className="font-semibold text-foreground/50 uppercase tracking-wider text-[10px] mb-0.5">
                                {de ? "These (Hypothese)" : "Thesis (Hypothesis)"}
                              </div>
                              <div className="text-foreground/80 leading-relaxed">
                                {de ? selectedTestObj.thesisDe : selectedTestObj.thesis}
                              </div>
                            </div>

                            {/* Antithesis */}
                            <div>
                              <div className="font-semibold text-foreground/50 uppercase tracking-wider text-[10px] mb-0.5">
                                {de ? "Antithese (Was Scheitern bedeutet)" : "Antithesis (What failure means)"}
                              </div>
                              <div className="text-foreground/60 leading-relaxed">
                                {de ? selectedTestObj.antithesisDe : selectedTestObj.antithesis}
                              </div>
                            </div>

                            {/* Evidence / Verdict */}
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="font-semibold text-foreground/50 uppercase tracking-wider text-[10px] mb-0.5">
                                  {de ? "Evidenz" : "Evidence"}
                                </div>
                                <div className="font-mono text-foreground/70">
                                  {selectedResult?.actual ?? "—"}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-foreground/50 uppercase tracking-wider text-[10px] mb-0.5">
                                  {de ? "Erwartet" : "Expected"}
                                </div>
                                <div className="font-mono text-foreground/70">
                                  {selectedResult?.expected ?? "—"}
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold text-foreground/50 uppercase tracking-wider text-[10px] mb-0.5">
                                  {de ? "Urteil" : "Verdict"}
                                </div>
                                <div className={`font-bold ${selectedResult?.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                  {selectedResult?.passed
                                    ? (de ? "Bestätigt" : "Confirmed")
                                    : (de ? "Widerlegt" : "Refuted")}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
