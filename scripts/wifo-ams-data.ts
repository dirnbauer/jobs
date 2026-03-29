/**
 * WIFO/AMS Mittelfristige Beschäftigungsprognose 2023–2030
 * Source: Tabellenband (Band 3), December 2024
 *   https://forschungsnetzwerk.ams.at/dam/jcr:5957cfa3-2639-454e-8fcf-ae8455892b1e/
 *     Beschaeftigungsprognose%20Oesterreich_2023-2030_Tabellenband.pdf
 *
 * Data extracted from:
 *   Tabellenanhang 3  – NACE sector growth rates (% p.a., Austria 2023/2030)
 *   Tabellenanhang 34 – ISCO Berufsgruppen employment & growth (Austria 2023/2030)
 */

// ---------------------------------------------------------------------------
// 1. NACE sector growth rates (Tabellenanhang 3, Gesamt column, % p.a.)
// ---------------------------------------------------------------------------

export interface NaceSectorData {
  name: string;
  nameDe: string;
  growthPa: number; // % p.a. 2023/2030
  emp2023: number;  // absolute employment 2023
  emp2030: number;  // absolute employment 2030 (projected)
}

/** Key = WIFO sector identifier used for mapping */
export const WIFO_NACE_SECTORS: Record<string, NaceSectorData> = {
  "A":       { name: "Agriculture & forestry",              nameDe: "Land- u. Forstwirtschaft",                          growthPa: 0.6,  emp2023: 26000,  emp2030: 27100 },
  "B_C23":   { name: "Mining, stone & glass products",      nameDe: "Bergbau, Stein- und Glaswaren",                     growthPa: -1.0, emp2023: 32900,  emp2030: 30600 },
  "C10-C12": { name: "Food, beverages & tobacco",           nameDe: "Nahrungs- u. Genussmittelherstellung",              growthPa: 0.3,  emp2023: 80400,  emp2030: 82000 },
  "C13-C15": { name: "Textiles & apparel",                  nameDe: "Textil und Bekleidung",                             growthPa: -2.5, emp2023: 11900,  emp2030: 10000 },
  "C16":     { name: "Wood processing",                     nameDe: "Be- und Verarbeitung von Holz",                     growthPa: -0.2, emp2023: 30100,  emp2030: 29600 },
  "C17-C18": { name: "Paper, cardboard & printing",         nameDe: "Papier, Pappe, Druckerzeugnisse",                   growthPa: -2.0, emp2023: 23500,  emp2030: 20400 },
  "C19-C20": { name: "Chemicals & petroleum",               nameDe: "Chemie u. Erdölverarbeitung",                       growthPa: 1.1,  emp2023: 40400,  emp2030: 43600 },
  "C21":     { name: "Pharmaceuticals",                     nameDe: "Chemie u. Erdölverarbeitung (Pharma-Anteil)",        growthPa: 1.1,  emp2023: 40400,  emp2030: 43600 },
  "C22":     { name: "Rubber & plastic products",           nameDe: "Gummi- und Kunststoffwaren",                        growthPa: 0.0,  emp2023: 30500,  emp2030: 30400 },
  "C24":     { name: "Basic metals",                        nameDe: "Metallerzeugung",                                   growthPa: 0.2,  emp2023: 114200, emp2030: 115700 },
  "C25":     { name: "Fabricated metal products",           nameDe: "Metallerzeugung",                                   growthPa: 0.2,  emp2023: 114200, emp2030: 115700 },
  "C26":     { name: "Computer & electronics",              nameDe: "Elektrotechnik, Feinmechanik, Optik",               growthPa: 0.6,  emp2023: 81200,  emp2030: 84600 },
  "C27":     { name: "Electrical equipment",                nameDe: "Elektrotechnik, Feinmechanik, Optik",               growthPa: 0.6,  emp2023: 81200,  emp2030: 84600 },
  "C28":     { name: "Machinery & equipment",               nameDe: "Maschinenbau",                                      growthPa: 1.1,  emp2023: 94700,  emp2030: 102200 },
  "C29":     { name: "Motor vehicles",                      nameDe: "Fahrzeugbau",                                       growthPa: -2.1, emp2023: 49400,  emp2030: 42600 },
  "C30":     { name: "Other transport equipment",           nameDe: "Sonstiger produzierender Bereich",                  growthPa: -0.5, emp2023: 61900,  emp2030: 59700 },
  "C31_C32": { name: "Furniture & other manufacturing",     nameDe: "Sonstiger produzierender Bereich",                  growthPa: -0.5, emp2023: 61900,  emp2030: 59700 },
  "C33":     { name: "Machinery repair & installation",     nameDe: "Sonstiger produzierender Bereich",                  growthPa: -0.5, emp2023: 61900,  emp2030: 59700 },
  "D":       { name: "Energy supply",                       nameDe: "Energieversorgung",                                 growthPa: 0.3,  emp2023: 28200,  emp2030: 28700 },
  "E":       { name: "Water supply & waste management",     nameDe: "Wasser, Abwasser",                                  growthPa: 1.2,  emp2023: 18600,  emp2030: 20200 },
  "F":       { name: "Construction",                        nameDe: "Bauwesen",                                          growthPa: -0.3, emp2023: 288700, emp2030: 282300 },
  "G45":     { name: "Motor vehicle trade & repair",        nameDe: "KFZ-Handel, -Reparatur",                            growthPa: 0.1,  emp2023: 69300,  emp2030: 69700 },
  "G46":     { name: "Wholesale trade",                     nameDe: "Großhandel",                                        growthPa: 0.5,  emp2023: 199700, emp2030: 206500 },
  "G47":     { name: "Retail trade",                        nameDe: "Einzelhandel",                                      growthPa: 0.5,  emp2023: 303300, emp2030: 313700 },
  "H49":     { name: "Land transport",                      nameDe: "Verkehr",                                           growthPa: 0.4,  emp2023: 120600, emp2030: 123800 },
  "H50":     { name: "Water transport",                     nameDe: "Verkehr",                                           growthPa: 0.4,  emp2023: 120600, emp2030: 123800 },
  "H51":     { name: "Air transport",                       nameDe: "Verkehr",                                           growthPa: 0.4,  emp2023: 120600, emp2030: 123800 },
  "H52":     { name: "Warehousing & postal",                nameDe: "Lagerei",                                           growthPa: 0.7,  emp2023: 59600,  emp2030: 62500 },
  "H53":     { name: "Postal & courier",                    nameDe: "Nachrichtenübermittlung",                           growthPa: -0.2, emp2023: 24000,  emp2030: 23600 },
  "I":       { name: "Accommodation & food service",        nameDe: "Beherbergung und Gastronomie",                      growthPa: 1.1,  emp2023: 224700, emp2030: 242300 },
  "J58":     { name: "Publishing",                          nameDe: "Medien",                                            growthPa: 0.5,  emp2023: 24600,  emp2030: 25500 },
  "J59_J60": { name: "Film, TV & broadcasting",             nameDe: "Medien",                                            growthPa: 0.5,  emp2023: 24600,  emp2030: 25500 },
  "J61":     { name: "Telecommunications",                  nameDe: "Telekommunikation",                                 growthPa: 0.2,  emp2023: 10800,  emp2030: 10900 },
  "J62_J63": { name: "IT services",                         nameDe: "Informationstechnologie u. -dienstleistungen",      growthPa: 3.7,  emp2023: 86300,  emp2030: 111600 },
  "K64":     { name: "Financial services",                  nameDe: "Finanz-, Kredit- und Versicherungswesen",            growthPa: -0.7, emp2023: 111000, emp2030: 105500 },
  "K65":     { name: "Insurance",                           nameDe: "Finanz-, Kredit- und Versicherungswesen",            growthPa: -0.7, emp2023: 111000, emp2030: 105500 },
  "L":       { name: "Real estate",                         nameDe: "Grundstücks- und Wohnungswesen",                    growthPa: 0.3,  emp2023: 44200,  emp2030: 45100 },
  "M69_M70": { name: "Legal, tax, management consulting",   nameDe: "Rechts-, Steuer, Unternehmensber., Werbung",        growthPa: 1.8,  emp2023: 127300, emp2030: 144100 },
  "M71":     { name: "Architecture & engineering services",  nameDe: "Forschung, techn. u. freiberufl. Tätigkeiten",      growthPa: 2.3,  emp2023: 79200,  emp2030: 92900 },
  "M72":     { name: "Scientific R&D",                      nameDe: "Forschung, techn. u. freiberufl. Tätigkeiten",      growthPa: 2.3,  emp2023: 79200,  emp2030: 92900 },
  "M73":     { name: "Advertising & market research",       nameDe: "Rechts-, Steuer, Unternehmensber., Werbung",        growthPa: 1.8,  emp2023: 127300, emp2030: 144100 },
  "N":       { name: "Admin & support services",            nameDe: "Sonst. DL f. Unternehmen od. Privatpersonen",       growthPa: 1.2,  emp2023: 40400,  emp2030: 43900 },
  "N78":     { name: "Temporary employment",                nameDe: "Überlassung von Arbeitskräften",                    growthPa: 1.7,  emp2023: 93400,  emp2030: 105100 },
  "N_CLEAN": { name: "Building cleaning",                   nameDe: "Gebäudebetreuung",                                  growthPa: 1.9,  emp2023: 99300,  emp2030: 113200 },
  "O":       { name: "Public administration",               nameDe: "Öffentliche Verwaltung",                            growthPa: 0.1,  emp2023: 252200, emp2030: 253800 },
  "P":       { name: "Education",                           nameDe: "Erziehung und Unterricht",                          growthPa: 0.8,  emp2023: 325500, emp2030: 343700 },
  "Q86":     { name: "Health activities",                   nameDe: "Gesundheits- u. Sozialwesen",                       growthPa: 1.8,  emp2023: 450200, emp2030: 510200 },
  "Q87_Q88": { name: "Social work",                        nameDe: "Gesundheits- u. Sozialwesen",                       growthPa: 1.8,  emp2023: 450200, emp2030: 510200 },
  "R":       { name: "Arts, entertainment & recreation",    nameDe: "Persönliche Dienstleistungen",                      growthPa: 0.7,  emp2023: 79400,  emp2030: 83300 },
  "S":       { name: "Other service activities",            nameDe: "Interessensvertretungen",                           growthPa: 0.0,  emp2023: 50500,  emp2030: 50400 },
  "C":       { name: "Manufacturing (overall)",             nameDe: "Produzierender Bereich (gesamt)",                   growthPa: 0.1,  emp2023: 924800, emp2030: 931900 },
};

