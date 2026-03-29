"use client";

import { useId } from "react";
import { Slider } from "@/components/ui/slider";

interface ExposureDualSliderProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  label: string;
  locale: "de" | "en";
}

export function ExposureDualSlider({
  min,
  max,
  onChange,
  label,
  locale,
}: ExposureDualSliderProps) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const de = locale === "de";

  return (
    <div className="space-y-3 w-full max-w-md">
      <div className="flex justify-between items-baseline gap-2">
        <label
          id={labelId}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
        <span className="text-sm tabular-nums font-medium text-foreground">
          {min} – {max}
        </span>
      </div>

      <div className="px-1.5">
        <Slider
          value={[min, max]}
          min={0}
          max={10}
          step={1}
          aria-labelledby={labelId}
          onValueChange={(val) => {
            if (Array.isArray(val)) onChange(val[0], val[1]);
          }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground px-1">
        {Array.from({ length: 11 }, (_, i) => (
          <span key={i} className="tabular-nums w-3 text-center">
            {i}
          </span>
        ))}
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wide">
        <span>{de ? "Sicher" : "Low risk"}</span>
        <span>{de ? "Exponiert" : "High risk"}</span>
      </div>
    </div>
  );
}
