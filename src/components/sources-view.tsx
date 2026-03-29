import type { Locale } from "@/lib/locale";
import { Card } from "@/components/ui/card";
import { ExternalLink, Download, Database, FileJson, FileSpreadsheet } from "lucide-react";

interface SourcesViewProps {
  locale: Locale;
}

const primaryDataSources = {
  en: [
    {
      name: "Eurostat — Employed persons by occupation (ISCO-08)",
      dataset: "lfsa_egai2d (annual; AT = EU Labour Force Survey)",
      desc: "Harmonised EU Labour Force Survey: employed persons by detailed occupation. For Austria, the national implementation is the Mikrozensus-Arbeitskräfteerhebung (AKE). Statistik Austria publishes aggregate Mikrozensus AKE series as open government data.",
      what:
        "Primary employment totals by ISCO-08 (2-digit). NACE sector employment (nama_10_a64_e) is used only as proportional weights to split each ISCO total across the app’s ÖNACE-labelled occupation rows.",
      browseUrl: "https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d",
      downloads: [
        {
          label: "JSON API (example: AT, 2024)",
          url: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/lfsa_egai2d?geo=AT&sex=T&age=Y_GE15&unit=THS_PER&time=2024&format=JSON&lang=en",
          format: "JSON",
        },
        {
          label: "Statistik Austria — Mikrozensus AKE Jahresdaten (OGD)",
          url: "https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_ake001j_AKEJ_1",
          format: "CSV",
        },
      ],
      license: "Eurostat copyright policy (free reuse with attribution); OGD CC-BY 4.0 Statistik Austria",
    },
    {
      name: "Statistik Austria — Earnings by sector",
      dataset: "OGD_veste401_Veste401_1",
      desc: "Verdienststrukturerhebung (VSE) 2022: Bruttostundenverdienst (Median) nach Wirtschaftsabschnitt, Vollzeitbeschäftigte, alle Geschlechter.",
      what:
        "Gross hourly median pay by sector (full-time workers, all genders). This stays in the product as sector context, cross-checking, and a fallback reference beside the occupation-level pay inputs.",
      browseUrl: "https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste401_Veste401_1",
      downloads: [
        {
          label: "Sector earnings CSV",
          url: "https://data.statistik.gv.at/data/OGD_veste401_Veste401_1.csv",
          format: "CSV",
        },
        {
          label: "Sector codes CSV",
          url: "https://data.statistik.gv.at/data/OGD_veste401_Veste401_1_C-ONVE10-0.csv",
          format: "CSV",
        },
      ],
      license: "CC-BY 4.0 Statistik Austria",
    },
    {
      name: "Statistik Austria — Earnings by occupation",
      dataset: "OGD_veste403_Veste403_1",
      desc: "Verdienststrukturerhebung (VSE) 2022: Bruttostundenverdienst (Median) nach ISCO-08-Berufsgruppe, Vollzeitbeschäftigte, alle Geschlechter.",
      what:
        "Gross hourly median pay by ISCO-08 occupation group (full-time workers, all genders). This is the main pay input for the occupation-first model.",
      browseUrl: "https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste403_Veste403_1",
      downloads: [
        {
          label: "Occupation earnings CSV",
          url: "https://data.statistik.gv.at/data/OGD_veste403_Veste403_1.csv",
          format: "CSV",
        },
        {
          label: "Occupation codes CSV",
          url: "https://data.statistik.gv.at/data/OGD_veste403_Veste403_1_C-BERGR08-0.csv",
          format: "CSV",
        },
      ],
      license: "CC-BY 4.0 Statistik Austria",
    },
  ],
  de: [
    {
      name: "Eurostat — Erwerbstätige nach Beruf (ISCO-08)",
      dataset: "lfsa_egai2d (jährlich; AT = EU-Arbeitskräfteerhebung)",
      desc: "Harmonisierte EU-Arbeitskräfteerhebung: Erwerbstätige nach detailliertem Beruf. In Österreich entspricht das der Mikrozensus-Arbeitskräfteerhebung (AKE). Statistik Austria veröffentlicht aggregierte AKE-Zeitreihen als Open Data.",
      what:
        "Primäre Beschäftigungszahlen je ISCO-08 (2-Steller). NACE-Sektorbeschäftigung (nama_10_a64_e) dient nur als proportionale Gewichtung, um jede ISCO-Summe auf die ÖNACE-beschrifteten Berufszeilen der App aufzuteilen.",
      browseUrl: "https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d",
      downloads: [
        {
          label: "JSON API (Beispiel AT, 2024)",
          url: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/lfsa_egai2d?geo=AT&sex=T&age=Y_GE15&unit=THS_PER&time=2024&format=JSON&lang=de",
          format: "JSON",
        },
        {
          label: "Statistik Austria — Mikrozensus AKE Jahresdaten (OGD)",
          url: "https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_ake001j_AKEJ_1",
          format: "CSV",
        },
      ],
      license: "Eurostat-Urheberrecht (frei nutzbar mit Quellenangabe); OGD CC-BY 4.0 Statistik Austria",
    },
    {
      name: "Statistik Austria — Verdienste nach Branche",
      dataset: "OGD_veste401_Veste401_1",
      desc: "Verdienststrukturerhebung (VSE) 2022: Bruttostundenverdienst (Median) nach Wirtschaftsabschnitt, Vollzeitbeschäftigte, alle Geschlechter.",
      what:
        "Bruttostundenverdienst (Median) nach Branche (Vollzeit, alle Geschlechter). Diese Daten bleiben im Produkt als Sektor-Kontext, Cross-Check und Fallback-Referenz neben den berufsbasierten Entgeltinputs.",
      browseUrl: "https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste401_Veste401_1",
      downloads: [
        {
          label: "Branchenverdienst-Daten CSV",
          url: "https://data.statistik.gv.at/data/OGD_veste401_Veste401_1.csv",
          format: "CSV",
        },
        {
          label: "Branchen-Codes CSV",
          url: "https://data.statistik.gv.at/data/OGD_veste401_Veste401_1_C-ONVE10-0.csv",
          format: "CSV",
        },
      ],
      license: "CC-BY 4.0 Statistik Austria",
    },
    {
      name: "Statistik Austria — Verdienste nach Beruf",
      dataset: "OGD_veste403_Veste403_1",
      desc: "Verdienststrukturerhebung (VSE) 2022: Bruttostundenverdienst (Median) nach ISCO-08-Berufsgruppe, Vollzeitbeschäftigte, alle Geschlechter.",
      what:
        "Bruttostundenverdienst (Median) nach ISCO-08 Berufsgruppe (Vollzeit, alle Geschlechter). Das ist der zentrale Entgeltinput für das occupation-first Modell.",
      browseUrl: "https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste403_Veste403_1",
      downloads: [
        {
          label: "Berufsverdienst-Daten CSV",
          url: "https://data.statistik.gv.at/data/OGD_veste403_Veste403_1.csv",
          format: "CSV",
        },
        {
          label: "Berufs-Codes CSV",
          url: "https://data.statistik.gv.at/data/OGD_veste403_Veste403_1_C-BERGR08-0.csv",
          format: "CSV",
        },
      ],
      license: "CC-BY 4.0 Statistik Austria",
    },
  ],
};

