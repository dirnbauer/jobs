import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const de = locale === "de";

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {de ? "Datenschutzerklärung" : "Privacy Policy"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {de ? "Zuletzt aktualisiert: Dezember 2025" : "Last updated: December 2025"}
        </p>
      </div>

      {/* Overview */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" style={{ color: "var(--webcon-primary)" }} />
          <h2 className="text-lg font-bold">
            {de ? "Datenschutz auf einen Blick" : "Data Protection at a Glance"}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {de
            ? "Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Diese Website ist ein nicht-kommerzielles Open-Source-Visualisierungstool für österreichische Arbeitsmarktdaten."
            : "The following notes give a simple overview of what happens to your personal data when you visit this website. This website is a non-commercial open-source visualization tool for Austrian labor market data."}
        </p>
      </Card>

      {/* Responsible entity */}
      <Section
        title={de ? "Verantwortliche Stelle" : "Responsible Entity"}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          webconsulting business services gmbh
          <br />
          Johann Nepomuk Berger-Straße 7/2/14
          <br />
          7210 Mattersburg, Austria
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {de ? "Telefon" : "Phone"}: +43 2626 20156
          <br />
          E-Mail:{" "}
          <a
            href="mailto:office@webconsulting.at"
            className="hover:underline"
            style={{ color: "var(--webcon-primary)" }}
          >
            office@webconsulting.at
          </a>
        </p>
      </Section>

      {/* Legal basis */}
      <Section
        title={de ? "Rechtsgrundlagen" : "Legal Basis"}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {de
            ? "Die Datenverarbeitung erfolgt auf Grundlage der DSGVO, des österreichischen Datenschutzgesetzes (DSG) und des Telekommunikationsgesetzes (TKG). Anwendbare Artikel:"
            : "Processing follows GDPR, the Austrian Data Protection Act (DSG), and the Telecommunications Act (TKG). Applicable articles:"}
        </p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground pl-4">
          <li className="list-disc">
            Art. 6(1)(a) DSGVO — {de ? "Einwilligung" : "Consent"}
          </li>
          <li className="list-disc">
            Art. 6(1)(b) DSGVO — {de ? "Vertragserfüllung" : "Contract fulfillment"}
          </li>
          <li className="list-disc">
            Art. 6(1)(c) DSGVO — {de ? "Rechtliche Verpflichtung" : "Legal obligation"}
          </li>
          <li className="list-disc">
            Art. 6(1)(f) DSGVO — {de ? "Berechtigtes Interesse" : "Legitimate interest"}
          </li>
        </ul>
      </Section>

      {/* Data collection */}
      <Section
        title={de ? "Datenerfassung auf dieser Website" : "Data Collection on This Website"}
      >
        <h4 className="font-semibold text-sm mb-1">Cookies</h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {de
            ? "Diese Website verwendet nur technisch notwendige Cookies (Theme-Präferenz: hell/dunkel). Es werden keine Tracking- oder Marketing-Cookies gesetzt."
            : "This website only uses technically necessary cookies (theme preference: light/dark). No tracking or marketing cookies are set."}
        </p>

        <h4 className="font-semibold text-sm mb-1">
          {de ? "Server-Protokolle" : "Server Logs"}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {de
            ? "Der Hosting-Anbieter (Vercel) erfasst automatisch: Browsertyp und -version, Betriebssystem, Referrer-URL, Hostname, Zeitpunkt der Anfrage und IP-Adresse. Die maximale Speicherdauer beträgt 30 Tage."
            : "The hosting provider (Vercel) automatically collects: browser type and version, operating system, referrer URL, hostname, request time, and IP address. Maximum storage duration is 30 days."}
        </p>

        <h4 className="font-semibold text-sm mb-1">
          {de ? "Hosting" : "Hosting"}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {de
            ? "Diese Website wird von Vercel Inc. gehostet (EU-Region: Frankfurt). Vercel speichert technische Zugriffsdaten (IP, Zeitstempel) gemäß deren Datenschutzrichtlinie."
            : "This website is hosted by Vercel Inc. (EU region: Frankfurt). Vercel stores technical access data (IP, timestamp) per their privacy policy."}
        </p>
      </Section>

      {/* No personal data */}
      <Section
        title={de ? "Keine personenbezogene Datenverarbeitung" : "No Personal Data Processing"}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {de
            ? "Diese Website verarbeitet keine personenbezogenen Daten über die oben genannten Server-Protokolle hinaus. Es gibt keine Benutzerkonten, keine Formulare, keine Newsletter-Anmeldungen und keine Analysedienste Dritter. Alle angezeigten Arbeitsmarktdaten stammen aus öffentlichen Quellen (AMS, Statistik Austria, WKO) und enthalten keine personenbezogenen Informationen."
            : "This website does not process personal data beyond the server logs mentioned above. There are no user accounts, no forms, no newsletter signups, and no third-party analytics. All displayed labor market data comes from public sources (AMS, Statistik Austria, WKO) and contains no personal information."}
        </p>
      </Section>

      {/* SSL */}
      <Section
        title={de ? "SSL/TLS-Verschlüsselung" : "SSL/TLS Encryption"}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {de
            ? "Diese Seite verwendet SSL- bzw. TLS-Verschlüsselung zur Sicherheit der Datenübertragung."
            : "This page uses SSL/TLS encryption for security of transmitted content."}
        </p>
      </Section>

      {/* Your rights */}
      <Section
        title={de ? "Ihre Rechte" : "Your Rights"}
      >
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="list-disc ml-4">
            <strong className="text-foreground">
              {de ? "Auskunftsrecht" : "Right to Access"} (Art. 15 DSGVO)
            </strong>
            {" — "}
            {de
              ? "Bestätigung der Verarbeitung und Zugang zu personenbezogenen Daten"
              : "Confirmation of processing and access to personal data"}
          </li>
          <li className="list-disc ml-4">
            <strong className="text-foreground">
              {de ? "Berichtigungsrecht" : "Right to Correction"} (Art. 16 DSGVO)
            </strong>
            {" — "}
            {de
              ? "Berichtigung unrichtiger personenbezogener Daten"
              : "Correction of inaccurate personal data"}
          </li>
          <li className="list-disc ml-4">
            <strong className="text-foreground">
              {de ? "Löschungsrecht" : "Right to Erasure"} (Art. 17 DSGVO)
            </strong>
            {" — "}
            {de
              ? "Löschung, wenn keine Aufbewahrungspflichten bestehen"
              : "Deletion if no retention obligations apply"}
          </li>
          <li className="list-disc ml-4">
            <strong className="text-foreground">
              {de ? "Recht auf Einschränkung" : "Right to Restrict"} (Art. 18 DSGVO)
            </strong>
            {" — "}
            {de
              ? "Einschränkung der Verarbeitung unter bestimmten Bedingungen"
              : "Restrict processing under certain conditions"}
          </li>
          <li className="list-disc ml-4">
            <strong className="text-foreground">
              {de ? "Recht auf Datenübertragbarkeit" : "Right to Portability"} (Art. 20 DSGVO)
            </strong>
            {" — "}
            {de
              ? "Daten in strukturiertem, maschinenlesbarem Format erhalten"
              : "Receive data in structured, machine-readable format"}
          </li>
          <li className="list-disc ml-4">
            <strong className="text-foreground">
              {de ? "Widerspruchsrecht" : "Right to Object"} (Art. 21 DSGVO)
            </strong>
            {" — "}
            {de
              ? "Widerspruch gegen Verarbeitung nach Art. 6(1)(e)-(f)"
              : "Object to processing based on Art. 6(1)(e)-(f)"}
          </li>
        </ul>
      </Section>

      {/* Supervisory authority */}
      <Section
        title={de ? "Aufsichtsbehörde" : "Supervisory Authority"}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {de ? "Österreichische Datenschutzbehörde" : "Austrian Data Protection Authority"}
          <br />
          Barichgasse 40-42, 1030 {de ? "Wien" : "Vienna"}
          <br />
          <a
            href="mailto:dsb@dsb.gv.at"
            className="hover:underline"
            style={{ color: "var(--webcon-primary)" }}
          >
            dsb@dsb.gv.at
          </a>{" "}
          · +43 1 52 152-0
        </p>
      </Section>

      {/* Contact */}
      <Card className="p-4 bg-muted/30 text-sm text-muted-foreground">
        {de
          ? "Anfragen zum Datenschutz richten Sie bitte an: "
          : "For data subject requests, contact: "}
        <a
          href="mailto:office@webconsulting.at"
          className="font-medium hover:underline"
          style={{ color: "var(--webcon-primary)" }}
        >
          office@webconsulting.at
        </a>
      </Card>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5 space-y-3">
      <h2 className="text-base font-bold">{title}</h2>
      {children}
    </Card>
  );
}
