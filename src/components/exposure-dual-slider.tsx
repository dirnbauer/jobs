"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

interface ExposureDualSliderProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  label: string;
  locale: "de" | "en";
}

const LARGE_STEP = 2;

/**
 * Range slider (Schieberegler) for KI-Exposition 0–10.
 * Two handles with a gradient track (cool → warm).
 */
export function ExposureDualSlider({
  min,
  max,
  onChange,
  label,
  locale,
}: ExposureDualSliderProps) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const hintMinId = `${baseId}-hint-min`;
  const hintMaxId = `${baseId}-hint-max`;

  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"low" | "high" | null>(null);

  const clamp = (v: number) => Math.max(0, Math.min(10, Math.round(v)));
  const setFromClientX = useCallback(
    (clientX: number, which: "low" | "high") => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const t = (clientX - r.left) / r.width;
      const v = clamp(t * 10);
      if (which === "low") {
        const next = Math.min(v, max);
        onChange(next, max);
      } else {
        const next = Math.max(v, min);
        onChange(min, next);
      }
    },
    [min, max, onChange]
  );

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      setFromClientX(e.clientX, dragging);
    };

    const handlePointerUp = () => {
      setDragging(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [dragging, setFromClientX]);

  const startDrag = useCallback(
    (clientX: number, which: "low" | "high") => {
      setDragging(which);
      setFromClientX(clientX, which);
    },
    [setFromClientX]
  );

  const onHandlePointerDown = (which: "low" | "high") => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, which);
  };

  const onThumbKeyDown = useCallback(
    (which: "low" | "high") => (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? LARGE_STEP : 1;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown": {
          e.preventDefault();
          if (which === "low") {
            onChange(Math.max(0, min - step), max);
          } else {
            onChange(min, Math.max(min, max - step));
          }
          break;
        }
        case "ArrowRight":
        case "ArrowUp": {
          e.preventDefault();
          if (which === "low") {
            onChange(Math.min(max, min + step), max);
          } else {
            onChange(min, Math.min(10, max + step));
          }
          break;
        }
        case "Home": {
          e.preventDefault();
          if (which === "low") {
            onChange(0, max);
          } else {
            onChange(min, min);
          }
          break;
        }
        case "End": {
          e.preventDefault();
          if (which === "low") {
            onChange(max, max);
          } else {
            onChange(min, 10);
          }
          break;
        }
        case "PageDown": {
          e.preventDefault();
          if (which === "low") {
            onChange(Math.max(0, min - LARGE_STEP), max);
          } else {
            onChange(min, Math.max(min, max - LARGE_STEP));
          }
          break;
        }
        case "PageUp": {
          e.preventDefault();
          if (which === "low") {
            onChange(Math.min(max, min + LARGE_STEP), max);
          } else {
            onChange(min, Math.min(10, max + LARGE_STEP));
          }
          break;
        }
        default:
          break;
      }
    },
    [min, max, onChange]
  );

  const leftPct = (min / 10) * 100;
  const widthPct = ((max - min) / 10) * 100;

  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pointerPct = ((e.clientX - rect.left) / rect.width) * 100;
    const distanceToLow = Math.abs(leftPct - pointerPct);
    const distanceToHigh = Math.abs(leftPct + widthPct - pointerPct);
    startDrag(e.clientX, distanceToLow <= distanceToHigh ? "low" : "high");
  };

  const de = locale === "de";
  const lowAriaLabel = de ? "Mindest-Exposition" : "Minimum exposure";
  const highAriaLabel = de ? "Höchst-Exposition" : "Maximum exposure";
  const lowValueText = de ? `${min} von 10` : `${min} of 10`;
  const highValueText = de ? `${max} von 10` : `${max} of 10`;

  const thumbClass =
    "absolute top-1/2 z-10 h-5 w-5 -ml-2.5 rounded-full border-2 border-primary bg-background shadow-md cursor-grab touch-none active:cursor-grabbing " +
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <div className="space-y-2 w-full max-w-md">
      <div className="flex justify-between items-baseline gap-2">
        <span
          id={labelId}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </span>
        <span className="text-sm tabular-nums font-medium text-foreground" aria-hidden="true">
          {min} – {max}
        </span>
      </div>
      <div
        ref={trackRef}
        className="relative h-9 flex items-center touch-none select-none"
        onPointerDown={onTrackPointerDown}
        role="group"
        aria-labelledby={labelId}
        aria-describedby={`${hintMinId} ${hintMaxId}`}
      >
        {/* Track background */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2.5 rounded-full overflow-hidden border border-border/60 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg, rgb(34 197 94 / 0.85), rgb(250 204 21 / 0.9), rgb(239 68 68 / 0.95))",
          }}
        />
        {/* Dimmed outside selection */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2.5 bg-background/55 rounded-l-full pointer-events-none"
          aria-hidden="true"
          style={{ left: 0, width: `${leftPct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2.5 bg-background/55 rounded-r-full pointer-events-none"
          aria-hidden="true"
          style={{ left: `${leftPct + widthPct}%`, right: 0 }}
        />
        {/* Handles — role="slider" per WAI-ARIA range pattern */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={lowAriaLabel}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={min}
          aria-valuetext={lowValueText}
          className={thumbClass}
          style={{ left: `${leftPct}%` }}
          onPointerDown={onHandlePointerDown("low")}
          onKeyDown={onThumbKeyDown("low")}
        />
        <div
          role="slider"
          tabIndex={0}
          aria-label={highAriaLabel}
          aria-orientation="horizontal"
          aria-valuemin={min}
          aria-valuemax={10}
          aria-valuenow={max}
          aria-valuetext={highValueText}
          className={thumbClass}
          style={{ left: `${leftPct + widthPct}%` }}
          onPointerDown={onHandlePointerDown("high")}
          onKeyDown={onThumbKeyDown("high")}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wide">
        <span id={hintMinId}>{de ? "Sicher" : "Safer"}</span>
        <span id={hintMaxId}>{de ? "Exponiert" : "Exposed"}</span>
      </div>
    </div>
  );
}