const sourcesPageIntro: Record<Locale, string> = {
  en: "Primary Austrian and European data sources used in the occupation-based analysis, supplemented by additional labour-market references. All primary sources are freely downloadable as Open Government Data — the entire dataset is scientifically verifiable and fully reproducible.",
  de: "Primäre österreichische und europäische Datenquellen der berufsbasierten Analyse, ergänzt durch weitere Arbeitsmarkt-Referenzen. Alle Primärquellen sind als Open Government Data frei herunterladbar — der gesamte Datensatz ist wissenschaftlich nachprüfbar und jederzeit reproduzierbar.",
};

const referenceSourcesList: Record<
  Locale,
  { name: string; url: string; desc: string }[]
> = {
  en: [
    {
      name: "AMS — Arbeitsmarktservice Österreich",
      url: "https://www.ams.at/arbeitsmarktdaten-und-medien/arbeitsmarkt-daten-und-arbeitsmarkt-forschung/arbeitsmarktdaten",
      desc: "Monthly labor market reports: registered unemployment, employment figures, vacancies",
    },
    {
      name: "Statistik Austria — Labour Market",
      url: "https://www.statistik.at/en/statistics/labour-market",
      desc: "Labour Force Survey, register-based statistics, job vacancy statistics",
    },
    {
      name: "WKO — Wirtschaftskammer Österreich",
      url: "https://www.wko.at/zahlen-daten-fakten/daten-oesterreich",
      desc: "Employment statistics by chamber system, industry data, ÖNACE classification",
    },
    {
      name: "Statistik Austria — Open Data",
      url: "https://data.statistik.gv.at/web/",
      desc: "Open government data portal with CSV/JSON/API access",
    },
    {
      name: "BMAW — Bundesministerium für Arbeit und Wirtschaft",
      url: "https://www.sozialministerium.gv.at/Themen/Arbeit/Arbeitsmarkt/Arbeitsmarktdaten.html",
      desc: "Federal Ministry labor market data and reports",
    },
  ],
  de: [
    {
      name: "AMS — Arbeitsmarktservice Österreich",
      url: "https://www.ams.at/arbeitsmarktdaten-und-medien/arbeitsmarkt-daten-und-arbeitsmarkt-forschung/arbeitsmarktdaten",
      desc: "Monatliche Arbeitsmarktberichte: registrierte Arbeitslosigkeit, Beschäftigungszahlen, offene Stellen",
    },
    {
      name: "Statistik Austria — Arbeitsmarkt",
      url: "https://www.statistik.at/statistiken/arbeitsmarkt",
      desc: "Arbeitskräfteerhebung, Registerbasierte Arbeitsmarktstatistik, Offene-Stellen-Erhebung",
    },
    {
      name: "WKO — Wirtschaftskammer Österreich",
      url: "https://www.wko.at/zahlen-daten-fakten/daten-oesterreich",
      desc: "Beschäftigungsstatistik nach Kammersystematik, Branchendaten, ÖNACE-Klassifikation",
    },
    {
      name: "Statistik Austria — Open Data",
      url: "https://data.statistik.gv.at/web/",
      desc: "Open-Government-Datenportal mit CSV/JSON/API-Zugang",
    },
    {
      name: "BMAW — Bundesministerium für Arbeit und Wirtschaft",
      url: "https://www.sozialministerium.gv.at/Themen/Arbeit/Arbeitsmarkt/Arbeitsmarktdaten.html",
      desc: "Arbeitsmarktdaten und Berichte des Bundesministeriums",
    },
  ],
};

