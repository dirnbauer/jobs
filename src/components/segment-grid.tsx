"use client";

import Link from "next/link";
import { austrianOccupations } from "@/lib/data";
import { ONACE_BRANCHES } from "@/lib/onace-branches";
import { computeMarketStats } from "@/lib/jobs-aggregate";
import type { Locale } from "@/lib/locale";

export function SegmentGrid({ locale }: { locale: Locale }) {
  const de = locale === "de";

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ONACE_BRANCHES.map((b) => {
        const rows = austrianOccupations.filter((o) => o.onaceSection === b.section);
        const stats = computeMarketStats(rows);
        const label = de ? b.labelDe : b.labelEn;
        return (
          <Link
            key={b.slug}
            href={`/${locale}/branche/${b.slug}`}
            className="group rounded-xl border border-border/70 bg-card/60 hover:bg-muted/30 hover:border-primary/40 p-4 transition-colors shadow-sm"
          >
            <div className="text-[10px] font-mono text-muted-foreground mb-1">§ {b.section}</div>
            <h3 className="font-semibold text-foreground group-hover:underline underline-offset-2 line-clamp-2 min-h-[2.75rem]">
              {label}
            </h3>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>
                {rows.length} {de ? "Gruppen" : "groups"}
              </span>
              <span className="tabular-nums">
                {stats.totalJobs.toLocaleString(de ? "de-AT" : "en-US")} {de ? "Beschäftigte" : "employed"}
              </span>
              <span>
                Ø {stats.avgExposure.toFixed(1)} {de ? "KI-Einfluss" : "AI impact"}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
