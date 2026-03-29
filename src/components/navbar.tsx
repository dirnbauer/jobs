"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/locale-context";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  BarChart3,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  href: string;
  labelEn: string;
  labelDe: string;
  homeView?: string;
}

const PRIMARY: NavItem[] = [
  { href: "/", labelEn: "Treemap", labelDe: "Treemap", homeView: "treemap" },
  { href: "/?view=explorer", labelEn: "Occupations", labelDe: "Berufsgruppen", homeView: "explorer" },
  { href: "/?view=families", labelEn: "Families", labelDe: "Hauptgruppen", homeView: "families" },
  { href: "/?view=sectors", labelEn: "Sectors", labelDe: "Sektoren", homeView: "sectors" },
  { href: "/comparison", labelEn: "AT vs US", labelDe: "AT vs US" },
];

const SECONDARY: NavItem[] = [
  { href: "/tests", labelEn: "Tests", labelDe: "Tests" },
  { href: "/sources", labelEn: "Sources", labelDe: "Quellen" },
  { href: "/about", labelEn: "About", labelDe: "Über" },
];

const ALL_ITEMS = [...PRIMARY, ...SECONDARY];

function isActive(item: NavItem, pathname: string, base: string, currentHomeView: string) {
  if (item.homeView) {
    return (pathname === base || pathname === `${base}/`) && currentHomeView === item.homeView;
  }
  return pathname.startsWith(`${base}${item.href}`);
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const de = locale === "de";
  const base = `/${locale}`;
  const currentHomeView = searchParams.get("view") ?? "treemap";

  useEffect(() => {
    if (!moreOpen) return;
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreOpen]);

  const anySecondaryActive = SECONDARY.some((item) =>
    isActive(item, pathname, base, currentHomeView)
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link
            href={base}
            className="flex items-center gap-2 shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <BarChart3
              className="h-5 w-5"
              style={{ color: "var(--webcon-primary)" }}
            />
            <span className="font-semibold text-sm sm:text-base tracking-tight">
              {de ? "KI-Einfluss Österreich" : "AI Impact Austria"}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {PRIMARY.map((item) => {
              const itemPath = item.href === "/" ? base : `${base}${item.href}`;
              const active = isActive(item, pathname, base, currentHomeView);
              return (
                <Link
                  key={item.href}
                  href={itemPath}
                  className={`whitespace-nowrap px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {de ? item.labelDe : item.labelEn}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1 whitespace-nowrap px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                  anySecondaryActive
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {de ? "Mehr" : "More"}
                <ChevronDown className={`h-3 w-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 min-w-[140px] rounded-lg border border-border bg-popover p-1 shadow-lg">
                  {SECONDARY.map((item) => {
                    const itemPath = `${base}${item.href}`;
                    const active = isActive(item, pathname, base, currentHomeView);
                    return (
                      <Link
                        key={item.href}
                        href={itemPath}
                        onClick={() => setMoreOpen(false)}
                        className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                          active
                            ? "bg-secondary font-medium text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        {de ? item.labelDe : item.labelEn}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label={de ? "Menü öffnen" : "Toggle menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">
            {ALL_ITEMS.map((item) => {
              const itemPath = item.href === "/" ? base : `${base}${item.href}`;
              const active = isActive(item, pathname, base, currentHomeView);
              return (
                <Link
                  key={item.href}
                  href={itemPath}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {de ? item.labelDe : item.labelEn}
                </Link>
              );
            })}

            <div className="flex items-center gap-2 pt-3 border-t border-border mt-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