// ---------------------------------------------------------------------------
// 2. Mapping: our OCCUPATION_DEFS `nace` codes → WIFO_NACE_SECTORS key
//    Most map 1:1. Where the WIFO table aggregates differently, we note it.
// ---------------------------------------------------------------------------

export const NACE_TO_WIFO: Record<string, string> = {
  "A":       "A",
  "B":       "B_C23",
  "C10-C12": "C10-C12",
  "C13-C15": "C13-C15",
  "C16":     "C16",
  "C17":     "C17-C18",
  "C18":     "C17-C18",
  "C19":     "C19-C20",
  "C20":     "C19-C20",
  "C21":     "C21",
  "C22":     "C22",
  "C23":     "B_C23",
  "C24":     "C24",
  "C25":     "C25",
  "C26":     "C26",
  "C27":     "C27",
  "C28":     "C28",
  "C29":     "C29",
  "C30":     "C30",
  "C31_C32": "C31_C32",
  "C33":     "C33",
  "C":       "C",
  "D":       "D",
  "E":       "E",
  "F":       "F",
  "G45":     "G45",
  "G46":     "G46",
  "G47":     "G47",
  "H49":     "H49",
  "H50":     "H50",
  "H51":     "H51",
  "H52":     "H52",
  "H53":     "H53",
  "I":       "I",
  "J58":     "J58",
  "J59_J60": "J59_J60",
  "J61":     "J61",
  "J62_J63": "J62_J63",
  "K64":     "K64",
  "K65":     "K65",
  "L":       "L",
  "M69_M70": "M69_M70",
  "M71":     "M71",
  "M72":     "M72",
  "M73":     "M73",
  "N":       "N",
  "N78":     "N78",
  "O":       "O",
  "P":       "P",
  "Q86":     "Q86",
  "Q87_Q88": "Q87_Q88",
  "R":       "R",
  "S":       "S",
};

