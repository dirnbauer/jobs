import type { Metadata } from "next";
import type { Locale } from "@/lib/locale";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://jobs.karpathy.webconsulting.at";

export const SITE_NAME: Record<Locale, string> = {
  en: "Job Radar Austria",
  de: "BerufsRadar",
};

const TITLE_SUFFIX: Record<Locale, string> = {
  en: SITE_NAME.en,
  de: SITE_NAME.de,
};

function pageTitle(segment: string, locale: Locale): string {
  return `${segment} — ${TITLE_SUFFIX[locale]}`;
}

type SeoPage =
  | "home"
  | "about"
  | "verification"
  | "comparison"
  | "datenschutz"
  | "impressum"
  | "agb";

const PAGE_PATH: Record<Exclude<SeoPage, "home">, `/${string}`> = {
  about: "/about",
  verification: "/verification",
  comparison: "/comparison",
  datenschutz: "/datenschutz",
  impressum: "/impressum",
  agb: "/agb",
};

/** Per-page SEO copy (EN + DE) for metadata and OG. */
export const PAGE_SEO: Record<
  SeoPage,
  Record<Locale, { title: string; description: string; ogDescription: string }>
> = {
  home: {
    en: {
      title: "Job Radar Austria",
      description:
        "Occupation-first map of the Austrian labour market: ISCO groups, AI impact, pay, outlook, and sector context from Eurostat plus Statistik Austria.",
      ogDescription:
        "Occupation-first Austrian labour market map with ISCO families, AI impact, and ÖNACE context.",
    },
    de: {
      title: "BerufsRadar",
      description:
        "Occupation-first Karte des österreichischen Arbeitsmarkts: ISCO-Gruppen, KI-Einfluss, Entgelt, Ausblick und Sektor-Kontext aus Eurostat plus Statistik Austria.",
      ogDescription:
        "Occupation-first Karte des Arbeitsmarkts mit ISCO-Familien, KI-Einfluss und ÖNACE-Kontext.",
    },
  },
  about: {
    en: {
      title: "About This Project",
      description:
        "Background, methodology, data sources, and data verification for the Austrian occupation-first labour market map.",
      ogDescription:
        "Original by Karpathy; Austrian adaptation by webconsulting.at — background, sources, and verification.",
    },
    de: {
      title: "Über dieses Projekt",
      description:
        "Hintergrund, Methodik, Datenquellen und Datenverifizierung der österreichischen berufsbasierten Arbeitsmarktkarte.",
      ogDescription:
        "Original von Karpathy; österreichische Adaption von webconsulting.at — Hintergrund, Quellen und Verifikation.",
    },
  },
  verification: {
    en: {
      title: "Data Verification",
      description:
        "99 hypothesis-driven tests validate employment, earnings, ISCO structure, AI exposure, and sector totals against Eurostat and Statistik Austria source data.",
      ogDescription:
        "99 scientific tests verify Austrian labour market data against Eurostat and VSE sources.",
    },
    de: {
      title: "Datenverifizierung",
      description:
        "99 hypothesengetriebene Tests validieren Beschäftigung, Gehalt, ISCO-Struktur, KI-Exposition und Sektorsummen gegen Eurostat- und Statistik-Austria-Quelldaten.",
      ogDescription:
        "99 wissenschaftliche Tests verifizieren österreichische Arbeitsmarktdaten gegen Eurostat- und VSE-Quellen.",
    },
  },
  comparison: {
    en: {
      title: "AT vs US Comparison",
      description:
        "Side-by-side comparison of key labor market metrics between Austria and the United States.",
      ogDescription:
        "Compare Austria and US labor market indicators in one view.",
    },
    de: {
      title: "AT vs US Vergleich",
      description:
        "Gegenüberstellung wichtiger Arbeitsmarkt-Kennzahlen zwischen Österreich und den USA.",
      ogDescription:
        "Österreich und USA im direkten Arbeitsmarktvergleich.",
    },
  },
  datenschutz: {
    en: {
      title: "Privacy Policy",
      description:
        "Privacy information for the Austrian AI impact map (jobs.karpathy.webconsulting.at).",
      ogDescription:
        "Privacy policy and data protection notes for this visualization tool.",
    },
    de: {
      title: "Datenschutzerklärung",
      description:
        "Datenschutzinformationen zur österreichischen KI-Einflusskarte (jobs.karpathy.webconsulting.at).",
      ogDescription:
        "Datenschutzerklärung und Hinweise zum Visualisierungstool.",
    },
  },
  impressum: {
    en: {
      title: "Imprint",
      description:
        "Legal disclosure and contact information for webconsulting business services gmbh (Austria).",
      ogDescription:
        "Imprint and company details for webconsulting business services gmbh.",
    },
    de: {
      title: "Impressum",
      description:
        "Rechtliche Angaben und Kontaktinformationen der webconsulting business services gmbh (Österreich).",
      ogDescription:
        "Impressum und Unternehmensangaben der webconsulting business services gmbh.",
    },
  },
  agb: {
    en: {
      title: "Terms and Conditions",
      description:
        "General terms and conditions (B2B) for webconsulting business services gmbh.",
      ogDescription:
        "AGB der webconsulting business services gmbh (B2B).",
    },
    de: {
      title: "Allgemeine Geschäftsbedingungen",
      description:
        "Allgemeine Geschäftsbedingungen (B2B) der webconsulting business services gmbh.",
      ogDescription:
        "AGB der webconsulting business services gmbh (B2B).",
    },
  },
};

