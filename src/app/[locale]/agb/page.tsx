import { Card } from "@/components/ui/card";
import { Scale } from "lucide-react";

export default async function AGBPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const de = locale === "de";

  const sections = de ? SECTIONS_DE : SECTIONS_EN;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {de ? "Allgemeine Geschäftsbedingungen" : "Terms and Conditions"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          webconsulting business services gmbh
        </p>
      </div>

      <Card className="p-4 bg-muted/30 text-sm text-muted-foreground leading-relaxed">
        <div className="flex items-start gap-2">
          <Scale className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--webcon-primary)" }} />
          <p>
            {de
              ? "Diese AGB gelten ausschließlich für B2B-Verträge zwischen der webconsulting business services gmbh und Unternehmern bzw. Unternehmen gemäß UGB. Verbrauchergeschäfte finden nicht statt."
              : "These terms apply exclusively to B2B contracts between webconsulting business services gmbh and entrepreneurs or companies under the Austrian Corporate Code (UGB). Consumer sales do not occur."}
          </p>
        </div>
      </Card>

      {sections.map((section, i) => (
        <Card key={i} className="p-5 space-y-3">
          <h2 className="text-base font-bold">{section.title}</h2>
          <ul className="space-y-2">
            {section.items.map((item, j) => (
              <li key={j} className="text-sm text-muted-foreground leading-relaxed list-disc ml-4">
                {item}
              </li>
            ))}
          </ul>
        </Card>
      ))}

      {/* Contact */}
      <Card className="p-4 bg-muted/30 text-sm text-muted-foreground">
        {de ? "AGB-Anfragen richten Sie bitte an: " : "For inquiries about these terms, contact: "}
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

const SECTIONS_DE = [
  {
    title: "1. Geltungsbereich und Vertragsabschluss",
    items: [
      "Kunden bestätigen bei Online-Bestellungen, dass sie als Unternehmer oder im Auftrag von Unternehmen handeln.",
      "Leistungen werden ausschließlich auf Basis dieser AGB, schriftlicher Angebote, Leistungsbeschreibungen und Auftragsbestätigungen erbracht. Abweichende Bedingungen bedürfen der ausdrücklichen schriftlichen Zustimmung.",
      "Verträge kommen durch Klick auf die Bestellschaltfläche zustande. Vorherige Website-Darstellungen sind unverbindlich.",
      "Die Unwirksamkeit einzelner Bestimmungen berührt nicht die Geltung der übrigen AGB.",
    ],
  },
  {
    title: "2. Leistungsumfang und Nutzung",
    items: [
      "Der Leistungsumfang ergibt sich aus Beschreibungen, Angeboten oder Produktdarstellungen.",
      "Die Agentur kann Funktionen weiterentwickeln, ändern oder durch gleichwertige Leistungen ersetzen, ohne den Vertragszweck wesentlich zu beeinträchtigen.",
      "Zugänge sind persönlich bzw. unternehmensspezifisch zu nutzen. Unbefugte Weitergabe ist untersagt.",
      "KI-generierte Ergebnisse dienen als Unterstützung. Kunden bleiben für die Prüfung aller Inhalte auf Richtigkeit, Rechtmäßigkeit und Eignung verantwortlich.",
    ],
  },
  {
    title: "3. Mitwirkungspflichten",
    items: [
      "Kunden müssen erforderliche Informationen, Zugangsdaten und Freigaben zeitnah bereitstellen.",
      "Korrekte Unternehmens- und Rechnungsdaten sind für Abonnements erforderlich.",
      "Änderungen an Rechnungsdaten, Kontakten oder Steuerinformationen sind unverzüglich zu melden.",
      "Kunden tragen die Verantwortung für die Rechtmäßigkeit bereitgestellter Inhalte und Daten.",
    ],
  },
  {
    title: "4. Preise und Zahlung",
    items: [
      "Alle Preise sind Nettopreise zuzüglich der gesetzlichen Umsatzsteuer.",
      "Die Zahlungsabwicklung erfolgt über Polar Software Inc. (Polar.sh) als Merchant of Record.",
      "Reverse Charge kann für innergemeinschaftliche B2B-Leistungen mit gültiger UID gelten.",
      "Zahlungen sind sofort fällig. Bei fehlgeschlagenen Zahlungen kann der Zugang gesperrt werden.",
    ],
  },
  {
    title: "5. Abonnement",
    items: [
      "SaaS-Leistungen werden als laufende Abonnements erbracht.",
      "Abonnements verlängern sich monatlich automatisch, sofern nicht vor Ablauf der Abrechnungsperiode gekündigt wird.",
      "Kündigung erfolgt über Kundenportale oder schriftlich an die Agentur.",
      "Preisänderungen werden mindestens 30 Tage im Voraus angekündigt.",
    ],
  },
  {
    title: "6. Urheberrechte",
    items: [
      "Alle Rechte an Konzepten, Software, Designs, Texten und Arbeitsergebnissen verbleiben bei der Agentur oder den jeweiligen Rechteinhabern.",
      "Nach vollständiger Bezahlung erhalten Kunden ein nicht-exklusives, nicht übertragbares Nutzungsrecht im vereinbarten Umfang.",
      "Weiterverbreitung, Unterlizenzierung oder Nutzung außerhalb des vereinbarten Zwecks bedürfen der ausdrücklichen schriftlichen Zustimmung.",
      "Open-Source- und Drittanbieter-Komponenten unterliegen ihren jeweiligen Lizenzbedingungen.",
    ],
  },
  {
    title: "7. Künstliche Intelligenz und Drittplattformen",
    items: [
      "Der KI-Einsatz erfolgt unter Beachtung geltender Vorschriften, insbesondere des EU AI Act.",
      "KI-generierte Inhalte, Analysen oder Vorschläge können Fehler, Unvollständigkeiten oder Verzerrungen enthalten und ersetzen keine professionelle Prüfung.",
      "Für Inhalte oder wirtschaftlichen Erfolg aus KI, Social Media, Suchmaschinen oder Drittplattformen übernimmt die Agentur keine Garantie.",
    ],
  },
  {
    title: "8. Gewährleistung und Haftung",
    items: [
      "Die Gewährleistungsfrist beträgt sechs Monate ab Leistungserbringung. Mängel sind schriftlich mit Dokumentation anzuzeigen.",
      "Die Haftung für leichte Fahrlässigkeit ist außer bei Personenschäden und zwingenden gesetzlichen Verpflichtungen ausgeschlossen.",
      "Die Haftung ist auf die in den letzten 12 Monaten gezahlte Vergütung begrenzt.",
      "Höhere Gewalt, Cyberangriffe, behördliche Maßnahmen oder Ausfälle von Hosting-/Zahlungs-/KI-Anbietern befreien von Pflichten im entsprechenden Umfang.",
    ],
  },
  {
    title: "9. Datenschutz",
    items: [
      "Die Datenverarbeitung erfolgt nach DSGVO, DSG und der Datenschutzerklärung unter webconsulting.at/datenschutz.",
      "Kunden bestätigen die rechtmäßige Übermittlung von Daten Dritter.",
    ],
  },
  {
    title: "10. Anwendbares Recht und Gerichtsstand",
    items: [
      "Es gilt österreichisches materielles Recht unter Ausschluss der Verweisungsnormen und des UN-Kaufrechts.",
      "Gerichtsstand für Streitigkeiten ist Mattersburg, Österreich.",
      "Erfüllungsort ist der Sitz der Agentur.",
    ],
  },
];

