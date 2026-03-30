import type { Locale } from "@/lib/locale";
import { VerificationView } from "@/components/verification-view";

export default async function VerificationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = raw === "de" ? "de" : "en";
  const de = locale === "de";

  return (
    <div className="space-y-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {de ? "Datenverifizierung" : "Data Verification"}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-foreground/75 leading-relaxed max-w-2xl">
          {de
            ? "Jede Zahl auf dieser Seite wird gegen Originaldaten von Eurostat und Statistik Austria geprüft. 99 hypothesengetriebene Tests verifizieren Beschäftigung, Gehalt, Berufsstruktur, KI-Exposition und Sektorsummen — automatisch bei jedem Build."
            : "Every figure on this site is checked against original data from Eurostat and Statistics Austria. 99 hypothesis-driven tests verify employment, earnings, occupation structure, AI exposure, and sector totals — automatically on every build."}
        </p>
      </div>
      <div className="mx-auto w-full max-w-4xl">
        <VerificationView locale={locale} />
      </div>
    </div>
  );
}
