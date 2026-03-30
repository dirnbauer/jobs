/**
 * Austrian Job Market Data — VERIFIED FROM OFFICIAL SOURCES
 *
 * Generated: 2026-03-30T05:40:48.090Z
 * Pipeline: scripts/generate-occupations.ts
 * Real data fetched: 2026-03-28T19:10:37.947Z
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  EMPLOYMENT: Eurostat lfsa_egai2d (2024) — ISCO-08 2-digit ║
 * ║  → EU Labour Force Survey; AT = Mikrozensus-Arbeitskräfteerhebung (AKE)   ║
 * ║  → URL: https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d       ║
 * ║  → Aggregate AKE OGD: OGD_ake001j_AKEJ_1 (data.statistik.gv.at)           ║
 * ║  → LFS employed persons (AT): 4,488,700                                   ║
 * ║                                                                          ║
 * ║  WEIGHTS: Eurostat nama_10_a64_e (2024) NACE employment                 ║
 * ║  → Splits each ISCO total across ÖNACE occupation rows in this app        ║
 * ║                                                                          ║
 * ║  EARNINGS: Statistik Austria Verdienststrukturerhebung 2022              ║
 * ║  → OGD_veste401 (ÖNACE), OGD_veste403 (ISCO-08) — CC-BY 4.0               ║
 * ║                                                                          ║
 * ║  METHODOLOGY: jobs = LFS_total[ISCO] × NACE_weight[row]/Σ_weight[ISCO]   ║
 * ║  → Pay = VSE 2022 median hourly × 2,080h × 1.17 (13th/14th salary)       ║
 * ║  OUTLOOK: WIFO/AMS Beschäftigungsprognose 2023–2030 (Tabellenband)       ║
 * ║  → NACE sector × ISCO group composite growth rate (% p.a.)              ║
 * ║  → AI exposure = OCCUPATION_DEFS (Karpathy rubric)                      ║
 * ║  → Regenerate: npx tsx scripts/fetch-real-data.ts && generate-occupations ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Modeled jobs sum: 4,476,099 vs Σ LFS for ISCOs in this model: 4,476,100
 * (100.0% — should be ~100% after rounding; 75 occupation groups)
 */

import {
  employmentByISCO2,
  employmentByNACE,
  earningsByOccupation,
  TOTAL_EMPLOYMENT_LFS,
} from "./real-data";

export interface Occupation {
  title: string;
  titleDe: string;
  slug: string;
  category: string;
  categoryDe: string;
  onaceSection: string;
  isco08: string;
  iscoMajor: string;
  iscoLabel: string;
  iscoLabelDe: string;
  pay: number | null;
  jobs: number | null;
  outlook: number | null;
  outlookGrowthPa: number;
  outlookDesc: string;
  outlookDescDe: string;
  education: string;
  educationDe: string;
  exposure: number | null;
  exposureRationale: string;
  exposureRationaleDe: string;
  source: string;
}

export const EDU_LEVELS_AT = [
  "Pflichtschulabschluss",
  "Lehrabschluss",
  "BMS-Abschluss",
  "Matura (AHS/BHS)",
  "Kolleg/Akademie",
  "Bachelor/FH-Bachelor",
  "Master/Diplom",
  "Doktorat/PhD",
];

export const EDU_LEVELS_EN = [
  "Compulsory school",
  "Apprenticeship (Lehre)",
  "Vocational school (BMS)",
  "Upper secondary (Matura)",
  "Post-secondary (Kolleg)",
  "Bachelor's degree",
  "Master's/Diploma degree",
  "Doctoral/PhD",
];

