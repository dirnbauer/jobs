/**
 * Parse the compact `source` string on each Occupation into structured fields.
 *
 * Example input:
 *   "Eurostat lfsa_egai2d (2024) ISCO-08 61: 116,900 employed (LFS/Mikrozensus AKE)
 *    × 84.3% NACE weight (nama_10_a64_e: NACE A)
 *    | Pay: VSE 2022 national median (€17.49/h)
 *    | Pipeline: scripts/generate-occupations.ts → deterministic build, …"
 */

export interface ParsedSource {
  /* Employment */
  dataset: string; // e.g. "lfsa_egai2d"
  datasetYear: string; // e.g. "2024"
  isco: string; // e.g. "61"
  employed: string; // e.g. "116,900"
  survey: string; // e.g. "LFS/Mikrozensus AKE"

  /* NACE weighting */
  naceWeight: string; // e.g. "84.3%"
  naceDataset: string; // e.g. "nama_10_a64_e"
  naceSection: string; // e.g. "NACE A" or "NACE C10-C12"

  /* Pay */
  paySource: string; // e.g. "VSE 2022"
  payBasis: string; // e.g. "national median" or "ISCO-08 22"
  payRate: string; // e.g. "€17.49/h" or "€26.79/h median × 2080h × 1.17"

  /* Pipeline */
  pipeline: string; // remainder after "Pipeline:"
}

export function parseSourceString(source: string): ParsedSource | null {
  try {
    const parts = source.split("|").map((s) => s.trim());
    if (parts.length < 3) return null;

    const emp = parts[0];
    const pay = parts[1];
    const pipe = parts[2];

    // ── Employment & NACE ──
    const empMatch = emp.match(
      /Eurostat\s+([\w]+)\s+\((\d{4})\)\s+ISCO-08\s+(\d+):\s+([\d,]+)\s+employed\s+\(([^)]+)\)\s+×\s+([\d.]+%)\s+NACE weight\s+\(([\w_]+):\s+(NACE\s+[A-Z0-9-]+)\)/
    );
    if (!empMatch) return null;

    // ── Pay ──
    const payMatch = pay.match(
      /Pay:\s+(VSE\s+\d{4})\s+(.*?)\s+\(([^)]+)\)/
    );

    // ── Pipeline ──
    const pipeText = pipe.replace(/^Pipeline:\s*/, "").trim();

    return {
      dataset: empMatch[1],
      datasetYear: empMatch[2],
      isco: empMatch[3],
      employed: empMatch[4],
      survey: empMatch[5],
      naceWeight: empMatch[6],
      naceDataset: empMatch[7],
      naceSection: empMatch[8],
      paySource: payMatch?.[1] ?? "VSE 2022",
      payBasis: payMatch?.[2] ?? "",
      payRate: payMatch?.[3] ?? "",
      pipeline: pipeText,
    };
  } catch {
    return null;
  }
}
