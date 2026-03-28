"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Occupation } from "@/lib/data";
import { exposureColor } from "@/lib/colors";
import { explorerQueryString, readExplorerFromSearchParams } from "@/lib/explorer-params";
import { getBranchBySection } from "@/lib/onace-branches";
import { getOccupationFamilyByMajor } from "@/lib/market-groups";
import type { Locale } from "@/lib/locale";
import type { VseSupplement } from "@/lib/vse-supplement";
import { Card } from "@/components/ui/card";

function formatEur(n: number, de: boolean) {
  return `€${n.toLocaleString(de ? "de-AT" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BerufDetailClient({
  occ,
  locale,
  vseSupplement,
}: {
  occ: Occupation;
  locale: Locale;
  vseSupplement: VseSupplement | null;
}) {
  const de = locale === "de";
  const searchParams = useSearchParams();
  const listState = readExplorerFromSearchParams(searchParams);
  const backQs = explorerQueryString(listState);
  const backHref = `/${locale}?${backQs}`;
  const branch = getBranchBySection(occ.onaceSection);
  const family = getOccupationFamilyByMajor(occ.iscoMajor);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          href={backHref}
          className="text-sm text-primary hover:underline underline-offset-2 inline-flex items-center gap-1"
        >
          ← {de ? "Zurück zur Übersicht" : "Back to overview"}
        </Link>
      </div>

      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">
          ISCO {occ.isco08} · ÖNACE {occ.onaceSection}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {de ? occ.titleDe : occ.title}
        </h1>
        <p className="text-base text-muted-foreground mt-1">
          {family && (
            <>
              <Link
                href={`/${locale}/family/${family.slug}`}
                className="text-primary hover:underline underline-offset-2"
              >
                {de ? family.labelDe : family.labelEn}
              </Link>
              {" · "}
            </>
          )}
          {de ? occ.categoryDe : occ.category} · ÖNACE {occ.onaceSection}{" "}
          {branch && (
            <Link
              href={`/${locale}/branche/${branch.slug}`}
              className="text-primary hover:underline underline-offset-2"
            >
              {de ? "Branche" : "Sector"}
            </Link>
          )}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Card className="p-4 border-border/70">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            {de ? "KI-Exposition" : "AI exposure"}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div
              className="text-4xl font-bold tabular-nums"
              style={{ color: exposureColor(occ.exposure, 1, true) }}
            >
              {occ.exposure ?? "—"}
              <span className="text-lg text-muted-foreground font-normal">/10</span>
            </div>
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${((occ.exposure ?? 0) / 10) * 100}%`,
                  background: exposureColor(occ.exposure, 1),
                }}
              />
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border/70">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            {de ? "Beschäftigte" : "Employees"}
          </div>
          <div className="text-3xl font-bold tabular-nums mt-2">
            {(occ.jobs ?? 0).toLocaleString(de ? "de-AT" : "en-US")}
          </div>
        </Card>
        <Card className="p-4 border-border/70">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            {de ? "Medianes Bruttojahresentgelt" : "Median gross annual earnings"}
          </div>
          <div className="text-3xl font-bold tabular-nums mt-2">
            {occ.pay != null ? `€${occ.pay.toLocaleString(de ? "de-AT" : "en-US")}` : "—"}
          </div>
          <div className="text-base text-muted-foreground mt-1">
            {de ? "≈ €" : "~€"}
            {occ.pay != null ? Math.round(occ.pay / 12).toLocaleString(de ? "de-AT" : "en-US") : "—"}{" "}
            {de ? "/ Monat (geschätzt)" : "/ month (estimated)"}
          </div>
        </Card>
        <Card className="p-4 border-border/70">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            {de ? "Ausbildung" : "Education"}
          </div>
          <div className="text-lg font-medium mt-2">{de ? occ.educationDe : occ.education}</div>
        </Card>
      </div>

      {vseSupplement && (
        <Card className="p-4 sm:p-5 border-border/70">
          <h2 className="text-base font-semibold mb-1">
            {de ? "Ergänzende Verdienststrukturerhebung (VSE 2022)" : "Supplementary Structure of Earnings Survey (VSE 2022)"}
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {de
              ? `Statistik Austria Verdienststrukturerhebung — Bruttomedian pro Stunde nach ISCO-08 ${occ.isco08} (Vollzeit, alle Geschlechter). „Beschäftigte“: LFS/Mikrozensus (ISCO) mit NACE-Gewichtung; Entgelt: VSE-Stichprobe — unterschiedliche Erhebungsgrundlagen.`
              : `Statistik Austria earnings survey — gross hourly medians for ISCO-08 ${occ.isco08} (full-time, all genders). “Employees”: LFS/Mikrozensus (ISCO) with NACE weighting; pay: VSE sample — different survey bases.`}
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-base">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                {de ? "Bruttostundenverdienst (Median)" : "Gross hourly median"}
              </div>
              <div className="font-semibold tabular-nums">
                {formatEur(vseSupplement.medianHourlyEUR, de)}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                {de ? "Quartile (Q25–Q75)" : "Quartiles (Q25–Q75)"}
              </div>
              <div className="font-semibold tabular-nums">
                {formatEur(vseSupplement.q25HourlyEUR, de)} –{" "}
                {formatEur(vseSupplement.q75HourlyEUR, de)}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                {de ? "Geschätztes Jahresbrutto (×2.080 Stunden, ohne 13./14. Monatsgehalt)" : "Estimated annual gross (×2,080 hours, excl. 13th/14th month salary)"}
              </div>
              <div className="font-semibold tabular-nums">
                €{vseSupplement.annualGrossEstimate.toLocaleString(de ? "de-AT" : "en-US")}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                {de ? "VSE-Stichprobenumfang" : "VSE sample size"}
              </div>
              <div className="font-semibold tabular-nums">
                {vseSupplement.employeeCount.toLocaleString(de ? "de-AT" : "en-US")}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 sm:p-5 border-border/70">
        <h2 className="text-base font-semibold mb-2">{de ? "Klassifikation" : "Classification"}</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-base">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
              {de ? "ISCO-Hauptgruppe" : "ISCO major group"}
            </div>
            <div>{de ? occ.iscoLabelDe : occ.iscoLabel}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
              {de ? "Sektor-Kontext" : "Sector context"}
            </div>
            <div>
              {de ? occ.categoryDe : occ.category} · ÖNACE {occ.onaceSection}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-5 border-border/70">
        <h2 className="text-base font-semibold mb-2">{de ? "Begründung KI-Exposition" : "AI exposure rationale"}</h2>
        <p className="text-base text-muted-foreground leading-relaxed">{de ? occ.exposureRationaleDe : occ.exposureRationale}</p>
      </Card>

      <Card className="p-4 sm:p-5 border-border/70">
        <h2 className="text-base font-semibold mb-2">{de ? "Quelle, Methodik und Reproduzierbarkeit" : "Source, methodology, and reproducibility"}</h2>
        <p className="text-base text-muted-foreground leading-relaxed font-mono">{occ.source}</p>
      </Card>
    </div>
  );
}
