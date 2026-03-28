import type { ReadonlyURLSearchParams } from "next/navigation";

export type ExplorerSort =
  | "exposure-desc"
  | "exposure-asc"
  | "jobs-desc"
  | "pay-desc"
  | "title-asc";

export const EXPLORER_SORTS: ExplorerSort[] = [
  "exposure-desc",
  "exposure-asc",
  "jobs-desc",
  "pay-desc",
  "title-asc",
];

export function parseExplorerSort(v: string | null): ExplorerSort {
  if (v && EXPLORER_SORTS.includes(v as ExplorerSort)) return v as ExplorerSort;
  return "exposure-desc";
}

export function readExplorerFromSearchParams(sp: ReadonlyURLSearchParams): {
  q: string;
  sort: ExplorerSort;
  exMin: number;
  exMax: number;
} {
  const q = sp.get("q") ?? "";
  const sort = parseExplorerSort(sp.get("sort"));
  let exMin = Number.parseInt(sp.get("min") ?? "0", 10);
  let exMax = Number.parseInt(sp.get("max") ?? "10", 10);
  if (Number.isNaN(exMin)) exMin = 0;
  if (Number.isNaN(exMax)) exMax = 10;
  exMin = Math.max(0, Math.min(10, exMin));
  exMax = Math.max(0, Math.min(10, exMax));
  if (exMin > exMax) [exMin, exMax] = [exMax, exMin];
  return { q, sort, exMin, exMax };
}

/** Query string fragment to restore list state (no leading ?). Includes `view=explorer` for home tab. */
export function explorerQueryString(p: {
  q: string;
  sort: ExplorerSort;
  exMin: number;
  exMax: number;
}): string {
  const sp = new URLSearchParams();
  sp.set("view", "explorer");
  if (p.q) sp.set("q", p.q);
  if (p.sort !== "exposure-desc") sp.set("sort", p.sort);
  if (p.exMin !== 0) sp.set("min", String(p.exMin));
  if (p.exMax !== 10) sp.set("max", String(p.exMax));
  return sp.toString();
}
