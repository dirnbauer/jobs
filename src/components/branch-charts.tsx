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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Occupation } from "@/lib/data";

interface BranchChartsProps {
  rows: Occupation[];
  locale: "de" | "en";
  branchLabel: string;
}

const PIE_PALETTE = [
  "#5470C6",
  "#91CC75",
  "#FAC858",
  "#EE6666",
  "#73C0DE",
  "#3BA272",
  "#FC8452",
  "#9A60B4",
];

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
    return x.map((score, i) => ({ score, jobs: y[i] as number }));
  }, [rows]);

  const topOccupations = useMemo(
    () =>
      [...rows]
        .filter((o) => (o.jobs ?? 0) > 0)
        .sort((a, b) => (b.jobs ?? 0) - (a.jobs ?? 0))
        .slice(0, 8),
    [rows]
  );

  const pieData = useMemo(
    () =>
      topOccupations.map((o, i) => ({
        name: `${i + 1}. ${(de ? o.titleDe : o.title).slice(0, 36)}`,
        value: o.jobs ?? 0,
        fill: PIE_PALETTE[i % PIE_PALETTE.length],
      })),
    [topOccupations, de]
  );

  const barConfig = {
    jobs: {
      label: de ? "Beschäftigte" : "Employees",
      color: "hsl(217 91% 60%)",
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
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-2 text-foreground/90">
          {de ? "Beschäftigung nach KI-Exposition (0–10)" : "Employment by AI exposure (0–10)"}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">{branchLabel}</p>
        <ChartContainer
          config={barConfig}
          className="aspect-auto h-[260px] w-full rounded-lg border border-border/60 bg-black/20 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/30"
        >
          <BarChart
            data={histogramData}
            margin={{ top: 12, right: 12, left: 20, bottom: 4 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis
              dataKey="score"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
              fill="var(--color-jobs)"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
              animationBegin={0}
            />
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
            className="aspect-auto h-[320px] w-full rounded-lg border border-border/60 bg-black/20 mx-auto"
          >
            <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
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
                outerRadius="68%"
                paddingAngle={2}
                stroke="transparent"
                isAnimationActive
                animationDuration={1000}
                animationEasing="ease-out"
                animationBegin={150}
              >
                {pieData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={
                  <ChartLegendContent
                    nameKey="name"
                    className="max-h-[120px] flex-wrap gap-x-3 gap-y-1 text-[11px] leading-tight"
                  />
                }
                verticalAlign="bottom"
              />
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
