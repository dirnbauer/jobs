"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale-context";
import type { Locale } from "@/lib/locale";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const go = (next: Locale) => {
    if (next === locale) return;
    setLocale(next);
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] === "en" || parts[0] === "de") {
      parts[0] = next;
    } else {
      parts.unshift(next);
    }
    router.push("/" + parts.join("/"));
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-0.5">
      <Button
        variant={locale === "en" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2 text-xs font-medium"
        onClick={() => go("en")}
      >
        EN
      </Button>
      <Button
        variant={locale === "de" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2 text-xs font-medium"
        onClick={() => go("de")}
      >
        DE
      </Button>
    </div>
  );
}