// ---------------------------------------------------------------------------
// 3. ISCO Berufsgruppen growth rates (Tabellenanhang 34, % p.a. 2023/2030)
//    59 subgroups aggregated into 9 Berufshauptgruppen
//    Key = WIFO group number (1–59)
// ---------------------------------------------------------------------------

export interface IscoGroupData {
  wifoNr: number;
  name: string;
  nameDe: string;
  iscoMajor: number;
  growthPa: number;
  emp2023: number;
  emp2030: number;
}

export const WIFO_ISCO_GROUPS: IscoGroupData[] = [
  // Berufshauptgruppe 1
  { wifoNr: 1,  name: "Managers",                                  nameDe: "Führungskräfte",                                     iscoMajor: 1, growthPa: 0.7,  emp2023: 206800, emp2030: 216800 },
  // Berufshauptgruppe 2
  { wifoNr: 2,  name: "Natural scientists (academic)",             nameDe: "Naturwissensch. Berufe (akad.)",                     iscoMajor: 2, growthPa: 1.4,  emp2023: 18400,  emp2030: 20300 },
  { wifoNr: 3,  name: "Engineers & architects",                    nameDe: "Ingenieur-, Architekt:innen",                        iscoMajor: 2, growthPa: 2.9,  emp2023: 98900,  emp2030: 120600 },
  { wifoNr: 4,  name: "Doctors",                                   nameDe: "Ärzt:innen",                                         iscoMajor: 2, growthPa: 0.9,  emp2023: 34900,  emp2030: 37100 },
  { wifoNr: 5,  name: "Academic nursing & midwifery",              nameDe: "Akad. Krankenpflege- und Geburtshilfe",               iscoMajor: 2, growthPa: 0.3,  emp2023: 106900, emp2030: 109000 },
  { wifoNr: 6,  name: "Academic health professionals",             nameDe: "Akad. u. verw. Gesundheitsberufe",                   iscoMajor: 2, growthPa: 2.6,  emp2023: 25400,  emp2030: 30300 },
  { wifoNr: 7,  name: "University & college teachers",             nameDe: "Universitäts-/Hochschullehrer:innen",                iscoMajor: 2, growthPa: 0.7,  emp2023: 35300,  emp2030: 37100 },
  { wifoNr: 8,  name: "Vocational & extracurricular teachers",     nameDe: "Lehrkräfte berufsbildend u. außerschulisch",         iscoMajor: 2, growthPa: 1.3,  emp2023: 55500,  emp2030: 60600 },
  { wifoNr: 9,  name: "Secondary teachers",                        nameDe: "Lehrkräfte Sekundarbereich",                         iscoMajor: 2, growthPa: 0.7,  emp2023: 81900,  emp2030: 85900 },
  { wifoNr: 10, name: "Primary & pre-school teachers",             nameDe: "Lehrkräfte Primar-/Vorschulbereich",                 iscoMajor: 2, growthPa: 0.8,  emp2023: 69400,  emp2030: 73300 },
  { wifoNr: 11, name: "Business professionals (academic)",         nameDe: "Wirtschaftsberufe (akad.)",                          iscoMajor: 2, growthPa: 1.9,  emp2023: 115800, emp2030: 131800 },
  { wifoNr: 12, name: "ICT professionals (academic)",              nameDe: "Akad. u. verw. IKT-Berufe",                         iscoMajor: 2, growthPa: 3.6,  emp2023: 100200, emp2030: 128100 },
  { wifoNr: 13, name: "Legal professionals",                       nameDe: "Jurist:innen",                                       iscoMajor: 2, growthPa: 1.0,  emp2023: 30300,  emp2030: 32500 },
  { wifoNr: 14, name: "Social scientists (academic)",              nameDe: "Sozialwissensch. u. verw. Berufe (akad.)",           iscoMajor: 2, growthPa: 1.9,  emp2023: 39800,  emp2030: 45500 },
  { wifoNr: 15, name: "Cultural & creative professionals",         nameDe: "Kultur-/Kreativberufe",                              iscoMajor: 2, growthPa: 1.1,  emp2023: 22100,  emp2030: 23800 },
  // Berufshauptgruppe 3
  { wifoNr: 16, name: "Engineering technicians",                   nameDe: "Material-/Ingenieurtechn. Fachkräfte",              iscoMajor: 3, growthPa: 0.5,  emp2023: 151000, emp2030: 156200 },
  { wifoNr: 17, name: "Other technical associate professionals",   nameDe: "Sonst. technische Fachkräfte",                      iscoMajor: 3, growthPa: 0.7,  emp2023: 51900,  emp2030: 54400 },
  { wifoNr: 18, name: "ICT technicians",                           nameDe: "IKT-Fachkräfte",                                    iscoMajor: 3, growthPa: 2.2,  emp2023: 35000,  emp2030: 40700 },
  // Berufshauptgruppe 4
  { wifoNr: 19, name: "Health associate professionals",            nameDe: "Assistenzfachkräfte im Gesundheitswesen (n.-akad.)", iscoMajor: 4, growthPa: 1.7,  emp2023: 59500,  emp2030: 66800 },
  { wifoNr: 20, name: "Financial associate professionals",         nameDe: "Finanzfachkräfte (n.-akad.)",                        iscoMajor: 4, growthPa: 0.7,  emp2023: 57000,  emp2030: 59800 },
  { wifoNr: 21, name: "Sales & service associate professionals",   nameDe: "Vertriebs-/Dienstleistungsfachkräfte",              iscoMajor: 4, growthPa: 0.2,  emp2023: 108300, emp2030: 109700 },
  { wifoNr: 22, name: "Administrative associate professionals",    nameDe: "Sekretariatsfachkräfte",                            iscoMajor: 4, growthPa: 0.9,  emp2023: 148600, emp2030: 158000 },
  { wifoNr: 23, name: "Public admin associate professionals",      nameDe: "Fachkräfte in öffentlicher Verwaltung",             iscoMajor: 4, growthPa: -0.4, emp2023: 23100,  emp2030: 22500 },
  { wifoNr: 24, name: "Legal, social & cultural assoc. prof.",     nameDe: "Juristische, sozialpflegerische u. Kulturfachkräfte (n.-akad.)", iscoMajor: 4, growthPa: 1.7, emp2023: 74100, emp2030: 83200 },
  // Berufshauptgruppe 5
  { wifoNr: 25, name: "General office clerks",                     nameDe: "Allgemeine Bürokräfte",                             iscoMajor: 5, growthPa: -0.8, emp2023: 161900, emp2030: 152900 },
  { wifoNr: 26, name: "Secretarial & typing clerks",               nameDe: "Sekretariats- und Schreibkräfte",                   iscoMajor: 5, growthPa: -0.1, emp2023: 45000,  emp2030: 44700 },
  { wifoNr: 27, name: "Customer contact clerks",                   nameDe: "Bürokräfte mit Kundenkontakt",                      iscoMajor: 5, growthPa: 0.2,  emp2023: 63800,  emp2030: 64600 },
  { wifoNr: 28, name: "Finance & accounting clerks",               nameDe: "Bürokräfte im Finanz-/Rechnungswesen",              iscoMajor: 5, growthPa: -0.3, emp2023: 59300,  emp2030: 58000 },
  { wifoNr: 29, name: "Material & transport clerks",               nameDe: "Bürokräfte im Bereich Materialwirtschaft/Transport",iscoMajor: 5, growthPa: 2.1,  emp2023: 63300,  emp2030: 73100 },
  // Berufshauptgruppe 6
  { wifoNr: 30, name: "Other personal service workers",            nameDe: "Sonstige pers. Dienstleistungsberufe",              iscoMajor: 6, growthPa: 0.6,  emp2023: 69700,  emp2030: 72600 },
  { wifoNr: 31, name: "Cooks",                                     nameDe: "Köch:innen",                                        iscoMajor: 6, growthPa: 0.9,  emp2023: 58700,  emp2030: 62400 },
  { wifoNr: 32, name: "Waiters",                                   nameDe: "Kellner:innen",                                     iscoMajor: 6, growthPa: 0.8,  emp2023: 65300,  emp2030: 68900 },
  { wifoNr: 33, name: "Hairdressers & related",                    nameDe: "Friseur:innen u. verw. Berufe",                     iscoMajor: 6, growthPa: 0.8,  emp2023: 22400,  emp2030: 23600 },
  { wifoNr: 34, name: "Sales workers",                             nameDe: "Verkaufskräfte",                                    iscoMajor: 6, growthPa: 0.4,  emp2023: 286400, emp2030: 294100 },
  { wifoNr: 35, name: "Childcare & learning support",              nameDe: "Kinder-/Lernbetreuer:innen",                        iscoMajor: 6, growthPa: 1.8,  emp2023: 42500,  emp2030: 48000 },
  { wifoNr: 36, name: "Healthcare workers",                        nameDe: "Betreuungsberufe im Gesundheitswesen",              iscoMajor: 6, growthPa: 2.1,  emp2023: 101800, emp2030: 117500 },
  { wifoNr: 37, name: "Protective services",                       nameDe: "Schutzkräfte, Sicherheitsbedienstete",              iscoMajor: 6, growthPa: 1.0,  emp2023: 42100,  emp2030: 45000 },
  // Berufshauptgruppe 7
  { wifoNr: 38, name: "Agriculture & forestry skilled workers",    nameDe: "Fachkräfte in Land-/Forstwirtschaft",               iscoMajor: 7, growthPa: 0.3,  emp2023: 26200,  emp2030: 26700 },
  { wifoNr: 39, name: "Building construction workers",             nameDe: "Baukonstruktions- u. verw. Berufe",                 iscoMajor: 7, growthPa: -0.1, emp2023: 72100,  emp2030: 71500 },
  { wifoNr: 40, name: "Building finishing workers",                nameDe: "Ausbaufachkräfte u. verw. Berufe",                  iscoMajor: 7, growthPa: 0.5,  emp2023: 66700,  emp2030: 69000 },
  { wifoNr: 41, name: "Building cleaners, painters",               nameDe: "Gebäudereiniger:in, Maler:in und verw. Berufe",     iscoMajor: 7, growthPa: -0.2, emp2023: 20400,  emp2030: 20100 },
  { wifoNr: 42, name: "Metal workers (forming, welding)",          nameDe: "Former-, Schweißer:innen u. verw. Metallbearbeitungsberufe", iscoMajor: 7, growthPa: 0.4, emp2023: 31800, emp2030: 32700 },
  { wifoNr: 43, name: "Toolmakers & blacksmiths",                  nameDe: "Werkzeugmacher-, GrobschmiedInnen u. verw. Berufe", iscoMajor: 7, growthPa: -0.6, emp2023: 53400,  emp2030: 51100 },
  { wifoNr: 44, name: "Machine mechanics",                         nameDe: "Maschinenmechaniker:innen/-schlosser:innen",        iscoMajor: 7, growthPa: -0.2, emp2023: 78600,  emp2030: 77300 },
  { wifoNr: 45, name: "Printing & precision craft workers",        nameDe: "Druck-/Präzisionshandwerker:innen",                 iscoMajor: 7, growthPa: -2.3, emp2023: 11000,  emp2030: 9300 },
  { wifoNr: 46, name: "Electricians & electronics workers",        nameDe: "Elektriker:innen, Elektroniker:innen",              iscoMajor: 7, growthPa: 0.3,  emp2023: 74800,  emp2030: 76300 },
  { wifoNr: 47, name: "Food processing workers",                   nameDe: "Fachkräfte in der Nahrungsmittelverarbeitung",      iscoMajor: 7, growthPa: -0.2, emp2023: 23400,  emp2030: 23000 },
  { wifoNr: 48, name: "Wood workers & cabinet makers",             nameDe: "Holzbearbeiter-, Möbeltischler:innen",              iscoMajor: 7, growthPa: -1.3, emp2023: 17800,  emp2030: 16200 },
  { wifoNr: 49, name: "Other craft & related workers",             nameDe: "Sonstige Handwerks- u. verw. Berufe",               iscoMajor: 7, growthPa: -0.2, emp2023: 19500,  emp2030: 19200 },
  // Berufshauptgruppe 8
  { wifoNr: 50, name: "Stationary plant & machine operators",      nameDe: "Bedienung stationärer Anlagen/Maschinen",          iscoMajor: 8, growthPa: -0.4, emp2023: 55300,  emp2030: 53700 },
  { wifoNr: 51, name: "Assemblers",                                nameDe: "Montageberufe",                                     iscoMajor: 8, growthPa: -0.9, emp2023: 19000,  emp2030: 17800 },
  { wifoNr: 52, name: "Drivers",                                   nameDe: "Fahrzeugführung",                                   iscoMajor: 8, growthPa: 0.2,  emp2023: 114600, emp2030: 116000 },
  { wifoNr: 53, name: "Mobile plant operators",                    nameDe: "Bedienung mobiler Anlagen",                         iscoMajor: 8, growthPa: -0.1, emp2023: 36700,  emp2030: 36400 },
  // Berufshauptgruppe 9
  { wifoNr: 54, name: "Cleaners & other service helpers",          nameDe: "Reinigungspersonal, sonst. Dienstleistungshilfskräfte", iscoMajor: 9, growthPa: 0.6, emp2023: 133400, emp2030: 138900 },
  { wifoNr: 55, name: "Construction & mining labourers",           nameDe: "Hilfskräfte im Bau/Bergbau",                        iscoMajor: 9, growthPa: -0.5, emp2023: 25400,  emp2030: 24500 },
  { wifoNr: 56, name: "Manufacturing labourers",                   nameDe: "Hilfskräfte in Sachgütererzeugung",                 iscoMajor: 9, growthPa: 0.4,  emp2023: 61100,  emp2030: 62700 },
  { wifoNr: 57, name: "Transport & agriculture labourers",         nameDe: "Hilfskräfte in Transport, Lagerei, Landwirtschaft", iscoMajor: 9, growthPa: 0.4,  emp2023: 69200,  emp2030: 71100 },
  { wifoNr: 58, name: "Food preparation helpers",                  nameDe: "Hilfskräfte in der Nahrungsmittelzubereitung",      iscoMajor: 9, growthPa: 0.9,  emp2023: 36500,  emp2030: 38800 },
  // Berufshauptgruppe 0
  { wifoNr: 59, name: "Armed forces",                              nameDe: "Angehörige der regulären Streitkräfte",             iscoMajor: 0, growthPa: 0.0,  emp2023: 9400,   emp2030: 9400 },
];

