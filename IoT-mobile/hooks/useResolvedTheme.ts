import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useDashboardStore } from "@/store/dashboard";
import type { Theme } from "@/types";

export function useResolvedTheme(): Theme {
  const systemScheme = useColorScheme();
  const themeMode = useDashboardStore((s) => s.themeMode);
  const resolvedTheme = useDashboardStore((s) => s.resolvedTheme);
  const resolveTheme = useDashboardStore((s) => s.resolveTheme);
  const loadTheme = useDashboardStore((s) => s.loadTheme);

  // Load saved theme on mount
  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  // Resolve theme when mode or system scheme changes
  useEffect(() => {
    resolveTheme(systemScheme ?? "light");
  }, [themeMode, systemScheme, resolveTheme]);

  return resolvedTheme;
}