function FormatIcon({ format }: { format: string }) {
  if (format === "CSV") return <FileSpreadsheet className="h-3.5 w-3.5" />;
  if (format === "JSON") return <FileJson className="h-3.5 w-3.5" />;
  return <Download className="h-3.5 w-3.5" />;
}

export function SourcesView({ locale }: SourcesViewProps) {
  const de = locale === "de";
  const sources = primaryDataSources[locale];

  return (
    <div className="space-y-6">
      <div className="text-base text-foreground/80">
        {sourcesPageIntro[locale]}
      </div>

      {/* Primary data sources with exact download URLs */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Database className="h-5 w-5" />
          {de ? "Primäre Datenquellen (direkt verwendet)" : "Primary Data Sources (directly used)"}
        </h2>
        <p className="text-base text-foreground/80 mb-4">
          {de
            ? "Diese drei Datensätze fließen direkt in die Generierung von Berufszeilen, Familienansichten, Entgeltwerten und Sektor-Kontext ein. Alle Download-Links zeigen auf die offiziellen Dateien. Damit kann jeder Datenpunkt eigenständig verifiziert werden — die Generierungspipeline (scripts/generate-occupations.ts) ist quelloffen und erzeugt bei identischen Eingaben identische Ergebnisse."
            : "These three datasets flow directly into generation of occupation rows, family views, pay values, and sector context. All download links point to the official files. Every data point can be independently verified — the generation pipeline (scripts/generate-occupations.ts) is open-source and produces identical results from identical inputs."}
        </p>
        <div className="grid gap-4">
          {sources.map((source) => (
            <Card key={source.dataset} className="p-5 hover:bg-accent/50 transition-colors">
              <div className="flex-1 min-w-0">
                <a
                  href={source.browseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold hover:underline inline-flex items-center gap-1.5"
                  style={{ color: "var(--webcon-primary, #1b7a95)" }}
                >
                  {source.name}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
                <div className="mt-0.5 text-xs font-mono text-foreground/75">
                  {source.dataset}
                </div>
                <p className="mt-2 text-base text-foreground/80">{source.desc}</p>
                <p className="mt-1 text-base text-foreground/80">
                  <strong className="text-foreground">{de ? "Verwendung in der Anwendung:" : "Usage in the application:"}</strong>{" "}
                  {source.what}
                </p>

                {/* Download links */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {source.downloads.map((dl) => (
                    <a
                      key={dl.url}
                      href={dl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-accent/80 hover:bg-accent transition-colors"
                      style={{ color: "var(--webcon-primary, #1b7a95)" }}
                    >
                      <span aria-hidden="true">
                        <FormatIcon format={dl.format} />
                      </span>
                      {dl.label}
                      <span className="text-foreground/80">({dl.format})</span>
                    </a>
                  ))}
                </div>

                <div className="mt-2 text-xs text-foreground/75">
                  {de ? "Lizenz" : "License"}: {source.license}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Methodology note */}
      <Card className="p-5 bg-muted/30">
        <h3 className="text-base font-semibold mb-2">
          {de ? "Reproduzierbare Datenverarbeitungsmethodik" : "Reproducible Data Processing Methodology"}
        </h3>
        <ul className="space-y-2 text-base text-foreground/80">
          <li>
            <strong>{de ? "Beschäftigung:" : "Employment:"}</strong>{" "}
            {de
              ? "ISCO-08-Beschäftigungszahlen (2-Steller) direkt aus Eurostat lfsa_egai2d. NACE-Sektorbeschäftigung (nama_10_a64_e) dient als proportionale Gewichtung zur Aufteilung auf die ÖNACE-beschrifteten Berufszeilen."
              : "ISCO-08 employment figures (2-digit) directly from Eurostat lfsa_egai2d. NACE sector employment (nama_10_a64_e) serves as proportional weighting to distribute across ÖNACE-labelled occupation rows."}
          </li>
          <li>
            <strong>{de ? "ISCO / Berufslogik:" : "ISCO / occupation logic:"}</strong>{" "}
            {de
              ? "Primärebene: ISCO-08-Berufsgruppen (2-Steller) und daraus abgeleitete ISCO-Hauptgruppen (Familien). ÖNACE 2025 bleibt die ergänzende Sektorebene für wirtschaftlichen Kontext."
              : "Primary layer: ISCO-08 occupation groups (2-digit) and derived ISCO major groups (families). ÖNACE 2025 remains the supplementary sector layer for economic context."}
          </li>
          <li>
            <strong>{de ? "ÖNACE / Sektorlabels:" : "ÖNACE / sector labels:"}</strong>{" "}
            {de
              ? "Sektordarstellung: ÖNACE 2025 (gültig seit 1.1.2025) für die Abschnittsbezeichnungen A–S. Die Verdienststrukturerhebung 2022 wurde unter ÖNACE 2008 (NACE Rev. 2) erhoben; auf Abschnittsebene ist die Struktur mit ÖNACE 2025 identisch, Unterschiede betreffen feinere Unterklassen."
              : "Sector display: ÖNACE 2025 (effective since 1 Jan 2025) for section labels A–S. The Structure of Earnings Survey 2022 was collected under ÖNACE 2008 (NACE Rev. 2); at section level the structure is identical to ÖNACE 2025, differences concern finer subclasses."}
          </li>
          <li>
            <strong>{de ? "Gehälter:" : "Salaries:"}</strong>{" "}
            {de
              ? "Bruttostundenverdienst (Median) aus der Verdienststrukturerhebung 2022 × 2.080 Stunden/Jahr × 1,17 (13. und 14. Monatsgehalt) = geschätztes Bruttojahresentgelt."
              : "Gross hourly earnings (median) from the Structure of Earnings Survey 2022 × 2,080 hours/year × 1.17 (13th and 14th month salary) = estimated gross annual earnings."}
          </li>
          <li>
            <strong>{de ? "KI-Exposition:" : "AI Exposure:"}</strong>{" "}
            {de
              ? "Ganzzahl 0–10 plus Begründung (Deutsch und Englisch) pro Berufsgruppe, definiert in scripts/generate-occupations.ts (OCCUPATION_DEFS). Bewertungsrahmen wie bei Karpathy (kognitive/digitale Aufgabenanteile; keine empirische Messung wie Felten et al.). Kein LLM-API-Aufruf beim Build — Werte sind kuratiert und werden beim Generatorlauf nach data.ts geschrieben. Optional: npm run score:exposure-llm (OPENROUTER_API_KEY) schreibt scripts/llm-exposure-overrides.json; der Generator überschreibt damit nur Exposition/Begründung."
              : "Integer 0–10 plus English rationale per occupation group, defined in scripts/generate-occupations.ts (OCCUPATION_DEFS). Rubric matches Karpathy’s concept (cognitive/digital task content; not empirical measurement like Felten et al.). No LLM API call at build time—values are curated and written to data.ts when you run the generator. Optional: npm run score:exposure-llm (OPENROUTER_API_KEY) writes scripts/llm-exposure-overrides.json; the generator merges those for exposure + rationale only."}
          </li>
          <li>
            <strong>{de ? "Berufsausblick:" : "Occupation outlook:"}</strong>{" "}
            {de
              ? "Ganzzahl –10…+10 und Kurzlabel (outlookDesc) in OCCUPATION_DEFS; qualitatives Nachfragesignal pro aggregierter Gruppe, sektorinformiert — nicht identisch mit AMS-Prognosen, aber im selben Diskurs (Strukturwandel, WIFO/AMS)."
              : "Integer –10…+10 and short label (outlookDesc) in OCCUPATION_DEFS; qualitative demand signal per aggregated group, sector-informed—not identical to AMS forecasts, but in the same policy discourse (structural change, WIFO/AMS)."}
          </li>
        </ul>
      </Card>

      {/* General reference sources */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          {de ? "Weitere Referenzquellen" : "Additional Reference Sources"}
        </h2>
        <div className="grid gap-3">
          {referenceSourcesList[locale].map((source) => (
            <Card key={source.url} className="p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold hover:underline inline-flex items-center gap-1.5"
                    style={{ color: "var(--webcon-primary, #1b7a95)" }}
                  >
                    {source.name}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                  <p className="mt-1 text-base text-foreground/80">{source.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-4 bg-muted/30">
        <h3 className="text-base font-semibold mb-2">
          {de ? "Zusätzliche Quellen" : "Additional Sources"}
        </h3>
        <ul className="space-y-1.5 text-base text-foreground/80">
          <li className="space-y-1">
            <span>
              • ÖNACE 2025 ({de ? "aktueller Standard seit 1.1.2025" : "current standard since 1 Jan 2025"}
              ):{" "}
              <a
                href="https://www.wko.at/statistik/oenace/oenace2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-primary/60 hover:decoration-primary"
                style={{ color: "var(--webcon-primary, #1b7a95)" }}
              >
                WKO PDF
              </a>
              {" | "}
              <a
                href="https://www.statistik.at/kdb/downloads/pdf/prod/OENACE2025_EN_CTI.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-primary/60 hover:decoration-primary"
                style={{ color: "var(--webcon-primary, #1b7a95)" }}
              >
                Statistik Austria EN
              </a>
            </span>
            <p className="text-base text-foreground/75 pl-3 leading-snug">
              {de
                ? "Hinweis: VSE 2022-Verdienstdateien verwenden ÖNACE-2008-Codes; Abschnitte A–S sind strukturgleich."
                : "Note: VSE 2022 earnings files use ÖNACE 2008 codes; sections A–S are structurally the same."}
            </p>
          </li>
          <li>
            • {de ? "Eurostat-Arbeitsmarkt" : "Eurostat Labour Market"}:{" "}
            <a
              href="https://eures.europa.eu/living-and-working/labour-market-information/labour-market-information-austria_en"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-primary/60 hover:decoration-primary"
              style={{ color: "var(--webcon-primary, #1b7a95)" }}
            >
              EURES Austria
            </a>
          </li>
          <li>
            • IMF World Economic Outlook 2025 ({de ? "BIP pro Kopf, KKP-Vergleiche" : "GDP per capita, PPP comparisons"})
          </li>
          <li>
            • OECD Employment Outlook ({de ? "Arbeitszeiten, Erwerbsbeteiligung" : "working hours, labour force participation"})
          </li>
          <li>
            • Statistik Austria {de ? "Allgemeiner Einkommensbericht" : "General Income Report"} 2024 ({de ? "Gehaltsdaten" : "salary data"})
          </li>
          <li>
            • WIFO ({de ? "Wirtschaftsforschungsinstitut" : "Austrian Institute of Economic Research"}) {de ? "Arbeitsmarktprognosen" : "labour market projections"} 2025–2030
          </li>
        </ul>
      </Card>
    </div>
  );
}
