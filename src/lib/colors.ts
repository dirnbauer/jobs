/**
 * Color scales for the Austrian job market treemap visualization.
 * Original concept from Karpathy's US job market treemap; the nonlinear
 * contrast-boosted RGB gradient was simplified to a 5-stop Tailwind palette
 * (green → lime → yellow → orange → red) for clearer, more intuitive mapping.
 * Adapted for Austrian metrics (EUR pay, Austrian education levels).
 */

import { EDU_LEVELS_EN } from "./data";

export type ColorMode = "outlook" | "pay" | "education" | "exposure";

/**
 * 5-stop gradient: green → lime → yellow → orange → red.
 * Matches the vibrant Tailwind palette from the reference implementation.
 */
const GRADIENT_STOPS: [number, number, number][] = [
  [34, 197, 94],   // green-500
  [132, 204, 22],  // lime-500
  [234, 179, 8],   // yellow-500
  [249, 115, 22],  // orange-500
  [239, 68, 68],   // red-500
];

export function greenRedCSS(t: number, alpha: number, forText = false): string {
  t = Math.max(0, Math.min(1, t));
  const seg = t * (GRADIENT_STOPS.length - 1);
  const i = Math.min(Math.floor(seg), GRADIENT_STOPS.length - 2);
  const f = seg - i;
  const a = GRADIENT_STOPS[i], b = GRADIENT_STOPS[i + 1];
  let r = Math.round(a[0] + f * (b[0] - a[0]));
  let g = Math.round(a[1] + f * (b[1] - a[1]));
  let bl = Math.round(a[2] + f * (b[2] - a[2]));
  if (forText) {
    r = Math.round(r * 0.55);
    g = Math.round(g * 0.55);
    bl = Math.round(bl * 0.55);
  }
  return `rgba(${r},${g},${bl},${alpha})`;
}

export function outlookColor(v: number | null, a: number, forText = false): string {
  if (v == null) return `rgba(128,128,128,${a})`;
  return greenRedCSS(
    1 - Math.max(0, Math.min(1, (v + 12) / 24)),
    a,
    forText
  );
}

export function payColor(v: number | null, a: number, forText = false): string {
  if (v == null) return `rgba(128,128,128,${a})`;
  // Austrian pay range: €20K to €100K (EUR)
  const t =
    1 -
    (Math.log(Math.max(20000, Math.min(100000, v))) - Math.log(20000)) /
      (Math.log(100000) - Math.log(20000));
  return greenRedCSS(t, a, forText);
}

export function eduColor(idx: number, a: number, forText = false): string {
  if (idx < 0) return `rgba(128,128,128,${a})`;
  return greenRedCSS(1 - idx / (EDU_LEVELS_EN.length - 1), a, forText);
}

export function exposureColor(v: number | null, a: number, forText = false): string {
  if (v == null) return `rgba(128,128,128,${a})`;
  return greenRedCSS(v / 10, a, forText);
}

export function tileColor(
  d: { exposure: number | null; outlook: number | null; pay: number | null; education: string },
  mode: ColorMode,
  alpha: number
): string {
  switch (mode) {
    case "exposure":
      return exposureColor(d.exposure, alpha);
    case "outlook":
      return outlookColor(d.outlook, alpha);
    case "pay":
      return payColor(d.pay, alpha);
    case "education":
      return eduColor(EDU_LEVELS_EN.indexOf(d.education), alpha);
    default:
      return `rgba(128,128,128,${alpha})`;
  }
}

/**
 * Pick white or black text for a tile depending on effective background luminance.
 * `bgHex` is the canvas background (e.g. "#0a0a0f" dark, "#f8f9fa" light).
 */
export function tileTextColor(
  d: { exposure: number | null; outlook: number | null; pay: number | null; education: string },
  mode: ColorMode,
  alpha: number,
  bgHex: string,
): string {
  // Parse tile RGBA
  const raw = tileColor(d, mode, 1);
  const m = raw.match(/rgba?\((\d+),(\d+),(\d+)/);
  if (!m) return "rgba(255,255,255,0.9)";
  const tr = +m[1], tg = +m[2], tb = +m[3];

  // Parse canvas background hex
  const bh = bgHex.replace("#", "");
  const br = parseInt(bh.slice(0, 2), 16);
  const bg = parseInt(bh.slice(2, 4), 16);
  const bb = parseInt(bh.slice(4, 6), 16);

  // Composite: alpha blend tile over bg
  const cr = alpha * tr + (1 - alpha) * br;
  const cg = alpha * tg + (1 - alpha) * bg;
  const cb = alpha * tb + (1 - alpha) * bb;

  // Relative luminance (sRGB)
  const lum =
    0.2126 * (cr / 255) ** 2.2 +
    0.7152 * (cg / 255) ** 2.2 +
    0.0722 * (cb / 255) ** 2.2;

  return lum > 0.18
    ? "rgba(0,0,0,0.85)"
    : "rgba(255,255,255,0.85)";
}

export const LEGEND_CONFIG: Record<
  ColorMode,
  { low: string; high: string; lowDe: string; highDe: string }
> = {
  exposure: { low: "Low", high: "High", lowDe: "Niedrig", highDe: "Hoch" },
  outlook: {
    low: "Declining",
    high: "Growing",
    lowDe: "Rückläufig",
    highDe: "Wachsend",
  },
  pay: { low: "€20K", high: "€100K", lowDe: "€20K", highDe: "€100K" },
  education: {
    low: "Pflichtschule",
    high: "Doctoral",
    lowDe: "Pflichtschule",
    highDe: "Doktorat",
  },
};
