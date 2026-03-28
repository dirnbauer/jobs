/**
 * ÖNACE Rev.2 section letters (A–S) — one detail page per high-level section.
 * Slugs are stable, readable URLs for /[locale]/branche/[slug].
 */

export interface OnaceBranch {
  readonly section: string;
  readonly slug: string;
  readonly labelDe: string;
  readonly labelEn: string;
}

export const ONACE_BRANCHES: OnaceBranch[] = [
  { section: "A", slug: "a-land-forstwirtschaft-fischerei", labelDe: "Land-, Forstwirtschaft und Fischerei", labelEn: "Agriculture, forestry & fishing" },
  { section: "B", slug: "b-bergbau", labelDe: "Bergbau und Gewinnung von Steinen und Erden", labelEn: "Mining and quarrying" },
  { section: "C", slug: "c-verarbeitendes-gewerbe", labelDe: "Verarbeitendes Gewerbe", labelEn: "Manufacturing" },
  { section: "D", slug: "d-energieversorgung", labelDe: "Energieversorgung", labelEn: "Electricity, gas, steam and air conditioning" },
  { section: "E", slug: "e-wasser-abfall", labelDe: "Wasserversorgung; Abwasser- und Abfallentsorgung", labelEn: "Water supply; sewerage, waste management" },
  { section: "F", slug: "f-bauwesen", labelDe: "Bauwesen", labelEn: "Construction" },
  { section: "G", slug: "g-handel", labelDe: "Handel", labelEn: "Wholesale and retail trade" },
  { section: "H", slug: "h-verkehr-lagerei", labelDe: "Verkehr und Lagerei", labelEn: "Transportation and storage" },
  { section: "I", slug: "i-gastronomie-beherbergung", labelDe: "Gastronomie und Beherbergung", labelEn: "Accommodation and food service" },
  { section: "J", slug: "j-information-kommunikation", labelDe: "Information und Kommunikation", labelEn: "Information and communication" },
  { section: "K", slug: "k-finanz-versicherungen", labelDe: "Finanz- und Versicherungsdienstleistungen", labelEn: "Financial and insurance activities" },
  { section: "L", slug: "l-grundstuecks-wohnungswesen", labelDe: "Grundstücks- und Wohnungswesen", labelEn: "Real estate activities" },
  { section: "M", slug: "m-freiberufliche-dienstleistungen", labelDe: "Freiberufliche, wissenschaftliche und technische Dienstleistungen", labelEn: "Professional, scientific and technical" },
  { section: "N", slug: "n-sonstige-wirtschaftliche-dl", labelDe: "Sonstige wirtschaftliche Dienstleistungen", labelEn: "Administrative and support services" },
  { section: "O", slug: "o-oeffentliche-verwaltung", labelDe: "Öffentliche Verwaltung und Verteidigung", labelEn: "Public administration and defence" },
  { section: "P", slug: "p-erziehung-unterricht", labelDe: "Erziehung und Unterricht", labelEn: "Education" },
  { section: "Q", slug: "q-gesundheit-soziales", labelDe: "Gesundheits- und Sozialwesen", labelEn: "Human health and social work" },
  { section: "R", slug: "r-kunst-sport-erholung", labelDe: "Kunst, Unterhaltung und Erholung", labelEn: "Arts, entertainment and recreation" },
  { section: "S", slug: "s-sonstige-dienstleistungen", labelDe: "Erbringung von sonstigen Dienstleistungen", labelEn: "Other service activities" },
];

const bySlug = new Map(ONACE_BRANCHES.map((b) => [b.slug, b]));
const bySection = new Map(ONACE_BRANCHES.map((b) => [b.section, b]));

export function getBranchBySlug(slug: string): OnaceBranch | undefined {
  return bySlug.get(slug);
}

export function getBranchBySection(section: string): OnaceBranch | undefined {
  return bySection.get(section);
}
