#!/usr/bin/env npx tsx
/**
 * LLM AI exposure scoring (Karpathy-style pipeline step).
 *
 * Prerequisites:
 *   export OPENROUTER_API_KEY=sk-or-v1-...
 * Optional:
 *   OPENROUTER_MODEL=google/gemini-2.0-flash-001   (default below)
 *   LLM_SCORE_DELAY_MS=400                        (delay between API calls)
 *
 * Usage:
 *   npx tsx scripts/score-exposure-llm.ts              # score all occupations
 *   npx tsx scripts/score-exposure-llm.ts --limit 3  # smoke test
 *   npx tsx scripts/score-exposure-llm.ts --dry-run    # print first prompt only
 *
 * Output: scripts/llm-exposure-overrides.json (merged with any existing slugs)
 * Then:   npx tsx scripts/generate-occupations.ts
 *
 * This does NOT run during Next.js build — only when you invoke this script.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Occupation } from "../src/lib/data";
import { austrianOccupations } from "../src/lib/data";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OVERRIDES_PATH = join(__dirname, "llm-exposure-overrides.json");

const PROMPT_VERSION = "v1";
const DEFAULT_MODEL = "google/gemini-2.0-flash-001";
const TEMPERATURE = 0.2;

/** Frozen rubric — Karpathy-style: cognitive/digital task exposure, not “will the job vanish”. */
const SYSTEM_RUBRIC = `You score Austrian aggregated occupation groups for "Digital AI Exposure" on an integer scale 0–10.
- 10 = work most reshaped by current LLMs, coding assistants, and digital automation of cognitive tasks.
- 0 = almost entirely physical, on-site, or manual work with little digital/LLM-relevant content.
High exposure does NOT predict job loss — demand may grow (e.g. software).
Respond with ONLY valid JSON, no markdown fences: {"exposure": <integer 0-10>, "exposureRationale": "<English, 1-2 sentences>"}`;

function parseArgs() {
  const argv = process.argv.slice(2);
  let limit: number | undefined;
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--limit" && argv[i + 1]) {
      limit = parseInt(argv[i + 1], 10);
      i++;
    }
    if (argv[i] === "--dry-run") dryRun = true;
  }
  return { limit, dryRun };
}

function loadExistingOverrides(): Record<string, unknown> {
  if (!existsSync(OVERRIDES_PATH)) return {};
  try {
    return JSON.parse(readFileSync(OVERRIDES_PATH, "utf-8")) as Record<
      string,
      unknown
    >;
  } catch {
    return {};
  }
}

function buildUserPrompt(o: Occupation): string {
  return `Occupation (English): ${o.title}
Occupation (German): ${o.titleDe}
ÖNACE / NACE sector code: ${o.category}
Sector label (DE): ${o.categoryDe}`;
}

function extractJson(text: string): { exposure: number; exposureRationale: string } {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = fence ? fence[1].trim() : trimmed;
  const parsed = JSON.parse(jsonStr) as { exposure: unknown; exposureRationale: unknown };
  const exposure = Math.round(Number(parsed.exposure));
  const exposureRationale = String(parsed.exposureRationale ?? "").trim();
  if (!Number.isFinite(exposure) || exposure < 0 || exposure > 10) {
    throw new Error(`Invalid exposure: ${parsed.exposure}`);
  }
  if (exposureRationale.length < 20) {
    throw new Error("Rationale too short");
  }
  return { exposure, exposureRationale };
}

async function callOpenRouter(
  apiKey: string,
  model: string,
  userContent: string
): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://jobs.karpathy.webconsulting.at",
      "X-Title": "AT Job Market Visualizer — exposure scoring",
    },
    body: JSON.stringify({
      model,
      temperature: TEMPERATURE,
      messages: [
        { role: "system", content: SYSTEM_RUBRIC },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${errText.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty completion");
  return content;
}

async function main() {
  const { limit, dryRun } = parseArgs();
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const delayMs = Math.max(
    0,
    parseInt(process.env.LLM_SCORE_DELAY_MS || "400", 10) || 400
  );

  const list = limit
    ? austrianOccupations.slice(0, limit)
    : [...austrianOccupations];

  if (dryRun) {
    console.log("Dry run — first prompt only:\n");
    console.log(buildUserPrompt(list[0]));
    return;
  }

  if (!apiKey) {
    console.error(
      "Missing OPENROUTER_API_KEY. Example:\n  export OPENROUTER_API_KEY=sk-or-v1-...\n"
    );
    process.exit(1);
  }

  const existing = loadExistingOverrides();
  const out: Record<string, unknown> = { ...existing };

  console.log(`Scoring ${list.length} occupation(s) with ${model} (T=${TEMPERATURE})...\n`);

  for (let i = 0; i < list.length; i++) {
    const o = list[i];
    const slug = o.slug;
    const prompt = buildUserPrompt(o);
    process.stdout.write(`[${i + 1}/${list.length}] ${slug} ... `);
    try {
      const raw = await callOpenRouter(apiKey, model, prompt);
      const parsed = extractJson(raw);
      out[slug] = {
        exposure: parsed.exposure,
        exposureRationale: parsed.exposureRationale,
      };
      console.log(`OK (${parsed.exposure})`);
    } catch (e) {
      console.log(`FAIL: ${e instanceof Error ? e.message : e}`);
      throw e;
    }
    if (i < list.length - 1 && delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  out._meta = {
    model,
    temperature: TEMPERATURE,
    generatedAt: new Date().toISOString(),
    promptVersion: PROMPT_VERSION,
    note: "Merged with previous file; re-run generate-occupations.ts to bake into src/lib/data.ts",
  };

  writeFileSync(OVERRIDES_PATH, JSON.stringify(out, null, 2) + "\n", "utf-8");
  console.log(`\nWrote ${OVERRIDES_PATH}`);
  console.log("Next: npx tsx scripts/generate-occupations.ts");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
