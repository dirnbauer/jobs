import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LocaleProvider } from "@/lib/locale-context";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import type { Locale } from "@/lib/locale";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "de" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (raw !== "en" && raw !== "de") {
    notFound();
  }
  const locale: Locale = raw;

  return (
    <LocaleProvider initialLocale={locale}>
      <Suspense
        fallback={<div className="sticky top-0 z-50 h-14 w-full border-b border-border bg-background/80" />}
      >
        <Navbar />
      </Suspense>
      <main className="flex-1 mx-auto max-w-[1400px] w-full px-4 py-6 sm:py-8">
        {children}
      </main>
      <SiteFooter />
    </LocaleProvider>
  );
}