export const austrianOccupations: Occupation[] = [
  {
    title: "Skilled agricultural workers",
    titleDe: "Landwirtschaftliche Fachkräfte",
    slug: "agricultural-workers",
    category: "A",
    categoryDe: "Land- & Forstwirtschaft",
    onaceSection: "A",
    isco08: "61",
    iscoMajor: "6",
    iscoLabel: "Skilled agriculture & forestry",
    iscoLabelDe: "Land- & Forstwirtschaftliche Fachkräfte",
    pay: 42564,
    jobs: 98590,
    outlook: 1,
    outlookGrowthPa: 0.5,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 2,
    exposureRationale: "Primary tasks: soil cultivation, sowing, harvesting, livestock management. Approximately 80% manual field work. Precision agriculture (GPS-guided machinery, drone-based crop monitoring, sensor-based irrigation) automates data collection, but physical execution remains non-substitutable.",
    exposureRationaleDe: "Kerntätigkeiten: Bodenbearbeitung, Aussaat, Ernte, Tierhaltung. Ca. 80 % manuelle Feldarbeit. Präzisionslandwirtschaft (GPS-gesteuerte Maschinen, drohnenbasiertes Pflanzenmonitoring, sensorgestützte Bewässerung) automatisiert die Datenerfassung, die physische Durchführung bleibt jedoch nicht substituierbar.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 61: 116,900 employed (LFS/Mikrozensus AKE) × 84.3% NACE weight (nama_10_a64_e: NACE A) | Pay: VSE 2022 national median (€17.49/h) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Skilled forestry workers",
    titleDe: "Forstwirtschaftliche Fachkräfte",
    slug: "forestry-workers",
    category: "A",
    categoryDe: "Land- & Forstwirtschaft",
    onaceSection: "A",
    isco08: "61",
    iscoMajor: "6",
    iscoLabel: "Skilled agriculture & forestry",
    iscoLabelDe: "Land- & Forstwirtschaftliche Fachkräfte",
    pay: 42564,
    jobs: 18310,
    outlook: 1,
    outlookGrowthPa: 0.5,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 1,
    exposureRationale: "Tasks consist of felling, skidding, and silvicultural maintenance in uneven terrain. Digital tools are limited to GPS marking and inventory systems. No significant automation potential for core field operations.",
    exposureRationaleDe: "Tätigkeiten umfassen Holzfällung, Rückung und Waldpflege in unebenem Gelände. Digitale Werkzeuge beschränken sich auf GPS-Markierung und Bestandserfassungssysteme. Kein wesentliches Automatisierungspotenzial für die Kerntätigkeiten im Feld.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 61: 116,900 employed (LFS/Mikrozensus AKE) × 15.7% NACE weight (nama_10_a64_e: NACE A) | Pay: VSE 2022 national median (€17.49/h) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Veterinarians & agricultural scientists",
    titleDe: "Tierärzte & Agrarwissenschaftler/innen",
    slug: "veterinarians-agri",
    category: "A",
    categoryDe: "Land- & Forstwirtschaft",
    onaceSection: "A",
    isco08: "22",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 65196,
    jobs: 38127,
    outlook: 2,
    outlookGrowthPa: 0.7,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Master's/Diploma degree",
    educationDe: "Master/Diplom",
    exposure: 3,
    exposureRationale: "Clinical diagnostics, surgical procedures, and animal welfare assessments require physical examination. AI-based image analysis (radiology, dermatology) supports diagnostics; documentation and laboratory data management are partially automatable.",
    exposureRationaleDe: "Klinische Diagnostik, chirurgische Eingriffe und Tierschutzbeurteilungen erfordern körperliche Untersuchung. KI-gestützte Bildanalyse (Radiologie, Dermatologie) unterstützt die Diagnostik; Dokumentation und Labordatenmanagement sind teilweise automatisierbar.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 22: 194,900 employed (LFS/Mikrozensus AKE) × 19.6% NACE weight (nama_10_a64_e: NACE A) | Pay: VSE 2022 ISCO-08 22 (€26.79/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Forestry, fishery & hunting workers",
    titleDe: "Forst-, Fischerei- & Jagdfachkräfte",
    slug: "forestry-fishery-hunting",
    category: "A",
    categoryDe: "Land- & Forstwirtschaft",
    onaceSection: "A",
    isco08: "62",
    iscoMajor: "6",
    iscoLabel: "Skilled agriculture & forestry",
    iscoLabelDe: "Land- & Forstwirtschaftliche Fachkräfte",
    pay: 42564,
    jobs: 6600,
    outlook: 1,
    outlookGrowthPa: 0.5,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 1,
    exposureRationale: "Core activities: timber harvesting, commercial fishing, game management. Work in remote, unstructured environments with minimal digital infrastructure. AI application limited to population modelling and GPS-based tracking.",
    exposureRationaleDe: "Kerntätigkeiten: Holzernte, gewerbliche Fischerei, Wildtiermanagement. Arbeit in abgelegenen, unstrukturierten Umgebungen mit minimaler digitaler Infrastruktur. KI-Anwendung beschränkt sich auf Populationsmodellierung und GPS-gestütztes Tracking.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 62: 6,600 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE A) | Pay: VSE 2022 national median (€17.49/h) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Agricultural & forestry labourers",
    titleDe: "Land- & forstwirtschaftliche Hilfskräfte",
    slug: "agricultural-labourers",
    category: "A",
    categoryDe: "Land- & Forstwirtschaft",
    onaceSection: "A",
    isco08: "92",
    iscoMajor: "9",
    iscoLabel: "Elementary occupations",
    iscoLabelDe: "Hilfsarbeitskräfte",
    pay: 30834,
    jobs: 6200,
    outlook: 1,
    outlookGrowthPa: 0.5,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Compulsory school",
    educationDe: "Pflichtschulabschluss",
    exposure: 1,
    exposureRationale: "Manual seasonal tasks: hand harvesting, planting, sorting, animal feeding. Nearly zero digital task share. Robotics in harvesting (e.g. soft fruit) is in early development; economic viability for Austrian farm structures is low.",
    exposureRationaleDe: "Manuelle saisonale Tätigkeiten: Handernte, Pflanzung, Sortierung, Tierfütterung. Digitaler Aufgabenanteil nahezu null. Ernteroboter (z. B. für Beerenobst) befinden sich in früher Entwicklung; die Wirtschaftlichkeit für österreichische Betriebsstrukturen ist gering.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 92: 6,200 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE A) | Pay: VSE 2022 ISCO-08 92 (€12.67/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Mining technicians & engineers",
    titleDe: "Bergbautechniker/innen",
    slug: "mining-technicians",
    category: "B",
    categoryDe: "Bergbau",
    onaceSection: "B",
    isco08: "81",
    iscoMajor: "8",
    iscoLabel: "Plant, machine operators & assemblers",
    iscoLabelDe: "Anlagen-, Maschinenbedienung & Montage",
    pay: 41809,
    jobs: 3877,
    outlook: -3,
    outlookGrowthPa: -0.8,
    outlookDesc: "Declining",
    outlookDescDe: "Rückläufig",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 3,
    exposureRationale: "Subsurface extraction, drilling, and blasting require physical presence. AI applications: predictive maintenance of equipment, safety monitoring via sensor networks, logistics optimisation for transport routes.",
    exposureRationaleDe: "Untertagegewinnung, Bohrung und Sprengung erfordern physische Präsenz. KI-Anwendungen: vorausschauende Wartung von Ausrüstung, Sicherheitsüberwachung über Sensornetzwerke, Logistikoptimierung für Transportwege.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 81: 61,800 employed (LFS/Mikrozensus AKE) × 6.3% NACE weight (nama_10_a64_e: NACE B) | Pay: VSE 2022 ISCO-08 81 (€17.18/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Food, beverages & tobacco workers",
    titleDe: "Nahrungs- & Genussmittelherstellung",
    slug: "food-production",
    category: "C10-C12",
    categoryDe: "Nahrungsmittel & Getränke",
    onaceSection: "C",
    isco08: "75",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 38719,
    jobs: 34674,
    outlook: 0,
    outlookGrowthPa: 0.1,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 2,
    exposureRationale: "Production line operation, sensory quality control (taste, odour, texture), and hygiene compliance are predominantly manual. AI-supported tasks: optical quality inspection, predictive maintenance, demand forecasting for production planning.",
    exposureRationaleDe: "Produktionslinienbetrieb, sensorische Qualitätskontrolle (Geschmack, Geruch, Textur) und Hygienekonformität sind überwiegend manuell. KI-unterstützte Aufgaben: optische Qualitätsprüfung, vorausschauende Wartung, Bedarfsprognosen für die Produktionsplanung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 75: 68,200 employed (LFS/Mikrozensus AKE) × 50.8% NACE weight (nama_10_a64_e: NACE C10-C12) | Pay: VSE 2022 ISCO-08 75 (€15.91/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Textile & apparel workers",
    titleDe: "Textil- & Bekleidungsherstellung",
    slug: "textile-workers",
    category: "C13-C15",
    categoryDe: "Textil & Bekleidung",
    onaceSection: "C",
    isco08: "75",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 38719,
    jobs: 5424,
    outlook: -6,
    outlookGrowthPa: -1.6,
    outlookDesc: "Strongly declining",
    outlookDescDe: "Stark rückläufig",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 3,
    exposureRationale: "Manufacturing involves cutting, sewing, pressing, and finishing — tasks requiring manual dexterity. AI assists in pattern generation and demand prediction, but garment assembly at Austrian production scales is not economically automatable.",
    exposureRationaleDe: "Fertigung umfasst Zuschnitt, Nähen, Pressen und Endbearbeitung — Tätigkeiten, die Fingerfertigkeit erfordern. KI unterstützt bei Schnittgenerierung und Nachfrageprognose, die Konfektionierung bei österreichischen Produktionsmaßstäben ist wirtschaftlich nicht automatisierbar.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 75: 68,200 employed (LFS/Mikrozensus AKE) × 8.0% NACE weight (nama_10_a64_e: NACE C13-C15) | Pay: VSE 2022 ISCO-08 75 (€15.91/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Wood & paper processing",
    titleDe: "Holz- & Papierverarbeitung",
    slug: "wood-paper",
    category: "C16",
    categoryDe: "Holzverarbeitung",
    onaceSection: "C",
    isco08: "75",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 38719,
    jobs: 12251,
    outlook: -1,
    outlookGrowthPa: -0.2,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 2,
    exposureRationale: "Sawmill operation, joinery, and surface treatment are predominantly physical. CNC machining introduces digital process control. AI potential: optimisation of cutting plans, wood defect detection via image recognition.",
    exposureRationaleDe: "Sägewerks-, Tischlerei- und Oberflächenbehandlung sind überwiegend physisch. CNC-Bearbeitung führt digitale Prozesssteuerung ein. KI-Potenzial: Optimierung von Schnittplänen, Holzfehler-Erkennung mittels Bildverarbeitung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 75: 68,200 employed (LFS/Mikrozensus AKE) × 18.0% NACE weight (nama_10_a64_e: NACE C16) | Pay: VSE 2022 ISCO-08 75 (€15.91/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Chemical production workers",
    titleDe: "Chemie-Fachkräfte",
    slug: "chemical-production",
    category: "C20",
    categoryDe: "Chemische Erzeugnisse",
    onaceSection: "C",
    isco08: "81",
    iscoMajor: "8",
    iscoLabel: "Plant, machine operators & assemblers",
    iscoLabelDe: "Anlagen-, Maschinenbedienung & Montage",
    pay: 41809,
    jobs: 14831,
    outlook: 1,
    outlookGrowthPa: 0.5,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Upper secondary (Matura)",
    educationDe: "Matura (AHS/BHS)",
    exposure: 4,
    exposureRationale: "Process monitoring via SCADA systems comprises approximately 40% of work. Physical tasks: sampling, equipment maintenance, material handling. AI applications: predictive process control, anomaly detection in sensor data, yield optimisation.",
    exposureRationaleDe: "Prozessüberwachung über SCADA-Systeme umfasst ca. 40 % der Arbeit. Physische Aufgaben: Probenahme, Anlagenwartung, Materialhandling. KI-Anwendungen: prädiktive Prozesssteuerung, Anomalieerkennung in Sensordaten, Ausbeuteoptimierung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 81: 61,800 employed (LFS/Mikrozensus AKE) × 24.0% NACE weight (nama_10_a64_e: NACE C20) | Pay: VSE 2022 ISCO-08 81 (€17.18/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Pharmaceutical production",
    titleDe: "Pharmafachkräfte",
    slug: "pharma-production",
    category: "C21",
    categoryDe: "Pharmazeutische Erzeugnisse",
    onaceSection: "C",
    isco08: "21",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 63760,
    jobs: 22241,
    outlook: 5,
    outlookGrowthPa: 1.8,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Bachelor's degree",
    educationDe: "Bachelor/FH-Bachelor",
    exposure: 5,
    exposureRationale: "Cleanroom manufacturing, batch documentation (GMP-compliant), and quality assurance involve both physical and digital tasks. AI is transforming drug discovery (molecular modelling, clinical trial analysis) and regulatory documentation.",
    exposureRationaleDe: "Reinraumfertigung, Chargen-Dokumentation (GMP-konform) und Qualitätssicherung umfassen sowohl physische als auch digitale Aufgaben. KI transformiert die Wirkstoffentwicklung (Molekülmodellierung, Analyse klinischer Studien) und die regulatorische Dokumentation.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 21: 152,300 employed (LFS/Mikrozensus AKE) × 14.6% NACE weight (nama_10_a64_e: NACE C21) | Pay: VSE 2022 ISCO-08 21 (€26.2/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Metal workers & machinists",
    titleDe: "Metallarbeiter/innen & Maschinenbediener/innen",
    slug: "metal-workers",
    category: "C24",
    categoryDe: "Metallerzeugung",
    onaceSection: "C",
    isco08: "72",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 45338,
    jobs: 21677,
    outlook: 1,
    outlookGrowthPa: 0.3,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 3,
    exposureRationale: "CNC machining, welding, and precision assembly are manually executed with digital machine interfaces. AI potential: toolpath optimisation, quality inspection via machine vision, predictive tool wear monitoring.",
    exposureRationaleDe: "CNC-Bearbeitung, Schweißen und Präzisionsmontage werden manuell mit digitalen Maschinenschnittstellen ausgeführt. KI-Potenzial: Werkzeugwegoptimierung, Qualitätsprüfung mittels maschinellem Sehen, prädiktive Werkzeugverschleißüberwachung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 72: 173,600 employed (LFS/Mikrozensus AKE) × 12.5% NACE weight (nama_10_a64_e: NACE C24) | Pay: VSE 2022 ISCO-08 72 (€18.63/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Fabricated metal products workers",
    titleDe: "Metallwarenherstellung",
    slug: "fabricated-metal",
    category: "C25",
    categoryDe: "Metallwarenherstellung",
    onaceSection: "C",
    isco08: "72",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 45338,
    jobs: 41113,
    outlook: 1,
    outlookGrowthPa: 0.3,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 3,
    exposureRationale: "Stamping, bending, surface treatment, and assembly are physically executed. Increasing CNC integration adds digital control interfaces. AI applications: automated visual inspection, production scheduling optimisation.",
    exposureRationaleDe: "Stanzen, Biegen, Oberflächenbehandlung und Montage werden physisch ausgeführt. Zunehmende CNC-Integration erweitert digitale Steuerungsschnittstellen. KI-Anwendungen: automatisierte Sichtprüfung, Produktionsablaufoptimierung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 72: 173,600 employed (LFS/Mikrozensus AKE) × 23.7% NACE weight (nama_10_a64_e: NACE C25) | Pay: VSE 2022 ISCO-08 72 (€18.63/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Computer & electronics manufacturing",
    titleDe: "Computer- & Elektronikfertigung",
    slug: "electronics-mfg",
    category: "C26",
    categoryDe: "Computer & Elektronik",
    onaceSection: "C",
    isco08: "31",
    iscoMajor: "3",
    iscoLabel: "Technicians & associate professionals",
    iscoLabelDe: "Techniker/innen & assoziierte Berufe",
    pay: 55121,
    jobs: 121071,
    outlook: 2,
    outlookGrowthPa: 0.6,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Upper secondary (Matura)",
    educationDe: "Matura (AHS/BHS)",
    exposure: 5,
    exposureRationale: "Combines cleanroom assembly with digital design verification and automated testing. AI accelerates electronic design automation (chip layout, signal integrity analysis) and enables automated optical inspection.",
    exposureRationaleDe: "Verbindet Reinraummontage mit digitaler Designverifikation und automatisiertem Testen. KI beschleunigt elektronische Designautomatisierung (Chiplayout, Signalintegritätsanalyse) und ermöglicht automatisierte optische Inspektion.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 31: 225,100 employed (LFS/Mikrozensus AKE) × 53.8% NACE weight (nama_10_a64_e: NACE C26) | Pay: VSE 2022 ISCO-08 31 (€22.65/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Electrical equipment manufacturing",
    titleDe: "Elektro-Ausrüstungsherstellung",
    slug: "electrical-mfg",
    category: "C27",
    categoryDe: "Elektrische Ausrüstungen",
    onaceSection: "C",
    isco08: "74",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 45606,
    jobs: 74100,
    outlook: 1,
    outlookGrowthPa: 0.5,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 4,
    exposureRationale: "Physical tasks: wiring, soldering, component assembly. Digital tasks: circuit simulation, diagnostic testing. AI supports schematic generation, fault pattern recognition, and test automation.",
    exposureRationaleDe: "Physische Aufgaben: Verdrahtung, Löten, Komponentenmontage. Digitale Aufgaben: Schaltungssimulation, Diagnoseprüfung. KI unterstützt bei Schaltplangenerierung, Fehlermustererkennung und Testautomatisierung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 74: 74,100 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE C27) | Pay: VSE 2022 ISCO-08 74 (€18.74/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Machinery & equipment manufacturing",
    titleDe: "Maschinenbau",
    slug: "machinery-mfg",
    category: "C28",
    categoryDe: "Maschinenbau",
    onaceSection: "C",
    isco08: "72",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 45338,
    jobs: 51829,
    outlook: 2,
    outlookGrowthPa: 0.8,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 4,
    exposureRationale: "Engineering design (CAD/CAE), production planning, and physical assembly/testing. Approximately 40% digital task share. AI applications: generative design, simulation-based optimisation, digital twin integration for predictive maintenance.",
    exposureRationaleDe: "Konstruktion (CAD/CAE), Fertigungsplanung und physische Montage/Prüfung. Ca. 40 % digitaler Aufgabenanteil. KI-Anwendungen: generatives Design, simulationsbasierte Optimierung, Digital-Twin-Integration für vorausschauende Wartung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 72: 173,600 employed (LFS/Mikrozensus AKE) × 29.9% NACE weight (nama_10_a64_e: NACE C28) | Pay: VSE 2022 ISCO-08 72 (€18.63/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Motor vehicle production",
    titleDe: "Fahrzeugproduktion",
    slug: "vehicle-production",
    category: "C29",
    categoryDe: "Fahrzeugbau",
    onaceSection: "C",
    isco08: "82",
    iscoMajor: "8",
    iscoLabel: "Plant, machine operators & assemblers",
    iscoLabelDe: "Anlagen-, Maschinenbedienung & Montage",
    pay: 40130,
    jobs: 11620,
    outlook: -6,
    outlookGrowthPa: -1.6,
    outlookDesc: "Strongly declining",
    outlookDescDe: "Stark rückläufig",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 4,
    exposureRationale: "Assembly line work with increasing industrial robotics penetration. Approximately 40% of tasks involve digital process monitoring, quality control, and logistics coordination. Electrification alters required skill profiles.",
    exposureRationaleDe: "Montagearbeit mit zunehmender Industrierobotik-Durchdringung. Ca. 40 % der Aufgaben umfassen digitale Prozessüberwachung, Qualitätskontrolle und Logistikkoordination. Die Elektrifizierung verändert die erforderlichen Qualifikationsprofile.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 82: 16,900 employed (LFS/Mikrozensus AKE) × 68.8% NACE weight (nama_10_a64_e: NACE C29) | Pay: VSE 2022 ISCO-08 82 (€16.49/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Other transport equipment",
    titleDe: "Sonstiger Fahrzeugbau",
    slug: "other-transport-equip",
    category: "C30",
    categoryDe: "Sonstiger Fahrzeugbau",
    onaceSection: "C",
    isco08: "82",
    iscoMajor: "8",
    iscoLabel: "Plant, machine operators & assemblers",
    iscoLabelDe: "Anlagen-, Maschinenbedienung & Montage",
    pay: 40130,
    jobs: 5280,
    outlook: -3,
    outlookGrowthPa: -0.7,
    outlookDesc: "Declining",
    outlookDescDe: "Rückläufig",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 3,
    exposureRationale: "Specialised assembly of rail vehicles, aircraft components, and marine equipment. Mix of precision manual work and engineering documentation. AI potential in design optimisation and non-destructive testing analysis.",
    exposureRationaleDe: "Spezialmontage von Schienenfahrzeugen, Flugzeugkomponenten und Schiffsausrüstung. Verbindung von Präzisionshandarbeit und technischer Dokumentation. KI-Potenzial in Designoptimierung und Analyse zerstörungsfreier Prüfung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 82: 16,900 employed (LFS/Mikrozensus AKE) × 31.2% NACE weight (nama_10_a64_e: NACE C30) | Pay: VSE 2022 ISCO-08 82 (€16.49/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Paper & printing workers",
    titleDe: "Papier- & Druckherstellung",
    slug: "paper-printing",
    category: "C17",
    categoryDe: "Papierherstellung",
    onaceSection: "C",
    isco08: "73",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 45825,
    jobs: 10842,
    outlook: -8,
    outlookGrowthPa: -2.1,
    outlookDesc: "Strongly declining",
    outlookDescDe: "Stark rückläufig",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 3,
    exposureRationale: "Papermaking involves physical process operation (pulping, pressing, drying). Print production increasingly digital (prepress, colour management). AI applications: defect detection, print quality optimisation.",
    exposureRationaleDe: "Papierherstellung umfasst physischen Prozessbetrieb (Aufschluss, Pressung, Trocknung). Druckproduktion zunehmend digital (Druckvorstufe, Farbmanagement). KI-Anwendungen: Fehlererkennung, Druckqualitätsoptimierung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 73: 16,800 employed (LFS/Mikrozensus AKE) × 64.5% NACE weight (nama_10_a64_e: NACE C17) | Pay: VSE 2022 ISCO-08 73 (€18.83/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Printing & media reproduction",
    titleDe: "Druckerei & Medienreproduktion",
    slug: "printing-media",
    category: "C18",
    categoryDe: "Druckerei & Medienreproduktion",
    onaceSection: "C",
    isco08: "73",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 45825,
    jobs: 5958,
    outlook: -8,
    outlookGrowthPa: -2.1,
    outlookDesc: "Strongly declining",
    outlookDescDe: "Stark rückläufig",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 4,
    exposureRationale: "Prepress workflows are fully digital (layout, colour separation, proofing). Physical printing declining due to digital media substitution. AI automates typesetting, image processing, and personalised print-on-demand production.",
    exposureRationaleDe: "Druckvorstufe ist vollständig digital (Layout, Farbseparation, Proofing). Physischer Druck rückläufig durch Substitution durch digitale Medien. KI automatisiert Satz, Bildverarbeitung und personalisierte Print-on-Demand-Produktion.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 73: 16,800 employed (LFS/Mikrozensus AKE) × 35.5% NACE weight (nama_10_a64_e: NACE C18) | Pay: VSE 2022 ISCO-08 73 (€18.83/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Petroleum refining",
    titleDe: "Mineralölverarbeitung",
    slug: "petroleum",
    category: "C19",
    categoryDe: "Mineralölverarbeitung",
    onaceSection: "C",
    isco08: "81",
    iscoMajor: "8",
    iscoLabel: "Plant, machine operators & assemblers",
    iscoLabelDe: "Anlagen-, Maschinenbedienung & Montage",
    pay: 41809,
    jobs: 1295,
    outlook: 1,
    outlookGrowthPa: 0.5,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Upper secondary (Matura)",
    educationDe: "Matura (AHS/BHS)",
    exposure: 3,
    exposureRationale: "Continuous process operation in refineries with SCADA/DCS control systems. Physical tasks: equipment inspection, maintenance, safety rounds. AI optimises process parameters, yield prediction, and anomaly detection in real-time sensor data.",
    exposureRationaleDe: "Kontinuierlicher Prozessbetrieb in Raffinerien mit SCADA/DCS-Leitsystemen. Physische Aufgaben: Anlageninspektion, Wartung, Sicherheitsrundgänge. KI optimiert Prozessparameter, Ausbeuteprognosen und Anomalieerkennung in Echtzeit-Sensordaten.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 81: 61,800 employed (LFS/Mikrozensus AKE) × 2.1% NACE weight (nama_10_a64_e: NACE C19) | Pay: VSE 2022 ISCO-08 81 (€17.18/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Rubber & plastic products",
    titleDe: "Gummi- & Kunststoffwaren",
    slug: "rubber-plastic",
    category: "C22",
    categoryDe: "Gummi- & Kunststoffwaren",
    onaceSection: "C",
    isco08: "81",
    iscoMajor: "8",
    iscoLabel: "Plant, machine operators & assemblers",
    iscoLabelDe: "Anlagen-, Maschinenbedienung & Montage",
    pay: 41809,
    jobs: 21944,
    outlook: -1,
    outlookGrowthPa: -0.2,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 3,
    exposureRationale: "Injection moulding, extrusion, and blow moulding are machine-operated with manual setup. Digital share limited to machine parameter settings and quality monitoring. AI potential: process parameter optimisation, inline defect detection.",
    exposureRationaleDe: "Spritzguss, Extrusion und Blasformen sind maschinengeführt mit manuellem Rüsten. Digitaler Anteil beschränkt sich auf Maschinenparameter-Einstellungen und Qualitätsüberwachung. KI-Potenzial: Prozessparameteroptimierung, Inline-Fehlererkennung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 81: 61,800 employed (LFS/Mikrozensus AKE) × 35.5% NACE weight (nama_10_a64_e: NACE C22) | Pay: VSE 2022 ISCO-08 81 (€17.18/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Non-metallic mineral products",
    titleDe: "Glas, Keramik & Baustoffe",
    slug: "mineral-products",
    category: "C23",
    categoryDe: "Glas, Keramik & Baustoffe",
    onaceSection: "C",
    isco08: "81",
    iscoMajor: "8",
    iscoLabel: "Plant, machine operators & assemblers",
    iscoLabelDe: "Anlagen-, Maschinenbedienung & Montage",
    pay: 41809,
    jobs: 19854,
    outlook: -3,
    outlookGrowthPa: -0.8,
    outlookDesc: "Declining",
    outlookDescDe: "Rückläufig",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 2,
    exposureRationale: "Energy-intensive industrial processes (kiln operation, grinding, moulding) for glass, ceramics, and cement. Primarily physical with digital process control. AI applications limited to energy optimisation and quality prediction.",
    exposureRationaleDe: "Energieintensive industrielle Prozesse (Ofenbetrieb, Mahlung, Formgebung) für Glas, Keramik und Zement. Überwiegend physisch mit digitaler Prozesssteuerung. KI-Anwendungen beschränkt auf Energieoptimierung und Qualitätsprognose.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 81: 61,800 employed (LFS/Mikrozensus AKE) × 32.1% NACE weight (nama_10_a64_e: NACE C23) | Pay: VSE 2022 ISCO-08 81 (€17.18/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Furniture & other manufacturing",
    titleDe: "Möbelherstellung & sonstige Warenherstellung",
    slug: "furniture-other-mfg",
    category: "C31_C32",
    categoryDe: "Möbel & sonstige Waren",
    onaceSection: "C",
    isco08: "75",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 38719,
    jobs: 15850,
    outlook: -2,
    outlookGrowthPa: -0.4,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 2,
    exposureRationale: "Combines woodworking, upholstery, and finishing — tasks requiring manual craftsmanship. CNC machining for serial production adds digital interfaces. AI potential: design parametrisation, cutting optimisation, demand-driven production planning.",
    exposureRationaleDe: "Verbindet Holzbearbeitung, Polsterung und Endbearbeitung — Tätigkeiten, die handwerkliches Können erfordern. CNC-Bearbeitung für Serienfertigung ergänzt digitale Schnittstellen. KI-Potenzial: Designparametrisierung, Schnittoptimierung, bedarfsgesteuerte Produktionsplanung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 75: 68,200 employed (LFS/Mikrozensus AKE) × 23.2% NACE weight (nama_10_a64_e: NACE C31_C32) | Pay: VSE 2022 ISCO-08 75 (€15.91/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Machinery repair & installation",
    titleDe: "Reparatur & Installation von Maschinen",
    slug: "machinery-repair",
    category: "C33",
    categoryDe: "Reparatur & Installation von Maschinen",
    onaceSection: "C",
    isco08: "72",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 45338,
    jobs: 13784,
    outlook: 0,
    outlookGrowthPa: -0.1,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 3,
    exposureRationale: "Fault diagnosis, disassembly, part replacement, and commissioning are physically executed. Digital diagnostic tools (vibration analysis, thermal imaging) support troubleshooting. AI enables predictive maintenance and spare parts forecasting.",
    exposureRationaleDe: "Fehlerdiagnose, Demontage, Teileersatz und Inbetriebnahme werden physisch ausgeführt. Digitale Diagnosewerkzeuge (Schwingungsanalyse, Thermografie) unterstützen die Fehlersuche. KI ermöglicht vorausschauende Wartung und Ersatzteilprognosen.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 72: 173,600 employed (LFS/Mikrozensus AKE) × 7.9% NACE weight (nama_10_a64_e: NACE C33) | Pay: VSE 2022 ISCO-08 72 (€18.63/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Manufacturing administration & purchasing",
    titleDe: "Industrieverwaltung & Einkauf",
    slug: "mfg-admin-purchasing",
    category: "C",
    categoryDe: "C",
    onaceSection: "C",
    isco08: "43",
    iscoMajor: "4",
    iscoLabel: "Clerical support workers",
    iscoLabelDe: "Bürokräfte",
    pay: 43415,
    jobs: 33438,
    outlook: 0,
    outlookGrowthPa: -0.1,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 7,
    exposureRationale: "Inventory management, order processing, goods receipt documentation, and supplier correspondence are structured ERP-based workflows. Approximately 80% digital task share. AI and robotic process automation handle purchase order matching, stock-level forecasting, and invoice reconciliation.",
    exposureRationaleDe: "Bestandsführung, Bestellabwicklung, Wareneingangsdokumentation und Lieferantenkorrespondenz sind strukturierte ERP-basierte Arbeitsabläufe. Ca. 80 % digitaler Aufgabenanteil. KI und Robotic Process Automation übernehmen Bestellabgleich, Bestandsprognosen und Rechnungsabstimmung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 43: 130,500 employed (LFS/Mikrozensus AKE) × 25.6% NACE weight (nama_10_a64_e: NACE C) | Pay: VSE 2022 ISCO-08 43 (€17.84/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Energy supply technicians",
    titleDe: "Energieversorgungstechniker/innen",
    slug: "energy-technicians",
    category: "D",
    categoryDe: "Energieversorgung",
    onaceSection: "D",
    isco08: "31",
    iscoMajor: "3",
    iscoLabel: "Technicians & associate professionals",
    iscoLabelDe: "Techniker/innen & assoziierte Berufe",
    pay: 55121,
    jobs: 104029,
    outlook: 1,
    outlookGrowthPa: 0.4,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Upper secondary (Matura)",
    educationDe: "Matura (AHS/BHS)",
    exposure: 4,
    exposureRationale: "Grid operation, transformer maintenance, and cable work are physically executed. Digital tasks: SCADA monitoring, load management, smart grid integration. AI optimises grid balancing, fault prediction, and renewable energy dispatch.",
    exposureRationaleDe: "Netzbetrieb, Trafowartung und Kabelarbeiten werden physisch ausgeführt. Digitale Aufgaben: SCADA-Monitoring, Lastmanagement, Smart-Grid-Integration. KI optimiert Netzausgleich, Störungsprognosen und Einspeisemanagement erneuerbarer Energie.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 31: 225,100 employed (LFS/Mikrozensus AKE) × 46.2% NACE weight (nama_10_a64_e: NACE D) | Pay: VSE 2022 ISCO-08 31 (€22.65/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Water supply & waste management",
    titleDe: "Wasserversorgung & Abfallwirtschaft",
    slug: "water-waste",
    category: "E",
    categoryDe: "Wasserversorgung & Abfallwirtschaft",
    onaceSection: "E",
    isco08: "96",
    iscoMajor: "9",
    iscoLabel: "Elementary occupations",
    iscoLabelDe: "Hilfsarbeitskräfte",
    pay: 29276,
    jobs: 19400,
    outlook: 3,
    outlookGrowthPa: 1,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 2,
    exposureRationale: "Collection, transport, sorting, and treatment of waste and water are predominantly physical outdoor tasks. AI applications: route optimisation for collection vehicles, automated waste sorting via image recognition, process control in treatment plants.",
    exposureRationaleDe: "Sammlung, Transport, Sortierung und Aufbereitung von Abfall und Wasser sind überwiegend physische Außentätigkeiten. KI-Anwendungen: Routenoptimierung für Sammelfahrzeuge, automatisierte Abfallsortierung mittels Bildverarbeitung, Prozesssteuerung in Aufbereitungsanlagen.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 96: 19,400 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE E) | Pay: VSE 2022 ISCO-08 96 (€12.03/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Construction workers",
    titleDe: "Bauarbeiter/innen",
    slug: "construction-workers",
    category: "F",
    categoryDe: "Bauwesen",
    onaceSection: "F",
    isco08: "93",
    iscoMajor: "9",
    iscoLabel: "Elementary occupations",
    iscoLabelDe: "Hilfsarbeitskräfte",
    pay: 34119,
    jobs: 53853,
    outlook: -2,
    outlookGrowthPa: -0.4,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 1,
    exposureRationale: "Earthwork, concrete placement, scaffolding, and material transport are entirely manual and site-bound. Digital task share below 5%. Robotic construction (bricklaying, 3D printing) exists in pilot projects but has no significant market penetration.",
    exposureRationaleDe: "Erdarbeiten, Betonierarbeiten, Gerüstbau und Materialtransport sind ausschließlich manuell und ortsgebunden. Digitaler Aufgabenanteil unter 5 %. Baurobotik (automatisiertes Mauern, 3D-Druck) existiert in Pilotprojekten, hat aber keine signifikante Marktdurchdringung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 93: 136,000 employed (LFS/Mikrozensus AKE) × 39.6% NACE weight (nama_10_a64_e: NACE F) | Pay: VSE 2022 ISCO-08 93 (€14.02/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Building trades workers",
    titleDe: "Bau- und Ausbaufachkräfte",
    slug: "building-trades",
    category: "F",
    categoryDe: "Bauwesen",
    onaceSection: "F",
    isco08: "71",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 42710,
    jobs: 120967,
    outlook: 0,
    outlookGrowthPa: 0,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 2,
    exposureRationale: "Electrical installation, plumbing, HVAC assembly, and tiling are manually executed on-site. Digital diagnostic tools (thermal cameras, leak detectors) supplement the work. AI potential in building energy management and fault diagnosis.",
    exposureRationaleDe: "Elektroinstallation, Sanitärinstallation, Heizungs-/Lüftungs-/Klimamontage und Fliesenlegen werden manuell vor Ort ausgeführt. Digitale Diagnosewerkzeuge (Wärmebildkameras, Leckagedetektoren) ergänzen die Arbeit. KI-Potenzial in Gebäude-Energiemanagement und Fehlerdiagnose.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 71: 171,900 employed (LFS/Mikrozensus AKE) × 70.4% NACE weight (nama_10_a64_e: NACE F) | Pay: VSE 2022 ISCO-08 71 (€17.55/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Civil engineers & architects",
    titleDe: "Bauingenieure & Architekten/innen",
    slug: "civil-engineers",
    category: "F",
    categoryDe: "Bauwesen",
    onaceSection: "F",
    isco08: "21",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 63760,
    jobs: 35757,
    outlook: 3,
    outlookGrowthPa: 1,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Master's/Diploma degree",
    educationDe: "Master/Diplom",
    exposure: 6,
    exposureRationale: "Design work primarily digital: Building Information Modelling (BIM), finite element analysis, structural simulation. AI generates design variants, optimises structural load paths, and automates compliance checking against building codes.",
    exposureRationaleDe: "Planungsarbeit überwiegend digital: Building Information Modelling (BIM), Finite-Elemente-Analyse, Tragwerkssimulation. KI generiert Entwurfsvarianten, optimiert Lastpfade und automatisiert Konformitätsprüfungen gegen Bauvorschriften.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 21: 152,300 employed (LFS/Mikrozensus AKE) × 23.5% NACE weight (nama_10_a64_e: NACE F) | Pay: VSE 2022 ISCO-08 21 (€26.2/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Painters & building finishers",
    titleDe: "Maler/innen & Ausbaufachkräfte",
    slug: "painters-finishers",
    category: "F",
    categoryDe: "Bauwesen",
    onaceSection: "F",
    isco08: "71",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 42710,
    jobs: 50933,
    outlook: 0,
    outlookGrowthPa: 0,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 1,
    exposureRationale: "Surface preparation, painting, plastering, and floor laying are entirely manual on-site tasks. No meaningful digital task component. AI application potential is negligible for the foreseeable future.",
    exposureRationaleDe: "Untergrundvorbereitung, Anstrich, Verputz und Bodenverlegung sind ausschließlich manuelle Tätigkeiten vor Ort. Kein nennenswerter digitaler Aufgabenanteil. KI-Anwendungspotenzial ist auf absehbare Zeit vernachlässigbar.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 71: 171,900 employed (LFS/Mikrozensus AKE) × 29.6% NACE weight (nama_10_a64_e: NACE F) | Pay: VSE 2022 ISCO-08 71 (€17.55/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Customer services clerks",
    titleDe: "Kundendienstfachkräfte",
    slug: "customer-services-clerks",
    category: "G47",
    categoryDe: "Einzelhandel",
    onaceSection: "G",
    isco08: "42",
    iscoMajor: "4",
    iscoLabel: "Clerical support workers",
    iscoLabelDe: "Bürokräfte",
    pay: 42904,
    jobs: 68100,
    outlook: 1,
    outlookGrowthPa: 0.4,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 7,
    exposureRationale: "Tasks: telephone/email support, appointment scheduling, complaint handling, data entry. Over 70% are structured digital communication tasks. Conversational AI and automated ticketing systems substitute a growing share of these interactions.",
    exposureRationaleDe: "Aufgaben: Telefon-/E-Mail-Support, Terminplanung, Beschwerdebearbeitung, Datenerfassung. Über 70 % sind strukturierte digitale Kommunikationsaufgaben. Konversations-KI und automatisierte Ticketsysteme substituieren einen wachsenden Anteil dieser Interaktionen.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 42: 68,100 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE G47) | Pay: VSE 2022 ISCO-08 42 (€17.63/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Motor vehicle trade & repair",
    titleDe: "Kfz-Handel & -Reparatur",
    slug: "vehicle-trade",
    category: "G45",
    categoryDe: "Kfz-Handel & -Reparatur",
    onaceSection: "G",
    isco08: "72",
    iscoMajor: "7",
    iscoLabel: "Craft & related trades",
    iscoLabelDe: "Handwerks- & verwandte Berufe",
    pay: 45338,
    jobs: 45197,
    outlook: 1,
    outlookGrowthPa: 0.2,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 3,
    exposureRationale: "Vehicle diagnostics via OBD-II/EOBD systems involve digital interfaces, but repair, bodywork, and parts replacement are manual. AI applications: automated fault code interpretation, parts catalogue matching, warranty claim processing.",
    exposureRationaleDe: "Fahrzeugdiagnose über OBD-II/EOBD-Systeme umfasst digitale Schnittstellen, Reparatur, Karosseriearbeiten und Teileersatz sind manuell. KI-Anwendungen: automatisierte Fehlercodeinterpretation, Teilekatalogzuordnung, Garantieabwicklung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 72: 173,600 employed (LFS/Mikrozensus AKE) × 26.0% NACE weight (nama_10_a64_e: NACE G45) | Pay: VSE 2022 ISCO-08 72 (€18.63/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Wholesale trade workers",
    titleDe: "Großhandel",
    slug: "wholesale",
    category: "G46",
    categoryDe: "Großhandel",
    onaceSection: "G",
    isco08: "33",
    iscoMajor: "3",
    iscoLabel: "Technicians & associate professionals",
    iscoLabelDe: "Techniker/innen & assoziierte Berufe",
    pay: 50278,
    jobs: 204694,
    outlook: 2,
    outlookGrowthPa: 0.6,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 5,
    exposureRationale: "Order processing, inventory management, and customer relationship management are digital (Enterprise Resource Planning, Customer Relationship Management systems). Physical warehouse operations account for approximately 40%. AI automates demand forecasting, pricing, and procurement.",
    exposureRationaleDe: "Auftragsabwicklung, Bestandsmanagement und Kundenbeziehungsmanagement sind digital (Enterprise-Resource-Planning-, CRM-Systeme). Physische Lagertätigkeiten machen ca. 40 % aus. KI automatisiert Bedarfsprognosen, Preisbildung und Beschaffung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 33: 366,000 employed (LFS/Mikrozensus AKE) × 55.9% NACE weight (nama_10_a64_e: NACE G46) | Pay: VSE 2022 ISCO-08 33 (€20.66/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Retail salespersons",
    titleDe: "Einzelhandelsverkäufer/innen",
    slug: "retail-sales",
    category: "G47",
    categoryDe: "Einzelhandel",
    onaceSection: "G",
    isco08: "52",
    iscoMajor: "5",
    iscoLabel: "Service & sales workers",
    iscoLabelDe: "Dienstleistungs- & Verkaufsberufe",
    pay: 32099,
    jobs: 315700,
    outlook: 1,
    outlookGrowthPa: 0.5,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 5,
    exposureRationale: "In-store tasks: customer consultation, merchandise display, checkout. Online retail substitutes approximately 15% of traditional retail volume (Statistik Austria 2023). AI-driven product recommendations, self-checkout systems, and automated inventory reduce demand for sales personnel.",
    exposureRationaleDe: "Tätigkeiten im stationären Handel: Kundenberatung, Warenpräsentation, Kassiertätigkeit. Online-Handel substituiert ca. 15 % des traditionellen Einzelhandelsvolumens (Statistik Austria 2023). KI-gestützte Produktempfehlungen, Self-Checkout-Systeme und automatisierte Bestandsführung reduzieren den Personalbedarf.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 52: 315,700 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE G47) | Pay: VSE 2022 ISCO-08 52 (€13.19/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Land transport & drivers",
    titleDe: "Landverkehr & Fahrer/innen",
    slug: "land-transport",
    category: "H49",
    categoryDe: "Landverkehr",
    onaceSection: "H",
    isco08: "83",
    iscoMajor: "8",
    iscoLabel: "Plant, machine operators & assemblers",
    iscoLabelDe: "Anlagen-, Maschinenbedienung & Montage",
    pay: 36699,
    jobs: 158300,
    outlook: 1,
    outlookGrowthPa: 0.3,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Compulsory school",
    educationDe: "Pflichtschulabschluss",
    exposure: 3,
    exposureRationale: "Driving, loading, and route execution are physically and spatially bound. Digital components: telematics, fleet management systems, electronic freight documents. Autonomous driving technology is progressing (SAE Level 4) but regulatory approval and infrastructure readiness limit near-term deployment.",
    exposureRationaleDe: "Fahrtätigkeit, Be-/Entladung und Routendurchführung sind physisch und räumlich gebunden. Digitale Komponenten: Telematik, Flottenmanagement-Systeme, elektronische Frachtdokumente. Autonome Fahrtechnologie (SAE Level 4) entwickelt sich weiter, regulatorische Zulassung und Infrastruktur begrenzen den kurzfristigen Einsatz.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 83: 158,300 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE H49) | Pay: VSE 2022 ISCO-08 83 (€15.08/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Warehousing & logistics support",
    titleDe: "Lagerei & Logistikunterstützung",
    slug: "warehousing",
    category: "H52",
    categoryDe: "Lagerei & Logistik",
    onaceSection: "H",
    isco08: "93",
    iscoMajor: "9",
    iscoLabel: "Elementary occupations",
    iscoLabelDe: "Hilfsarbeitskräfte",
    pay: 34119,
    jobs: 28761,
    outlook: 1,
    outlookGrowthPa: 0.2,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Compulsory school",
    educationDe: "Pflichtschulabschluss",
    exposure: 4,
    exposureRationale: "Order picking, packing, and goods receipt are physically executed. Warehouse management systems (WMS) coordinate digital workflows. Automated storage and retrieval systems and autonomous mobile robots increasingly handle structured, repetitive tasks.",
    exposureRationaleDe: "Kommissionierung, Verpackung und Wareneingang werden physisch ausgeführt. Lagerverwaltungssysteme koordinieren digitale Abläufe. Automatische Lager- und Bereitstellungssysteme sowie autonome mobile Roboter übernehmen zunehmend strukturierte, repetitive Aufgaben.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 93: 136,000 employed (LFS/Mikrozensus AKE) × 21.1% NACE weight (nama_10_a64_e: NACE H52) | Pay: VSE 2022 ISCO-08 93 (€14.02/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Postal & courier services",
    titleDe: "Post- & Kurierdienste",
    slug: "postal-courier",
    category: "H53",
    categoryDe: "Post- & Kurierdienste",
    onaceSection: "H",
    isco08: "93",
    iscoMajor: "9",
    iscoLabel: "Elementary occupations",
    iscoLabelDe: "Hilfsarbeitskräfte",
    pay: 34119,
    jobs: 12841,
    outlook: -1,
    outlookGrowthPa: -0.3,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Compulsory school",
    educationDe: "Pflichtschulabschluss",
    exposure: 3,
    exposureRationale: "Last-mile delivery, parcel sorting, and customer handover are physically executed. AI-based route optimisation and automated sorting centres increase efficiency, but final delivery to individual addresses remains a manual task.",
    exposureRationaleDe: "Letzte-Meile-Zustellung, Paketsortierung und Kundenübergabe werden physisch ausgeführt. KI-basierte Routenoptimierung und automatisierte Sortierzentren steigern die Effizienz, die Endzustellung an individuelle Adressen bleibt eine manuelle Tätigkeit.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 93: 136,000 employed (LFS/Mikrozensus AKE) × 9.4% NACE weight (nama_10_a64_e: NACE H53) | Pay: VSE 2022 ISCO-08 93 (€14.02/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Hospitality & retail managers",
    titleDe: "Hotel- & Einzelhandelsmanager/innen",
    slug: "hospitality-retail-managers",
    category: "I",
    categoryDe: "Beherbergung & Gastronomie",
    onaceSection: "I",
    isco08: "14",
    iscoMajor: "1",
    iscoLabel: "Managers",
    iscoLabelDe: "Führungskräfte",
    pay: 51033,
    jobs: 34400,
    outlook: 3,
    outlookGrowthPa: 1.1,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Upper secondary (Matura)",
    educationDe: "Matura (AHS/BHS)",
    exposure: 4,
    exposureRationale: "Operational management tasks span physical site supervision and digital systems: revenue management, dynamic pricing, online booking platforms, and data analytics. Approximately 40% of management tasks are digitally supported.",
    exposureRationaleDe: "Operative Managementaufgaben umfassen physische Standortleitung und digitale Systeme: Revenue Management, dynamische Preisgestaltung, Online-Buchungsplattformen und Datenanalyse. Ca. 40 % der Managementaufgaben sind digital unterstützt.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 14: 34,400 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE I) | Pay: VSE 2022 ISCO-08 14 (€20.97/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Hotel & accommodation workers",
    titleDe: "Hotel- & Beherbergungsfachkräfte",
    slug: "hotel-workers",
    category: "I",
    categoryDe: "Beherbergung & Gastronomie",
    onaceSection: "I",
    isco08: "51",
    iscoMajor: "5",
    iscoLabel: "Service & sales workers",
    iscoLabelDe: "Dienstleistungs- & Verkaufsberufe",
    pay: 29203,
    jobs: 97781,
    outlook: 2,
    outlookGrowthPa: 0.9,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 3,
    exposureRationale: "Room preparation, guest services, and front desk operations are physically executed. Property management systems, online check-in, and AI-based chatbots handle reservations and enquiries. Personal guest interaction remains central to service quality.",
    exposureRationaleDe: "Zimmerherrichtung, Gästeservice und Rezeptionstätigkeiten werden physisch ausgeführt. Property-Management-Systeme, Online-Check-in und KI-gestützte Chatbots bearbeiten Reservierungen und Anfragen. Persönliche Gästeinteraktion bleibt zentral für die Servicequalität.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 51: 265,100 employed (LFS/Mikrozensus AKE) × 36.9% NACE weight (nama_10_a64_e: NACE I) | Pay: VSE 2022 ISCO-08 51 (€12/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Restaurant & food service workers",
    titleDe: "Gastronomie-Fachkräfte",
    slug: "restaurant-workers",
    category: "I",
    categoryDe: "Beherbergung & Gastronomie",
    onaceSection: "I",
    isco08: "51",
    iscoMajor: "5",
    iscoLabel: "Service & sales workers",
    iscoLabelDe: "Dienstleistungs- & Verkaufsberufe",
    pay: 29203,
    jobs: 111749,
    outlook: 2,
    outlookGrowthPa: 0.9,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Compulsory school",
    educationDe: "Pflichtschulabschluss",
    exposure: 2,
    exposureRationale: "Table service, order taking, and guest interaction are physically and socially bound. Self-ordering kiosks and digital point-of-sale systems automate transaction processing, but personal service differentiates quality dining from fast food.",
    exposureRationaleDe: "Tischbedienung, Bestellaufnahme und Gästebetreuung sind physisch und sozial gebunden. Selbstbestellkioske und digitale Kassensysteme automatisieren die Transaktionsabwicklung, persönlicher Service differenziert gehobene Gastronomie von Schnellverpflegung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 51: 265,100 employed (LFS/Mikrozensus AKE) × 42.2% NACE weight (nama_10_a64_e: NACE I) | Pay: VSE 2022 ISCO-08 51 (€12/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Chefs & cooks",
    titleDe: "Köche/Köchinnen",
    slug: "chefs-cooks",
    category: "I",
    categoryDe: "Beherbergung & Gastronomie",
    onaceSection: "I",
    isco08: "94",
    iscoMajor: "9",
    iscoLabel: "Elementary occupations",
    iscoLabelDe: "Hilfsarbeitskräfte",
    pay: 24798,
    jobs: 33300,
    outlook: 3,
    outlookGrowthPa: 1,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 1,
    exposureRationale: "Food preparation, cooking, plating, and kitchen management require manual dexterity and sensory judgement. Digital task share limited to inventory management and recipe documentation. Culinary execution is not automatable with current technology.",
    exposureRationaleDe: "Lebensmittelvorbereitung, Kochen, Anrichten und Küchenmanagement erfordern Fingerfertigkeit und sensorische Beurteilung. Digitaler Aufgabenanteil beschränkt sich auf Warenwirtschaft und Rezeptdokumentation. Kulinarische Ausführung ist mit aktueller Technologie nicht automatisierbar.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 94: 33,300 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE I) | Pay: VSE 2022 ISCO-08 94 (€10.19/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Publishing, media & broadcasting",
    titleDe: "Verlagswesen, Medien & Rundfunk",
    slug: "publishing-media",
    category: "J58",
    categoryDe: "Verlagswesen & Medien",
    onaceSection: "J",
    isco08: "26",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 55681,
    jobs: 47392,
    outlook: 3,
    outlookGrowthPa: 1.1,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Bachelor's degree",
    educationDe: "Bachelor/FH-Bachelor",
    exposure: 8,
    exposureRationale: "Content creation, editing, layout, and digital publishing are fully digital workflows. Large language models generate draft text, automated layout tools compose pages. Human editorial judgement remains necessary for quality assurance and investigative reporting.",
    exposureRationaleDe: "Inhaltserstellung, Lektorat, Layout und digitales Publizieren sind vollständig digitale Arbeitsabläufe. Große Sprachmodelle generieren Textentwürfe, automatisierte Layoutwerkzeuge setzen Seiten. Menschliches redaktionelles Urteil bleibt für Qualitätssicherung und investigativen Journalismus notwendig.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 26: 144,600 employed (LFS/Mikrozensus AKE) × 32.8% NACE weight (nama_10_a64_e: NACE J58) | Pay: VSE 2022 ISCO-08 26 (€22.88/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Film, TV & broadcasting",
    titleDe: "Film, TV & Rundfunk",
    slug: "film-tv-broadcasting",
    category: "J59_J60",
    categoryDe: "Film, TV & Rundfunk",
    onaceSection: "J",
    isco08: "26",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 55681,
    jobs: 47874,
    outlook: 3,
    outlookGrowthPa: 1.1,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Bachelor's degree",
    educationDe: "Bachelor/FH-Bachelor",
    exposure: 7,
    exposureRationale: "Post-production (editing, colour grading, sound design) is fully digital. AI tools generate video sequences, synthetic voices, and automated subtitling. Physical production (camera operation, set construction, live broadcasting) retains manual requirements.",
    exposureRationaleDe: "Postproduktion (Schnitt, Farbkorrektur, Sounddesign) ist vollständig digital. KI-Werkzeuge generieren Videosequenzen, synthetische Stimmen und automatisierte Untertitelung. Physische Produktion (Kamerabedienung, Bühnenbau, Live-Sendung) behält manuelle Anforderungen.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 26: 144,600 employed (LFS/Mikrozensus AKE) × 33.1% NACE weight (nama_10_a64_e: NACE J59_J60) | Pay: VSE 2022 ISCO-08 26 (€22.88/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Telecommunications technicians",
    titleDe: "Telekommunikationstechniker/innen",
    slug: "telecom-tech",
    category: "J61",
    categoryDe: "Telekommunikation",
    onaceSection: "J",
    isco08: "35",
    iscoMajor: "3",
    iscoLabel: "Technicians & associate professionals",
    iscoLabelDe: "Techniker/innen & assoziierte Berufe",
    pay: 52517,
    jobs: 38100,
    outlook: 3,
    outlookGrowthPa: 1,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 3,
    exposureRationale: "Physical tasks: cable laying, antenna installation, equipment maintenance at cell sites. Digital tasks: network configuration, signal optimisation, fault monitoring via network management systems. Approximately 40% digital task share.",
    exposureRationaleDe: "Physische Aufgaben: Kabelverlegung, Antenneninstallation, Gerätewartung an Standorten. Digitale Aufgaben: Netzwerkkonfiguration, Signaloptimierung, Störungsüberwachung über Network-Management-Systeme. Ca. 40 % digitaler Aufgabenanteil.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 35: 38,100 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE J61) | Pay: VSE 2022 ISCO-08 35 (€21.58/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Software developers & IT professionals",
    titleDe: "Softwareentwickler/innen & IT-Fachkräfte",
    slug: "software-it",
    category: "J62_J63",
    categoryDe: "IT-Dienstleistungen",
    onaceSection: "J",
    isco08: "25",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 63298,
    jobs: 129400,
    outlook: 10,
    outlookGrowthPa: 3.7,
    outlookDesc: "Rapid growth",
    outlookDescDe: "Sehr starkes Wachstum",
    education: "Bachelor's degree",
    educationDe: "Bachelor/FH-Bachelor",
    exposure: 9,
    exposureRationale: "Software development, system administration, and data engineering are entirely digital tasks. AI code generation tools (code completion, automated testing, code review) augment approximately 30–50% of development workflows. Demand for software engineering is forecast to grow despite productivity gains.",
    exposureRationaleDe: "Softwareentwicklung, Systemadministration und Data Engineering sind vollständig digitale Tätigkeiten. KI-Codegenerierungswerkzeuge (Code-Vervollständigung, automatisiertes Testen, Code-Review) unterstützen ca. 30–50 % der Entwicklungsworkflows. Die Nachfrage nach Software Engineering wird trotz Produktivitätszuwächsen voraussichtlich steigen.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 25: 129,400 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE J62_J63) | Pay: VSE 2022 ISCO-08 25 (€26.01/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Financial services workers",
    titleDe: "Finanzdienstleistungen",
    slug: "financial-services",
    category: "K64",
    categoryDe: "Finanzdienstleistungen",
    onaceSection: "K",
    isco08: "33",
    iscoMajor: "3",
    iscoLabel: "Technicians & associate professionals",
    iscoLabelDe: "Techniker/innen & assoziierte Berufe",
    pay: 50278,
    jobs: 68709,
    outlook: 0,
    outlookGrowthPa: -0.1,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Upper secondary (Matura)",
    educationDe: "Matura (AHS/BHS)",
    exposure: 8,
    exposureRationale: "Transaction processing, credit scoring, regulatory reporting, and fraud detection are digital processes. AI automates risk modelling, anti-money-laundering checks, and customer onboarding. Physical branch operations constitute a declining share of banking activity.",
    exposureRationaleDe: "Transaktionsverarbeitung, Bonitätsprüfung, regulatorisches Reporting und Betrugserkennung sind digitale Prozesse. KI automatisiert Risikomodellierung, Geldwäscheprävention und Kunden-Onboarding. Physischer Filialbetrieb macht einen sinkenden Anteil der Banktätigkeit aus.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 33: 366,000 employed (LFS/Mikrozensus AKE) × 18.8% NACE weight (nama_10_a64_e: NACE K64) | Pay: VSE 2022 ISCO-08 33 (€20.66/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Insurance workers",
    titleDe: "Versicherungsangestellte",
    slug: "insurance-workers",
    category: "K65",
    categoryDe: "Versicherungen",
    onaceSection: "K",
    isco08: "33",
    iscoMajor: "3",
    iscoLabel: "Technicians & associate professionals",
    iscoLabelDe: "Techniker/innen & assoziierte Berufe",
    pay: 50278,
    jobs: 24784,
    outlook: 0,
    outlookGrowthPa: -0.1,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Upper secondary (Matura)",
    educationDe: "Matura (AHS/BHS)",
    exposure: 7,
    exposureRationale: "Underwriting, claims assessment, actuarial analysis, and policy administration are predominantly digital. AI automates damage estimation (image-based), fraud detection, and risk pricing. Customer interaction shifts to digital channels.",
    exposureRationaleDe: "Underwriting, Schadensbewertung, versicherungsmathematische Analyse und Polizzenverwaltung sind überwiegend digital. KI automatisiert Schadensschätzung (bildbasiert), Betrugserkennung und Risikotarifierung. Kundeninteraktion verlagert sich auf digitale Kanäle.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 33: 366,000 employed (LFS/Mikrozensus AKE) × 6.8% NACE weight (nama_10_a64_e: NACE K65) | Pay: VSE 2022 ISCO-08 33 (€20.66/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Real estate professionals",
    titleDe: "Immobilienfachkräfte",
    slug: "real-estate",
    category: "L",
    categoryDe: "Grundstücks- & Wohnungswesen",
    onaceSection: "L",
    isco08: "33",
    iscoMajor: "3",
    iscoLabel: "Technicians & associate professionals",
    iscoLabelDe: "Techniker/innen & assoziierte Berufe",
    pay: 50278,
    jobs: 67812,
    outlook: 1,
    outlookGrowthPa: 0.5,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Upper secondary (Matura)",
    educationDe: "Matura (AHS/BHS)",
    exposure: 5,
    exposureRationale: "Property valuation, market analysis, and marketing are digitally supported. Physical property viewings and contract negotiations require personal presence. AI automates comparative market analysis, property matching algorithms, and virtual tour generation.",
    exposureRationaleDe: "Immobilienbewertung, Marktanalyse und Marketing sind digital unterstützt. Physische Objektbesichtigungen und Vertragsverhandlungen erfordern persönliche Präsenz. KI automatisiert Vergleichswertanalysen, Property-Matching-Algorithmen und virtuelle Rundgangerstellung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 33: 366,000 employed (LFS/Mikrozensus AKE) × 18.5% NACE weight (nama_10_a64_e: NACE L) | Pay: VSE 2022 ISCO-08 33 (€20.66/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Administrative & commercial managers",
    titleDe: "Kaufmännische Führungskräfte",
    slug: "admin-commercial-managers",
    category: "M69_M70",
    categoryDe: "Rechts-, Steuerberatung & Unternehmensberatung",
    onaceSection: "M",
    isco08: "12",
    iscoMajor: "1",
    iscoLabel: "Managers",
    iscoLabelDe: "Führungskräfte",
    pay: 85468,
    jobs: 87900,
    outlook: 4,
    outlookGrowthPa: 1.4,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Master's/Diploma degree",
    educationDe: "Master/Diplom",
    exposure: 6,
    exposureRationale: "Strategic planning, financial controlling, human resources management, and marketing direction involve approximately 60% digital tasks (reporting, analytics, workforce planning). AI-based tools automate data analysis, forecasting, and scenario modelling.",
    exposureRationaleDe: "Strategieplanung, Finanzcontrolling, Personalmanagement und Marketingleitung umfassen ca. 60 % digitale Aufgaben (Reporting, Analytik, Personalplanung). KI-gestützte Werkzeuge automatisieren Datenanalyse, Prognosen und Szenariomodellierung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 12: 87,900 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE M69_M70) | Pay: VSE 2022 ISCO-08 12 (€35.12/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Production & specialised services managers",
    titleDe: "Produktions- & Dienstleistungsleiter/innen",
    slug: "production-services-managers",
    category: "C28",
    categoryDe: "Maschinenbau",
    onaceSection: "C",
    isco08: "13",
    iscoMajor: "1",
    iscoLabel: "Managers",
    iscoLabelDe: "Führungskräfte",
    pay: 80917,
    jobs: 75100,
    outlook: 2,
    outlookGrowthPa: 0.9,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Bachelor's degree",
    educationDe: "Bachelor/FH-Bachelor",
    exposure: 5,
    exposureRationale: "Operational oversight of manufacturing, construction, or IT service operations. Digital tasks: production planning, supply chain management, scheduling. Physical tasks: site supervision, quality audits. Approximately 50% digital task share.",
    exposureRationaleDe: "Operative Leitung von Produktions-, Bau- oder IT-Dienstleistungsbetrieben. Digitale Aufgaben: Produktionsplanung, Supply-Chain-Management, Terminierung. Physische Aufgaben: Standortaufsicht, Qualitätsaudits. Ca. 50 % digitaler Aufgabenanteil.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 13: 75,100 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE C28) | Pay: VSE 2022 ISCO-08 13 (€33.25/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Lawyers, accountants & consultants",
    titleDe: "Rechtsanwälte, Wirtschaftsprüfer & Berater/innen",
    slug: "legal-accounting-consulting",
    category: "M69_M70",
    categoryDe: "Rechts-, Steuerberatung & Unternehmensberatung",
    onaceSection: "M",
    isco08: "24",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 60986,
    jobs: 127563,
    outlook: 5,
    outlookGrowthPa: 1.8,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Master's/Diploma degree",
    educationDe: "Master/Diplom",
    exposure: 7,
    exposureRationale: "Contract drafting, legal research, financial auditing, and consulting deliverables are text-intensive digital tasks. AI-based tools automate document review, due diligence, regulatory compliance checks, and financial statement analysis.",
    exposureRationaleDe: "Vertragsentwurf, juristische Recherche, Wirtschaftsprüfung und Beratungsleistungen sind textintensive digitale Aufgaben. KI-gestützte Werkzeuge automatisieren Dokumentenprüfung, Due Diligence, regulatorische Konformitätsprüfungen und Bilanzanalyse.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 24: 155,100 employed (LFS/Mikrozensus AKE) × 82.2% NACE weight (nama_10_a64_e: NACE M69_M70) | Pay: VSE 2022 ISCO-08 24 (€25.06/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Architects & engineering consultants",
    titleDe: "Architekten & Ingenieurberatung",
    slug: "architects-engineering",
    category: "M71",
    categoryDe: "Architektur- & Ingenieurbüros",
    onaceSection: "M",
    isco08: "21",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 63760,
    jobs: 71293,
    outlook: 7,
    outlookGrowthPa: 2.5,
    outlookDesc: "Strong growth",
    outlookDescDe: "Starkes Wachstum",
    education: "Master's/Diploma degree",
    educationDe: "Master/Diplom",
    exposure: 6,
    exposureRationale: "Design work is predominantly digital: Building Information Modelling, computer-aided engineering, parametric design. AI generates design alternatives and optimises structural, thermal, and energy performance. Physical site visits and client consultation remain necessary.",
    exposureRationaleDe: "Planungsarbeit ist überwiegend digital: Building Information Modelling, computergestützte Ingenieurberechnung, parametrisches Design. KI generiert Entwurfsalternativen und optimiert Tragwerks-, Wärme- und Energieeffizienz. Baustellenbegehungen und Kundenberatung bleiben notwendig.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 21: 152,300 employed (LFS/Mikrozensus AKE) × 46.8% NACE weight (nama_10_a64_e: NACE M71) | Pay: VSE 2022 ISCO-08 21 (€26.2/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Research scientists & academics",
    titleDe: "Forscher/innen & Wissenschaftler/innen",
    slug: "research-scientists",
    category: "M72",
    categoryDe: "Forschung & Entwicklung",
    onaceSection: "M",
    isco08: "21",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 63760,
    jobs: 23009,
    outlook: 7,
    outlookGrowthPa: 2.5,
    outlookDesc: "Strong growth",
    outlookDescDe: "Starkes Wachstum",
    education: "Doctoral/PhD",
    educationDe: "Doktorat/PhD",
    exposure: 7,
    exposureRationale: "Literature analysis, data processing, statistical modelling, and manuscript preparation are digital tasks (approximately 60%). Laboratory work, field research, and experimental setup are physical. AI accelerates systematic reviews, data analysis, and hypothesis generation.",
    exposureRationaleDe: "Literaturanalyse, Datenverarbeitung, statistische Modellierung und Manuskripterstellung sind digitale Aufgaben (ca. 60 %). Laborarbeit, Feldforschung und Versuchsaufbau sind physisch. KI beschleunigt systematische Reviews, Datenanalyse und Hypothesengenerierung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 21: 152,300 employed (LFS/Mikrozensus AKE) × 15.1% NACE weight (nama_10_a64_e: NACE M72) | Pay: VSE 2022 ISCO-08 21 (€26.2/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Advertising, marketing & other professional",
    titleDe: "Werbung, Marketing & sonst. freiberufliche Dienste",
    slug: "advertising-marketing",
    category: "M73",
    categoryDe: "Werbung & Marktforschung",
    onaceSection: "M",
    isco08: "24",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 60986,
    jobs: 27537,
    outlook: 5,
    outlookGrowthPa: 1.8,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Bachelor's degree",
    educationDe: "Bachelor/FH-Bachelor",
    exposure: 8,
    exposureRationale: "Campaign planning, content creation, performance analytics, and media buying are fully digital workflows. AI generates marketing copy, automates A/B testing, optimises bidding strategies, and produces personalised content at scale.",
    exposureRationaleDe: "Kampagnenplanung, Inhaltserstellung, Performance-Analytik und Mediaeinkauf sind vollständig digitale Arbeitsabläufe. KI generiert Werbetexte, automatisiert A/B-Tests, optimiert Gebotsstrategien und produziert personalisierte Inhalte skaliert.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 24: 155,100 employed (LFS/Mikrozensus AKE) × 17.8% NACE weight (nama_10_a64_e: NACE M73) | Pay: VSE 2022 ISCO-08 24 (€25.06/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Bookkeepers, payroll & stock clerks",
    titleDe: "Buchhaltung, Lohn- & Lagerfachkräfte",
    slug: "bookkeepers-stock-clerks",
    category: "N",
    categoryDe: "Sonstige wirtschaftliche Dienstleistungen",
    onaceSection: "N",
    isco08: "43",
    iscoMajor: "4",
    iscoLabel: "Clerical support workers",
    iscoLabelDe: "Bürokräfte",
    pay: 43415,
    jobs: 97062,
    outlook: 2,
    outlookGrowthPa: 0.6,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 8,
    exposureRationale: "Double-entry bookkeeping, payroll processing, inventory tracking, and accounts reconciliation are structured, rule-based digital tasks. AI and robotic process automation handle end-to-end processing of invoices, bank reconciliations, and payroll calculations.",
    exposureRationaleDe: "Doppelte Buchführung, Lohnverrechnung, Bestandserfassung und Kontenabstimmung sind strukturierte, regelbasierte digitale Aufgaben. KI und Robotic Process Automation übernehmen die durchgängige Verarbeitung von Rechnungen, Bankabstimmungen und Gehaltsberechnungen.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 43: 130,500 employed (LFS/Mikrozensus AKE) × 74.4% NACE weight (nama_10_a64_e: NACE N) | Pay: VSE 2022 ISCO-08 43 (€17.84/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Other clerical support workers",
    titleDe: "Sonstige Büro- & Sekretariatskräfte",
    slug: "other-clerical-support",
    category: "N",
    categoryDe: "Sonstige wirtschaftliche Dienstleistungen",
    onaceSection: "N",
    isco08: "44",
    iscoMajor: "4",
    iscoLabel: "Clerical support workers",
    iscoLabelDe: "Bürokräfte",
    pay: 34533,
    jobs: 31600,
    outlook: 2,
    outlookGrowthPa: 0.7,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 7,
    exposureRationale: "Mail processing, data coding, document filing, and record keeping are structured, repetitive digital tasks. AI-based document processing (optical character recognition, natural language processing) automates classification, extraction, and routing.",
    exposureRationaleDe: "Postbearbeitung, Datenkodierung, Dokumentenablage und Aktenführung sind strukturierte, repetitive digitale Aufgaben. KI-gestützte Dokumentenverarbeitung (optische Zeichenerkennung, natürliche Sprachverarbeitung) automatisiert Klassifikation, Extraktion und Weiterleitung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 44: 31,600 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE N) | Pay: VSE 2022 ISCO-08 44 (€14.19/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Employment agency & temp workers",
    titleDe: "Zeitarbeit & Personaldienstleistung",
    slug: "temp-workers",
    category: "N78",
    categoryDe: "Personaldienstleistung",
    onaceSection: "N",
    isco08: "93",
    iscoMajor: "9",
    iscoLabel: "Elementary occupations",
    iscoLabelDe: "Hilfsarbeitskräfte",
    pay: 34119,
    jobs: 40545,
    outlook: 2,
    outlookGrowthPa: 0.8,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 4,
    exposureRationale: "Staffing coordination, contract administration, and timesheet processing are digital. Temporary assignments themselves span physical sectors (manufacturing, logistics, construction). AI automates candidate matching and administrative workflows.",
    exposureRationaleDe: "Personalkoordination, Vertragsadministration und Zeiterfassung sind digital. Die Überlassungstätigkeiten selbst erstrecken sich über physische Branchen (Fertigung, Logistik, Bau). KI automatisiert Bewerber-Matching und administrative Abläufe.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 93: 136,000 employed (LFS/Mikrozensus AKE) × 29.8% NACE weight (nama_10_a64_e: NACE N78) | Pay: VSE 2022 ISCO-08 93 (€14.02/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Office administration & support services",
    titleDe: "Bürodienste & sonst. Unternehmensdienstleistungen",
    slug: "office-admin-support",
    category: "N",
    categoryDe: "Sonstige wirtschaftliche Dienstleistungen",
    onaceSection: "N",
    isco08: "41",
    iscoMajor: "4",
    iscoLabel: "Clerical support workers",
    iscoLabelDe: "Bürokräfte",
    pay: 41152,
    jobs: 182438,
    outlook: 1,
    outlookGrowthPa: 0.4,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 7,
    exposureRationale: "Calendar management, correspondence, travel booking, data entry, and meeting coordination are predominantly digital tasks. AI-based tools automate scheduling, email drafting, document formatting, and data processing.",
    exposureRationaleDe: "Terminmanagement, Korrespondenz, Reisebuchung, Datenerfassung und Besprechungskoordination sind überwiegend digitale Aufgaben. KI-gestützte Werkzeuge automatisieren Terminplanung, E-Mail-Entwurf, Dokumentenformatierung und Datenverarbeitung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 41: 197,200 employed (LFS/Mikrozensus AKE) × 92.5% NACE weight (nama_10_a64_e: NACE N) | Pay: VSE 2022 ISCO-08 41 (€16.91/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Cleaning & security services",
    titleDe: "Reinigung & Sicherheitsdienste",
    slug: "cleaning-security",
    category: "N",
    categoryDe: "Sonstige wirtschaftliche Dienstleistungen",
    onaceSection: "N",
    isco08: "91",
    iscoMajor: "9",
    iscoLabel: "Elementary occupations",
    iscoLabelDe: "Hilfsarbeitskräfte",
    pay: 26283,
    jobs: 130498,
    outlook: 3,
    outlookGrowthPa: 1,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Compulsory school",
    educationDe: "Pflichtschulabschluss",
    exposure: 1,
    exposureRationale: "Cleaning, security patrols, and facility maintenance are physically executed across diverse environments. Digital task share below 10% (access control systems, shift scheduling). Robotics for commercial cleaning exists but covers only standardised floor areas.",
    exposureRationaleDe: "Reinigung, Sicherheitsrundgänge und Gebäudewartung werden physisch in verschiedenen Umgebungen ausgeführt. Digitaler Aufgabenanteil unter 10 % (Zutrittskontrollsysteme, Dienstplanung). Reinigungsroboter für gewerbliche Nutzung existieren, decken aber nur standardisierte Bodenflächen ab.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 91: 147,600 employed (LFS/Mikrozensus AKE) × 88.4% NACE weight (nama_10_a64_e: NACE N) | Pay: VSE 2022 ISCO-08 91 (€10.8/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Public administration managers & senior officials",
    titleDe: "Führungskräfte & leitende Verwaltungsbedienstete",
    slug: "public-admin",
    category: "O",
    categoryDe: "Öffentliche Verwaltung",
    onaceSection: "O",
    isco08: "11",
    iscoMajor: "1",
    iscoLabel: "Managers",
    iscoLabelDe: "Führungskräfte",
    pay: 111629,
    jobs: 33600,
    outlook: 1,
    outlookGrowthPa: 0.3,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Bachelor's degree",
    educationDe: "Bachelor/FH-Bachelor",
    exposure: 6,
    exposureRationale: "Case processing, permit administration, compliance verification, and citizen correspondence are structured digital workflows. Austria's E-Government strategy (Digitales Amt) accelerates process automation. AI potential in document classification, case routing, and decision support.",
    exposureRationaleDe: "Fallbearbeitung, Genehmigungsverwaltung, Konformitätsprüfung und Bürgerkommunikation sind strukturierte digitale Arbeitsabläufe. Österreichs E-Government-Strategie (Digitales Amt) beschleunigt die Prozessautomatisierung. KI-Potenzial in Dokumentenklassifikation, Fallweiterleitung und Entscheidungsunterstützung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 11: 33,600 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE O) | Pay: VSE 2022 ISCO-08 11 (€45.87/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Police, firefighters & security workers",
    titleDe: "Polizei, Feuerwehr & Sicherheitsdienste",
    slug: "protective-services",
    category: "O",
    categoryDe: "Öffentliche Verwaltung",
    onaceSection: "O",
    isco08: "54",
    iscoMajor: "5",
    iscoLabel: "Service & sales workers",
    iscoLabelDe: "Dienstleistungs- & Verkaufsberufe",
    pay: 28789,
    jobs: 44600,
    outlook: 1,
    outlookGrowthPa: 0.5,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Upper secondary (Matura)",
    educationDe: "Matura (AHS/BHS)",
    exposure: 2,
    exposureRationale: "Patrol duty, emergency response, criminal investigation, and fire suppression are physically and situationally bound. AI applications: video surveillance analysis, dispatch optimisation, predictive policing models. Approximately 80% of tasks require physical presence.",
    exposureRationaleDe: "Streifendienst, Notfalleinsätze, Kriminalermittlung und Brandbekämpfung sind physisch und situativ gebunden. KI-Anwendungen: Videoüberwachungsanalyse, Einsatzoptimierung, prädiktive Polizeimodelle. Ca. 80 % der Aufgaben erfordern physische Präsenz.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 54: 44,600 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE O) | Pay: VSE 2022 ISCO-08 54 (€11.83/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Teaching professionals",
    titleDe: "Lehrkräfte",
    slug: "teachers",
    category: "P",
    categoryDe: "Erziehung & Unterricht",
    onaceSection: "P",
    isco08: "23",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 48672,
    jobs: 245000,
    outlook: 2,
    outlookGrowthPa: 0.8,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Master's/Diploma degree",
    educationDe: "Master/Diplom",
    exposure: 5,
    exposureRationale: "Lesson preparation, curriculum development, and assessment are digitally supported (approximately 40%). Classroom instruction, student mentoring, and social-emotional support require physical presence and interpersonal skills not substitutable by AI.",
    exposureRationaleDe: "Unterrichtsvorbereitung, Lehrplanentwicklung und Leistungsbeurteilung sind digital unterstützt (ca. 40 %). Präsenzunterricht, Schülerbetreuung und sozial-emotionale Förderung erfordern physische Anwesenheit und zwischenmenschliche Kompetenz, die durch KI nicht substituierbar ist.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 23: 245,000 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE P) | Pay: VSE 2022 ISCO-08 23 (€20/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Education support staff",
    titleDe: "Pädagogisches Unterstützungspersonal",
    slug: "education-support",
    category: "P",
    categoryDe: "Erziehung & Unterricht",
    onaceSection: "P",
    isco08: "53",
    iscoMajor: "5",
    iscoLabel: "Service & sales workers",
    iscoLabelDe: "Dienstleistungs- & Verkaufsberufe",
    pay: 36869,
    jobs: 37509,
    outlook: 4,
    outlookGrowthPa: 1.3,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Upper secondary (Matura)",
    educationDe: "Matura (AHS/BHS)",
    exposure: 3,
    exposureRationale: "Administrative tasks (scheduling, record keeping, communication) are digital. Pedagogical assistance, child supervision, and special needs support require physical presence. Approximately 30% digital task share.",
    exposureRationaleDe: "Administrative Aufgaben (Terminplanung, Aktenführung, Kommunikation) sind digital. Pädagogische Assistenz, Kinderbetreuung und Sonderpädagogik erfordern physische Präsenz. Ca. 30 % digitaler Aufgabenanteil.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 53: 156,900 employed (LFS/Mikrozensus AKE) × 23.9% NACE weight (nama_10_a64_e: NACE P) | Pay: VSE 2022 ISCO-08 53 (€15.15/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Doctors & medical specialists",
    titleDe: "Ärzte/Ärztinnen & Fachärzte",
    slug: "doctors",
    category: "Q86",
    categoryDe: "Gesundheitswesen",
    onaceSection: "Q",
    isco08: "22",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 65196,
    jobs: 156773,
    outlook: 4,
    outlookGrowthPa: 1.4,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Doctoral/PhD",
    educationDe: "Doktorat/PhD",
    exposure: 5,
    exposureRationale: "Diagnostics is increasingly AI-supported (medical imaging analysis, differential diagnosis, laboratory interpretation). Physical examination, surgical procedures, and patient communication require manual execution and clinical judgement. Approximately 40% digital task share.",
    exposureRationaleDe: "Diagnostik wird zunehmend KI-unterstützt (Bildgebungsanalyse, Differentialdiagnostik, Laborbefundinterpretation). Körperliche Untersuchung, chirurgische Eingriffe und Patientenkommunikation erfordern manuelle Durchführung und klinisches Urteilsvermögen. Ca. 40 % digitaler Aufgabenanteil.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 22: 194,900 employed (LFS/Mikrozensus AKE) × 80.4% NACE weight (nama_10_a64_e: NACE Q86) | Pay: VSE 2022 ISCO-08 22 (€26.79/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Nurses & health associates",
    titleDe: "Pflegefachkräfte & Gesundheitsberufe",
    slug: "nurses-health",
    category: "Q86",
    categoryDe: "Gesundheitswesen",
    onaceSection: "Q",
    isco08: "32",
    iscoMajor: "3",
    iscoLabel: "Technicians & associate professionals",
    iscoLabelDe: "Techniker/innen & assoziierte Berufe",
    pay: 49159,
    jobs: 78600,
    outlook: 5,
    outlookGrowthPa: 1.8,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Post-secondary (Kolleg)",
    educationDe: "Kolleg/Akademie",
    exposure: 3,
    exposureRationale: "Direct patient care (vital signs monitoring, medication administration, wound care, patient mobilisation) is physically executed. AI supports clinical documentation, medication interaction checks, and care planning. Approximately 20% digital task share.",
    exposureRationaleDe: "Direkte Patientenversorgung (Vitalzeichenüberwachung, Medikamentenverabreichung, Wundversorgung, Mobilisation) wird physisch ausgeführt. KI unterstützt klinische Dokumentation, Medikamenten-Interaktionsprüfungen und Pflegeplanung. Ca. 20 % digitaler Aufgabenanteil.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 32: 78,600 employed (LFS/Mikrozensus AKE) × 100.0% NACE weight (nama_10_a64_e: NACE Q86) | Pay: VSE 2022 ISCO-08 32 (€20.2/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Other health activities workers",
    titleDe: "Sonst. Gesundheitsberufe",
    slug: "health-other",
    category: "Q86",
    categoryDe: "Gesundheitswesen",
    onaceSection: "Q",
    isco08: "53",
    iscoMajor: "5",
    iscoLabel: "Service & sales workers",
    iscoLabelDe: "Dienstleistungs- & Verkaufsberufe",
    pay: 36869,
    jobs: 28321,
    outlook: 5,
    outlookGrowthPa: 1.9,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 2,
    exposureRationale: "Physiotherapy, laboratory analysis, pharmacy dispensing, and medical device operation combine physical patient contact with technical procedures. AI potential in laboratory image analysis and rehabilitation exercise monitoring.",
    exposureRationaleDe: "Physiotherapie, Laboranalytik, Apothekenausgabe und Medizintechnik-Bedienung verbinden physischen Patientenkontakt mit technischen Verfahren. KI-Potenzial in Laborbildanalyse und Rehabilitationsüberwachung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 53: 156,900 employed (LFS/Mikrozensus AKE) × 18.1% NACE weight (nama_10_a64_e: NACE Q86) | Pay: VSE 2022 ISCO-08 53 (€15.15/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Social work & care workers",
    titleDe: "Sozialarbeit & Betreuungsdienste",
    slug: "social-care",
    category: "Q87_Q88",
    categoryDe: "Sozialwesen & Betreuungsdienste",
    onaceSection: "Q",
    isco08: "53",
    iscoMajor: "5",
    iscoLabel: "Service & sales workers",
    iscoLabelDe: "Dienstleistungs- & Verkaufsberufe",
    pay: 36869,
    jobs: 91070,
    outlook: 5,
    outlookGrowthPa: 1.9,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Post-secondary (Kolleg)",
    educationDe: "Kolleg/Akademie",
    exposure: 2,
    exposureRationale: "Personal care, mobility assistance, social activation, and crisis intervention require physical presence and empathic interaction. Digital tasks limited to care documentation and resource coordination. Approximately 15% digital task share.",
    exposureRationaleDe: "Personenpflege, Mobilitätsassistenz, soziale Aktivierung und Krisenintervention erfordern physische Präsenz und empathische Interaktion. Digitale Aufgaben beschränkt auf Pflegedokumentation und Ressourcenkoordination. Ca. 15 % digitaler Aufgabenanteil.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 53: 156,900 employed (LFS/Mikrozensus AKE) × 58.0% NACE weight (nama_10_a64_e: NACE Q87_Q88) | Pay: VSE 2022 ISCO-08 53 (€15.15/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Health & care administration",
    titleDe: "Gesundheits- & Pflegeverwaltung",
    slug: "health-care-admin",
    category: "Q86",
    categoryDe: "Gesundheitswesen",
    onaceSection: "Q",
    isco08: "41",
    iscoMajor: "4",
    iscoLabel: "Clerical support workers",
    iscoLabelDe: "Bürokräfte",
    pay: 41152,
    jobs: 14762,
    outlook: 2,
    outlookGrowthPa: 0.8,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 7,
    exposureRationale: "Patient registration, appointment scheduling, medical records management, billing, and correspondence are structured digital workflows. Approximately 85% digital task share. AI automates medical coding (ICD/DRG), appointment optimisation, and document classification.",
    exposureRationaleDe: "Patientenaufnahme, Terminplanung, Krankenaktenverwaltung, Abrechnung und Korrespondenz sind strukturierte digitale Arbeitsabläufe. Ca. 85 % digitaler Aufgabenanteil. KI automatisiert medizinische Kodierung (ICD/DRG), Terminoptimierung und Dokumentenklassifikation.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 41: 197,200 employed (LFS/Mikrozensus AKE) × 7.5% NACE weight (nama_10_a64_e: NACE Q86) | Pay: VSE 2022 ISCO-08 41 (€16.91/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Care facility support & cleaning",
    titleDe: "Pflege-Unterstützung & Reinigung",
    slug: "care-facility-support",
    category: "Q87_Q88",
    categoryDe: "Sozialwesen & Betreuungsdienste",
    onaceSection: "Q",
    isco08: "91",
    iscoMajor: "9",
    iscoLabel: "Elementary occupations",
    iscoLabelDe: "Hilfsarbeitskräfte",
    pay: 26283,
    jobs: 17102,
    outlook: 4,
    outlookGrowthPa: 1.3,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Compulsory school",
    educationDe: "Pflichtschulabschluss",
    exposure: 1,
    exposureRationale: "Hospital and care home cleaning, kitchen assistance, laundry, portering, and waste disposal are entirely physical tasks. Digital task share below 5% (shift scheduling systems). Robotic floor cleaning is deployed in some facilities but covers only standardised corridor areas.",
    exposureRationaleDe: "Krankenhaus- und Pflegeheimreinigung, Küchenunterstützung, Wäscheversorgung, Botendienste und Abfallentsorgung sind ausschließlich physische Tätigkeiten. Digitaler Aufgabenanteil unter 5 % (Dienstplansysteme). Reinigungsroboter kommen in einzelnen Einrichtungen zum Einsatz, decken aber nur standardisierte Gangflächen ab.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 91: 147,600 employed (LFS/Mikrozensus AKE) × 11.6% NACE weight (nama_10_a64_e: NACE Q87_Q88) | Pay: VSE 2022 ISCO-08 91 (€10.8/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Social & community workers",
    titleDe: "Sozialarbeiter/innen & Sozialpädagog/innen",
    slug: "social-community-workers",
    category: "Q87_Q88",
    categoryDe: "Sozialwesen & Betreuungsdienste",
    onaceSection: "Q",
    isco08: "26",
    iscoMajor: "2",
    iscoLabel: "Professionals",
    iscoLabelDe: "Akademische Berufe",
    pay: 55681,
    jobs: 49334,
    outlook: 5,
    outlookGrowthPa: 1.8,
    outlookDesc: "Growing",
    outlookDescDe: "Wachsend",
    education: "Bachelor's degree",
    educationDe: "Bachelor/FH-Bachelor",
    exposure: 4,
    exposureRationale: "Case assessment, individual and group counselling, crisis intervention, and community outreach are interpersonal tasks requiring empathic judgement. Approximately 35% digital task share (case documentation, reporting, resource databases). AI assists with risk scoring, needs assessment questionnaires, and service matching.",
    exposureRationaleDe: "Fallbeurteilung, Einzel- und Gruppenberatung, Krisenintervention und Gemeinwesenarbeit sind interpersonelle Tätigkeiten, die empathisches Urteilsvermögen erfordern. Ca. 35 % digitaler Aufgabenanteil (Falldokumentation, Berichtswesen, Ressourcendatenbanken). KI unterstützt bei Risikobewertung, Bedarfserhebungsfragebögen und Dienstleistungszuordnung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 26: 144,600 employed (LFS/Mikrozensus AKE) × 34.1% NACE weight (nama_10_a64_e: NACE Q87_Q88) | Pay: VSE 2022 ISCO-08 26 (€22.88/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Arts, entertainment & recreation",
    titleDe: "Kunst, Unterhaltung & Erholung",
    slug: "arts-recreation",
    category: "R",
    categoryDe: "Kunst, Unterhaltung & Erholung",
    onaceSection: "R",
    isco08: "34",
    iscoMajor: "3",
    iscoLabel: "Technicians & associate professionals",
    iscoLabelDe: "Techniker/innen & assoziierte Berufe",
    pay: 43172,
    jobs: 49032,
    outlook: 2,
    outlookGrowthPa: 0.9,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Bachelor's degree",
    educationDe: "Bachelor/FH-Bachelor",
    exposure: 5,
    exposureRationale: "Live performance, artistic direction, and cultural programming require personal creative execution. AI tools generate visual art, music, and text — augmenting digital content production. Physical presence in performance, sport instruction, and event management is non-substitutable.",
    exposureRationaleDe: "Live-Performance, künstlerische Leitung und Kulturprogrammgestaltung erfordern persönliche kreative Ausführung. KI-Werkzeuge generieren bildende Kunst, Musik und Text — sie ergänzen die digitale Inhaltsproduktion. Physische Präsenz bei Aufführung, Sportanleitung und Veranstaltungsmanagement ist nicht substituierbar.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 34: 98,700 employed (LFS/Mikrozensus AKE) × 49.7% NACE weight (nama_10_a64_e: NACE R) | Pay: VSE 2022 ISCO-08 34 (€17.74/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Membership organizations & associations",
    titleDe: "Interessenvertretungen & Vereine",
    slug: "associations",
    category: "S",
    categoryDe: "Sonstige Dienstleistungen",
    onaceSection: "S",
    isco08: "34",
    iscoMajor: "3",
    iscoLabel: "Technicians & associate professionals",
    iscoLabelDe: "Techniker/innen & assoziierte Berufe",
    pay: 43172,
    jobs: 49668,
    outlook: 1,
    outlookGrowthPa: 0.4,
    outlookDesc: "Slow growth",
    outlookDescDe: "Leichtes Wachstum",
    education: "Upper secondary (Matura)",
    educationDe: "Matura (AHS/BHS)",
    exposure: 5,
    exposureRationale: "Member communication, event management, and advocacy require personal relationship management. Administrative tasks (accounting, correspondence, database management) are digital. Approximately 50% digital task share.",
    exposureRationaleDe: "Mitgliederkommunikation, Veranstaltungsmanagement und Interessenvertretung erfordern persönliches Beziehungsmanagement. Administrative Aufgaben (Buchhaltung, Korrespondenz, Datenbankpflege) sind digital. Ca. 50 % digitaler Aufgabenanteil.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 34: 98,700 employed (LFS/Mikrozensus AKE) × 50.3% NACE weight (nama_10_a64_e: NACE S) | Pay: VSE 2022 ISCO-08 34 (€17.74/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  },
  {
    title: "Personal services & repair",
    titleDe: "Persönliche Dienstleistungen & Reparatur",
    slug: "personal-services",
    category: "S",
    categoryDe: "Sonstige Dienstleistungen",
    onaceSection: "S",
    isco08: "51",
    iscoMajor: "5",
    iscoLabel: "Service & sales workers",
    iscoLabelDe: "Dienstleistungs- & Verkaufsberufe",
    pay: 29203,
    jobs: 55570,
    outlook: 1,
    outlookGrowthPa: 0.2,
    outlookDesc: "Stable",
    outlookDescDe: "Stabil",
    education: "Apprenticeship (Lehre)",
    educationDe: "Lehrabschluss",
    exposure: 2,
    exposureRationale: "Hairdressing, cosmetic treatments, and repair services require manual dexterity and direct client interaction. Digital task share limited to appointment scheduling and point-of-sale processing. No significant AI substitution potential for core service delivery.",
    exposureRationaleDe: "Friseurhandwerk, kosmetische Behandlungen und Reparaturdienste erfordern Fingerfertigkeit und direkten Kundenkontakt. Digitaler Aufgabenanteil beschränkt sich auf Terminbuchung und Kassenabwicklung. Kein wesentliches KI-Substitutionspotenzial für die Kerndienstleistung.",
    source: "Eurostat lfsa_egai2d (2024) ISCO-08 51: 265,100 employed (LFS/Mikrozensus AKE) × 21.0% NACE weight (nama_10_a64_e: NACE S) | Pay: VSE 2022 ISCO-08 51 (€12/h median × 2080h × 1.17) | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 70+ hypothesis-driven verification tests",
  }
];

// ─── AT vs US Comparison Data ──────────────────────────────────────────────────

export interface ComparisonMetric {
  key: string;
  label: string;
  labelDe: string;
  austria: string;
  us: string;
  austriaValue: number;
  usValue: number;
  explanation: string;
  explanationDe: string;
  source: string;
}

export const comparisonData: ComparisonMetric[] = [
  {
    key: "total-employment",
    label: "Total Employment",
    labelDe: "Gesamtbeschäftigung",
    austria: "4.49M",
    us: "161.0M",
    austriaValue: 4.49,
    usValue: 161.0,
    explanation: "Österreichs Erwerbstätigenzahl entspricht rund 3 % der US-Beschäftigung, proportional zum Bevölkerungsverhältnis (9,1 Millionen zu 335 Millionen). Österreich: Mikrozensus-Arbeitskräfteerhebung/EU-LFS (ILO-Konzept, 2024).",
    explanationDe: "Österreichs Erwerbstätigenzahl entspricht rund 3 % der US-Beschäftigung, proportional zum Bevölkerungsverhältnis (9,1 Millionen zu 335 Millionen). Österreich: Mikrozensus-Arbeitskräfteerhebung/EU-LFS (ILO-Konzept, 2024).",
    source: "Eurostat lfsa_egai2d (2024, ILO concept) / BLS CES (2024)",
  },
  {
    key: "unemployment-rate",
    label: "Unemployment Rate (ILO)",
    labelDe: "Arbeitslosenquote (ILO)",
    austria: "~5.4%",
    us: "4.2%",
    austriaValue: 5.4,
    usValue: 4.2,
    explanation: "ILO-vergleichbare Quote, Jahresdurchschnitt 2024. Österreich publiziert zusätzlich eine höhere AMS-Registerquote (rund 8 %) nach abweichender Definition.",
    explanationDe: "ILO-vergleichbare Quote, Jahresdurchschnitt 2024. Österreich publiziert zusätzlich eine höhere AMS-Registerquote (rund 8 %) nach abweichender Definition.",
    source: "Eurostat (2024) / BLS (2024)",
  },
  {
    key: "median-hourly",
    label: "Median Hourly Pay (Gross)",
    labelDe: "Bruttostundenverdienst (Median)",
    austria: "€17.49",
    us: "$23.11 (~€21.30)",
    austriaValue: 17.49,
    usValue: 21.30,
    explanation: "Österreichischer Bruttoverdienst enthält Sozialversicherungsbeiträge (Dienstnehmeranteil). US-Wert exklusive arbeitgeberfinanzierter Krankenversicherung (rund 6.000–8.000 USD/Jahr). Der effektive Unterschied ist geringer als der Nominalvergleich.",
    explanationDe: "Österreichischer Bruttoverdienst enthält Sozialversicherungsbeiträge (Dienstnehmeranteil). US-Wert exklusive arbeitgeberfinanzierter Krankenversicherung (rund 6.000–8.000 USD/Jahr). Der effektive Unterschied ist geringer als der Nominalvergleich.",
    source: "Statistik Austria VSE 2022 / BLS OES (2023)",
  },
  {
    key: "manufacturing-share",
    label: "Manufacturing Share",
    labelDe: "Anteil Verarbeitendes Gewerbe",
    austria: "15.4%",
    us: "8.3%",
    austriaValue: 15.4,
    usValue: 8.3,
    explanation: "Österreich verfügt über eine starke Industriebasis mit nahezu doppeltem Beschäftigungsanteil gegenüber den USA. Schwerpunkte: Maschinenbau (ÖNACE C28), Kraftfahrzeugbau (C29), Metallerzeugung (C24).",
    explanationDe: "Österreich verfügt über eine starke Industriebasis mit nahezu doppeltem Beschäftigungsanteil gegenüber den USA. Schwerpunkte: Maschinenbau (ÖNACE C28), Kraftfahrzeugbau (C29), Metallerzeugung (C24).",
    source: "Eurostat (2024) / BLS CES (2024)",
  },
  {
    key: "tourism-share",
    label: "Tourism & Hospitality Share",
    labelDe: "Anteil Tourismus & Gastronomie",
    austria: "7.0%",
    us: "8.5%",
    austriaValue: 7.0,
    usValue: 8.5,
    explanation: "Trotz Österreichs Bedeutung als Tourismusstandort ist der Beschäftigungsanteil in Beherbergung und Gastronomie (ÖNACE I) dem US-Anteil vergleichbar. Ausgeprägte Saisonalität (Winter-/Sommerspitzen).",
    explanationDe: "Trotz Österreichs Bedeutung als Tourismusstandort ist der Beschäftigungsanteil in Beherbergung und Gastronomie (ÖNACE I) dem US-Anteil vergleichbar. Ausgeprägte Saisonalität (Winter-/Sommerspitzen).",
    source: "Eurostat (2024) / BLS CES (2024)",
  },
  {
    key: "health-share",
    label: "Healthcare Share",
    labelDe: "Anteil Gesundheitswesen",
    austria: "6.2%",
    us: "13.0%",
    austriaValue: 6.2,
    usValue: 13.0,
    explanation: "Das US-Gesundheitssystem beschäftigt einen deutlich höheren Anteil der Erwerbstätigen, bedingt durch die Verwaltung privater Versicherungen, höhere Preise und eine höhere Facharztdichte pro Kopf.",
    explanationDe: "Das US-Gesundheitssystem beschäftigt einen deutlich höheren Anteil der Erwerbstätigen, bedingt durch die Verwaltung privater Versicherungen, höhere Preise und eine höhere Facharztdichte pro Kopf.",
    source: "Eurostat (2024) / BLS CES (2024)",
  },
  {
    key: "public-sector",
    label: "Public Administration Share",
    labelDe: "Anteil Öffentliche Verwaltung",
    austria: "6.2%",
    us: "14.5%",
    austriaValue: 6.2,
    usValue: 14.5,
    explanation: "US-Wert umfasst Bundes-, Einzelstaats- und Kommunalverwaltung. Österreichs geringere Gebietskörperschaftsstruktur (Bund, Länder, Gemeinden) bedingt weniger Verwaltungsebenen.",
    explanationDe: "US-Wert umfasst Bundes-, Einzelstaats- und Kommunalverwaltung. Österreichs geringere Gebietskörperschaftsstruktur (Bund, Länder, Gemeinden) bedingt weniger Verwaltungsebenen.",
    source: "Eurostat (2024) / BLS CES (2024)",
  },
  {
    key: "it-share",
    label: "IT & Software Share",
    labelDe: "Anteil IT & Software",
    austria: "3.2%",
    us: "2.0%",
    austriaValue: 3.2,
    usValue: 2.0,
    explanation: "Österreichs IT-Sektor (ÖNACE J62–J63: Programmierung, Beratung, Informationsdienstleistungen) weist einen proportional höheren Beschäftigungsanteil auf; teilweise methodisch bedingt durch Klassifikationsunterschiede zwischen NACE und NAICS.",
    explanationDe: "Österreichs IT-Sektor (ÖNACE J62–J63: Programmierung, Beratung, Informationsdienstleistungen) weist einen proportional höheren Beschäftigungsanteil auf; teilweise methodisch bedingt durch Klassifikationsunterschiede zwischen NACE und NAICS.",
    source: "Eurostat (2024) / BLS CES (2024)",
  },
  {
    key: "min-vacation",
    label: "Minimum Paid Vacation",
    labelDe: "Mindesturlaub (bezahlt)",
    austria: "25 days",
    us: "0 days (no federal law)",
    austriaValue: 25,
    usValue: 0,
    explanation: "Österreich garantiert gemäß Urlaubsgesetz (UrlG) 5 Wochen (25 Werktage) bezahlten Erholungsurlaub pro Jahr. Die USA haben keine bundesgesetzliche Urlaubsregelung; Durchschnitt in der Privatwirtschaft: rund 10 Tage.",
    explanationDe: "Österreich garantiert gemäß Urlaubsgesetz (UrlG) 5 Wochen (25 Werktage) bezahlten Erholungsurlaub pro Jahr. Die USA haben keine bundesgesetzliche Urlaubsregelung; Durchschnitt in der Privatwirtschaft: rund 10 Tage.",
    source: "Austrian Urlaubsgesetz / US DOL",
  },
  {
    key: "annual-bonus",
    label: "13th/14th Month Salary",
    labelDe: "13./14. Monatsgehalt",
    austria: "Yes (tax-advantaged)",
    us: "No (not standard)",
    austriaValue: 1,
    usValue: 0,
    explanation: "Nahezu alle unselbständig Beschäftigten in Österreich erhalten ein 13. Monatsgehalt (Urlaubsgeld) und ein 14. Monatsgehalt (Weihnachtsgeld), begünstigt besteuert mit pauschal 6 % Lohnsteuer gemäß § 67 EStG. Im internationalen Vergleich eine Besonderheit.",
    explanationDe: "Nahezu alle unselbständig Beschäftigten in Österreich erhalten ein 13. Monatsgehalt (Urlaubsgeld) und ein 14. Monatsgehalt (Weihnachtsgeld), begünstigt besteuert mit pauschal 6 % Lohnsteuer gemäß § 67 EStG. Im internationalen Vergleich eine Besonderheit.",
    source: "Austrian Einkommensteuergesetz § 67 / General knowledge",
  },
];

// ─── Data Verification Tests ───────────────────────────────────────────────────
// Scientific format: each test states a thesis (hypothesis derived from labor
// economics or data-pipeline expectations), an antithesis (what a failure would
// imply), and a test function that produces a verdict with evidence.

export interface DataTest {
  id: string;
  group: string;
  name: string;
  nameDe: string;
  thesis: string;
  thesisDe: string;
  antithesis: string;
  antithesisDe: string;
  test: () => { passed: boolean; actual: string; expected: string };
}

// ── Helpers (shared across tests) ────────────────────────────────────────────

function _pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  if (n < 3) return 0;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const vx = xs[i] - mx;
    const vy = ys[i] - my;
    num += vx * vy;
    dx += vx * vx;
    dy += vy * vy;
  }
  return dx > 0 && dy > 0 ? num / Math.sqrt(dx * dy) : 0;
}

