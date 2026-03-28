/**
 * REAL Austrian Labour Market Data — fetched 2026-03-28T19:10:37.947Z
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
 *    Year: 2024
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

// ─── Fetched 2026-03-28T19:10:37.947Z ──────────────────────────────────────────

/** Employed persons by ISCO-08 (2-digit) — Eurostat lfsa_egai2d, AT, year 2024 */
export const employmentByISCO2 = [
  {
    "isco08": "33",
    "labelEn": "Business and administration associate professionals",
    "eurostatCode": "OC33",
    "employmentThousands": 366,
    "employmentPersons": 366000
  },
  {
    "isco08": "52",
    "labelEn": "Sales workers",
    "eurostatCode": "OC52",
    "employmentThousands": 315.7,
    "employmentPersons": 315700
  },
  {
    "isco08": "51",
    "labelEn": "Personal service workers",
    "eurostatCode": "OC51",
    "employmentThousands": 265.1,
    "employmentPersons": 265100
  },
  {
    "isco08": "23",
    "labelEn": "Teaching professionals",
    "eurostatCode": "OC23",
    "employmentThousands": 245,
    "employmentPersons": 245000
  },
  {
    "isco08": "31",
    "labelEn": "Science and engineering associate professionals",
    "eurostatCode": "OC31",
    "employmentThousands": 225.1,
    "employmentPersons": 225100
  },
  {
    "isco08": "41",
    "labelEn": "General and keyboard clerks",
    "eurostatCode": "OC41",
    "employmentThousands": 197.2,
    "employmentPersons": 197200
  },
  {
    "isco08": "22",
    "labelEn": "Health professionals",
    "eurostatCode": "OC22",
    "employmentThousands": 194.9,
    "employmentPersons": 194900
  },
  {
    "isco08": "72",
    "labelEn": "Metal, machinery and related trades workers",
    "eurostatCode": "OC72",
    "employmentThousands": 173.6,
    "employmentPersons": 173600
  },
  {
    "isco08": "71",
    "labelEn": "Building and related trades workers, excluding electricians",
    "eurostatCode": "OC71",
    "employmentThousands": 171.9,
    "employmentPersons": 171900
  },
  {
    "isco08": "83",
    "labelEn": "Drivers and mobile plant operators",
    "eurostatCode": "OC83",
    "employmentThousands": 158.3,
    "employmentPersons": 158300
  },
  {
    "isco08": "53",
    "labelEn": "Personal care workers",
    "eurostatCode": "OC53",
    "employmentThousands": 156.9,
    "employmentPersons": 156900
  },
  {
    "isco08": "24",
    "labelEn": "Business and administration professionals",
    "eurostatCode": "OC24",
    "employmentThousands": 155.1,
    "employmentPersons": 155100
  },
  {
    "isco08": "21",
    "labelEn": "Science and engineering professionals",
    "eurostatCode": "OC21",
    "employmentThousands": 152.3,
    "employmentPersons": 152300
  },
  {
    "isco08": "91",
    "labelEn": "Cleaners and helpers",
    "eurostatCode": "OC91",
    "employmentThousands": 147.6,
    "employmentPersons": 147600
  },
  {
    "isco08": "26",
    "labelEn": "Legal, social and cultural professionals",
    "eurostatCode": "OC26",
    "employmentThousands": 144.6,
    "employmentPersons": 144600
  },
  {
    "isco08": "93",
    "labelEn": "Labourers in mining, construction, manufacturing and transport",
    "eurostatCode": "OC93",
    "employmentThousands": 136,
    "employmentPersons": 136000
  },
  {
    "isco08": "43",
    "labelEn": "Numerical and material recording clerks",
    "eurostatCode": "OC43",
    "employmentThousands": 130.5,
    "employmentPersons": 130500
  },
  {
    "isco08": "25",
    "labelEn": "Information and communications technology professionals",
    "eurostatCode": "OC25",
    "employmentThousands": 129.4,
    "employmentPersons": 129400
  },
  {
    "isco08": "61",
    "labelEn": "Market-oriented skilled agricultural workers",
    "eurostatCode": "OC61",
    "employmentThousands": 116.9,
    "employmentPersons": 116900
  },
  {
    "isco08": "34",
    "labelEn": "Legal, social, cultural and related associate professionals",
    "eurostatCode": "OC34",
    "employmentThousands": 98.7,
    "employmentPersons": 98700
  },
  {
    "isco08": "12",
    "labelEn": "Administrative and commercial managers",
    "eurostatCode": "OC12",
    "employmentThousands": 87.9,
    "employmentPersons": 87900
  },
  {
    "isco08": "32",
    "labelEn": "Health associate professionals",
    "eurostatCode": "OC32",
    "employmentThousands": 78.6,
    "employmentPersons": 78600
  },
  {
    "isco08": "13",
    "labelEn": "Production and specialised services managers",
    "eurostatCode": "OC13",
    "employmentThousands": 75.1,
    "employmentPersons": 75100
  },
  {
    "isco08": "74",
    "labelEn": "Electrical and electronic trades workers",
    "eurostatCode": "OC74",
    "employmentThousands": 74.1,
    "employmentPersons": 74100
  },
  {
    "isco08": "75",
    "labelEn": "Food processing, wood working, garment and other craft and related trades workers",
    "eurostatCode": "OC75",
    "employmentThousands": 68.2,
    "employmentPersons": 68200
  },
  {
    "isco08": "42",
    "labelEn": "Customer services clerks",
    "eurostatCode": "OC42",
    "employmentThousands": 68.1,
    "employmentPersons": 68100
  },
  {
    "isco08": "81",
    "labelEn": "Stationary plant and machine operators",
    "eurostatCode": "OC81",
    "employmentThousands": 61.8,
    "employmentPersons": 61800
  },
  {
    "isco08": "54",
    "labelEn": "Protective services workers",
    "eurostatCode": "OC54",
    "employmentThousands": 44.6,
    "employmentPersons": 44600
  },
  {
    "isco08": "35",
    "labelEn": "Information and communications technicians",
    "eurostatCode": "OC35",
    "employmentThousands": 38.1,
    "employmentPersons": 38100
  },
  {
    "isco08": "14",
    "labelEn": "Hospitality, retail and other services managers",
    "eurostatCode": "OC14",
    "employmentThousands": 34.4,
    "employmentPersons": 34400
  },
  {
    "isco08": "11",
    "labelEn": "Chief executives, senior officials and legislators",
    "eurostatCode": "OC11",
    "employmentThousands": 33.6,
    "employmentPersons": 33600
  },
  {
    "isco08": "94",
    "labelEn": "Food preparation assistants",
    "eurostatCode": "OC94",
    "employmentThousands": 33.3,
    "employmentPersons": 33300
  },
  {
    "isco08": "44",
    "labelEn": "Other clerical support workers",
    "eurostatCode": "OC44",
    "employmentThousands": 31.6,
    "employmentPersons": 31600
  },
  {
    "isco08": "96",
    "labelEn": "Refuse workers and other elementary workers",
    "eurostatCode": "OC96",
    "employmentThousands": 19.4,
    "employmentPersons": 19400
  },
  {
    "isco08": "82",
    "labelEn": "Assemblers",
    "eurostatCode": "OC82",
    "employmentThousands": 16.9,
    "employmentPersons": 16900
  },
  {
    "isco08": "73",
    "labelEn": "Handicraft and printing workers",
    "eurostatCode": "OC73",
    "employmentThousands": 16.8,
    "employmentPersons": 16800
  },
  {
    "isco08": "62",
    "labelEn": "Market-oriented skilled forestry, fishery and hunting workers",
    "eurostatCode": "OC62",
    "employmentThousands": 6.6,
    "employmentPersons": 6600
  },
  {
    "isco08": "92",
    "labelEn": "Agricultural, forestry and fishery labourers",
    "eurostatCode": "OC92",
    "employmentThousands": 6.2,
    "employmentPersons": 6200
  }
] as const;

