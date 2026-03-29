"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useLocale } from "@/lib/locale-context";

const noopSubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { locale } = useLocale();
  const de = locale === "de";
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
  if (!mounted) return <div className="h-9 w-24" />;

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-0.5">
      <Button
        variant={theme === "light" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => setTheme("light")}
        aria-label={de ? "Helles Design" : "Light mode"}
      >
        <Sun className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant={theme === "dark" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => setTheme("dark")}
        aria-label={de ? "Dunkles Design" : "Dark mode"}
      >
        <Moon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant={theme === "system" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => setTheme("system")}
        aria-label={de ? "Systemeinstellung" : "System mode"}
      >
        <Monitor className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
