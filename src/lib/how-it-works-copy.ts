/**
 * On-page methodology / "how to read" copy (DE + EN).
 * Wording is intentionally distinct from third-party explainers; keep it that way when editing.
 */

export const howItWorksCopy = {
  de: {
    lead: "Diese Darstellung ordnet den Arbeitsmarkt primär nach Berufsgruppen (ISCO-08) und erst sekundär nach Wirtschaftsabschnitten (ÖNACE). Die zentrale Frage lautet: Welche beruflichen Tätigkeitsprofile weisen die höchste technische Substituierbarkeit durch generative KI-Modelle auf? Alle Daten basieren auf amtlichen, öffentlich zugänglichen Quellen; die gesamte Pipeline ist quelloffen und jederzeit reproduzierbar.",
    areaColor:
      "Die Rechteckfläche skaliert proportional zur Erwerbstätigenzahl; die Farbgebung folgt dem jeweils aktivierten Layer. In der Startansicht werden Kacheln nach ISCO-Hauptgruppen (Familien) gebündelt; der ÖNACE-Wirtschaftsabschnitt bleibt als ergänzender Kontext sichtbar.",
    bandsTitle: "KI-Einflussskala (0–10)",
    bandsIntro:
      "Der numerische Wert beschreibt den Anteil typischer Berufsaufgaben, die durch aktuelle generative KI-Modelle (Large Language Models, multimodale Systeme, Code-Generatoren) potenziell substituierbar sind. Es handelt sich um eine qualitative Einschätzung, nicht um eine ökonometrische Messung im Sinne des AI Occupational Exposure Index (Felten et al., 2021).",
    band01: "0–1 Punkte: Kaum digitale Substituierbarkeit. Tätigkeitsprofile mit hohem Anteil physischer Präsenz, manueller Intervention oder unmittelbarer Personenbetreuung (Beispiele: Rettungsdienst, Dachdeckerei, Geburtshilfe).",
    band23: "2–3 Punkte: KI-gestützte Assistenzsysteme einsetzbar; der überwiegende Tätigkeitsanteil erfordert weiterhin manuelle, sensorische oder interpersonelle Kompetenzen (Beispiele: Krankenpflege, Polizeidienst, Sanitär-/Heizungs-/Klimatechnik vor Ort).",
    band45: "4–5 Punkte: Relevanter Anteil routinisierter kognitiver oder administrativer Aufgaben (Beispiele: Unterricht, Einzelhandel, Großküchenproduktion).",
    band67: "6–7 Punkte: Tiefgreifende Umstrukturierung wahrscheinlich; der Personalbedarf entkoppelt sich zunehmend von der Ausbringungsmenge (Beispiele: Lagerlogistik, öffentliche Verwaltung, Fernverkehr).",
    band810: "8–10 Punkte: Der überwiegende Anteil der Kerntätigkeiten ist bereits durch aktuelle Modelle abbildbar (Beispiele: Softwareentwicklung, Finanzbuchhaltung, Übersetzung, Performance-Marketing).",
    dataTitle: "Datengrundlage (berufsbasiert)",
    dataBody:
      "Erwerbstätige: Eurostat lfsa_egai2d (EU-Arbeitskräfteerhebung 2024; für Österreich: Mikrozensus-Arbeitskräfteerhebung). NACE-Sektorbeschäftigung (nama_10_a64_e) dient ausschließlich als proportionale Gewichtung je Berufszeile. Entgelte: Verdienststrukturerhebung 2022 (Statistik Austria, Open Government Data) nach ISCO-08. Ausblick: WIFO/AMS Mittelfristige Beschäftigungsprognose 2023–2030 (Tabellenband, Dez. 2024). KI-Einflusswerte: scripts/generate-occupations.ts → OCCUPATION_DEFS; der Build-Prozess ruft keine LLM-Schnittstelle auf. Bei jeder Regeneration prüfen über 30 automatisierte Tests Beschäftigungssummen, Entgeltplausibilität, ISCO-Konsistenz und KI-Einflussverteilung. Jede Zahl ist auf eine öffentliche Quelle mit Downloadlink rückführbar.",
    outlookTitle: "Ausblick 2023–2030 (WIFO/AMS)",
    outlookBody:
      "Der Ausblickwert basiert auf der WIFO/AMS Mittelfristigen Beschäftigungsprognose 2023–2030 (Tabellenband, Dez. 2024). Für jede Berufsgruppe wird ein gewichteter Durchschnitt aus der NACE-Branchenwachstumsrate (60 %) und der ISCO-Berufsgruppenentwicklung (40 %) berechnet. Das Ergebnis ist die prognostizierte jährliche Beschäftigungsänderung in % p.a. Die Farbskala bildet diesen Wert ab: Grün = Beschäftigungswachstum, Rot = Beschäftigungsrückgang.",
    caveatTitle: "Kein Prognoseinstrument",
    caveatBody:
      "Der KI-Einflussgrad erfasst technische Substituierbarkeit, nicht Arbeitsplatzverlust. Produktivitätssteigerungen können die Nachfrage nach einer Berufsgruppe erhöhen — vgl. Karpathys expliziten Hinweis zur Softwareentwicklung (KI-Einfluss 9/10 bei gleichzeitig steigender Nachfrage). Transparenzhinweis: Der KI-Einflusswert ist eine qualitative Einschätzung. Beschäftigungs-, Entgelt- und Ausblickdaten stammen vollständig aus amtlicher Statistik (Eurostat, Statistik Austria, WIFO/AMS).",
    atTitle: "Österreichischer Kontext",
    atBody:
      "Beherbergung und Gastronomie (ÖNACE I) beschäftigen in Österreich einen überdurchschnittlich hohen Anteil der Erwerbstätigen im EU-Vergleich. Das duale Ausbildungssystem (Lehre) prägt das Fachkräfteangebot. Maschinen- und Fahrzeugbau (ÖNACE C28, C29) sind stark exportorientiert und weisen historisch hohen Automatisierungsdruck auf.",
  },
  en: {
    lead: "This visualisation structures the labour market primarily by occupation group (ISCO-08) and secondarily by economic section (ÖNACE). The central question is: which occupational task profiles exhibit the highest technical substitutability by generative AI models? All data derives from official, publicly accessible sources; the entire pipeline is open-source and fully reproducible.",
    areaColor:
      "Tile area scales proportionally to the number of employed persons; colour follows the currently active layer. On the start page, tiles are grouped by ISCO major groups (families); the ÖNACE economic section remains visible as supplementary context.",
    bandsTitle: "AI impact scale (0–10)",
    bandsIntro:
      "The numerical value describes the proportion of typical occupational tasks that are potentially substitutable by current generative AI models (large language models, multimodal systems, code generators). This is a qualitative assessment, not an econometric measurement in the sense of the AI Occupational Exposure Index (Felten et al., 2021).",
    band01: "0–1 points: Negligible digital substitutability. Task profiles with high physical presence, manual intervention, or direct personal care (examples: emergency medical services, roofing, midwifery).",
    band23: "2–3 points: AI-assisted tools applicable; the predominant share of tasks still requires manual, sensory, or interpersonal competences (examples: nursing, police work, on-site HVAC installation).",
    band45: "4–5 points: Relevant share of routinised cognitive or administrative tasks (examples: teaching, retail trade, industrial kitchen production).",
    band67: "6–7 points: Substantial restructuring probable; staffing requirements increasingly decouple from output volume (examples: warehouse logistics, public administration, long-haul transport).",
    band810: "8–10 points: The predominant share of core tasks is already representable by current models (examples: software development, financial accounting, translation, performance marketing).",
    dataTitle: "Data framework (occupation-based)",
    dataBody:
      "Employed persons: Eurostat lfsa_egai2d (EU Labour Force Survey 2024; for Austria: Mikrozensus-Arbeitskräfteerhebung). NACE sector employment (nama_10_a64_e) serves exclusively as proportional weighting per occupation row. Earnings: Structure of Earnings Survey 2022 (Statistik Austria, Open Government Data) by ISCO-08. Outlook: WIFO/AMS Medium-Term Employment Forecast 2023–2030 (Tabellenband, Dec. 2024). AI impact fields: scripts/generate-occupations.ts → OCCUPATION_DEFS; the build process calls no LLM API. On every regeneration, 30+ automated tests verify employment totals, earnings plausibility, ISCO consistency, and AI impact distribution. Every figure is traceable to a public source with a download link.",
    outlookTitle: "Outlook 2023–2030 (WIFO/AMS)",
    outlookBody:
      "The outlook value is based on the WIFO/AMS Medium-Term Employment Forecast 2023–2030 (Tabellenband, Dec. 2024). For each occupation group, a weighted average of the NACE sector growth rate (60%) and the ISCO occupation group growth rate (40%) is computed. The result is the projected annual employment change in % p.a. The colour scale maps this value: green = employment growth, red = employment decline.",
    caveatTitle: "Not a forecasting instrument",
    caveatBody:
      "The AI impact score captures technical substitutability, not job displacement. Productivity gains can increase demand for an occupation group — cf. Karpathy's explicit caveat on software development (AI impact 9/10 alongside rising demand). Transparency note: the AI impact score is a qualitative assessment. Employment, earnings, and outlook data derive entirely from official statistics (Eurostat, Statistik Austria, WIFO/AMS).",
    atTitle: "Austrian context",
    atBody:
      "Accommodation and food services (ÖNACE I) employ a disproportionately high share of workers in Austria relative to the EU average. The dual apprenticeship system (Lehre) shapes skilled labour supply. Machinery and vehicle manufacturing (ÖNACE C28, C29) are strongly export-oriented and exhibit historically high automation pressure.",
  },
} as const;