/** Reference total employed (LFS, same table as employmentByISCO2) */
export const TOTAL_EMPLOYMENT_LFS = 4488700;

/** Year of LFS employment figures */
export const LFS_EMPLOYMENT_YEAR = 2024 as const;

/** Employment by NACE Rev.2 sector — Eurostat nama_10_a64_e 2024 (weighting only) */
export const employmentByNACE = [
  {
    "nace": "TOTAL",
    "label": "Total economy",
    "employmentThousands": 4731.97,
    "employmentPersons": 4731970
  },
  {
    "nace": "G",
    "label": "Wholesale and retail trade",
    "employmentThousands": 693.53,
    "employmentPersons": 693530
  },
  {
    "nace": "C",
    "label": "Manufacturing",
    "employmentThousands": 688.52,
    "employmentPersons": 688520
  },
  {
    "nace": "Q",
    "label": "Human health and social work",
    "employmentThousands": 522.6,
    "employmentPersons": 522600
  },
  {
    "nace": "G47",
    "label": "Retail trade",
    "employmentThousands": 386.95,
    "employmentPersons": 386950
  },
  {
    "nace": "P",
    "label": "Education",
    "employmentThousands": 336.99,
    "employmentPersons": 336990
  },
  {
    "nace": "P85",
    "label": "P85",
    "employmentThousands": 336.99,
    "employmentPersons": 336990
  },
  {
    "nace": "M",
    "label": "Professional, scientific, technical",
    "employmentThousands": 324.46,
    "employmentPersons": 324460
  },
  {
    "nace": "Q86",
    "label": "Human health activities",
    "employmentThousands": 318.05,
    "employmentPersons": 318050
  },
  {
    "nace": "F",
    "label": "Construction",
    "employmentThousands": 317.3,
    "employmentPersons": 317300
  },
  {
    "nace": "I",
    "label": "Accommodation and food service",
    "employmentThousands": 301.84,
    "employmentPersons": 301840
  },
  {
    "nace": "O",
    "label": "Public administration, defence",
    "employmentThousands": 280.5,
    "employmentPersons": 280500
  },
  {
    "nace": "O84",
    "label": "O84",
    "employmentThousands": 280.5,
    "employmentPersons": 280500
  },
  {
    "nace": "N",
    "label": "Administrative and support services",
    "employmentThousands": 266.48,
    "employmentPersons": 266480
  },
  {
    "nace": "M69-M71",
    "label": "M69-M71",
    "employmentThousands": 237.75,
    "employmentPersons": 237750
  },
  {
    "nace": "H",
    "label": "Transportation and storage",
    "employmentThousands": 230.95,
    "employmentPersons": 230950
  },
  {
    "nace": "G46",
    "label": "Wholesale trade",
    "employmentThousands": 221.26,
    "employmentPersons": 221260
  },
  {
    "nace": "Q87_Q88",
    "label": "Residential care + social work",
    "employmentThousands": 204.55,
    "employmentPersons": 204550
  },
  {
    "nace": "M69_M70",
    "label": "Legal, accounting, management",
    "employmentThousands": 168.16,
    "employmentPersons": 168160
  },
  {
    "nace": "N80-N82",
    "label": "N80-N82",
    "employmentThousands": 156.12,
    "employmentPersons": 156120
  },
  {
    "nace": "J",
    "label": "Information and communication",
    "employmentThousands": 152.91,
    "employmentPersons": 152910
  },
  {
    "nace": "H49",
    "label": "Land transport",
    "employmentThousands": 136.59,
    "employmentPersons": 136590
  },
  {
    "nace": "A",
    "label": "Agriculture, forestry, fishing",
    "employmentThousands": 136.5,
    "employmentPersons": 136500
  },
  {
    "nace": "S",
    "label": "Other service activities",
    "employmentThousands": 133.42,
    "employmentPersons": 133420
  },
  {
    "nace": "K",
    "label": "Financial and insurance",
    "employmentThousands": 129.97,
    "employmentPersons": 129970
  },
  {
    "nace": "C24_C25",
    "label": "C24_C25",
    "employmentThousands": 118.53,
    "employmentPersons": 118530
  },
  {
    "nace": "A01",
    "label": "Crop and animal production",
    "employmentThousands": 117.74,
    "employmentPersons": 117740
  },
  {
    "nace": "J62_J63",
    "label": "IT services, programming",
    "employmentThousands": 107.52,
    "employmentPersons": 107520
  },
  {
    "nace": "C28",
    "label": "Machinery and equipment",
    "employmentThousands": 97.84,
    "employmentPersons": 97840
  },
  {
    "nace": "C10-C12",
    "label": "Food, beverages, tobacco",
    "employmentThousands": 92.69,
    "employmentPersons": 92690
  },
  {
    "nace": "G45",
    "label": "Motor vehicle trade & repair",
    "employmentThousands": 85.32,
    "employmentPersons": 85320
  },
  {
    "nace": "N78",
    "label": "Employment activities",
    "employmentThousands": 83.61,
    "employmentPersons": 83610
  },
  {
    "nace": "C25",
    "label": "Fabricated metal products",
    "employmentThousands": 77.61,
    "employmentPersons": 77610
  },
  {
    "nace": "S96",
    "label": "Other personal services",
    "employmentThousands": 77.38,
    "employmentPersons": 77380
  },
  {
    "nace": "K64",
    "label": "Financial services",
    "employmentThousands": 74.27,
    "employmentPersons": 74270
  },
  {
    "nace": "L",
    "label": "Real estate activities",
    "employmentThousands": 73.3,
    "employmentPersons": 73300
  },
  {
    "nace": "L68",
    "label": "L68",
    "employmentThousands": 73.3,
    "employmentPersons": 73300
  },
  {
    "nace": "R",
    "label": "Arts, entertainment, recreation",
    "employmentThousands": 72.44,
    "employmentPersons": 72440
  },
  {
    "nace": "M71",
    "label": "Architecture and engineering",
    "employmentThousands": 69.59,
    "employmentPersons": 69590
  },
  {
    "nace": "C31-C33",
    "label": "C31-C33",
    "employmentThousands": 68.39,
    "employmentPersons": 68390
  },
  {
    "nace": "M73-M75",
    "label": "M73-M75",
    "employmentThousands": 64.25,
    "employmentPersons": 64250
  },
  {
    "nace": "C22_C23",
    "label": "C22_C23",
    "employmentThousands": 59.41,
    "employmentPersons": 59410
  },
  {
    "nace": "H52",
    "label": "Warehousing & support",
    "employmentThousands": 59.31,
    "employmentPersons": 59310
  },
  {
    "nace": "C16-C18",
    "label": "C16-C18",
    "employmentThousands": 57.17,
    "employmentPersons": 57170
  },
  {
    "nace": "S94",
    "label": "Membership organisations",
    "employmentThousands": 52.22,
    "employmentPersons": 52220
  },
  {
    "nace": "C29_C30",
    "label": "C29_C30",
    "employmentThousands": 50.44,
    "employmentPersons": 50440
  },
  {
    "nace": "C27",
    "label": "Electrical equipment",
    "employmentThousands": 49.56,
    "employmentPersons": 49560
  },
  {
    "nace": "R90-R92",
    "label": "Creative arts, libraries, museums",
    "employmentThousands": 43.6,
    "employmentPersons": 43600
  },
  {
    "nace": "C31_C32",
    "label": "Furniture + other manufacturing",
    "employmentThousands": 42.37,
    "employmentPersons": 42370
  },
  {
    "nace": "C24",
    "label": "Basic metals",
    "employmentThousands": 40.92,
    "employmentPersons": 40920
  },
  {
    "nace": "M73",
    "label": "Advertising and market research",
    "employmentThousands": 36.3,
    "employmentPersons": 36300
  },
  {
    "nace": "C26",
    "label": "Computer, electronic, optical",
    "employmentThousands": 35.38,
    "employmentPersons": 35380
  },
  {
    "nace": "C29",
    "label": "Motor vehicles",
    "employmentThousands": 34.68,
    "employmentPersons": 34680
  },
  {
    "nace": "C16",
    "label": "Wood products (excl. furniture)",
    "employmentThousands": 32.75,
    "employmentPersons": 32750
  },
  {
    "nace": "J58-J60",
    "label": "J58-J60",
    "employmentThousands": 31.6,
    "employmentPersons": 31600
  },
  {
    "nace": "C22",
    "label": "Rubber and plastic products",
    "employmentThousands": 31.19,
    "employmentPersons": 31190
  },
  {
    "nace": "D",
    "label": "Electricity, gas, steam, AC",
    "employmentThousands": 30.4,
    "employmentPersons": 30400
  },
  {
    "nace": "D35",
    "label": "D35",
    "employmentThousands": 30.4,
    "employmentPersons": 30400
  },
  {
    "nace": "K66",
    "label": "Auxiliary financial services",
    "employmentThousands": 28.92,
    "employmentPersons": 28920
  },
  {
    "nace": "R93",
    "label": "Sports, amusement, recreation",
    "employmentThousands": 28.84,
    "employmentPersons": 28840
  },
  {
    "nace": "C23",
    "label": "Non-metallic mineral products",
    "employmentThousands": 28.22,
    "employmentPersons": 28220
  },
  {
    "nace": "M74_M75",
    "label": "M74_M75",
    "employmentThousands": 27.95,
    "employmentPersons": 27950
  },
  {
    "nace": "K65",
    "label": "Insurance",
    "employmentThousands": 26.79,
    "employmentPersons": 26790
  },
  {
    "nace": "H53",
    "label": "Postal and courier",
    "employmentThousands": 26.48,
    "employmentPersons": 26480
  },
  {
    "nace": "C33",
    "label": "Repair of machinery",
    "employmentThousands": 26.02,
    "employmentPersons": 26020
  },
  {
    "nace": "E",
    "label": "Water, sewerage, waste",
    "employmentThousands": 25.96,
    "employmentPersons": 25960
  },
  {
    "nace": "E37-E39",
    "label": "E37-E39",
    "employmentThousands": 23.52,
    "employmentPersons": 23520
  },
  {
    "nace": "M72",
    "label": "Scientific R&D",
    "employmentThousands": 22.46,
    "employmentPersons": 22460
  },
  {
    "nace": "C21",
    "label": "Pharmaceuticals",
    "employmentThousands": 21.71,
    "employmentPersons": 21710
  },
  {
    "nace": "C20",
    "label": "Chemicals",
    "employmentThousands": 21.08,
    "employmentPersons": 21080
  },
  {
    "nace": "A02",
    "label": "Forestry and logging",
    "employmentThousands": 18.27,
    "employmentPersons": 18270
  },
  {
    "nace": "J59_J60",
    "label": "Film, TV, broadcasting",
    "employmentThousands": 15.88,
    "employmentPersons": 15880
  },
  {
    "nace": "C17",
    "label": "Paper and paper products",
    "employmentThousands": 15.76,
    "employmentPersons": 15760
  },
  {
    "nace": "C30",
    "label": "Other transport equipment",
    "employmentThousands": 15.76,
    "employmentPersons": 15760
  },
  {
    "nace": "J58",
    "label": "Publishing",
    "employmentThousands": 15.72,
    "employmentPersons": 15720
  },
  {
    "nace": "C13-C15",
    "label": "Textiles, wearing apparel, leather",
    "employmentThousands": 14.5,
    "employmentPersons": 14500
  },
  {
    "nace": "J61",
    "label": "Telecommunications",
    "employmentThousands": 13.79,
    "employmentPersons": 13790
  },
  {
    "nace": "N77",
    "label": "Rental and leasing",
    "employmentThousands": 13.7,
    "employmentPersons": 13700
  },
  {
    "nace": "N79",
    "label": "Travel agencies",
    "employmentThousands": 13.05,
    "employmentPersons": 13050
  },
  {
    "nace": "C18",
    "label": "Printing and recorded media",
    "employmentThousands": 8.66,
    "employmentPersons": 8660
  },
  {
    "nace": "T",
    "label": "Households as employers",
    "employmentThousands": 8.41,
    "employmentPersons": 8410
  },
  {
    "nace": "H51",
    "label": "Air transport",
    "employmentThousands": 7.91,
    "employmentPersons": 7910
  },
  {
    "nace": "B",
    "label": "Mining and quarrying",
    "employmentThousands": 5.51,
    "employmentPersons": 5510
  },
  {
    "nace": "S95",
    "label": "Repair of personal goods",
    "employmentThousands": 3.82,
    "employmentPersons": 3820
  },
  {
    "nace": "E36",
    "label": "E36",
    "employmentThousands": 2.44,
    "employmentPersons": 2440
  },
  {
    "nace": "C19",
    "label": "Coke and petroleum products",
    "employmentThousands": 1.84,
    "employmentPersons": 1840
  },
  {
    "nace": "H50",
    "label": "Water transport",
    "employmentThousands": 0.66,
    "employmentPersons": 660
  },
  {
    "nace": "A03",
    "label": "Fishing and aquaculture",
    "employmentThousands": 0.49,
    "employmentPersons": 490
  }
] as const;

