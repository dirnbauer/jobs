import type { Locale } from "@/lib/locale";
import { ComparisonView } from "@/components/comparison-view";

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = raw === "de" ? "de" : "en";
  const de = locale === "de";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {de ? "Österreich vs. USA" : "Austria vs. United States"}
        </h1>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed max-w-3xl">
          {de
            ? "Gegenüberstellung wichtiger Arbeitsmarkt-Kennzahlen zwischen Österreich und den USA."
            : "Side-by-side comparison of key labor market metrics between Austria and the United States."}
        </p>
      </div>
      <ComparisonView locale={locale} />
    </div>
  );
}
