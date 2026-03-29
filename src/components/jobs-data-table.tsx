"use client";

import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import type { Occupation } from "@/lib/data";
import { exposureColor } from "@/lib/colors";
import type { ExplorerSort } from "@/lib/explorer-params";
import type { Locale } from "@/lib/locale";

function exposureBar(score: number | null) {
  if (score == null) return <span className="text-muted-foreground">—</span>;
  const pct = (score / 10) * 100;
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden min-w-[64px]">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: exposureColor(score, 1),
          }}
        />
      </div>
      <span className="tabular-nums text-sm font-semibold w-5 text-right">{score}</span>
    </div>
  );
}

export function sortToSortingState(s: ExplorerSort): SortingState {
  switch (s) {
    case "exposure-desc":
      return [{ id: "exposure", desc: true }];
    case "exposure-asc":
      return [{ id: "exposure", desc: false }];
    case "jobs-desc":
      return [{ id: "jobs", desc: true }];
    case "pay-desc":
      return [{ id: "pay", desc: true }];
    case "title-asc":
      return [{ id: "title", desc: false }];
    default:
      return [{ id: "exposure", desc: true }];
  }
}

export function sortingStateToExplorerSort(st: SortingState): ExplorerSort | null {
  const x = st[0];
  if (!x) return null;
  if (x.id === "exposure") return x.desc ? "exposure-desc" : "exposure-asc";
  if (x.id === "jobs") return "jobs-desc";
  if (x.id === "pay") return "pay-desc";
  if (x.id === "title") return "title-asc";
  return null;
}

interface JobsDataTableProps {
  data: Occupation[];
  locale: Locale;
  sort: ExplorerSort;
  onSortChange: (s: ExplorerSort) => void;
  listQuery: string;
  /** Denominator for employment share (e.g. total national jobs). */
  nationalJobsTotal: number;
}

export function JobsDataTable({
  data,
  locale,
  sort,
  onSortChange,
  listQuery,
  nationalJobsTotal,
}: JobsDataTableProps) {
  const de = locale === "de";
  const sorting = useMemo(() => sortToSortingState(sort), [sort]);

  const columns = useMemo<ColumnDef<Occupation>[]>(
    () => [
      {
        id: "title",
        accessorFn: (r) => (de ? r.titleDe : r.title),
        header: de ? "Beruf" : "Occupation",
        enableSorting: true,
        cell: ({ row }) => {
          const o = row.original;
          const title = de ? o.titleDe : o.title;
          const sub = `${de ? o.iscoLabelDe : o.iscoLabel} · ÖNACE ${o.onaceSection}`;
          const q = listQuery ? `?${listQuery}` : "";
          return (
            <div className="space-y-0.5 py-1">
              <Link
                href={`/${locale}/beruf/${o.slug}${q}`}
                className="font-semibold text-foreground hover:underline underline-offset-2"
              >
                {title}
              </Link>
              <div className="text-[11px] text-muted-foreground line-clamp-1">{sub}</div>
            </div>
          );
        },
      },
      {
        id: "family",
        accessorFn: (r) => (de ? r.iscoLabelDe : r.iscoLabel),
        header: de ? "ISCO-Familie" : "ISCO family",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="py-1">
            <div className="text-sm">{de ? row.original.iscoLabelDe : row.original.iscoLabel}</div>
            <div className="text-[11px] text-muted-foreground">ISCO {row.original.iscoMajor}</div>
          </div>
        ),
      },
      {
        id: "sector",
        accessorFn: (r) => `${r.onaceSection} ${de ? r.categoryDe : r.category}`,
        header: de ? "Sektor" : "Sector",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="py-1">
            <div className="text-sm">{de ? row.original.categoryDe : row.original.category}</div>
            <div className="text-[11px] text-muted-foreground">ÖNACE {row.original.onaceSection}</div>
          </div>
        ),
      },
      {
        id: "exposure",
        accessorFn: (r) => r.exposure ?? -1,
        header: de ? "KI-Einfluss" : "AI impact",
        enableSorting: true,
        cell: ({ row }) => exposureBar(row.original.exposure),
      },
      {
        id: "jobs",
        accessorFn: (r) => r.jobs ?? 0,
        header: de ? "Beschäftigte" : "Employees",
        enableSorting: true,
        cell: ({ row }) => {
          const j = row.original.jobs ?? 0;
          const pct = nationalJobsTotal > 0 ? (j / nationalJobsTotal) * 100 : 0;
          return (
            <div className="text-right tabular-nums">
              <div>{j.toLocaleString(de ? "de-AT" : "en-US")}</div>
              <div className="text-[11px] text-muted-foreground">{pct.toFixed(1)}%</div>
            </div>
          );
        },
      },
      {
        id: "pay",
        accessorFn: (r) => r.pay ?? 0,
        header: de ? "Entgelt/Mo." : "Monthly €",
        enableSorting: true,
        cell: ({ row }) => {
          const p = row.original.pay;
          if (p == null) return "—";
          const mo = Math.round(p / 12);
          return (
            <span className="tabular-nums">
              €{mo.toLocaleString(de ? "de-AT" : "en-US")}
            </span>
          );
        },
      },
      {
        id: "education",
        accessorFn: (r) => (de ? r.educationDe : r.education),
        header: de ? "Niveau" : "Education",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground line-clamp-2">
            {de ? row.original.educationDe : row.original.education}
          </span>
        ),
      },
    ],
    [de, locale, listQuery, nationalJobsTotal]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: (up) => {
      const next = typeof up === "function" ? up(sorting) : up;
      const mapped = sortingStateToExplorerSort(next);
      if (mapped) onSortChange(mapped);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-xl border border-border/80 bg-card/40 backdrop-blur-sm overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border/60 bg-muted/30">
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="text-left px-3 py-2.5 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >
                    {h.isPlaceholder ? null : (
                      <button
                        type="button"
                        className={
                          h.column.getCanSort()
                            ? "inline-flex items-center gap-1 hover:text-foreground cursor-pointer"
                            : ""
                        }
                        onClick={h.column.getToggleSortingHandler()}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getIsSorted() === "asc"
                          ? " ↑"
                          : h.column.getIsSorted() === "desc"
                            ? " ↓"
                            : null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/40 hover:bg-muted/25 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2.5 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