/** Gross hourly earnings by ÖNACE sector — Statistik Austria VSE 2022 */
export const earningsByNACE = [
  {
    "nace": "total",
    "label": "Insgesamt",
    "medianHourlyEUR": 17.49,
    "q25HourlyEUR": 13.5,
    "q75HourlyEUR": 23.28,
    "annualGrossEstimate": 36379,
    "employeeCount": 2780578
  },
  {
    "nace": "B_F",
    "label": "B-F  Produzierender Bereich",
    "medianHourlyEUR": 19.28,
    "q25HourlyEUR": 15.92,
    "q75HourlyEUR": 24.81,
    "annualGrossEstimate": 40102,
    "employeeCount": 838455
  },
  {
    "nace": "GNPS",
    "label": "G-N, P-S  Dienstleistungsbereich",
    "medianHourlyEUR": 16.49,
    "q25HourlyEUR": 12.59,
    "q75HourlyEUR": 22.45,
    "annualGrossEstimate": 34299,
    "employeeCount": 1942123
  },
  {
    "nace": "B",
    "label": "B    Bergbau und Gewinnung von Steinen und Erden",
    "medianHourlyEUR": 18.98,
    "q25HourlyEUR": 16.03,
    "q75HourlyEUR": 25.8,
    "annualGrossEstimate": 39478,
    "employeeCount": 6394
  },
  {
    "nace": "C",
    "label": "C    Herstellung von Waren",
    "medianHourlyEUR": 19.77,
    "q25HourlyEUR": 15.91,
    "q75HourlyEUR": 25.65,
    "annualGrossEstimate": 41122,
    "employeeCount": 566259
  },
  {
    "nace": "CA",
    "label": "\"CA  H. v. Nahrungs- u. Futtermitteln",
    "medianHourlyEUR": 15.33,
    "q25HourlyEUR": 12.29,
    "q75HourlyEUR": 19.69,
    "annualGrossEstimate": 31886,
    "employeeCount": 67878
  },
  {
    "nace": "CB",
    "label": "\"CB  H. v. Textilien, Bekleidung",
    "medianHourlyEUR": 15.49,
    "q25HourlyEUR": 12.04,
    "q75HourlyEUR": 20.76,
    "annualGrossEstimate": 32219,
    "employeeCount": 11108
  },
  {
    "nace": "CC",
    "label": "\"CC  H.v. Holzwaren (o. Möbel), Papier",
    "medianHourlyEUR": 18.27,
    "q25HourlyEUR": 15.04,
    "q75HourlyEUR": 23.56,
    "annualGrossEstimate": 38002,
    "employeeCount": 49754
  },
  {
    "nace": "CE",
    "label": "CE  Herstellung von chemischen Erzeugnissen",
    "medianHourlyEUR": 24.01,
    "q25HourlyEUR": 18.68,
    "q75HourlyEUR": 31.14,
    "annualGrossEstimate": 49941,
    "employeeCount": 18548
  },
  {
    "nace": "CF",
    "label": "CF  Herstellung von pharmazeutischen Erzeugnissen",
    "medianHourlyEUR": 25.99,
    "q25HourlyEUR": 20,
    "q75HourlyEUR": 34.15,
    "annualGrossEstimate": 54059,
    "employeeCount": 18451
  },
  {
    "nace": "CG",
    "label": "\"CG  H.v. Gummi- und Kunststoffwaren",
    "medianHourlyEUR": 19.09,
    "q25HourlyEUR": 15.58,
    "q75HourlyEUR": 23.65,
    "annualGrossEstimate": 39707,
    "employeeCount": 55234
  },
  {
    "nace": "CH",
    "label": "CH  Metallerzeug. u. -bearbeitung, Herstellung v. Metallerzeugnissen",
    "medianHourlyEUR": 20.07,
    "q25HourlyEUR": 16.64,
    "q75HourlyEUR": 24.87,
    "annualGrossEstimate": 41746,
    "employeeCount": 99694
  },
  {
    "nace": "CI",
    "label": "CI  H.v. Datenverarbeitungsgeräten, elektron. U. optischen Erzeugnissen",
    "medianHourlyEUR": 22.43,
    "q25HourlyEUR": 17.55,
    "q75HourlyEUR": 30.34,
    "annualGrossEstimate": 46654,
    "employeeCount": 21045
  },
  {
    "nace": "CJ",
    "label": "CJ  Herstellung von elektrischen Ausrüstungen",
    "medianHourlyEUR": 21.64,
    "q25HourlyEUR": 17.19,
    "q75HourlyEUR": 28.41,
    "annualGrossEstimate": 45011,
    "employeeCount": 41588
  },
  {
    "nace": "CK",
    "label": "CK  Maschinenbau",
    "medianHourlyEUR": 21.1,
    "q25HourlyEUR": 17.51,
    "q75HourlyEUR": 27,
    "annualGrossEstimate": 43888,
    "employeeCount": 83048
  },
  {
    "nace": "CL",
    "label": "\"CL  H.v. Kraftwagen u. –teilen",
    "medianHourlyEUR": 21.88,
    "q25HourlyEUR": 17.71,
    "q75HourlyEUR": 27.08,
    "annualGrossEstimate": 45510,
    "employeeCount": 45870
  },
  {
    "nace": "CM",
    "label": "CM  H. v. Möbeln, H. v. sonst. Waren, Rep. u. Installation v. Maschinen u. Ausrüstungen",
    "medianHourlyEUR": 18.53,
    "q25HourlyEUR": 15.27,
    "q75HourlyEUR": 24.2,
    "annualGrossEstimate": 38542,
    "employeeCount": 51230
  },
  {
    "nace": "D",
    "label": "D    Energieversorgung",
    "medianHourlyEUR": 27.12,
    "q25HourlyEUR": 21.12,
    "q75HourlyEUR": 34.69,
    "annualGrossEstimate": 56410,
    "employeeCount": 22334
  },
  {
    "nace": "E",
    "label": "\"E    Wasserversorgung",
    "medianHourlyEUR": 15.82,
    "q25HourlyEUR": 13.43,
    "q75HourlyEUR": 19.93,
    "annualGrossEstimate": 32906,
    "employeeCount": 16097
  },
  {
    "nace": "F",
    "label": "F    Bau",
    "medianHourlyEUR": 18.26,
    "q25HourlyEUR": 15.93,
    "q75HourlyEUR": 22.02,
    "annualGrossEstimate": 37981,
    "employeeCount": 227371
  },
  {
    "nace": "G",
    "label": "\"G    Handel",
    "medianHourlyEUR": 15.3,
    "q25HourlyEUR": 12.45,
    "q75HourlyEUR": 20.14,
    "annualGrossEstimate": 31824,
    "employeeCount": 490257
  },
  {
    "nace": "H",
    "label": "H    Verkehr und Lagerei",
    "medianHourlyEUR": 15.9,
    "q25HourlyEUR": 12.56,
    "q75HourlyEUR": 21.08,
    "annualGrossEstimate": 33072,
    "employeeCount": 182408
  },
  {
    "nace": "I",
    "label": "I     Beherbergung und Gastronomie",
    "medianHourlyEUR": 11.16,
    "q25HourlyEUR": 9.94,
    "q75HourlyEUR": 13.58,
    "annualGrossEstimate": 23213,
    "employeeCount": 168520
  },
  {
    "nace": "J",
    "label": "J     Information und Kommunikation",
    "medianHourlyEUR": 24.63,
    "q25HourlyEUR": 18.96,
    "q75HourlyEUR": 31.99,
    "annualGrossEstimate": 51230,
    "employeeCount": 104681
  },
  {
    "nace": "JA",
    "label": "\"JA  Verlagswesen",
    "medianHourlyEUR": 23.53,
    "q25HourlyEUR": 17.15,
    "q75HourlyEUR": 32.93,
    "annualGrossEstimate": 48942,
    "employeeCount": 22800
  },
  {
    "nace": "JB",
    "label": "JB  Telekommunikation",
    "medianHourlyEUR": 25.49,
    "q25HourlyEUR": 19.86,
    "q75HourlyEUR": 31.66,
    "annualGrossEstimate": 53019,
    "employeeCount": 9527
  },
  {
    "nace": "JC",
    "label": "\"JC  Erbringung von Dienstl.d. Informations-technologie",
    "medianHourlyEUR": 24.74,
    "q25HourlyEUR": 19.26,
    "q75HourlyEUR": 31.79,
    "annualGrossEstimate": 51459,
    "employeeCount": 72355
  },
  {
    "nace": "K",
    "label": "K    Erbringung von Finanz- und Versicherungsdienstleistungen",
    "medianHourlyEUR": 24.42,
    "q25HourlyEUR": 18.27,
    "q75HourlyEUR": 31.3,
    "annualGrossEstimate": 50794,
    "employeeCount": 101633
  },
  {
    "nace": "L",
    "label": "L    Grundstücks- und Wohnungswesen",
    "medianHourlyEUR": 18.7,
    "q25HourlyEUR": 13.71,
    "q75HourlyEUR": 25.7,
    "annualGrossEstimate": 38896,
    "employeeCount": 25985
  },
  {
    "nace": "M",
    "label": "M    Erbringung von freiberufl., wissensch. u. techn. Dienstleistungen",
    "medianHourlyEUR": 21.33,
    "q25HourlyEUR": 16.17,
    "q75HourlyEUR": 28.84,
    "annualGrossEstimate": 44366,
    "employeeCount": 177597
  },
  {
    "nace": "MA",
    "label": "\"MA  Rechts- u. Steuerberat., Wirtschaftspr.",
    "medianHourlyEUR": 21.82,
    "q25HourlyEUR": 16.74,
    "q75HourlyEUR": 29.47,
    "annualGrossEstimate": 45386,
    "employeeCount": 134708
  },
  {
    "nace": "MB",
    "label": "MB  Forschung und Entwicklung",
    "medianHourlyEUR": 23.21,
    "q25HourlyEUR": 17.93,
    "q75HourlyEUR": 29.86,
    "annualGrossEstimate": 48277,
    "employeeCount": 21296
  },
  {
    "nace": "MC",
    "label": "\"MC  Werbung u. Marktforschung",
    "medianHourlyEUR": 15.9,
    "q25HourlyEUR": 12.12,
    "q75HourlyEUR": 21.6,
    "annualGrossEstimate": 33072,
    "employeeCount": 21594
  },
  {
    "nace": "N",
    "label": "N    Erbringung v. sonst. wirtschaftlichen Dienstleistungen",
    "medianHourlyEUR": 13.78,
    "q25HourlyEUR": 11.11,
    "q75HourlyEUR": 17.19,
    "annualGrossEstimate": 28662,
    "employeeCount": 227219
  },
  {
    "nace": "P",
    "label": "P    Erziehung und Unterricht",
    "medianHourlyEUR": 18.13,
    "q25HourlyEUR": 14.45,
    "q75HourlyEUR": 24.44,
    "annualGrossEstimate": 37710,
    "employeeCount": 133080
  },
  {
    "nace": "Q",
    "label": "Q   Gesundheits-, Veterinär- und Sozialwesen",
    "medianHourlyEUR": 18.08,
    "q25HourlyEUR": 14.82,
    "q75HourlyEUR": 22.28,
    "annualGrossEstimate": 37606,
    "employeeCount": 239636
  },
  {
    "nace": "QA",
    "label": "QA  Gesundheitswesen",
    "medianHourlyEUR": 19.21,
    "q25HourlyEUR": 14.59,
    "q75HourlyEUR": 24.86,
    "annualGrossEstimate": 39957,
    "employeeCount": 86657
  },
  {
    "nace": "QB",
    "label": "\"QB  Heime (ohne Erholungs- und Ferienheime)",
    "medianHourlyEUR": 17.77,
    "q25HourlyEUR": 14.91,
    "q75HourlyEUR": 21.14,
    "annualGrossEstimate": 36962,
    "employeeCount": 152978
  },
  {
    "nace": "R",
    "label": "R    Kunst, Unterhaltung und Erholung",
    "medianHourlyEUR": 14.91,
    "q25HourlyEUR": 11.55,
    "q75HourlyEUR": 20.7,
    "annualGrossEstimate": 31013,
    "employeeCount": 40190
  },
  {
    "nace": "S",
    "label": "S    Erbringung von sonstigen Dienstleistungen",
    "medianHourlyEUR": 16.7,
    "q25HourlyEUR": 12.47,
    "q75HourlyEUR": 22.84,
    "annualGrossEstimate": 34736,
    "employeeCount": 50916
  }
] as const;

