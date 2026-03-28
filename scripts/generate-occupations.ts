#!/usr/bin/env npx tsx
/**
 * Generate occupation data from REAL sources.
 *
 * Cross-references:
 * - Eurostat lfsa_egai2d — employed persons by ISCO-08 2-digit (EU-LFS; AT = Mikrozensus AKE) → job counts
 * - Eurostat nama_10_a64_e — NACE sector employment → weights only (split each ISCO across ÖNACE rows)
 * - Statistik Austria VSE earnings by NACE (2022) → sector pay fallback
 * - Statistik Austria VSE earnings by ISCO-08 (2022) → occupation pay
 *
 * The approach:
 * 1. ISCO-level employment totals from LFS (Mikrozensus AKE / Eurostat lfsa_egai2d)
 * 2. Within each ISCO, split totals across occupation rows using NACE×share weights (nama_10_a64_e)
 * 3. REAL median hourly pay from VSE, converted to annual gross
 * 4. AI exposure (0–10) + outlook (–10…+10): curated in OCCUPATION_DEFS (see below)
 * 5. Regeneration: this script rewrites src/lib/data.ts; exposure/outlook come from defs, not from an API call here
 *
 * AI exposure & outlook — exact pipeline (no live LLM in this repo):
 * - Each row in OCCUPATION_DEFS sets integer exposure (0–10), exposureRationale (EN),
 *   outlook (–10…+10), outlookDesc (short tier label, EN).
 * - Rubric follows Karpathy’s *concept*: higher exposure = more cognitive / digital /
 *   generative-AI-relevant task content for that aggregated occupation; not Felten-style
 *   empirical AI deployment, not BLS numeric growth.
 * - Outlook is a qualitative demand signal per occupation group (sector-informed), not a model forecast.
 * - To change scores: edit OCCUPATION_DEFS, then run: npx tsx scripts/generate-occupations.ts
 * - Optional LLM exposure: run npx tsx scripts/score-exposure-llm.ts (OpenRouter) to write
 *   scripts/llm-exposure-overrides.json; generate merges those over OCCUPATION_DEFS for exposure only.
 *
 * This produces an honest dataset where:
 * ✅ Employment per ISCO-08 2-digit group = Eurostat LFS (national: Mikrozensus AKE)
 * ✅ Splits across ÖNACE-labelled rows within the same ISCO = NACE national-accounts weights
 * ✅ Pay figures = Statistik Austria VSE 2022 (real medians)
 * ⚠️ AI exposure / outlook = curated in OCCUPATION_DEFS, optionally overridden by llm-exposure-overrides.json
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  employmentByNACE,
  employmentByISCO2,
  earningsByNACE,
  earningsByOccupation,
  TOTAL_EMPLOYMENT_LFS,
  LFS_EMPLOYMENT_YEAR,
  DATA_FETCHED_AT,
} from "../src/lib/real-data";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Optional OpenRouter LLM output from scripts/score-exposure-llm.ts (exposure + rationale only). */
function loadLlmExposureOverrides(): Record<
  string,
  { exposure: number; exposureRationale: string }
