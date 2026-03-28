import type { Locale } from "@/lib/locale";
import { Card } from "@/components/ui/card";

interface AboutViewProps {
  locale: Locale;
}

export function AboutView({ locale }: AboutViewProps) {
  const de = locale === "de";

  if (de) return <AboutDe />;
  return <AboutEn />;
}

function AboutEn() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="text-base text-foreground/70 leading-relaxed">
        Methodische Dokumentation der österreichischen Adaptation: Übernahmen aus der US-Originalversion,
        lokale Datenersetzungen sowie die Struktur des berufsbasierten Datensatzes,
        der Routenarchitektur und der Methodik. Alle quantitativen Daten stammen aus amtlichen, öffentlich
        zugänglichen Quellen und sind wissenschaftlich nachprüfbar — die gesamte Generierungspipeline ist
        quelloffen und jederzeit reproduzierbar.
      </div>

      {/* ── Austrian Adaptation ──────────────────────────────────────── */}
      <Card className="p-5 space-y-3 border-(--webcon-primary,#1b7a95)/30 bg-(--webcon-primary,#1b7a95)/5">
        <h2 className="text-base font-bold">Austrian Adaptation: Data Sources and Architecture</h2>
        <p className="text-base leading-relaxed text-foreground/80 border-b border-border/50 pb-3">
          <strong className="text-foreground">Andrej Karpathy</strong> developed the{" "}
          <strong className="text-foreground">US Job Market Visualizer</strong> — treemap visualisation, data pipeline, and
          exposure scoring rubric are <em>his</em> work. This page documents the Austrian adaptation:
          local data sources, occupation-based navigation, bilingual interface, and the ISCO-08-based structure
          built on top of that original foundation.
        </p>
        <p className="text-base leading-relaxed text-foreground/70">
          All data sources were replaced with official Austrian and European Union statistics:
        </p>
        <ul className="space-y-1.5 text-base leading-relaxed text-foreground/70 pl-4">
          <li className="list-disc">
            <strong className="text-foreground">Employment data</strong> → Eurostat lfsa_egai2d (EU Labour Force Survey; for Austria: Mikrozensus-Arbeitskräfteerhebung) by ISCO-08 (2-digit), with proportional NACE weighting from nama_10_a64_e — replacing US Bureau of Labor Statistics
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Salary data</strong> → Statistik Austria Structure of Earnings Survey 2022 (Verdienststrukturerhebung, VSE) — replacing BLS median pay
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Industry classification</strong> → ÖNACE 2025 (Austrian implementation of NACE Rev. 2.1) — replacing Standard Occupational Classification (SOC)
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Occupation mapping</strong> → ISCO-08 occupation groups (2-digit) — replacing BLS detailed occupations
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Information architecture</strong> → occupation-based via ISCO-08 major groups (families), with ÖNACE economic sections retained as sectoral context
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Route model</strong> → dedicated routes for occupation (/beruf), family (/family), and sector (/branche) — replacing the sector-first navigation
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Salaries</strong> → EUR gross annual earnings including 13th and 14th month salary — replacing USD
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Education levels</strong> → Austrian qualification structure (Pflichtschule, Lehrabschluss, BMS, Matura, Kolleg, Bachelor, Master/Diplom, Doktorat)
          </li>
          <li className="list-disc">
            <strong className="text-foreground">AI exposure &amp; outlook</strong> →{" "}
            Qualitatively assessed for Austrian occupation groups using a <strong>Karpathy-compatible scoring rubric</strong>
            (0–10 exposure, –10 to +10 outlook), scored for local occupation profiles and Austrian
            sectoral context; methodology detailed below.
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Reproducibility</strong> → All source data is freely downloadable as Open Government Data. The generation pipeline (scripts/generate-occupations.ts) is deterministic: identical inputs produce identical outputs. 30+ automated integrity tests verify the dataset on every regeneration. No LLM API call at build time.
          </li>
        </ul>
        <p className="text-base text-foreground/60 leading-relaxed mt-2 border-t border-border/40 pt-2">
          <strong className="text-foreground/75">ÖNACE:</strong>{" "}
          ÖNACE 2025 serves as the sectoral context layer, not the primary analytical unit. The VSE 2022
          earnings survey was still collected under ÖNACE 2008 (NACE Rev.2) sector codes
          (Statistik Austria&apos;s open data files, e.g.{" "}
          <code className="text-[10px] bg-muted px-1 rounded">C-ONVE10-0</code>, reference that
          revision). Current A–S section labels are shown for orientation, while the
          occupation-based analysis operates on ISCO-08 groups and major groups.
        </p>
        <div className="space-y-2 text-base leading-relaxed text-foreground/70 border-t border-border/60 pt-3 mt-3">
          <h3 className="font-semibold text-foreground text-base">
            Generation of AI exposure and outlook scores (pipeline documentation)
          </h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong className="text-foreground">Source of truth:</strong>{" "}
              <code className="text-xs bg-muted px-1 rounded">scripts/generate-occupations.ts</code>{" "}
              → array <code className="text-xs bg-muted px-1 rounded">OCCUPATION_DEFS</code>. Each
              occupation row sets <code className="text-xs bg-muted px-1 rounded">exposure</code>{" "}
              (integer 0–10), <code className="text-xs bg-muted px-1 rounded">exposureRationale</code>{" "}
              (EN/DE), <code className="text-xs bg-muted px-1 rounded">outlook</code>{" "}
              (integer –10…+10), and <code className="text-xs bg-muted px-1 rounded">outlookDesc</code>{" "}
              (short tier label, e.g. &quot;Slow growth&quot;).
            </li>
            <li>
              <strong className="text-foreground">Rubric (Karpathy-aligned):</strong> exposure
              quantifies the share of occupational tasks that are cognitive, digital, or susceptible to substitution by current large language models and multimodal AI systems—<em>not</em> an empirically measured labour-market outcome (unlike the AI Occupational Exposure Index by Felten et al., 2021). High exposure does not imply job displacement (cf. Karpathy&apos;s
              explicit caveat on software developers). Outlook is a <em>qualitative</em> demand signal for the
              aggregated occupation group, informed by sectoral structure and labour-market discourse—not a
              statistical forecast.
            </li>
            <li>
              <strong className="text-foreground">Regeneration:</strong> running{" "}
              <code className="text-xs bg-muted px-1 rounded">npm run generate:occupations</code>{" "}
              recomputes employment and pay from Eurostat + Statistik Austria CSVs embedded in{" "}
              <code className="text-xs bg-muted px-1 rounded">src/lib/real-data.ts</code>, then writes{" "}
              <code className="text-xs bg-muted px-1 rounded">src/lib/data.ts</code>. Base exposure/outlook
              come from <code className="text-xs bg-muted px-1 rounded">OCCUPATION_DEFS</code>.{" "}
              <code className="text-xs bg-muted px-1 rounded">npm run build</code> does <strong>not</strong>{" "}
              call any LLM API. The pipeline is fully deterministic: identical source CSVs produce
              identical output — every data point is traceable to a specific Eurostat or Statistik Austria
              download URL.
            </li>
            <li>
              <strong className="text-foreground">Automated verification:</strong>{" "}
              30+ integrity checks (employment totals, pay plausibility, ISCO consistency, exposure
              distribution) run on every regeneration. Results are visible under the Tests tab.
            </li>
            <li>
              <strong className="text-foreground">Optional LLM re-scoring (like Karpathy&apos;s pipeline):</strong>{" "}
              <code className="text-xs bg-muted px-1 rounded">npm run score:exposure-llm</code> (with{" "}
              <code className="text-xs bg-muted px-1 rounded">OPENROUTER_API_KEY</code> set) calls OpenRouter
              with a frozen rubric + temperature 0.2 and writes{" "}
              <code className="text-xs bg-muted px-1 rounded">scripts/llm-exposure-overrides.json</code>.{" "}
              The generator merges those over <code className="text-xs bg-muted px-1 rounded">OCCUPATION_DEFS</code>{" "}
              for <code className="text-xs bg-muted px-1 rounded">exposure</code> and{" "}
              <code className="text-xs bg-muted px-1 rounded">exposureRationale</code> only—then run{" "}
              <code className="text-xs bg-muted px-1 rounded">npm run generate:occupations</code> again.
            </li>
          </ol>
        </div>
        <p className="text-base leading-relaxed text-foreground/70">
          Technical implementation: Next.js, TypeScript, shadcn/ui, and the
          webconsulting design system. Features added beyond the US original: occupation detail pages, ISCO major group
          overviews, ÖNACE sector context pages, an Austria-vs-US structural comparison, a bilingual interface (German/English),
          and a comprehensive automated test suite that verifies data integrity on every build. The entire codebase — including
          all source data, the generation pipeline, and the verification tests — is open and reproducible.
        </p>
      </Card>

      {/* ── Section 1: What Karpathy Built ──────────────────────────── */}
      <Card className="p-5 space-y-3">
        <h2 className="text-base font-bold">What Karpathy Built</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          In March 2026, <strong className="text-foreground">Andrej Karpathy</strong> — former
          Director of AI at Tesla, founding member of OpenAI, and one of the most
          cited researchers in deep learning — published an open-source tool that
          scrapes, parses, and visualizes all 342 occupations from the U.S.
          Bureau of Labor Statistics Occupational Outlook Handbook. The
          visualization is a squarified treemap in which each rectangle&apos;s{" "}
          <em>area</em> is proportional to total employment and its <em>color</em>{" "}
          encodes a selected metric: BLS projected growth, median pay, education
          requirements, or — most controversially — an LLM-generated &quot;Digital AI
          Exposure&quot; score on a 0–10 scale.
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          The tool covers <strong className="text-foreground">143 million jobs</strong> and{" "}
          <strong className="text-foreground">$8.9 trillion</strong> in annual wages. It is deliberately
          not a paper, not a policy recommendation, and not a forecast — it is,
          in Karpathy&apos;s own words, &quot;a development tool for exploring BLS data
          visually.&quot;
        </p>
      </Card>

      {/* ── Section 2: Why It Generated Intense Discussion ──────────── */}
      <Card className="p-5 space-y-4">
        <h2 className="text-base font-bold">
          Why It Generated Intense Public Discourse
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          The project&apos;s viral reception across technology, economics, and policy
          communities can be attributed to five intersecting factors, each
          grounded in established communication and behavioral science
          frameworks:
        </p>

        <div className="space-y-4">
          {/* Factor 1 */}
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold">
              1. Source Credibility and Epistemic Authority
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Hovland, Janis & Kelley&apos;s <em>source credibility model</em> (1953)
              demonstrates that message persuasiveness depends heavily on the
              perceived expertise and trustworthiness of its source. Karpathy
              occupies a rare position: he is both a leading technical
              practitioner (having built production AI systems at Tesla and
              OpenAI) and a widely-followed public communicator (3M+ YouTube
              subscribers for his neural network lectures). When an insider of
              this caliber publishes an AI exposure map of the labor market, the
              signal carries qualitatively different weight than equivalent
              analysis from a consultancy or think tank. The implicit message —
              &quot;I build these systems, and here is how they map onto your job&quot; —
              creates a persuasive force that institutional reports cannot
              replicate.
            </p>
          </div>

          {/* Factor 2 */}
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold">
              2. Concretization of Abstract Risk
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Research in risk communication (Slovic, 2000; Kahneman &
              Tversky&apos;s prospect theory, 1979) consistently shows that humans
              underweight statistical probabilities but overweight vivid,
              personally relevant information. Prior AI labor impact studies —
              Frey & Osborne (2017), Acemoglu & Restrepo (2020), Eloundou et al.
              (2023) — quantified exposure at the aggregate level (&quot;47% of US
              jobs at risk&quot;, &quot;80% of workers affected by GPTs&quot;). Karpathy&apos;s
              treemap does something fundamentally different: it makes each
              occupation individually visible, sized by employment, and colored
              by exposure. A nurse can find &quot;Registered Nurses&quot; on the map, see
              its moderate green color (score 4/10), compare it to the deep red
              of &quot;Software Developers&quot; (9/10), and understand the relative
              positioning instantly. This <em>concretization effect</em> — transforming
              aggregate statistics into personally identifiable visual
              representations — is why the tool triggered emotional responses
              that no academic paper had achieved.
            </p>
          </div>

          {/* Factor 3 */}
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold">
              3. The Nuance Paradox: Exposure ≠ Displacement
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Karpathy explicitly stated that a high AI exposure score &quot;does not
              predict that a job will disappear&quot; and that &quot;software developers
              score 9/10 because AI is transforming their work — but demand for
              software could easily <em>grow</em> as each developer becomes more
              productive.&quot; This caveat aligns with the economic concept of{" "}
              <em>demand elasticity</em> and the <em>productivity effect</em>{" "}identified
              by Autor (2015): automation of tasks within an occupation can
              increase output and reduce costs, potentially expanding demand for
              the occupation itself. However, dual-process theory (Kahneman,
              2011) predicts that System 1 (fast, intuitive) processing of a
              red-colored job tile will override the System 2 (slow, deliberate)
              processing of the written caveats. This created a productive
              tension: careful readers praised the nuance, while rapid consumers
              shared the visualization with alarmist framings — generating
              debate, corrections, and counter-corrections that amplified the
              project&apos;s reach.
            </p>
          </div>

          {/* Factor 4 */}
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold">
              4. Open-Source Extensibility as a Research Platform
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Unlike static reports, Karpathy released the complete pipeline:
              web scraping (Playwright), HTML parsing (BeautifulSoup), LLM
              scoring (via OpenRouter API), and site generation — approximately
              1,200 lines of Python plus a 912-line standalone HTML/Canvas
              frontend. The scoring component is parameterized by a prompt,
              meaning any researcher can substitute a different question — &quot;score
              exposure to humanoid robotics,&quot; &quot;score offshoring risk,&quot; &quot;score
              climate impact&quot; — and regenerate the entire visualization. This
              transforms the project from a static artifact into what
              computational social scientists call a <em>generative platform</em>{" "}
              (Zittrain, 2008): an open system that enables third-party
              innovation without requiring permission. The Austrian adaptation
              in this repository is one such extension.
            </p>
          </div>

          {/* Factor 5 */}
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold">
              5. Temporal Context: The AI Acceleration Window
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              The release coincided with a period of unprecedented AI capability
              acceleration (GPT-4o, Claude 3.5, Gemini 1.5), concurrent tech
              sector layoffs attributed partially to AI-driven productivity
              gains, and active legislative debate (EU AI Act implementation,
              US executive orders on AI). Kingdon&apos;s <em>multiple streams
              framework</em> (1984) from policy science explains such moments:
              when the problem stream (labor market anxiety), the policy stream
              (regulatory proposals), and the politics stream (public
              attention) converge, a &quot;policy window&quot; opens. Karpathy&apos;s
              visualization served as what Kingdon calls a <em>focusing event</em> —
              a concrete, vivid artifact that crystallized diffuse anxieties
              into a shareable, debatable object.
            </p>
          </div>
        </div>
      </Card>

      {/* ── Section 3: Methodological Considerations ───────────────── */}
      <Card className="p-5 space-y-3">
        <h2 className="text-base font-bold">Methodological Considerations</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          It is important to note the tool&apos;s methodological limitations, which
          Karpathy himself acknowledged:
        </p>
        <ul className="space-y-2 text-base leading-relaxed text-muted-foreground pl-4">
          <li className="list-disc">
            <strong className="text-foreground">LLM scoring is not empirical measurement.</strong>{" "}
            The AI exposure scores are generated by a single LLM (Gemini Flash)
            with a fixed prompt at low temperature (0.2). They reflect the
            model&apos;s training distribution, not observed labor market outcomes.
            This contrasts with econometric approaches (e.g., Felten et al.&apos;s
            AI Occupational Exposure index, 2021) that use measured AI
            benchmark performance mapped to O*NET task descriptions.
          </li>
          <li className="list-disc">
            <strong className="text-foreground">No demand-side modeling.</strong>{" "}
            The scores do not account for price elasticity of demand, latent
            demand, regulatory barriers, or social preferences for human
            workers — all factors that mediate the relationship between
            technical capability and actual labor displacement (Acemoglu &
            Restrepo, 2019).
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Static snapshot.</strong>{" "}
            The BLS OOH data reflects 2024 employment levels with 2034
            projections. The AI exposure scores reflect 2026 LLM capabilities.
            Both will change rapidly, making the visualization a time-stamped
            artifact rather than a persistent forecast.
          </li>
          <li className="list-disc">
            <strong className="text-foreground">US-specific occupational taxonomy.</strong>{" "}
            The Standard Occupational Classification (SOC) system does not map
            directly to other countries&apos; classification systems (ÖNACE, ISCO),
            limiting international comparisons without careful adaptation — as
            this Austrian version demonstrates.
          </li>
        </ul>
      </Card>

      {/* ── Section 4: Significance ────────────────────────────────── */}
      <Card className="p-5 space-y-3">
        <h2 className="text-base font-bold">Significance for Public Understanding</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Despite these limitations, the project&apos;s contribution to public
          discourse is substantial. It demonstrated that a single developer
          with access to public data and LLM APIs can produce labor market
          analysis that reaches millions — a democratization of what was
          previously the domain of government agencies and research
          institutions. It shifted the conversation from &quot;will AI take jobs?&quot;
          (a binary framing) to &quot;how will AI reshape <em>specific</em> jobs?&quot; (a
          graduated, occupation-level framing). And it provided a reusable
          platform that enables contextualized adaptations — such as this
          Austrian version, which, unlike the US original, uses exclusively official, publicly
          accessible data sources and whose entire data pipeline is scientifically verifiable
          and reproducible — that ground the global AI debate in local labor
          market realities.
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          In the taxonomy of science communication, Karpathy&apos;s project
          operates at the intersection of <em>data journalism</em>,{" "}
          <em>information visualization</em>, and <em>participatory research
          infrastructure</em>. Its intense reception reflects not only its
          technical quality but the depth of societal anxiety about AI&apos;s
          labor market implications — an anxiety that, as this tool makes
          visible, is neither unfounded nor uniformly distributed.
        </p>
      </Card>

      <div className="h-px w-full bg-border" aria-hidden="true" />

      {/* ── References ─────────────────────────────────────────────── */}
      <div className="space-y-2">
        <h2 className="text-base font-bold">References</h2>
        <ul className="space-y-1.5 text-base text-muted-foreground leading-relaxed">
          <li>
            Acemoglu, D. & Restrepo, P. (2019). Automation and New Tasks: How
            Technology Displaces and Reinstates Labor. <em>Journal of Economic
            Perspectives</em>, 33(2), 3–30.
          </li>
          <li>
            Acemoglu, D. & Restrepo, P. (2020). Robots and Jobs: Evidence from
            US Labor Markets. <em>Journal of Political Economy</em>, 128(6),
            2188–2244.
          </li>
          <li>
            Autor, D. (2015). Why Are There Still So Many Jobs? The History and
            Future of Workplace Automation. <em>Journal of Economic
            Perspectives</em>, 29(3), 3–30.
          </li>
          <li>
            Eloundou, T., Manning, S., Mishkin, P. & Rock, D. (2023). GPTs are
            GPTs: An Early Look at the Labor Market Impact Potential of Large
            Language Models. <em>arXiv:2303.10130</em>.
          </li>
          <li>
            Felten, E., Raj, M. & Seamans, R. (2021). Occupational,
            Industry, and Geographic Exposure to Artificial Intelligence: A
            Novel Dataset and Its Potential Uses. <em>Strategic Management
            Journal</em>, 42(12), 2195–2217.
          </li>
          <li>
            Frey, C.B. & Osborne, M.A. (2017). The Future of Employment: How
            Susceptible Are Jobs to Computerisation? <em>Technological
            Forecasting and Social Change</em>, 114, 254–280.
          </li>
          <li>
            Hovland, C.I., Janis, I.L. & Kelley, H.H. (1953).{" "}
            <em>Communication and Persuasion</em>. Yale University Press.
          </li>
          <li>
            Kahneman, D. (2011). <em>Thinking, Fast and Slow</em>. Farrar,
            Straus and Giroux.
          </li>
          <li>
            Kahneman, D. & Tversky, A. (1979). Prospect Theory: An Analysis of
            Decision Under Risk. <em>Econometrica</em>, 47(2), 263–291.
          </li>
          <li>
            Kingdon, J.W. (1984). <em>Agendas, Alternatives, and Public
            Policies</em>. Little, Brown and Company.
          </li>
          <li>
            Slovic, P. (2000). <em>The Perception of Risk</em>. Earthscan.
          </li>
          <li>
            Zittrain, J. (2008). <em>The Future of the Internet — And How to
            Stop It</em>. Yale University Press.
          </li>
        </ul>
      </div>
    </div>
  );
}

