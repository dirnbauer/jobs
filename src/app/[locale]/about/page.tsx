import type { Locale } from "@/lib/locale";
import { AboutView } from "@/components/about-view";

export default async function AboutPage({
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
          {de ? "Über dieses Projekt" : "About This Project"}
        </h1>
        <p className="mt-2 text-base text-foreground/75 leading-relaxed max-w-3xl">
          {de
            ? "Hintergrund, Methodik und warum unsere österreichische occupation-first Adaption anders aufgebaut ist."
            : "Background, methodology, and why our Austrian occupation-first adaptation is structured differently."}
        </p>
      </div>
      <AboutView locale={locale} />
    </div>
  );
}