/** Gross hourly earnings by ISCO-08 occupation — Statistik Austria VSE 2022 */
export const earningsByOccupation = [
  {
    "isco08": "1",
    "label": "Insgesamt",
    "medianHourlyEUR": 17.49,
    "q25HourlyEUR": 13.5,
    "q75HourlyEUR": 23.28,
    "annualGrossEstimate": 36379,
    "employeeCount": 2780578
  },
  {
    "isco08": "111",
    "label": "1 Führungskräfte",
    "medianHourlyEUR": 34.64,
    "q25HourlyEUR": 25.4,
    "q75HourlyEUR": 47.99,
    "annualGrossEstimate": 72051,
    "employeeCount": 147133
  },
  {
    "isco08": "11",
    "label": "11 Geschäftsführerinnen und Geschäftsführer, Vorstände, leitende Verwaltungsbedienstete",
    "medianHourlyEUR": 45.87,
    "q25HourlyEUR": 30.9,
    "q75HourlyEUR": 66.35,
    "annualGrossEstimate": 95410,
    "employeeCount": 31491
  },
  {
    "isco08": "12",
    "label": "12 Führungskräfte im kaufmännischen Bereich",
    "medianHourlyEUR": 35.12,
    "q25HourlyEUR": 26.35,
    "q75HourlyEUR": 46.48,
    "annualGrossEstimate": 73050,
    "employeeCount": 59078
  },
  {
    "isco08": "13",
    "label": "13 Führungskräfte in der Produktion und bei speziellen Dienstleistungen",
    "medianHourlyEUR": 33.25,
    "q25HourlyEUR": 25.73,
    "q75HourlyEUR": 42.98,
    "annualGrossEstimate": 69160,
    "employeeCount": 43426
  },
  {
    "isco08": "14",
    "label": "14 Führungskräfte in Hotels u. Restaurants, im Handel und in der Erbringung sonstiger Dienstleistungen",
    "medianHourlyEUR": 20.97,
    "q25HourlyEUR": 16.43,
    "q75HourlyEUR": 28.87,
    "annualGrossEstimate": 43618,
    "employeeCount": 13138
  },
  {
    "isco08": "2",
    "label": "2 Akademische Berufe",
    "medianHourlyEUR": 24.39,
    "q25HourlyEUR": 19.05,
    "q75HourlyEUR": 31.75,
    "annualGrossEstimate": 50731,
    "employeeCount": 376385
  },
  {
    "isco08": "21",
    "label": "21 Naturwissenschaftlerinnen und Naturwissenschaftler, Mathematikerinnen und Mathematiker, Ingenieurinnen und Ingenieure",
    "medianHourlyEUR": 26.2,
    "q25HourlyEUR": 20.51,
    "q75HourlyEUR": 32.64,
    "annualGrossEstimate": 54496,
    "employeeCount": 76141
  },
  {
    "isco08": "22",
    "label": "22 Akademische und verwandte Gesundheitsberufe",
    "medianHourlyEUR": 26.79,
    "q25HourlyEUR": 20.47,
    "q75HourlyEUR": 38.6,
    "annualGrossEstimate": 55723,
    "employeeCount": 32750
  },
  {
    "isco08": "23",
    "label": "23 Lehrkräfte",
    "medianHourlyEUR": 20,
    "q25HourlyEUR": 16.82,
    "q75HourlyEUR": 27.5,
    "annualGrossEstimate": 41600,
    "employeeCount": 77659
  },
  {
    "isco08": "24",
    "label": "24 Betriebswirtinnen und Betriebswirte und vergleichbare akademische Berufe",
    "medianHourlyEUR": 25.06,
    "q25HourlyEUR": 19.65,
    "q75HourlyEUR": 32.34,
    "annualGrossEstimate": 52125,
    "employeeCount": 76333
  },
  {
    "isco08": "25",
    "label": "25 Akademische und vergleichbare Fachkräfte in der Informations- und Kommunikationstechnologie",
    "medianHourlyEUR": 26.01,
    "q25HourlyEUR": 21.23,
    "q75HourlyEUR": 31.76,
    "annualGrossEstimate": 54101,
    "employeeCount": 73186
  },
  {
    "isco08": "26",
    "label": "26 Juristinnen und Juristen, Sozialwissenschaftlerinnen und Sozialwissenschaftler und Kulturberufe",
    "medianHourlyEUR": 22.88,
    "q25HourlyEUR": 18.76,
    "q75HourlyEUR": 29.07,
    "annualGrossEstimate": 47590,
    "employeeCount": 40315
  },
  {
    "isco08": "3",
    "label": "3 Technikerinnen und Techniker und gleichrangige nichttechnische Berufe",
    "medianHourlyEUR": 20.82,
    "q25HourlyEUR": 16.82,
    "q75HourlyEUR": 26.23,
    "annualGrossEstimate": 43306,
    "employeeCount": 578675
  },
  {
    "isco08": "31",
    "label": "31 Ingenieurtechnische und vergl. Fachkräfte",
    "medianHourlyEUR": 22.65,
    "q25HourlyEUR": 18.57,
    "q75HourlyEUR": 28.4,
    "annualGrossEstimate": 47112,
    "employeeCount": 180927
  },
  {
    "isco08": "32",
    "label": "32 Assistenzberufe im Gesundheitswesen",
    "medianHourlyEUR": 20.2,
    "q25HourlyEUR": 15.95,
    "q75HourlyEUR": 23.92,
    "annualGrossEstimate": 42016,
    "employeeCount": 61790
  },
  {
    "isco08": "33",
    "label": "33 Nicht akademische betriebswirtschaftliche und kfm. Fachkräfte und Verwaltungsfachkräfte",
    "medianHourlyEUR": 20.66,
    "q25HourlyEUR": 16.37,
    "q75HourlyEUR": 26.36,
    "annualGrossEstimate": 42973,
    "employeeCount": 229268
  },
  {
    "isco08": "34",
    "label": "34 Nicht akademische juristische, sozialpflegerische, kulturelle und verwandte Fachkräfte",
    "medianHourlyEUR": 17.74,
    "q25HourlyEUR": 15.14,
    "q75HourlyEUR": 20.8,
    "annualGrossEstimate": 36899,
    "employeeCount": 64489
  },
  {
    "isco08": "35",
    "label": "35 Informations- und Kommunikationstechnikerinnen und -techniker",
    "medianHourlyEUR": 21.58,
    "q25HourlyEUR": 17.1,
    "q75HourlyEUR": 27.82,
    "annualGrossEstimate": 44886,
    "employeeCount": 42201
  },
  {
    "isco08": "4",
    "label": "4 Bürokräfte und verwandte Berufe",
    "medianHourlyEUR": 17.21,
    "q25HourlyEUR": 13.97,
    "q75HourlyEUR": 21.51,
    "annualGrossEstimate": 35797,
    "employeeCount": 302587
  },
  {
    "isco08": "41",
    "label": "41 Allgemeine Büro- und Sekretariatskräfte",
    "medianHourlyEUR": 16.91,
    "q25HourlyEUR": 14.08,
    "q75HourlyEUR": 20.83,
    "annualGrossEstimate": 35173,
    "employeeCount": 119478
  },
  {
    "isco08": "42",
    "label": "42 Bürokräfte mit Kundenkontakt",
    "medianHourlyEUR": 17.63,
    "q25HourlyEUR": 13.54,
    "q75HourlyEUR": 23.59,
    "annualGrossEstimate": 36670,
    "employeeCount": 60155
  },
  {
    "isco08": "43",
    "label": "43 Bürokräfte im Finanz- und Rechnungswesen, in der Statistik und in der Materialwirtschaft",
    "medianHourlyEUR": 17.84,
    "q25HourlyEUR": 14.66,
    "q75HourlyEUR": 21.81,
    "annualGrossEstimate": 37107,
    "employeeCount": 102785
  },
  {
    "isco08": "44",
    "label": "44 Sonstige Bürokräfte und verwandte Berufe",
    "medianHourlyEUR": 14.19,
    "q25HourlyEUR": 12.59,
    "q75HourlyEUR": 18.8,
    "annualGrossEstimate": 29515,
    "employeeCount": 20169
  },
  {
    "isco08": "5",
    "label": "5 Dienstleistungsberufe, Verkäuferinnen und Verkäufer",
    "medianHourlyEUR": 13.16,
    "q25HourlyEUR": 11.16,
    "q75HourlyEUR": 16.08,
    "annualGrossEstimate": 27373,
    "employeeCount": 460477
  },
  {
    "isco08": "51",
    "label": "51 Berufe im Bereich personenbezogener Dienstleistungen",
    "medianHourlyEUR": 12,
    "q25HourlyEUR": 10.47,
    "q75HourlyEUR": 14.67,
    "annualGrossEstimate": 24960,
    "employeeCount": 116597
  },
  {
    "isco08": "52",
    "label": "52 Verkaufskräfte",
    "medianHourlyEUR": 13.19,
    "q25HourlyEUR": 11.3,
    "q75HourlyEUR": 15.96,
    "annualGrossEstimate": 27435,
    "employeeCount": 253296
  },
  {
    "isco08": "53",
    "label": "53 Betreuungsberufe",
    "medianHourlyEUR": 15.15,
    "q25HourlyEUR": 12.84,
    "q75HourlyEUR": 17.65,
    "annualGrossEstimate": 31512,
    "employeeCount": 70600
  },
  {
    "isco08": "54",
    "label": "54 Schutzkräfte und Sicherheitsbedienstete",
    "medianHourlyEUR": 11.83,
    "q25HourlyEUR": 10.81,
    "q75HourlyEUR": 14.55,
    "annualGrossEstimate": 24606,
    "employeeCount": 19984
  },
  {
    "isco08": "7",
    "label": "7 Handwerks- und verwandte Berufe",
    "medianHourlyEUR": 17.93,
    "q25HourlyEUR": 15.64,
    "q75HourlyEUR": 20.96,
    "annualGrossEstimate": 37294,
    "employeeCount": 340722
  },
  {
    "isco08": "71",
    "label": "71 Bau- und Ausbaufachkräfte sowie verwandte Berufe",
    "medianHourlyEUR": 17.55,
    "q25HourlyEUR": 15.67,
    "q75HourlyEUR": 19.85,
    "annualGrossEstimate": 36504,
    "employeeCount": 121051
  },
  {
    "isco08": "72",
    "label": "72 Metallarbeiterinnen und Metallarbeiter, Mechanikerinnen und Mechaniker und verwandte Berufe",
    "medianHourlyEUR": 18.63,
    "q25HourlyEUR": 16.17,
    "q75HourlyEUR": 22.02,
    "annualGrossEstimate": 38750,
    "employeeCount": 106656
  },
  {
    "isco08": "73",
    "label": "73Präzisionshandwerkerinnen und Präzisionshandwerker, Druckerinnen und Drucker und kunsthandwerkliche Berufe",
    "medianHourlyEUR": 18.83,
    "q25HourlyEUR": 15.16,
    "q75HourlyEUR": 22.55,
    "annualGrossEstimate": 39166,
    "employeeCount": 8497
  },
  {
    "isco08": "74",
    "label": "74 Elektrikerinnen und Elektriker und Elektronikerinnen und Elektroniker",
    "medianHourlyEUR": 18.74,
    "q25HourlyEUR": 16.3,
    "q75HourlyEUR": 22.43,
    "annualGrossEstimate": 38979,
    "employeeCount": 63774
  },
  {
    "isco08": "75",
    "label": "75 Berufe in der Nahrungsmittelverarbeitung, Holzverarbeitung, Bekleidungsherstellung und verwandte handwerkliche Fachkräfte",
    "medianHourlyEUR": 15.91,
    "q25HourlyEUR": 13.57,
    "q75HourlyEUR": 19.28,
    "annualGrossEstimate": 33093,
    "employeeCount": 40744
  },
  {
    "isco08": "8",
    "label": "8 Bedienerinnen und Bediener von Anlagen und Maschinen und Montageberufe",
    "medianHourlyEUR": 15.94,
    "q25HourlyEUR": 13.2,
    "q75HourlyEUR": 19.2,
    "annualGrossEstimate": 33155,
    "employeeCount": 241724
  },
  {
    "isco08": "81",
    "label": "81 Bedienerinnen und Bediener stationärer Anlagen und Maschinen",
    "medianHourlyEUR": 17.18,
    "q25HourlyEUR": 13.86,
    "q75HourlyEUR": 21.15,
    "annualGrossEstimate": 35734,
    "employeeCount": 69485
  },
  {
    "isco08": "82",
    "label": "82 Montageberufe",
    "medianHourlyEUR": 16.49,
    "q25HourlyEUR": 14.66,
    "q75HourlyEUR": 19.14,
    "annualGrossEstimate": 34299,
    "employeeCount": 47662
  },
  {
    "isco08": "83",
    "label": "83 Fahrzeugführerinnen und Fahrzeugführer und Bedienerinnen und Bediener mobiler Anlagen",
    "medianHourlyEUR": 15.08,
    "q25HourlyEUR": 12.33,
    "q75HourlyEUR": 18.14,
    "annualGrossEstimate": 31366,
    "employeeCount": 124576
  },
  {
    "isco08": "9",
    "label": "9 Hilfsarbeitskräfte",
    "medianHourlyEUR": 12.3,
    "q25HourlyEUR": 10.42,
    "q75HourlyEUR": 14.6,
    "annualGrossEstimate": 25584,
    "employeeCount": 332875
  },
  {
    "isco08": "91",
    "label": "91 Reinigungspersonal und Hilfskräfte",
    "medianHourlyEUR": 10.8,
    "q25HourlyEUR": 9.92,
    "q75HourlyEUR": 12.48,
    "annualGrossEstimate": 22464,
    "employeeCount": 114078
  },
  {
    "isco08": "92",
    "label": "92 Hilfsarbeiterinnen und Hilfsarbeiter in der Land- und Forstwirtschaft und Fischerei",
    "medianHourlyEUR": 12.67,
    "q25HourlyEUR": 11,
    "q75HourlyEUR": 14.55,
    "annualGrossEstimate": 26354,
    "employeeCount": 12307
  },
  {
    "isco08": "93",
    "label": "93 Hilfsarbeiterinnen und Hilfsarbeiter im Bergbau, im Bau, bei der Herstellung von Waren und im Transportwesen",
    "medianHourlyEUR": 14.02,
    "q25HourlyEUR": 12.34,
    "q75HourlyEUR": 16.23,
    "annualGrossEstimate": 29162,
    "employeeCount": 146556
  },
  {
    "isco08": "94",
    "label": "94 Hilfskräfte in der Nahrungsmittelzubereitung",
    "medianHourlyEUR": 10.19,
    "q25HourlyEUR": 9.55,
    "q75HourlyEUR": 11.47,
    "annualGrossEstimate": 21195,
    "employeeCount": 34659
  },
  {
    "isco08": "96",
    "label": "96 Abfallentsorgungsarbeiterinnen und Abfallentsorgungsarbeiter und sonstige Hilfsarbeitskräfte",
    "medianHourlyEUR": 12.03,
    "q25HourlyEUR": 10.57,
    "q75HourlyEUR": 13.92,
    "annualGrossEstimate": 25022,
    "employeeCount": 25276
  }
] as const;

/** National-accounts employment total (nama_10_a64_e) — differs from LFS; used for NACE weights */
export const TOTAL_EMPLOYMENT_NATIONAL_ACCOUNTS_2024 = 4731970;

/** @deprecated Use TOTAL_EMPLOYMENT_LFS — kept for scripts comparing to older runs */
export const TOTAL_EMPLOYMENT_2024 = 4488700;

/** Data fetch timestamp */
export const DATA_FETCHED_AT = "2026-03-28T19:10:37.947Z";

/** Data source URLs for citation */
export const DATA_SOURCES = {
  eurostatLFSEmployment: {
    name: "Eurostat — Employed persons by occupation ISCO-08 2-digit (lfsa_egai2d); AT = Mikrozensus AKE",
    url: "https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d",
    year: 2024,
    license: "Eurostat copyright policy (free reuse with source citation)",
  },
  statistikAustriaMikrozensusAggregate: {
    name: "Statistik Austria — Mikrozensus-Arbeitskräfteerhebung Jahresdaten (OGD aggregate series)",
    url: "https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_ake001j_AKEJ_1",
    year: 2024,
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