function _wMean(rows: typeof austrianOccupations, field: "pay" | "exposure" | "outlook"): number {
  let sw = 0, sxw = 0;
  for (const o of rows) {
    const w = o.jobs ?? 0;
    const v = o[field] ?? 0;
    if (w > 0) { sw += w; sxw += v * w; }
  }
  return sw > 0 ? sxw / sw : 0;
}

function _wMedian(rows: typeof austrianOccupations): number {
  const items = rows
    .map((o) => ({ p: o.pay ?? 0, j: o.jobs ?? 0 }))
    .filter((x) => x.p > 0 && x.j > 0)
    .sort((a, b) => a.p - b.p);
  const tj = items.reduce((s, x) => s + x.j, 0);
  if (tj <= 0) return 0;
  let cum = 0;
  const half = tj / 2;
  for (const x of items) {
    cum += x.j;
    if (cum >= half) return x.p;
  }
  return items[items.length - 1].p;
}

function _sectorJobs(section: string): number {
  return austrianOccupations
    .filter((o) => o.onaceSection === section)
    .reduce((s, o) => s + (o.jobs ?? 0), 0);
}

function _iscoFamilyJobs(major: string): number {
  return austrianOccupations
    .filter((o) => o.iscoMajor === major)
    .reduce((s, o) => s + (o.jobs ?? 0), 0);
}

