import { Card } from "@/components/ui/card";
import { Building2, Phone, Mail, Globe, MapPin, Scale } from "lucide-react";

export default async function ImpressumPage({
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
          {de ? "Impressum" : "Imprint"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {de
            ? "Angaben gemäß § 5 ECG, § 14 UGB, § 63 GewO, § 25 MedienG"
            : "Information pursuant to § 5 ECG, § 14 UGB, § 63 GewO, § 25 MedienG"}
        </p>
      </div>

      {/* Company info */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" style={{ color: "var(--webcon-primary)" }} />
          <h2 className="text-lg font-bold">webconsulting business services gmbh</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {de ? "Geschäftsführer" : "Managing Director"}
              </h3>
              <p>DI(FH) Kurt Dirnbauer</p>
            </div>

            <div>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {de ? "Rechtsform" : "Legal Form"}
              </h3>
              <p>{de ? "Gesellschaft mit beschränkter Haftung" : "Limited Liability Company (GmbH)"}</p>
            </div>

            <div>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {de ? "Stammkapital" : "Share Capital"}
              </h3>
              <p>EUR 35.000</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                UID
              </h3>
              <p>ATU68140807</p>
            </div>
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                GLN
              </h3>
              <p>9110018113713</p>
            </div>
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                GISA
              </h3>
              <p>10229743</p>
            </div>
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {de ? "Firmenbuchnummer" : "Commercial Register"}
              </h3>
              <p>401904 k · {de ? "Landesgericht Eisenstadt" : "Regional Court Eisenstadt"}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Locations */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: "var(--webcon-primary)" }} />
            <h3 className="font-semibold">
              {de ? "Hauptsitz Mattersburg" : "Headquarters Mattersburg"}
            </h3>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Johann Nepomuk Berger-Straße 7/2/14
              <br />
              A-7210 Mattersburg, Austria
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> +43 2626 20156
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />{" "}
              <a
                href="mailto:office@webconsulting.at"
                className="hover:underline"
                style={{ color: "var(--webcon-primary)" }}
              >
                office@webconsulting.at
              </a>
            </p>
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: "var(--webcon-primary)" }} />
            <h3 className="font-semibold">
              {de ? "Büro Wien" : "Vienna Office"}
            </h3>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Ungargasse 64-66/3/404
              <br />
              A-1030 {de ? "Wien" : "Vienna"}, Austria
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> +43 699 11346402
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />{" "}
              <a
                href="mailto:office@webconsulting.at"
                className="hover:underline"
                style={{ color: "var(--webcon-primary)" }}
              >
                office@webconsulting.at
              </a>
            </p>
          </div>
        </Card>
      </div>

      {/* Copyright & licenses */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5" style={{ color: "var(--webcon-primary)" }} />
          <h2 className="text-lg font-bold">
            {de ? "Urheberrecht & Lizenzen" : "Copyright & licenses"}
          </h2>
        </div>

        <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">
              {de ? "Upstream: Andrej Karpathy (US Job Market Visualizer)" : "Upstream: Andrej Karpathy (US Job Market Visualizer)"}
            </h3>
            <p>
              {de ? (
                <>
                  Das Original{" "}
                  <a
                    href="https://karpathy.ai/jobs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                    style={{ color: "var(--webcon-primary)" }}
                  >
                    US Job Market Visualizer
                  </a>{" "}
                  und das Repository{" "}
                  <a
                    href="https://github.com/karpathy/jobs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                    style={{ color: "var(--webcon-primary)" }}
                  >
                    karpathy/jobs
                  </a>{" "}
                  enthalten zum Stand unserer Prüfung{" "}
                  <strong className="text-foreground">keine LICENSE-Datei</strong> im
                  Root; GitHub weist kein SPDX-Lizenzfeld aus. Es liegt{" "}
                  <strong className="text-foreground">keine allgemeine Nutzungserteilung</strong>{" "}
                  durch uns an Dritte für Karpathys Material vor — Urheber- und
                  Nutzungsrechte verbleiben bei Andrej Karpathy, bis dort eine Lizenz
                  veröffentlicht wird. Wir danken für die Inspiration und verlinken
                  ausdrücklich auf das Original.
                </>
              ) : (
                <>
                  The original{" "}
                  <a
                    href="https://karpathy.ai/jobs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                    style={{ color: "var(--webcon-primary)" }}
                  >
                    US Job Market Visualizer
                  </a>{" "}
                  and the{" "}
                  <a
                    href="https://github.com/karpathy/jobs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                    style={{ color: "var(--webcon-primary)" }}
                  >
                    karpathy/jobs
                  </a>{" "}
                  repository, as of our review, include{" "}
                  <strong className="text-foreground">no LICENSE file</strong> at the
                  repository root; GitHub reports no SPDX license.{" "}
                  <strong className="text-foreground">
                    We do not grant you any rights in Karpathy&apos;s material
                  </strong>
                  — copyright and permissions remain with Andrej Karpathy until a
                  license is published there. We thank him for the inspiration and
                  link prominently to the original work.
                </>
              )}
            </p>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <h3 className="font-semibold text-foreground">
              {de
                ? "Dieses Projekt (Austrian Occupation Exposure Map)"
                : "This project (Austrian Occupation Exposure Map)"}
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">
                  {de ? "Quellcode" : "Source code"}
                </strong>{" "}
                ({de ? "Next.js-App, Skripte in diesem Repository" : "Next.js app, scripts in this repo"}):{" "}
                <a
                  href="https://github.com/dirnbauer/jobs/blob/master/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                  style={{ color: "var(--webcon-primary)" }}
                >
                  MIT License
                </a>{" "}
                ({de ? "siehe Datei" : "see"}{" "}
                <code className="text-xs bg-muted px-1 rounded">LICENSE</code>
                {de ? " im Repository" : " in the repo"}).
              </li>
              <li>
                <strong className="text-foreground">
                  {de ? "Texte & sichtbare Inhalte" : "Text & visible content"}
                </strong>{" "}
                ({de ? "UI-Texte, Impressum, Hilfetexte, wo nicht anders gekennzeichnet" : "UI copy, legal pages, help text where not otherwise marked"}):{" "}
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                  style={{ color: "var(--webcon-primary)" }}
                >
                  Creative Commons Attribution-ShareAlike 4.0 International
                </a>{" "}
                ({de ? "siehe" : "see"}{" "}
                <code className="text-xs bg-muted px-1 rounded">LICENSE-CC-BY-SA-4.0</code>
                ).
              </li>
            </ul>
            <p className="text-xs">
              {de
                ? "Daten Dritter (AMS, Statistik Austria, WKO, Eurostat, WIFO usw.) unterliegen den jeweiligen Nutzungsbedingungen der Anbieter."
                : "Third-party data (AMS, Statistik Austria, WKO, Eurostat, WIFO, etc.) remains subject to each provider’s terms of use."}
            </p>
          </div>
        </div>
      </Card>

      {/* Regulatory */}
      <Card className="p-5 space-y-3">
        <h3 className="font-semibold">
          {de ? "Aufsichtsbehörde & Mitgliedschaften" : "Regulatory & Memberships"}
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong className="text-foreground">
              {de ? "Aufsichtsbehörde" : "Supervisory Authority"}:
            </strong>{" "}
            Bezirkshauptmannschaft Mattersburg
          </p>
          <p>
            <strong className="text-foreground">
              {de ? "Gewerbeberechtigung" : "Trade License"}:
            </strong>{" "}
            {de
              ? "Datenverarbeitung und Informationstechnologie-Dienstleistungen"
              : "Data processing and information technology services"}
          </p>
          <p>
            <strong className="text-foreground">
              {de ? "Kammermitgliedschaft" : "Chamber Membership"}:
            </strong>{" "}
            Wirtschaftskammer Burgenland, {de ? "Fachgruppe" : "Division"} UBIT
          </p>
          <p>
            <strong className="text-foreground">ANKÖ:</strong> 81082
          </p>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Globe className="h-4 w-4" />
        <a
          href="https://webconsulting.at"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: "var(--webcon-primary)" }}
        >
          www.webconsulting.at
        </a>
      </div>
    </div>
  );
}
