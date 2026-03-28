import { comparisonData } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import { Card } from "@/components/ui/card";

interface ComparisonViewProps {
  locale: Locale;
}

export function ComparisonView({ locale }: ComparisonViewProps) {
  const de = locale === "de";

  return (
    <div className="space-y-4">
      <Card className="p-4 border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20">
        <div className="flex gap-2">
          <span className="text-amber-600 dark:text-amber-400 text-lg shrink-0">⚠</span>
          <div className="space-y-2 text-base text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground">
              {de
                ? "Wichtiger Hinweis zur Vergleichbarkeit"
                : "Important Note on Comparability"}
            </p>
            <p>
              {de
                ? "Die Arbeitsmarktdaten von Österreich und den USA sind nicht direkt vergleichbar. Die beiden Länder verwenden grundlegend unterschiedliche Erhebungsmethoden, Definitionen und Klassifizierungssysteme:"
                : "Austrian and US labor market data are not directly comparable. The two countries use fundamentally different survey methods, definitions, and classification systems:"}
            </p>
            <ul className="space-y-1 pl-4 text-base">
              <li className="list-disc">
                {de
                  ? "Arbeitslosenquote: Österreich meldet zwei Quoten (AMS-Register: ~8% vs. ILO-Erhebung: ~5,4% Jahresdurchschnitt 2024). Die USA verwenden eine einzige Methodik (BLS/CPS, vergleichbar mit ILO)."
                  : "Unemployment rate: Austria reports two rates (AMS register: ~8% vs ILO survey: ~5.4% 2024 annual average). The US uses a single methodology (BLS/CPS, comparable to ILO)."}
              </li>
              <li className="list-disc">
                {de
                  ? "Gehälter: Österreichische Bruttogehälter beinhalten Sozialversicherungsbeiträge und 13./14. Monatsgehalt (Urlaubs-/Weihnachtsgeld). US-Gehälter beinhalten keine Krankenversicherung, die oft vom Arbeitgeber bezahlt wird."
                  : "Salaries: Austrian gross salaries include social insurance contributions and 13th/14th month bonuses (vacation/Christmas pay). US salaries exclude employer-paid health insurance, a major hidden cost."}
              </li>
              <li className="list-disc">
                {de
                  ? "Branchenklassifikation: Österreich verwendet ÖNACE (EU NACE), die USA verwenden NAICS — die Systeme sind auf Detailebene nicht direkt übertragbar."
                  : "Industry classification: Austria uses ÖNACE (EU NACE), the US uses NAICS — the systems are not directly transferable at the detailed level."}
              </li>
              <li className="list-disc">
                {de
                  ? "Soziale Absicherung: Österreichs universelle Gesundheitsversorgung, gesetzlicher Mindestlohn via KV, 5 Wochen Mindesturlaub und starker Kündigungsschutz machen reine Gehaltsvergleiche irreführend."
                  : "Social safety net: Austria's universal healthcare, collective agreement minimum wages, 5 weeks minimum vacation, and strong dismissal protections make pure salary comparisons misleading."}
              </li>
            </ul>
            <p className="text-base italic">
              {de
                ? "Die folgenden Vergleiche zeigen Größenordnungen und strukturelle Unterschiede — keine exakten Äquivalente. Alle österreichischen Daten stammen aus amtlichen, öffentlich zugänglichen Quellen (Eurostat, Statistik Austria OGD) und sind wissenschaftlich nachprüfbar und reproduzierbar."
                : "The comparisons below show orders of magnitude and structural differences — not exact equivalents. All Austrian data originates from official, publicly accessible sources (Eurostat, Statistik Austria OGD) and is scientifically verifiable and reproducible."}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-3">
        {comparisonData.map((metric) => {
          const atLabel = metric.austria;
          const usLabel = metric.us;
          const maxVal = Math.max(metric.austriaValue, metric.usValue);
          const atPct = maxVal > 0 ? (metric.austriaValue / maxVal) * 100 : 50;
          const usPct = maxVal > 0 ? (metric.usValue / maxVal) * 100 : 50;

          // When the smaller bar is < 8%, show label outside the bar
          const atLabelInside = atPct >= 8;
          const usLabelInside = usPct >= 8;

          // True minimum: just enough to be visible as a sliver (2%)
          const atBarWidth = Math.max(2, atPct);
          const usBarWidth = Math.max(2, usPct);

          return (
            <Card key={metric.key} className="p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-base font-semibold">
                  {de ? metric.labelDe : metric.label}
                </h2>
              </div>

              <div className="space-y-3">
                {/* Austria bar */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center gap-2.5 shrink-0 w-38 sm:w-44">
                    <span
                      className="text-3xl sm:text-4xl leading-none select-none"
                      aria-hidden
                    >
                      🇦🇹
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-foreground leading-tight">
                      {de ? "Österreich" : "Austria"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 h-8 sm:h-9 bg-muted/50 rounded-md overflow-hidden flex items-center">
                    <div
                      className="h-full rounded-md flex items-center px-2 text-xs font-semibold text-white shrink-0"
                      style={{
                        width: `${atBarWidth}%`,
                        backgroundColor: "var(--webcon-primary, #1b7a95)",
                      }}
                    >
                      {atLabelInside ? atLabel : ""}
                    </div>
                    {!atLabelInside && (
                      <span className="ml-2 text-xs font-semibold text-foreground/70">
                        {atLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* US bar */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center gap-2.5 shrink-0 w-38 sm:w-44">
                    <span
                      className="text-3xl sm:text-4xl leading-none select-none"
                      aria-hidden
                    >
                      🇺🇸
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-foreground leading-tight">
                      {de ? "USA" : "United States"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 h-8 sm:h-9 bg-muted/50 rounded-md overflow-hidden flex items-center">
                    <div
                      className="h-full rounded-md flex items-center px-2 text-xs font-semibold text-white shrink-0"
                      style={{
                        width: `${usBarWidth}%`,
                        // indigo-700 — white text clears WCAG AA 4.5:1 (vs ~4.46 on indigo-500)
                        backgroundColor: "#4338ca",
                      }}
                    >
                      {usLabelInside ? usLabel : ""}
                    </div>
                    {!usLabelInside && (
                      <span className="ml-2 text-xs font-semibold text-foreground/70">
                        {usLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                {de ? metric.explanationDe : metric.explanation}
              </p>

              <p className="mt-1 text-[10px] text-muted-foreground">
                {de ? "Quelle" : "Source"}: {metric.source}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
