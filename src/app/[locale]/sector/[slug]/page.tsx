import { redirect } from "next/navigation";
import { ONACE_BRANCHES } from "@/lib/onace-branches";

export function generateStaticParams() {
  return ONACE_BRANCHES.map((b) => ({ slug: b.slug }));
}

export default async function SectorRedirectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  redirect(`/${locale}/branche/${slug}`);
}