// ---------------------------------------------------------------------------
// 4. ISCO 2-digit → WIFO Berufsgruppe mapping
//    Our OCCUPATION_DEFS use ISCO-08 2-digit codes. The WIFO 59 subgroups
//    are a custom aggregation. We map ISCO 2-digit → best-matching WIFO group.
//    When a 2-digit ISCO spans multiple WIFO groups, we pick the closest match.
// ---------------------------------------------------------------------------

/** Maps our ISCO 2-digit code to WIFO Berufsgruppe number (wifoNr) */
export const ISCO2_TO_WIFO_NR: Record<string, number> = {
  "11": 1,   // Managers → Führungskräfte
  "12": 1,   // Managers → Führungskräfte
  "13": 1,   // Managers → Führungskräfte
  "21": 3,   // Engineers, architects, scientists → Ingenieur-, Architekt:innen
  "22": 4,   // Doctors → Ärzt:innen
  "23": 9,   // Teachers → Lehrkräfte Sekundarbereich (closest to general teaching)
  "24": 11,  // Business & admin professionals → Wirtschaftsberufe (akad.)
  "25": 12,  // ICT professionals → Akad. u. verw. IKT-Berufe
  "26": 14,  // Social science & culture → Sozialwissensch. u. verw. Berufe (akad.)
  "31": 16,  // Engineering technicians → Material-/Ingenieurtechn. Fachkräfte
  "32": 19,  // Health associate professionals → Assistenzfachkräfte im Gesundheitswesen
  "33": 20,  // Financial associate professionals → Finanzfachkräfte
  "34": 15,  // Cultural & creative → Kultur-/Kreativberufe
  "35": 18,  // ICT technicians → IKT-Fachkräfte
  "41": 25,  // General office clerks → Allgemeine Bürokräfte
  "42": 27,  // Customer contact clerks → Bürokräfte mit Kundenkontakt
  "43": 28,  // Finance & accounting clerks → Bürokräfte im Finanz-/Rechnungswesen
  "44": 26,  // Other clerical support → Sekretariats- und Schreibkräfte
  "51": 30,  // Personal service workers → Sonstige pers. Dienstleistungsberufe
  "52": 34,  // Sales workers → Verkaufskräfte
  "53": 36,  // Care workers → Betreuungsberufe im Gesundheitswesen
  "54": 37,  // Protective services → Schutzkräfte
  "61": 38,  // Agriculture skilled workers → Fachkräfte in Land-/Forstwirtschaft
  "62": 38,  // Forestry/fishery → Fachkräfte in Land-/Forstwirtschaft
  "71": 40,  // Building trades → Ausbaufachkräfte u. verw. Berufe
  "72": 42,  // Metal & machinery workers → Former-, Schweißer:innen
  "73": 45,  // Printing craft workers → Druck-/Präzisionshandwerker:innen
  "74": 46,  // Electrical workers → Elektriker:innen
  "75": 47,  // Food & related trades → Fachkräfte in der Nahrungsmittelverarbeitung
  "81": 50,  // Stationary plant operators → Bedienung stationärer Anlagen
  "82": 51,  // Assemblers → Montageberufe
  "83": 52,  // Drivers → Fahrzeugführung
  "91": 54,  // Cleaners & helpers → Reinigungspersonal
  "92": 57,  // Agricultural labourers → Hilfskräfte in Transport, Lagerei, Landwirtschaft
  "93": 55,  // Construction labourers → Hilfskräfte im Bau/Bergbau
  "94": 58,  // Food preparation helpers → Hilfskräfte in der Nahrungsmittelzubereitung
  "96": 54,  // Other elementary workers → Reinigungspersonal
};

