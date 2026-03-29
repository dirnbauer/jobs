"use client";

import type { Occupation } from "@/lib/data";
import type { ColorMode } from "@/lib/colors";
import {
  outlookColor,
  payColor,
  eduColor,
  exposureColor,
} from "@/lib/colors";
import type { Locale } from "@/lib/locale";

interface StatsPanelProps {
  data: Occupation[];
  colorMode: ColorMode;
  locale: Locale;
}

function formatNumber(n: number | null): string {
  if (n == null) return "—";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return Math.round(n / 1e3).toLocaleString() + "K";
  return n.toLocaleString();
}

const PAY_BANDS_AT = [
  { label: "<€25K", min: 0, max: 25000 },
  { label: "€25–35K", min: 25000, max: 35000 },
  { label: "€35–50K", min: 35000, max: 50000 },
  { label: "€50–70K", min: 50000, max: 70000 },
  { label: "€70K+", min: 70000, max: Infinity },
];

const EDU_GROUPS = [
  {
    label: "Compulsory/Lehre",
    labelDe: "Pflichtschule/Lehre",
    match: ["Compulsory school", "Apprenticeship (Lehre)"],
  },
  {
    label: "BMS/Matura",
    labelDe: "BMS/Matura",
    match: ["Vocational school (BMS)", "Upper secondary (Matura)"],
  },
  {
    label: "Kolleg/Bachelor",
    labelDe: "Kolleg/Bachelor",
    match: ["Post-secondary (Kolleg)", "Bachelor's degree"],
  },
  {
    label: "Master's",
    labelDe: "Master/Diplom",
    match: ["Master's/Diploma degree"],
  },
  {
    label: "Doctoral/PhD",
    labelDe: "Doktorat/PhD",
    match: ["Doctoral/PhD"],
  },
];

const OUTLOOK_TIERS_PA = [
  { label: "Declining (<0%)", labelDe: "Rückläufig (<0%)", min: -Infinity, max: -0.05 },
  { label: "Stable (0–0.5%)", labelDe: "Stabil (0–0,5%)", min: -0.05, max: 0.5 },
  { label: "Slow growth (0.5–1%)", labelDe: "Leichtes Wachstum (0,5–1%)", min: 0.5, max: 1.0 },
  { label: "Growing (1–2%)", labelDe: "Wachsend (1–2%)", min: 1.0, max: 2.0 },
  { label: "Strong growth (2%+)", labelDe: "Starkes Wachstum (2%+)", min: 2.0, max: Infinity },
];

function TierBar({
  tiers,
  totalJobs,
}: {
  tiers: { label: string; jobs: number; color: string }[];
  totalJobs: number;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {tiers.map((t) => (
        <div key={t.label} className="flex items-center gap-1.5 text-xs">
          <div
            className="h-2.5 w-2.5 shrink-0 rounded-sm"
            style={{ background: t.color }}
          />
          <span className="flex-1 text-muted-foreground whitespace-nowrap">
            {t.label}
          </span>
          <span className="tabular-nums whitespace-nowrap">
            {formatNumber(t.jobs)}
          </span>
          <span className="w-7 text-right text-[11px] text-muted-foreground tabular-nums">
            {totalJobs > 0
              ? ((t.jobs / totalJobs) * 100).toFixed(0)
              : 0}
            %
          </span>
        </div>
      ))}
    </div>
  );
}

function weightedAvg(
  data: Occupation[],
  filter: (d: Occupation) => boolean,
  metric: (d: Occupation) => number | null
): { avg: number; jobs: number } {
  let wS = 0,
    wC = 0;
  for (const d of data) {
    const v = metric(d);
    if (v != null && d.jobs && filter(d)) {
      wS += v * d.jobs;
      wC += d.jobs;
    }
  }
  return { avg: wC > 0 ? wS / wC : 0, jobs: wC };
}

export function StatsPanel({ data, colorMode, locale }: StatsPanelProps) {
  const totalJobs = data.reduce((s, d) => s + (d.jobs || 0), 0);
  const de = locale === "de";

  return (
    <div className="flex flex-wrap gap-5 items-start">
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Beschäftigte gesamt" : "Total employed"}
        </h3>
        <div className="text-3xl font-bold tracking-tight tabular-nums">
          {totalJobs >= 1e6 ? (totalJobs / 1e6).toFixed(1) + "M" : totalJobs.toLocaleString()}
        </div>
      </div>

      {colorMode === "outlook" && (
        <OutlookStats data={data} totalJobs={totalJobs} locale={locale} />
      )}
      {colorMode === "pay" && (
        <PayStats data={data} totalJobs={totalJobs} locale={locale} />
      )}
      {colorMode === "education" && (
        <EducationStats data={data} totalJobs={totalJobs} locale={locale} />
      )}
      {colorMode === "exposure" && (
        <ExposureStats data={data} totalJobs={totalJobs} locale={locale} />
      )}
    </div>
  );
}