const SECTIONS_EN = [
  {
    title: "1. Scope and Contract Formation",
    items: [
      "Customers confirm they act as entrepreneurs or on behalf of companies when placing online orders.",
      "Services are provided solely based on these terms, written offers, service descriptions, and order confirmations. Deviating conditions require explicit written consent.",
      "Contracts conclude upon clicking the order button online. Previous website representations are non-binding.",
      "Individual invalid provisions do not affect the validity of remaining terms.",
    ],
  },
  {
    title: "2. Scope of Services and Use",
    items: [
      "The scope of services derives from descriptions, offers, or product presentations.",
      "The agency may develop, modify, or replace functions with equivalent services without materially affecting the contract's purpose.",
      "Access must be used personally or company-specific. Unauthorized sharing or misuse is prohibited.",
      "AI-generated results serve as support. Customers remain responsible for reviewing all content for accuracy, legality, and viability.",
    ],
  },
  {
    title: "3. Cooperation Obligations",
    items: [
      "Customers must provide required information, access credentials, and approvals promptly.",
      "Correct company and billing details are necessary for subscriptions.",
      "Changes to billing data, contacts, or tax information must be reported immediately.",
      "Customers bear responsibility for the lawfulness of provided content and data.",
    ],
  },
  {
    title: "4. Prices and Payment",
    items: [
      "All prices are net plus applicable VAT, unless reverse charge or tax exemption applies.",
      "Payment processing occurs via Polar Software Inc. (Polar.sh) as Merchant of Record.",
      "Reverse charge may apply for intra-EU B2B services with valid VAT ID.",
      "Payments are immediately due. The agency may suspend access for failed payments.",
    ],
  },
  {
    title: "5. Subscription",
    items: [
      "SaaS services are provided as ongoing subscriptions.",
      "Subscriptions auto-renew monthly unless canceled before the billing period ends.",
      "Cancellation occurs through customer portals or written notice to the agency.",
      "Price changes receive 30+ days advance notice.",
    ],
  },
  {
    title: "6. Copyright and Usage Rights",
    items: [
      "All rights to concepts, software, designs, texts, and work products remain with the agency or respective rights holders.",
      "Full payment grants customers non-exclusive, non-transferable usage rights within agreed scopes.",
      "Redistribution, sublicensing, or use outside agreed purposes requires explicit written consent.",
      "Open-source and third-party components follow their respective license terms.",
    ],
  },
  {
    title: "7. Artificial Intelligence and Third-Party Platforms",
    items: [
      "AI use complies with applicable regulations, particularly the EU AI Act where relevant.",
      "AI-generated content, analyses, or suggestions may contain errors, incompleteness, or bias and do not replace professional review.",
      "The agency provides no guarantees for content or economic success from AI, social media, search engines, or third-party platforms.",
    ],
  },
  {
    title: "8. Warranty and Liability",
    items: [
      "Warranty periods extend six months from service delivery. Defects require prompt written notice with documentation.",
      "Agency liability for negligence is excluded except for personal injury and mandatory legal obligations.",
      "Liability is capped at the compensation paid over the last 12 months.",
      "Force majeure, cyberattacks, governmental actions, or hosting/payment/AI provider outages suspend obligations proportionately.",
    ],
  },
  {
    title: "9. Data Protection",
    items: [
      "Data processing follows GDPR, the Austrian Data Protection Act (DSG), and the privacy policy at webconsulting.at/datenschutz.",
      "Customers confirm the lawful transmission of third-party data.",
    ],
  },
  {
    title: "10. Applicable Law and Jurisdiction",
    items: [
      "Austrian substantive law applies, excluding conflict-of-laws rules and UN purchase law.",
      "Jurisdiction for disputes lies in Mattersburg, Austria.",
      "Performance location is the agency's registered office.",
    ],
  },
];
