#!/usr/bin/env npx tsx
/**
 * Austrian Job Market Data Pipeline
 *
 * Fetches REAL data from official Austrian and EU sources:
 *
 * 1. Eurostat lfsa_egai2d — Employed persons by ISCO-08 (2-digit / EU-LFS)
 *    Austria’s national implementation is the Mikrozensus-Arbeitskräfteerhebung (AKE).
 *    Statistik Austria publishes aggregate AKE open data (OGD_ake001j_AKEJ_1); ISCO
 *    breakdown is disseminated via Eurostat under the harmonised EU-LFS table.
 *    Source: https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d
 *    National context: https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_ake001j_AKEJ_1
 *    License: Eurostat copyright policy (free reuse with attribution)
 *
 * 2. Eurostat nama_10_a64_e — Employment by NACE Rev.2 sector (2024)
 *    Used only as proportional weights to split each ISCO total across ÖNACE-labelled
 *    occupation rows (same OCCUPATION_DEFS shares as before). Not the headline employment base.
 *    Source: https://ec.europa.eu/eurostat/databrowser/view/nama_10_a64_e
 *
 * 3. Statistik Austria OGD_veste401 — Verdienststrukturerhebung 2022
 *    Gross hourly earnings by ÖNACE sector (median, quartiles, employee count)
 *    Source: https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste401_Veste401_1
 *    License: CC-BY 4.0
 *
 * 4. Statistik Austria OGD_veste403 — Verdienststrukturerhebung 2022
 *    Gross hourly earnings by ISCO-08 occupation group
 *    Source: https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste403_Veste403_1
 *    License: CC-BY 4.0
 *
 * Output: src/lib/real-data.ts (TypeScript module with verified data)
 */

import { writeFileSync } from "fs";
import { join } from "path";

// ─── Types ──────────────────────────────────────────────────────────────

interface EurostatEntry {
  nace: string;
  label: string;
  employment2024: number; // thousands of persons
}

interface EarningsBySector {
  code: string;
  label: string;
  medianHourly: number; // EUR gross per hour
  q25Hourly: number;
  q75Hourly: number;
  employeeCount: number;
  annualGrossEstimate: number; // median hourly * 2080 (40h * 52w) as rough full-time estimate
}

interface EarningsByOccupation {
  isco08Code: string;
  label: string;
  medianHourly: number;
  q25Hourly: number;
  q75Hourly: number;
  employeeCount: number;
  annualGrossEstimate: number;
}

// ─── Fetch helpers ──────────────────────────────────────────────────────