> {
  const p = join(__dirname, "llm-exposure-overrides.json");
  if (!existsSync(p)) return {};
  try {
    const raw = JSON.parse(readFileSync(p, "utf-8")) as Record<string, unknown>;
    const out: Record<string, { exposure: number; exposureRationale: string }> =
      {};
    for (const [k, v] of Object.entries(raw)) {
      if (k.startsWith("_")) continue;
      if (
        v &&
        typeof v === "object" &&
        "exposure" in v &&
        "exposureRationale" in v
      ) {
        const e = v as { exposure: unknown; exposureRationale: unknown };
        out[k] = {
          exposure: Math.round(Number(e.exposure)),
          exposureRationale: String(e.exposureRationale),
        };
      }
    }
    return out;
  } catch {
    return {};
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────

function getEmployment(nace: string): number {
  const entry = employmentByNACE.find((e) => e.nace === nace);
  return entry ? entry.employmentPersons : 0;
}

/** LFS employed persons for ISCO-08 2-digit (thousands → persons in real-data). */
function getLfsEmploymentByIsco(isco: string): number {
  const entry = employmentByISCO2.find((e) => e.isco08 === isco);
  return entry ? entry.employmentPersons : 0;
}

function getSectorEarnings(nace: string) {
  const entry = earningsByNACE.find((e) => e.nace === nace);
  return entry
    ? {
        medianHourly: entry.medianHourlyEUR,
        annualEstimate: entry.annualGrossEstimate,
        employeeCount: entry.employeeCount,
      }
    : null;
}

function getOccupationEarnings(isco: string) {
  const entry = earningsByOccupation.find((e) => e.isco08 === isco);
  return entry
    ? {
        medianHourly: entry.medianHourlyEUR,
        annualEstimate: entry.annualGrossEstimate,
        employeeCount: entry.employeeCount,
      }
    : null;
}

// Annual estimate: median hourly × 2080h + ~17% for 13th/14th salary
function annualWithBonus(medianHourly: number): number {
  return Math.round(medianHourly * 2080 * 1.17);
}

// ─── Exposure rationale texts (keyed by slug) ──────────────────────────
// Sachlich, exakt, mit Fachbegriffen. Struktur: Tätigkeitsprofil → KI-relevante Faktoren → Bewertung.

const EXPOSURE_RATIONALE_EN: Record<string, string> = {
  "agricultural-workers": "Primary tasks: soil cultivation, sowing, harvesting, livestock management. Approximately 80% manual field work. Precision agriculture (GPS-guided machinery, drone-based crop monitoring, sensor-based irrigation) automates data collection, but physical execution remains non-substitutable.",
  "forestry-workers": "Tasks consist of felling, skidding, and silvicultural maintenance in uneven terrain. Digital tools are limited to GPS marking and inventory systems. No significant automation potential for core field operations.",
  "veterinarians-agri": "Clinical diagnostics, surgical procedures, and animal welfare assessments require physical examination. AI-based image analysis (radiology, dermatology) supports diagnostics; documentation and laboratory data management are partially automatable.",
  "forestry-fishery-hunting": "Core activities: timber harvesting, commercial fishing, game management. Work in remote, unstructured environments with minimal digital infrastructure. AI application limited to population modelling and GPS-based tracking.",
  "agricultural-labourers": "Manual seasonal tasks: hand harvesting, planting, sorting, animal feeding. Nearly zero digital task share. Robotics in harvesting (e.g. soft fruit) is in early development; economic viability for Austrian farm structures is low.",
  "mining-technicians": "Subsurface extraction, drilling, and blasting require physical presence. AI applications: predictive maintenance of equipment, safety monitoring via sensor networks, logistics optimisation for transport routes.",
  "food-production": "Production line operation, sensory quality control (taste, odour, texture), and hygiene compliance are predominantly manual. AI-supported tasks: optical quality inspection, predictive maintenance, demand forecasting for production planning.",
  "textile-workers": "Manufacturing involves cutting, sewing, pressing, and finishing — tasks requiring manual dexterity. AI assists in pattern generation and demand prediction, but garment assembly at Austrian production scales is not economically automatable.",
  "wood-paper": "Sawmill operation, joinery, and surface treatment are predominantly physical. CNC machining introduces digital process control. AI potential: optimisation of cutting plans, wood defect detection via image recognition.",
  "chemical-production": "Process monitoring via SCADA systems comprises approximately 40% of work. Physical tasks: sampling, equipment maintenance, material handling. AI applications: predictive process control, anomaly detection in sensor data, yield optimisation.",
  "pharma-production": "Cleanroom manufacturing, batch documentation (GMP-compliant), and quality assurance involve both physical and digital tasks. AI is transforming drug discovery (molecular modelling, clinical trial analysis) and regulatory documentation.",
  "metal-workers": "CNC machining, welding, and precision assembly are manually executed with digital machine interfaces. AI potential: toolpath optimisation, quality inspection via machine vision, predictive tool wear monitoring.",
  "fabricated-metal": "Stamping, bending, surface treatment, and assembly are physically executed. Increasing CNC integration adds digital control interfaces. AI applications: automated visual inspection, production scheduling optimisation.",
  "electronics-mfg": "Combines cleanroom assembly with digital design verification and automated testing. AI accelerates electronic design automation (chip layout, signal integrity analysis) and enables automated optical inspection.",
  "electrical-mfg": "Physical tasks: wiring, soldering, component assembly. Digital tasks: circuit simulation, diagnostic testing. AI supports schematic generation, fault pattern recognition, and test automation.",
  "machinery-mfg": "Engineering design (CAD/CAE), production planning, and physical assembly/testing. Approximately 40% digital task share. AI applications: generative design, simulation-based optimisation, digital twin integration for predictive maintenance.",
  "vehicle-production": "Assembly line work with increasing industrial robotics penetration. Approximately 40% of tasks involve digital process monitoring, quality control, and logistics coordination. Electrification alters required skill profiles.",
  "other-transport-equip": "Specialised assembly of rail vehicles, aircraft components, and marine equipment. Mix of precision manual work and engineering documentation. AI potential in design optimisation and non-destructive testing analysis.",
  "paper-printing": "Papermaking involves physical process operation (pulping, pressing, drying). Print production increasingly digital (prepress, colour management). AI applications: defect detection, print quality optimisation.",
  "printing-media": "Prepress workflows are fully digital (layout, colour separation, proofing). Physical printing declining due to digital media substitution. AI automates typesetting, image processing, and personalised print-on-demand production.",
  "petroleum": "Continuous process operation in refineries with SCADA/DCS control systems. Physical tasks: equipment inspection, maintenance, safety rounds. AI optimises process parameters, yield prediction, and anomaly detection in real-time sensor data.",
  "rubber-plastic": "Injection moulding, extrusion, and blow moulding are machine-operated with manual setup. Digital share limited to machine parameter settings and quality monitoring. AI potential: process parameter optimisation, inline defect detection.",
  "mineral-products": "Energy-intensive industrial processes (kiln operation, grinding, moulding) for glass, ceramics, and cement. Primarily physical with digital process control. AI applications limited to energy optimisation and quality prediction.",
  "furniture-other-mfg": "Combines woodworking, upholstery, and finishing — tasks requiring manual craftsmanship. CNC machining for serial production adds digital interfaces. AI potential: design parametrisation, cutting optimisation, demand-driven production planning.",
  "machinery-repair": "Fault diagnosis, disassembly, part replacement, and commissioning are physically executed. Digital diagnostic tools (vibration analysis, thermal imaging) support troubleshooting. AI enables predictive maintenance and spare parts forecasting.",
  "mfg-admin-purchasing": "Inventory management, order processing, goods receipt documentation, and supplier correspondence are structured ERP-based workflows. Approximately 80% digital task share. AI and robotic process automation handle purchase order matching, stock-level forecasting, and invoice reconciliation.",
  "energy-technicians": "Grid operation, transformer maintenance, and cable work are physically executed. Digital tasks: SCADA monitoring, load management, smart grid integration. AI optimises grid balancing, fault prediction, and renewable energy dispatch.",
  "water-waste": "Collection, transport, sorting, and treatment of waste and water are predominantly physical outdoor tasks. AI applications: route optimisation for collection vehicles, automated waste sorting via image recognition, process control in treatment plants.",
  "construction-workers": "Earthwork, concrete placement, scaffolding, and material transport are entirely manual and site-bound. Digital task share below 5%. Robotic construction (bricklaying, 3D printing) exists in pilot projects but has no significant market penetration.",
  "building-trades": "Electrical installation, plumbing, HVAC assembly, and tiling are manually executed on-site. Digital diagnostic tools (thermal cameras, leak detectors) supplement the work. AI potential in building energy management and fault diagnosis.",
  "civil-engineers": "Design work primarily digital: Building Information Modelling (BIM), finite element analysis, structural simulation. AI generates design variants, optimises structural load paths, and automates compliance checking against building codes.",
  "painters-finishers": "Surface preparation, painting, plastering, and floor laying are entirely manual on-site tasks. No meaningful digital task component. AI application potential is negligible for the foreseeable future.",
  "customer-services-clerks": "Tasks: telephone/email support, appointment scheduling, complaint handling, data entry. Over 70% are structured digital communication tasks. Conversational AI and automated ticketing systems substitute a growing share of these interactions.",
  "vehicle-trade": "Vehicle diagnostics via OBD-II/EOBD systems involve digital interfaces, but repair, bodywork, and parts replacement are manual. AI applications: automated fault code interpretation, parts catalogue matching, warranty claim processing.",
  "wholesale": "Order processing, inventory management, and customer relationship management are digital (Enterprise Resource Planning, Customer Relationship Management systems). Physical warehouse operations account for approximately 40%. AI automates demand forecasting, pricing, and procurement.",
  "retail-sales": "In-store tasks: customer consultation, merchandise display, checkout. Online retail substitutes approximately 15% of traditional retail volume (Statistik Austria 2023). AI-driven product recommendations, self-checkout systems, and automated inventory reduce demand for sales personnel.",
  "land-transport": "Driving, loading, and route execution are physically and spatially bound. Digital components: telematics, fleet management systems, electronic freight documents. Autonomous driving technology is progressing (SAE Level 4) but regulatory approval and infrastructure readiness limit near-term deployment.",
  "warehousing": "Order picking, packing, and goods receipt are physically executed. Warehouse management systems (WMS) coordinate digital workflows. Automated storage and retrieval systems and autonomous mobile robots increasingly handle structured, repetitive tasks.",
  "postal-courier": "Last-mile delivery, parcel sorting, and customer handover are physically executed. AI-based route optimisation and automated sorting centres increase efficiency, but final delivery to individual addresses remains a manual task.",
  "hospitality-retail-managers": "Operational management tasks span physical site supervision and digital systems: revenue management, dynamic pricing, online booking platforms, and data analytics. Approximately 40% of management tasks are digitally supported.",
  "hotel-workers": "Room preparation, guest services, and front desk operations are physically executed. Property management systems, online check-in, and AI-based chatbots handle reservations and enquiries. Personal guest interaction remains central to service quality.",
  "restaurant-workers": "Table service, order taking, and guest interaction are physically and socially bound. Self-ordering kiosks and digital point-of-sale systems automate transaction processing, but personal service differentiates quality dining from fast food.",
  "chefs-cooks": "Food preparation, cooking, plating, and kitchen management require manual dexterity and sensory judgement. Digital task share limited to inventory management and recipe documentation. Culinary execution is not automatable with current technology.",
  "publishing-media": "Content creation, editing, layout, and digital publishing are fully digital workflows. Large language models generate draft text, automated layout tools compose pages. Human editorial judgement remains necessary for quality assurance and investigative reporting.",
  "film-tv-broadcasting": "Post-production (editing, colour grading, sound design) is fully digital. AI tools generate video sequences, synthetic voices, and automated subtitling. Physical production (camera operation, set construction, live broadcasting) retains manual requirements.",
  "telecom-tech": "Physical tasks: cable laying, antenna installation, equipment maintenance at cell sites. Digital tasks: network configuration, signal optimisation, fault monitoring via network management systems. Approximately 40% digital task share.",
  "software-it": "Software development, system administration, and data engineering are entirely digital tasks. AI code generation tools (code completion, automated testing, code review) augment approximately 30–50% of development workflows. Demand for software engineering is forecast to grow despite productivity gains.",
  "financial-services": "Transaction processing, credit scoring, regulatory reporting, and fraud detection are digital processes. AI automates risk modelling, anti-money-laundering checks, and customer onboarding. Physical branch operations constitute a declining share of banking activity.",
  "insurance-workers": "Underwriting, claims assessment, actuarial analysis, and policy administration are predominantly digital. AI automates damage estimation (image-based), fraud detection, and risk pricing. Customer interaction shifts to digital channels.",
  "real-estate": "Property valuation, market analysis, and marketing are digitally supported. Physical property viewings and contract negotiations require personal presence. AI automates comparative market analysis, property matching algorithms, and virtual tour generation.",
  "admin-commercial-managers": "Strategic planning, financial controlling, human resources management, and marketing direction involve approximately 60% digital tasks (reporting, analytics, workforce planning). AI-based tools automate data analysis, forecasting, and scenario modelling.",
  "production-services-managers": "Operational oversight of manufacturing, construction, or IT service operations. Digital tasks: production planning, supply chain management, scheduling. Physical tasks: site supervision, quality audits. Approximately 50% digital task share.",
  "legal-accounting-consulting": "Contract drafting, legal research, financial auditing, and consulting deliverables are text-intensive digital tasks. AI-based tools automate document review, due diligence, regulatory compliance checks, and financial statement analysis.",
  "architects-engineering": "Design work is predominantly digital: Building Information Modelling, computer-aided engineering, parametric design. AI generates design alternatives and optimises structural, thermal, and energy performance. Physical site visits and client consultation remain necessary.",
  "research-scientists": "Literature analysis, data processing, statistical modelling, and manuscript preparation are digital tasks (approximately 60%). Laboratory work, field research, and experimental setup are physical. AI accelerates systematic reviews, data analysis, and hypothesis generation.",
  "advertising-marketing": "Campaign planning, content creation, performance analytics, and media buying are fully digital workflows. AI generates marketing copy, automates A/B testing, optimises bidding strategies, and produces personalised content at scale.",
  "bookkeepers-stock-clerks": "Double-entry bookkeeping, payroll processing, inventory tracking, and accounts reconciliation are structured, rule-based digital tasks. AI and robotic process automation handle end-to-end processing of invoices, bank reconciliations, and payroll calculations.",
  "other-clerical-support": "Mail processing, data coding, document filing, and record keeping are structured, repetitive digital tasks. AI-based document processing (optical character recognition, natural language processing) automates classification, extraction, and routing.",
  "temp-workers": "Staffing coordination, contract administration, and timesheet processing are digital. Temporary assignments themselves span physical sectors (manufacturing, logistics, construction). AI automates candidate matching and administrative workflows.",
  "office-admin-support": "Calendar management, correspondence, travel booking, data entry, and meeting coordination are predominantly digital tasks. AI-based tools automate scheduling, email drafting, document formatting, and data processing.",
  "cleaning-security": "Cleaning, security patrols, and facility maintenance are physically executed across diverse environments. Digital task share below 10% (access control systems, shift scheduling). Robotics for commercial cleaning exists but covers only standardised floor areas.",
  "public-admin": "Case processing, permit administration, compliance verification, and citizen correspondence are structured digital workflows. Austria's E-Government strategy (Digitales Amt) accelerates process automation. AI potential in document classification, case routing, and decision support.",
  "protective-services": "Patrol duty, emergency response, criminal investigation, and fire suppression are physically and situationally bound. AI applications: video surveillance analysis, dispatch optimisation, predictive policing models. Approximately 80% of tasks require physical presence.",
  "teachers": "Lesson preparation, curriculum development, and assessment are digitally supported (approximately 40%). Classroom instruction, student mentoring, and social-emotional support require physical presence and interpersonal skills not substitutable by AI.",
  "education-support": "Administrative tasks (scheduling, record keeping, communication) are digital. Pedagogical assistance, child supervision, and special needs support require physical presence. Approximately 30% digital task share.",
  "doctors": "Diagnostics is increasingly AI-supported (medical imaging analysis, differential diagnosis, laboratory interpretation). Physical examination, surgical procedures, and patient communication require manual execution and clinical judgement. Approximately 40% digital task share.",
  "nurses-health": "Direct patient care (vital signs monitoring, medication administration, wound care, patient mobilisation) is physically executed. AI supports clinical documentation, medication interaction checks, and care planning. Approximately 20% digital task share.",
  "health-other": "Physiotherapy, laboratory analysis, pharmacy dispensing, and medical device operation combine physical patient contact with technical procedures. AI potential in laboratory image analysis and rehabilitation exercise monitoring.",
  "social-care": "Personal care, mobility assistance, social activation, and crisis intervention require physical presence and empathic interaction. Digital tasks limited to care documentation and resource coordination. Approximately 15% digital task share.",
  "health-care-admin": "Patient registration, appointment scheduling, medical records management, billing, and correspondence are structured digital workflows. Approximately 85% digital task share. AI automates medical coding (ICD/DRG), appointment optimisation, and document classification.",
  "care-facility-support": "Hospital and care home cleaning, kitchen assistance, laundry, portering, and waste disposal are entirely physical tasks. Digital task share below 5% (shift scheduling systems). Robotic floor cleaning is deployed in some facilities but covers only standardised corridor areas.",
  "social-community-workers": "Case assessment, individual and group counselling, crisis intervention, and community outreach are interpersonal tasks requiring empathic judgement. Approximately 35% digital task share (case documentation, reporting, resource databases). AI assists with risk scoring, needs assessment questionnaires, and service matching.",
  "arts-recreation": "Live performance, artistic direction, and cultural programming require personal creative execution. AI tools generate visual art, music, and text — augmenting digital content production. Physical presence in performance, sport instruction, and event management is non-substitutable.",
  "associations": "Member communication, event management, and advocacy require personal relationship management. Administrative tasks (accounting, correspondence, database management) are digital. Approximately 50% digital task share.",
  "personal-services": "Hairdressing, cosmetic treatments, and repair services require manual dexterity and direct client interaction. Digital task share limited to appointment scheduling and point-of-sale processing. No significant AI substitution potential for core service delivery.",
};

const EXPOSURE_RATIONALE_DE: Record<string, string> = {
  "agricultural-workers": "Kerntätigkeiten: Bodenbearbeitung, Aussaat, Ernte, Tierhaltung. Ca. 80 % manuelle Feldarbeit. Präzisionslandwirtschaft (GPS-gesteuerte Maschinen, drohnenbasiertes Pflanzenmonitoring, sensorgestützte Bewässerung) automatisiert die Datenerfassung, die physische Durchführung bleibt jedoch nicht substituierbar.",
  "forestry-workers": "Tätigkeiten umfassen Holzfällung, Rückung und Waldpflege in unebenem Gelände. Digitale Werkzeuge beschränken sich auf GPS-Markierung und Bestandserfassungssysteme. Kein wesentliches Automatisierungspotenzial für die Kerntätigkeiten im Feld.",
  "veterinarians-agri": "Klinische Diagnostik, chirurgische Eingriffe und Tierschutzbeurteilungen erfordern körperliche Untersuchung. KI-gestützte Bildanalyse (Radiologie, Dermatologie) unterstützt die Diagnostik; Dokumentation und Labordatenmanagement sind teilweise automatisierbar.",
  "forestry-fishery-hunting": "Kerntätigkeiten: Holzernte, gewerbliche Fischerei, Wildtiermanagement. Arbeit in abgelegenen, unstrukturierten Umgebungen mit minimaler digitaler Infrastruktur. KI-Anwendung beschränkt sich auf Populationsmodellierung und GPS-gestütztes Tracking.",
  "agricultural-labourers": "Manuelle saisonale Tätigkeiten: Handernte, Pflanzung, Sortierung, Tierfütterung. Digitaler Aufgabenanteil nahezu null. Ernteroboter (z. B. für Beerenobst) befinden sich in früher Entwicklung; die Wirtschaftlichkeit für österreichische Betriebsstrukturen ist gering.",
  "mining-technicians": "Untertagegewinnung, Bohrung und Sprengung erfordern physische Präsenz. KI-Anwendungen: vorausschauende Wartung von Ausrüstung, Sicherheitsüberwachung über Sensornetzwerke, Logistikoptimierung für Transportwege.",
  "food-production": "Produktionslinienbetrieb, sensorische Qualitätskontrolle (Geschmack, Geruch, Textur) und Hygienekonformität sind überwiegend manuell. KI-unterstützte Aufgaben: optische Qualitätsprüfung, vorausschauende Wartung, Bedarfsprognosen für die Produktionsplanung.",
  "textile-workers": "Fertigung umfasst Zuschnitt, Nähen, Pressen und Endbearbeitung — Tätigkeiten, die Fingerfertigkeit erfordern. KI unterstützt bei Schnittgenerierung und Nachfrageprognose, die Konfektionierung bei österreichischen Produktionsmaßstäben ist wirtschaftlich nicht automatisierbar.",
  "wood-paper": "Sägewerks-, Tischlerei- und Oberflächenbehandlung sind überwiegend physisch. CNC-Bearbeitung führt digitale Prozesssteuerung ein. KI-Potenzial: Optimierung von Schnittplänen, Holzfehler-Erkennung mittels Bildverarbeitung.",
  "chemical-production": "Prozessüberwachung über SCADA-Systeme umfasst ca. 40 % der Arbeit. Physische Aufgaben: Probenahme, Anlagenwartung, Materialhandling. KI-Anwendungen: prädiktive Prozesssteuerung, Anomalieerkennung in Sensordaten, Ausbeuteoptimierung.",
  "pharma-production": "Reinraumfertigung, Chargen-Dokumentation (GMP-konform) und Qualitätssicherung umfassen sowohl physische als auch digitale Aufgaben. KI transformiert die Wirkstoffentwicklung (Molekülmodellierung, Analyse klinischer Studien) und die regulatorische Dokumentation.",
  "metal-workers": "CNC-Bearbeitung, Schweißen und Präzisionsmontage werden manuell mit digitalen Maschinenschnittstellen ausgeführt. KI-Potenzial: Werkzeugwegoptimierung, Qualitätsprüfung mittels maschinellem Sehen, prädiktive Werkzeugverschleißüberwachung.",
  "fabricated-metal": "Stanzen, Biegen, Oberflächenbehandlung und Montage werden physisch ausgeführt. Zunehmende CNC-Integration erweitert digitale Steuerungsschnittstellen. KI-Anwendungen: automatisierte Sichtprüfung, Produktionsablaufoptimierung.",
  "electronics-mfg": "Verbindet Reinraummontage mit digitaler Designverifikation und automatisiertem Testen. KI beschleunigt elektronische Designautomatisierung (Chiplayout, Signalintegritätsanalyse) und ermöglicht automatisierte optische Inspektion.",
  "electrical-mfg": "Physische Aufgaben: Verdrahtung, Löten, Komponentenmontage. Digitale Aufgaben: Schaltungssimulation, Diagnoseprüfung. KI unterstützt bei Schaltplangenerierung, Fehlermustererkennung und Testautomatisierung.",
  "machinery-mfg": "Konstruktion (CAD/CAE), Fertigungsplanung und physische Montage/Prüfung. Ca. 40 % digitaler Aufgabenanteil. KI-Anwendungen: generatives Design, simulationsbasierte Optimierung, Digital-Twin-Integration für vorausschauende Wartung.",
  "vehicle-production": "Montagearbeit mit zunehmender Industrierobotik-Durchdringung. Ca. 40 % der Aufgaben umfassen digitale Prozessüberwachung, Qualitätskontrolle und Logistikkoordination. Die Elektrifizierung verändert die erforderlichen Qualifikationsprofile.",
  "other-transport-equip": "Spezialmontage von Schienenfahrzeugen, Flugzeugkomponenten und Schiffsausrüstung. Verbindung von Präzisionshandarbeit und technischer Dokumentation. KI-Potenzial in Designoptimierung und Analyse zerstörungsfreier Prüfung.",
  "paper-printing": "Papierherstellung umfasst physischen Prozessbetrieb (Aufschluss, Pressung, Trocknung). Druckproduktion zunehmend digital (Druckvorstufe, Farbmanagement). KI-Anwendungen: Fehlererkennung, Druckqualitätsoptimierung.",
  "printing-media": "Druckvorstufe ist vollständig digital (Layout, Farbseparation, Proofing). Physischer Druck rückläufig durch Substitution durch digitale Medien. KI automatisiert Satz, Bildverarbeitung und personalisierte Print-on-Demand-Produktion.",
  "petroleum": "Kontinuierlicher Prozessbetrieb in Raffinerien mit SCADA/DCS-Leitsystemen. Physische Aufgaben: Anlageninspektion, Wartung, Sicherheitsrundgänge. KI optimiert Prozessparameter, Ausbeuteprognosen und Anomalieerkennung in Echtzeit-Sensordaten.",
  "rubber-plastic": "Spritzguss, Extrusion und Blasformen sind maschinengeführt mit manuellem Rüsten. Digitaler Anteil beschränkt sich auf Maschinenparameter-Einstellungen und Qualitätsüberwachung. KI-Potenzial: Prozessparameteroptimierung, Inline-Fehlererkennung.",
  "mineral-products": "Energieintensive industrielle Prozesse (Ofenbetrieb, Mahlung, Formgebung) für Glas, Keramik und Zement. Überwiegend physisch mit digitaler Prozesssteuerung. KI-Anwendungen beschränkt auf Energieoptimierung und Qualitätsprognose.",
  "furniture-other-mfg": "Verbindet Holzbearbeitung, Polsterung und Endbearbeitung — Tätigkeiten, die handwerkliches Können erfordern. CNC-Bearbeitung für Serienfertigung ergänzt digitale Schnittstellen. KI-Potenzial: Designparametrisierung, Schnittoptimierung, bedarfsgesteuerte Produktionsplanung.",
  "machinery-repair": "Fehlerdiagnose, Demontage, Teileersatz und Inbetriebnahme werden physisch ausgeführt. Digitale Diagnosewerkzeuge (Schwingungsanalyse, Thermografie) unterstützen die Fehlersuche. KI ermöglicht vorausschauende Wartung und Ersatzteilprognosen.",
  "mfg-admin-purchasing": "Bestandsführung, Bestellabwicklung, Wareneingangsdokumentation und Lieferantenkorrespondenz sind strukturierte ERP-basierte Arbeitsabläufe. Ca. 80 % digitaler Aufgabenanteil. KI und Robotic Process Automation übernehmen Bestellabgleich, Bestandsprognosen und Rechnungsabstimmung.",
  "energy-technicians": "Netzbetrieb, Trafowartung und Kabelarbeiten werden physisch ausgeführt. Digitale Aufgaben: SCADA-Monitoring, Lastmanagement, Smart-Grid-Integration. KI optimiert Netzausgleich, Störungsprognosen und Einspeisemanagement erneuerbarer Energie.",
  "water-waste": "Sammlung, Transport, Sortierung und Aufbereitung von Abfall und Wasser sind überwiegend physische Außentätigkeiten. KI-Anwendungen: Routenoptimierung für Sammelfahrzeuge, automatisierte Abfallsortierung mittels Bildverarbeitung, Prozesssteuerung in Aufbereitungsanlagen.",
  "construction-workers": "Erdarbeiten, Betonierarbeiten, Gerüstbau und Materialtransport sind ausschließlich manuell und ortsgebunden. Digitaler Aufgabenanteil unter 5 %. Baurobotik (automatisiertes Mauern, 3D-Druck) existiert in Pilotprojekten, hat aber keine signifikante Marktdurchdringung.",
  "building-trades": "Elektroinstallation, Sanitärinstallation, Heizungs-/Lüftungs-/Klimamontage und Fliesenlegen werden manuell vor Ort ausgeführt. Digitale Diagnosewerkzeuge (Wärmebildkameras, Leckagedetektoren) ergänzen die Arbeit. KI-Potenzial in Gebäude-Energiemanagement und Fehlerdiagnose.",
  "civil-engineers": "Planungsarbeit überwiegend digital: Building Information Modelling (BIM), Finite-Elemente-Analyse, Tragwerkssimulation. KI generiert Entwurfsvarianten, optimiert Lastpfade und automatisiert Konformitätsprüfungen gegen Bauvorschriften.",
  "painters-finishers": "Untergrundvorbereitung, Anstrich, Verputz und Bodenverlegung sind ausschließlich manuelle Tätigkeiten vor Ort. Kein nennenswerter digitaler Aufgabenanteil. KI-Anwendungspotenzial ist auf absehbare Zeit vernachlässigbar.",
  "customer-services-clerks": "Aufgaben: Telefon-/E-Mail-Support, Terminplanung, Beschwerdebearbeitung, Datenerfassung. Über 70 % sind strukturierte digitale Kommunikationsaufgaben. Konversations-KI und automatisierte Ticketsysteme substituieren einen wachsenden Anteil dieser Interaktionen.",
  "vehicle-trade": "Fahrzeugdiagnose über OBD-II/EOBD-Systeme umfasst digitale Schnittstellen, Reparatur, Karosseriearbeiten und Teileersatz sind manuell. KI-Anwendungen: automatisierte Fehlercodeinterpretation, Teilekatalogzuordnung, Garantieabwicklung.",
  "wholesale": "Auftragsabwicklung, Bestandsmanagement und Kundenbeziehungsmanagement sind digital (Enterprise-Resource-Planning-, CRM-Systeme). Physische Lagertätigkeiten machen ca. 40 % aus. KI automatisiert Bedarfsprognosen, Preisbildung und Beschaffung.",
  "retail-sales": "Tätigkeiten im stationären Handel: Kundenberatung, Warenpräsentation, Kassiertätigkeit. Online-Handel substituiert ca. 15 % des traditionellen Einzelhandelsvolumens (Statistik Austria 2023). KI-gestützte Produktempfehlungen, Self-Checkout-Systeme und automatisierte Bestandsführung reduzieren den Personalbedarf.",
  "land-transport": "Fahrtätigkeit, Be-/Entladung und Routendurchführung sind physisch und räumlich gebunden. Digitale Komponenten: Telematik, Flottenmanagement-Systeme, elektronische Frachtdokumente. Autonome Fahrtechnologie (SAE Level 4) entwickelt sich weiter, regulatorische Zulassung und Infrastruktur begrenzen den kurzfristigen Einsatz.",
  "warehousing": "Kommissionierung, Verpackung und Wareneingang werden physisch ausgeführt. Lagerverwaltungssysteme koordinieren digitale Abläufe. Automatische Lager- und Bereitstellungssysteme sowie autonome mobile Roboter übernehmen zunehmend strukturierte, repetitive Aufgaben.",
  "postal-courier": "Letzte-Meile-Zustellung, Paketsortierung und Kundenübergabe werden physisch ausgeführt. KI-basierte Routenoptimierung und automatisierte Sortierzentren steigern die Effizienz, die Endzustellung an individuelle Adressen bleibt eine manuelle Tätigkeit.",
  "hospitality-retail-managers": "Operative Managementaufgaben umfassen physische Standortleitung und digitale Systeme: Revenue Management, dynamische Preisgestaltung, Online-Buchungsplattformen und Datenanalyse. Ca. 40 % der Managementaufgaben sind digital unterstützt.",
  "hotel-workers": "Zimmerherrichtung, Gästeservice und Rezeptionstätigkeiten werden physisch ausgeführt. Property-Management-Systeme, Online-Check-in und KI-gestützte Chatbots bearbeiten Reservierungen und Anfragen. Persönliche Gästeinteraktion bleibt zentral für die Servicequalität.",
  "restaurant-workers": "Tischbedienung, Bestellaufnahme und Gästebetreuung sind physisch und sozial gebunden. Selbstbestellkioske und digitale Kassensysteme automatisieren die Transaktionsabwicklung, persönlicher Service differenziert gehobene Gastronomie von Schnellverpflegung.",
  "chefs-cooks": "Lebensmittelvorbereitung, Kochen, Anrichten und Küchenmanagement erfordern Fingerfertigkeit und sensorische Beurteilung. Digitaler Aufgabenanteil beschränkt sich auf Warenwirtschaft und Rezeptdokumentation. Kulinarische Ausführung ist mit aktueller Technologie nicht automatisierbar.",
  "publishing-media": "Inhaltserstellung, Lektorat, Layout und digitales Publizieren sind vollständig digitale Arbeitsabläufe. Große Sprachmodelle generieren Textentwürfe, automatisierte Layoutwerkzeuge setzen Seiten. Menschliches redaktionelles Urteil bleibt für Qualitätssicherung und investigativen Journalismus notwendig.",
  "film-tv-broadcasting": "Postproduktion (Schnitt, Farbkorrektur, Sounddesign) ist vollständig digital. KI-Werkzeuge generieren Videosequenzen, synthetische Stimmen und automatisierte Untertitelung. Physische Produktion (Kamerabedienung, Bühnenbau, Live-Sendung) behält manuelle Anforderungen.",
  "telecom-tech": "Physische Aufgaben: Kabelverlegung, Antenneninstallation, Gerätewartung an Standorten. Digitale Aufgaben: Netzwerkkonfiguration, Signaloptimierung, Störungsüberwachung über Network-Management-Systeme. Ca. 40 % digitaler Aufgabenanteil.",
  "software-it": "Softwareentwicklung, Systemadministration und Data Engineering sind vollständig digitale Tätigkeiten. KI-Codegenerierungswerkzeuge (Code-Vervollständigung, automatisiertes Testen, Code-Review) unterstützen ca. 30–50 % der Entwicklungsworkflows. Die Nachfrage nach Software Engineering wird trotz Produktivitätszuwächsen voraussichtlich steigen.",
  "financial-services": "Transaktionsverarbeitung, Bonitätsprüfung, regulatorisches Reporting und Betrugserkennung sind digitale Prozesse. KI automatisiert Risikomodellierung, Geldwäscheprävention und Kunden-Onboarding. Physischer Filialbetrieb macht einen sinkenden Anteil der Banktätigkeit aus.",
  "insurance-workers": "Underwriting, Schadensbewertung, versicherungsmathematische Analyse und Polizzenverwaltung sind überwiegend digital. KI automatisiert Schadensschätzung (bildbasiert), Betrugserkennung und Risikotarifierung. Kundeninteraktion verlagert sich auf digitale Kanäle.",
  "real-estate": "Immobilienbewertung, Marktanalyse und Marketing sind digital unterstützt. Physische Objektbesichtigungen und Vertragsverhandlungen erfordern persönliche Präsenz. KI automatisiert Vergleichswertanalysen, Property-Matching-Algorithmen und virtuelle Rundgangerstellung.",
  "admin-commercial-managers": "Strategieplanung, Finanzcontrolling, Personalmanagement und Marketingleitung umfassen ca. 60 % digitale Aufgaben (Reporting, Analytik, Personalplanung). KI-gestützte Werkzeuge automatisieren Datenanalyse, Prognosen und Szenariomodellierung.",
  "production-services-managers": "Operative Leitung von Produktions-, Bau- oder IT-Dienstleistungsbetrieben. Digitale Aufgaben: Produktionsplanung, Supply-Chain-Management, Terminierung. Physische Aufgaben: Standortaufsicht, Qualitätsaudits. Ca. 50 % digitaler Aufgabenanteil.",
  "legal-accounting-consulting": "Vertragsentwurf, juristische Recherche, Wirtschaftsprüfung und Beratungsleistungen sind textintensive digitale Aufgaben. KI-gestützte Werkzeuge automatisieren Dokumentenprüfung, Due Diligence, regulatorische Konformitätsprüfungen und Bilanzanalyse.",
  "architects-engineering": "Planungsarbeit ist überwiegend digital: Building Information Modelling, computergestützte Ingenieurberechnung, parametrisches Design. KI generiert Entwurfsalternativen und optimiert Tragwerks-, Wärme- und Energieeffizienz. Baustellenbegehungen und Kundenberatung bleiben notwendig.",
  "research-scientists": "Literaturanalyse, Datenverarbeitung, statistische Modellierung und Manuskripterstellung sind digitale Aufgaben (ca. 60 %). Laborarbeit, Feldforschung und Versuchsaufbau sind physisch. KI beschleunigt systematische Reviews, Datenanalyse und Hypothesengenerierung.",
  "advertising-marketing": "Kampagnenplanung, Inhaltserstellung, Performance-Analytik und Mediaeinkauf sind vollständig digitale Arbeitsabläufe. KI generiert Werbetexte, automatisiert A/B-Tests, optimiert Gebotsstrategien und produziert personalisierte Inhalte skaliert.",
  "bookkeepers-stock-clerks": "Doppelte Buchführung, Lohnverrechnung, Bestandserfassung und Kontenabstimmung sind strukturierte, regelbasierte digitale Aufgaben. KI und Robotic Process Automation übernehmen die durchgängige Verarbeitung von Rechnungen, Bankabstimmungen und Gehaltsberechnungen.",
  "other-clerical-support": "Postbearbeitung, Datenkodierung, Dokumentenablage und Aktenführung sind strukturierte, repetitive digitale Aufgaben. KI-gestützte Dokumentenverarbeitung (optische Zeichenerkennung, natürliche Sprachverarbeitung) automatisiert Klassifikation, Extraktion und Weiterleitung.",
  "temp-workers": "Personalkoordination, Vertragsadministration und Zeiterfassung sind digital. Die Überlassungstätigkeiten selbst erstrecken sich über physische Branchen (Fertigung, Logistik, Bau). KI automatisiert Bewerber-Matching und administrative Abläufe.",
  "office-admin-support": "Terminmanagement, Korrespondenz, Reisebuchung, Datenerfassung und Besprechungskoordination sind überwiegend digitale Aufgaben. KI-gestützte Werkzeuge automatisieren Terminplanung, E-Mail-Entwurf, Dokumentenformatierung und Datenverarbeitung.",
  "cleaning-security": "Reinigung, Sicherheitsrundgänge und Gebäudewartung werden physisch in verschiedenen Umgebungen ausgeführt. Digitaler Aufgabenanteil unter 10 % (Zutrittskontrollsysteme, Dienstplanung). Reinigungsroboter für gewerbliche Nutzung existieren, decken aber nur standardisierte Bodenflächen ab.",
  "public-admin": "Fallbearbeitung, Genehmigungsverwaltung, Konformitätsprüfung und Bürgerkommunikation sind strukturierte digitale Arbeitsabläufe. Österreichs E-Government-Strategie (Digitales Amt) beschleunigt die Prozessautomatisierung. KI-Potenzial in Dokumentenklassifikation, Fallweiterleitung und Entscheidungsunterstützung.",
  "protective-services": "Streifendienst, Notfalleinsätze, Kriminalermittlung und Brandbekämpfung sind physisch und situativ gebunden. KI-Anwendungen: Videoüberwachungsanalyse, Einsatzoptimierung, prädiktive Polizeimodelle. Ca. 80 % der Aufgaben erfordern physische Präsenz.",
  "teachers": "Unterrichtsvorbereitung, Lehrplanentwicklung und Leistungsbeurteilung sind digital unterstützt (ca. 40 %). Präsenzunterricht, Schülerbetreuung und sozial-emotionale Förderung erfordern physische Anwesenheit und zwischenmenschliche Kompetenz, die durch KI nicht substituierbar ist.",
  "education-support": "Administrative Aufgaben (Terminplanung, Aktenführung, Kommunikation) sind digital. Pädagogische Assistenz, Kinderbetreuung und Sonderpädagogik erfordern physische Präsenz. Ca. 30 % digitaler Aufgabenanteil.",
  "doctors": "Diagnostik wird zunehmend KI-unterstützt (Bildgebungsanalyse, Differentialdiagnostik, Laborbefundinterpretation). Körperliche Untersuchung, chirurgische Eingriffe und Patientenkommunikation erfordern manuelle Durchführung und klinisches Urteilsvermögen. Ca. 40 % digitaler Aufgabenanteil.",
  "nurses-health": "Direkte Patientenversorgung (Vitalzeichenüberwachung, Medikamentenverabreichung, Wundversorgung, Mobilisation) wird physisch ausgeführt. KI unterstützt klinische Dokumentation, Medikamenten-Interaktionsprüfungen und Pflegeplanung. Ca. 20 % digitaler Aufgabenanteil.",
  "health-other": "Physiotherapie, Laboranalytik, Apothekenausgabe und Medizintechnik-Bedienung verbinden physischen Patientenkontakt mit technischen Verfahren. KI-Potenzial in Laborbildanalyse und Rehabilitationsüberwachung.",
  "social-care": "Personenpflege, Mobilitätsassistenz, soziale Aktivierung und Krisenintervention erfordern physische Präsenz und empathische Interaktion. Digitale Aufgaben beschränkt auf Pflegedokumentation und Ressourcenkoordination. Ca. 15 % digitaler Aufgabenanteil.",
  "health-care-admin": "Patientenaufnahme, Terminplanung, Krankenaktenverwaltung, Abrechnung und Korrespondenz sind strukturierte digitale Arbeitsabläufe. Ca. 85 % digitaler Aufgabenanteil. KI automatisiert medizinische Kodierung (ICD/DRG), Terminoptimierung und Dokumentenklassifikation.",
  "care-facility-support": "Krankenhaus- und Pflegeheimreinigung, Küchenunterstützung, Wäscheversorgung, Botendienste und Abfallentsorgung sind ausschließlich physische Tätigkeiten. Digitaler Aufgabenanteil unter 5 % (Dienstplansysteme). Reinigungsroboter kommen in einzelnen Einrichtungen zum Einsatz, decken aber nur standardisierte Gangflächen ab.",
  "social-community-workers": "Fallbeurteilung, Einzel- und Gruppenberatung, Krisenintervention und Gemeinwesenarbeit sind interpersonelle Tätigkeiten, die empathisches Urteilsvermögen erfordern. Ca. 35 % digitaler Aufgabenanteil (Falldokumentation, Berichtswesen, Ressourcendatenbanken). KI unterstützt bei Risikobewertung, Bedarfserhebungsfragebögen und Dienstleistungszuordnung.",
  "arts-recreation": "Live-Performance, künstlerische Leitung und Kulturprogrammgestaltung erfordern persönliche kreative Ausführung. KI-Werkzeuge generieren bildende Kunst, Musik und Text — sie ergänzen die digitale Inhaltsproduktion. Physische Präsenz bei Aufführung, Sportanleitung und Veranstaltungsmanagement ist nicht substituierbar.",
  "associations": "Mitgliederkommunikation, Veranstaltungsmanagement und Interessenvertretung erfordern persönliches Beziehungsmanagement. Administrative Aufgaben (Buchhaltung, Korrespondenz, Datenbankpflege) sind digital. Ca. 50 % digitaler Aufgabenanteil.",
  "personal-services": "Friseurhandwerk, kosmetische Behandlungen und Reparaturdienste erfordern Fingerfertigkeit und direkten Kundenkontakt. Digitaler Aufgabenanteil beschränkt sich auf Terminbuchung und Kassenabwicklung. Kein wesentliches KI-Substitutionspotenzial für die Kerndienstleistung.",
};

// ─── Occupation definitions ─────────────────────────────────────────────
// Each occupation maps to a NACE sector (for employment) and ISCO group (for pay)
// Employment is split proportionally within each NACE sector

interface OccupationDef {
  title: string;
  titleDe: string;
  slug: string;
  nace: string; // NACE sector for employment
  isco: string; // ISCO-08 group for pay (2-digit)
  shareOfSector: number; // fraction of sector employment
  education: string;
  educationDe: string;
  exposure: number;
  exposureRationale: string;
  outlook: number;
  outlookDesc: string;
}

// The key insight: we define occupations as fractions of real NACE sector totals
// so the employment numbers are mathematically derived from Eurostat data.

const OCCUPATION_DEFS: OccupationDef[] = [
  // ── A: Agriculture (Eurostat 2024: 136,500) ─────────────────
  { title: "Skilled agricultural workers", titleDe: "Landwirtschaftliche Fachkräfte", slug: "agricultural-workers", nace: "A", isco: "61", shareOfSector: 0.70, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 2, exposureRationale: "Agriculture is predominantly physical work. AI assists with precision farming and crop monitoring, but core manual tasks resist automation.", outlook: -3, outlookDesc: "Declining" },
  { title: "Skilled forestry workers", titleDe: "Forstwirtschaftliche Fachkräfte", slug: "forestry-workers", nace: "A", isco: "61", shareOfSector: 0.13, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 1, exposureRationale: "Physical outdoor work in rugged terrain with minimal digital component.", outlook: -2, outlookDesc: "Declining" },
  { title: "Veterinarians & agricultural scientists", titleDe: "Tierärzte & Agrarwissenschaftler/innen", slug: "veterinarians-agri", nace: "A", isco: "22", shareOfSector: 0.17, education: "Master's/Diploma degree", educationDe: "Master/Diplom", exposure: 3, exposureRationale: "Requires physical examination and hands-on work. AI assists with diagnostics but cannot replace clinical practice.", outlook: 2, outlookDesc: "Slow growth" },

  { title: "Forestry, fishery & hunting workers", titleDe: "Forst-, Fischerei- & Jagdfachkräfte", slug: "forestry-fishery-hunting", nace: "A", isco: "62", shareOfSector: 0.05, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 1, exposureRationale: "Physical outdoor work in rugged terrain: felling, fishing, game management. Minimal digital component.", outlook: -1, outlookDesc: "Declining" },
  { title: "Agricultural & forestry labourers", titleDe: "Land- & forstwirtschaftliche Hilfskräfte", slug: "agricultural-labourers", nace: "A", isco: "92", shareOfSector: 0.05, education: "Compulsory school", educationDe: "Pflichtschulabschluss", exposure: 1, exposureRationale: "Manual seasonal labour: harvesting, planting, animal feeding. Almost no digital tasks.", outlook: -2, outlookDesc: "Declining" },

  // ── B: Mining (Eurostat 2024: 5,510) ────────────────────────
  { title: "Mining technicians & engineers", titleDe: "Bergbautechniker/innen", slug: "mining-technicians", nace: "B", isco: "81", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 3, exposureRationale: "Physical extraction work. AI optimizes logistics and safety monitoring.", outlook: -5, outlookDesc: "Declining" },

  // ── C: Manufacturing (Eurostat 2024: 688,520) ───────────────
  { title: "Food, beverages & tobacco workers", titleDe: "Nahrungs- & Genussmittelherstellung", slug: "food-production", nace: "C10-C12", isco: "75", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 2, exposureRationale: "Primarily physical work: machinery operation, quality control by taste/smell, hygiene compliance.", outlook: 0, outlookDesc: "Little change" },
  { title: "Textile & apparel workers", titleDe: "Textil- & Bekleidungsherstellung", slug: "textile-workers", nace: "C13-C15", isco: "75", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 3, exposureRationale: "Garment production combines manual sewing with pattern cutting. AI assists with design but production remains physical.", outlook: -4, outlookDesc: "Declining" },
  { title: "Wood & paper processing", titleDe: "Holz- & Papierverarbeitung", slug: "wood-paper", nace: "C16", isco: "75", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 2, exposureRationale: "Hands-on carpentry and machine operation. CNC routers add digital layer but core work is physical.", outlook: -1, outlookDesc: "Declining" },
  { title: "Chemical production workers", titleDe: "Chemie-Fachkräfte", slug: "chemical-production", nace: "C20", isco: "81", shareOfSector: 1.0, education: "Upper secondary (Matura)", educationDe: "Matura (AHS/BHS)", exposure: 4, exposureRationale: "Mix of physical lab work and digital process monitoring. AI assists with quality control and optimization.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Pharmaceutical production", titleDe: "Pharmafachkräfte", slug: "pharma-production", nace: "C21", isco: "21", shareOfSector: 1.0, education: "Bachelor's degree", educationDe: "Bachelor/FH-Bachelor", exposure: 5, exposureRationale: "Combines physical cleanroom work with significant digital documentation. AI transforms drug discovery.", outlook: 4, outlookDesc: "Average" },
  { title: "Metal workers & machinists", titleDe: "Metallarbeiter/innen & Maschinenbediener/innen", slug: "metal-workers", nace: "C24", isco: "72", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 3, exposureRationale: "Skilled metalworking requires physical CNC operation, welding, and precision assembly.", outlook: -1, outlookDesc: "Declining" },
  { title: "Fabricated metal products workers", titleDe: "Metallwarenherstellung", slug: "fabricated-metal", nace: "C25", isco: "72", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 3, exposureRationale: "Physical metalwork manufacturing with increasing CNC and automation components.", outlook: -2, outlookDesc: "Declining" },
  { title: "Computer & electronics manufacturing", titleDe: "Computer- & Elektronikfertigung", slug: "electronics-mfg", nace: "C26", isco: "31", shareOfSector: 1.0, education: "Upper secondary (Matura)", educationDe: "Matura (AHS/BHS)", exposure: 5, exposureRationale: "Combines precision assembly with digital design and testing. AI accelerates chip design and quality inspection.", outlook: 3, outlookDesc: "Average" },
  { title: "Electrical equipment manufacturing", titleDe: "Elektro-Ausrüstungsherstellung", slug: "electrical-mfg", nace: "C27", isco: "74", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 4, exposureRationale: "Physical installation and assembly with digital diagnostic tools. AI assists with circuit design.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Machinery & equipment manufacturing", titleDe: "Maschinenbau", slug: "machinery-mfg", nace: "C28", isco: "72", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 4, exposureRationale: "Core Austrian industry. Combines engineering design with physical manufacturing. AI aids simulation and optimization.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Motor vehicle production", titleDe: "Fahrzeugproduktion", slug: "vehicle-production", nace: "C29", isco: "82", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 4, exposureRationale: "Increasingly automated with robotics. EV transition disrupts traditional roles.", outlook: -2, outlookDesc: "Declining" },
  { title: "Other transport equipment", titleDe: "Sonstiger Fahrzeugbau", slug: "other-transport-equip", nace: "C30", isco: "82", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 3, exposureRationale: "Rail vehicles, aerospace components. Mix of skilled assembly and engineering.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Paper & printing workers", titleDe: "Papier- & Druckherstellung", slug: "paper-printing", nace: "C17", isco: "73", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 3, exposureRationale: "Paper production is physical; printing increasingly digital. AI assists with layout.", outlook: -3, outlookDesc: "Declining" },
  { title: "Printing & media reproduction", titleDe: "Druckerei & Medienreproduktion", slug: "printing-media", nace: "C18", isco: "73", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 4, exposureRationale: "Digital prepress and print-on-demand are AI-assisted. Traditional printing declining.", outlook: -4, outlookDesc: "Declining" },
  { title: "Petroleum refining", titleDe: "Mineralölverarbeitung", slug: "petroleum", nace: "C19", isco: "81", shareOfSector: 1.0, education: "Upper secondary (Matura)", educationDe: "Matura (AHS/BHS)", exposure: 3, exposureRationale: "Process control in refineries. AI optimizes but physical plant operation essential.", outlook: -3, outlookDesc: "Declining" },
  { title: "Rubber & plastic products", titleDe: "Gummi- & Kunststoffwaren", slug: "rubber-plastic", nace: "C22", isco: "81", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 3, exposureRationale: "Physical manufacturing with injection molding and extrusion machines.", outlook: 0, outlookDesc: "Little change" },
  { title: "Non-metallic mineral products", titleDe: "Glas, Keramik & Baustoffe", slug: "mineral-products", nace: "C23", isco: "81", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 2, exposureRationale: "Physical production of glass, ceramics, cement. Heavy industrial processes.", outlook: -1, outlookDesc: "Declining" },
  { title: "Furniture & other manufacturing", titleDe: "Möbelherstellung & sonstige Warenherstellung", slug: "furniture-other-mfg", nace: "C31_C32", isco: "75", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 2, exposureRationale: "Furniture making, musical instruments, toys — skilled craftsmanship and physical assembly.", outlook: 0, outlookDesc: "Little change" },
  { title: "Machinery repair & installation", titleDe: "Reparatur & Installation von Maschinen", slug: "machinery-repair", nace: "C33", isco: "72", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 3, exposureRationale: "Physical repair work with digital diagnostics. AI assists with predictive maintenance.", outlook: 2, outlookDesc: "Slow growth" },
  { title: "Manufacturing administration & purchasing", titleDe: "Industrieverwaltung & Einkauf", slug: "mfg-admin-purchasing", nace: "C", isco: "43", shareOfSector: 0.02, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 7, exposureRationale: "Inventory tracking, order processing, purchasing, and bookkeeping are structured, rule-based digital tasks. AI and ERP automation handle routine transactions.", outlook: -1, outlookDesc: "Declining" },

  // ── D: Energy (Eurostat 2024: 30,400) ───────────────────────
  { title: "Energy supply technicians", titleDe: "Energieversorgungstechniker/innen", slug: "energy-technicians", nace: "D", isco: "31", shareOfSector: 1.0, education: "Upper secondary (Matura)", educationDe: "Matura (AHS/BHS)", exposure: 4, exposureRationale: "Combines physical maintenance with digital smart grid monitoring. AI optimizes load balancing.", outlook: 5, outlookDesc: "Faster than average" },

  // ── E: Water & waste (Eurostat 2024: 25,960) ────────────────
  { title: "Water supply & waste management", titleDe: "Wasserversorgung & Abfallwirtschaft", slug: "water-waste", nace: "E", isco: "96", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 2, exposureRationale: "Physical outdoor work. AI optimizes collection routes and sorting.", outlook: 2, outlookDesc: "Slow growth" },

  // ── F: Construction (Eurostat 2024: 317,300) ────────────────
  { title: "Construction workers", titleDe: "Bauarbeiter/innen", slug: "construction-workers", nace: "F", isco: "93", shareOfSector: 0.35, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 1, exposureRationale: "Almost entirely physical, site-based work.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Building trades workers", titleDe: "Bau- und Ausbaufachkräfte", slug: "building-trades", nace: "F", isco: "71", shareOfSector: 0.38, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 2, exposureRationale: "Skilled trades: electricians, plumbers, HVAC. Physical installation work with digital diagnostics.", outlook: 3, outlookDesc: "Average" },
  { title: "Civil engineers & architects", titleDe: "Bauingenieure & Architekten/innen", slug: "civil-engineers", nace: "F", isco: "21", shareOfSector: 0.11, education: "Master's/Diploma degree", educationDe: "Master/Diplom", exposure: 6, exposureRationale: "Increasingly digital: BIM, CAD, structural simulation. AI can generate plans and optimize structures.", outlook: 3, outlookDesc: "Average" },
  { title: "Painters & building finishers", titleDe: "Maler/innen & Ausbaufachkräfte", slug: "painters-finishers", nace: "F", isco: "71", shareOfSector: 0.16, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 1, exposureRationale: "Entirely physical on-site tasks.", outlook: 1, outlookDesc: "Slow growth" },

  // ── G: Trade (Eurostat 2024: 693,530) ───────────────────────
  { title: "Customer services clerks", titleDe: "Kundendienstfachkräfte", slug: "customer-services-clerks", nace: "G47", isco: "42", shareOfSector: 0.15, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 7, exposureRationale: "Receptionists, call-centre agents, travel clerks: heavily digital communication. AI chatbots and self-service kiosks replace many interactions.", outlook: -3, outlookDesc: "Declining" },
  { title: "Motor vehicle trade & repair", titleDe: "Kfz-Handel & -Reparatur", slug: "vehicle-trade", nace: "G45", isco: "72", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 3, exposureRationale: "Physical diagnostics and mechanical work. Digital OBD systems add complexity.", outlook: -1, outlookDesc: "Declining" },
  { title: "Wholesale trade workers", titleDe: "Großhandel", slug: "wholesale", nace: "G46", isco: "33", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 5, exposureRationale: "Mix of physical warehouse work and digital ordering/CRM systems increasingly automated by AI.", outlook: 0, outlookDesc: "Little change" },
  { title: "Retail salespersons", titleDe: "Einzelhandelsverkäufer/innen", slug: "retail-sales", nace: "G47", isco: "52", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 5, exposureRationale: "E-commerce, self-checkout, and AI recommendations reduce need for in-store staff.", outlook: -2, outlookDesc: "Declining" },

  // ── H: Transport (Eurostat 2024: 230,950) ───────────────────
  { title: "Land transport & drivers", titleDe: "Landverkehr & Fahrer/innen", slug: "land-transport", nace: "H49", isco: "83", shareOfSector: 1.0, education: "Compulsory school", educationDe: "Pflichtschulabschluss", exposure: 3, exposureRationale: "Physical, location-based. Autonomous vehicles progressing but regulatory barriers remain high.", outlook: -1, outlookDesc: "Declining" },
  { title: "Warehousing & logistics support", titleDe: "Lagerei & Logistikunterstützung", slug: "warehousing", nace: "H52", isco: "93", shareOfSector: 1.0, education: "Compulsory school", educationDe: "Pflichtschulabschluss", exposure: 4, exposureRationale: "Combines physical picking/packing with digital inventory management. Automated warehouses advancing.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Postal & courier services", titleDe: "Post- & Kurierdienste", slug: "postal-courier", nace: "H53", isco: "93", shareOfSector: 1.0, education: "Compulsory school", educationDe: "Pflichtschulabschluss", exposure: 3, exposureRationale: "Physical delivery work. AI optimizes routes but delivery remains manual.", outlook: 0, outlookDesc: "Little change" },

  // ── I: Hospitality (Eurostat 2024: 301,840) ─────────────────
  { title: "Hospitality & retail managers", titleDe: "Hotel- & Einzelhandelsmanager/innen", slug: "hospitality-retail-managers", nace: "I", isco: "14", shareOfSector: 0.10, education: "Upper secondary (Matura)", educationDe: "Matura (AHS/BHS)", exposure: 4, exposureRationale: "Operational management blending physical presence with digital revenue management, booking platforms, and data-driven pricing.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Hotel & accommodation workers", titleDe: "Hotel- & Beherbergungsfachkräfte", slug: "hotel-workers", nace: "I", isco: "51", shareOfSector: 0.35, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 3, exposureRationale: "Mix of physical service and digital booking management. AI handles reservations but personal interaction essential.", outlook: 2, outlookDesc: "Slow growth" },
  { title: "Restaurant & food service workers", titleDe: "Gastronomie-Fachkräfte", slug: "restaurant-workers", nace: "I", isco: "51", shareOfSector: 0.40, education: "Compulsory school", educationDe: "Pflichtschulabschluss", exposure: 2, exposureRationale: "Physical service, direct customer interaction. AI ordering kiosks exist but table service remains human.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Chefs & cooks", titleDe: "Köche/Köchinnen", slug: "chefs-cooks", nace: "I", isco: "94", shareOfSector: 0.25, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 1, exposureRationale: "Fundamentally physical and creative work. AI cannot replace skilled manual cooking.", outlook: 1, outlookDesc: "Slow growth" },

  // ── J: Information & communication (Eurostat 2024: 152,910) ──
  { title: "Publishing, media & broadcasting", titleDe: "Verlagswesen, Medien & Rundfunk", slug: "publishing-media", nace: "J58", isco: "26", shareOfSector: 1.0, education: "Bachelor's degree", educationDe: "Bachelor/FH-Bachelor", exposure: 8, exposureRationale: "Predominantly digital work: writing, editing, publishing. AI can draft articles and produce content.", outlook: -2, outlookDesc: "Declining" },
  { title: "Film, TV & broadcasting", titleDe: "Film, TV & Rundfunk", slug: "film-tv-broadcasting", nace: "J59_J60", isco: "26", shareOfSector: 1.0, education: "Bachelor's degree", educationDe: "Bachelor/FH-Bachelor", exposure: 7, exposureRationale: "AI video generation, automated editing, and synthetic voice/dubbing transform production workflows.", outlook: 0, outlookDesc: "Little change" },
  { title: "Telecommunications technicians", titleDe: "Telekommunikationstechniker/innen", slug: "telecom-tech", nace: "J61", isco: "35", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 3, exposureRationale: "Physical cable/tower installation alongside digital network configuration.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Software developers & IT professionals", titleDe: "Softwareentwickler/innen & IT-Fachkräfte", slug: "software-it", nace: "J62_J63", isco: "25", shareOfSector: 1.0, education: "Bachelor's degree", educationDe: "Bachelor/FH-Bachelor", exposure: 9, exposureRationale: "Entirely digital. AI coding assistants transform the profession, but demand for software may grow.", outlook: 8, outlookDesc: "Much faster than average" },

  // ── K: Finance & insurance (Eurostat 2024: 129,970) ─────────
  { title: "Financial services workers", titleDe: "Finanzdienstleistungen", slug: "financial-services", nace: "K64", isco: "33", shareOfSector: 1.0, education: "Upper secondary (Matura)", educationDe: "Matura (AHS/BHS)", exposure: 8, exposureRationale: "Banking is predominantly digital. AI automates transactions, risk assessment, and compliance.", outlook: -3, outlookDesc: "Declining" },
  { title: "Insurance workers", titleDe: "Versicherungsangestellte", slug: "insurance-workers", nace: "K65", isco: "33", shareOfSector: 1.0, education: "Upper secondary (Matura)", educationDe: "Matura (AHS/BHS)", exposure: 7, exposureRationale: "Policy analysis, risk calculation, and claims processing are well-suited to AI automation.", outlook: -2, outlookDesc: "Declining" },

  // ── L: Real estate (Eurostat 2024: 73,300) ──────────────────
  { title: "Real estate professionals", titleDe: "Immobilienfachkräfte", slug: "real-estate", nace: "L", isco: "33", shareOfSector: 1.0, education: "Upper secondary (Matura)", educationDe: "Matura (AHS/BHS)", exposure: 5, exposureRationale: "Combines physical viewings with digital analytics. AI automates valuations and marketing.", outlook: 1, outlookDesc: "Slow growth" },

  // ── M: Professional & scientific (Eurostat 2024: 324,460) ────
  { title: "Administrative & commercial managers", titleDe: "Kaufmännische Führungskräfte", slug: "admin-commercial-managers", nace: "M69_M70", isco: "12", shareOfSector: 0.20, education: "Master's/Diploma degree", educationDe: "Master/Diplom", exposure: 6, exposureRationale: "Finance directors, HR directors, marketing directors: strategic decisions remain human, but AI transforms analytics, reporting, and workforce planning.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Production & specialised services managers", titleDe: "Produktions- & Dienstleistungsleiter/innen", slug: "production-services-managers", nace: "C28", isco: "13", shareOfSector: 0.10, education: "Bachelor's degree", educationDe: "Bachelor/FH-Bachelor", exposure: 5, exposureRationale: "Manufacturing managers, construction managers, IT service managers: mix of physical site oversight and digital planning, scheduling, and supply-chain optimization.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Lawyers, accountants & consultants", titleDe: "Rechtsanwälte, Wirtschaftsprüfer & Berater/innen", slug: "legal-accounting-consulting", nace: "M69_M70", isco: "24", shareOfSector: 1.0, education: "Master's/Diploma degree", educationDe: "Master/Diplom", exposure: 7, exposureRationale: "Heavily text-based digital work. AI drafts contracts, reviews documents, and analyzes data.", outlook: 2, outlookDesc: "Slow growth" },
  { title: "Architects & engineering consultants", titleDe: "Architekten & Ingenieurberatung", slug: "architects-engineering", nace: "M71", isco: "21", shareOfSector: 1.0, education: "Master's/Diploma degree", educationDe: "Master/Diplom", exposure: 6, exposureRationale: "Increasingly digital: BIM, CAD, simulation. AI generates plans but creative vision remains human.", outlook: 2, outlookDesc: "Slow growth" },
  { title: "Research scientists & academics", titleDe: "Forscher/innen & Wissenschaftler/innen", slug: "research-scientists", nace: "M72", isco: "21", shareOfSector: 1.0, education: "Doctoral/PhD", educationDe: "Doktorat/PhD", exposure: 7, exposureRationale: "AI increasingly used for literature review, data analysis, hypothesis generation. Lab work provides physical buffer.", outlook: 4, outlookDesc: "Average" },
  { title: "Advertising, marketing & other professional", titleDe: "Werbung, Marketing & sonst. freiberufliche Dienste", slug: "advertising-marketing", nace: "M73", isco: "24", shareOfSector: 1.0, education: "Bachelor's degree", educationDe: "Bachelor/FH-Bachelor", exposure: 8, exposureRationale: "Content creation, campaign management, analytics are all heavily digital. AI generates copy and optimizes targeting.", outlook: 2, outlookDesc: "Slow growth" },

  // ── N: Administrative & support (Eurostat 2024: 266,480) ─────
  { title: "Bookkeepers, payroll & stock clerks", titleDe: "Buchhaltung, Lohn- & Lagerfachkräfte", slug: "bookkeepers-stock-clerks", nace: "N", isco: "43", shareOfSector: 0.15, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 8, exposureRationale: "Bookkeeping, payroll processing, inventory recording: routine digital data work that AI automates end-to-end.", outlook: -4, outlookDesc: "Declining" },
  { title: "Other clerical support workers", titleDe: "Sonstige Büro- & Sekretariatskräfte", slug: "other-clerical-support", nace: "N", isco: "44", shareOfSector: 0.10, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 7, exposureRationale: "Mail clerks, coding clerks, filing clerks: routine digital office tasks increasingly handled by document-processing AI.", outlook: -3, outlookDesc: "Declining" },
  { title: "Employment agency & temp workers", titleDe: "Zeitarbeit & Personaldienstleistung", slug: "temp-workers", nace: "N78", isco: "93", shareOfSector: 1.0, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 4, exposureRationale: "Staffing coordination is digital, but temp work itself is often physical.", outlook: 0, outlookDesc: "Little change" },
  { title: "Office administration & support services", titleDe: "Bürodienste & sonst. Unternehmensdienstleistungen", slug: "office-admin-support", nace: "N", isco: "41", shareOfSector: 0.59, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 7, exposureRationale: "Administrative work is almost entirely digital. AI excels at scheduling, correspondence, data entry.", outlook: -3, outlookDesc: "Declining" },
  { title: "Cleaning & security services", titleDe: "Reinigung & Sicherheitsdienste", slug: "cleaning-security", nace: "N", isco: "91", shareOfSector: 0.41, education: "Compulsory school", educationDe: "Pflichtschulabschluss", exposure: 1, exposureRationale: "Physical work in diverse environments with minimal digital component.", outlook: 1, outlookDesc: "Slow growth" },

  // ── O: Public administration (Eurostat 2024: 280,500) ────────
  { title: "Public administration managers & senior officials", titleDe: "Führungskräfte & leitende Verwaltungsbedienstete", slug: "public-admin", nace: "O", isco: "11", shareOfSector: 0.50, education: "Bachelor's degree", educationDe: "Bachelor/FH-Bachelor", exposure: 6, exposureRationale: "Government administration involves document processing, case management, and compliance — increasingly digitized. E-Government initiatives accelerating.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Police, firefighters & security workers", titleDe: "Polizei, Feuerwehr & Sicherheitsdienste", slug: "protective-services", nace: "O", isco: "54", shareOfSector: 0.50, education: "Upper secondary (Matura)", educationDe: "Matura (AHS/BHS)", exposure: 2, exposureRationale: "Physical, response-based work: patrols, emergency response, law enforcement. AI assists with surveillance and dispatch but field work remains human.", outlook: 1, outlookDesc: "Slow growth" },

  // ── P: Education (Eurostat 2024: 336,990) ────────────────────
  { title: "Teaching professionals", titleDe: "Lehrkräfte", slug: "teachers", nace: "P", isco: "23", shareOfSector: 0.75, education: "Master's/Diploma degree", educationDe: "Master/Diplom", exposure: 5, exposureRationale: "Combines digital content preparation with essential in-person classroom interaction. AI assists but doesn't replace teaching.", outlook: 2, outlookDesc: "Slow growth" },
  { title: "Education support staff", titleDe: "Pädagogisches Unterstützungspersonal", slug: "education-support", nace: "P", isco: "53", shareOfSector: 0.25, education: "Upper secondary (Matura)", educationDe: "Matura (AHS/BHS)", exposure: 3, exposureRationale: "Teaching assistants, school administrators. Mix of digital admin and physical presence with children.", outlook: 3, outlookDesc: "Average" },

  // ── Q: Health & social work (Eurostat 2024: 522,600) ─────────
  { title: "Doctors & medical specialists", titleDe: "Ärzte/Ärztinnen & Fachärzte", slug: "doctors", nace: "Q86", isco: "22", shareOfSector: 0.30, education: "Doctoral/PhD", educationDe: "Doktorat/PhD", exposure: 5, exposureRationale: "AI assists with diagnostics and imaging, but physical examination, surgery, and patient communication remain essential.", outlook: 3, outlookDesc: "Average" },
  { title: "Nurses & health associates", titleDe: "Pflegefachkräfte & Gesundheitsberufe", slug: "nurses-health", nace: "Q86", isco: "32", shareOfSector: 0.50, education: "Post-secondary (Kolleg)", educationDe: "Kolleg/Akademie", exposure: 3, exposureRationale: "Nursing is fundamentally physical: patient care, medication, wound treatment. AI aids documentation but not bedside care.", outlook: 5, outlookDesc: "Faster than average" },
  { title: "Other health activities workers", titleDe: "Sonst. Gesundheitsberufe", slug: "health-other", nace: "Q86", isco: "53", shareOfSector: 0.20, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 2, exposureRationale: "Physiotherapy, pharmacy assistants, lab technicians — physical patient contact and manual lab work.", outlook: 3, outlookDesc: "Average" },
  { title: "Social work & care workers", titleDe: "Sozialarbeit & Betreuungsdienste", slug: "social-care", nace: "Q87_Q88", isco: "53", shareOfSector: 1.0, education: "Post-secondary (Kolleg)", educationDe: "Kolleg/Akademie", exposure: 2, exposureRationale: "Personal care, elderly support, disability services — fundamentally human interaction and physical assistance.", outlook: 4, outlookDesc: "Average" },
  { title: "Health & care administration", titleDe: "Gesundheits- & Pflegeverwaltung", slug: "health-care-admin", nace: "Q86", isco: "41", shareOfSector: 0.04, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 7, exposureRationale: "Patient registration, appointment scheduling, medical records, and billing are structured digital tasks. AI automates coding, scheduling, and document processing.", outlook: 1, outlookDesc: "Slow growth" },
  { title: "Care facility support & cleaning", titleDe: "Pflege-Unterstützung & Reinigung", slug: "care-facility-support", nace: "Q87_Q88", isco: "91", shareOfSector: 0.07, education: "Compulsory school", educationDe: "Pflichtschulabschluss", exposure: 1, exposureRationale: "Hospital and care home cleaning, kitchen support, and portering are entirely physical tasks. Robotic floor cleaning exists but covers only standardised areas.", outlook: 3, outlookDesc: "Average" },
  { title: "Social & community workers", titleDe: "Sozialarbeiter/innen & Sozialpädagog/innen", slug: "social-community-workers", nace: "Q87_Q88", isco: "26", shareOfSector: 0.08, education: "Bachelor's degree", educationDe: "Bachelor/FH-Bachelor", exposure: 4, exposureRationale: "Case assessment, counselling, crisis intervention, and community outreach combine interpersonal work with digital case documentation. AI assists with resource matching and risk scoring.", outlook: 4, outlookDesc: "Average" },

  // ── R: Arts & recreation (Eurostat 2024: 43,600) ─────────────
  { title: "Arts, entertainment & recreation", titleDe: "Kunst, Unterhaltung & Erholung", slug: "arts-recreation", nace: "R", isco: "34", shareOfSector: 1.0, education: "Bachelor's degree", educationDe: "Bachelor/FH-Bachelor", exposure: 5, exposureRationale: "Creative and performance work. AI generates content but live performance and creative direction remain human.", outlook: 1, outlookDesc: "Slow growth" },

  // ── S: Other services (Eurostat 2024: 133,420) ──────────────
  { title: "Membership organizations & associations", titleDe: "Interessenvertretungen & Vereine", slug: "associations", nace: "S", isco: "34", shareOfSector: 0.55, education: "Upper secondary (Matura)", educationDe: "Matura (AHS/BHS)", exposure: 5, exposureRationale: "Mix of administrative work and personal member services. Digital communication but relationship-based.", outlook: 0, outlookDesc: "Little change" },
  { title: "Personal services & repair", titleDe: "Persönliche Dienstleistungen & Reparatur", slug: "personal-services", nace: "S", isco: "51", shareOfSector: 0.45, education: "Apprenticeship (Lehre)", educationDe: "Lehrabschluss", exposure: 2, exposureRationale: "Hairdressing, beauty, repair services — hands-on physical work with personal customer interaction.", outlook: 1, outlookDesc: "Slow growth" },
];

/** Occupation row produced for data.ts (before string templating). */
interface GeneratedOccupation {
  title: string;
  titleDe: string;
  slug: string;
  nace: string;
  isco: string;
  iscoMajor: string;
  iscoLabel: string;
  iscoLabelDe: string;
  pay: number;
  jobs: number;
  outlook: number;
  outlookDesc: string;
  education: string;
  educationDe: string;
  exposure: number;
  exposureRationale: string;
  exposureRationaleDe: string;
  employmentSource: string;
  paySource: string;
}

// ─── Generate the data ──────────────────────────────────────────────────

function main() {
  console.log("Generating occupation data from real sources...\n");

  const llmExposure = loadLlmExposureOverrides();
  const llmSlugs = Object.keys(llmExposure).length;
  if (llmSlugs > 0) {
    console.log(
      `Applying LLM exposure overrides: ${llmSlugs} slug(s) from llm-exposure-overrides.json\n`
    );
  }

  // Track sector usage for verification
  const sectorUsage = new Map<string, number>();

  const weightBySlug = new Map<string, number>();
  const sumWeightByIsco = new Map<string, number>();
  for (const def of OCCUPATION_DEFS) {
    const w = getEmployment(def.nace) * def.shareOfSector;
    weightBySlug.set(def.slug, w);
    sumWeightByIsco.set(def.isco, (sumWeightByIsco.get(def.isco) ?? 0) + w);
  }

  const occupations = OCCUPATION_DEFS.map((def) => {
    const sectorEmployment = getEmployment(def.nace);
    const w = weightBySlug.get(def.slug) ?? 0;
    const sumW = sumWeightByIsco.get(def.isco) ?? 0;
    const Ti = getLfsEmploymentByIsco(def.isco);
    const namaFallback = Math.round(sectorEmployment * def.shareOfSector);

    let jobs: number;
    if (Ti > 0 && sumW > 0) {
      jobs = Math.round(Ti * (w / sumW));
    } else {
      jobs = namaFallback;
    }

    // Get pay from ISCO-08 occupation earnings (Statistik Austria VSE 2022)
    const occEarnings = getOccupationEarnings(def.isco);
    const sectorEarnings = getSectorEarnings(def.nace);

    // Use ISCO occupation pay if available, otherwise sector pay
    let pay: number;
    let paySource: string;
    if (occEarnings) {
      pay = annualWithBonus(occEarnings.medianHourly);
      paySource = `VSE 2022 ISCO-08 ${def.isco} (€${occEarnings.medianHourly}/h median × 2080h × 1.17)`;
    } else if (sectorEarnings) {
      pay = annualWithBonus(sectorEarnings.medianHourly);
      paySource = `VSE 2022 NACE ${def.nace} (€${sectorEarnings.medianHourly}/h median × 2080h × 1.17)`;
    } else {
      // Fallback to national median
      pay = annualWithBonus(17.49);
      paySource = "VSE 2022 national median (€17.49/h)";
    }

    // Track sector usage
    const key = def.nace;
    sectorUsage.set(key, (sectorUsage.get(key) || 0) + def.shareOfSector);

    const employmentSource =
      Ti > 0 && sumW > 0
        ? `Eurostat lfsa_egai2d (${LFS_EMPLOYMENT_YEAR}) ISCO-08 ${def.isco}: ${Ti.toLocaleString()} employed (LFS/Mikrozensus AKE) × ${((w / sumW) * 100).toFixed(1)}% NACE weight (nama_10_a64_e: NACE ${def.nace})`
        : `Eurostat nama_10_a64_e 2024: NACE ${def.nace} = ${sectorEmployment.toLocaleString()} × ${(def.shareOfSector * 100).toFixed(0)}% (LFS ISCO total unavailable — fallback)`;

    const llm = llmExposure[def.slug];

    return {
      title: def.title,
      titleDe: def.titleDe,
      slug: def.slug,
      nace: def.nace,
      isco: def.isco,
      iscoMajor: def.isco.charAt(0),
      iscoLabel: getISCOLabelEn(def.isco),
      iscoLabelDe: getISCOLabelDe(def.isco),
      pay,
      jobs,
      outlook: def.outlook,
      outlookDesc: def.outlookDesc,
      education: def.education,
      educationDe: def.educationDe,
      exposure: llm?.exposure ?? def.exposure,
      exposureRationale: llm?.exposureRationale ?? EXPOSURE_RATIONALE_EN[def.slug] ?? def.exposureRationale,
      exposureRationaleDe: EXPOSURE_RATIONALE_DE[def.slug] ?? EXPOSURE_RATIONALE_EN[def.slug] ?? def.exposureRationale,
      employmentSource,
      paySource,
    };
  });

  // Verify sector shares add to ~1.0
  console.log("Sector share verification:");
  for (const [nace, total] of [...sectorUsage.entries()].sort()) {
    const flag = Math.abs(total - 1.0) > 0.01 ? " ⚠️" : " ✓";
    console.log(`  NACE ${nace}: ${(total * 100).toFixed(0)}%${flag}`);
  }

  const totalJobs = occupations.reduce((s, o) => s + o.jobs, 0);
  const sumLfsModel = [...new Set(OCCUPATION_DEFS.map((d) => d.isco))].reduce(
    (s, isco) => s + getLfsEmploymentByIsco(isco),
    0
  );
  console.log(`\nTotal employment (modeled rows): ${totalJobs.toLocaleString()}`);
  console.log(`Sum LFS for ISCO codes used in defs: ${sumLfsModel.toLocaleString()}`);
  console.log(`LFS national total (${LFS_EMPLOYMENT_YEAR}): ${TOTAL_EMPLOYMENT_LFS.toLocaleString()}`);
  console.log(
    `Modeled / sum(LFS ISCO in model): ${((totalJobs / sumLfsModel) * 100).toFixed(1)}%`
  );

  // Write output
  const output = generateOutput(occupations, totalJobs, sumLfsModel);
  const outPath = join(__dirname, "..", "src", "lib", "data.ts");
  writeFileSync(outPath, output, "utf-8");
  console.log(`\n✅ Written to: ${outPath}`);
}

function generateOutput(
  occupations: GeneratedOccupation[],
  totalJobs: number,
  sumLfsForModeledIscos: number
): string {
  // Read existing data.ts for types, comparison data, and test data
  // We only replace the occupation array

  const occEntries = occupations
    .map(
      (o) => `  {
    title: ${JSON.stringify(o.title)},
    titleDe: ${JSON.stringify(o.titleDe)},
    slug: ${JSON.stringify(o.slug)},
    category: ${JSON.stringify(o.nace)},
    categoryDe: ${JSON.stringify(getNACELabelDe(o.nace))},
    onaceSection: ${JSON.stringify(o.nace.charAt(0))},
    isco08: ${JSON.stringify(o.isco)},
    iscoMajor: ${JSON.stringify(o.iscoMajor)},
    iscoLabel: ${JSON.stringify(o.iscoLabel)},
    iscoLabelDe: ${JSON.stringify(o.iscoLabelDe)},
    pay: ${o.pay},
    jobs: ${o.jobs},
    outlook: ${o.outlook},
    outlookDesc: ${JSON.stringify(o.outlookDesc)},
    education: ${JSON.stringify(o.education)},
    educationDe: ${JSON.stringify(o.educationDe)},
    exposure: ${o.exposure},
    exposureRationale: ${JSON.stringify(o.exposureRationale)},
    exposureRationaleDe: ${JSON.stringify(o.exposureRationaleDe)},
    source: ${JSON.stringify(o.employmentSource + " | Pay: " + o.paySource + " | Pipeline: scripts/generate-occupations.ts → deterministic build, all source data publicly downloadable (OGD), 30+ automated integrity tests")},
  }`
    )
    .join(",\n");

  return `/**
 * Austrian Job Market Data — VERIFIED FROM OFFICIAL SOURCES
 *
 * Generated: ${new Date().toISOString()}
 * Pipeline: scripts/generate-occupations.ts
 * Real data fetched: ${DATA_FETCHED_AT}
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  EMPLOYMENT: Eurostat lfsa_egai2d (${LFS_EMPLOYMENT_YEAR}) — ISCO-08 2-digit ║
 * ║  → EU Labour Force Survey; AT = Mikrozensus-Arbeitskräfteerhebung (AKE)   ║
 * ║  → URL: https://ec.europa.eu/eurostat/databrowser/view/lfsa_egai2d       ║
 * ║  → Aggregate AKE OGD: OGD_ake001j_AKEJ_1 (data.statistik.gv.at)           ║
 * ║  → LFS employed persons (AT): ${TOTAL_EMPLOYMENT_LFS.toLocaleString().padEnd(44)}║
 * ║                                                                          ║
 * ║  WEIGHTS: Eurostat nama_10_a64_e (2024) NACE employment                 ║
 * ║  → Splits each ISCO total across ÖNACE occupation rows in this app        ║
 * ║                                                                          ║
 * ║  EARNINGS: Statistik Austria Verdienststrukturerhebung 2022              ║
 * ║  → OGD_veste401 (ÖNACE), OGD_veste403 (ISCO-08) — CC-BY 4.0               ║
 * ║                                                                          ║
 * ║  METHODOLOGY: jobs = LFS_total[ISCO] × NACE_weight[row]/Σ_weight[ISCO]   ║
 * ║  → Pay = VSE 2022 median hourly × 2,080h × 1.17 (13th/14th salary)       ║
 * ║  → AI exposure/outlook = OCCUPATION_DEFS (Karpathy rubric)               ║
 * ║  → Regenerate: npx tsx scripts/fetch-real-data.ts && generate-occupations ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Modeled jobs sum: ${totalJobs.toLocaleString()} vs Σ LFS for ISCOs in this model: ${sumLfsForModeledIscos.toLocaleString()}
 * (${((totalJobs / sumLfsForModeledIscos) * 100).toFixed(1)}% — should be ~100% after rounding; ${occupations.length} occupation groups)
 */

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
  outlookDesc: string;
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
${occEntries}
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

export interface DataTest {
  id: string;
  name: string;
  nameDe: string;
  description: string;
  descriptionDe: string;
  test: () => { passed: boolean; actual: string; expected: string };
}

export const dataTests: DataTest[] = [
  {
    id: "total-employment",
    name: "Total employment matches LFS sum for modeled ISCO codes",
    nameDe: "Gesamtbeschäftigung entspricht LFS-Summe (modellierte ISCO-Codes)",
    description: "We sum jobs across all occupation rows and compare to the sum of Eurostat LFS employment (lfsa_egai2d / Mikrozensus AKE) for each ISCO-08 code used in this model (${sumLfsForModeledIscos.toLocaleString()}). The ratio should stay within 98–102% after rounding.",
    descriptionDe: "Wir summieren die Beschäftigten über alle Berufszeilen und vergleichen mit der Summe der Eurostat-LFS-Beschäftigung je genutzter ISCO-08-Gruppe (${sumLfsForModeledIscos.toLocaleString()}). Nach Rundung soll das Verhältnis bei 98–102 % liegen.",
    test: () => {
      const total = austrianOccupations.reduce((s, o) => s + (o.jobs ?? 0), 0);
      const ratio = total / ${sumLfsForModeledIscos};
      return {
        passed: ratio >= 0.98 && ratio <= 1.02,
        actual: total.toLocaleString() + " (" + (ratio * 100).toFixed(1) + "%)",
        expected: "98–102% of ${sumLfsForModeledIscos.toLocaleString()}",
      };
    },
  },
  {
    id: "no-zero-jobs",
    name: "Every occupation has positive employment",
    nameDe: "Jeder Beruf hat positive Beschäftigung",
    description: "Missing or zero job counts would signal a broken LFS×NACE allocation into occupation rows.",
    descriptionDe: "Fehlende oder null Beschäftigte würden auf eine defekte LFS×NACE-Aufteilung auf Berufszeilen hindeuten.",
    test: () => {
      const zeros = austrianOccupations.filter((o) => !o.jobs || o.jobs === 0);
      return {
        passed: zeros.length === 0,
        actual: zeros.length === 0 ? "All > 0" : zeros.map((o) => o.slug).join(", "),
        expected: "All occupations > 0 jobs",
      };
    },
  },
  {
    id: "no-zero-pay",
    name: "Every occupation has VSE-based pay",
    nameDe: "Jeder Beruf hat ein VSE-basiertes Gehalt",
    description: "Median gross annual pay should come from Statistik Austria VSE (ISCO or NACE), scaled with the 13th/14th-month factor used in this pipeline.",
    descriptionDe: "Median-Bruttojahresgehalt soll aus der Statistik-Austria-VSE stammen (ISCO oder ÖNACE), mit dem hier verwendeten Faktor für 13./14. Monatsgehalt skaliert.",
    test: () => {
      const zeros = austrianOccupations.filter((o) => !o.pay || o.pay === 0);
      return {
        passed: zeros.length === 0,
        actual: zeros.length === 0 ? "All > 0" : zeros.map((o) => o.slug).join(", "),
        expected: "All occupations have pay data",
      };
    },
  },
  {
    id: "pay-range",
    name: "Annual pay stays in a realistic band",
    nameDe: "Jahresgehälter bleiben in einer realistischen Spanne",
    description: "Across aggregated occupations, min/max gross annual pay should sit inside €15k–€150k so obvious data-entry errors fail fast.",
    descriptionDe: "Über aggregierte Berufe soll Min./Max.-Bruttojahresgehalt im Bereich 15k–150k € liegen, damit offensichtliche Eingabefehler auffallen.",
    test: () => {
      const pays = austrianOccupations.map((o) => o.pay ?? 0).filter((p) => p > 0);
      const min = Math.min(...pays);
      const max = Math.max(...pays);
      return {
        passed: min >= 15000 && max <= 150000,
        actual: "€" + min.toLocaleString() + " – €" + max.toLocaleString(),
        expected: "€15,000 – €150,000",
      };
    },
  },
  {
    id: "education-valid",
    name: "Education labels map to the canonical list",
    nameDe: "Bildungslabels entsprechen der kanonischen Liste",
    description: "Each row’s education string must be one of EDU_LEVELS_EN so filters and comparisons stay stable in EN/DE.",
    descriptionDe: "Jede Zeile muss ein Bildungslabel aus EDU_LEVELS_EN verwenden, damit Filter und Vergleiche in EN/DE stabil bleiben.",
    test: () => {
      const invalid = austrianOccupations.filter((o) => !EDU_LEVELS_EN.includes(o.education));
      return {
        passed: invalid.length === 0,
        actual: invalid.length === 0 ? "All valid" : invalid.map((o) => o.slug + ":" + o.education).join(", "),
        expected: "All in EDU_LEVELS_EN",
      };
    },
  },
  {
    id: "isco-fields-present",
    name: "Every row carries ISCO code and family labels",
    nameDe: "Jede Zeile trägt ISCO-Code und Familienlabels",
    description: "The occupation-first UI depends on ISCO-08, the major family digit, and bilingual family labels being present on every row.",
    descriptionDe: "Die occupation-first Oberfläche hängt davon ab, dass ISCO-08, die Major-Familie und zweisprachige Familienlabels in jeder Zeile vorhanden sind.",
    test: () => {
      const invalid = austrianOccupations.filter(
        (o) => !o.isco08 || !o.iscoMajor || !o.iscoLabel || !o.iscoLabelDe
      );
      return {
        passed: invalid.length === 0,
        actual: invalid.length === 0 ? "All rows complete" : invalid.map((o) => o.slug).join(", "),
        expected: "All rows have ISCO code + family labels",
      };
    },
  },
  {
    id: "isco-major-matches-code",
    name: "ISCO major group matches the 2-digit code",
    nameDe: "ISCO-Majorgruppe passt zum 2-stelligen Code",
    description: "Each occupation row should keep a valid 2-digit ISCO code, and the stored major family should equal the first digit.",
    descriptionDe: "Jede Berufszeile soll einen gültigen 2-stelligen ISCO-Code tragen; die gespeicherte Majorgruppe muss dem ersten Digit entsprechen.",
    test: () => {
      const invalid = austrianOccupations.filter(
        (o) => !/^[1-9][0-9]$/.test(o.isco08) || o.iscoMajor !== o.isco08.charAt(0)
      );
      return {
        passed: invalid.length === 0,
        actual: invalid.length === 0 ? "All rows aligned" : invalid.map((o) => o.slug + ":" + o.isco08 + "/" + o.iscoMajor).join(", "),
        expected: "2-digit ISCO; major = first digit",
      };
    },
  },
  {
    id: "isco-family-labels-consistent",
    name: "ISCO family labels stay consistent with major groups",
    nameDe: "ISCO-Familienlabels bleiben konsistent zu den Majorgruppen",
    description: "The English and German family labels should match the canonical ISCO major-group mapping used across the site.",
    descriptionDe: "Die englischen und deutschen Familienlabels sollen zur kanonischen ISCO-Majorgruppen-Zuordnung der Website passen.",
    test: () => {
      const expectedLabels: Record<string, { en: string; de: string }> = {
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
        const labels = expectedLabels[o.iscoMajor];
        return !labels || labels.en !== o.iscoLabel || labels.de !== o.iscoLabelDe;
      });
      return {
        passed: invalid.length === 0,
        actual: invalid.length === 0 ? "All labels canonical" : invalid.map((o) => o.slug).join(", "),
        expected: "Labels match canonical ISCO families",
      };
    },
  },
  {
    id: "isco-family-coverage",
    name: "All major ISCO families 1–9 are represented",
    nameDe: "Alle ISCO-Hauptfamilien 1–9 sind vertreten",
    description: "An Austria-wide occupation map should include at least one row from each major ISCO family used in navigation and summaries.",
    descriptionDe: "Eine österreichweite Berufs-Karte sollte mindestens eine Zeile aus jeder ISCO-Hauptfamilie enthalten, die in Navigation und Zusammenfassungen genutzt wird.",
    test: () => {
      const majors = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      const missing = majors.filter(
        (major) => !austrianOccupations.some((o) => o.iscoMajor === major && (o.jobs ?? 0) > 0)
      );
      return {
        passed: missing.length === 0,
        actual: missing.length === 0 ? "9 families represented" : "Missing: " + missing.join(", "),
        expected: "All families 1–9 represented",
      };
    },
  },
  {
    id: "exposure-range",
    name: "AI exposure scores stay within 0–10",
    nameDe: "KI-Exposition bleibt im Bereich 0–10",
    description: "Exposure is an integer rubric score (curated, optionally merged with optional LLM overrides). Values outside 0–10 indicate a bad merge or corrupt row.",
    descriptionDe: "Exposition ist ein ganzzahliger Rubrik-Score (kuratiert, optional mit LLM-Overrides gemischt). Werte außerhalb 0–10 deuten auf fehlerhafte Daten hin.",
    test: () => {
      const invalid = austrianOccupations.filter((o) => o.exposure == null || o.exposure < 0 || o.exposure > 10);
      return {
        passed: invalid.length === 0,
        actual: invalid.length === 0 ? "All 0–10" : invalid.map((o) => o.slug + ":" + o.exposure).join(", "),
        expected: "All values 0–10",
      };
    },
  },
  {
    id: "outlook-range",
    name: "Job outlook scores stay within −10…+10",
    nameDe: "Ausblick-Scores bleiben im Bereich −10…+10",
    description: "Outlook is a qualitative demand signal per occupation group, not a forecast model. It must remain inside the documented scale.",
    descriptionDe: "Der Ausblick ist ein qualitatives Nachfragesignal pro Berufsgruppe, kein Prognosemodell. Er muss in der dokumentierten Skala bleiben.",
    test: () => {
      const invalid = austrianOccupations.filter((o) => o.outlook == null || o.outlook < -10 || o.outlook > 10);
      return {
        passed: invalid.length === 0,
        actual: invalid.length === 0 ? "All −10 to 10" : invalid.map((o) => o.slug + ":" + o.outlook).join(", "),
        expected: "All values −10 to +10",
      };
    },
  },
  {
    id: "unique-slugs",
    name: "Occupation slugs are unique",
    nameDe: "Berufs-Slugs sind eindeutig",
    description: "Duplicate slugs would break routing and merge logic in the UI.",
    descriptionDe: "Doppelte Slugs würden Routing und Zusammenführung in der Oberfläche stören.",
    test: () => {
      const slugs = austrianOccupations.map((o) => o.slug);
      const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
      return {
        passed: dupes.length === 0,
        actual: dupes.length === 0 ? "All unique" : dupes.join(", "),
        expected: "No duplicates",
      };
    },
  },
  {
    id: "has-source",
    name: "Each row carries a traceable source string",
    nameDe: "Jede Zeile hat eine nachvollziehbare Quellenangabe",
    description: "The combined employment + pay provenance string should be long enough to identify Eurostat/VSE references.",
    descriptionDe: "Die kombinierte Herkunftszeile für Beschäftigung und Entgelt soll lang genug sein, um Eurostat-/VSE-Bezüge zu erkennen.",
    test: () => {
      const noSource = austrianOccupations.filter((o) => !o.source || o.source.length < 10);
      return {
        passed: noSource.length === 0,
        actual: noSource.length === 0 ? "All have sources" : noSource.map((o) => o.slug).join(", "),
        expected: "All occupations have source field",
      };
    },
  },
  {
    id: "manufacturing-total",
    name: "Manufacturing (NACE C) matches Eurostat scale",
    nameDe: "Verarbeitendes Gewerbe (NACE C) in Eurostat-Größenordnung",
    description: "Summed jobs in all NACE C rows should exceed ~600k so the manufacturing total is in line with Eurostat’s Austria figure (~690k).",
    descriptionDe: "Summierte Jobs in allen NACE-C-Zeilen sollten >600k sein, passend zur Eurostat-Größenordnung für Österreich (~690k).",
    test: () => {
      const mfg = austrianOccupations.filter((o) => o.onaceSection === "C").reduce((s, o) => s + (o.jobs ?? 0), 0);
      return {
        passed: mfg > 600000,
        actual: mfg.toLocaleString(),
        expected: "> 600,000 (Eurostat ≈ 690k)",
      };
    },
  },
  {
    id: "it-total",
    name: "Information & communication (NACE J) matches Eurostat scale",
    nameDe: "Information & Kommunikation (NACE J) in Eurostat-Größenordnung",
    description: "Summed jobs across NACE J should exceed ~140k, consistent with Eurostat’s IT/telecom employment for Austria (~155k).",
    descriptionDe: "Summierte Jobs in NACE J sollten >140k sein, konsistent mit Eurostat für Österreich (~155k).",
    test: () => {
      const it = austrianOccupations.filter((o) => o.onaceSection === "J").reduce((s, o) => s + (o.jobs ?? 0), 0);
      return {
        passed: it > 140000,
        actual: it.toLocaleString(),
        expected: "> 140,000 (Eurostat ≈ 155k)",
      };
    },
  },
  {
    id: "occupation-count",
    name: "Enough occupation groups for a useful treemap",
    nameDe: "Genügend Berufsgruppen für eine aussagekräftige Treemap",
    description: "We keep a minimum number of distinct occupation aggregates so the visualization is not dominated by a handful of cells.",
    descriptionDe: "Es gibt eine Mindestzahl aggregierter Berufsgruppen, damit die Visualisierung nicht von wenigen Zellen dominiert wird.",
    test: () => {
      return {
        passed: austrianOccupations.length >= 50,
        actual: austrianOccupations.length.toString(),
        expected: "≥ 50",
      };
    },
  },
  {
    id: "salary-gini",
    name: "Salary inequality (Gini) across occupations is plausible",
    nameDe: "Gehaltsungleichheit (Gini) über Berufe ist plausibel",
    description: "Unweighted Gini of median annual pay across occupation rows should sit in 0.10–0.35 — Austria’s wage structure is relatively compressed.",
    descriptionDe: "Ungewichteter Gini der medianen Jahresgehälter über Berufszeilen soll 0,10–0,35 liegen — passend zur komprimierten Lohnstruktur in Österreich.",
    test: () => {
      const pays = austrianOccupations.map((o) => o.pay ?? 0).filter((p) => p > 0);
      const n = pays.length;
      if (n < 2) return { passed: false, actual: "n<2", expected: "0.10–0.35" };
      const sorted = [...pays].sort((a, b) => a - b);
      let sumRank = 0;
      for (let i = 0; i < n; i++) sumRank += (i + 1) * sorted[i];
      const sum = sorted.reduce((a, b) => a + b, 0);
      const g = (2 * sumRank) / (n * sum) - (n + 1) / n;
      return {
        passed: g >= 0.1 && g <= 0.35,
        actual: g.toFixed(3),
        expected: "0.10–0.35",
      };
    },
  },
  {
    id: "salary-cv",
    name: "Coefficient of variation of pay is plausible",
    nameDe: "Variationskoeffizient der Gehälter ist plausibel",
    description: "CV (std/mean) of pay across occupations should stay between 0.15 and 0.50 — enough spread without wild outliers.",
    descriptionDe: "VK (Std/Ø) der Gehälter über Berufe soll zwischen 0,15 und 0,50 liegen — genug Streuung ohne extreme Ausreißer.",
    test: () => {
      const pays = austrianOccupations.map((o) => o.pay ?? 0).filter((p) => p > 0);
      const mean = pays.reduce((a, b) => a + b, 0) / pays.length;
      const variance = pays.reduce((s, p) => s + (p - mean) * (p - mean), 0) / pays.length;
      const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
      return {
        passed: cv >= 0.15 && cv <= 0.5,
        actual: cv.toFixed(3),
        expected: "0.15–0.50",
      };
    },
  },
  {
    id: "exposure-pay-correlation",
    name: "AI exposure correlates positively with pay",
    nameDe: "KI-Exposition korreliert positiv mit dem Gehalt",
    description: "Across occupations, higher cognitive/digital roles tend to pay more; Pearson r between exposure and pay should be > 0.",
    descriptionDe: "Über Berufe hinweg tendieren kognitivere Rollen zu höherem Entgelt; Pearson r zwischen Exposition und Gehalt soll > 0 sein.",
    test: () => {
      const xs: number[] = [];
      const ys: number[] = [];
      for (const o of austrianOccupations) {
        if (o.exposure == null || o.pay == null || o.pay <= 0) continue;
        xs.push(o.exposure);
        ys.push(o.pay);
      }
      const n = xs.length;
      if (n < 3) return { passed: false, actual: "n<3", expected: "r > 0" };
      const mx = xs.reduce((a, b) => a + b, 0) / n;
      const my = ys.reduce((a, b) => a + b, 0) / n;
      let num = 0;
      let dx = 0;
      let dy = 0;
      for (let i = 0; i < n; i++) {
        const vx = xs[i] - mx;
        const vy = ys[i] - my;
        num += vx * vy;
        dx += vx * vx;
        dy += vy * vy;
      }
      const r = dx > 0 && dy > 0 ? num / Math.sqrt(dx * dy) : 0;
      return {
        passed: r > 0,
        actual: "r = " + r.toFixed(3),
        expected: "r > 0",
      };
    },
  },
  {
    id: "education-pay-ladder",
    name: "Higher formal education → higher median pay",
    nameDe: "Höhere formale Bildung → höheres Medianentgelt",
    description: "Weighted median pay for Master’s/PhD occupations should exceed weighted median for compulsory-school-only occupations.",
    descriptionDe: "Gewichteter Median für Master/PhD-Berufe soll über dem gewichteten Median für reine Pflichtschule liegen.",
    test: () => {
      function wMed(rows: typeof austrianOccupations): number {
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
      const low = austrianOccupations.filter((o) => o.education === "Compulsory school");
      const high = austrianOccupations.filter(
        (o) => o.education === "Master's/Diploma degree" || o.education === "Doctoral/PhD"
      );
      const lowM = wMed(low);
      const highM = wMed(high);
      return {
        passed: highM > lowM && low.length > 0 && high.length > 0,
        actual: "Low: €" + Math.round(lowM).toLocaleString() + " | High: €" + Math.round(highM).toLocaleString(),
        expected: "High median > Low median",
      };
    },
  },
  {
    id: "services-share",
    name: "Services (G–S) employ more than goods (A–F)",
    nameDe: "Dienstleistungen (G–S) beschäftigen mehr als Güter (A–F)",
    description: "Tertiarization check: employment in sections G–S should exceed A–F, consistent with Austria’s service-heavy economy.",
    descriptionDe: "Tertialisierungs-Check: Beschäftigung in G–S soll A–F übersteigen, passend zur dienstleistungslastigen Wirtschaft.",
    test: () => {
      let goods = 0;
      let serv = 0;
      for (const o of austrianOccupations) {
        const c = o.onaceSection.charCodeAt(0);
        const j = o.jobs ?? 0;
        if (c >= 65 && c <= 70) goods += j;
        else if (c >= 71 && c <= 83) serv += j;
      }
      const total = goods + serv;
      const share = total > 0 ? serv / total : 0;
      return {
        passed: share > 0.5,
        actual: (share * 100).toFixed(1) + "% in G–S (" + serv.toLocaleString() + " jobs)",
        expected: "Services > 50%",
      };
    },
  },
  {
    id: "health-total",
    name: "Health & social work (NACE Q) is a large employer",
    nameDe: "Gesundheits- & Sozialwesen (NACE Q) ist ein Großarbeitgeber",
    description: "Summed jobs in NACE Q should exceed 400k to match Eurostat’s ballpark (~440k) for Austria.",
    descriptionDe: "Summierte Jobs in NACE Q sollten >400k sein, in der Größenordnung von Eurostat für Österreich (~440k).",
    test: () => {
      const q = austrianOccupations.filter((o) => o.onaceSection === "Q").reduce((s, o) => s + (o.jobs ?? 0), 0);
      return {
        passed: q > 400000,
        actual: q.toLocaleString(),
        expected: "> 400,000",
      };
    },
  },
  {
    id: "construction-range",
    name: "Construction (NACE F) sits in the Eurostat band",
    nameDe: "Bau (NACE F) liegt in der Eurostat-Bandbreite",
    description: "Construction employment should fall between 250k and 350k, around Eurostat’s ~300k for Austria.",
    descriptionDe: "Bau-Beschäftigung soll zwischen 250k und 350k liegen, um Eurostat (~300k) für Österreich.",
    test: () => {
      const f = austrianOccupations.filter((o) => o.onaceSection === "F").reduce((s, o) => s + (o.jobs ?? 0), 0);
      return {
        passed: f >= 250000 && f <= 350000,
        actual: f.toLocaleString(),
        expected: "250k–350k",
      };
    },
  },
  {
    id: "nace-sections-all",
    name: "All ÖNACE sections A–S appear at least once",
    nameDe: "Alle ÖNACE-Abschnitte A–S kommen vor",
    description: "Every high-level section letter A through S should have ≥1 job row so sector coverage is complete.",
    descriptionDe: "Jeder Abschnittsbuchstabe A bis S soll ≥1 Beschäftigtenzeile haben, damit die Sektorabdeckung vollständig ist.",
    test: () => {
      const letters = "ABCDEFGHIJKLMNOPQRS".split("");
      const missing = letters.filter(
        (L) => !austrianOccupations.some((o) => o.onaceSection === L && (o.jobs ?? 0) > 0)
      );
      return {
        passed: missing.length === 0,
        actual: missing.length === 0 ? "19 sections A–S" : "Missing: " + missing.join(", "),
        expected: "All sections A–S represented",
      };
    },
  },
  {
    id: "weighted-median-pay",
    name: "Employment-weighted median pay is near the national band",
    nameDe: "Beschäftigungsgewichteter Median liegt nahe der nationalen Bandbreite",
    description: "Jobs-weighted median gross annual pay should land in €35k–€45k, consistent with Statistik Austria’s national medians after the 13th/14th uplift.",
    descriptionDe: "Beschäftigungsgewichteter Median-Bruttojahreslohn soll bei 35k–45k € liegen, konsistent mit nationalen Medianen der Statistik Austria (inkl. 13./14.).",
    test: () => {
      const items = austrianOccupations
        .map((o) => ({ p: o.pay ?? 0, j: o.jobs ?? 0 }))
        .filter((x) => x.p > 0 && x.j > 0)
        .sort((a, b) => a.p - b.p);
      const tj = items.reduce((s, x) => s + x.j, 0);
      if (tj <= 0) return { passed: false, actual: "0", expected: "€35k–€45k" };
      let cum = 0;
      const half = tj / 2;
      let med = 0;
      for (const x of items) {
        cum += x.j;
        med = x.p;
        if (cum >= half) break;
      }
      return {
        passed: med >= 35000 && med <= 45000,
        actual: "€" + Math.round(med).toLocaleString(),
        expected: "€35,000–€45,000",
      };
    },
  },
  {
    id: "exposure-span",
    name: "AI exposure uses most of the 0–10 scale",
    nameDe: "KI-Exposition nutzt den Großteil der Skala 0–10",
    description: "Max − min exposure should span at least 7 points so physical vs cognitive jobs are visibly separated.",
    descriptionDe: "Spanne (Max − Min) der Exposition soll mindestens 7 Punkte betragen, damit physische vs. kognitive Jobs sichtbar getrennt sind.",
    test: () => {
      const ex = austrianOccupations.map((o) => o.exposure).filter((e): e is number => e != null);
      if (ex.length < 2) return { passed: false, actual: "n<2", expected: "span ≥ 7" };
      const span = Math.max(...ex) - Math.min(...ex);
      return {
        passed: span >= 7,
        actual: "Range " + Math.min(...ex) + "–" + Math.max(...ex) + " (span " + span + ")",
        expected: "span ≥ 7",
      };
    },
  },
  {
    id: "physical-low-exposure",
    name: "Physical sectors (A, F) average low AI exposure",
    nameDe: "Physische Sektoren (A, F) haben niedrige KI-Exposition",
    description: "Jobs-weighted mean exposure for agriculture + construction should stay below 4 — these roles remain mostly manual/site-based.",
    descriptionDe: "Beschäftigungsgewichteter Mittelwert der Exposition für Landwirtschaft + Bau soll unter 4 bleiben — überwiegend manuell/vor-Ort.",
    test: () => {
      const phys = austrianOccupations.filter((o) => o.onaceSection === "A" || o.onaceSection === "F");
      const tw = phys.reduce((s, o) => s + (o.jobs ?? 0), 0);
      if (tw <= 0) return { passed: false, actual: "no jobs", expected: "< 4.0" };
      const avg =
        phys.reduce((s, o) => s + (o.exposure ?? 0) * (o.jobs ?? 0), 0) / tw;
      return {
        passed: avg < 4,
        actual: "Avg " + avg.toFixed(2) + " (n=" + phys.length + ")",
        expected: "< 4.0",
      };
    },
  },
  {
    id: "knowledge-high-exposure",
    name: "Knowledge-intensive sectors (J, K, M) average high exposure",
    nameDe: "Wissensintensive Sektoren (J, K, M) haben hohe Exposition",
    description: "Jobs-weighted mean exposure for IT, finance, and professional services should exceed 5.",
    descriptionDe: "Beschäftigungsgewichteter Mittelwert für IT, Finanzen und freiberufliche Dienstleistungen soll >5 sein.",
    test: () => {
      const kn = austrianOccupations.filter(
        (o) => o.onaceSection === "J" || o.onaceSection === "K" || o.onaceSection === "M"
      );
      const tw = kn.reduce((s, o) => s + (o.jobs ?? 0), 0);
      if (tw <= 0) return { passed: false, actual: "no jobs", expected: "> 5.0" };
      const avg = kn.reduce((s, o) => s + (o.exposure ?? 0) * (o.jobs ?? 0), 0) / tw;
      return {
        passed: avg > 5,
        actual: "Avg " + avg.toFixed(2) + " (n=" + kn.length + ")",
        expected: "> 5.0",
      };
    },
  },
  {
    id: "employment-hhi",
    name: "Employment is not dominated by one ÖNACE section (HHI)",
    nameDe: "Beschäftigung ist nicht von einem Abschnitt dominiert (HHI)",
    description: "Herfindahl index across section letters (A–S) weighted by jobs should stay < 0.15 for a diversified economy.",
    descriptionDe: "Herfindahl-Index über Abschnittsbuchstaben (A–S), gewichtet mit Jobs, soll <0,15 bleiben.",
    test: () => {
      const bySec = new Map<string, number>();
      for (const o of austrianOccupations) {
        const s = o.onaceSection;
        bySec.set(s, (bySec.get(s) ?? 0) + (o.jobs ?? 0));
      }
      const total = [...bySec.values()].reduce((a, b) => a + b, 0);
      if (total <= 0) return { passed: false, actual: "0", expected: "HHI < 0.15" };
      let hhi = 0;
      for (const v of bySec.values()) hhi += (v / total) * (v / total);
      return {
        passed: hhi < 0.15,
        actual: "HHI = " + hhi.toFixed(4),
        expected: "< 0.15",
      };
    },
  },
  {
    id: "education-extreme-share",
    name: "Extreme education levels are a minority of rows",
    nameDe: "Extreme Bildungsniveaus sind eine Minderheit der Zeilen",
    description: "Share of occupations tagged compulsory-only or PhD should stay below 30% so the ladder isn’t all extremes.",
    descriptionDe: "Anteil der Berufe mit nur Pflichtschule oder PhD soll unter 30 % bleiben.",
    test: () => {
      const n = austrianOccupations.length;
      const ext = austrianOccupations.filter(
        (o) => o.education === "Compulsory school" || o.education === "Doctoral/PhD"
      ).length;
      const pct = n > 0 ? (ext / n) * 100 : 0;
      return {
        passed: pct < 30,
        actual: ext + " of " + n + " (" + pct.toFixed(1) + "%)",
        expected: "< 30%",
      };
    },
  },
  {
    id: "wage-bill",
    name: "Total wage bill (pay × jobs) is economically plausible",
    nameDe: "Gesamtlohnsumme (Gehalt × Jobs) ist ökonomisch plausibel",
    description: "Sum of pay×jobs across rows should fall in €150B–€260B, near Eurostat compensation of employees for Austria.",
    descriptionDe: "Summe Gehalt×Jobs soll bei 150–260 Mrd. € liegen, nahe der Arbeitnehmerentgelte laut Eurostat.",
    test: () => {
      const bill =
        austrianOccupations.reduce((s, o) => s + (o.pay ?? 0) * (o.jobs ?? 0), 0) / 1e9;
      return {
        passed: bill >= 150 && bill <= 260,
        actual: "€" + bill.toFixed(1) + "B",
        expected: "€150B–€260B",
      };
    },
  },
  {
    id: "trade-sector-g",
    name: "Wholesale & retail (NACE G) is the largest private trade block",
    nameDe: "Handel (NACE G) ist der größte private Handelsblock",
    description: "Summed jobs in all G rows (G45–G47) should sit in 500k–700k, consistent with WKO/Eurostat ballparks.",
    descriptionDe: "Summierte Jobs in allen G-Zeilen (G45–G47) sollten 500k–700k sein (WKO/Eurostat-Größenordnung).",
    test: () => {
      const g = austrianOccupations.filter((o) => o.onaceSection === "G").reduce((s, o) => s + (o.jobs ?? 0), 0);
      return {
        passed: g >= 500000 && g <= 700000,
        actual: g.toLocaleString(),
        expected: "500k–700k",
      };
    },
  },
  {
    id: "exposure-rationale-length",
    name: "Every exposure score has a written rationale",
    nameDe: "Jede Expositionsbewertung hat eine Begründung",
    description: "Exposure rationales should be at least ~20 characters so the rubric is explainable in the UI.",
    descriptionDe: "Begründungstexte zur Exposition sollten mindestens ~20 Zeichen haben, damit die Rubrik in der UI erklärbar ist.",
    test: () => {
      const bad = austrianOccupations.filter((o) => !o.exposureRationale || o.exposureRationale.trim().length < 20);
      return {
        passed: bad.length === 0,
        actual: bad.length === 0 ? "All ≥ 20 chars" : bad.map((o) => o.slug).join(", "),
        expected: "All rationales ≥ 20 chars",
      };
    },
  },
  {
    id: "outlook-unbiased",
    name: "Outlook is not systematically biased",
    nameDe: "Ausblick ist nicht systematisch verzerrt",
    description: "Jobs-weighted mean outlook should sit near zero (±3). Strong drift would hint at one-sided scoring.",
    descriptionDe: "Beschäftigungsgewichteter Mittelwert des Ausblicks soll nahe 0 liegen (±3). Starke Drift würde auf einseitige Bewertung hindeuten.",
    test: () => {
      const totalJ = austrianOccupations.reduce((s, o) => s + (o.jobs ?? 0), 0);
      if (totalJ <= 0) return { passed: false, actual: "0", expected: "−3 to +3" };
      const wmean =
        austrianOccupations.reduce((s, o) => s + (o.outlook ?? 0) * (o.jobs ?? 0), 0) / totalJ;
      return {
        passed: wmean >= -3 && wmean <= 3,
        actual: wmean.toFixed(2),
        expected: "−3.0 to +3.0",
      };
    },
  },
];
`;
}

function getNACELabelDe(nace: string): string {
  const labels: Record<string, string> = {
    A: "Land- & Forstwirtschaft",
    B: "Bergbau",
    "C10-C12": "Nahrungsmittel & Getränke",
    "C13-C15": "Textil & Bekleidung",
    C16: "Holzverarbeitung",
    C20: "Chemische Erzeugnisse",
    C21: "Pharmazeutische Erzeugnisse",
    C24: "Metallerzeugung",
    C25: "Metallwarenherstellung",
    C26: "Computer & Elektronik",
    C27: "Elektrische Ausrüstungen",
    C28: "Maschinenbau",
    C29: "Fahrzeugbau",
    C30: "Sonstiger Fahrzeugbau",
    C17: "Papierherstellung",
    C18: "Druckerei & Medienreproduktion",
    C19: "Mineralölverarbeitung",
    C22: "Gummi- & Kunststoffwaren",
    C23: "Glas, Keramik & Baustoffe",
    "C31_C32": "Möbel & sonstige Waren",
    C33: "Reparatur & Installation von Maschinen",
    D: "Energieversorgung",
    E: "Wasserversorgung & Abfallwirtschaft",
    F: "Bauwesen",
    G45: "Kfz-Handel & -Reparatur",
    G46: "Großhandel",
    G47: "Einzelhandel",
    H49: "Landverkehr",
    H52: "Lagerei & Logistik",
    H53: "Post- & Kurierdienste",
    I: "Beherbergung & Gastronomie",
    J58: "Verlagswesen & Medien",
    "J59_J60": "Film, TV & Rundfunk",
    J61: "Telekommunikation",
    "J62_J63": "IT-Dienstleistungen",
    K64: "Finanzdienstleistungen",
    K65: "Versicherungen",
    L: "Grundstücks- & Wohnungswesen",
    "M69_M70": "Rechts-, Steuerberatung & Unternehmensberatung",
    M71: "Architektur- & Ingenieurbüros",
    M72: "Forschung & Entwicklung",
    M73: "Werbung & Marktforschung",
    N: "Sonstige wirtschaftliche Dienstleistungen",
    N78: "Personaldienstleistung",
    O: "Öffentliche Verwaltung",
    P: "Erziehung & Unterricht",
    Q86: "Gesundheitswesen",
    "Q87_Q88": "Sozialwesen & Betreuungsdienste",
    R: "Kunst, Unterhaltung & Erholung",
    S: "Sonstige Dienstleistungen",
  };
  return labels[nace] || nace;
}

function getISCOLabelEn(isco: string): string {
  const labels: Record<string, string> = {
    "1": "Managers",
    "2": "Professionals",
    "3": "Technicians & associate professionals",
    "4": "Clerical support workers",
    "5": "Service & sales workers",
    "6": "Skilled agriculture & forestry",
    "7": "Craft & related trades",
    "8": "Plant, machine operators & assemblers",
    "9": "Elementary occupations",
  };
  return labels[isco.charAt(0)] || "Other occupations";
}

function getISCOLabelDe(isco: string): string {
  const labels: Record<string, string> = {
    "1": "Führungskräfte",
    "2": "Akademische Berufe",
    "3": "Techniker/innen & assoziierte Berufe",
    "4": "Bürokräfte",
    "5": "Dienstleistungs- & Verkaufsberufe",
    "6": "Land- & Forstwirtschaftliche Fachkräfte",
    "7": "Handwerks- & verwandte Berufe",
    "8": "Anlagen-, Maschinenbedienung & Montage",
    "9": "Hilfsarbeitskräfte",
  };
  return labels[isco.charAt(0)] || "Sonstige Berufe";
}

main();
