"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Occupation } from "@/lib/data";
import { EDU_LEVELS_EN } from "@/lib/data";
import { squarify } from "@/lib/treemap";
import type { ColorMode } from "@/lib/colors";
import { tileColor, tileTextColor } from "@/lib/colors";
import type { Locale } from "@/lib/locale";
import { explorerQueryString } from "@/lib/explorer-params";

interface TreemapRect extends Occupation {
  value: number;
  rx: number;
  ry: number;
  rw: number;
  rh: number;
}

interface TreemapCanvasProps {
  data: Occupation[];
  colorMode: ColorMode;
  locale: Locale;
}

const DEFAULT_DETAIL_QUERY = explorerQueryString({
  q: "",
  sort: "exposure-desc",
  exMin: 0,
  exMax: 10,
});

function formatNumber(n: number | null): string {
  if (n == null) return "—";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return Math.round(n / 1e3) + "K";
  return n.toLocaleString();
}

function formatPay(n: number | null): string {
  return n == null ? "—" : "€" + n.toLocaleString();
}

function tileSubInfo(r: Occupation, mode: ColorMode, locale: Locale): string {
  const jobsStr = r.jobs ? formatNumber(r.jobs) + (locale === "de" ? " Beschäftigte" : " employed") : "";
  switch (mode) {
    case "exposure":
      return (r.exposure != null ? r.exposure + "/10" : "") + (jobsStr ? " · " + jobsStr : "");
    case "outlook": {
      const o = r.outlook != null ? (r.outlook > 0 ? "+" : "") + r.outlook + "%" : "";
      return o + (jobsStr ? " · " + jobsStr : "");
    }
    case "pay":
      return (r.pay != null ? formatPay(r.pay) : "") + (jobsStr ? " · " + jobsStr : "");
    case "education": {
      const short: Record<string, string> = {
        "Compulsory school": locale === "de" ? "Pflichtschule" : "Compulsory",
        "Apprenticeship (Lehre)": "Lehre",
        "Vocational school (BMS)": "BMS",
        "Upper secondary (Matura)": "Matura",
        "Post-secondary (Kolleg)": "Kolleg",
        "Bachelor's degree": "Bachelor",
        "Master's/Diploma degree": "Master",
        "Doctoral/PhD": locale === "de" ? "Doktorat" : "Doctoral",
      };
      return (short[r.education] || "") + (jobsStr ? " · " + jobsStr : "");
    }
  }
  return "";
}

