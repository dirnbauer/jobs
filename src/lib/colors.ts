/**
 * Color scales ported from Karpathy's original treemap visualization.
 * Adapted for Austrian job market metrics (EUR pay, Austrian education levels).
 */

import { EDU_LEVELS_EN } from "./data";

export type ColorMode = "outlook" | "pay" | "education" | "exposure";

function boostContrast(t: number): number {
  const c = (t - 0.5) * 2;
  const b = Math.sign(c) * Math.pow(Math.abs(c), 0.55);
  return b / 2 + 0.5;
}

/** Darken toward black so large text meets WCAG AA vs light card backgrounds (~#fcfcfc). */
function textSafeRgb(r: number, g: number, b: number): [number, number, number] {
  const mix = 0.48;
  return [
    Math.round(r * (1 - mix)),
    Math.round(g * (1 - mix)),
    Math.round(b * (1 - mix)),
  ];
}

export function greenRedCSS(t: number, alpha: number, forText = false): string {
  t = boostContrast(Math.max(0, Math.min(1, t)));
  let r: number, g: number, b: number;
  if (t < 0.5) {
    const s = t / 0.5;
    r = Math.round(30 + s * 200);
    g = Math.round(180 - s * 20);
    b = Math.round(40 - s * 20);
  } else {
    const s = (t - 0.5) / 0.5;
    r = Math.round(230 + s * 25);
    g = Math.round(160 - s * 130);
    b = Math.round(20 - s * 5);
  }
  if (forText) {
    [r, g, b] = textSafeRgb(r, g, b);
  }
  return `rgba(${r},${g},${b},${alpha})`;
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
