"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/locale-context";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  BarChart3,
  Search,
  GitCompare,
  TestTube2,
  BookOpen,
  Info,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/",
    icon: BarChart3,
    labelEn: "Treemap",
    labelDe: "Treemap",
    homeView: "treemap",
  },
  {
    href: "/?view=explorer",
    icon: Search,
    labelEn: "Explorer",
    labelDe: "Explorer",
    homeView: "explorer",
  },
  {
    href: "/comparison",
    icon: GitCompare,
    labelEn: "AT vs US",
    labelDe: "AT vs US",
  },
  { href: "/tests", icon: TestTube2, labelEn: "Tests", labelDe: "Tests" },
  { href: "/sources", icon: BookOpen, labelEn: "Sources", labelDe: "Quellen" },
  { href: "/about", icon: Info, labelEn: "About", labelDe: "Über" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const de = locale === "de";
  const base = `/${locale}`;
  const currentHomeView = searchParams.get("view") ?? "treemap";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo / Site name */}
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
              {de ? "KI-Exposition Österreich" : "AI Exposure Austria"}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1 min-w-0 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const itemPath = item.href === "/" ? base : `${base}${item.href}`;
              const active = item.homeView
                ? (pathname === base || pathname === `${base}/`) &&
                  currentHomeView === item.homeView
                : pathname.startsWith(`${base}${item.href}`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={itemPath}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-2 lg:px-3 py-1.5 rounded-md text-sm shrink-0 transition-colors ${
                    active
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="hidden lg:block h-3.5 w-3.5" />
                  {de ? item.labelDe : item.labelEn}
                </Link>
              );
            })}
          </div>

          {/* Right side: toggles */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const itemPath = item.href === "/" ? base : `${base}${item.href}`;
              const active = item.homeView
                ? (pathname === base || pathname === `${base}/`) &&
                  currentHomeView === item.homeView
                : pathname.startsWith(`${base}${item.href}`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={itemPath}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
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
