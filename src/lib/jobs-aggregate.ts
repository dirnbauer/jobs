import type { Occupation } from "@/lib/data";

const HIGH_EXPOSURE = 7;

export interface MarketStats {
  occupationCount: number;
  totalJobs: number;
  avgExposure: number;
  highExposurePct: number;
  highExposureJobs: number;
}

export function computeMarketStats(rows: Occupation[]): MarketStats {
  let totalJobs = 0;
  let exWeighted = 0;
  let exJobs = 0;
  let highExposureJobs = 0;
  for (const o of rows) {
    const j = o.jobs ?? 0;
    totalJobs += j;
    if (o.exposure != null && j > 0) {
      exWeighted += o.exposure * j;
      exJobs += j;
      if (o.exposure >= HIGH_EXPOSURE) highExposureJobs += j;
    }
  }
  const avgExposure = exJobs > 0 ? exWeighted / exJobs : 0;
  const highPct = totalJobs > 0 ? (highExposureJobs / totalJobs) * 100 : 0;

  return {
    occupationCount: rows.length,
    totalJobs,
    avgExposure,
    highExposurePct: highPct,
    highExposureJobs,
  };
}

export function formatJobsShort(n: number, locale: "de" | "en" = "de"): string {
  if (n >= 1_000_000) {
    const v = (n / 1_000_000).toFixed(1);
    return locale === "de" ? v.replace(".", ",") + " Mio." : v + "M";
  }
  return n.toLocaleString(locale === "de" ? "de-AT" : "en-US");
}