function OutlookStats({
  data,
  totalJobs,
  locale,
}: {
  data: Occupation[];
  totalJobs: number;
  locale: Locale;
}) {
  const de = locale === "de";
  const { avg: avgGrowth } = weightedAvg(data, () => true, (d) => d.outlookGrowthPa as number | null);
  const { avg: avgOutlook } = weightedAvg(data, () => true, (d) => d.outlook);

  const tiers = OUTLOOK_TIERS_PA.map((t) => {
    let jobs = 0;
    for (const d of data) {
      if (d.outlookGrowthPa != null && d.jobs && d.outlookGrowthPa >= t.min && d.outlookGrowthPa < t.max)
        jobs += d.jobs;
    }
    const midOutlook = t.min <= -2 ? -8 : t.max > 3 ? 8 : Math.round(((t.min + Math.min(t.max, 3)) / 2 / 3.7) * 10);
    return { label: de ? t.labelDe : t.label, jobs, color: outlookColor(midOutlook, 1) };
  });

  let declining = 0,
    growing = 0;
  for (const d of data) {
    if (d.outlookGrowthPa != null && d.jobs) {
      if (d.outlookGrowthPa < 0) declining += d.jobs;
      if (d.outlookGrowthPa > 0) growing += d.jobs;
    }
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Ø Wachstum p.a." : "Avg. growth p.a."}
        </h3>
        <div className="text-3xl font-bold tracking-tight tabular-nums">
          <span style={{ color: outlookColor(avgOutlook, 1, true) }}>
            {avgGrowth > 0 ? "+" : ""}
            {avgGrowth.toFixed(1)}%
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground">
          {de ? "WIFO/AMS 2023–2030" : "WIFO/AMS 2023–2030"}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Ausblick-Stufen" : "Outlook tiers"}
        </h3>
        <TierBar tiers={tiers} totalJobs={totalJobs} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Rückläufige Beschäftigung" : "Declining employment"}
        </h3>
        <div className="text-3xl font-bold tracking-tight tabular-nums" style={{ color: outlookColor(-5, 1, true) }}>
          {formatNumber(declining)}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Wachsende Beschäftigung" : "Growing employment"}
        </h3>
        <div className="text-3xl font-bold tracking-tight tabular-nums" style={{ color: outlookColor(10, 1, true) }}>
          {formatNumber(growing)}
        </div>
      </div>
    </>
  );
}

function PayStats({
  data,
  totalJobs,
  locale,
}: {
  data: Occupation[];
  totalJobs: number;
  locale: Locale;
}) {
  const de = locale === "de";
  const { avg } = weightedAvg(data, () => true, (d) => d.pay);

  const tiers = PAY_BANDS_AT.map((t) => {
    let jobs = 0;
    for (const d of data) {
      if (d.pay != null && d.jobs && d.pay >= t.min && d.pay < t.max) jobs += d.jobs;
    }
    const mid = t.max === Infinity ? 85000 : (t.min + t.max) / 2;
    return { label: t.label, jobs, color: payColor(mid, 1) };
  });

  let totalWages = 0;
  for (const d of data) {
    if (d.pay != null && d.jobs) totalWages += d.pay * d.jobs;
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Medianentgelt (Ø)" : "Avg. median earnings"}
        </h3>
        <div className="text-3xl font-bold tracking-tight tabular-nums">
          <span style={{ color: payColor(avg, 1, true) }}>
            €{Math.round(avg / 1000)}K
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground">
          {de ? "beschäftigungsgewichtet" : "job-weighted"}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Entgeltstufen" : "Earnings tiers"}
        </h3>
        <TierBar tiers={tiers} totalJobs={totalJobs} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Entgeltsumme" : "Total earnings"}
        </h3>
        <div className="text-3xl font-bold tracking-tight tabular-nums">
          €{(totalWages / 1e9).toFixed(0)}B
        </div>
        <div className="text-[11px] text-muted-foreground">
          {de ? "jährlich" : "annual"}
        </div>
      </div>
    </>
  );
}

