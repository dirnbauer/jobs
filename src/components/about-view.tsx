import type { Locale } from "@/lib/locale";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface AboutViewProps {
  locale: Locale;
}

export function AboutView({ locale }: AboutViewProps) {
  const de = locale === "de";

  if (de) return <AboutDe />;
  return <AboutEn />;
}

function AboutEn() {
  return (
    <div className="space-y-6">
      {/* ── Disclaimer ──────────────────────────────────────────────── */}
      <Card className="p-4 space-y-2 border-amber-500/30 bg-amber-500/5">
        <h2 className="text-sm font-bold">Independent, non-official adaptation</h2>
        <ul className="text-sm leading-relaxed text-foreground/70 space-y-1 pl-4">
          <li className="list-disc">
            This project has <strong className="text-foreground">no affiliation</strong> with the Austrian government, any Austrian ministry, the AMS, WIFO, Statistik Austria, Eurostat, or any other official institution. It is an independent, private project by{" "}
            <a href="https://webconsulting.at" target="_blank" rel="noopener noreferrer" className="underline">webconsulting.at</a>.
          </li>
          <li className="list-disc">
            <strong className="text-foreground">No connection to the U.S. Bureau of Labor Statistics (BLS)</strong> — no BLS data is used. All data sources are European/Austrian.
          </li>
          <li className="list-disc">
            Despite careful methodology and automated verification, <strong className="text-foreground">errors may occur</strong>. The AI impact scores are qualitative assessments, not empirical measurements. This tool is not a substitute for professional labour market advice.
          </li>
        </ul>
      </Card>

      {/* ── Austrian Adaptation ──────────────────────────────────────── */}
      <Card className="p-5 space-y-3 border-(--webcon-primary,#1b7a95)/30 bg-(--webcon-primary,#1b7a95)/5">
        <h2 className="text-base font-bold">Austrian Adaptation</h2>
        <p className="text-base leading-relaxed text-foreground/80 border-b border-border/50 pb-3">
          <strong className="text-foreground">Andrej Karpathy</strong> developed the{" "}
          <strong className="text-foreground">US Job Market Visualizer</strong> — treemap, data pipeline, and
          AI impact scoring rubric are <em>his</em> work. This is an Austrian adaptation with
          local data sources, occupation-based navigation, bilingual interface, and ISCO-08-based structure.
        </p>
        <ul className="space-y-1 text-sm leading-relaxed text-foreground/70 pl-4">
          <li className="list-disc">
            <strong className="text-foreground">Employment</strong> → Eurostat lfsa_egai2d (EU Labour Force Survey / Mikrozensus-AKE) by ISCO-08
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Salary</strong> → Statistik Austria VSE 2022, EUR gross annual incl. 13th/14th month
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Industry</strong> → ÖNACE 2025 (NACE Rev. 2.1) as sectoral context
          </li>
          <li className="list-disc">
            <strong className="text-foreground">AI impact</strong> → Karpathy-compatible 0–10 rubric; qualitative, not empirical
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Outlook 2023–2030</strong> → WIFO/AMS Mittelfristige Beschäftigungsprognose (weighted NACE + ISCO growth)
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Reproducibility</strong> → All data is Open Government Data. Pipeline is deterministic, no LLM at build time. 99 hypothesis-driven tests verify employment, pay, ISCO structure, AI exposure, and sector totals on every regeneration — including 13 that compare row-by-row against original Eurostat and VSE source data.
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-foreground/70">
          Technical stack: Next.js, TypeScript, shadcn/ui. Added features: occupation detail pages, ISCO major group overviews,
          ÖNACE sector context, AT-vs-US comparison, bilingual DE/EN interface, automated test suite.
          The entire codebase is open and reproducible.
        </p>
      </Card>

      {/* ── Data Sources ─────────────────────────────────────────────── */}
      <Card className="p-5 space-y-3">
        <h2 className="text-base font-bold">Data Sources</h2>
        <p className="text-sm text-foreground/70">
          All primary sources are freely downloadable as Open Government Data.
        </p>
        <ul className="space-y-2 text-sm text-foreground/70 pl-4">
          <SourceLink
            name="Eurostat — Employment by occupation (ISCO-08)"
            dataset="lfsa_egai2d"
            url="https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d"
            license="Eurostat copyright (free reuse with attribution)"
          />
          <SourceLink
            name="Statistik Austria — Earnings by sector (VSE 2022)"
            dataset="OGD_veste401_Veste401_1"
            url="https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste401_Veste401_1"
            license="CC-BY 4.0 Statistik Austria"
          />
          <SourceLink
            name="Statistik Austria — Earnings by occupation (VSE 2022)"
            dataset="OGD_veste403_Veste403_1"
            url="https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste403_Veste403_1"
            license="CC-BY 4.0 Statistik Austria"
          />
          <SourceLink
            name="WIFO/AMS — Employment Forecast 2023–2030"
            dataset="AMS report 185"
            url="https://forschungsnetzwerk.ams.at/elibrary/publikation/ams-reports/2025/mittelfristige-beschaeftigungsprognose-fuer-oesterreich-bis-2030-(ams-report-185).html"
            license="AMS Forschungsnetzwerk"
          />
        </ul>
        <p className="text-xs text-foreground/50 mt-2">
          Additional references: AMS, Statistik Austria Open Data, WKO, BMAW, OECD Employment Outlook, IMF WEO.
        </p>
      </Card>

      {/* ── Data Verification (link to dedicated page) ──────────────── */}
      <Card className="p-5 space-y-2">
        <h3 className="text-base font-semibold">Data Verification</h3>
        <p className="text-sm text-foreground/70">
          99 hypothesis-driven tests verify employment, earnings, ISCO structure, AI exposure, and sector totals — including 13 tests that compare row-by-row against original Eurostat and Statistik Austria source data.
        </p>
        <Link
          href="/en/verification"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-2"
        >
          View all verification tests
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </Card>
    </div>
  );
}

