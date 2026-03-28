import { redirect } from "next/navigation";
import { austrianOccupations } from "@/lib/data";

export function generateStaticParams() {
  return austrianOccupations.map((o) => ({ slug: o.slug }));
}

export default async function OccupationRedirectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  redirect(`/${locale}/beruf/${slug}`);
}