function EducationStats({
  data,
  totalJobs,
  locale,
}: {
  data: Occupation[];
  totalJobs: number;
  locale: Locale;
}) {
  const de = locale === "de";
  let bsJobs = 0;
  for (const d of data) {
    if (
      d.jobs &&
      ["Bachelor's degree", "Master's/Diploma degree", "Doctoral/PhD"].includes(d.education)
    )
      bsJobs += d.jobs;
  }

  const groups = EDU_GROUPS.map((g, i) => {
    let jobs = 0;
    for (const d of data) {
      if (d.jobs && g.match.includes(d.education)) jobs += d.jobs;
    }
    return {
      label: de ? g.labelDe : g.label,
      jobs,
      color: eduColor(i * 2, 1),
    };
  });

  let lehreJobs = 0;
  for (const d of data) {
    if (
      d.jobs &&
      ["Compulsory school", "Apprenticeship (Lehre)"].includes(d.education)
    )
      lehreJobs += d.jobs;
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Bachelor+
        </h3>
        <div className="text-3xl font-bold tracking-tight tabular-nums">
          <span style={{ color: eduColor(5, 1, true) }}>
            {totalJobs > 0 ? ((bsJobs / totalJobs) * 100).toFixed(0) : 0}%
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground">
          {de ? "aller Beschäftigten" : "of all employed"}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Ausbildungsstufen" : "Education Tiers"}
        </h3>
        <TierBar tiers={groups} totalJobs={totalJobs} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Pflichtschule/Lehre" : "Compulsory/Lehre"}
        </h3>
        <div className="text-3xl font-bold tracking-tight tabular-nums">
          {formatNumber(lehreJobs)}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {de ? "Beschäftigte ohne tertiäre Ausbildung" : "employed, no tertiary education required"}
        </div>
      </div>
    </>
  );
}

function ExposureStats({
  data,
  totalJobs,
  locale,
}: {
  data: Occupation[];
  totalJobs: number;
  locale: Locale;
}) {
  const de = locale === "de";
  const { avg } = weightedAvg(data, () => true, (d) => d.exposure);

  const tierDefs = [
    { label: de ? "Minimal (0–1)" : "Minimal (0–1)", lo: 0, hi: 1, mid: 0.5 },
    { label: de ? "Niedrig (2–3)" : "Low (2–3)", lo: 2, hi: 3, mid: 2.5 },
    { label: de ? "Moderat (4–5)" : "Moderate (4–5)", lo: 4, hi: 5, mid: 4.5 },
    { label: de ? "Hoch (6–7)" : "High (6–7)", lo: 6, hi: 7, mid: 6.5 },
    { label: de ? "Sehr hoch (8–10)" : "Very high (8–10)", lo: 8, hi: 10, mid: 9 },
  ];

  const tiers = tierDefs.map((t) => {
    let jobs = 0;
    for (const d of data) {
      if (d.exposure != null && d.jobs && d.exposure >= t.lo && d.exposure <= t.hi)
        jobs += d.jobs;
    }
    return { label: t.label, jobs, color: exposureColor(t.mid, 1) };
  });

  let wagesExposed = 0;
  for (const d of data) {
    if (d.exposure != null && d.exposure >= 7 && d.jobs && d.pay)
      wagesExposed += d.jobs * d.pay;
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Ø KI-Einfluss" : "Avg. AI Impact"}
        </h3>
        <div className="text-3xl font-bold tracking-tight tabular-nums">
          <span style={{ color: exposureColor(avg, 1, true) }}>
            {avg.toFixed(1)}
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground">
          {de ? "beschäftigungsgewichtet, 0–10" : "job-weighted, 0–10"}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Einfluss-Stufen" : "Impact Tiers"}
        </h3>
        <TierBar tiers={tiers} totalJobs={totalJobs} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Betroffene Entgeltsumme" : "High-impact earnings"}
        </h3>
        <div className="text-3xl font-bold tracking-tight tabular-nums" style={{ color: exposureColor(8, 1, true) }}>
          €{(wagesExposed / 1e9).toFixed(0)}B
        </div>
        <div className="text-[11px] text-muted-foreground">
          {de ? "jährlich, Berufsgruppen mit KI-Einfluss ≥7" : "annual, occupation groups with AI impact ≥7"}
        </div>
      </div>
    </>
  );
}