function AboutDe() {
  return (
    <div className="space-y-6">
      {/* ── Haftungsausschluss ──────────────────────────────────────── */}
      <Card className="p-4 space-y-2 border-amber-500/30 bg-amber-500/5">
        <h2 className="text-sm font-bold">Unabhängige, nicht-amtliche Adaption</h2>
        <ul className="text-sm leading-relaxed text-foreground/70 space-y-1 pl-4">
          <li className="list-disc">
            Dieses Projekt steht in <strong className="text-foreground">keiner Verbindung</strong> zur österreichischen Bundesregierung, einem Ministerium, dem AMS, dem WIFO, der Statistik Austria, Eurostat oder einer anderen amtlichen Stelle. Es ist ein unabhängiges, privates Projekt von{" "}
            <a href="https://webconsulting.at" target="_blank" rel="noopener noreferrer" className="underline">webconsulting.at</a>.
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Keine Verbindung zum U.S. Bureau of Labor Statistics (BLS)</strong> — es werden keine BLS-Daten verwendet. Alle Datenquellen sind europäisch/österreichisch.
          </li>
          <li className="list-disc">
            Trotz sorgfältiger Methodik und automatisierter Verifikation <strong className="text-foreground">können Fehler auftreten</strong>. Die KI-Einflusswerte sind qualitative Einschätzungen, keine empirischen Messungen. Dieses Tool ersetzt keine professionelle Arbeitsmarktberatung.
          </li>
        </ul>
      </Card>

      {/* ── Österreich-Anpassung ─────────────────────────────────────── */}
      <Card className="p-5 space-y-3 border-(--webcon-primary,#1b7a95)/30 bg-(--webcon-primary,#1b7a95)/5">
        <h2 className="text-base font-bold">Österreichische Adaptation</h2>
        <p className="text-base leading-relaxed text-foreground/80 border-b border-border/50 pb-3">
          <strong className="text-foreground">Andrej Karpathy</strong> entwickelte den{" "}
          <strong className="text-foreground">US Job Market Visualizer</strong> —
          Treemap, Datenpipeline und Bewertungsrahmen sind <em>seine</em> Leistung. Diese Seite dokumentiert die österreichische Adaptation mit
          lokalen Datenquellen, berufsbasierter Navigation, zweisprachiger Oberfläche und ISCO-08-basierter Struktur.
        </p>
        <ul className="space-y-1 text-sm leading-relaxed text-foreground/70 pl-4">
          <li className="list-disc">
            <strong className="text-foreground">Beschäftigung</strong> → Eurostat lfsa_egai2d (EU-Arbeitskräfteerhebung / Mikrozensus-AKE) nach ISCO-08
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Gehälter</strong> → Statistik Austria VSE 2022, EUR Bruttojahresentgelt inkl. 13./14. Monatsgehalt
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Branchen</strong> → ÖNACE 2025 (NACE Rev. 2.1) als sektoraler Kontext
          </li>
          <li className="list-disc">
            <strong className="text-foreground">KI-Einfluss</strong> → Karpathy-kompatibler 0–10-Rahmen; qualitativ, nicht empirisch
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Ausblick 2023–2030</strong> → WIFO/AMS Mittelfristige Beschäftigungsprognose (gewichtetes NACE- + ISCO-Wachstum)
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Reproduzierbarkeit</strong> → Alle Daten als Open Government Data. Pipeline ist deterministisch, kein LLM beim Build. 99 hypothesengetriebene Tests verifizieren Beschäftigung, Gehalt, ISCO-Struktur, KI-Exposition und Sektorsummen bei jeder Regeneration — darunter 13, die Zeile für Zeile gegen Eurostat- und VSE-Originaldaten vergleichen.
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-foreground/70">
          Technische Umsetzung: Next.js, TypeScript, shadcn/ui. Zusätzliche Funktionen: Berufsdetailseiten, ISCO-Hauptgruppenübersichten,
          ÖNACE-Sektor-Kontext, AT-vs-USA-Vergleich, zweisprachige DE/EN-Oberfläche, automatisierte Testsuite.
          Die gesamte Codebasis ist offen und reproduzierbar.
        </p>
      </Card>

      {/* ── Datenquellen ─────────────────────────────────────────────── */}
      <Card className="p-5 space-y-3">
        <h2 className="text-base font-bold">Datenquellen</h2>
        <p className="text-sm text-foreground/70">
          Alle Primärquellen sind als Open Government Data frei herunterladbar.
        </p>
        <ul className="space-y-2 text-sm text-foreground/70 pl-4">
          <SourceLink
            name="Eurostat — Erwerbstätige nach Beruf (ISCO-08)"
            dataset="lfsa_egai2d"
            url="https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d"
            license="Eurostat-Urheberrecht (frei nutzbar mit Quellenangabe)"
          />
          <SourceLink
            name="Statistik Austria — Verdienste nach Branche (VSE 2022)"
            dataset="OGD_veste401_Veste401_1"
            url="https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste401_Veste401_1"
            license="CC-BY 4.0 Statistik Austria"
          />
          <SourceLink
            name="Statistik Austria — Verdienste nach Beruf (VSE 2022)"
            dataset="OGD_veste403_Veste403_1"
            url="https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste403_Veste403_1"
            license="CC-BY 4.0 Statistik Austria"
          />
          <SourceLink
            name="WIFO/AMS — Beschäftigungsprognose 2023–2030"
            dataset="AMS report 185"
            url="https://forschungsnetzwerk.ams.at/elibrary/publikation/ams-reports/2025/mittelfristige-beschaeftigungsprognose-fuer-oesterreich-bis-2030-(ams-report-185).html"
            license="AMS Forschungsnetzwerk"
          />
        </ul>
        <p className="text-xs text-foreground/50 mt-2">
          Weitere Referenzen: AMS, Statistik Austria Open Data, WKO, BMAW, OECD Employment Outlook, IMF WEO.
        </p>
      </Card>

      {/* ── Datenverifizierung (Link zur dedizierten Seite) ──────────── */}
      <Card className="p-5 space-y-2">
        <h3 className="text-base font-semibold">Datenverifizierung</h3>
        <p className="text-sm text-foreground/70">
          99 hypothesengetriebene Tests verifizieren Beschäftigung, Gehalt, ISCO-Struktur, KI-Exposition und Sektorsummen — darunter 13 Tests, die Zeile für Zeile mit Eurostat- und Statistik-Austria-Originaldaten vergleichen.
        </p>
        <Link
          href="/de/verification"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-2"
        >
          Alle Verifizierungstests anzeigen
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </Card>
    </div>
  );
}

function SourceLink({
  name,
  dataset,
  url,
  license,
}: {
  name: string;
  dataset: string;
  url: string;
  license: string;
}) {
  return (
    <li className="list-disc">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground hover:underline inline-flex items-center gap-1"
      >
        {name}
        <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
      <span className="text-foreground/50 text-xs ml-1">({dataset})</span>
      <span className="text-foreground/50 text-xs block">{license}</span>
    </li>
  );
}
