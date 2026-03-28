import type { Locale } from "@/lib/locale";
import { SourcesView } from "@/components/sources-view";

export default async function SourcesPage({
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
          {de ? "Datenquellen" : "Data Sources"}
        </h1>
        <p className="mt-2 text-base text-foreground/80 leading-relaxed max-w-3xl">
          {de
            ? "Diese Seite dokumentiert die direkten Produktionsdaten hinter der occupation-first Arbeitsmarktkarte sowie ergänzende Referenzquellen. Alle Primärdaten verlinken direkt auf die offiziellen Dateien."
            : "This page documents the direct production inputs behind the occupation-first labour-market map, plus supporting reference sources. Every primary dataset links straight to the official files."}
        </p>
      </div>
      <SourcesView locale={locale} />
    </div>
  );
}
