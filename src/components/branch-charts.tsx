"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { exposureColor } from "@/lib/colors";
import type { Occupation } from "@/lib/data";

interface BranchChartsProps {
  rows: Occupation[];
  locale: "de" | "en";
  branchLabel: string;
}

const PIE_PALETTE = [
  "#0284c7", // blue
  "#dc2626", // red
  "#16a34a", // green
  "#f59e0b", // amber
  "#7c3aed", // purple
  "#ea580c", // orange
  "#06b6d4", // cyan
  "#db2777", // pink
];

function scoreBarColor(score: number): string {
  return exposureColor(score, 0.95);
}

function exposureHistogramJobs(rows: Occupation[]): { x: number[]; y: number[] } {
  const y = new Array(11).fill(0);
  for (const o of rows) {
    if (o.exposure != null && o.jobs) y[o.exposure] += o.jobs;
  }
  return { x: y.map((_, i) => i), y };
}

export function BranchCharts({ rows, locale, branchLabel }: BranchChartsProps) {
  const de = locale === "de";
  const numberLocale = de ? "de-AT" : "en-US";

  const histogramData = useMemo(() => {
    const { x, y } = exposureHistogramJobs(rows);
    return x.map((score, i) => ({
      score,
      jobs: y[i] as number,
      fill: scoreBarColor(score),
    }));
  }, [rows]);

  const topOccupations = useMemo(
    () =>
      [...rows]
        .filter((o) => (o.jobs ?? 0) > 0)
        .sort((a, b) => (b.jobs ?? 0) - (a.jobs ?? 0))
        .slice(0, 8),
    [rows]
  );

  const pieTotal = useMemo(
    () => topOccupations.reduce((s, o) => s + (o.jobs ?? 0), 0),
    [topOccupations]
  );

  const pieData = useMemo(
    () =>
      topOccupations.map((o, i) => {
        const value = o.jobs ?? 0;
        const pct = pieTotal > 0 ? ((value / pieTotal) * 100).toFixed(1) : "0";
        return {
          name: `${i + 1}. ${(de ? o.titleDe : o.title).slice(0, 36)}`,
          value,
          pct: `${pct}%`,
          fill: PIE_PALETTE[i % PIE_PALETTE.length],
        };
      }),
    [topOccupations, de, pieTotal]
  );

  const barConfig = {
    jobs: {
      label: de ? "Beschäftigte" : "Employees",
      color: "var(--webcon-primary, #1b7a95)",
    },
  } satisfies ChartConfig;

  const pieChartConfig = useMemo(() => {
    const cfg: ChartConfig = {};
    pieData.forEach((d) => {
      cfg[d.name] = { label: d.name, color: d.fill };
    });
    return cfg;
  }, [pieData]);

  const showPie = rows.length > 1;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold mb-2 text-foreground/90">
          {de ? "Beschäftigung nach KI-Einfluss (0–10)" : "Employment by AI impact (0–10)"}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">{branchLabel}</p>
        <ChartContainer
          config={barConfig}
          className="aspect-auto h-[280px] w-full overflow-hidden rounded-2xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50 to-cyan-100/70 shadow-[0_24px_70px_-34px_rgba(14,116,144,0.48)] dark:border-cyan-900/60 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/40 [&_.recharts-cartesian-grid_line]:stroke-sky-200/80 dark:[&_.recharts-cartesian-grid_line]:stroke-slate-700/80 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-sky-200/30 dark:[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-cyan-400/12"
        >
          <BarChart
            data={histogramData}
            margin={{ top: 16, right: 20, left: 28, bottom: 16 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="score"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12, fontWeight: 500 }}
              label={{
                value: de ? "KI-Score" : "AI score",
                position: "insideBottom",
                offset: -2,
                className: "fill-muted-foreground text-[11px]",
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => Number(v).toLocaleString(numberLocale)}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12, fontWeight: 500 }}
              label={{
                value: de ? "Beschäftigte" : "Employees",
                angle: -90,
                position: "insideLeft",
                offset: -8,
                style: { textAnchor: "middle" },
                className: "fill-muted-foreground text-[11px]",
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { score?: number } | undefined;
                    const s = p?.score;
                    if (s == null) return "";
                    return de ? `Score ${s}/10` : `Score ${s}/10`;
                  }}
                  formatter={(value) => (
                    <span className="font-mono tabular-nums">
                      {typeof value === "number"
                        ? value.toLocaleString(numberLocale)
                        : String(value)}
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="jobs"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
              animationBegin={0}
            >
              {histogramData.map((entry) => (
                <Cell key={`bar-${entry.score}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      {showPie ? (
        <div>
          <h3 className="text-base font-semibold mb-2 text-foreground/90">
            {de ? "Arbeitsplatz-Anteile (Top 8 Gruppen)" : "Job share (top 8 groups)"}
          </h3>
          <ChartContainer
            config={pieChartConfig}
            className="aspect-auto h-[420px] w-full overflow-visible rounded-2xl border border-fuchsia-200/60 bg-gradient-to-br from-white via-rose-50 to-amber-50 shadow-[0_24px_70px_-34px_rgba(190,24,93,0.28)] dark:border-fuchsia-900/40 dark:from-slate-950 dark:via-slate-900 dark:to-fuchsia-950/30 mx-auto"
          >
            <PieChart margin={{ top: 24, right: 140, bottom: 24, left: 140 }}>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="name"
                    formatter={(value) => (
                      <span className="font-mono tabular-nums">
                        {typeof value === "number"
                          ? value.toLocaleString(numberLocale)
                          : String(value)}
                      </span>
                    )}
                  />
                }
              />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="38%"
                outerRadius="58%"
                paddingAngle={3}
                stroke="rgba(255,255,255,0.9)"
                strokeWidth={2}
                isAnimationActive
                animationDuration={1000}
                animationEasing="ease-out"
                animationBegin={150}
                label={(props: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ any) => {
                  const { cx: cxVal, cy: cyVal, midAngle, outerRadius: oR, name, value, pct, fill } = props;
                  if (cxVal == null || cyVal == null || midAngle == null || oR == null) return null;
                  const RADIAN = Math.PI / 180;
                  const cx0 = Number(cxVal);
                  const cy0 = Number(cyVal);
                  const or0 = Number(oR);
                  // point on outer edge of donut
                  const sx = cx0 + or0 * Math.cos(-midAngle * RADIAN);
                  const sy = cy0 + or0 * Math.sin(-midAngle * RADIAN);
                  // elbow point
                  const mx = cx0 + (or0 + 18) * Math.cos(-midAngle * RADIAN);
                  const my = cy0 + (or0 + 18) * Math.sin(-midAngle * RADIAN);
                  // endpoint extending horizontally
                  const isRight = midAngle <= 90 || midAngle > 270;
                  const ex = mx + (isRight ? 16 : -16);
                  const anchor = isRight ? "start" : "end";
                  const formatted = typeof value === "number" ? value.toLocaleString(numberLocale) : String(value);
                  return (
                    <g>
                      <path
                        d={`M${sx},${sy}L${mx},${my}L${ex},${my}`}
                        stroke={fill}
                        strokeWidth={1.5}
                        fill="none"
                      />
                      <circle cx={sx} cy={sy} r={2.5} fill={fill} />
                      <text
                        x={ex + (isRight ? 4 : -4)}
                        y={my - 7}
                        textAnchor={anchor}
                        className="fill-foreground text-[11px] font-semibold"
                      >
                        {name}
                      </text>
                      <text
                        x={ex + (isRight ? 4 : -4)}
                        y={my + 7}
                        textAnchor={anchor}
                        className="fill-muted-foreground text-[10px] font-medium"
                      >
                        {formatted} ({pct})
                      </text>
                    </g>
                  );
                }}
                labelLine={false}
              >
                {pieData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {de
            ? "In diesem Abschnitt liegt nur eine Berufsgruppe vor — ein Anteilsdiagramm wäre trivial (100%). Details siehe Liste unten."
            : "This section has only one occupation group — a share chart would be trivial (100%). See the list below."}
        </p>
      )}
    </div>
  );
}
