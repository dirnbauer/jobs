import type { Locale } from "@/lib/locale";
import { TestsView } from "@/components/tests-view";

export default async function TestsPage({
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
          {de ? "Datenverifizierung" : "Data Verification"}
        </h1>
        <p className="mt-2 text-base text-foreground/80 leading-relaxed max-w-3xl">
          {de
            ? "Hier laufen automatische Prüfungen gegen Eurostat-Beschäftigung, die Verdienststrukturerhebung (VSE) der Statistik Austria sowie die neue occupation-first Logik rund um ISCO-Familien, Gehälter, KI-Einfluss und ÖNACE-Kontext. So sehen Sie schnell, ob die Kernaussagen des Datensatzes stabil bleiben."
            : "This page runs automated checks against Eurostat employment totals, Statistik Austria VSE earnings, and the new occupation-first logic around ISCO families, pay, AI impact, and ÖNACE context. Use it to verify that the dataset’s core claims still hold."}
        </p>
      </div>
      <TestsView locale={locale} />
    </div>
  );
}
