/**
 * On-page methodology / "how to read" copy (DE + EN).
 * Wording is intentionally distinct from third-party explainers; keep it that way when editing.
 */

export const howItWorksCopy = {
  de: {
    detailsSummary: "Einordnung, Methodik und Lesehilfe",
    lead: "Diese Darstellung ordnet den Arbeitsmarkt primär nach Berufsgruppen (ISCO-08) und erst sekundär nach Wirtschaftsabschnitten (ÖNACE). Die zentrale Frage lautet: Welche beruflichen Tätigkeitsprofile weisen die höchste technische Substituierbarkeit durch generative KI-Modelle auf? Alle Daten basieren auf amtlichen, öffentlich zugänglichen Quellen; die gesamte Pipeline ist quelloffen und jederzeit reproduzierbar.",
    areaColor:
      "Die Rechteckfläche skaliert proportional zur Erwerbstätigenzahl; die Farbgebung folgt dem jeweils aktivierten Layer. In der Startansicht werden Kacheln nach ISCO-Hauptgruppen (Familien) gebündelt; der ÖNACE-Wirtschaftsabschnitt bleibt als ergänzender Kontext sichtbar.",
    bandsTitle: "KI-Expositionsskala (0–10)",
    bandsIntro:
      "Der numerische Wert beschreibt den Anteil typischer Berufsaufgaben, die durch aktuelle generative KI-Modelle (Large Language Models, multimodale Systeme, Code-Generatoren) potenziell substituierbar sind. Es handelt sich um eine qualitative Einschätzung, nicht um eine ökonometrische Messung im Sinne des AI Occupational Exposure Index (Felten et al., 2021).",
    band01: "0–1 Punkte: Kaum digitale Substituierbarkeit. Tätigkeitsprofile mit hohem Anteil physischer Präsenz, manueller Intervention oder unmittelbarer Personenbetreuung (Beispiele: Rettungsdienst, Dachdeckerei, Geburtshilfe).",
    band23: "2–3 Punkte: KI-gestützte Assistenzsysteme einsetzbar; der überwiegende Tätigkeitsanteil erfordert weiterhin manuelle, sensorische oder interpersonelle Kompetenzen (Beispiele: Krankenpflege, Polizeidienst, Sanitär-/Heizungs-/Klimatechnik vor Ort).",
    band45: "4–5 Punkte: Relevanter Anteil routinisierter kognitiver oder administrativer Aufgaben (Beispiele: Unterricht, Einzelhandel, Großküchenproduktion).",
    band67: "6–7 Punkte: Tiefgreifende Umstrukturierung wahrscheinlich; der Personalbedarf entkoppelt sich zunehmend von der Ausbringungsmenge (Beispiele: Lagerlogistik, öffentliche Verwaltung, Fernverkehr).",
    band810: "8–10 Punkte: Der überwiegende Anteil der Kerntätigkeiten ist bereits durch aktuelle Modelle abbildbar (Beispiele: Softwareentwicklung, Finanzbuchhaltung, Übersetzung, Performance-Marketing).",
    dataTitle: "Datengrundlage (berufsbasiert)",
    dataBody:
      "Erwerbstätige: Eurostat lfsa_egai2d (EU-Arbeitskräfteerhebung 2024; für Österreich: Mikrozensus-Arbeitskräfteerhebung). NACE-Sektorbeschäftigung (nama_10_a64_e) dient ausschließlich als proportionale Gewichtung je Berufszeile. Entgelte: Verdienststrukturerhebung 2022 (Statistik Austria, Open Government Data) nach ISCO-08. Der Generator führt beide Ebenen zusammen und exportiert ISCO-Codes, Familienlabels, Berufszeilen und ÖNACE-Kontext. Expositions- und Ausblickfelder: scripts/generate-occupations.ts → OCCUPATION_DEFS; der Build-Prozess ruft keine LLM-Schnittstelle auf. Bei jeder Regeneration prüfen über 30 automatisierte Tests Beschäftigungssummen, Entgeltplausibilität, ISCO-Konsistenz und Expositionsverteilung. Jede Zahl ist auf eine öffentliche Quelle mit Downloadlink rückführbar.",
    caveatTitle: "Kein Prognoseinstrument",
    caveatBody:
      "Der Expositionsgrad erfasst technische Substituierbarkeit, nicht Arbeitsplatzverlust. Produktivitätssteigerungen können die Nachfrage nach einer Berufsgruppe erhöhen — vgl. Karpathys expliziten Hinweis zur Softwareentwicklung (Expositionsgrad 9/10 bei gleichzeitig steigender Nachfrage). Transparenzhinweis: Der Expositionswert und die zugehörige Begründung sind qualitative Einschätzungen — im Unterschied zu den Beschäftigungs- und Entgeltdaten, die vollständig aus amtlicher Statistik stammen.",
    atTitle: "Österreichischer Kontext",
    atBody:
      "Beherbergung und Gastronomie (ÖNACE I) beschäftigen in Österreich einen überdurchschnittlich hohen Anteil der Erwerbstätigen im EU-Vergleich. Das duale Ausbildungssystem (Lehre) prägt das Fachkräfteangebot. Maschinen- und Fahrzeugbau (ÖNACE C28, C29) sind stark exportorientiert und weisen historisch hohen Automatisierungsdruck auf.",
  },
  en: {
    detailsSummary: "Context, methodology and reading guide",
    lead: "This visualisation structures the labour market primarily by occupation group (ISCO-08) and secondarily by economic section (ÖNACE). The central question is: which occupational task profiles exhibit the highest technical substitutability by generative AI models? All data derives from official, publicly accessible sources; the entire pipeline is open-source and fully reproducible.",
    areaColor:
      "Tile area scales proportionally to the number of employed persons; colour follows the currently active layer. On the start page, tiles are grouped by ISCO major groups (families); the ÖNACE economic section remains visible as supplementary context.",
    bandsTitle: "AI exposure scale (0–10)",
    bandsIntro:
      "The numerical value describes the proportion of typical occupational tasks that are potentially substitutable by current generative AI models (large language models, multimodal systems, code generators). This is a qualitative assessment, not an econometric measurement in the sense of the AI Occupational Exposure Index (Felten et al., 2021).",
    band01: "0–1 points: Negligible digital substitutability. Task profiles with high physical presence, manual intervention, or direct personal care (examples: emergency medical services, roofing, midwifery).",
    band23: "2–3 points: AI-assisted tools applicable; the predominant share of tasks still requires manual, sensory, or interpersonal competences (examples: nursing, police work, on-site HVAC installation).",
    band45: "4–5 points: Relevant share of routinised cognitive or administrative tasks (examples: teaching, retail trade, industrial kitchen production).",
    band67: "6–7 points: Substantial restructuring probable; staffing requirements increasingly decouple from output volume (examples: warehouse logistics, public administration, long-haul transport).",
    band810: "8–10 points: The predominant share of core tasks is already representable by current models (examples: software development, financial accounting, translation, performance marketing).",
    dataTitle: "Data framework (occupation-based)",
    dataBody:
      "Employed persons: Eurostat lfsa_egai2d (EU Labour Force Survey 2024; for Austria: Mikrozensus-Arbeitskräfteerhebung). NACE sector employment (nama_10_a64_e) serves exclusively as proportional weighting per occupation row. Earnings: Structure of Earnings Survey 2022 (Statistik Austria, Open Government Data) by ISCO-08. The generator merges both layers and exports ISCO codes, family labels, occupation rows, and ÖNACE context. Exposure and outlook fields: scripts/generate-occupations.ts → OCCUPATION_DEFS; the build process calls no LLM API. On every regeneration, 30+ automated tests verify employment totals, earnings plausibility, ISCO consistency, and exposure distribution. Every figure is traceable to a public source with a download link.",
    caveatTitle: "Not a forecasting instrument",
    caveatBody:
      "The exposure score captures technical substitutability, not job displacement. Productivity gains can increase demand for an occupation group — cf. Karpathy's explicit caveat on software development (exposure 9/10 alongside rising demand). Transparency note: the exposure score and its rationale are qualitative assessments — unlike the employment and earnings data, which derive entirely from official statistics.",
    atTitle: "Austrian context",
    atBody:
      "Accommodation and food services (ÖNACE I) employ a disproportionately high share of workers in Austria relative to the EU average. The dual apprenticeship system (Lehre) shapes skilled labour supply. Machinery and vehicle manufacturing (ÖNACE C28, C29) are strongly export-oriented and exhibit historically high automation pressure.",
  },
} as const;
