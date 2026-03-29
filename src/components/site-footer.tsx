"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";

function formatBuildDate(iso: string, de: boolean): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = new Intl.DateTimeFormat(de ? "de-AT" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat(de ? "de-AT" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return `${date}, ${time}`;
}

export function SiteFooter() {
  const { locale } = useLocale();
  const de = locale === "de";
  const base = `/${locale}`;
  const year = new Date().getFullYear();

  const buildIso = process.env.NEXT_PUBLIC_BUILD_TIME;
  const buildLabel =
    buildIso && !Number.isNaN(new Date(buildIso).getTime())
      ? formatBuildDate(buildIso, de)
      : null;

  return (
    <footer className="mt-auto border-t border-border/70 bg-muted/20">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border/60 bg-background/35 px-5 py-6 shadow-sm backdrop-blur-sm sm:px-7">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/55">
              {de ? "Österreichische Adaption" : "Austrian adaptation"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/84 sm:text-[15px]">
              {de
                ? "Basierend auf dem ursprünglichen US Job Market Visualizer von Andrej Karpathy, neu aufgebaut für Österreich mit eigener Datenbasis, occupation-first Struktur und lokalen Quellen."
                : "Based on Andrej Karpathy's original US Job Market Visualizer, rebuilt for Austria with its own data foundation, occupation-first structure, and local sources."}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
              <a
                href="https://karpathy.ai/jobs/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-primary/25 bg-primary/8 px-3 py-1.5 font-medium text-primary transition-colors hover:bg-primary/14"
              >
                {de ? "Originalprojekt ansehen" : "View original project"}
              </a>
              <a
                href="https://github.com/dirnbauer/jobs"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border/70 px-3 py-1.5 font-medium text-foreground/78 transition-colors hover:border-primary/35 hover:text-foreground"
                title="github.com/dirnbauer/jobs"
              >
                {de ? "Quellcode auf GitHub" : "Source on GitHub"}
              </a>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border/55 bg-muted/30 px-4 py-4 text-sm">
              <p className="font-medium text-foreground/88">
                {de
                  ? "Kerndaten: Eurostat + Statistik Austria. Referenzen: AMS, WKO, WIFO."
                  : "Core data: Eurostat + Statistics Austria. References: AMS, WKO, WIFO."}
              </p>
              <p className="mt-1.5 leading-relaxed text-foreground/74">
                {de
                  ? "Die Primäranalyse läuft über ISCO-Berufsgruppen und ISCO-Familien. ÖNACE 2025 bleibt die ergänzende Sektoransicht; VSE 2022 wurde unter ÖNACE-2008-Codes erhoben, auf Abschnittsebene (A–S) strukturgleich."
                  : "The primary analysis runs on ISCO occupation groups and ISCO families. ÖNACE 2025 remains the supporting sector view; VSE 2022 earnings were collected under ÖNACE 2008 codes, structurally identical at the A-S section level."}
              </p>
            </div>

            <div className="rounded-2xl border border-border/55 bg-muted/18 px-4 py-4 text-sm">
              <p className="font-medium text-foreground/88">
                {de ? "Unabhängige, nicht-amtliche Adaption." : "Independent, non-official adaptation."}
              </p>
              <p className="mt-1.5 leading-relaxed text-foreground/74">
                {de
                  ? "Keine Verbindung zur WKO, AK, zum AMS, WIFO, zur Statistik Austria oder einer anderen österreichischen Organisation oder Behörde. Keine Verbindung zum U.S. Bureau of Labor Statistics (BLS); es werden keine BLS-Daten verwendet."
                  : "No affiliation with the WKO, AK, AMS, WIFO, Statistik Austria, or any other Austrian organisation or government body. No affiliation with the U.S. Bureau of Labor Statistics (BLS), and no BLS data is used."}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <Link
              href={`${base}/impressum`}
              className="rounded-full border border-border/65 px-3 py-1.5 text-foreground/76 transition-colors hover:border-primary/35 hover:text-foreground"
            >
              {de ? "Impressum" : "Imprint"}
            </Link>
            <Link
              href={`${base}/datenschutz`}
              className="rounded-full border border-border/65 px-3 py-1.5 text-foreground/76 transition-colors hover:border-primary/35 hover:text-foreground"
            >
              {de ? "Datenschutz" : "Privacy Policy"}
            </Link>
            <Link
              href={`${base}/agb`}
              className="rounded-full border border-border/65 px-3 py-1.5 text-foreground/76 transition-colors hover:border-primary/35 hover:text-foreground"
            >
              {de ? "AGB" : "Terms"}
            </Link>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 border-t border-border/60 pt-4 text-center text-[11px] text-foreground/62 sm:flex-row sm:justify-between sm:text-left">
            <span>
              {de ? "Adaptiert für Österreich von" : "Adapted for Austria by"}{" "}
              <a
                href="https://webconsulting.at"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary transition-opacity hover:opacity-85"
              >
                webconsulting.at
              </a>
            </span>

            {buildLabel && buildIso ? (
              <span>
                {de ? "Zuletzt aktualisiert" : "Last updated"}{" "}
                <time dateTime={buildIso} className="tabular-nums">
                  {buildLabel}
                </time>
              </span>
            ) : (
              <span />
            )}

            <span>© {year} webconsulting business services gmbh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