function AboutDe() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="text-base text-foreground/70 leading-relaxed">
        Methodische Dokumentation der österreichischen Adaptation: Übernahmen aus der US-Originalversion,
        lokale Datenersetzungen sowie die Struktur des berufsbasierten Datensatzes,
        der Routenarchitektur und der Methodik. Alle quantitativen Daten stammen aus amtlichen, öffentlich
        zugänglichen Quellen und sind wissenschaftlich nachprüfbar — die gesamte Generierungspipeline ist
        quelloffen und jederzeit reproduzierbar.
      </div>

      {/* ── Österreich-Anpassung ─────────────────────────────────────── */}
      <Card className="p-5 space-y-3 border-(--webcon-primary,#1b7a95)/30 bg-(--webcon-primary,#1b7a95)/5">
        <h2 className="text-base font-bold">Österreichische Adaptation: Datenquellen und Architektur</h2>
        <p className="text-base leading-relaxed text-foreground/80 border-b border-border/50 pb-3">
          <strong className="text-foreground">Andrej Karpathy</strong> entwickelte den{" "}
          <strong className="text-foreground">US Job Market Visualizer</strong> —
          Treemap-Visualisierung, Datenpipeline und Bewertungsrahmen sind <em>seine</em> Leistung. Diese Seite dokumentiert die österreichische Adaptation:
          lokale Datenquellen, berufsbasierte Navigation,
          zweisprachige Benutzeroberfläche und die ISCO-08-basierte Struktur auf dieser Grundlage.
        </p>
        <p className="text-base leading-relaxed text-foreground/70">
          Alle Datenquellen wurden durch offizielle österreichische und EU-Statistiken ersetzt:
        </p>
        <ul className="space-y-1.5 text-base leading-relaxed text-foreground/70 pl-4">
          <li className="list-disc">
            <strong className="text-foreground">Beschäftigungsdaten</strong> → Eurostat lfsa_egai2d (EU-Arbeitskräfteerhebung; für Österreich: Mikrozensus-Arbeitskräfteerhebung) nach ISCO-08 (2-Steller), mit proportionaler NACE-Gewichtung aus nama_10_a64_e — statt US Bureau of Labor Statistics
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Gehaltsdaten</strong> → Statistik Austria Verdienststrukturerhebung 2022 (VSE) — statt BLS-Medianlohn
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Branchenklassifikation</strong> → ÖNACE 2025 (österreichische Umsetzung von NACE Rev. 2.1) — statt Standard Occupational Classification (SOC)
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Berufszuordnung</strong> → ISCO-08-Berufsgruppen (2-Steller) — statt BLS-Detailberufe
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Informationsarchitektur</strong> → berufsbasiert über ISCO-08-Hauptgruppen (Familien); ÖNACE-Wirtschaftsabschnitte bleiben als sektoraler Kontext erhalten
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Routenmodell</strong> → eigene Routen für Beruf (/beruf), Familie (/family) und Sektor (/branche) — statt sektorbasierter Navigation
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Gehälter</strong> → EUR Bruttojahresentgelt einschließlich 13. und 14. Monatsgehalt — statt USD
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Bildungsniveaus</strong> → Österreichische Qualifikationsstruktur (Pflichtschule, Lehrabschluss, BMS, Matura, Kolleg, Bachelor, Master/Diplom, Doktorat)
          </li>
          <li className="list-disc">
            <strong className="text-foreground">KI-Exposition &amp; Ausblick</strong> →{" "}
            Für österreichische Berufsgruppen kuratiert mit einem <strong>Karpathy-kompatiblen Bewertungsrahmen</strong>{" "}
            (0–10 Exposition, –10…+10 Ausblick), aber auf lokale Berufsgruppen und lokalen
            Sektor-Kontext angepasst; Details unten.
          </li>
          <li className="list-disc">
            <strong className="text-foreground">Reproduzierbarkeit</strong> → Alle Quelldaten sind als Open Government Data frei herunterladbar. Die Generierungspipeline (scripts/generate-occupations.ts) ist deterministisch: identische Eingaben erzeugen identische Ergebnisse. Über 30 automatisierte Integritätstests verifizieren den Datensatz bei jeder Regeneration. Kein LLM-API-Aufruf beim Build.
          </li>
        </ul>
        <p className="text-base text-foreground/60 leading-relaxed mt-2 border-t border-border/40 pt-2">
          <strong className="text-foreground/75">ÖNACE:</strong>{" "}
          ÖNACE 2025 dient als sektorale Kontextebene, nicht als primäre
          analytische Einheit. Die Verdienststrukturerhebung 2022 wurde weiterhin unter
          ÖNACE-2008-Codes (NACE Rev.2) geführt — in den Open-Data-Dateien der Statistik Austria
          z. B. Spalte <code className="text-[10px] bg-muted px-1 rounded">C-ONVE10-0</code>.
          Aktuelle Abschnittsbezeichnungen A–S werden zur Orientierung angezeigt, während die
          berufsbasierte Analyse auf ISCO-08-Gruppen und -Hauptgruppen operiert.
        </p>
        <div className="space-y-2 text-base leading-relaxed text-foreground/70 border-t border-border/60 pt-3 mt-3">
          <h3 className="font-semibold text-foreground text-base">
            Erstellung der KI-Expositions- und Ausblickwerte (Pipeline-Dokumentation)
          </h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong className="text-foreground">Quelle:</strong>{" "}
              <code className="text-xs bg-muted px-1 rounded">scripts/generate-occupations.ts</code>{" "}
              → Array <code className="text-xs bg-muted px-1 rounded">OCCUPATION_DEFS</code>. Jede
              Zeile setzt <code className="text-xs bg-muted px-1 rounded">exposure</code> (0–10),{" "}
              <code className="text-xs bg-muted px-1 rounded">exposureRationale</code> (Begründung EN/DE),{" "}
              <code className="text-xs bg-muted px-1 rounded">outlook</code> (–10…+10) und{" "}
              <code className="text-xs bg-muted px-1 rounded">outlookDesc</code> (kurze Stufe, z. B.
              „Slow growth“).
            </li>
            <li>
              <strong className="text-foreground">Rahmen (Karpathy-kompatibel):</strong> Exposition
              quantifiziert den Anteil kognitiver, digitaler bzw. durch Large Language Models und multimodale KI-Systeme substituierbarer Aufgaben—{" "}
              <strong>keine</strong> empirische Messung im Sinne des AI Occupational Exposure Index (Felten et al., 2021). Hohe Exposition bedeutet nicht
              Arbeitsplatzverlust (vgl. Karpathys expliziten Hinweis zur Softwareentwicklung). Ausblick ist ein{" "}
              <strong>qualitatives</strong> Nachfragesignal pro aggregierter Berufsgruppe, informiert durch sektorale Struktur und arbeitsmarktpolitischen Diskurs —
              <strong>kein</strong> statistisches Prognosemodell.
            </li>
            <li>
              <strong className="text-foreground">Regenerieren:</strong>{" "}
              <code className="text-xs bg-muted px-1 rounded">npm run generate:occupations</code>{" "}
              berechnet Beschäftigung und Gehälter neu aus Eurostat + in{" "}
              <code className="text-xs bg-muted px-1 rounded">src/lib/real-data.ts</code> eingebetteten
              Statistik-Austria-Daten und schreibt <code className="text-xs bg-muted px-1 rounded">src/lib/data.ts</code>.
              Basis-Exposition/-Ausblick stammen aus <code className="text-xs bg-muted px-1 rounded">OCCUPATION_DEFS</code>.{" "}
              <code className="text-xs bg-muted px-1 rounded">npm run build</code> ruft <strong>keine</strong> LLM-API auf.
              Die Pipeline ist vollständig deterministisch: identische Quell-CSVs erzeugen identisches Ergebnis — jeder Datenpunkt ist auf eine spezifische Eurostat- oder Statistik-Austria-Download-URL rückführbar.
            </li>
            <li>
              <strong className="text-foreground">Automatisierte Verifikation:</strong>{" "}
              Über 30 Integritätstests (Beschäftigungssummen, Entgeltplausibilität, ISCO-Konsistenz, Expositionsverteilung) laufen bei jeder Regeneration. Ergebnisse sind im Tab „Tests" einsehbar.
            </li>
            <li>
              <strong className="text-foreground">Optionales LLM-Scoring (wie Karpathy):</strong>{" "}
              <code className="text-xs bg-muted px-1 rounded">npm run score:exposure-llm</code> (mit{" "}
              <code className="text-xs bg-muted px-1 rounded">OPENROUTER_API_KEY</code>) ruft OpenRouter mit
              festem Rubrik-Text + Temperatur 0,2 auf und schreibt{" "}
              <code className="text-xs bg-muted px-1 rounded">scripts/llm-exposure-overrides.json</code>. Der
              Generator überschreibt damit nur <code className="text-xs bg-muted px-1 rounded">exposure</code> und{" "}
              <code className="text-xs bg-muted px-1 rounded">exposureRationale</code>—danach erneut{" "}
              <code className="text-xs bg-muted px-1 rounded">npm run generate:occupations</code>.
            </li>
          </ol>
        </div>
        <p className="text-base leading-relaxed text-foreground/70">
          Technische Umsetzung: Next.js, TypeScript, shadcn/ui und das
          webconsulting Design System. Gegenüber dem US-Original hinzugefügte Funktionen: Berufsdetailseiten, ISCO-Hauptgruppenübersichten,
          ÖNACE-Sektor-Kontextseiten, ein Österreich-vs-USA-Strukturvergleich, eine
          zweisprachige Benutzeroberfläche (Deutsch/Englisch) und eine umfassende automatisierte
          Testsuite, die die Datenintegrität bei jedem Build verifiziert. Die gesamte Codebasis — einschließlich
          aller Quelldaten, der Generierungspipeline und der Verifikationstests — ist offen und reproduzierbar.
        </p>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="text-base font-bold">Was Karpathy entwickelt hat</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Im März 2026 veröffentlichte <strong className="text-foreground">Andrej Karpathy</strong> —
          ehemaliger Director of AI bei Tesla, Gründungsmitglied von OpenAI und
          einer der meistzitierten Forscher im Bereich Deep Learning — ein
          Open-Source-Tool, das alle 342 Berufe des U.S. Bureau of Labor
          Statistics Occupational Outlook Handbook scrapt, parst und
          visualisiert. Die Visualisierung ist eine Treemap, in der die{" "}
          <em>Fläche</em> jedes Rechtecks proportional zur Gesamtbeschäftigung
          ist und die <em>Farbe</em> eine gewählte Metrik kodiert: BLS-
          Wachstumsprognose, Medianlohn, Bildungsanforderungen oder — am
          kontroversesten — einen LLM-generierten &quot;Digital AI Exposure&quot;-Score
          auf einer Skala von 0–10.
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          Das Tool umfasst <strong className="text-foreground">143 Millionen Arbeitsplätze</strong> und{" "}
          <strong className="text-foreground">8,9 Billionen Dollar</strong> an Jahreslöhnen. Es ist
          bewusst keine wissenschaftliche Arbeit, keine Politikempfehlung und
          keine Prognose — es ist, in Karpathys eigenen Worten, &quot;ein
          Entwicklungstool zur visuellen Exploration von BLS-Daten.&quot;
        </p>
      </Card>

      <Card className="p-5 space-y-4">
        <h2 className="text-base font-bold">
          Warum es intensiven öffentlichen Diskurs auslöste
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Die virale Rezeption des Projekts in Technologie-, Wirtschafts- und
          Politik-Communities lässt sich auf fünf sich überschneidende Faktoren
          zurückführen, die jeweils in etablierten Kommunikations- und
          Verhaltenswissenschaften verankert sind:
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold">
              1. Quellglaubwürdigkeit und epistemische Autorität
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Hovland, Janis & Kelleys <em>Source-Credibility-Modell</em> (1953)
              zeigt, dass die Überzeugungskraft einer Botschaft stark von der
              wahrgenommenen Expertise und Vertrauenswürdigkeit der Quelle
              abhängt. Karpathy nimmt eine seltene Position ein: Er ist sowohl
              führender technischer Praktiker (Produktions-KI-Systeme bei Tesla
              und OpenAI) als auch weitreichender Kommunikator (3M+
              YouTube-Abonnenten). Wenn ein Insider dieses Kalibers eine
              KI-Expositionskarte des Arbeitsmarktes veröffentlicht, trägt das
              Signal qualitativ anderes Gewicht als eine äquivalente Analyse
              einer Beratungsfirma.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-semibold">
              2. Konkretisierung abstrakten Risikos
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Forschung zur Risikokommunikation (Slovic, 2000; Kahneman &
              Tverskys Prospect Theory, 1979) zeigt konsistent, dass Menschen
              statistische Wahrscheinlichkeiten untergewichten, aber lebhafte,
              persönlich relevante Informationen übergewichten. Frühere
              KI-Arbeitsmarktstudien — Frey & Osborne (2017), Eloundou et al.
              (2023) — quantifizierten Exposition auf aggregierter Ebene.
              Karpathys Treemap macht jeden Beruf individuell sichtbar, nach
              Beschäftigung dimensioniert und nach Exposition eingefärbt. Dieser{" "}
              <em>Konkretisierungseffekt</em> — die Transformation aggregierter
              Statistiken in persönlich identifizierbare visuelle
              Repräsentationen — erklärt die emotionalen Reaktionen.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-semibold">
              3. Das Nuancen-Paradoxon: Exposition ≠ Verdrängung
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Karpathy betonte explizit, dass ein hoher Expositionswert &quot;nicht
              vorhersagt, dass ein Job verschwindet.&quot; Dies entspricht dem
              ökonomischen Konzept der <em>Nachfrageelastizität</em> und dem von
              Autor (2015) identifizierten <em>Produktivitätseffekt</em>.
              Die Dual-Process-Theorie (Kahneman, 2011) sagt jedoch voraus,
              dass die System-1-Verarbeitung (schnell, intuitiv) eines rot
              eingefärbten Berufsfeldes die System-2-Verarbeitung (langsam,
              deliberativ) der schriftlichen Einschränkungen überlagert. Dies
              schuf eine produktive Spannung, die die Reichweite des Projekts
              verstärkte.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-semibold">
              4. Open-Source-Erweiterbarkeit als Forschungsplattform
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Die gesamte Pipeline ist offen: Web-Scraping, Parsing, LLM-Scoring
              und Site-Generierung. Die Scoring-Komponente ist durch einen Prompt
              parametrisiert — jeder Forscher kann eine andere Frage
              substituieren und die gesamte Visualisierung regenerieren. Dies
              transformiert das Projekt in eine <em>generative Plattform</em>{" "}
              (Zittrain, 2008). Die österreichische Adaptation in diesem
              Repository ist eine solche Erweiterung.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-semibold">
              5. Temporaler Kontext: Das KI-Beschleunigungsfenster
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Die Veröffentlichung fiel mit einer beispiellosen
              KI-Fähigkeitsbeschleunigung (GPT-4o, Claude 3.5, Gemini 1.5),
              gleichzeitigen Tech-Entlassungen und aktiver Gesetzgebungsdebatte
              (EU AI Act, US-Executive-Orders) zusammen. Kingdons{" "}
              <em>Multiple-Streams-Framework</em> (1984) erklärt solche Momente:
              Wenn Problem-, Politik- und Aufmerksamkeitsstrom konvergieren,
              öffnet sich ein &quot;Policy Window.&quot; Karpathys Visualisierung diente
              als <em>Focusing Event</em> — ein konkretes Artefakt, das diffuse
              Ängste in ein teilbares, diskutierbares Objekt kristallisierte.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="text-base font-bold">Bedeutung für das öffentliche Verständnis</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Trotz methodischer Einschränkungen (LLM-Scoring ist keine empirische
          Messung, keine nachfrageseitige Modellierung, statische Momentaufnahme)
          ist der Beitrag zum öffentlichen Diskurs erheblich. Das Projekt zeigte,
          dass ein einzelner Entwickler mit öffentlichen Daten und LLM-APIs
          Arbeitsmarktanalysen produzieren kann, die Millionen erreichen. Es
          verschob die Konversation von &quot;Wird KI Jobs wegnehmen?&quot; (binäre
          Rahmung) zu &quot;Wie wird KI <em>spezifische</em> Jobs umgestalten?&quot;
          (graduierte, berufsbezogene Rahmung). Und es stellte eine
          wiederverwendbare Plattform bereit, die kontextualisierte Adaptionen
          ermöglicht — wie diese österreichische Version, die im Unterschied zum US-Original
          ausschließlich amtliche, öffentlich zugängliche Datenquellen verwendet und deren gesamte
          Datenpipeline wissenschaftlich nachprüfbar und reproduzierbar ist.
        </p>
      </Card>

      <div className="h-px w-full bg-border" aria-hidden="true" />

      <div className="space-y-2">
        <h2 className="text-base font-bold">Referenzen</h2>
        <ul className="space-y-1.5 text-base text-muted-foreground leading-relaxed">
          <li>
            Acemoglu, D. & Restrepo, P. (2019). Automation and New Tasks.{" "}
            <em>Journal of Economic Perspectives</em>, 33(2), 3–30.
          </li>
          <li>
            Autor, D. (2015). Why Are There Still So Many Jobs?{" "}
            <em>Journal of Economic Perspectives</em>, 29(3), 3–30.
          </li>
          <li>
            Eloundou, T. et al. (2023). GPTs are GPTs.{" "}
            <em>arXiv:2303.10130</em>.
          </li>
          <li>
            Frey, C.B. & Osborne, M.A. (2017). The Future of Employment.{" "}
            <em>Technological Forecasting and Social Change</em>, 114, 254–280.
          </li>
          <li>
            Hovland, C.I. et al. (1953). <em>Communication and Persuasion</em>.
            Yale University Press.
          </li>
          <li>
            Kahneman, D. (2011). <em>Thinking, Fast and Slow</em>. FSG.
          </li>
          <li>
            Kingdon, J.W. (1984). <em>Agendas, Alternatives, and Public
            Policies</em>. Little, Brown.
          </li>
          <li>
            Slovic, P. (2000). <em>The Perception of Risk</em>. Earthscan.
          </li>
          <li>
            Zittrain, J. (2008). <em>The Future of the Internet</em>. Yale
            University Press.
          </li>
        </ul>
      </div>
    </div>
  );
}
