# Austrian Job Market Visualizer

Next.js app: interactive treemap of the Austrian labor market (ÖNACE sectors, AMS / Statistik Austria / WKO–style data), AT vs US comparison, and bilingual DE/EN UI.

**Live:** [jobs.karpathy.webconsulting.at](https://jobs.karpathy.webconsulting.at) · **Repo:** [github.com/dirnbauer/jobs](https://github.com/dirnbauer/jobs)

## Data sources (high level)

- **Employment:** Eurostat `nama_10_a64_e` (2024) — sector-level totals  
- **Earnings:** Statistik Austria Verdienststrukturerhebung 2022 (VSE) — median gross hourly by ISCO-08  
- **Curated fields:** AI exposure / outlook rubric in `scripts/generate-occupations.ts` (`OCCUPATION_DEFS`)

## Development

```bash
npm install
npm run dev
```

### Refresh embedded official data (optional)

These files are generated and committed so CI/production builds without refetching:

| Output | Command |
|--------|---------|
| `src/lib/real-data.ts` | `npx tsx scripts/fetch-real-data.ts` |
| `src/lib/data.ts` | `npm run generate:occupations` |
| `scripts/llm-exposure-overrides.json` | `npm run score:exposure-llm` (optional OpenRouter) |

```bash
npx tsx scripts/fetch-real-data.ts   # network: Eurostat + Statistik Austria
npm run generate:occupations
```

## Features

- Treemap layers: outlook, median pay, education, AI exposure  
- AT vs US comparison  
- Data verification tests  
- Impressum, Datenschutz, AGB; SEO + OG images  

## Attribution

Concept inspired by [Andrej Karpathy’s US Job Market Visualizer](https://karpathy.ai/jobs/) ([karpathy/jobs](https://github.com/karpathy/jobs)). This repository is an independent Austrian adaptation (Next.js, Austrian/Eurostat data).

Built by [webconsulting](https://webconsulting.at).

## License (this repository)

- **Source code:** [MIT](LICENSE) — webconsulting business services gmbh  
- **Text / UI copy:** [CC BY-SA 4.0](LICENSE-CC-BY-SA-4.0)  

The upstream [karpathy/jobs](https://github.com/karpathy/jobs) repo had no root `LICENSE` file at last check; see the site Impressum for details.