// ---------------------------------------------------------------------------
// 5. Helper: look up composite growth rate
// ---------------------------------------------------------------------------

const wifoIscoIndex = new Map(WIFO_ISCO_GROUPS.map(g => [g.wifoNr, g]));

/**
 * Compute a composite WIFO/AMS outlook growth rate for one occupation row.
 * @param nace  - the occupation's NACE sector code (e.g. "J62_J63")
 * @param isco  - the occupation's ISCO 2-digit code (e.g. "25")
 * @param naceWeight - weight for NACE sector signal (default 0.6)
 * @returns { growthPa, naceGrowth, iscoGrowth } or null if unmapped
 */
export function lookupWifoGrowth(
  nace: string,
  isco: string,
  naceWeight = 0.6,
): { growthPa: number; naceGrowth: number; iscoGrowth: number } | null {
  const wifoKey = NACE_TO_WIFO[nace];
  const sector = wifoKey ? WIFO_NACE_SECTORS[wifoKey] : undefined;
  if (!sector) return null;

  const iscoWifoNr = ISCO2_TO_WIFO_NR[isco];
  const iscoGroup = iscoWifoNr != null ? wifoIscoIndex.get(iscoWifoNr) : undefined;

  const naceGrowth = sector.growthPa;
  const iscoGrowth = iscoGroup?.growthPa ?? naceGrowth;

  const growthPa = Math.round((naceWeight * naceGrowth + (1 - naceWeight) * iscoGrowth) * 10) / 10;

  return { growthPa, naceGrowth, iscoGrowth };
}

