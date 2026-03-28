import { earningsByOccupation } from "@/lib/real-data";

/** VSE 2022 (OGD_veste403) fields for the same ISCO-08 row used for occupation pay. */
export type VseSupplement = {
  medianHourlyEUR: number;
  q25HourlyEUR: number;
  q75HourlyEUR: number;
  /** Median hourly × 2,080 h — no 13th/14th salary factor */
  annualGrossEstimate: number;
  /** Survey scope: employees in VSE for this ISCO group (Austria), not LFS/Mikrozensus employment */
  employeeCount: number;
};

export function getVseSupplementForIsco(isco08: string): VseSupplement | null {
  const row = earningsByOccupation.find((e) => e.isco08 === isco08);
  if (!row) return null;
  return {
    medianHourlyEUR: row.medianHourlyEUR,
    q25HourlyEUR: row.q25HourlyEUR,
    q75HourlyEUR: row.q75HourlyEUR,
    annualGrossEstimate: row.annualGrossEstimate,
    employeeCount: row.employeeCount,
  };
}