function ogImageUrl(title: string) {
  return `/api/og?title=${encodeURIComponent(title)}`;
}

function absoluteUrl(locale: Locale, pathSuffix: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/${locale}${pathSuffix}`;
}

function alternates(locale: Locale, pathSuffix: string): Metadata["alternates"] {
  return {
    canonical: absoluteUrl(locale, pathSuffix),
    languages: {
      en: absoluteUrl("en", pathSuffix),
      de: absoluteUrl("de", pathSuffix),
    },
  };
}

function openGraphTwitter(
  locale: Locale,
  pathSuffix: string,
  title: string,
  ogDescription: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  const canonical = absoluteUrl(locale, pathSuffix);
  const img = ogImageUrl(title);
  return {
    openGraph: {
      title,
      description: ogDescription,
      url: canonical,
      siteName: SITE_NAME[locale],
      locale: locale === "de" ? "de_AT" : "en_US",
      type: "website",
      images: [
        {
          url: img,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ogDescription,
      images: [img],
    },
  };
}

/** Home route (`/[locale]`). */
export function buildHomeMetadata(locale: Locale): Metadata {
  const p = PAGE_SEO.home[locale];
  const t = pageTitle(p.title, locale);
  return {
    title: t,
    description: p.description,
    alternates: alternates(locale, ""),
    ...openGraphTwitter(locale, "", p.title, p.ogDescription),
  };
}

/** Nested routes under `[locale]`. */
export function buildSubpageMetadata(locale: Locale, page: Exclude<SeoPage, "home">): Metadata {
  const p = PAGE_SEO[page][locale];
  const suffix = PAGE_PATH[page];
  return {
    title: pageTitle(p.title, locale),
    description: p.description,
    alternates: alternates(locale, suffix),
    ...openGraphTwitter(locale, suffix, p.title, p.ogDescription),
  };
}

/**
 * Dynamic data-driven pages (family, beruf, branche).
 * Provides full OG image, twitter card, and alternates support.
 */
export function buildDynamicPageMetadata(
  locale: Locale,
  pathSuffix: string,
  title: string,
  description: string,
): Metadata {
  const fullTitle = pageTitle(title, locale);
  return {
    title: fullTitle,
    description,
    alternates: alternates(locale, pathSuffix),
    ...openGraphTwitter(locale, pathSuffix, title, description),
  };
}