async function fetchJSON(url: string): Promise<unknown> {
  console.log(`  Fetching: ${url.slice(0, 100)}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchCSV(url: string): Promise<string[][]> {
  console.log(`  Fetching: ${url.split("/").pop()}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const text = await res.text();
  return text
    .trim()
    .split("\n")
    .map((line) => line.split(";").map((cell) => cell.trim()));
}

function parseEurNumber(s: string): number | null {
  if (!s || s === ":" || s === "") return null;
  return parseFloat(s.replace(",", "."));
}

// ─── 1. Eurostat Employment ─────────────────────────────────────────────

const NACE_LABELS: Record<string, string> = {
  TOTAL: "Total economy",
  A: "Agriculture, forestry, fishing",
  A01: "Crop and animal production",
  A02: "Forestry and logging",
  A03: "Fishing and aquaculture",
  B: "Mining and quarrying",
  C: "Manufacturing",
  "C10-C12": "Food, beverages, tobacco",
  "C13-C15": "Textiles, wearing apparel, leather",
  "C16": "Wood products (excl. furniture)",
  "C17": "Paper and paper products",
  "C18": "Printing and recorded media",
  "C19": "Coke and petroleum products",
  "C20": "Chemicals",
  "C21": "Pharmaceuticals",
  "C22": "Rubber and plastic products",
  "C23": "Non-metallic mineral products",
  "C24": "Basic metals",
  "C25": "Fabricated metal products",
  "C26": "Computer, electronic, optical",
  "C27": "Electrical equipment",
  "C28": "Machinery and equipment",
  "C29": "Motor vehicles",
  "C30": "Other transport equipment",
  "C31_C32": "Furniture + other manufacturing",
  "C33": "Repair of machinery",
  D: "Electricity, gas, steam, AC",
  E: "Water, sewerage, waste",
  F: "Construction",
  G: "Wholesale and retail trade",
  G45: "Motor vehicle trade & repair",
  G46: "Wholesale trade",
  G47: "Retail trade",
  H: "Transportation and storage",
  H49: "Land transport",
  H50: "Water transport",
  H51: "Air transport",
  H52: "Warehousing & support",
  H53: "Postal and courier",
  I: "Accommodation and food service",
  J: "Information and communication",
  "J58": "Publishing",
  "J59_J60": "Film, TV, broadcasting",
  "J61": "Telecommunications",
  "J62_J63": "IT services, programming",
  K: "Financial and insurance",
  K64: "Financial services",
  K65: "Insurance",
  K66: "Auxiliary financial services",
  L: "Real estate activities",
  M: "Professional, scientific, technical",
  "M69_M70": "Legal, accounting, management",
  M71: "Architecture and engineering",
  M72: "Scientific R&D",
  M73: "Advertising and market research",
  N: "Administrative and support services",
  N77: "Rental and leasing",
  N78: "Employment activities",
  N79: "Travel agencies",
  O: "Public administration, defence",
  P: "Education",
  Q: "Human health and social work",
  Q86: "Human health activities",
  "Q87_Q88": "Residential care + social work",
  R: "Arts, entertainment, recreation",
  "R90-R92": "Creative arts, libraries, museums",
  R93: "Sports, amusement, recreation",
  S: "Other service activities",
  S94: "Membership organisations",
  S95: "Repair of personal goods",
  S96: "Other personal services",
  T: "Households as employers",
  U: "Extraterritorial organisations",
};

async function fetchEurostatEmployment(): Promise<EurostatEntry[]> {
  console.log("\n═══ 1. Eurostat Employment by NACE (Austria, 2024) ═══");

  const url =
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nama_10_a64_e" +
    "?geo=AT&unit=THS_PER&na_item=EMP_DC&freq=A&time=2024&format=JSON&lang=en";

  const data = (await fetchJSON(url)) as {
    dimension: {
      nace_r2: { category: { index: Record<string, number> } };
    };
    value: Record<string, number>;
  };

  const naceIndex = data.dimension.nace_r2.category.index;
  const values = data.value;

  const entries: EurostatEntry[] = [];
  for (const [naceCode, posIndex] of Object.entries(naceIndex)) {
    const val = values[String(posIndex)];
    if (val === undefined || val === null) continue;
    entries.push({
      nace: naceCode,
      label: NACE_LABELS[naceCode] || naceCode,
      employment2024: Math.round(val * 100) / 100,
    });
  }

  entries.sort((a, b) => b.employment2024 - a.employment2024);
  return entries;
}

/** Eurostat ISCO-08 codes at 2-digit detail: OC21 → ISCO "21". Skip aggregates & armed forces. */
function eurostatCodeToIsco08(code: string): string | null {
  if (!/^OC\d{2}$/.test(code)) return null;
  const n = code.slice(2);
  if (n === "01" || n === "02" || n === "03") return null;
  return n;
}

interface LFSIscoRow {
  eurostatCode: string;
  isco08: string;
  labelEn: string;
  employmentThousands: number;
  employmentPersons: number;
}

interface LFSResult {
  year: number;
  rows: LFSIscoRow[];
  totalThousands: number;
  totalPersons: number;
}

/** Eurostat lfsa_egai2d — employed persons by ISCO-08 (EU-LFS; AT = Mikrozensus AKE). */
async function fetchLFSEmploymentByISCO2(): Promise<LFSResult> {
  console.log(
    "\n═══ 1b. Eurostat LFS — Employed persons by ISCO-08 (Austria, EU-LFS / Mikrozensus AKE) ═══"
  );

  const years = ["2024", "2023", "2022"];
  for (const year of years) {
    const url =
      "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/lfsa_egai2d" +
      `?format=json&lang=en&geo=AT&sex=T&age=Y_GE15&unit=THS_PER&time=${year}`;
    try {
      const data = (await fetchJSON(url)) as {
        value: Record<string, number>;
        dimension: {
          isco08: {
            category: {
              index: Record<string, number>;
              label: Record<string, string>;
            };
          };
        };
      };

      const idx = data.dimension.isco08.category.index;
      const labels = data.dimension.isco08.category.label;
      const values = data.value;

      const rows: LFSIscoRow[] = [];
      let totalThousands = 0;
      let totalPersons = 0;

      for (const [code, pos] of Object.entries(idx)) {
        const v = values[String(pos)];
        if (v === undefined || v === null || Number.isNaN(v)) continue;
        if (code === "TOTAL") {
          totalThousands = v;
          totalPersons = Math.round(v * 1000);
          continue;
        }
        const isco = eurostatCodeToIsco08(code);
        if (isco === null) continue;
        rows.push({
          eurostatCode: code,
          isco08: isco,
          labelEn: labels[code] || code,
          employmentThousands: Math.round(v * 1000) / 1000,
          employmentPersons: Math.round(v * 1000),
        });
      }

      rows.sort((a, b) => b.employmentPersons - a.employmentPersons);
      console.log(
        `   ✓ ${year}: TOTAL ${totalPersons.toLocaleString()} employed; ${rows.length} ISCO-08 (2-digit) rows`
      );
      return { year: parseInt(year, 10), rows, totalThousands, totalPersons };
    } catch {
      console.log(`   (no data for ${year}, trying earlier year…)`);
    }
  }

  throw new Error("Eurostat lfsa_egai2d: could not load any year for AT");
}

// ─── 2. Statistik Austria Earnings by ÖNACE ─────────────────────────────

async function fetchEarningsBySector(): Promise<EarningsBySector[]> {
  console.log("\n═══ 2. Statistik Austria — Earnings by ÖNACE (2022) ═══");

  const [dataRows, lookupRows] = await Promise.all([
    fetchCSV("https://data.statistik.gv.at/data/OGD_veste401_Veste401_1.csv"),
    fetchCSV(
      "https://data.statistik.gv.at/data/OGD_veste401_Veste401_1_C-ONVE10-0.csv"
    ),
  ]);

  // Build lookup: code → label
  const lookup = new Map<string, string>();
  for (const row of lookupRows.slice(1)) {
    if (row.length >= 2) lookup.set(row[0], row[1]);
  }

  // Parse data: filter for total gender (A11-1), full-time (VZTZ-1), VESTE-1
  const results: EarningsBySector[] = [];
  for (const row of dataRows.slice(1)) {
    if (row.length < 9) continue;
    const [veste, gender, worktime, onace, , q25, q50, q75, ub] = row;
    if (veste !== "VESTE-1" || gender !== "A11-1" || worktime !== "VZTZ-1")
      continue;

    const median = parseEurNumber(q50);
    const count = parseEurNumber(ub);
    if (median === null || count === null) continue;

    results.push({
      code: onace.replace("ONVE10-", ""),
      label: lookup.get(onace) || onace,
      medianHourly: median,
      q25Hourly: parseEurNumber(q25) || 0,
      q75Hourly: parseEurNumber(q75) || 0,
      employeeCount: Math.round(count),
      annualGrossEstimate: Math.round(median * 2080), // 40h * 52 weeks
    });
  }

  return results;
}

// ─── 3. Statistik Austria Earnings by ISCO-08 Occupation ────────────────

async function fetchEarningsByOccupation(): Promise<EarningsByOccupation[]> {
  console.log(
    "\n═══ 3. Statistik Austria — Earnings by ISCO-08 Occupation (2022) ═══"
  );

  const [dataRows, lookupRows] = await Promise.all([
    fetchCSV("https://data.statistik.gv.at/data/OGD_veste403_Veste403_1.csv"),
    fetchCSV(
      "https://data.statistik.gv.at/data/OGD_veste403_Veste403_1_C-BERGR08-0.csv"
    ),
  ]);

  const lookup = new Map<string, string>();
  for (const row of lookupRows.slice(1)) {
    if (row.length >= 2) lookup.set(row[0], row[1]);
  }

  // Parse data: filter for total gender (A11-1), all education (BILDUNG-1),
  // all age (ALTGR-1), all tenure (ZUGDAU-1)
  const results: EarningsByOccupation[] = [];
  for (const row of dataRows.slice(1)) {
    if (row.length < 10) continue;
    const [gender, education, ageGroup, tenure, isco, , q25, q50, q75, ub] =
      row;
    if (
      gender !== "A11-1" ||
      education !== "BILDUNG-1" ||
      ageGroup !== "ALTGR-1" ||
      tenure !== "ZUGDAU-1"
    )
      continue;

    const median = parseEurNumber(q50);
    const count = parseEurNumber(ub);
    if (median === null || count === null) continue;

    const code = isco.replace("BERGR08-", "");
    results.push({
      isco08Code: code,
      label: lookup.get(isco) || isco,
      medianHourly: median,
      q25Hourly: parseEurNumber(q25) || 0,
      q75Hourly: parseEurNumber(q75) || 0,
      employeeCount: Math.round(count),
      annualGrossEstimate: Math.round(median * 2080),
    });
  }

  return results;
}

// ─── Generate output ────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║  Austrian Job Market Data Pipeline — REAL DATA FETCH    ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  const [eurostat, lfs, earningsSector, earningsOccupation] = await Promise.all([
    fetchEurostatEmployment(),
    fetchLFSEmploymentByISCO2(),
    fetchEarningsBySector(),
    fetchEarningsByOccupation(),
  ]);

  // ── Print summaries ─────────────────────────────────────────────────

  console.log("\n───── EUROSTAT EMPLOYMENT (top 30) ─────");
  const topSectors = eurostat.slice(0, 30);
  for (const e of topSectors) {
    console.log(
      `  ${e.nace.padEnd(12)} ${(e.employment2024 * 1000).toLocaleString("en-US", { maximumFractionDigits: 0 }).padStart(10)} jobs  ${e.label}`
    );
  }

  const total = eurostat.find((e) => e.nace === "TOTAL");
  console.log(
    `\n  NACE national-accounts total (2024, nama): ${total ? (total.employment2024 * 1000).toLocaleString() : "N/A"}`
  );
  console.log(
    `  LFS employed persons (${lfs.year}, lfsa_egai2d / Mikrozensus AKE): ${lfs.totalPersons.toLocaleString()}`
  );

  console.log("\n───── EARNINGS BY ÖNACE SECTOR ─────");
  for (const e of earningsSector) {
    console.log(
      `  ${e.code.padEnd(8)} Median: €${e.medianHourly.toFixed(2)}/h → ~€${e.annualGrossEstimate.toLocaleString()}/yr  (${e.employeeCount.toLocaleString()} employees)  ${e.label}`
    );
  }

  console.log("\n───── EARNINGS BY ISCO-08 OCCUPATION ─────");
  for (const e of earningsOccupation) {
    console.log(
      `  ${e.isco08Code.padEnd(6)} Median: €${e.medianHourly.toFixed(2)}/h → ~€${e.annualGrossEstimate.toLocaleString()}/yr  (${e.employeeCount.toLocaleString()} employees)  ${e.label}`
    );
  }

  // ── Generate TypeScript output ──────────────────────────────────────

  const timestamp = new Date().toISOString();
  const totalEntry = eurostat.find((e) => e.nace === "TOTAL");
  const output = generateTypeScript(
    eurostat,
    lfs,
    earningsSector,
    earningsOccupation,
    timestamp,
    totalEntry
  );

  const outPath = join(__dirname, "..", "src", "lib", "real-data.ts");
  writeFileSync(outPath, output, "utf-8");
  console.log(`\n✅ Written to: ${outPath}`);
  console.log(`   Timestamp: ${timestamp}`);
}