export function TreemapCanvas({ data, colorMode, locale }: TreemapCanvasProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rects, setRects] = useState<TreemapRect[]>([]);
  const [hovered, setHovered] = useState<TreemapRect | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    d: TreemapRect;
    x: number;
    y: number;
  } | null>(null);

  const MARGIN = 12;
  const GAP = 1.5;

  const doLayout = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const dpr = window.devicePixelRatio || 1;
    const w = wrapper.clientWidth;
    const h = Math.round(w * 3 / 4);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    const tx = MARGIN, ty = MARGIN, tw = w - MARGIN * 2, th = h - MARGIN * 2;
    const byCategory: Record<string, Occupation[]> = {};
    for (const d of data) {
      const key = locale === "de" ? d.iscoLabelDe : d.iscoLabel;
      if (!byCategory[key]) byCategory[key] = [];
      byCategory[key].push(d);
    }

    const categories = Object.keys(byCategory)
      .map((cat) => ({
        cat,
        items: byCategory[cat].sort((a, b) => (b.jobs || 0) - (a.jobs || 0)),
        value: byCategory[cat].reduce((s, d) => s + (d.jobs || 1), 0),
      }))
      .sort((a, b) => b.value - a.value);

    const catRects = squarify(categories, tx, ty, tw, th);
    const allRects: TreemapRect[] = [];

    for (const cr of catRects) {
      const catItems = (cr as typeof categories[0] & { rx: number; ry: number; rw: number; rh: number }).items;
      const items = catItems.map((d: Occupation) => ({ ...d, value: d.jobs || 1 }));
      const innerRects = squarify(items, cr.rx + GAP, cr.ry + GAP, cr.rw - GAP * 2, cr.rh - GAP * 2);
      for (const ir of innerRects) allRects.push(ir as TreemapRect);
    }

    setRects(allRects);
  }, [data, locale]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Get theme
    const isDark = document.documentElement.classList.contains("dark");
    const bg = isDark ? "#0a0a0f" : "#f8f9fa";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    for (const r of rects) {
      const isHovered = r === hovered;
      const g = GAP / 2;
      const rx = r.rx + g, ry = r.ry + g, rw = r.rw - g * 2, rh = r.rh - g * 2;
      if (rw <= 0 || rh <= 0) continue;

      ctx.fillStyle = tileColor(r, colorMode, isHovered ? 0.95 : 0.85);
      ctx.fillRect(rx, ry, rw, rh);

      if (isHovered) {
        const hoverTextColor = tileTextColor(r, colorMode, 0.95, bg);
        ctx.strokeStyle = hoverTextColor.includes("0,0,0") ? "#000" : "#fff";
        ctx.lineWidth = 2;
        ctx.strokeRect(rx, ry, rw, rh);
      }

      if (rw > 50 && rh > 18) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(rx + 4, ry + 2, rw - 8, rh - 4);
        ctx.clip();
        const fontSize = Math.min(13, Math.max(9, Math.min(rw / 10, rh / 3)));
        const tAlpha = isHovered ? 0.95 : 0.85;
        const tColor = tileTextColor(r, colorMode, tAlpha, bg);
        const tColorSub = tColor.replace("0.85)", "0.55)");
        ctx.font = `500 ${fontSize}px -apple-system, system-ui, sans-serif`;
        ctx.fillStyle = tColor;
        ctx.textBaseline = "top";
        const title = locale === "de" ? r.titleDe : r.title;
        ctx.fillText(title, rx + 5, ry + 4);

        if (rh > 34 && rw > 60) {
          ctx.font = `400 ${Math.max(8, fontSize - 2)}px -apple-system, system-ui, sans-serif`;
          ctx.fillStyle = tColorSub;
          ctx.fillText(tileSubInfo(r, colorMode, locale), rx + 5, ry + 4 + fontSize + 2);
        }
        ctx.restore();
      }
    }
  }, [rects, hovered, colorMode, locale]);

  useEffect(() => {
    queueMicrotask(() => {
      doLayout();
    });
    const onResize = () => doLayout();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [doLayout]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Also redraw on theme change
  useEffect(() => {
    const observer = new MutationObserver(() => draw());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [draw]);

  const hitTest = (mx: number, my: number): TreemapRect | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const cx = mx - rect.left, cy = my - rect.top;
    for (let i = rects.length - 1; i >= 0; i--) {
      const r = rects[i];
      if (cx >= r.rx && cx < r.rx + r.rw && cy >= r.ry && cy < r.ry + r.rh) return r;
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const hit = hitTest(e.clientX, e.clientY);
    if (hit !== hovered) setHovered(hit);
    if (hit) {
      setTooltipData({ d: hit, x: e.clientX, y: e.clientY });
    } else {
      setTooltipData(null);
    }
  };

  const handleMouseLeave = () => {
    setHovered(null);
    setTooltipData(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    const hit = hitTest(e.clientX, e.clientY);
    if (!hit) return;
    router.push(`/${locale}/beruf/${hit.slug}?${DEFAULT_DETAIL_QUERY}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        className="block cursor-default rounded-lg"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: hovered ? "pointer" : "default" }}
      />
      {tooltipData && (
        <Tooltip d={tooltipData.d} x={tooltipData.x} y={tooltipData.y} colorMode={colorMode} locale={locale} />
      )}
    </div>
  );
}

/** Normalized 0-100 progress for the active layer's metric. */
function layerProgress(d: Occupation, mode: ColorMode): number {
  switch (mode) {
    case "exposure":
      return (d.exposure ?? 0) * 10;
    case "outlook":
      return ((d.outlook ?? 0) + 12) / 24 * 100;
    case "pay": {
      const v = Math.max(20000, Math.min(100000, d.pay ?? 20000));
      return (Math.log(v) - Math.log(20000)) / (Math.log(100000) - Math.log(20000)) * 100;
    }
    case "education":
      return Math.max(0, EDU_LEVELS_EN.indexOf(d.education)) / (EDU_LEVELS_EN.length - 1) * 100;
    default:
      return 0;
  }
}

/** Human-readable label + value for the active layer. */
function layerMetric(d: Occupation, mode: ColorMode, de: boolean): { label: string; value: string } {
  switch (mode) {
    case "exposure": {
      const exp = d.exposure ?? 0;
      return { label: de ? "KI-Exposition" : "AI Exposure", value: `${exp}/10` };
    }
    case "outlook": {
      const o = d.outlook;
      const str = o != null ? `${o > 0 ? "+" : ""}${o}%` : "—";
      return { label: de ? "Ausblick" : "Outlook", value: `${str} ${d.outlookDesc ?? ""}`.trim() };
    }
    case "pay":
      return { label: de ? "Medianentgelt" : "Median earnings", value: formatPay(d.pay) };
    case "education":
      return { label: de ? "Ausbildung" : "Education", value: de ? d.educationDe : d.education };
    default:
      return { label: "", value: "" };
  }
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-2.5 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70">{label}</div>
      <div className="mt-0.5 text-[13px] font-semibold leading-tight">{value}</div>
    </div>
  );
}

function Tooltip({
  d,
  x,
  y,
  colorMode,
  locale,
}: {
  d: TreemapRect;
  x: number;
  y: number;
  colorMode: ColorMode;
  locale: Locale;
}) {
  const W = 340;
  let tx = x + 16;
  let ty = y - 16;
  if (tx + W > window.innerWidth) tx = x - W - 16;
  if (ty < 10) ty = y + 16;
  if (ty + 320 > window.innerHeight) ty = y - 320;

  const de = locale === "de";
  const title = de ? d.titleDe : d.title;
  const family = de ? d.iscoLabelDe : d.iscoLabel;
  const sector = de ? d.categoryDe : d.category.replace(/-/g, " ");
  const edu = de ? d.educationDe : d.education;
  const rationale = de ? d.exposureRationaleDe : d.exposureRationale;
  const accent = tileColor(d, colorMode, 1);
  const accentTrack = tileColor(d, colorMode, 0.2);
  const metric = layerMetric(d, colorMode, de);
  const progress = layerProgress(d, colorMode);

  const outlookStr =
    d.outlook != null
      ? `${d.outlook > 0 ? "+" : ""}${d.outlook}%`
      : "—";

  return (
    <div
      className="pointer-events-none fixed z-50 overflow-hidden rounded-xl border border-border/50 bg-popover text-popover-foreground shadow-2xl"
      style={{ left: tx, top: ty, width: W }}
    >
      <div className="h-[3px]" style={{ background: accent }} />

      <div className="p-4">
        <h3 className="text-[15px] font-bold leading-snug">{title}</h3>
        <p className="mt-0.5 text-[11px] text-muted-foreground capitalize">
          {family} · {sector}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <StatCell label={de ? "Medianentgelt" : "Median earnings"} value={formatPay(d.pay)} />
          <StatCell label={de ? "Beschäftigte" : "Employed"} value={formatNumber(d.jobs)} />
          <StatCell label={de ? "Ausbildung" : "Education"} value={edu} />
          <StatCell label={de ? "Ausblick" : "Outlook"} value={`${outlookStr} ${d.outlookDesc ?? ""}`} />
        </div>

        <div className="mt-3 border-t border-border/40 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">
              {metric.label}
            </span>
            <span className="text-sm font-bold tabular-nums" style={{ color: accent }}>
              {metric.value}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: accentTrack }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${progress}%`, background: accent }}
            />
          </div>
          {colorMode === "exposure" && rationale && (
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              {rationale}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
