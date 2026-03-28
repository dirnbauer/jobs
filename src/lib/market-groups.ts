import type { Occupation } from "@/lib/data";
import type { MarketStats } from "@/lib/jobs-aggregate";
import { computeMarketStats } from "@/lib/jobs-aggregate";
import { ONACE_BRANCHES, type OnaceBranch } from "@/lib/onace-branches";

export interface OccupationFamilyDef {
  major: string;
  slug: string;
  labelEn: string;
  labelDe: string;
  blurbEn: string;
  blurbDe: string;
}

export interface OccupationFamilySummary {
  family: OccupationFamilyDef;
  rows: Occupation[];
  stats: MarketStats;
  avgPay: number;
}

export interface SectorSummary {
  branch: OnaceBranch;
  rows: Occupation[];
  stats: MarketStats;
  avgPay: number;
}

export const OCCUPATION_FAMILIES: OccupationFamilyDef[] = [
  {
    major: "1",
    slug: "managers",
    labelEn: "Managers",
    labelDe: "Führungskräfte",
    blurbEn: "Leadership, coordination, budget, and strategic accountability.",
    blurbDe: "Führung, Koordination, Budgetverantwortung und Strategie.",
  },
  {
    major: "2",
    slug: "professionals",
    labelEn: "Professionals",
    labelDe: "Akademische Berufe",
    blurbEn: "Knowledge-intensive specialist work with high formal qualifications.",
    blurbDe: "Wissensintensive Facharbeit mit hoher formaler Qualifikation.",
  },
  {
    major: "3",
    slug: "technicians-associates",
    labelEn: "Technicians & associate professionals",
    labelDe: "Techniker/innen & assoziierte Berufe",
    blurbEn: "Applied technical, diagnostic, and operational specialist roles.",
    blurbDe: "Angewandte technische, diagnostische und operative Spezialrollen.",
  },
  {
    major: "4",
    slug: "clerical-support",
    labelEn: "Clerical support workers",
    labelDe: "Bürokräfte",
    blurbEn: "Administrative, filing, scheduling, and document-heavy office work.",
    blurbDe: "Administrative, dokumentenlastige und koordinierende Bürotätigkeit.",
  },
  {
    major: "5",
    slug: "service-sales",
    labelEn: "Service & sales workers",
    labelDe: "Dienstleistungs- & Verkaufsberufe",
    blurbEn: "Customer-facing service delivery, retail, hospitality, and care support.",
    blurbDe: "Kundennahe Dienstleistungen, Verkauf, Gastronomie und Betreuungsarbeit.",
  },
  {
    major: "6",
    slug: "agriculture-forestry",
    labelEn: "Skilled agriculture & forestry",
    labelDe: "Land- & Forstwirtschaftliche Fachkräfte",
    blurbEn: "Field, animal, and land-based production under variable conditions.",
    blurbDe: "Feld-, Tier- und Landarbeit unter variablen Bedingungen.",
  },
  {
    major: "7",
    slug: "craft-trades",
    labelEn: "Craft & related trades",
    labelDe: "Handwerks- & verwandte Berufe",
    blurbEn: "Skilled manual production, repair, installation, and building trades.",
    blurbDe: "Qualifizierte manuelle Fertigung, Reparatur, Installation und Bauarbeit.",
  },
  {
    major: "8",
    slug: "machine-operators",
    labelEn: "Plant, machine operators & assemblers",
    labelDe: "Anlagen-, Maschinenbedienung & Montage",
    blurbEn: "Equipment operation, industrial processes, transport, and assembly lines.",
    blurbDe: "Anlagenbedienung, industrielle Prozesse, Transport und Montage.",
  },
  {
    major: "9",
    slug: "elementary-occupations",
    labelEn: "Elementary occupations",
    labelDe: "Hilfsarbeitskräfte",
    blurbEn: "Entry-level physical, routine, and support work across the economy.",
    blurbDe: "Einstiegsnahe körperliche, routinierte und unterstützende Arbeit.",
  },
];

const familyByMajor = new Map(OCCUPATION_FAMILIES.map((f) => [f.major, f]));
const familyBySlug = new Map(OCCUPATION_FAMILIES.map((f) => [f.slug, f]));

function weightedAveragePay(rows: Occupation[]): number {
  let weighted = 0;
  let jobs = 0;
  for (const row of rows) {
    if (row.pay != null && row.jobs != null) {
      weighted += row.pay * row.jobs;
      jobs += row.jobs;
    }
  }
  return jobs > 0 ? weighted / jobs : 0;
}

export function getOccupationFamilyByMajor(major: string): OccupationFamilyDef | undefined {
  return familyByMajor.get(major);
}

export function getOccupationFamilyBySlug(slug: string): OccupationFamilyDef | undefined {
  return familyBySlug.get(slug);
}

export function buildOccupationFamilySummaries(rows: Occupation[]): OccupationFamilySummary[] {
  return OCCUPATION_FAMILIES.map((family) => {
    const familyRows = rows.filter((row) => row.iscoMajor === family.major);
    return {
      family,
      rows: familyRows,
      stats: computeMarketStats(familyRows),
      avgPay: weightedAveragePay(familyRows),
    };
  }).filter((entry) => entry.rows.length > 0);
}

export function buildSectorSummaries(rows: Occupation[]): SectorSummary[] {
  return ONACE_BRANCHES.map((branch) => {
    const sectorRows = rows.filter((row) => row.onaceSection === branch.section);
    return {
      branch,
      rows: sectorRows,
      stats: computeMarketStats(sectorRows),
      avgPay: weightedAveragePay(sectorRows),
    };
  }).filter((entry) => entry.rows.length > 0);
}