/**
 * Map a real % p.a. growth rate to the -10..+10 scale for color encoding.
 * Linear mapping: -2.5% -> -10, 0% -> 0, +3.7% -> +10 (clamped)
 */
export function growthToOutlookScale(growthPa: number): number {
  if (growthPa >= 0) {
    return Math.round(Math.min(10, (growthPa / 3.7) * 10));
  }
  return Math.round(Math.max(-10, (growthPa / 2.5) * 10));
}

/**
 * Compute an outlookDesc label from the real growth rate.
 */
export function growthToOutlookDesc(growthPa: number): string {
  if (growthPa <= -1.5) return "Strongly declining";
  if (growthPa <= -0.5) return "Declining";
  if (growthPa < 0.3)   return "Stable";
  if (growthPa < 1.0)   return "Slow growth";
  if (growthPa < 2.0)   return "Growing";
  if (growthPa < 3.0)   return "Strong growth";
  return "Rapid growth";
}

export function growthToOutlookDescDe(growthPa: number): string {
  if (growthPa <= -1.5) return "Stark rückläufig";
  if (growthPa <= -0.5) return "Rückläufig";
  if (growthPa < 0.3)   return "Stabil";
  if (growthPa < 1.0)   return "Leichtes Wachstum";
  if (growthPa < 2.0)   return "Wachsend";
  if (growthPa < 3.0)   return "Starkes Wachstum";
  return "Sehr starkes Wachstum";
}
