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

const OUTLOOK_TIERS = [
  { label: "Declining (<0%)", labelDe: "Rückläufig (<0%)", min: -Infinity, max: -1 },
  { label: "Slow (0–3%)", labelDe: "Langsam (0–3%)", min: 0, max: 3 },
  { label: "Average (4–7%)", labelDe: "Durchschnitt (4–7%)", min: 4, max: 7 },
  { label: "Fast (8–14%)", labelDe: "Schnell (8–14%)", min: 8, max: 14 },
  { label: "Much faster (15%+)", labelDe: "Viel schneller (15%+)", min: 15, max: Infinity },
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

function HBarChart({
  items,
}: {
  items: { label: string; val: string; pct: number; color: string }[];
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1.5 text-xs">
          <span className="w-[72px] shrink-0 text-right text-[11px] text-muted-foreground">
            {it.label}
          </span>
          <div className="flex-1 h-3 bg-muted/50 rounded-sm overflow-hidden min-w-[36px]">
            <div
              className="h-full rounded-sm"
              style={{
                width: `${Math.max(0, Math.min(100, it.pct))}%`,
                background: it.color,
              }}
            />
          </div>
          <span className="w-[42px] shrink-0 text-right text-[11px] tabular-nums">
            {it.val}
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
  const { avg } = weightedAvg(data, () => true, (d) => d.outlook);

  const tiers = OUTLOOK_TIERS.map((t) => {
    let jobs = 0;
    for (const d of data) {
      if (d.outlook != null && d.jobs && d.outlook >= t.min && d.outlook <= t.max)
        jobs += d.jobs;
    }
    const mid = t.min === -Infinity ? -8 : t.max === Infinity ? 20 : (t.min + t.max) / 2;
    return { label: de ? t.labelDe : t.label, jobs, color: outlookColor(mid, 1) };
  });

  let declining = 0,
    growing = 0;
  for (const d of data) {
    if (d.outlook != null && d.jobs) {
      if (d.outlook < 0) declining += d.jobs;
      if (d.outlook > 0) growing += d.jobs;
    }
  }

  const byPay = PAY_BANDS_AT.map((g) => {
    const r = weightedAvg(
      data,
      (d) => d.pay != null && d.pay >= g.min && d.pay < g.max,
      (d) => d.outlook
    );
    return {
      label: g.label,
      val: (r.avg > 0 ? "+" : "") + r.avg.toFixed(1) + "%",
      pct: Math.max(0, Math.min(100, (r.avg + 10) / 30 * 100)),
      color: outlookColor(r.avg, 0.8),
    };
  });

  return (
    <>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Ø Ausblick" : "Avg. Outlook"}
        </h3>
        <div className="text-3xl font-bold tracking-tight tabular-nums">
          <span style={{ color: outlookColor(avg, 1, true) }}>
            {avg > 0 ? "+" : ""}
            {avg.toFixed(1)}%
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground">
          {de ? "beschäftigungsgewichtet" : "job-weighted"}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Ausblick-Stufen" : "Outlook Tiers"}
        </h3>
        <TierBar tiers={tiers} totalJobs={totalJobs} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Ausblick nach Entgeltstufe" : "Outlook by earnings"}
        </h3>
        <HBarChart items={byPay} />
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

  const byPay = PAY_BANDS_AT.map((g) => {
    const r = weightedAvg(
      data,
      (d) => d.pay != null && d.pay >= g.min && d.pay < g.max,
      (d) => d.exposure
    );
    return {
      label: g.label,
      val: r.avg.toFixed(1),
      pct: (r.avg / 10) * 100,
      color: exposureColor(r.avg, 0.8),
    };
  });

  return (
    <>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Ø Exposition" : "Avg. Exposure"}
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
          {de ? "Expositions-Stufen" : "Exposure Tiers"}
        </h3>
        <TierBar tiers={tiers} totalJobs={totalJobs} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Exposition nach Entgeltstufe" : "Exposure by earnings"}
        </h3>
        <HBarChart items={byPay} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {de ? "Exponierte Entgeltsumme" : "Exposed earnings"}
        </h3>
        <div className="text-3xl font-bold tracking-tight tabular-nums" style={{ color: exposureColor(8, 1, true) }}>
          €{(wagesExposed / 1e9).toFixed(0)}B
        </div>
        <div className="text-[11px] text-muted-foreground">
          {de ? "jährlich, Berufsgruppen mit Expositionsgrad ≥7" : "annual, occupation groups with exposure ≥7"}
        </div>
      </div>
    </>
  );
}