function generateTypeScript(
  eurostat: EurostatEntry[],
  lfs: LFSResult,
  earningsSector: EarningsBySector[],
  earningsOccupation: EarningsByOccupation[],
  timestamp: string,
  totalEntry?: EurostatEntry
): string {
  // Filter to main NACE sections only (single letter or letter+digits for subsectors)
  const mainSectors = eurostat.filter(
    (e) =>
      /^[A-U]$/.test(e.nace) || // Main sections
      /^[A-U]\d{2}$/.test(e.nace) || // 2-digit subsectors
      /^[A-U]\d{2}_[A-U]\d{2}$/.test(e.nace) || // Combined subsectors
      /^[A-U]\d{2}-[A-U]\d{2}$/.test(e.nace) || // Range subsectors
      e.nace === "TOTAL"
  );

  return `/**
 * REAL Austrian Labour Market Data — fetched ${timestamp}
 *
 * ╔════════════════════════════════════════════════════════════════════╗
 * ║  THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALLY.              ║
 * ║  Run: npx tsx scripts/fetch-real-data.ts                         ║
 * ╚════════════════════════════════════════════════════════════════════╝
 *
 * DATA SOURCES (all freely accessible, no authentication):
 *
 * 1. EMPLOYMENT BY ISCO-08 (headline job counts in generate-occupations.ts)
 *    Eurostat: lfsa_egai2d — Employed persons by detailed occupation (ISCO-08)
 *    EU Labour Force Survey; for Austria the national source is the
 *    Mikrozensus-Arbeitskräfteerhebung (AKE). Aggregate AKE open data:
 *    Statistik Austria OGD_ake001j_AKEJ_1 (https://data.statistik.gv.at)
 *    URL: https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d
 *    Year: ${lfs.year}
 *    License: Eurostat copyright policy (free reuse with source citation)
 *
 * 2. EMPLOYMENT BY NACE (weights only — proportional splits inside each ISCO)
 *    Eurostat: nama_10_a64_e — National accounts employment by NACE
 *    URL: https://ec.europa.eu/eurostat/databrowser/view/nama_10_a64_e
 *    Year: 2024
 *
 * 3. EARNINGS BY ÖNACE SECTOR
 *    Statistik Austria: OGD_veste401_Veste401_1 — VSE 2022
 *    URL: https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste401_Veste401_1
 *    License: CC-BY 4.0 Statistik Austria
 *
 * 4. EARNINGS BY ISCO-08 OCCUPATION GROUP
 *    Statistik Austria: OGD_veste403_Veste403_1 — VSE 2022
 *    URL: https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste403_Veste403_1
 *    License: CC-BY 4.0 Statistik Austria
 *
 * METHODOLOGY NOTES:
 * - LFS vs national accounts totals differ (concepts / coverage).
 * - Statistik Austria earnings = gross, full-time employees only (VSE 2022).
 * - VSE uses ÖNACE 2008 codes; ÖNACE 2025 matches at section level (A–S).
 */

// ─── Fetched ${timestamp} ──────────────────────────────────────────

/** Employed persons by ISCO-08 (2-digit) — Eurostat lfsa_egai2d, AT, year ${lfs.year} */
export const employmentByISCO2 = ${JSON.stringify(
    lfs.rows.map((r) => ({
      isco08: r.isco08,
      labelEn: r.labelEn,
      eurostatCode: r.eurostatCode,
      employmentThousands: r.employmentThousands,
      employmentPersons: r.employmentPersons,
    })),
    null,
    2
  )} as const;

/** Reference total employed (LFS, same table as employmentByISCO2) */
export const TOTAL_EMPLOYMENT_LFS = ${lfs.totalPersons};

/** Year of LFS employment figures */
export const LFS_EMPLOYMENT_YEAR = ${lfs.year} as const;

/** Employment by NACE Rev.2 sector — Eurostat nama_10_a64_e 2024 (weighting only) */
export const employmentByNACE = ${JSON.stringify(
    mainSectors.map((e) => ({
      nace: e.nace,
      label: e.label,
      employmentThousands: e.employment2024,
      employmentPersons: Math.round(e.employment2024 * 1000),
    })),
    null,
    2
  )} as const;

/** Gross hourly earnings by ÖNACE sector — Statistik Austria VSE 2022 */
export const earningsByNACE = ${JSON.stringify(
    earningsSector.map((e) => ({
      nace: e.code,
      label: e.label,
      medianHourlyEUR: e.medianHourly,
      q25HourlyEUR: e.q25Hourly,
      q75HourlyEUR: e.q75Hourly,
      annualGrossEstimate: e.annualGrossEstimate,
      employeeCount: e.employeeCount,
    })),
    null,
    2
  )} as const;

/** Gross hourly earnings by ISCO-08 occupation — Statistik Austria VSE 2022 */
export const earningsByOccupation = ${JSON.stringify(
    earningsOccupation.map((e) => ({
      isco08: e.isco08Code,
      label: e.label,
      medianHourlyEUR: e.medianHourly,
      q25HourlyEUR: e.q25Hourly,
      q75HourlyEUR: e.q75Hourly,
      annualGrossEstimate: e.annualGrossEstimate,
      employeeCount: e.employeeCount,
    })),
    null,
    2
  )} as const;

/** National-accounts employment total (nama_10_a64_e) — differs from LFS; used for NACE weights */
export const TOTAL_EMPLOYMENT_NATIONAL_ACCOUNTS_2024 = ${totalEntry ? Math.round(totalEntry.employment2024 * 1000) : 0};

/** @deprecated Use TOTAL_EMPLOYMENT_LFS — kept for scripts comparing to older runs */
export const TOTAL_EMPLOYMENT_2024 = ${lfs.totalPersons};

/** Data fetch timestamp */
export const DATA_FETCHED_AT = "${timestamp}";

/** Data source URLs for citation */
export const DATA_SOURCES = {
  eurostatLFSEmployment: {
    name: "Eurostat — Employed persons by occupation ISCO-08 2-digit (lfsa_egai2d); AT = Mikrozensus AKE",
    url: "https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d",
    year: ${lfs.year},
    license: "Eurostat copyright policy (free reuse with source citation)",
  },
  statistikAustriaMikrozensusAggregate: {
    name: "Statistik Austria — Mikrozensus-Arbeitskräfteerhebung Jahresdaten (OGD aggregate series)",
    url: "https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_ake001j_AKEJ_1",
    year: ${lfs.year},
    license: "CC-BY 4.0 Statistik Austria",
  },
  eurostatNaceWeights: {
    name: "Eurostat — National accounts employment by NACE (nama_10_a64_e), weights only",
    url: "https://ec.europa.eu/eurostat/databrowser/view/nama_10_a64_e",
    year: 2024,
    license: "Eurostat copyright policy (free reuse with source citation)",
  },
  statistikAustriaEarningsSector: {
    name: "Statistik Austria — Verdienststrukturerhebung 2022 by ÖNACE",
    url: "https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste401_Veste401_1",
    year: 2022,
    license: "CC-BY 4.0 Statistik Austria",
  },
  statistikAustriaEarningsOccupation: {
    name: "Statistik Austria — Verdienststrukturerhebung 2022 by ISCO-08",
    url: "https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_veste403_Veste403_1",
    year: 2022,
    license: "CC-BY 4.0 Statistik Austria",
  },
} as const;
`;
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