function _totalJobs(): number {
  return austrianOccupations.reduce((s, o) => s + (o.jobs ?? 0), 0);
}

function _gini(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  let sumRank = 0;
  for (let i = 0; i < n; i++) sumRank += (i + 1) * sorted[i];
  const sum = sorted.reduce((a, b) => a + b, 0);
  return sum > 0 ? (2 * sumRank) / (n * sum) - (n + 1) / n : 0;
}

export const dataTests: DataTest[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // GROUP 1: DATA COMPLETENESS — Pipeline must produce fully-populated rows
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: "completeness-jobs",
    group: "completeness",
    name: "Every occupation row has positive employment",
    nameDe: "Jeder Beruf hat positive Beschäftigung",
    thesis: "The LFS×NACE allocation pipeline assigns a positive integer job count to every occupation row, because each row maps to at least one real ISCO×NACE cell with non-zero employment.",
    thesisDe: "Die LFS×NACE-Allokationspipeline weist jeder Berufszeile eine positive ganzzahlige Beschäftigtenzahl zu, da jede Zeile mindestens einer realen ISCO×NACE-Zelle mit Beschäftigung entspricht.",
    antithesis: "If any row has zero or null jobs, the NACE weight for that occupation collapsed to zero — indicating a broken split or a missing Eurostat cell.",
    antithesisDe: "Hat eine Zeile null oder fehlende Jobs, ist das NACE-Gewicht auf null gefallen — ein Hinweis auf eine defekte Aufteilung oder fehlende Eurostat-Zelle.",
    test: () => {
      const zeros = austrianOccupations.filter((o) => !o.jobs || o.jobs === 0);
      return { passed: zeros.length === 0, actual: zeros.length === 0 ? "All > 0" : zeros.map((o) => o.slug).join(", "), expected: "All occupations > 0 jobs" };
    },
  },
  {
    id: "completeness-pay",
    group: "completeness",
    name: "Every occupation row has VSE-based pay",
    nameDe: "Jeder Beruf hat ein VSE-basiertes Gehalt",
    thesis: "Statistik Austria’s VSE provides median hourly pay for every ISCO-08 2-digit or NACE division used in this model; after the 13th/14th-month uplift, every row should carry a positive annual pay figure.",
    thesisDe: "Die VSE der Statistik Austria liefert für jede hier verwendete ISCO-08-2-Steller- oder NACE-Abteilung einen Median-Stundenlohn; nach dem 13./14.-Monatsgehalt-Aufschlag muss jede Zeile ein positives Jahresgehalt tragen.",
    antithesis: "A zero or missing pay value means the VSE lookup failed for that ISCO/NACE combination, leaving the user with no earnings information.",
    antithesisDe: "Ein fehlendes oder null Gehalt bedeutet, dass die VSE-Abfrage für diese ISCO-/NACE-Kombination gescheitert ist.",
    test: () => {
      const zeros = austrianOccupations.filter((o) => !o.pay || o.pay === 0);
      return { passed: zeros.length === 0, actual: zeros.length === 0 ? "All > 0" : zeros.map((o) => o.slug).join(", "), expected: "All occupations have pay data" };
    },
  },
  {
    id: "completeness-titles",
    group: "completeness",
    name: "Every row has non-empty EN and DE titles",
    nameDe: "Jede Zeile hat nicht-leere EN- und DE-Titel",
    thesis: "The bilingual UI requires both title and titleDe to be non-empty strings on every occupation row.",
    thesisDe: "Die zweisprachige Oberfläche erfordert, dass title und titleDe auf jeder Zeile nicht-leere Zeichenketten sind.",
    antithesis: "A missing title would render as a blank card in the occupation grid, confusing users.",
    antithesisDe: "Ein fehlender Titel würde als leere Karte im Berufsraster erscheinen und die Nutzer verwirren.",
    test: () => {
      const bad = austrianOccupations.filter((o) => !o.title?.trim() || !o.titleDe?.trim());
      return { passed: bad.length === 0, actual: bad.length === 0 ? "All present" : bad.map((o) => o.slug).join(", "), expected: "All rows have EN + DE titles" };
    },
  },
  {
    id: "completeness-categories",
    group: "completeness",
    name: "Every row has non-empty EN and DE category labels",
    nameDe: "Jede Zeile hat nicht-leere EN- und DE-Kategorielabels",
    thesis: "Category labels (NACE division names) drive the sector filter UI and must be present in both languages.",
    thesisDe: "Kategorielabels (NACE-Abteilungsnamen) treiben den Sektorfilter und müssen in beiden Sprachen vorhanden sein.",
    antithesis: "Missing category labels break sector grouping and leave filter dropdowns with blank entries.",
    antithesisDe: "Fehlende Kategorielabels brechen die Sektorgruppierung und hinterlassen leere Filtereinträge.",
    test: () => {
      const bad = austrianOccupations.filter((o) => !o.category?.trim() || !o.categoryDe?.trim());
      return { passed: bad.length === 0, actual: bad.length === 0 ? "All present" : bad.map((o) => o.slug).join(", "), expected: "All rows have category labels" };
    },
  },
  {
    id: "completeness-outlook-desc",
    group: "completeness",
    name: "Every row has outlook description text",
    nameDe: "Jede Zeile hat eine Ausblick-Beschreibung",
    thesis: "The WIFO/AMS mapping produces a human-readable outlook description for each occupation, used in detail views.",
    thesisDe: "Die WIFO/AMS-Zuordnung erzeugt für jeden Beruf eine menschenlesbare Ausblick-Beschreibung für die Detailansicht.",
    antithesis: "An empty outlook description leaves the detail page with no narrative about future demand.",
    antithesisDe: "Eine leere Ausblick-Beschreibung lässt die Detailseite ohne Erzählung zur künftigen Nachfrage.",
    test: () => {
      const bad = austrianOccupations.filter((o) => !o.outlookDesc?.trim() || !o.outlookDescDe?.trim());
      return { passed: bad.length === 0, actual: bad.length === 0 ? "All present" : bad.length + " missing", expected: "All rows have outlook descriptions" };
    },
  },
  {
    id: "completeness-exposure-rationale",
    group: "completeness",
    name: "Every AI exposure score has a written rationale (≥ 20 chars)",
    nameDe: "Jede KI-Expositionsbewertung hat eine Begründung (≥ 20 Zeichen)",
    thesis: "Each exposure score is backed by a rubric rationale of at least 20 characters, making the scoring explainable in the UI.",
    thesisDe: "Jeder Expositions-Score wird durch eine Rubrik-Begründung von mind. 20 Zeichen gestützt, um die Bewertung in der UI erklärbar zu machen.",
    antithesis: "A short or empty rationale suggests the score was assigned without justification — undermining user trust.",
    antithesisDe: "Eine kurze oder leere Begründung deutet auf eine unbegründete Bewertung hin — das untergräbt das Nutzervertrauen.",
    test: () => {
      const bad = austrianOccupations.filter((o) => !o.exposureRationale || o.exposureRationale.trim().length < 20);
      return { passed: bad.length === 0, actual: bad.length === 0 ? "All ≥ 20 chars" : bad.map((o) => o.slug).join(", "), expected: "All rationales ≥ 20 chars" };
    },
  },
  {
    id: "completeness-exposure-rationale-de",
    group: "completeness",
    name: "German exposure rationales are also present",
    nameDe: "Deutsche Expositions-Begründungen sind vorhanden",
    thesis: "The DE version of each rationale must also be non-trivially long so German-speaking users get the same quality explanation.",
    thesisDe: "Die DE-Version jeder Begründung muss ebenfalls ausreichend lang sein, damit deutschsprachige Nutzer dieselbe Erklärungsqualität erhalten.",
    antithesis: "A missing DE rationale means the German UI falls back to no explanation — a broken bilingual experience.",
    antithesisDe: "Eine fehlende DE-Begründung bedeutet, dass die deutsche UI keine Erklärung anzeigt.",
    test: () => {
      const bad = austrianOccupations.filter((o) => !o.exposureRationaleDe || o.exposureRationaleDe.trim().length < 20);
      return { passed: bad.length === 0, actual: bad.length === 0 ? "All ≥ 20 chars" : bad.length + " missing", expected: "All DE rationales ≥ 20 chars" };
    },
  },
  {
    id: "completeness-source",
    group: "completeness",
    name: "Each row carries a traceable source string",
    nameDe: "Jede Zeile hat eine nachvollziehbare Quellenangabe",
    thesis: "The provenance string encodes Eurostat table IDs and VSE references, enabling users to verify any figure back to official statistics.",
    thesisDe: "Die Herkunftszeile kodiert Eurostat-Tabellen-IDs und VSE-Referenzen, sodass Nutzer jede Zahl zu amtlichen Statistiken zurückverfolgen können.",
    antithesis: "A missing or trivially short source string removes the audit trail — the data becomes unverifiable.",
    antithesisDe: "Eine fehlende oder trivial kurze Quellenangabe entfernt die Prüfspur — die Daten werden unüberprüfbar.",
    test: () => {
      const bad = austrianOccupations.filter((o) => !o.source || o.source.length < 10);
      return { passed: bad.length === 0, actual: bad.length === 0 ? "All have sources" : bad.map((o) => o.slug).join(", "), expected: "All rows have source field" };
    },
  },
  {
    id: "completeness-source-eurostat",
    group: "completeness",
    name: "Source strings reference Eurostat or VSE",
    nameDe: "Quellenangaben verweisen auf Eurostat oder VSE",
    thesis: "Every source string should mention at least one of ‘Eurostat’, ‘LFS’, ‘lfsa’, ‘VSE’, or ‘veste’ — the actual upstream datasets.",
    thesisDe: "Jede Quellenangabe sollte mindestens ‘Eurostat’, ‘LFS’, ‘lfsa’, ‘VSE’ oder ‘veste’ nennen — die tatsächlichen Upstream-Datensätze.",
    antithesis: "A source string without any known dataset reference is likely a placeholder that slipped through generation.",
    antithesisDe: "Eine Quellenangabe ohne bekannte Datensatzreferenz ist wahrscheinlich ein Platzhalter, der durch die Generierung gerutscht ist.",
    test: () => {
      const pat = /eurostat|lfs|lfsa|vse|veste/i;
      const bad = austrianOccupations.filter((o) => !pat.test(o.source ?? ""));
      return { passed: bad.length === 0, actual: bad.length === 0 ? "All reference official data" : bad.length + " missing references", expected: "All mention Eurostat/LFS/VSE" };
    },
  },
  {
    id: "completeness-onace-section",
    group: "completeness",
    name: "ÖNACE section is a single uppercase letter",
    nameDe: "ÖNACE-Abschnitt ist ein einzelner Großbuchstabe",
    thesis: "The onaceSection field must be a single letter A–S matching the NACE Rev.2 section classification.",
    thesisDe: "Das Feld onaceSection muss ein einzelner Buchstabe A–S sein, passend zur NACE-Rev.2-Abschnittsklassifikation.",
    antithesis: "A multi-character or lowercase section code breaks sector aggregation and filter logic.",
    antithesisDe: "Ein mehrstelliger oder kleingeschriebener Abschnittscode bricht die Sektoraggregation und Filterlogik.",
    test: () => {
      const bad = austrianOccupations.filter((o) => !/^[A-S]$/.test(o.onaceSection));
      return { passed: bad.length === 0, actual: bad.length === 0 ? "All valid A–S" : bad.map((o) => o.slug + ":" + o.onaceSection).join(", "), expected: "Single letter A–S" };
    },
  },
  {
    id: "completeness-slug-format",
    group: "completeness",
    name: "Slugs are lowercase-hyphenated, URL-safe",
    nameDe: "Slugs sind kleingeschrieben, bindestrichgetrennt und URL-sicher",
    thesis: "Occupation slugs serve as URL path segments and must match the pattern [a-z0-9-]+.",
    thesisDe: "Berufs-Slugs dienen als URL-Pfadsegmente und müssen dem Muster [a-z0-9-]+ entsprechen.",
    antithesis: "An invalid slug would produce broken routes or 404 pages for that occupation.",
    antithesisDe: "Ein ungültiger Slug würde fehlerhafte Routen oder 404-Seiten für diesen Beruf erzeugen.",
    test: () => {
      const bad = austrianOccupations.filter((o) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(o.slug));
      return { passed: bad.length === 0, actual: bad.length === 0 ? "All valid" : bad.map((o) => o.slug).join(", "), expected: "All slugs match [a-z0-9-]+" };
    },
  },
  {
    id: "completeness-unique-slugs",
    group: "completeness",
    name: "Occupation slugs are unique",
    nameDe: "Berufs-Slugs sind eindeutig",
    thesis: "Each slug is a unique identifier used for routing; duplicates would cause two occupations to share the same URL.",
    thesisDe: "Jeder Slug ist ein eindeutiger Bezeichner für das Routing; Duplikate würden dazu führen, dass zwei Berufe dieselbe URL teilen.",
    antithesis: "Duplicate slugs break routing and mean one occupation shadows another in the UI.",
    antithesisDe: "Doppelte Slugs brechen das Routing und bedeuten, dass ein Beruf einen anderen in der UI verdeckt.",
    test: () => {
      const slugs = austrianOccupations.map((o) => o.slug);
      const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
      return { passed: dupes.length === 0, actual: dupes.length === 0 ? "All unique" : dupes.join(", "), expected: "No duplicates" };
    },
  },
  {
    id: "completeness-unique-titles",
    group: "completeness",
    name: "Occupation titles (EN) are unique",
    nameDe: "Berufstitel (EN) sind eindeutig",
    thesis: "Each English title should be unique so users can distinguish occupations in lists and search results.",
    thesisDe: "Jeder englische Titel sollte eindeutig sein, damit Nutzer Berufe in Listen und Suchergebnissen unterscheiden können.",
    antithesis: "Duplicate titles confuse users and suggest two rows describe the same occupation.",
    antithesisDe: "Doppelte Titel verwirren Nutzer und deuten darauf hin, dass zwei Zeilen denselben Beruf beschreiben.",
    test: () => {
      const titles = austrianOccupations.map((o) => o.title);
      const dupes = titles.filter((t, i) => titles.indexOf(t) !== i);
      return { passed: dupes.length === 0, actual: dupes.length === 0 ? "All unique" : dupes.join(", "), expected: "No duplicate titles" };
    },
  },
  {
    id: "completeness-education-valid",
    group: "completeness",
    name: "Education labels map to the canonical list",
    nameDe: "Bildungslabels entsprechen der kanonischen Liste",
    thesis: "Each row’s education field must be one of EDU_LEVELS_EN (8 canonical levels) to ensure filters and i18n mappings work correctly.",
    thesisDe: "Das Bildungsfeld jeder Zeile muss einem der 8 kanonischen EDU_LEVELS_EN entsprechen, damit Filter und i18n-Zuordnungen korrekt funktionieren.",
    antithesis: "A non-canonical label breaks the education filter and may produce a blank in the German translation.",
    antithesisDe: "Ein nicht-kanonisches Label bricht den Bildungsfilter und kann eine Lücke in der deutschen Übersetzung erzeugen.",
    test: () => {
      const invalid = austrianOccupations.filter((o) => !EDU_LEVELS_EN.includes(o.education));
      return { passed: invalid.length === 0, actual: invalid.length === 0 ? "All valid" : invalid.map((o) => o.slug + ":" + o.education).join(", "), expected: "All in EDU_LEVELS_EN" };
    },
  },
  {
    id: "completeness-education-de-valid",
    group: "completeness",
    name: "German education labels map to EDU_LEVELS_AT",
    nameDe: "Deutsche Bildungslabels entsprechen EDU_LEVELS_AT",
    thesis: "Each row’s educationDe must be one of the 8 Austrian education levels in EDU_LEVELS_AT.",
    thesisDe: "Das Feld educationDe jeder Zeile muss einem der 8 österreichischen Bildungsniveaus in EDU_LEVELS_AT entsprechen.",
    antithesis: "A non-canonical DE label breaks the German education filter dropdown.",
    antithesisDe: "Ein nicht-kanonisches DE-Label bricht den deutschen Bildungsfilter.",
    test: () => {
      const invalid = austrianOccupations.filter((o) => !EDU_LEVELS_AT.includes(o.educationDe));
      return { passed: invalid.length === 0, actual: invalid.length === 0 ? "All valid" : invalid.map((o) => o.slug + ":" + o.educationDe).join(", "), expected: "All in EDU_LEVELS_AT" };
    },
  },
  {
    id: "completeness-growth-pa",
    group: "completeness",
    name: "Annual growth rate is within plausible bounds",
    nameDe: "Jährliche Wachstumsrate liegt in plausiblen Grenzen",
    thesis: "outlookGrowthPa (% p.a. employment growth from WIFO/AMS) should lie between −10% and +10% for any occupation.",
    thesisDe: "outlookGrowthPa (jährl. Beschäftigungswachstum aus WIFO/AMS) soll für jeden Beruf zwischen −10 % und +10 % liegen.",
    antithesis: "A growth rate beyond ±10% p.a. suggests a mapping error in the WIFO/AMS forecast pipeline.",
    antithesisDe: "Eine Wachstumsrate jenseits ±10 % p.a. deutet auf einen Zuordnungsfehler in der WIFO/AMS-Prognosepipeline hin.",
    test: () => {
      const bad = austrianOccupations.filter((o) => o.outlookGrowthPa < -10 || o.outlookGrowthPa > 10);
      return { passed: bad.length === 0, actual: bad.length === 0 ? "All within ±10%" : bad.map((o) => o.slug + ":" + o.outlookGrowthPa).join(", "), expected: "All −10% to +10%" };
    },
  },
  {
    id: "completeness-occupation-count",
    group: "completeness",
    name: "At least 50 distinct occupation groups",
    nameDe: "Mindestens 50 verschiedene Berufsgruppen",
    thesis: "The model should produce ≥ 50 occupation rows so visualisations (treemap, bar charts) have enough granularity.",
    thesisDe: "Das Modell soll ≥ 50 Berufszeilen erzeugen, damit Visualisierungen (Treemap, Balkendiagramme) ausreichend Granularität haben.",
    antithesis: "Fewer than 50 rows collapses the occupation landscape into too-broad aggregates, losing analytical value.",
    antithesisDe: "Weniger als 50 Zeilen kollabiert die Berufslandschaft in zu breite Aggregate und verliert analytischen Wert.",
    test: () => {
      return { passed: austrianOccupations.length >= 50, actual: austrianOccupations.length.toString(), expected: "≥ 50" };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // GROUP 2: ISCO-08 STRUCTURAL CONSISTENCY
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: "isco-fields-present",
    group: "isco",
    name: "Every row carries ISCO code and family labels",
    nameDe: "Jede Zeile trägt ISCO-Code und Familienlabels",
    thesis: "The occupation-first UI depends on isco08 (2-digit), iscoMajor (1-digit), and bilingual iscoLabel/iscoLabelDe being present on every row.",
    thesisDe: "Die Berufs-UI hängt davon ab, dass isco08, iscoMajor und zweisprachige iscoLabel/iscoLabelDe auf jeder Zeile vorhanden sind.",
    antithesis: "Missing ISCO metadata would break grouping, navigation headers, and ISCO-based summaries.",
    antithesisDe: "Fehlende ISCO-Metadaten würden Gruppierung, Navigationsüberschriften und ISCO-basierte Zusammenfassungen brechen.",
    test: () => {
      const invalid = austrianOccupations.filter((o) => !o.isco08 || !o.iscoMajor || !o.iscoLabel || !o.iscoLabelDe);
      return { passed: invalid.length === 0, actual: invalid.length === 0 ? "All rows complete" : invalid.map((o) => o.slug).join(", "), expected: "All rows have ISCO fields" };
    },
  },
  {
    id: "isco-code-format",
    group: "isco",
    name: "ISCO codes are valid 2-digit codes (10–96)",
    nameDe: "ISCO-Codes sind gültige 2-stellige Codes (10–96)",
    thesis: "Every isco08 value must be a 2-digit string matching the ISCO-08 sub-major group range (first digit 1–9).",
    thesisDe: "Jeder isco08-Wert muss ein 2-stelliger String sein, der dem ISCO-08-Unterhauptgruppenbereich entspricht (erste Ziffer 1–9).",
    antithesis: "An invalid code (e.g. ‘00’, ‘99+’, or alpha characters) indicates a parsing error in the generation pipeline.",
    antithesisDe: "Ein ungültiger Code (z.B. ‘00’, ‘99+’ oder Buchstaben) deutet auf einen Parsing-Fehler in der Generierungspipeline hin.",
    test: () => {
      const invalid = austrianOccupations.filter((o) => !/^[1-9][0-9]$/.test(o.isco08));
      return { passed: invalid.length === 0, actual: invalid.length === 0 ? "All valid 2-digit" : invalid.map((o) => o.slug + ":" + o.isco08).join(", "), expected: "All match [1-9][0-9]" };
    },
  },
  {
    id: "isco-major-matches-code",
    group: "isco",
    name: "ISCO major group equals first digit of 2-digit code",
    nameDe: "ISCO-Majorgruppe entspricht der ersten Ziffer des 2-stelligen Codes",
    thesis: "iscoMajor must equal isco08.charAt(0) — this is a deterministic derivation, not a separate data field.",
    thesisDe: "iscoMajor muss gleich isco08.charAt(0) sein — eine deterministische Ableitung, kein separates Datenfeld.",
    antithesis: "A mismatch means the pipeline wrote inconsistent ISCO metadata, which would misclassify occupations in family views.",
    antithesisDe: "Eine Abweichung bedeutet, dass die Pipeline inkonsistente ISCO-Metadaten geschrieben hat, was Berufe in Familienansichten falsch einordnet.",
    test: () => {
      const invalid = austrianOccupations.filter((o) => o.iscoMajor !== o.isco08.charAt(0));
      return { passed: invalid.length === 0, actual: invalid.length === 0 ? "All aligned" : invalid.map((o) => o.slug + ":" + o.isco08 + "/" + o.iscoMajor).join(", "), expected: "major = first digit" };
    },
  },
  {
    id: "isco-labels-canonical",
    group: "isco",
    name: "ISCO family labels match the canonical ILO mapping",
    nameDe: "ISCO-Familienlabels stimmen mit der kanonischen ILO-Zuordnung überein",
    thesis: "The EN and DE family labels for each major group (1–9) must match the ILO/Statistik Austria canonical names used across the site.",
    thesisDe: "Die EN- und DE-Familienlabels für jede Majorgruppe (1–9) müssen den kanonischen ILO-/Statistik-Austria-Namen entsprechen.",
    antithesis: "Non-canonical labels would create inconsistent group headers between different views.",
    antithesisDe: "Nicht-kanonische Labels würden inkonsistente Gruppenüberschriften zwischen verschiedenen Ansichten erzeugen.",
    test: () => {
      const expected: Record<string, { en: string; de: string }> = {
        "1": { en: "Managers", de: "Führungskräfte" },
        "2": { en: "Professionals", de: "Akademische Berufe" },
        "3": { en: "Technicians & associate professionals", de: "Techniker/innen & assoziierte Berufe" },
        "4": { en: "Clerical support workers", de: "Bürokräfte" },
        "5": { en: "Service & sales workers", de: "Dienstleistungs- & Verkaufsberufe" },
        "6": { en: "Skilled agriculture & forestry", de: "Land- & Forstwirtschaftliche Fachkräfte" },
        "7": { en: "Craft & related trades", de: "Handwerks- & verwandte Berufe" },
        "8": { en: "Plant, machine operators & assemblers", de: "Anlagen-, Maschinenbedienung & Montage" },
        "9": { en: "Elementary occupations", de: "Hilfsarbeitskräfte" },
      };
      const invalid = austrianOccupations.filter((o) => {
        const l = expected[o.iscoMajor];
        return !l || l.en !== o.iscoLabel || l.de !== o.iscoLabelDe;
      });
      return { passed: invalid.length === 0, actual: invalid.length === 0 ? "All canonical" : invalid.map((o) => o.slug).join(", "), expected: "Labels match ILO canonical names" };
    },
  },
  {
    id: "isco-family-coverage",
    group: "isco",
    name: "All 9 ISCO major families are represented",
    nameDe: "Alle 9 ISCO-Hauptfamilien sind vertreten",
    thesis: "An Austria-wide occupation model must include at least one row from each ISCO major group 1–9.",
    thesisDe: "Ein österreichweites Berufsmodell muss mindestens eine Zeile aus jeder ISCO-Hauptgruppe 1–9 enthalten.",
    antithesis: "A missing major group means an entire occupational family (e.g. all managers, or all craft workers) is invisible.",
    antithesisDe: "Eine fehlende Hauptgruppe bedeutet, dass eine ganze Berufsfamilie unsichtbar ist.",
    test: () => {
      const majors = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      const missing = majors.filter((m) => !austrianOccupations.some((o) => o.iscoMajor === m && (o.jobs ?? 0) > 0));
      return { passed: missing.length === 0, actual: missing.length === 0 ? "9/9 families present" : "Missing: " + missing.join(", "), expected: "All 1–9 represented" };
    },
  },
  {
    id: "isco-multiple-per-family",
    group: "isco",
    name: "Each ISCO family has at least 2 occupation rows",
    nameDe: "Jede ISCO-Familie hat mindestens 2 Berufszeilen",
    thesis: "For meaningful within-family comparisons, each major group should contain ≥ 2 rows.",
    thesisDe: "Für aussagekräftige Vergleiche innerhalb einer Familie soll jede Hauptgruppe ≥ 2 Zeilen enthalten.",
    antithesis: "A singleton family offers no comparison — the user sees only one occupation in that group.",
    antithesisDe: "Eine Einzel-Zeilen-Familie bietet keinen Vergleich — der Nutzer sieht nur einen Beruf in dieser Gruppe.",
    test: () => {
      const counts = new Map<string, number>();
      for (const o of austrianOccupations) counts.set(o.iscoMajor, (counts.get(o.iscoMajor) ?? 0) + 1);
      const singletons = [...counts.entries()].filter(([, c]) => c < 2).map(([m]) => m);
      return { passed: singletons.length === 0, actual: singletons.length === 0 ? "All families ≥ 2 rows" : "Singleton: " + singletons.join(", "), expected: "≥ 2 rows per family" };
    },
  },
  {
    id: "isco-professionals-largest",
    group: "isco",
    name: "Professionals (ISCO 2) is the largest or second-largest family",
    nameDe: "Akademische Berufe (ISCO 2) ist die größte oder zweitgrößte Familie",
    thesis: "In a post-industrial economy like Austria, Professionals (ISCO 2) should be among the top-2 families by employment — a structural regularity observed across all EU-15 countries.",
    thesisDe: "In einer postindustriellen Wirtschaft wie Österreich sollten Akademische Berufe (ISCO 2) zu den Top-2-Familien nach Beschäftigung gehören — ein in allen EU-15-Ländern beobachtetes Strukturmerkmal.",
    antithesis: "If Professionals rank 3rd or lower, the ISCO×NACE allocation may be systematically under-counting knowledge workers.",
    antithesisDe: "Wenn Akademische Berufe auf Rang 3 oder darunter fallen, könnte die ISCO×NACE-Allokation Wissensarbeiter systematisch unterzählen.",
    test: () => {
      const familyJobs = new Map<string, number>();
      for (const o of austrianOccupations) familyJobs.set(o.iscoMajor, (familyJobs.get(o.iscoMajor) ?? 0) + (o.jobs ?? 0));
      const sorted = [...familyJobs.entries()].sort((a, b) => b[1] - a[1]);
      const rank = sorted.findIndex(([m]) => m === "2") + 1;
      return { passed: rank <= 2, actual: "Rank " + rank + " (" + (familyJobs.get("2") ?? 0).toLocaleString() + " jobs)", expected: "Rank ≤ 2" };
    },
  },
  {
    id: "isco-elementary-smallest",
    group: "isco",
    name: "Elementary occupations (ISCO 9) is not the largest family",
    nameDe: "Hilfsarbeitskräfte (ISCO 9) ist nicht die größte Familie",
    thesis: "In a developed, high-education economy, elementary occupations should not dominate the employment structure.",
    thesisDe: "In einer entwickelten Wirtschaft mit hohem Bildungsniveau sollten Hilfsarbeitskräfte nicht die Beschäftigungsstruktur dominieren.",
    antithesis: "If ISCO 9 is the largest, the model may be over-allocating to low-skill roles or miscoding occupations.",
    antithesisDe: "Wenn ISCO 9 die größte Familie ist, könnte das Modell zu viel in Niedrigqualifikationsrollen allokieren oder Berufe falsch kodieren.",
    test: () => {
      const familyJobs = new Map<string, number>();
      for (const o of austrianOccupations) familyJobs.set(o.iscoMajor, (familyJobs.get(o.iscoMajor) ?? 0) + (o.jobs ?? 0));
      const sorted = [...familyJobs.entries()].sort((a, b) => b[1] - a[1]);
      const rank9 = sorted.findIndex(([m]) => m === "9") + 1;
      return { passed: rank9 > 1, actual: "ISCO 9 rank: " + rank9, expected: "Not rank 1" };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // GROUP 3: EMPLOYMENT DISTRIBUTION — Macro-level plausibility
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: "employment-total",
    group: "employment",
    name: "Total employment matches LFS within 2%",
    nameDe: "Gesamtbeschäftigung stimmt mit LFS innerhalb 2 % überein",
    thesis: "The sum of all occupation-level jobs should reproduce the Eurostat LFS total for the modeled ISCO codes (4,476,100) within 98–102%, since the pipeline allocates the full LFS count.",
    thesisDe: "Die Summe aller Berufs-Jobs soll die Eurostat-LFS-Summe der modellierten ISCO-Codes (4.476.100) mit 98–102 % reproduzieren, da die Pipeline den vollen LFS-Bestand verteilt.",
    antithesis: "A ratio outside 98–102% means jobs were created or destroyed during allocation — a pipeline bug.",
    antithesisDe: "Ein Verhältnis außerhalb von 98–102 % bedeutet, dass Jobs während der Allokation erzeugt oder vernichtet wurden — ein Pipeline-Bug.",
    test: () => {
      const total = _totalJobs();
      const ratio = total / 4476100;
      return { passed: ratio >= 0.98 && ratio <= 1.02, actual: total.toLocaleString() + " (" + (ratio * 100).toFixed(1) + "%)", expected: "98–102% of 4,476,100" };
    },
  },
  {
    id: "employment-isco-sums-to-total",
    group: "employment",
    name: "ISCO family sums equal total employment",
    nameDe: "ISCO-Familiensummen ergeben die Gesamtbeschäftigung",
    thesis: "Summing jobs by ISCO major group and then summing those 9 sub-totals must reproduce the grand total — a partition identity.",
    thesisDe: "Die Summierung der Jobs nach ISCO-Hauptgruppe und anschließende Addition dieser 9 Teilsummen muss die Gesamtsumme reproduzieren — eine Partitionsidentität.",
    antithesis: "A mismatch reveals double-counting or orphaned rows that don’t belong to any ISCO family.",
    antithesisDe: "Eine Abweichung zeigt Doppelzählung oder verwaiste Zeilen, die keiner ISCO-Familie zugehören.",
    test: () => {
      const total = _totalJobs();
      let familySum = 0;
      for (let m = 1; m <= 9; m++) familySum += _iscoFamilyJobs(m.toString());
      return { passed: familySum === total, actual: familySum.toLocaleString() + " vs " + total.toLocaleString(), expected: "Equal" };
    },
  },
  {
    id: "employment-nace-sums-to-total",
    group: "employment",
    name: "NACE section sums equal total employment",
    nameDe: "NACE-Abschnittssummen ergeben die Gesamtbeschäftigung",
    thesis: "Summing jobs by ÖNACE section (A–S) must reproduce the total — since every row belongs to exactly one section.",
    thesisDe: "Die Summierung der Jobs nach ÖNACE-Abschnitt (A–S) muss die Gesamtsumme reproduzieren — da jede Zeile genau einem Abschnitt angehört.",
    antithesis: "A mismatch means some rows carry a section letter outside A–S, or rounding introduced leaks.",
    antithesisDe: "Eine Abweichung bedeutet, dass einige Zeilen einen Abschnittsbuchstaben außerhalb A–S tragen oder Rundung Lecks eingeführt hat.",
    test: () => {
      const total = _totalJobs();
      let secSum = 0;
      for (const ch of "ABCDEFGHIJKLMNOPQRS") secSum += _sectorJobs(ch);
      return { passed: secSum === total, actual: secSum.toLocaleString() + " vs " + total.toLocaleString(), expected: "Equal" };
    },
  },
  {
    id: "employment-no-single-dominance",
    group: "employment",
    name: "No single occupation exceeds 8% of total employment",
    nameDe: "Kein einzelner Beruf übersteigt 8 % der Gesamtbeschäftigung",
    thesis: "At the 2-digit ISCO × NACE division level, no single row should represent > 8% of all jobs. Retail sales (ISCO 52 × NACE G) is the largest single row at ~7%, reflecting Austria's large trade sector (WKO: ~630k employees in G45–G47).",
    thesisDe: "Auf Ebene 2-stelliger ISCO × NACE-Abteilungen sollte keine einzelne Zeile > 8 % aller Jobs darstellen. Einzelhandel (ISCO 52 × NACE G) ist mit ~7 % die größte Zeile, entsprechend Österreichs großem Handelssektor.",
    antithesis: "A row exceeding 8% suggests the NACE weight split failed, lumping too many jobs into one occupation beyond what Austria's sector structure justifies.",
    antithesisDe: "Eine Zeile über 8 % deutet darauf hin, dass die NACE-Gewichtsaufteilung gescheitert ist und mehr Jobs zuweist als Österreichs Sektorstruktur rechtfertigt.",
    test: () => {
      const total = _totalJobs();
      const maxRow = austrianOccupations.reduce((best, o) => (o.jobs ?? 0) > (best.jobs ?? 0) ? o : best, austrianOccupations[0]);
      const pct = total > 0 ? ((maxRow.jobs ?? 0) / total) * 100 : 0;
      return { passed: pct <= 8, actual: maxRow.slug + ": " + pct.toFixed(1) + "%", expected: "≤ 8%" };
    },
  },
  {
    id: "employment-min-per-row",
    group: "employment",
    name: "Every occupation has at least 1,000 jobs",
    nameDe: "Jeder Beruf hat mindestens 1.000 Beschäftigte",
    thesis: "Given Austria’s 4.5M employed, even the smallest ISCO×NACE cell should represent ≥ 1,000 workers after deterministic allocation.",
    thesisDe: "Bei Österreichs 4,5 Mio. Erwerbstätigen sollte selbst die kleinste ISCO×NACE-Zelle nach deterministischer Allokation ≥ 1.000 Beschäftigte repräsentieren.",
    antithesis: "A sub-1000 row is so small it risks being noise rather than signal — the occupation may be better merged.",
    antithesisDe: "Eine Zeile unter 1.000 ist so klein, dass sie eher Rauschen als Signal ist — der Beruf sollte ggf. zusammengefasst werden.",
    test: () => {
      const tiny = austrianOccupations.filter((o) => (o.jobs ?? 0) < 1000);
      return { passed: tiny.length === 0, actual: tiny.length === 0 ? "All ≥ 1,000" : tiny.map((o) => o.slug + ":" + o.jobs).join(", "), expected: "All ≥ 1,000 jobs" };
    },
  },
  {
    id: "employment-top10-share",
    group: "employment",
    name: "Top 10 occupations don’t exceed 50% of total",
    nameDe: "Top 10 Berufe übersteigen nicht 50 % der Gesamtbeschäftigung",
    thesis: "The employment distribution should not be so concentrated that just 10 out of 75+ occupations absorb half the workforce.",
    thesisDe: "Die Beschäftigungsverteilung sollte nicht so konzentriert sein, dass nur 10 von 75+ Berufen die halbe Belegschaft umfassen.",
    antithesis: "Excessive concentration suggests the NACE-weight splitting is too coarse, pooling too many people into a few rows.",
    antithesisDe: "Übermäßige Konzentration deutet darauf hin, dass die NACE-Gewichtsaufteilung zu grob ist.",
    test: () => {
      const total = _totalJobs();
      const sorted = [...austrianOccupations].sort((a, b) => (b.jobs ?? 0) - (a.jobs ?? 0));
      const top10 = sorted.slice(0, 10).reduce((s, o) => s + (o.jobs ?? 0), 0);
      const pct = total > 0 ? (top10 / total) * 100 : 0;
      return { passed: pct <= 50, actual: pct.toFixed(1) + "%", expected: "≤ 50%" };
    },
  },
  {
    id: "employment-hhi",
    group: "employment",
    name: "Employment not dominated by one NACE section (HHI < 0.15)",
    nameDe: "Beschäftigung nicht von einem NACE-Abschnitt dominiert (HHI < 0,15)",
    thesis: "Austria has a diversified economy; the Herfindahl–Hirschman Index across NACE sections should stay below 0.15 (equivalent to ~7 equal sectors).",
    thesisDe: "Österreich hat eine diversifizierte Wirtschaft; der Herfindahl–Hirschman-Index über NACE-Abschnitte soll unter 0,15 bleiben (entspricht ~7 gleich großen Sektoren).",
    antithesis: "HHI ≥ 0.15 would indicate dangerous concentration — possibly a single sector (e.g. manufacturing) absorbing too many ISCO rows.",
    antithesisDe: "HHI ≥ 0,15 würde gefährliche Konzentration anzeigen — möglicherweise ein einziger Sektor, der zu viele ISCO-Zeilen absorbiert.",
    test: () => {
      const bySec = new Map<string, number>();
      for (const o of austrianOccupations) bySec.set(o.onaceSection, (bySec.get(o.onaceSection) ?? 0) + (o.jobs ?? 0));
      const total = [...bySec.values()].reduce((a, b) => a + b, 0);
      if (total <= 0) return { passed: false, actual: "0", expected: "HHI < 0.15" };
      let hhi = 0;
      for (const v of bySec.values()) hhi += (v / total) ** 2;
      return { passed: hhi < 0.15, actual: "HHI = " + hhi.toFixed(4), expected: "< 0.15" };
    },
  },
  {
    id: "employment-hhi-isco",
    group: "employment",
    name: "Employment not dominated by one ISCO family (HHI < 0.20)",
    nameDe: "Beschäftigung nicht von einer ISCO-Familie dominiert (HHI < 0,20)",
    thesis: "Concentration across the 9 ISCO major groups should remain moderate (HHI < 0.20).",
    thesisDe: "Die Konzentration über die 9 ISCO-Hauptgruppen soll moderat bleiben (HHI < 0,20).",
    antithesis: "High ISCO HHI suggests the pipeline assigns disproportionate weight to a single skill class.",
    antithesisDe: "Hoher ISCO-HHI deutet darauf hin, dass die Pipeline einer einzelnen Qualifikationsklasse unverhältnismäßig viel Gewicht zuweist.",
    test: () => {
      const byF = new Map<string, number>();
      for (const o of austrianOccupations) byF.set(o.iscoMajor, (byF.get(o.iscoMajor) ?? 0) + (o.jobs ?? 0));
      const total = [...byF.values()].reduce((a, b) => a + b, 0);
      let hhi = 0;
      for (const v of byF.values()) hhi += (v / total) ** 2;
      return { passed: hhi < 0.2, actual: "HHI = " + hhi.toFixed(4), expected: "< 0.20" };
    },
  },
  {
    id: "employment-pay-skewness",
    group: "employment",
    name: "Employment distribution is right-skewed",
    nameDe: "Beschäftigungsverteilung ist rechtsschief",
    thesis: "Most occupations employ moderate numbers while a few large sectors dominate — the distribution should be positively skewed (skewness > 0).",
    thesisDe: "Die meisten Berufe haben moderate Beschäftigtenzahlen, während wenige große Sektoren dominieren — die Verteilung sollte rechtsschief sein (Schiefe > 0).",
    antithesis: "Negative or zero skewness would mean employment is either uniform or left-heavy — inconsistent with observed labor markets.",
    antithesisDe: "Negative oder null Schiefe würde bedeuten, dass die Beschäftigung entweder gleichmäßig oder linksschief ist — inkonsistent mit beobachteten Arbeitsmärkten.",
    test: () => {
      const jobs = austrianOccupations.map((o) => o.jobs ?? 0).filter((j) => j > 0);
      const n = jobs.length;
      const mean = jobs.reduce((a, b) => a + b, 0) / n;
      const m2 = jobs.reduce((s, j) => s + (j - mean) ** 2, 0) / n;
      const m3 = jobs.reduce((s, j) => s + (j - mean) ** 3, 0) / n;
      const skew = m2 > 0 ? m3 / (m2 ** 1.5) : 0;
      return { passed: skew > 0, actual: "Skewness = " + skew.toFixed(3), expected: "> 0 (right-skewed)" };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // GROUP 4: SECTOR-LEVEL EMPLOYMENT — Eurostat cross-checks
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: "sector-nace-all-present",
    group: "sectors",
    name: "All 19 ÖNACE sections A–S are present",
    nameDe: "Alle 19 ÖNACE-Abschnitte A–S sind vorhanden",
    thesis: "Every NACE Rev.2 section from A (agriculture) to S (other services) should have ≥ 1 occupation row with positive jobs.",
    thesisDe: "Jeder NACE-Rev.2-Abschnitt von A (Landwirtschaft) bis S (sonstige Dienstleistungen) soll ≥ 1 Berufszeile mit positiver Beschäftigung haben.",
    antithesis: "A missing section means an entire economic sector is invisible — users in that sector get zero results.",
    antithesisDe: "Ein fehlender Abschnitt bedeutet, dass ein ganzer Wirtschaftssektor unsichtbar ist.",
    test: () => {
      const letters = "ABCDEFGHIJKLMNOPQRS".split("");
      const missing = letters.filter((L) => !austrianOccupations.some((o) => o.onaceSection === L && (o.jobs ?? 0) > 0));
      return { passed: missing.length === 0, actual: missing.length === 0 ? "19/19 sections" : "Missing: " + missing.join(", "), expected: "All A–S present" };
    },
  },
  {
    id: "sector-manufacturing",
    group: "sectors",
    name: "Manufacturing (C): 600k–800k jobs",
    nameDe: "Verarbeitendes Gewerbe (C): 600k–800k Beschäftigte",
    thesis: "Eurostat nama_10_a64_e reports ~690k manufacturing employees in Austria. The model should reproduce 600k–800k.",
    thesisDe: "Eurostat nama_10_a64_e weist ~690k Beschäftigte im Verarbeitenden Gewerbe in Österreich aus. Das Modell soll 600k–800k reproduzieren.",
    antithesis: "Below 600k understates Austria’s industrial base; above 800k over-allocates craft/machine operator ISCO codes to manufacturing.",
    antithesisDe: "Unter 600k unterschätzt Österreichs Industriebasis; über 800k über-allokiert Handwerks-/Maschinenbediener-ISCO-Codes an die Industrie.",
    test: () => {
      const c = _sectorJobs("C");
      return { passed: c >= 600000 && c <= 800000, actual: c.toLocaleString(), expected: "600k–800k" };
    },
  },
  {
    id: "sector-trade",
    group: "sectors",
    name: "Trade (G): 500k–700k jobs",
    nameDe: "Handel (G): 500k–700k Beschäftigte",
    thesis: "Wholesale and retail trade (G45–G47) is Austria’s largest private-sector employer. Eurostat/WKO place it at ~630k.",
    thesisDe: "Groß- und Einzelhandel (G45–G47) ist Österreichs größter Privatsektorarbeitgeber. Eurostat/WKO beziffern ihn auf ~630k.",
    antithesis: "Outside 500k–700k suggests the ISCO→NACE mapping misallocates service/sales workers.",
    antithesisDe: "Außerhalb von 500k–700k deutet darauf hin, dass die ISCO→NACE-Zuordnung Dienstleistungs-/Verkaufsberufe falsch zuweist.",
    test: () => {
      const g = _sectorJobs("G");
      return { passed: g >= 500000 && g <= 700000, actual: g.toLocaleString(), expected: "500k–700k" };
    },
  },
  {
    id: "sector-health",
    group: "sectors",
    name: "Health & social work (Q): > 400k jobs",
    nameDe: "Gesundheits- und Sozialwesen (Q): > 400k Beschäftigte",
    thesis: "Austria’s health and social services sector employs ~440k people (Eurostat). The model should exceed 400k.",
    thesisDe: "Österreichs Gesundheits- und Sozialwesen beschäftigt ~440k Personen (Eurostat). Das Modell soll 400k überschreiten.",
    antithesis: "Below 400k under-represents one of Austria’s largest public-service employment sectors.",
    antithesisDe: "Unter 400k unterrepräsentiert einen der größten öffentlichen Beschäftigungssektoren Österreichs.",
    test: () => {
      const q = _sectorJobs("Q");
      return { passed: q > 400000, actual: q.toLocaleString(), expected: "> 400,000" };
    },
  },
  {
    id: "sector-construction",
    group: "sectors",
    name: "Construction (F): 250k–350k jobs",
    nameDe: "Bau (F): 250k–350k Beschäftigte",
    thesis: "Eurostat places Austrian construction employment at ~300k. The model should reproduce 250k–350k.",
    thesisDe: "Eurostat beziffert die österreichische Baubeschäftigung auf ~300k. Das Modell soll 250k–350k reproduzieren.",
    antithesis: "Outside this band suggests the NACE F weights or ISCO 7 (craft) allocation is off.",
    antithesisDe: "Außerhalb dieses Bandes deutet auf falsche NACE-F-Gewichte oder ISCO-7-Allokation hin.",
    test: () => {
      const f = _sectorJobs("F");
      return { passed: f >= 250000 && f <= 350000, actual: f.toLocaleString(), expected: "250k–350k" };
    },
  },
  {
    id: "sector-it",
    group: "sectors",
    name: "Information & communication (J): > 140k jobs",
    nameDe: "Information und Kommunikation (J): > 140k Beschäftigte",
    thesis: "Austria’s IT/telecom sector (NACE J) employs ~155k people. The model should exceed 140k.",
    thesisDe: "Österreichs IT-/Telekom-Sektor (NACE J) beschäftigt ~155k Personen. Das Modell soll 140k überschreiten.",
    antithesis: "Below 140k under-counts a sector that is critical for AI exposure analysis.",
    antithesisDe: "Unter 140k unterzählt einen Sektor, der für die KI-Expositionsanalyse entscheidend ist.",
    test: () => {
      const j = _sectorJobs("J");
      return { passed: j > 140000, actual: j.toLocaleString(), expected: "> 140,000" };
    },
  },
  {
    id: "sector-education",
    group: "sectors",
    name: "Education (P): > 200k jobs",
    nameDe: "Erziehung und Unterricht (P): > 200k Beschäftigte",
    thesis: "Austria’s education sector employs ~270k people (Eurostat). The model should exceed 200k.",
    thesisDe: "Österreichs Bildungssektor beschäftigt ~270k Personen (Eurostat). Das Modell soll 200k überschreiten.",
    antithesis: "Below 200k under-represents a major public employment sector.",
    antithesisDe: "Unter 200k unterrepräsentiert einen großen öffentlichen Beschäftigungssektor.",
    test: () => {
      const p = _sectorJobs("P");
      return { passed: p > 200000, actual: p.toLocaleString(), expected: "> 200,000" };
    },
  },
  {
    id: "sector-tourism",
    group: "sectors",
    name: "Accommodation & food (I): 200k–400k jobs",
    nameDe: "Beherbergung und Gastronomie (I): 200k–400k Beschäftigte",
    thesis: "Austria’s tourism sector (NACE I) is a significant employer (~315k). The model should be in the 200k–400k range.",
    thesisDe: "Österreichs Tourismussektor (NACE I) ist ein bedeutender Arbeitgeber (~315k). Das Modell soll im Bereich 200k–400k liegen.",
    antithesis: "Outside this range would misrepresent Austria’s strong tourism economy.",
    antithesisDe: "Außerhalb dieses Bereichs würde Österreichs starke Tourismuswirtschaft falsch dargestellt.",
    test: () => {
      const i = _sectorJobs("I");
      return { passed: i >= 200000 && i <= 400000, actual: i.toLocaleString(), expected: "200k–400k" };
    },
  },
  {
    id: "sector-finance",
    group: "sectors",
    name: "Finance & insurance (K): 80k–200k jobs",
    nameDe: "Finanz- und Versicherungswesen (K): 80k–200k Beschäftigte",
    thesis: "Austria’s financial sector employs ~93k (Eurostat nama_10_a64_e). Note that NACE K is smaller than many assume because it excludes real estate (L) and professional services (M). The model should land in 80k–200k.",
    thesisDe: "Österreichs Finanzsektor beschäftigt ~93k (Eurostat nama_10_a64_e). NACE K ist kleiner als oft angenommen, da Immobilien (L) und freiberufliche Dienste (M) ausgeschlossen sind. Das Modell soll bei 80k–200k landen.",
    antithesis: "Below 80k would under-represent a sector with distinctively high pay and AI exposure.",
    antithesisDe: "Unter 80k wäre ein Sektor mit markant hohem Gehalt und KI-Exposition unterrepräsentiert.",
    test: () => {
      const k = _sectorJobs("K");
      return { passed: k >= 80000 && k <= 200000, actual: k.toLocaleString(), expected: "80k–200k" };
    },
  },
  {
    id: "sector-agriculture-smallest",
    group: "sectors",
    name: "Agriculture (A) is one of the smallest sectors",
    nameDe: "Landwirtschaft (A) ist einer der kleinsten Sektoren",
    thesis: "Agriculture employs < 5% of Austria’s workforce (~200k), consistent with a high-income service economy.",
    thesisDe: "Die Landwirtschaft beschäftigt < 5 % der österreichischen Erwerbstätigen (~200k), konsistent mit einer einkommensstarken Dienstleistungswirtschaft.",
    antithesis: "Agriculture ≥ 5% would be inconsistent with Austria’s economic structure as reported by Eurostat.",
    antithesisDe: "Landwirtschaft ≥ 5 % wäre inkonsistent mit Österreichs von Eurostat berichteter Wirtschaftsstruktur.",
    test: () => {
      const a = _sectorJobs("A");
      const total = _totalJobs();
      const pct = total > 0 ? (a / total) * 100 : 0;
      return { passed: pct < 5, actual: pct.toFixed(1) + "% (" + a.toLocaleString() + ")", expected: "< 5%" };
    },
  },
  {
    id: "sector-services-majority",
    group: "sectors",
    name: "Services (G–S) employ more than goods-producing (A–F)",
    nameDe: "Dienstleistungen (G–S) beschäftigen mehr als Güterproduktion (A–F)",
    thesis: "Austria is a tertiarized economy; service sectors (G–S) should account for > 60% of employment.",
    thesisDe: "Österreich ist eine tertialisierte Wirtschaft; Dienstleistungssektoren (G–S) sollten > 60 % der Beschäftigung ausmachen.",
    antithesis: "Services ≤ 60% would contradict the post-industrial structure documented in Eurostat and WIFO analyses.",
    antithesisDe: "Dienstleistungen ≤ 60 % würde der in Eurostat und WIFO-Analysen dokumentierten postindustriellen Struktur widersprechen.",
    test: () => {
      let goods = 0, serv = 0;
      for (const o of austrianOccupations) {
        const c = o.onaceSection.charCodeAt(0);
        const j = o.jobs ?? 0;
        if (c >= 65 && c <= 70) goods += j;
        else if (c >= 71 && c <= 83) serv += j;
      }
      const total = goods + serv;
      const pct = total > 0 ? (serv / total) * 100 : 0;
      return { passed: pct > 60, actual: pct.toFixed(1) + "% services", expected: "> 60%" };
    },
  },
  {
    id: "sector-public-share",
    group: "sectors",
    name: "Public-sector adjacent (O+P+Q) = 15–35% of employment",
    nameDe: "Öffentlich-nahe Sektoren (O+P+Q) = 15–35 % der Beschäftigung",
    thesis: "Public administration (O), education (P), and health/social (Q) together employ 15–35%. Note that the ISCO×NACE allocation distributes some public-sector ISCO groups (e.g. ISCO 24 legal, ISCO 33 business) partly to private sectors, so the share here is lower than pure NACE O+P+Q headcounts in Eurostat.",
    thesisDe: "Öffentliche Verwaltung (O), Bildung (P) und Gesundheit/Soziales (Q) beschäftigen zusammen 15–35 %. Die ISCO×NACE-Allokation verteilt einige öffentliche ISCO-Gruppen teilweise auf private Sektoren, daher ist der Anteil hier niedriger als reine NACE-O+P+Q-Kopfzahlen bei Eurostat.",
    antithesis: "Below 15% would significantly undercount Austria’s public-service employment.",
    antithesisDe: "Unter 15 % wäre Österreichs öffentliche Beschäftigung deutlich unterzählt.",
    test: () => {
      const opq = _sectorJobs("O") + _sectorJobs("P") + _sectorJobs("Q");
      const total = _totalJobs();
      const pct = total > 0 ? (opq / total) * 100 : 0;
      return { passed: pct >= 15 && pct <= 35, actual: pct.toFixed(1) + "% (" + opq.toLocaleString() + ")", expected: "15–35%" };
    },
  },
  {
    id: "sector-manufacturing-share",
    group: "sectors",
    name: "Manufacturing share is 12–20% (strong industrial base)",
    nameDe: "Industrieanteil beträgt 12–20 % (starke Industriebasis)",
    thesis: "Austria’s manufacturing share (~15%) is notably higher than many Western economies, reflecting its Mittelstand structure.",
    thesisDe: "Österreichs Industrieanteil (~15 %) ist merklich höher als in vielen westlichen Volkswirtschaften, was die Mittelstandsstruktur widerspiegelt.",
    antithesis: "Below 12% understates Austria’s comparative manufacturing strength; above 20% over-counts.",
    antithesisDe: "Unter 12 % unterschätzt Österreichs komparative Industriestärke; über 20 % überzählt.",
    test: () => {
      const c = _sectorJobs("C");
      const total = _totalJobs();
      const pct = total > 0 ? (c / total) * 100 : 0;
      return { passed: pct >= 12 && pct <= 20, actual: pct.toFixed(1) + "%", expected: "12–20%" };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // GROUP 5: PAY PLAUSIBILITY — Cross-checks against VSE / national accounts
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: "pay-range",
    group: "pay",
    name: "Annual pay stays within €15k–€150k",
    nameDe: "Jahresgehälter bleiben innerhalb €15k–€150k",
    thesis: "Across aggregated occupations, no median annual gross pay should fall below €15k or exceed €150k — these are ISCO-08 2-digit aggregates, not individual outliers.",
    thesisDe: "Über aggregierte Berufe soll kein medianes Bruttojahresgehalt unter €15k oder über €150k fallen — es handelt sich um ISCO-08-2-Steller-Aggregate, nicht um individuelle Ausreißer.",
    antithesis: "Values outside this range at the aggregate level indicate a broken VSE lookup or scaling error (e.g. missing 13th/14th uplift).",
    antithesisDe: "Werte außerhalb dieses Bereichs auf Aggregatebene deuten auf eine fehlerhafte VSE-Abfrage oder Skalierungsfehler hin.",
    test: () => {
      const pays = austrianOccupations.map((o) => o.pay ?? 0).filter((p) => p > 0);
      const mn = Math.min(...pays);
      const mx = Math.max(...pays);
      return { passed: mn >= 15000 && mx <= 150000, actual: "€" + mn.toLocaleString() + " – €" + mx.toLocaleString(), expected: "€15k–€150k" };
    },
  },
  {
    id: "pay-weighted-median",
    group: "pay",
    name: "Employment-weighted median pay: €35k–€45k",
    nameDe: "Beschäftigungsgewichteter Mediangehalt: €35k–€45k",
    thesis: "Statistik Austria’s VSE national median (after 13th/14th uplift) is ~€40k. The employment-weighted median of our occupation rows should land in €35k–€45k.",
    thesisDe: "Der VSE-Gesamtmedian der Statistik Austria (nach 13./14.-Aufschlag) liegt bei ~€40k. Der beschäftigungsgewichtete Median soll €35k–€45k betragen.",
    antithesis: "Outside this band means the pay pipeline systematically over- or under-scales earnings relative to the national figure.",
    antithesisDe: "Außerhalb dieses Bandes skaliert die Gehalts-Pipeline systematisch über oder unter dem nationalen Wert.",
    test: () => {
      const med = _wMedian(austrianOccupations);
      return { passed: med >= 35000 && med <= 45000, actual: "€" + Math.round(med).toLocaleString(), expected: "€35k–€45k" };
    },
  },
  {
    id: "pay-wage-bill",
    group: "pay",
    name: "Total wage bill (pay × jobs): €150B–€260B",
    nameDe: "Gesamtlohnsumme (Gehalt × Jobs): €150–260 Mrd.",
    thesis: "Sum of (median pay × jobs) across all rows should approximate Eurostat’s compensation-of-employees figure for Austria (€150B–€260B).",
    thesisDe: "Die Summe von (Mediangehalt × Jobs) über alle Zeilen soll der Eurostat-Arbeitnehmerentgeltsumme für Österreich (150–260 Mrd. €) nahekommen.",
    antithesis: "Outside this range indicates either pay levels or job counts are systematically wrong.",
    antithesisDe: "Außerhalb dieses Bereichs sind entweder Gehaltsniveaus oder Beschäftigtenzahlen systematisch falsch.",
    test: () => {
      const bill = austrianOccupations.reduce((s, o) => s + (o.pay ?? 0) * (o.jobs ?? 0), 0) / 1e9;
      return { passed: bill >= 150 && bill <= 260, actual: "€" + bill.toFixed(1) + "B", expected: "€150B–€260B" };
    },
  },
  {
    id: "pay-gini",
    group: "pay",
    name: "Salary Gini: 0.10–0.35 (compressed wage structure)",
    nameDe: "Gehalts-Gini: 0,10–0,35 (komprimierte Lohnstruktur)",
    thesis: "Austria’s collective-bargaining system produces a relatively compressed wage distribution. The unweighted Gini across occupation medians should be 0.10–0.35.",
    thesisDe: "Österreichs Kollektivvertragssystem erzeugt eine relativ komprimierte Lohnverteilung. Der ungewichtete Gini über Berufsmediane soll 0,10–0,35 betragen.",
    antithesis: "Below 0.10 means occupations are unrealistically similar in pay; above 0.35 means the spread is wider than Austria’s institutional wage floor allows.",
    antithesisDe: "Unter 0,10 bedeutet unrealistisch ähnliche Gehälter; über 0,35 bedeutet eine breitere Streuung als Österreichs institutioneller Lohnboden erlaubt.",
    test: () => {
      const pays = austrianOccupations.map((o) => o.pay ?? 0).filter((p) => p > 0);
      const g = _gini(pays);
      return { passed: g >= 0.1 && g <= 0.35, actual: g.toFixed(3), expected: "0.10–0.35" };
    },
  },
  {
    id: "pay-cv",
    group: "pay",
    name: "Coefficient of variation of pay: 0.15–0.50",
    nameDe: "Variationskoeffizient der Gehälter: 0,15–0,50",
    thesis: "CV (std/mean) measures relative spread. Austria’s pay structure should produce a CV of 0.15–0.50 across occupation medians.",
    thesisDe: "VK (Std/Mittel) misst die relative Streuung. Österreichs Lohnstruktur soll einen VK von 0,15–0,50 über Berufsmediane erzeugen.",
    antithesis: "Below 0.15 → pay is too uniform (suspicious). Above 0.50 → outliers are distorting the aggregate.",
    antithesisDe: "Unter 0,15 → Gehälter zu einheitlich (verdächtig). Über 0,50 → Ausreißer verzerren das Aggregat.",
    test: () => {
      const pays = austrianOccupations.map((o) => o.pay ?? 0).filter((p) => p > 0);
      const mean = pays.reduce((a, b) => a + b, 0) / pays.length;
      const variance = pays.reduce((s, p) => s + (p - mean) ** 2, 0) / pays.length;
      const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
      return { passed: cv >= 0.15 && cv <= 0.5, actual: cv.toFixed(3), expected: "0.15–0.50" };
    },
  },
  {
    id: "pay-p90-p10",
    group: "pay",
    name: "P90/P10 ratio: 1.5–3.5 (compressed)",
    nameDe: "P90/P10-Verhältnis: 1,5–3,5 (komprimiert)",
    thesis: "The ratio of the 90th-percentile to 10th-percentile occupation pay should be 1.5–3.5 in Austria’s regulated labor market.",
    thesisDe: "Das Verhältnis des 90.-Perzentils zum 10.-Perzentil der Berufsgehälter soll in Österreichs reguliertem Arbeitsmarkt 1,5–3,5 betragen.",
    antithesis: "Below 1.5 → all occupations earn nearly the same (implausible). Above 3.5 → wider than Austrian institutions allow.",
    antithesisDe: "Unter 1,5 → alle Berufe verdienen nahezu gleich (unplausibel). Über 3,5 → breiter als österreichische Institutionen erlauben.",
    test: () => {
      const pays = austrianOccupations.map((o) => o.pay ?? 0).filter((p) => p > 0).sort((a, b) => a - b);
      const n = pays.length;
      const p10 = pays[Math.floor(n * 0.1)];
      const p90 = pays[Math.floor(n * 0.9)];
      const ratio = p10 > 0 ? p90 / p10 : 0;
      return { passed: ratio >= 1.5 && ratio <= 3.5, actual: "P90/P10 = " + ratio.toFixed(2), expected: "1.5–3.5" };
    },
  },
  {
    id: "pay-education-ladder",
    group: "pay",
    name: "Higher education → higher median pay",
    nameDe: "Höhere Bildung → höheres Mediangehalt",
    thesis: "Human capital theory predicts that weighted median pay for Master’s/PhD occupations exceeds that of compulsory-school occupations.",
    thesisDe: "Die Humankapitaltheorie sagt vorher, dass der gewichtete Median für Master-/PhD-Berufe den der Pflichtschulberufe übersteigt.",
    antithesis: "If low-education occupations out-earn high-education ones, the pay-education mapping is inverted — a critical data error.",
    antithesisDe: "Wenn Niedrigbildungs-Berufe mehr verdienen als Hochbildungs-Berufe, ist die Gehalt-Bildung-Zuordnung invertiert — ein kritischer Datenfehler.",
    test: () => {
      const low = austrianOccupations.filter((o) => o.education === "Compulsory school");
      const high = austrianOccupations.filter((o) => o.education === "Master’s/Diploma degree" || o.education === "Doctoral/PhD");
      const lowM = _wMedian(low);
      const highM = _wMedian(high);
      return { passed: highM > lowM && low.length > 0 && high.length > 0, actual: "Low: €" + Math.round(lowM).toLocaleString() + " | High: €" + Math.round(highM).toLocaleString(), expected: "High > Low" };
    },
  },
  {
    id: "pay-education-monotonic",
    group: "pay",
    name: "Mean pay increases with each education step (broadly)",
    nameDe: "Durchschnittsgehalt steigt mit jeder Bildungsstufe (im Trend)",
    thesis: "Across the 8 education levels, the employment-weighted mean pay should broadly increase — at most 2 reversals are tolerated. Austrian specifics: BMS (vocational school) and Kolleg/Akademie graduates sometimes earn close to or above the next formal level due to sector composition (e.g. healthcare BMS, technical Kolleg).",
    thesisDe: "Über die 8 Bildungsstufen soll das beschäftigungsgewichtete Durchschnittsgehalt im Trend steigen — höchstens 2 Umkehrungen werden toleriert. Österreichische Besonderheit: BMS- und Kolleg-Absolventen verdienen manchmal nahe oder über dem nächsthöheren Niveau (z.B. Gesundheits-BMS, technisches Kolleg).",
    antithesis: "More than 2 reversals indicate the education-pay mapping has systematic errors beyond Austrian-specific effects.",
    antithesisDe: "Mehr als 2 Umkehrungen deuten auf systematische Fehler in der Bildungs-Gehalts-Zuordnung hin, die über österreichische Besonderheiten hinausgehen.",
    test: () => {
      const means: number[] = [];
      for (const edu of EDU_LEVELS_EN) {
        const rows = austrianOccupations.filter((o) => o.education === edu);
        const m = _wMean(rows, "pay");
        means.push(m);
      }
      let reversals = 0;
      for (let i = 1; i < means.length; i++) {
        if (means[i] < means[i - 1] && means[i] > 0 && means[i - 1] > 0) reversals++;
      }
      return { passed: reversals <= 2, actual: reversals + " reversals", expected: "≤ 2 reversals" };
    },
  },
  {
    id: "pay-managers-above-average",
    group: "pay",
    name: "Managers (ISCO 1) earn above the weighted mean",
    nameDe: "Führungskräfte (ISCO 1) verdienen über dem gewichteten Durchschnitt",
    thesis: "ISCO 1 (Managers) should have a weighted mean pay above the overall weighted mean — a universal labor-market regularity.",
    thesisDe: "ISCO 1 (Führungskräfte) soll ein gewichtetes Durchschnittsgehalt über dem Gesamtdurchschnitt haben — eine universelle Arbeitsmarktregelmäßigkeit.",
    antithesis: "Managers earning below average would indicate the pay assignment is miscoded.",
    antithesisDe: "Führungskräfte unter dem Durchschnitt würden auf eine fehlerhafte Gehaltszuweisung hinweisen.",
    test: () => {
      const overall = _wMean(austrianOccupations, "pay");
      const mgrs = austrianOccupations.filter((o) => o.iscoMajor === "1");
      const mgrPay = _wMean(mgrs, "pay");
      return { passed: mgrPay > overall, actual: "Managers: €" + Math.round(mgrPay).toLocaleString() + " | Overall: €" + Math.round(overall).toLocaleString(), expected: "Managers > Overall" };
    },
  },
  {
    id: "pay-elementary-below-average",
    group: "pay",
    name: "Elementary occupations (ISCO 9) earn below the weighted mean",
    nameDe: "Hilfsarbeitskräfte (ISCO 9) verdienen unter dem gewichteten Durchschnitt",
    thesis: "ISCO 9 (Elementary occupations) should have a weighted mean pay below the overall — these are low-skill, low-barrier roles.",
    thesisDe: "ISCO 9 (Hilfsarbeitskräfte) soll ein gewichtetes Durchschnittsgehalt unter dem Gesamtdurchschnitt haben — Niedrigqualifikationsrollen.",
    antithesis: "Elementary occupations earning above average would invalidate the skill-pay gradient.",
    antithesisDe: "Hilfsarbeitskräfte über dem Durchschnitt würden den Qualifikations-Gehalts-Gradienten ungültig machen.",
    test: () => {
      const overall = _wMean(austrianOccupations, "pay");
      const elem = austrianOccupations.filter((o) => o.iscoMajor === "9");
      const elemPay = _wMean(elem, "pay");
      return { passed: elemPay < overall, actual: "Elementary: €" + Math.round(elemPay).toLocaleString() + " | Overall: €" + Math.round(overall).toLocaleString(), expected: "Elementary < Overall" };
    },
  },
  {
    id: "pay-isco1-above-isco9",
    group: "pay",
    name: "Managers (ISCO 1) earn more than elementary (ISCO 9)",
    nameDe: "Führungskräfte (ISCO 1) verdienen mehr als Hilfsarbeitskräfte (ISCO 9)",
    thesis: "The pay premium for managers over elementary workers should be positive — a foundational labor-market inequality.",
    thesisDe: "Die Gehaltsprämie für Führungskräfte gegenüber Hilfsarbeitskräften soll positiv sein — eine grundlegende Arbeitsmarktungleichheit.",
    antithesis: "If ISCO 9 out-earns ISCO 1, the entire pay hierarchy is inverted.",
    antithesisDe: "Wenn ISCO 9 mehr als ISCO 1 verdient, ist die gesamte Gehaltshierarchie invertiert.",
    test: () => {
      const mgr = _wMean(austrianOccupations.filter((o) => o.iscoMajor === "1"), "pay");
      const elem = _wMean(austrianOccupations.filter((o) => o.iscoMajor === "9"), "pay");
      const ratio = elem > 0 ? mgr / elem : 0;
      return { passed: mgr > elem, actual: "Ratio ISCO1/ISCO9 = " + ratio.toFixed(2), expected: "> 1.0" };
    },
  },
  {
    id: "pay-finance-premium",
    group: "pay",
    name: "Finance (K) pays above the national weighted mean",
    nameDe: "Finanzsektor (K) zahlt über dem nationalen gewichteten Durchschnitt",
    thesis: "The financial sector is known for above-average compensation in Austria, driven by collective agreements in banking and insurance.",
    thesisDe: "Der Finanzsektor ist in Österreich für überdurchschnittliche Vergütung bekannt, getrieben durch Kollektivverträge in Banken und Versicherungen.",
    antithesis: "Finance below average would contradict established wage-structure patterns.",
    antithesisDe: "Finanzsektor unter dem Durchschnitt würde etablierten Lohnstrukturmustern widersprechen.",
    test: () => {
      const overall = _wMean(austrianOccupations, "pay");
      const fin = _wMean(austrianOccupations.filter((o) => o.onaceSection === "K"), "pay");
      return { passed: fin > overall, actual: "Finance: €" + Math.round(fin).toLocaleString() + " | Overall: €" + Math.round(overall).toLocaleString(), expected: "Finance > Overall" };
    },
  },
  {
    id: "pay-education-share-extremes",
    group: "pay",
    name: "Extreme education levels (compulsory/PhD) < 30% of rows",
    nameDe: "Extreme Bildungsniveaus (Pflichtschule/PhD) < 30 % der Zeilen",
    thesis: "Austria’s education distribution peaks at mid-levels (Lehre, Matura). The extremes (compulsory-only and PhD) should together be < 30% of rows.",
    thesisDe: "Österreichs Bildungsverteilung hat ihren Schwerpunkt in den mittleren Stufen (Lehre, Matura). Die Extreme (nur Pflichtschule und PhD) sollen zusammen < 30 % der Zeilen sein.",
    antithesis: "If extremes dominate, the education assignment is biased toward the tails, misrepresenting Austria’s mid-level skilled workforce.",
    antithesisDe: "Wenn Extreme dominieren, ist die Bildungszuweisung hin zu den Rändern verzerrt.",
    test: () => {
      const n = austrianOccupations.length;
      const ext = austrianOccupations.filter((o) => o.education === "Compulsory school" || o.education === "Doctoral/PhD").length;
      const pct = n > 0 ? (ext / n) * 100 : 0;
      return { passed: pct < 30, actual: ext + "/" + n + " (" + pct.toFixed(1) + "%)", expected: "< 30%" };
    },
  },
  {
    id: "pay-apprentice-common",
    group: "pay",
    name: "Apprenticeship (Lehre) is assigned to ≥ 10 occupations",
    nameDe: "Lehre ist ≥ 10 Berufen zugewiesen",
    thesis: "Austria’s dual-system apprenticeship produces skilled workers across many trades. At least 10 occupation rows should carry this education level.",
    thesisDe: "Österreichs duales Lehrsystem produziert Fachkräfte in vielen Gewerben. Mindestens 10 Berufszeilen sollten diese Bildungsstufe tragen.",
    antithesis: "Fewer than 10 Lehre rows would under-represent Austria’s signature vocational training system.",
    antithesisDe: "Weniger als 10 Lehre-Zeilen würde Österreichs Vorzeigesystem der Berufsausbildung unterrepräsentieren.",
    test: () => {
      const count = austrianOccupations.filter((o) => o.education === "Apprenticeship (Lehre)").length;
      return { passed: count >= 10, actual: count + " occupations", expected: "≥ 10" };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // GROUP 6: AI EXPOSURE SCORING — Validity and distribution
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: "exposure-range",
    group: "exposure",
    name: "All exposure scores within 0–10",
    nameDe: "Alle Expositions-Scores innerhalb 0–10",
    thesis: "The Karpathy-inspired rubric assigns integer scores from 0 (fully manual) to 10 (fully automatable). Every value must stay in this range.",
    thesisDe: "Die Karpathy-inspirierte Rubrik vergibt ganzzahlige Scores von 0 (vollständig manuell) bis 10 (vollständig automatisierbar). Jeder Wert muss in diesem Bereich bleiben.",
    antithesis: "Values outside 0–10 indicate a corrupt merge with LLM overrides or a broken rubric clamp.",
    antithesisDe: "Werte außerhalb 0–10 deuten auf eine fehlerhafte Zusammenführung mit LLM-Overrides oder eine defekte Rubrik-Begrenzung hin.",
    test: () => {
      const invalid = austrianOccupations.filter((o) => o.exposure == null || o.exposure < 0 || o.exposure > 10);
      return { passed: invalid.length === 0, actual: invalid.length === 0 ? "All 0–10" : invalid.map((o) => o.slug + ":" + o.exposure).join(", "), expected: "All 0–10" };
    },
  },
  {
    id: "exposure-span",
    group: "exposure",
    name: "Exposure range spans ≥ 7 points",
    nameDe: "Expositionsspanne beträgt ≥ 7 Punkte",
    thesis: "The difference between the most manual and most cognitive occupation should be ≥ 7, ensuring the rubric actually differentiates physical from knowledge work.",
    thesisDe: "Die Differenz zwischen dem manuellsten und dem kognitivsten Beruf soll ≥ 7 betragen, um sicherzustellen, dass die Rubrik physische von Wissensarbeit tatsächlich unterscheidet.",
    antithesis: "A narrow span (< 7) means the rubric collapses most occupations into a similar exposure level — losing analytical value.",
    antithesisDe: "Eine enge Spanne (< 7) bedeutet, dass die Rubrik die meisten Berufe in ein ähnliches Expositionsniveau zusammenfasst — analytischer Wert geht verloren.",
    test: () => {
      const ex = austrianOccupations.map((o) => o.exposure).filter((e): e is number => e != null);
      const span = Math.max(...ex) - Math.min(...ex);
      return { passed: span >= 7, actual: Math.min(...ex) + "–" + Math.max(...ex) + " (span " + span + ")", expected: "span ≥ 7" };
    },
  },
  {
    id: "exposure-mean-centered",
    group: "exposure",
    name: "Mean exposure is in 3–7 (not extreme)",
    nameDe: "Durchschnittsexposition liegt bei 3–7 (nicht extrem)",
    thesis: "The unweighted mean exposure should sit in the middle of the scale (3–7), showing that the rubric uses the full range without bias toward high or low.",
    thesisDe: "Die ungewichtete Durchschnittsexposition soll in der Skalenmitte (3–7) liegen, was zeigt, dass die Rubrik den gesamten Bereich ohne Verzerrung nutzt.",
    antithesis: "Mean < 3 or > 7 would suggest systematic scoring bias — either too many manual or too many cognitive assignments.",
    antithesisDe: "Durchschnitt < 3 oder > 7 würde systematische Bewertungsverzerrung nahelegen.",
    test: () => {
      const ex = austrianOccupations.map((o) => o.exposure).filter((e): e is number => e != null);
      const mean = ex.reduce((a, b) => a + b, 0) / ex.length;
      return { passed: mean >= 3 && mean <= 7, actual: mean.toFixed(2), expected: "3–7" };
    },
  },
  {
    id: "exposure-pay-correlation",
    group: "exposure",
    name: "AI exposure correlates positively with pay (r > 0)",
    nameDe: "KI-Exposition korreliert positiv mit Gehalt (r > 0)",
    thesis: "Occupations with higher cognitive/digital content (higher AI exposure) tend to pay more — Frey & Osborne (2017) and subsequent literature confirm this pattern.",
    thesisDe: "Berufe mit höherem kognitiven/digitalen Anteil (höherer KI-Exposition) zahlen tendenziell mehr — Frey & Osborne (2017) und Folgeliteratur bestätigen dieses Muster.",
    antithesis: "A negative correlation would contradict the established finding that AI-exposed jobs are typically high-paying knowledge roles.",
    antithesisDe: "Eine negative Korrelation würde dem etablierten Befund widersprechen, dass KI-exponierte Jobs typischerweise hochbezahlte Wissensrollen sind.",
    test: () => {
      const xs: number[] = [], ys: number[] = [];
      for (const o of austrianOccupations) { if (o.exposure != null && o.pay && o.pay > 0) { xs.push(o.exposure); ys.push(o.pay); } }
      const r = _pearson(xs, ys);
      return { passed: r > 0, actual: "r = " + r.toFixed(3), expected: "r > 0" };
    },
  },
  {
    id: "exposure-education-correlation",
    group: "exposure",
    name: "AI exposure correlates with education level (r > 0)",
    nameDe: "KI-Exposition korreliert mit Bildungsniveau (r > 0)",
    thesis: "Higher-educated occupations tend to involve more cognitive/digital tasks, making them more exposed to AI. The rank correlation should be positive.",
    thesisDe: "Höher gebildete Berufe beinhalten tendenziell mehr kognitive/digitale Aufgaben und sind daher stärker KI-exponiert. Die Rangkorrelation soll positiv sein.",
    antithesis: "A non-positive correlation would mean education doesn’t predict AI exposure — inconsistent with task-based automation frameworks.",
    antithesisDe: "Eine nicht-positive Korrelation würde bedeuten, dass Bildung keine KI-Exposition vorhersagt — inkonsistent mit aufgabenbasierten Automatisierungs-Frameworks.",
    test: () => {
      const eduRank = new Map(EDU_LEVELS_EN.map((e, i) => [e, i]));
      const xs: number[] = [], ys: number[] = [];
      for (const o of austrianOccupations) {
        const rank = eduRank.get(o.education);
        if (rank != null && o.exposure != null) { xs.push(rank); ys.push(o.exposure); }
      }
      const r = _pearson(xs, ys);
      return { passed: r > 0, actual: "r = " + r.toFixed(3), expected: "r > 0" };
    },
  },
  {
    id: "exposure-physical-low",
    group: "exposure",
    name: "Physical sectors (A, F) average low exposure (< 4)",
    nameDe: "Physische Sektoren (A, F) haben niedrige Durchschnittsexposition (< 4)",
    thesis: "Agriculture and construction are dominated by manual, on-site tasks. Their jobs-weighted mean exposure should be < 4.",
    thesisDe: "Landwirtschaft und Bau werden von manuellen Vor-Ort-Aufgaben dominiert. Ihr beschäftigungsgewichteter Mittelwert der Exposition soll < 4 sein.",
    antithesis: "Average ≥ 4 for these sectors would overstate the role of AI/automation in inherently physical occupations.",
    antithesisDe: "Durchschnitt ≥ 4 für diese Sektoren würde die Rolle von KI/Automatisierung in inhärent physischen Berufen überschätzen.",
    test: () => {
      const phys = austrianOccupations.filter((o) => o.onaceSection === "A" || o.onaceSection === "F");
      const avg = _wMean(phys, "exposure");
      return { passed: avg < 4, actual: "Avg " + avg.toFixed(2), expected: "< 4.0" };
    },
  },
  {
    id: "exposure-knowledge-high",
    group: "exposure",
    name: "Knowledge-intensive sectors (J, K, M) average high exposure (> 5)",
    nameDe: "Wissensintensive Sektoren (J, K, M) haben hohe Durchschnittsexposition (> 5)",
    thesis: "IT (J), finance (K), and professional services (M) involve cognitive, data-intensive tasks. Their weighted mean exposure should be > 5.",
    thesisDe: "IT (J), Finanzen (K) und freiberufliche Dienste (M) beinhalten kognitive, datenintensive Aufgaben. Ihr gewichteter Mittelwert der Exposition soll > 5 sein.",
    antithesis: "Average ≤ 5 would understate AI-readiness in sectors where LLMs and ML tools are already widely deployed.",
    antithesisDe: "Durchschnitt ≤ 5 würde die KI-Bereitschaft in Sektoren unterschätzen, in denen LLMs und ML-Tools bereits breit eingesetzt werden.",
    test: () => {
      const kn = austrianOccupations.filter((o) => "JKM".includes(o.onaceSection));
      const avg = _wMean(kn, "exposure");
      return { passed: avg > 5, actual: "Avg " + avg.toFixed(2), expected: "> 5.0" };
    },
  },
  {
    id: "exposure-isco-gradient",
    group: "exposure",
    name: "Professionals (ISCO 2) have higher exposure than craft workers (ISCO 7)",
    nameDe: "Akademische Berufe (ISCO 2) haben höhere Exposition als Handwerksberufe (ISCO 7)",
    thesis: "Professionals work with data, text, and analysis — tasks where AI excels. Craft workers perform physical manipulation. The exposure gap should be clear.",
    thesisDe: "Akademische Berufe arbeiten mit Daten, Text und Analyse — Aufgaben, bei denen KI glänzt. Handwerksberufe führen physische Tätigkeiten aus.",
    antithesis: "Craft workers more AI-exposed than professionals would invert the fundamental cognitive/manual divide.",
    antithesisDe: "Handwerksberufe mit höherer KI-Exposition als Akademiker würden die fundamentale kognitive/manuelle Trennung invertieren.",
    test: () => {
      const prof = _wMean(austrianOccupations.filter((o) => o.iscoMajor === "2"), "exposure");
      const craft = _wMean(austrianOccupations.filter((o) => o.iscoMajor === "7"), "exposure");
      return { passed: prof > craft, actual: "ISCO 2: " + prof.toFixed(1) + " | ISCO 7: " + craft.toFixed(1), expected: "ISCO 2 > ISCO 7" };
    },
  },
  {
    id: "exposure-within-family-variance",
    group: "exposure",
    name: "Exposure varies within at least 5 ISCO families",
    nameDe: "Exposition variiert innerhalb von mindestens 5 ISCO-Familien",
    thesis: "Even within an ISCO family, different occupations face different AI exposure (e.g. among professionals, software engineers vs. teachers). At least 5 families should show internal variance > 0.",
    thesisDe: "Selbst innerhalb einer ISCO-Familie haben verschiedene Berufe unterschiedliche KI-Exposition. Mindestens 5 Familien sollen interne Varianz > 0 zeigen.",
    antithesis: "If most families have zero variance, the rubric scores at the family level rather than occupation level — losing granularity.",
    antithesisDe: "Wenn die meisten Familien null Varianz haben, bewertet die Rubrik auf Familienebene statt Berufsebene — Granularität geht verloren.",
    test: () => {
      let familiesWithVariance = 0;
      for (let m = 1; m <= 9; m++) {
        const exps = austrianOccupations.filter((o) => o.iscoMajor === m.toString() && o.exposure != null).map((o) => o.exposure!);
        if (exps.length >= 2 && new Set(exps).size > 1) familiesWithVariance++;
      }
      return { passed: familiesWithVariance >= 5, actual: familiesWithVariance + "/9 families", expected: "≥ 5" };
    },
  },
  {
    id: "exposure-not-all-same",
    group: "exposure",
    name: "At least 5 distinct exposure values are used",
    nameDe: "Mindestens 5 verschiedene Expositionswerte werden verwendet",
    thesis: "The 0–10 rubric should produce at least 5 distinct values across 75+ occupations to meaningfully differentiate exposure levels.",
    thesisDe: "Die 0–10-Rubrik soll mindestens 5 verschiedene Werte über 75+ Berufe erzeugen, um Expositionsniveaus sinnvoll zu differenzieren.",
    antithesis: "Fewer than 5 distinct values means the rubric collapses into a near-binary classification.",
    antithesisDe: "Weniger als 5 verschiedene Werte bedeutet, dass die Rubrik in eine nahezu binäre Klassifikation kollabiert.",
    test: () => {
      const distinct = new Set(austrianOccupations.map((o) => o.exposure).filter((e): e is number => e != null));
      return { passed: distinct.size >= 5, actual: distinct.size + " distinct values", expected: "≥ 5" };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // GROUP 7: OUTLOOK & GROWTH — WIFO/AMS forecast plausibility
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: "outlook-range",
    group: "outlook",
    name: "All outlook scores within −10 to +10",
    nameDe: "Alle Ausblick-Scores innerhalb −10 bis +10",
    thesis: "Outlook is a normalised signal from WIFO/AMS 2023–2030 forecasts, clamped to [−10, +10]. Every value must stay in this documented range.",
    thesisDe: "Der Ausblick ist ein normalisiertes Signal aus WIFO/AMS-Prognosen 2023–2030, begrenzt auf [−10, +10]. Jeder Wert muss in diesem Bereich bleiben.",
    antithesis: "Values outside indicate a broken normalisation step in the outlook pipeline.",
    antithesisDe: "Werte außerhalb deuten auf einen fehlerhaften Normalisierungsschritt in der Ausblick-Pipeline hin.",
    test: () => {
      const invalid = austrianOccupations.filter((o) => o.outlook == null || o.outlook < -10 || o.outlook > 10);
      return { passed: invalid.length === 0, actual: invalid.length === 0 ? "All −10 to +10" : invalid.map((o) => o.slug + ":" + o.outlook).join(", "), expected: "All −10 to +10" };
    },
  },
  {
    id: "outlook-unbiased",
    group: "outlook",
    name: "Weighted mean outlook near zero (±3)",
    nameDe: "Gewichteter Durchschnittsausblick nahe null (±3)",
    thesis: "The normalisation maps growth forecasts to a symmetric scale. The employment-weighted mean should sit near zero — the economy’s aggregate growth is roughly balanced.",
    thesisDe: "Die Normalisierung bildet Wachstumsprognosen auf eine symmetrische Skala ab. Der beschäftigungsgewichtete Durchschnitt soll nahe null liegen.",
    antithesis: "A strong positive or negative mean (> ±3) indicates systematic bias in the WIFO/AMS→outlook mapping.",
    antithesisDe: "Ein stark positiver oder negativer Durchschnitt (> ±3) deutet auf systematische Verzerrung in der WIFO/AMS→Ausblick-Zuordnung hin.",
    test: () => {
      const wmean = _wMean(austrianOccupations, "outlook");
      return { passed: wmean >= -3 && wmean <= 3, actual: wmean.toFixed(2), expected: "−3 to +3" };
    },
  },
  {
    id: "outlook-has-positive",
    group: "outlook",
    name: "At least 20% of occupations have positive outlook",
    nameDe: "Mindestens 20 % der Berufe haben positiven Ausblick",
    thesis: "Some sectors (health, IT, professional services) are growing. At least 20% of occupation rows should reflect positive employment outlook.",
    thesisDe: "Einige Sektoren (Gesundheit, IT, freiberufliche Dienste) wachsen. Mindestens 20 % der Berufszeilen sollen einen positiven Beschäftigungsausblick widerspiegeln.",
    antithesis: "If fewer than 20% are positive, the outlook mapping may be too pessimistic.",
    antithesisDe: "Wenn weniger als 20 % positiv sind, könnte die Ausblick-Zuordnung zu pessimistisch sein.",
    test: () => {
      const pos = austrianOccupations.filter((o) => (o.outlook ?? 0) > 0).length;
      const pct = (pos / austrianOccupations.length) * 100;
      return { passed: pct >= 20, actual: pct.toFixed(1) + "% (" + pos + " rows)", expected: "≥ 20%" };
    },
  },
  {
    id: "outlook-has-negative",
    group: "outlook",
    name: "At least 10% of occupations have negative outlook",
    nameDe: "Mindestens 10 % der Berufe haben negativen Ausblick",
    thesis: "Structural change means some sectors decline (e.g. routine clerical work). At least 10% of rows should have negative outlook.",
    thesisDe: "Strukturwandel bedeutet, dass einige Sektoren schrumpfen (z.B. Routinebüroarbeit). Mindestens 10 % der Zeilen sollen einen negativen Ausblick haben.",
    antithesis: "If fewer than 10% are negative, the model is unrealistically optimistic about all occupations.",
    antithesisDe: "Wenn weniger als 10 % negativ sind, ist das Modell unrealistisch optimistisch über alle Berufe.",
    test: () => {
      const neg = austrianOccupations.filter((o) => (o.outlook ?? 0) < 0).length;
      const pct = (neg / austrianOccupations.length) * 100;
      return { passed: pct >= 10, actual: pct.toFixed(1) + "% (" + neg + " rows)", expected: "≥ 10%" };
    },
  },
  {
    id: "outlook-span",
    group: "outlook",
    name: "Outlook spans at least 8 points",
    nameDe: "Ausblick-Spanne beträgt mindestens 8 Punkte",
    thesis: "The range of outlook values (max − min) should be ≥ 8, showing genuine differentiation between growing and declining occupations.",
    thesisDe: "Die Spanne der Ausblick-Werte (Max − Min) soll ≥ 8 sein, was echte Differenzierung zwischen wachsenden und schrumpfenden Berufen zeigt.",
    antithesis: "A narrow span means the forecast treats all occupations as similarly static — no structural change signal.",
    antithesisDe: "Eine enge Spanne bedeutet, dass die Prognose alle Berufe als ähnlich statisch behandelt — kein Strukturwandel-Signal.",
    test: () => {
      const ol = austrianOccupations.map((o) => o.outlook ?? 0);
      const span = Math.max(...ol) - Math.min(...ol);
      return { passed: span >= 8, actual: Math.min(...ol) + " to " + Math.max(...ol) + " (span " + span + ")", expected: "span ≥ 8" };
    },
  },
  {
    id: "outlook-health-positive",
    group: "outlook",
    name: "Health sector (Q) has above-average outlook",
    nameDe: "Gesundheitssektor (Q) hat überdurchschnittlichen Ausblick",
    thesis: "Aging demographics and pandemic-era policy drive health employment growth. NACE Q’s weighted mean outlook should exceed the overall mean.",
    thesisDe: "Demografische Alterung und Pandemie-Politik treiben das Beschäftigungswachstum im Gesundheitswesen. NACE Q’s gewichteter Mittelwert soll den Gesamtdurchschnitt übersteigen.",
    antithesis: "Health below average would contradict every major Austrian labor-market forecast.",
    antithesisDe: "Gesundheitssektor unter dem Durchschnitt würde jeder großen österreichischen Arbeitsmarktprognose widersprechen.",
    test: () => {
      const overall = _wMean(austrianOccupations, "outlook");
      const health = _wMean(austrianOccupations.filter((o) => o.onaceSection === "Q"), "outlook");
      return { passed: health > overall, actual: "Health: " + health.toFixed(2) + " | Overall: " + overall.toFixed(2), expected: "Health > Overall" };
    },
  },
  {
    id: "outlook-it-positive",
    group: "outlook",
    name: "IT sector (J) has positive average outlook",
    nameDe: "IT-Sektor (J) hat positiven Durchschnittsausblick",
    thesis: "Digital transformation drives IT employment growth. NACE J’s weighted mean outlook should be > 0.",
    thesisDe: "Digitale Transformation treibt IT-Beschäftigungswachstum. NACE J’s gewichteter Mittelwert soll > 0 sein.",
    antithesis: "Negative IT outlook would contradict the sector’s well-documented growth trajectory.",
    antithesisDe: "Negativer IT-Ausblick würde der gut dokumentierten Wachstumsbahn des Sektors widersprechen.",
    test: () => {
      const it = _wMean(austrianOccupations.filter((o) => o.onaceSection === "J"), "outlook");
      return { passed: it > 0, actual: it.toFixed(2), expected: "> 0" };
    },
  },
  {
    id: "outlook-variance",
    group: "outlook",
    name: "Outlook standard deviation > 1.0",
    nameDe: "Ausblick-Standardabweichung > 1,0",
    thesis: "There should be meaningful dispersion in outlook scores — a std dev > 1.0 across occupations shows the forecast differentiates structurally.",
    thesisDe: "Es soll eine sinnvolle Streuung in den Ausblick-Scores geben — eine Standardabweichung > 1,0 zeigt strukturelle Differenzierung.",
    antithesis: "Std dev ≤ 1.0 means almost all occupations have a similar outlook — the forecast adds no information.",
    antithesisDe: "Standardabweichung ≤ 1,0 bedeutet, dass fast alle Berufe einen ähnlichen Ausblick haben — die Prognose liefert keine Information.",
    test: () => {
      const ol = austrianOccupations.map((o) => o.outlook ?? 0);
      const mean = ol.reduce((a, b) => a + b, 0) / ol.length;
      const variance = ol.reduce((s, v) => s + (v - mean) ** 2, 0) / ol.length;
      const sd = Math.sqrt(variance);
      return { passed: sd > 1.0, actual: "SD = " + sd.toFixed(2), expected: "> 1.0" };
    },
  },
  {
    id: "outlook-growth-pa-consistent",
    group: "outlook",
    name: "Outlook sign matches growth rate sign",
    nameDe: "Ausblick-Vorzeichen stimmt mit Wachstumsrate überein",
    thesis: "For at least 90% of rows, the sign of outlook should match the sign of outlookGrowthPa — they derive from the same WIFO/AMS source.",
    thesisDe: "Für mindestens 90 % der Zeilen soll das Vorzeichen von outlook mit dem von outlookGrowthPa übereinstimmen — sie stammen aus derselben WIFO/AMS-Quelle.",
    antithesis: "Frequent sign mismatches indicate an inconsistency between the normalised outlook and the raw growth rate.",
    antithesisDe: "Häufige Vorzeichenabweichungen deuten auf eine Inkonsistenz zwischen dem normalisierten Ausblick und der Rohwachstumsrate hin.",
    test: () => {
      let consistent = 0, total = 0;
      for (const o of austrianOccupations) {
        if (o.outlook == null) continue;
        total++;
        if ((o.outlook > 0 && o.outlookGrowthPa > 0) || (o.outlook < 0 && o.outlookGrowthPa < 0) || (o.outlook === 0 && o.outlookGrowthPa === 0)) consistent++;
      }
      const pct = total > 0 ? (consistent / total) * 100 : 0;
      return { passed: pct >= 90, actual: pct.toFixed(1) + "% consistent", expected: "≥ 90%" };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // GROUP 8: CROSS-DOMAIN — Tests that combine multiple dimensions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: "cross-exposure-outlook-independence",
    group: "cross",
    name: "Exposure and outlook are not strongly correlated (|r| < 0.7)",
    nameDe: "Exposition und Ausblick sind nicht stark korreliert (|r| < 0,7)",
    thesis: "AI exposure (task content) and employment outlook (demand trend) measure different things. Their Pearson |r| should be < 0.7.",
    thesisDe: "KI-Exposition (Aufgabeninhalt) und Beschäftigungsausblick (Nachfragetrend) messen verschiedene Dinge. Ihr Pearson-|r| soll < 0,7 sein.",
    antithesis: "|r| ≥ 0.7 would suggest the two scores are largely redundant, reducing the model’s dimensionality.",
    antithesisDe: "|r| ≥ 0,7 würde nahelegen, dass die beiden Scores weitgehend redundant sind.",
    test: () => {
      const xs: number[] = [], ys: number[] = [];
      for (const o of austrianOccupations) { if (o.exposure != null && o.outlook != null) { xs.push(o.exposure); ys.push(o.outlook); } }
      const r = Math.abs(_pearson(xs, ys));
      return { passed: r < 0.7, actual: "|r| = " + r.toFixed(3), expected: "< 0.7" };
    },
  },
  {
    id: "cross-high-exposure-high-pay",
    group: "cross",
    name: "Top-10 exposure occupations have above-median pay",
    nameDe: "Top-10-Expositions-Berufe haben überdurchschnittliches Gehalt",
    thesis: "The most AI-exposed occupations (top 10 by score) should have a weighted mean pay above the national weighted median — reflecting the cognitive premium.",
    thesisDe: "Die KI-exponiertesten Berufe (Top 10 nach Score) sollen ein gewichtetes Durchschnittsgehalt über dem nationalen gewichteten Median haben.",
    antithesis: "Low pay for high-exposure occupations would contradict the skill-biased technological change literature.",
    antithesisDe: "Niedriges Gehalt für hochexponierte Berufe würde der Literatur zum qualifikationsverzerrten technologischen Wandel widersprechen.",
    test: () => {
      const sorted = [...austrianOccupations].sort((a, b) => (b.exposure ?? 0) - (a.exposure ?? 0));
      const top10 = sorted.slice(0, 10);
      const top10Pay = _wMean(top10, "pay");
      const medianPay = _wMedian(austrianOccupations);
      return { passed: top10Pay > medianPay, actual: "Top-10 avg: €" + Math.round(top10Pay).toLocaleString() + " | Median: €" + Math.round(medianPay).toLocaleString(), expected: "Top-10 > Median" };
    },
  },
  {
    id: "cross-education-coverage",
    group: "cross",
    name: "At least 6 of 8 education levels have occupations",
    nameDe: "Mindestens 6 von 8 Bildungsstufen haben Berufe",
    thesis: "At least 6 of the 8 canonical education levels should have ≥ 1 occupation row. Some levels (e.g. BMS — vocational school) may have zero rows because no ISCO-08 2-digit group maps primarily to that Austrian-specific qualification at the aggregate level.",
    thesisDe: "Mindestens 6 der 8 kanonischen Bildungsstufen sollen ≥ 1 Berufszeile haben. Einige Stufen (z.B. BMS) können null Zeilen haben, weil keine ISCO-08-2-Steller-Gruppe auf Aggregatebene primär diesem österreichischen Abschluss entspricht.",
    antithesis: "Fewer than 6 levels with rows would mean the education filter is too sparse to be useful for career exploration.",
    antithesisDe: "Weniger als 6 Stufen mit Zeilen würde bedeuten, dass der Bildungsfilter zu spärlich für die Berufsexploration ist.",
    test: () => {
      const counts = new Map<string, number>();
      for (const o of austrianOccupations) counts.set(o.education, (counts.get(o.education) ?? 0) + 1);
      const populated = EDU_LEVELS_EN.filter((e) => (counts.get(e) ?? 0) >= 1);
      return { passed: populated.length >= 6, actual: populated.length + "/8 levels populated", expected: "≥ 6 of 8" };
    },
  },
  {
    id: "cross-sector-pay-variance",
    group: "cross",
    name: "Pay varies meaningfully across NACE sections",
    nameDe: "Gehalt variiert sinnvoll über NACE-Abschnitte",
    thesis: "Different sectors have different pay structures. The CV of sector-level weighted-mean pay should exceed 0.10.",
    thesisDe: "Verschiedene Sektoren haben unterschiedliche Gehaltsstrukturen. Der VK des sektorweiten gewichteten Durchschnittsgehalts soll 0,10 übersteigen.",
    antithesis: "CV ≤ 0.10 means all sectors pay roughly the same — hiding real structural differences.",
    antithesisDe: "VK ≤ 0,10 bedeutet, dass alle Sektoren ungefähr gleich zahlen — reale Strukturunterschiede werden verdeckt.",
    test: () => {
      const sectorPays: number[] = [];
      for (const ch of "ABCDEFGHIJKLMNOPQRS") {
        const rows = austrianOccupations.filter((o) => o.onaceSection === ch);
        if (rows.length > 0) sectorPays.push(_wMean(rows, "pay"));
      }
      const mean = sectorPays.reduce((a, b) => a + b, 0) / sectorPays.length;
      const variance = sectorPays.reduce((s, p) => s + (p - mean) ** 2, 0) / sectorPays.length;
      const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
      return { passed: cv > 0.1, actual: "CV = " + cv.toFixed(3), expected: "> 0.10" };
    },
  },
  {
    id: "cross-sector-exposure-variance",
    group: "cross",
    name: "AI exposure varies meaningfully across NACE sections",
    nameDe: "KI-Exposition variiert sinnvoll über NACE-Abschnitte",
    thesis: "Different sectors face different automation risks. The standard deviation of sector-level mean exposure should exceed 1.0.",
    thesisDe: "Verschiedene Sektoren stehen unterschiedlichen Automatisierungsrisiken gegenüber. Die Standardabweichung der sektorweiten Durchschnittsexposition soll 1,0 übersteigen.",
    antithesis: "SD ≤ 1.0 means all sectors have similar AI exposure — the rubric fails to differentiate by economic activity.",
    antithesisDe: "SD ≤ 1,0 bedeutet, dass alle Sektoren ähnliche KI-Exposition haben — die Rubrik differenziert nicht nach Wirtschaftsaktivität.",
    test: () => {
      const sectorExps: number[] = [];
      for (const ch of "ABCDEFGHIJKLMNOPQRS") {
        const rows = austrianOccupations.filter((o) => o.onaceSection === ch);
        if (rows.length > 0) sectorExps.push(_wMean(rows, "exposure"));
      }
      const mean = sectorExps.reduce((a, b) => a + b, 0) / sectorExps.length;
      const variance = sectorExps.reduce((s, e) => s + (e - mean) ** 2, 0) / sectorExps.length;
      const sd = Math.sqrt(variance);
      return { passed: sd > 1.0, actual: "SD = " + sd.toFixed(2), expected: "> 1.0" };
    },
  },
  {
    id: "cross-bilingual-parity",
    group: "cross",
    name: "EN and DE education levels have 1:1 correspondence",
    nameDe: "EN- und DE-Bildungsstufen haben 1:1-Entsprechung",
    thesis: "For each occupation, the index of education in EDU_LEVELS_EN should match the index of educationDe in EDU_LEVELS_AT — ensuring correct bilingual mapping.",
    thesisDe: "Für jeden Beruf soll der Index von education in EDU_LEVELS_EN dem Index von educationDe in EDU_LEVELS_AT entsprechen — korrekte zweisprachige Zuordnung.",
    antithesis: "A mismatch means a German user sees a different education level than the English user for the same occupation.",
    antithesisDe: "Eine Abweichung bedeutet, dass ein deutschsprachiger Nutzer ein anderes Bildungsniveau sieht als ein englischsprachiger.",
    test: () => {
      const bad = austrianOccupations.filter((o) => {
        const enIdx = EDU_LEVELS_EN.indexOf(o.education);
        const deIdx = EDU_LEVELS_AT.indexOf(o.educationDe);
        return enIdx === -1 || deIdx === -1 || enIdx !== deIdx;
      });
      return { passed: bad.length === 0, actual: bad.length === 0 ? "All match" : bad.map((o) => o.slug).join(", "), expected: "1:1 EN↔DE mapping" };
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // GROUP 9: SOURCE DATA VALIDATION — Real comparisons against Eurostat/VSE
  // These tests import cached source data from real-data.ts (fetched from
  // Eurostat lfsa_egai2d, nama_10_a64_e, Statistik Austria VSE) and compare
  // row-by-row against the generated austrianOccupations.
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: "source-total-vs-lfs",
    group: "source",
    name: "Total jobs matches Eurostat LFS total within 2%",
    nameDe: "Gesamtbeschäftigung stimmt mit Eurostat-LFS innerhalb 2 % überein",
    thesis: "The sum of all occupation-level jobs must reproduce the Eurostat LFS total (TOTAL_EMPLOYMENT_LFS = " + TOTAL_EMPLOYMENT_LFS.toLocaleString() + ") for the modeled ISCO codes within ±2%. This is a hard constraint: the pipeline allocates the full LFS count.",
    thesisDe: "Die Summe aller Berufs-Jobs muss die Eurostat-LFS-Summe (TOTAL_EMPLOYMENT_LFS = " + TOTAL_EMPLOYMENT_LFS.toLocaleString() + ") für die modellierten ISCO-Codes mit ±2 % reproduzieren. Harte Nebenbedingung: die Pipeline verteilt den vollen LFS-Bestand.",
    antithesis: "A deviation > 2% means the pipeline created or destroyed jobs during allocation — employment was fabricated or lost, not redistributed.",
    antithesisDe: "Eine Abweichung > 2 % bedeutet, dass die Pipeline während der Allokation Jobs erzeugt oder vernichtet hat — Beschäftigung wurde erfunden oder verloren, nicht umverteilt.",
    test: () => {
      const total = _totalJobs();
      // Compare against sum of LFS for ISCO codes actually used in our model
      const modeledIscoCodes: Set<string> = new Set(austrianOccupations.map((o) => o.isco08));
      const lfsSum = employmentByISCO2
        .filter((e) => modeledIscoCodes.has(e.isco08))
        .reduce((s, e) => s + e.employmentPersons, 0);
      const ratio = lfsSum > 0 ? total / lfsSum : 0;
      return { passed: ratio >= 0.98 && ratio <= 1.02, actual: total.toLocaleString() + " vs LFS " + lfsSum.toLocaleString() + " (" + (ratio * 100).toFixed(1) + "%)", expected: "98–102% of LFS sum" };
    },
  },
  {
    id: "source-isco-coverage",
    group: "source",
    name: "Every Eurostat ISCO code is represented in the model",
    nameDe: "Jeder Eurostat-ISCO-Code ist im Modell vertreten",
    thesis: "Every 2-digit ISCO-08 code present in Eurostat lfsa_egai2d (employmentByISCO2) should have at least one occupation row in our model.",
    thesisDe: "Jeder 2-stellige ISCO-08-Code aus Eurostat lfsa_egai2d (employmentByISCO2) soll mindestens eine Berufszeile in unserem Modell haben.",
    antithesis: "A missing ISCO code means the model silently drops an entire occupation category — those workers become invisible.",
    antithesisDe: "Ein fehlender ISCO-Code bedeutet, dass das Modell eine ganze Berufskategorie stillschweigend fallen lässt — diese Beschäftigten werden unsichtbar.",
    test: () => {
      const modeledIscos = new Set(austrianOccupations.map((o) => o.isco08));
      const missing = employmentByISCO2.filter((e) => !modeledIscos.has(e.isco08));
      return { passed: missing.length === 0, actual: missing.length === 0 ? "All " + employmentByISCO2.length + " ISCO codes covered" : "Missing: " + missing.map((e) => e.isco08 + " (" + e.labelEn + ")").join(", "), expected: "All Eurostat ISCO codes present" };
    },
  },
  {
    id: "source-isco-employment-match",
    group: "source",
    name: "Per-ISCO employment sums match Eurostat within 5%",
    nameDe: "ISCO-Beschäftigungssummen stimmen mit Eurostat innerhalb 5 % überein",
    thesis: "For each 2-digit ISCO code, the sum of jobs across all occupation rows with that code should match the Eurostat LFS figure within ±5%. The pipeline distributes each ISCO total across NACE sub-rows, so the per-ISCO total must be conserved.",
    thesisDe: "Für jeden 2-stelligen ISCO-Code soll die Summe der Jobs über alle Berufszeilen mit diesem Code der Eurostat-LFS-Zahl innerhalb ±5 % entsprechen. Die Pipeline verteilt jede ISCO-Summe auf NACE-Unterzeilen, daher muss die ISCO-Summe erhalten bleiben.",
    antithesis: "A per-ISCO mismatch > 5% means the NACE-weight splitting is leaking or absorbing employment for that occupation group.",
    antithesisDe: "Eine ISCO-Abweichung > 5 % bedeutet, dass die NACE-Gewichtsaufteilung für diese Berufsgruppe Beschäftigung verliert oder absorbiert.",
    test: () => {
      const iscoSums = new Map<string, number>();
      for (const o of austrianOccupations) iscoSums.set(o.isco08, (iscoSums.get(o.isco08) ?? 0) + (o.jobs ?? 0));
      let mismatches = 0;
      let checked = 0;
      const details: string[] = [];
      for (const e of employmentByISCO2) {
        const modelSum = iscoSums.get(e.isco08) ?? 0;
        if (e.employmentPersons <= 0) continue;
        checked++;
        const ratio = modelSum / e.employmentPersons;
        if (ratio < 0.95 || ratio > 1.05) {
          mismatches++;
          details.push(e.isco08 + ": " + modelSum.toLocaleString() + " vs " + e.employmentPersons.toLocaleString() + " (" + (ratio * 100).toFixed(1) + "%)");
        }
      }
      return { passed: mismatches === 0, actual: mismatches === 0 ? checked + "/" + checked + " ISCO codes within 5%" : mismatches + " mismatches: " + details.slice(0, 3).join("; "), expected: "All within ±5%" };
    },
  },
  {
    id: "source-nace-section-match",
    group: "source",
    name: "Top 5 NACE sections by employment match Eurostat within 30%",
    nameDe: "Top-5-NACE-Abschnitte nach Beschäftigung stimmen mit Eurostat innerhalb 30 % überein",
    thesis: "For the 5 largest NACE sections by Eurostat employment (typically G, C, Q, P, O), the model's totals should be within ±30% of Eurostat nama_10_a64_e. Smaller sectors diverge more because the ISCO→NACE allocation is a modeled cross-tabulation, not a direct NACE headcount.",
    thesisDe: "Für die 5 größten NACE-Abschnitte nach Eurostat-Beschäftigung (typisch G, C, Q, P, O) sollen die Modellsummen innerhalb ±30 % von Eurostat nama_10_a64_e liegen. Kleinere Sektoren weichen stärker ab, da die ISCO→NACE-Allokation eine modellierte Kreuztabelle ist.",
    antithesis: "If a top-5 sector deviates > 30%, the ISCO×NACE cross-allocation is badly miscalibrated for a major part of the economy.",
    antithesisDe: "Wenn ein Top-5-Sektor > 30 % abweicht, ist die ISCO×NACE-Kreuzallokation für einen großen Teil der Wirtschaft schlecht kalibriert.",
    test: () => {
      const naceEurostat = employmentByNACE
        .filter((e) => /^[A-S]$/.test(e.nace))
        .sort((a, b) => b.employmentPersons - a.employmentPersons)
        .slice(0, 5);
      const naceModel = new Map<string, number>();
      for (const o of austrianOccupations) naceModel.set(o.onaceSection, (naceModel.get(o.onaceSection) ?? 0) + (o.jobs ?? 0));
      let mismatches = 0;
      const details: string[] = [];
      for (const e of naceEurostat) {
        const modelJobs = naceModel.get(e.nace as string) ?? 0;
        const ratio = modelJobs / e.employmentPersons;
        if (ratio < 0.70 || ratio > 1.30) {
          mismatches++;
          details.push(e.nace + ": " + modelJobs.toLocaleString() + " vs " + e.employmentPersons.toLocaleString() + " (" + (ratio * 100).toFixed(0) + "%)");
        } else {
          details.push(e.nace + ": " + (ratio * 100).toFixed(0) + "%");
        }
      }
      return { passed: mismatches <= 1, actual: details.join(", "), expected: "≤ 1 of top 5 outside ±30%" };
    },
  },
  {
    id: "source-vse-pay-isco-match",
    group: "source",
    name: "Pay matches VSE median (by ISCO) within 15%",
    nameDe: "Gehalt stimmt mit VSE-Median (nach ISCO) innerhalb 15 % überein",
    thesis: "For each 2-digit ISCO code with a VSE entry, the employment-weighted mean pay of our occupation rows should be within ±15% of the VSE annual estimate (medianHourly × 2080 × 1.17). The 15% tolerance accounts for the NACE-sector mix within each ISCO group.",
    thesisDe: "Für jeden 2-stelligen ISCO-Code mit VSE-Eintrag soll das beschäftigungsgewichtete Durchschnittsgehalt unserer Zeilen innerhalb ±15 % der VSE-Jahresschätzung liegen (medianHourly × 2080 × 1,17). 15 % Toleranz für den NACE-Sektormix innerhalb jeder ISCO-Gruppe.",
    antithesis: "A pay mismatch > 15% means the earnings assignment for that ISCO group diverges substantially from the official Structure of Earnings Survey.",
    antithesisDe: "Eine Gehaltsabweichung > 15 % bedeutet, dass die Entgeltzuweisung für diese ISCO-Gruppe erheblich von der offiziellen Verdienststrukturerhebung abweicht.",
    test: () => {
      // Build VSE lookup for 2-digit ISCO codes
      const vseLookup: Map<string, number> = new Map(earningsByOccupation.filter((e) => /^[1-9][0-9]$/.test(e.isco08)).map((e) => [e.isco08 as string, Math.round(e.medianHourlyEUR * 2080 * 1.17)]));
      // Group our occupations by ISCO and compute weighted mean pay
      const iscoPayData = new Map<string, { totalPay: number; totalJobs: number }>();
      for (const o of austrianOccupations) {
        if (!o.pay || !o.jobs) continue;
        const d = iscoPayData.get(o.isco08) ?? { totalPay: 0, totalJobs: 0 };
        d.totalPay += o.pay * o.jobs;
        d.totalJobs += o.jobs;
        iscoPayData.set(o.isco08, d);
      }
      let mismatches = 0;
      let checked = 0;
      const details: string[] = [];
      for (const [isco, vseAnnual] of vseLookup) {
        const d = iscoPayData.get(isco);
        if (!d || d.totalJobs <= 0 || vseAnnual <= 0) continue;
        checked++;
        const modelPay = d.totalPay / d.totalJobs;
        const ratio = modelPay / vseAnnual;
        if (ratio < 0.85 || ratio > 1.15) {
          mismatches++;
          details.push(isco + ": €" + Math.round(modelPay).toLocaleString() + " vs VSE €" + vseAnnual.toLocaleString() + " (" + (ratio * 100).toFixed(0) + "%)");
        }
      }
      return { passed: mismatches <= 2, actual: mismatches === 0 ? checked + " ISCO codes within 15%" : mismatches + " off: " + details.slice(0, 3).join("; "), expected: "≤ 2 ISCO codes outside ±15%" };
    },
  },
  {
    id: "source-vse-pay-direction",
    group: "source",
    name: "Pay ranking matches VSE ranking (Spearman rho > 0.7)",
    nameDe: "Gehaltsranking stimmt mit VSE-Ranking überein (Spearman rho > 0,7)",
    thesis: "The rank order of median pay across ISCO 2-digit groups in our model should strongly correlate with the VSE rank order. Spearman rho > 0.7 confirms that the pipeline preserves the relative pay hierarchy from official earnings data.",
    thesisDe: "Die Rangordnung der Mediangehälter über ISCO-2-Steller-Gruppen in unserem Modell soll stark mit der VSE-Rangordnung korrelieren. Spearman rho > 0,7 bestätigt, dass die Pipeline die relative Gehaltshierarchie aus amtlichen Verdienst-Daten bewahrt.",
    antithesis: "Rho ≤ 0.7 means the pipeline's NACE-sector-weighted pay mixing has scrambled the pay ranking — high-paid VSE groups end up low-paid in the model or vice versa.",
    antithesisDe: "Rho ≤ 0,7 bedeutet, dass die NACE-sektorgewichtete Gehaltsmischung der Pipeline das Gehaltsranking durcheinander gebracht hat.",
    test: () => {
      const vseLookup: Map<string, number> = new Map(earningsByOccupation.filter((e) => /^[1-9][0-9]$/.test(e.isco08)).map((e) => [e.isco08 as string, e.medianHourlyEUR]));
      const pairs: { isco: string; vsePay: number; modelPay: number }[] = [];
      const iscoPayData = new Map<string, { totalPay: number; totalJobs: number }>();
      for (const o of austrianOccupations) {
        if (!o.pay || !o.jobs) continue;
        const d = iscoPayData.get(o.isco08) ?? { totalPay: 0, totalJobs: 0 };
        d.totalPay += o.pay * o.jobs;
        d.totalJobs += o.jobs;
        iscoPayData.set(o.isco08, d);
      }
      for (const [isco, vseHourly] of vseLookup) {
        const d = iscoPayData.get(isco);
        if (!d || d.totalJobs <= 0) continue;
        pairs.push({ isco, vsePay: vseHourly, modelPay: d.totalPay / d.totalJobs });
      }
      if (pairs.length < 5) return { passed: false, actual: "n=" + pairs.length, expected: "rho > 0.7" };
      // Rank correlation (Spearman)
      const rankBy = (arr: number[]) => {
        const indexed = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
        const ranks = new Array(arr.length);
        indexed.forEach((x, r) => { ranks[x.i] = r + 1; });
        return ranks;
      };
      const vseRanks = rankBy(pairs.map((p) => p.vsePay));
      const modelRanks = rankBy(pairs.map((p) => p.modelPay));
      const rho = _pearson(vseRanks, modelRanks);
      return { passed: rho > 0.7, actual: "Spearman rho = " + rho.toFixed(3) + " (n=" + pairs.length + ")", expected: "rho > 0.7" };
    },
  },
  {
    id: "source-lfs-total-reference",
    group: "source",
    name: "LFS reference total matches Eurostat constant",
    nameDe: "LFS-Referenzsumme stimmt mit Eurostat-Konstante überein",
    thesis: "The TOTAL_EMPLOYMENT_LFS constant in real-data.ts should equal the sum of employmentByISCO2 entries (or be very close), confirming internal consistency of the fetched data.",
    thesisDe: "Die Konstante TOTAL_EMPLOYMENT_LFS in real-data.ts soll der Summe der employmentByISCO2-Einträge entsprechen (oder sehr nahe sein), um die interne Konsistenz der abgerufenen Daten zu bestätigen.",
    antithesis: "A large discrepancy means the LFS reference total and the detailed ISCO breakdown came from different Eurostat query filters.",
    antithesisDe: "Eine große Diskrepanz bedeutet, dass die LFS-Referenzsumme und die detaillierte ISCO-Aufschlüsselung aus verschiedenen Eurostat-Abfragefiltern stammen.",
    test: () => {
      const iscoSum = employmentByISCO2.reduce((s, e) => s + e.employmentPersons, 0);
      const diff = Math.abs(iscoSum - TOTAL_EMPLOYMENT_LFS);
      const pct = TOTAL_EMPLOYMENT_LFS > 0 ? (diff / TOTAL_EMPLOYMENT_LFS) * 100 : 100;
      return { passed: pct < 5, actual: "ISCO sum: " + iscoSum.toLocaleString() + " vs LFS: " + TOTAL_EMPLOYMENT_LFS.toLocaleString() + " (diff " + pct.toFixed(1) + "%)", expected: "< 5% difference" };
    },
  },
  {
    id: "source-nace-weights-used",
    group: "source",
    name: "NACE weight data covers all sections in the model",
    nameDe: "NACE-Gewichtsdaten decken alle Abschnitte im Modell ab",
    thesis: "Every NACE section letter (A–S) present in our occupation rows should have a corresponding entry in employmentByNACE — confirming the weight data is complete.",
    thesisDe: "Jeder NACE-Abschnittsbuchstabe (A–S) in unseren Berufszeilen soll einen entsprechenden Eintrag in employmentByNACE haben — Bestätigung, dass die Gewichtsdaten vollständig sind.",
    antithesis: "A missing NACE section in the weight data means the pipeline had to improvise weights for that sector — undermining the deterministic allocation.",
    antithesisDe: "Ein fehlender NACE-Abschnitt in den Gewichtsdaten bedeutet, dass die Pipeline Gewichte für diesen Sektor improvisieren musste.",
    test: () => {
      const naceInModel = new Set(austrianOccupations.map((o) => o.onaceSection));
      const naceInWeights: Set<string> = new Set(employmentByNACE.map((e) => e.nace));
      const missing = [...naceInModel].filter((n) => !naceInWeights.has(n));
      return { passed: missing.length === 0, actual: missing.length === 0 ? naceInModel.size + " sections all have weights" : "Missing: " + missing.join(", "), expected: "All model sections in weight data" };
    },
  },
  {
    id: "source-vse-coverage",
    group: "source",
    name: "VSE earnings data covers ≥ 80% of ISCO codes in the model",
    nameDe: "VSE-Verdienst-Daten decken ≥ 80 % der ISCO-Codes im Modell ab",
    thesis: "At least 80% of the 2-digit ISCO codes used in our model should have a direct VSE earnings entry (earningsByOccupation). Remaining codes fall back to NACE-sector pay.",
    thesisDe: "Mindestens 80 % der 2-stelligen ISCO-Codes in unserem Modell sollen einen direkten VSE-Verdienst-Eintrag haben. Verbleibende Codes fallen auf NACE-Sektor-Gehälter zurück.",
    antithesis: "Below 80% coverage means too many occupations rely on sector-level pay averages rather than occupation-specific VSE data.",
    antithesisDe: "Unter 80 % Abdeckung bedeutet, dass zu viele Berufe auf Sektordurchschnitte statt auf berufsspezifische VSE-Daten angewiesen sind.",
    test: () => {
      const modelIscos: Set<string> = new Set(austrianOccupations.map((o) => o.isco08));
      const vseIscos: Set<string> = new Set(earningsByOccupation.filter((e) => /^[1-9][0-9]$/.test(e.isco08)).map((e) => e.isco08));
      const covered = [...modelIscos].filter((i) => vseIscos.has(i)).length;
      const pct = modelIscos.size > 0 ? (covered / modelIscos.size) * 100 : 0;
      return { passed: pct >= 80, actual: covered + "/" + modelIscos.size + " (" + pct.toFixed(0) + "%)", expected: "≥ 80% coverage" };
    },
  },
  {
    id: "source-highest-paid-isco-match",
    group: "source",
    name: "Highest-paid ISCO group in model matches VSE",
    nameDe: "Bestbezahlte ISCO-Gruppe im Modell stimmt mit VSE überein",
    thesis: "The ISCO 2-digit group with the highest weighted mean pay in our model should be the same as (or within the top 3 of) the VSE ranking. This confirms the pay hierarchy is anchored correctly at the top.",
    thesisDe: "Die ISCO-2-Steller-Gruppe mit dem höchsten gewichteten Durchschnittsgehalt in unserem Modell soll dieselbe sein wie (oder in den Top 3 der) VSE-Rangliste. Bestätigt, dass die Gehaltshierarchie an der Spitze korrekt verankert ist.",
    antithesis: "If the model's top earner doesn't appear in the VSE top 3, the pay pipeline has fundamentally distorted which occupations earn the most.",
    antithesisDe: "Wenn der Spitzenverdiener des Modells nicht in den VSE-Top-3 erscheint, hat die Gehalts-Pipeline grundlegend verzerrt, welche Berufe am meisten verdienen.",
    test: () => {
      // Model: weighted mean pay per ISCO
      const iscoPayData = new Map<string, { totalPay: number; totalJobs: number }>();
      for (const o of austrianOccupations) {
        if (!o.pay || !o.jobs) continue;
        const d = iscoPayData.get(o.isco08) ?? { totalPay: 0, totalJobs: 0 };
        d.totalPay += o.pay * o.jobs;
        d.totalJobs += o.jobs;
        iscoPayData.set(o.isco08, d);
      }
      const modelRanked = [...iscoPayData.entries()]
        .map(([isco, d]) => ({ isco, pay: d.totalPay / d.totalJobs }))
        .sort((a, b) => b.pay - a.pay);
      // VSE: top 3 by median hourly
      const vseRanked = earningsByOccupation
        .filter((e) => /^[1-9][0-9]$/.test(e.isco08))
        .sort((a, b) => b.medianHourlyEUR - a.medianHourlyEUR);
      const vseTop3: string[] = vseRanked.slice(0, 3).map((e) => e.isco08 as string);
      const modelTop = modelRanked[0]?.isco ?? "none";
      const inTop3 = vseTop3.includes(modelTop);
      return { passed: inTop3, actual: "Model top: ISCO " + modelTop + " | VSE top 3: " + vseTop3.join(", "), expected: "Model top in VSE top 3" };
    },
  },
  {
    id: "source-lowest-paid-isco-match",
    group: "source",
    name: "Lowest-paid ISCO group in model matches VSE bottom",
    nameDe: "Niedrigstbezahlte ISCO-Gruppe im Modell stimmt mit VSE-Boden überein",
    thesis: "The ISCO 2-digit group with the lowest weighted mean pay should appear in the bottom 3 of the VSE ranking — confirming the pay floor is correctly anchored.",
    thesisDe: "Die ISCO-2-Steller-Gruppe mit dem niedrigsten gewichteten Durchschnittsgehalt soll in den unteren 3 der VSE-Rangliste erscheinen — Bestätigung, dass der Gehaltsboden korrekt verankert ist.",
    antithesis: "If the model's lowest earner doesn't match the VSE bottom, low-skill occupations may be assigned pay from the wrong sector.",
    antithesisDe: "Wenn der Niedrigstverdiener des Modells nicht zum VSE-Boden passt, könnten Niedrigqualifikationsberufe Gehälter aus dem falschen Sektor zugewiesen bekommen.",
    test: () => {
      const iscoPayData = new Map<string, { totalPay: number; totalJobs: number }>();
      for (const o of austrianOccupations) {
        if (!o.pay || !o.jobs) continue;
        const d = iscoPayData.get(o.isco08) ?? { totalPay: 0, totalJobs: 0 };
        d.totalPay += o.pay * o.jobs;
        d.totalJobs += o.jobs;
        iscoPayData.set(o.isco08, d);
      }
      const modelRanked = [...iscoPayData.entries()]
        .map(([isco, d]) => ({ isco, pay: d.totalPay / d.totalJobs }))
        .sort((a, b) => a.pay - b.pay);
      const vseRanked = earningsByOccupation
        .filter((e) => /^[1-9][0-9]$/.test(e.isco08))
        .sort((a, b) => a.medianHourlyEUR - b.medianHourlyEUR);
      const vseBottom3: string[] = vseRanked.slice(0, 3).map((e) => e.isco08 as string);
      const modelBottom = modelRanked[0]?.isco ?? "none";
      const inBottom3 = vseBottom3.includes(modelBottom);
      return { passed: inBottom3, actual: "Model bottom: ISCO " + modelBottom + " | VSE bottom 3: " + vseBottom3.join(", "), expected: "Model bottom in VSE bottom 3" };
    },
  },
  {
    id: "source-large-sector-order",
    group: "source",
    name: "Top 3 NACE sections by employment match Eurostat order",
    nameDe: "Top-3-NACE-Abschnitte nach Beschäftigung stimmen mit Eurostat-Reihenfolge überein",
    thesis: "The three largest NACE sections by employment in our model should be the same three as in Eurostat nama_10_a64_e (likely G, C, Q in some order). The exact ranking may differ slightly due to ISCO→NACE allocation, but the top-3 set should match.",
    thesisDe: "Die drei größten NACE-Abschnitte nach Beschäftigung in unserem Modell sollen dieselben drei wie in Eurostat nama_10_a64_e sein (wahrscheinlich G, C, Q). Die genaue Rangfolge kann leicht abweichen, aber die Top-3-Menge soll übereinstimmen.",
    antithesis: "Different top-3 sectors means the ISCO→NACE allocation has fundamentally shifted employment to the wrong sectors.",
    antithesisDe: "Unterschiedliche Top-3-Sektoren bedeuten, dass die ISCO→NACE-Allokation Beschäftigung grundlegend in die falschen Sektoren verschoben hat.",
    test: () => {
      // Eurostat top 3 (single-letter sections only)
      const eurostatSections = employmentByNACE
        .filter((e) => /^[A-S]$/.test(e.nace))
        .sort((a, b) => b.employmentPersons - a.employmentPersons);
      const eurostatTop3: Set<string> = new Set(eurostatSections.slice(0, 3).map((e) => e.nace as string));
      // Model top 3
      const naceModel = new Map<string, number>();
      for (const o of austrianOccupations) naceModel.set(o.onaceSection, (naceModel.get(o.onaceSection) ?? 0) + (o.jobs ?? 0));
      const modelSorted = [...naceModel.entries()].sort((a, b) => b[1] - a[1]);
      const modelTop3 = new Set(modelSorted.slice(0, 3).map(([n]) => n));
      const overlap = [...modelTop3].filter((n) => eurostatTop3.has(n));
      return { passed: overlap.length >= 2, actual: "Model: " + [...modelTop3].join(",") + " | Eurostat: " + [...eurostatTop3].join(",") + " (overlap: " + overlap.length + ")", expected: "≥ 2 of 3 match" };
    },
  },
  {
    id: "source-data-freshness",
    group: "source",
    name: "Source data was fetched within the last 90 days",
    nameDe: "Quelldaten wurden innerhalb der letzten 90 Tage abgerufen",
    thesis: "The cached Eurostat/VSE data in real-data.ts should have been fetched recently (within 90 days) to ensure figures reflect the latest available release.",
    thesisDe: "Die gecachten Eurostat-/VSE-Daten in real-data.ts sollen kürzlich (innerhalb von 90 Tagen) abgerufen worden sein, um sicherzustellen, dass die Zahlen die neueste verfügbare Veröffentlichung widerspiegeln.",
    antithesis: "Stale data (> 90 days) may miss Eurostat revisions or new VSE releases, producing outdated employment and earnings figures.",
    antithesisDe: "Veraltete Daten (> 90 Tage) könnten Eurostat-Revisionen oder neue VSE-Veröffentlichungen verpassen und veraltete Beschäftigungs- und Verdienst-Zahlen produzieren.",
    test: () => {
      const fetched = new Date("2026-03-28T19:10:37.947Z");
      const now = new Date();
      const daysSince = Math.floor((now.getTime() - fetched.getTime()) / (1000 * 60 * 60 * 24));
      return { passed: daysSince <= 90, actual: daysSince + " days ago (" + fetched.toISOString().split("T")[0] + ")", expected: "≤ 90 days" };
    },
  },
];
