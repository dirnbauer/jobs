import type { Metadata } from "next";
import { Suspense } from "react";
import HomePageClient from "./home-page-client";
import { buildHomeMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = raw === "de" ? "de" : "en";
  return buildHomeMetadata(locale);
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded-lg max-w-md" />
          <div className="h-40 bg-muted rounded-xl" />
        </div>
      }
    >
      <HomePageClient />
    </Suspense>
  );
}
