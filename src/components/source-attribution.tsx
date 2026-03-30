import { parseSourceString } from "@/lib/parse-source";
import type { Locale } from "@/lib/locale";

const EUROSTAT_BASE = "https://ec.europa.eu/eurostat/databrowser/view";
const STATISTIK_AT = "https://www.statistik.at/statistiken/arbeitsmarkt/verdienste-und-arbeitskosten/verdienststrukturerhebung";

function DatasetLink({ code, href, children }: { code: string; href: string; children?: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-primary hover:underline underline-offset-2"
    >
      {children ?? code}
    </a>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-3 py-1.5 border-b border-border/40 last:border-0">
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold sm:w-32 shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-foreground/85 leading-relaxed">{children}</dd>
    </div>
  );
}

export function SourceAttribution({
  source,
  locale,
}: {
  source: string;
  locale: Locale;
}) {
  const de = locale === "de";
  const parsed = parseSourceString(source);

  if (!parsed) {
    return <p className="text-sm text-muted-foreground leading-relaxed font-mono">{source}</p>;
  }

  return (
    <dl className="divide-y-0">
      <Row label={de ? "Beschäftigung" : "Employment"}>
        Eurostat{" "}
        <DatasetLink
          code={parsed.dataset}
          href={`${EUROSTAT_BASE}/${parsed.dataset}/default/table`}
        />{" "}
        ({parsed.datasetYear}) · ISCO-08 {parsed.isco} · {parsed.employed}{" "}
        {de ? "Beschäftigte" : "employed"}
      </Row>

      <Row label={de ? "Erhebung" : "Survey"}>
        {parsed.survey}
      </Row>

      <Row label={de ? "NACE-Gewicht" : "NACE weight"}>
        {parsed.naceWeight} ·{" "}
        <DatasetLink
          code={parsed.naceDataset}
          href={`${EUROSTAT_BASE}/${parsed.naceDataset}/default/table`}
        />{" "}
        · {parsed.naceSection}
      </Row>

      <Row label={de ? "Entgelt" : "Pay"}>
        <DatasetLink code={parsed.paySource} href={STATISTIK_AT}>
          {parsed.paySource}
        </DatasetLink>
        {parsed.payBasis ? ` · ${parsed.payBasis}` : ""} · {parsed.payRate}
      </Row>

      <Row label={de ? "Formel" : "Formula"}>
        <span className="font-mono text-xs">
          {de
            ? "Stundenverdienst (Median) × 2.080 h × 1,17 (13./14. Gehalt)"
            : "hourly median × 2,080 h × 1.17 (13th/14th salary)"}
        </span>
      </Row>

      <Row label="Pipeline">
        <span className="font-mono text-xs">generate-occupations.ts</span>
        {" · "}
        {de ? "deterministisch" : "deterministic"} · OGD ·{" "}
        {de ? "99 hypothesengetriebene Verifizierungstests" : "99 hypothesis-driven verification tests"}
      </Row>
    </dl>
  );
}

/**
 * Compact methodology note for aggregate views (family, branch).
 */
export function MethodologyNote({ locale }: { locale: Locale }) {
  const de = locale === "de";
  return (
    <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
      <p>
        {de
          ? "Beschäftigung: Eurostat lfsa_egai2d (EU-Arbeitskräfteerhebung / Mikrozensus AKE 2024) nach ISCO-08, aufgeteilt mit NACE-Sektorgewichten (nama_10_a64_e). Entgelt: Verdienststrukturerhebung 2022 (Statistik Austria OGD). KI-Einfluss: Karpathy-kompatible 0–10 Rubrik. Outlook: WIFO/AMS-Beschäftigungsprognose 2023–2030."
          : "Employment: Eurostat lfsa_egai2d (EU LFS / Mikrozensus AKE 2024) by ISCO-08, split using NACE sector weights (nama_10_a64_e). Pay: Structure of Earnings Survey 2022 (Statistik Austria OGD). AI impact: Karpathy-compatible 0–10 rubric. Outlook: WIFO/AMS employment forecast 2023–2030."}
      </p>
      <p>
        {de
          ? "Pipeline: deterministisch, kein LLM zur Buildzeit, alle Quelldaten öffentlich herunterladbar (OGD), 99 hypothesengetriebene Verifizierungstests."
          : "Pipeline: deterministic, no LLM at build time, all source data publicly downloadable (OGD), 99 hypothesis-driven verification tests."}
        {" "}
        <a
          href={`/${locale}/about`}
          className="text-primary hover:underline underline-offset-2"
        >
          {de ? "Vollständige Methodik →" : "Full methodology →"}
        </a>
      </p>
    </div>
  );
}
