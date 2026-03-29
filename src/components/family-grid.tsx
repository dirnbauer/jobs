"use client";

import Link from "next/link";
import { austrianOccupations } from "@/lib/data";
import { buildOccupationFamilySummaries } from "@/lib/market-groups";
import type { Locale } from "@/lib/locale";

const FAMILY_SUMMARIES = buildOccupationFamilySummaries(austrianOccupations);

export function FamilyGrid({ locale }: { locale: Locale }) {
  const de = locale === "de";

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {FAMILY_SUMMARIES.map(({ family, stats, avgPay, rows }) => (
        <Link
          key={family.slug}
          href={`/${locale}/family/${family.slug}`}
          className="group rounded-xl border border-border/70 bg-card/60 hover:bg-muted/30 hover:border-primary/40 p-4 transition-colors shadow-sm"
        >
          <div className="text-[10px] font-mono text-muted-foreground mb-1">ISCO {family.major}</div>
          <h3 className="font-semibold text-foreground group-hover:underline underline-offset-2 line-clamp-2 min-h-11">
            {de ? family.labelDe : family.labelEn}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 min-h-8">
            {de ? family.blurbDe : family.blurbEn}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              {rows.length} {de ? "Gruppen" : "groups"}
            </span>
            <span className="tabular-nums">
              {stats.totalJobs.toLocaleString(de ? "de-AT" : "en-US")} {de ? "Beschäftigte" : "employed"}
            </span>
            <span>Ø {stats.avgExposure.toFixed(1)} {de ? "KI-Einfluss" : "AI impact"}</span>
            <span className="tabular-nums">€{Math.round(avgPay / 1000)}K</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
