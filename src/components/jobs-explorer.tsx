"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { austrianOccupations } from "@/lib/data";
import type { Occupation } from "@/lib/data";
import { computeMarketStats, formatJobsShort } from "@/lib/jobs-aggregate";
import {
  explorerQueryString,
  readExplorerFromSearchParams,
  type ExplorerSort,
} from "@/lib/explorer-params";
import type { Locale } from "@/lib/locale";
import { ExposureDualSlider } from "@/components/exposure-dual-slider";
import { JobsDataTable } from "@/components/jobs-data-table";
import { Card } from "@/components/ui/card";

const NATIONAL_TOTAL = austrianOccupations.reduce((s, o) => s + (o.jobs ?? 0), 0);

const SORT_PRESETS: { id: ExplorerSort; labelDe: string; labelEn: string }[] = [
  { id: "exposure-desc", labelDe: "KI-Einfluss ↓", labelEn: "AI impact ↓" },
  { id: "exposure-asc", labelDe: "KI-Einfluss ↑", labelEn: "AI impact ↑" },
  { id: "jobs-desc", labelDe: "Beschäftigte ↓", labelEn: "Employees ↓" },
  { id: "pay-desc", labelDe: "Entgelt ↓", labelEn: "Pay ↓" },
  { id: "title-asc", labelDe: "A–Z", labelEn: "A–Z" },
];

function filterRows(rows: Occupation[], q: string, exMin: number, exMax: number): Occupation[] {
  const needle = q.trim().toLowerCase();
  return rows.filter((o) => {
    if (o.exposure == null || o.exposure < exMin || o.exposure > exMax) return false;
    if (!needle) return true;
    const blob = `${o.title} ${o.titleDe} ${o.category} ${o.categoryDe} ${o.education} ${o.educationDe} ${o.iscoLabel} ${o.iscoLabelDe} ${o.isco08} ${o.onaceSection}`.toLowerCase();
    return blob.includes(needle);
  });
}

export function JobsExplorer({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const de = locale === "de";

  const { q: urlQ, sort, exMin, exMax } = useMemo(
    () => readExplorerFromSearchParams(searchParams),
    [searchParams]
  );

  const [localQ, setLocalQ] = useState(urlQ);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalQ(urlQ);
  }, [urlQ]);

  const pushParams = useCallback(
    (next: { q?: string; sort?: ExplorerSort; exMin?: number; exMax?: number }) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("view", "explorer");
      const qv = next.q ?? localQ;
      const sv = next.sort ?? sort;
      const lo = next.exMin ?? exMin;
      const hi = next.exMax ?? exMax;
      if (qv) sp.set("q", qv);
      else sp.delete("q");
      if (sv !== "exposure-desc") sp.set("sort", sv);
      else sp.delete("sort");
      if (lo !== 0) sp.set("min", String(lo));
      else sp.delete("min");
      if (hi !== 10) sp.set("max", String(hi));
      else sp.delete("max");
      const qs = sp.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams, localQ, sort, exMin, exMax]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalQ(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        pushParams({ q: value });
      }, 300);
    },
    [pushParams]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const filtered = useMemo(
    () => filterRows(austrianOccupations, localQ, exMin, exMax),
    [localQ, exMin, exMax]
  );

  const globalStats = useMemo(() => computeMarketStats(austrianOccupations), []);
  const filteredStats = useMemo(() => computeMarketStats(filtered), [filtered]);

  const listState = useMemo(
    () => ({ q: localQ, sort, exMin, exMax }),
    [localQ, sort, exMin, exMax]
  );
  const listQuery = explorerQueryString(listState);

  return (
    <div className="space-y-6">
      {/* Global stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label={de ? "Berufsgruppen" : "Occupation groups"}
          value={String(globalStats.occupationCount)}
          sub={de ? "ISCO-08 2-Steller" : "ISCO-08 2-digit groups"}
        />
        <StatCard
          label={de ? "Beschäftigte" : "Employees"}
          value={formatJobsShort(globalStats.totalJobs, de ? "de" : "en")}
          sub={de ? "Eurostat lfsa_egai2d, 2024" : "Eurostat lfsa_egai2d, 2024"}
        />
        <StatCard
          label={de ? "Ø KI-Einfluss" : "Avg. AI impact"}
          value={globalStats.avgExposure.toFixed(1) + "/10"}
          sub={de ? "beschäftigungsgewichtet" : "job-weighted"}
        />
        <StatCard
          label={de ? "Hohe Exposition (≥7)" : "High exposure (≥7)"}
          value={globalStats.highExposurePct.toFixed(1) + "%"}
          sub={de ? "Anteil der Beschäftigung" : "share of employment"}
        />
        <StatCard
          label={de ? "Betroffene Beschäftigung" : "High-impact employment"}
          value={formatJobsShort(globalStats.highExposureJobs, de ? "de" : "en")}
          sub={de ? "Berufsgruppen mit KI-Einfluss ≥7" : "occupation groups with AI impact ≥7"}
        />
      </div>

      <Card className="p-4 sm:p-5 border-border/70 bg-gradient-to-br from-card via-card to-muted/20 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
          <ExposureDualSlider
            min={exMin}
            max={exMax}
            onChange={(lo, hi) => pushParams({ exMin: lo, exMax: hi })}
            label={de ? "KI-Einfluss filtern" : "Filter AI impact"}
            locale={de ? "de" : "en"}
          />
          <div className="flex flex-wrap gap-4 text-sm border-l-0 lg:border-l border-border/60 lg:pl-6">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {de ? "Gefiltert" : "Filtered"}
              </div>
              <div className="tabular-nums font-semibold">{filteredStats.occupationCount} {de ? "Berufe" : "rows"}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {de ? "Beschäftigte" : "Employees"}
              </div>
              <div className="tabular-nums font-semibold">{formatJobsShort(filteredStats.totalJobs, de ? "de" : "en")}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {de ? "Anteil" : "Share"}
              </div>
              <div className="tabular-nums font-semibold">
                {NATIONAL_TOTAL > 0 ? ((filteredStats.totalJobs / NATIONAL_TOTAL) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={localQ}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={
              de
                ? "Suche nach Berufsgruppe, ISCO-Hauptgruppe oder ÖNACE-Abschnitt — z. B. Softwareentwicklung, Krankenpflege, Bürokräfte"
                : "Search by occupation group, ISCO major group, or ÖNACE section — e.g. software development, nursing, clerical"
            }
            className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {SORT_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => pushParams({ sort: p.id })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                sort === p.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {de ? p.labelDe : p.labelEn}
            </button>
          ))}
        </div>

        <JobsDataTable
          data={filtered}
          locale={locale}
          sort={sort}
          onSortChange={(s) => pushParams({ sort: s })}
          listQuery={listQuery}
          nationalJobsTotal={NATIONAL_TOTAL}
        />
      </Card>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/80 px-4 py-3 shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums mt-1">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}
