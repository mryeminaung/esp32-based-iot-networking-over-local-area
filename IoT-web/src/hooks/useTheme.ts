import { useEffect } from "react"
import { useDashboardStore } from "@/store/use-dashboard-store"

/**
 * Keeps <html class="dark"> in sync with the store's theme value.
 * Supports "light", "dark", and "system" (follows OS preference).
 */
export function useTheme() {
  const theme = useDashboardStore((s) => s.theme)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")

    function apply() {
      const isDark =
        theme === "dark" || (theme === "system" && mq.matches)
      document.documentElement.classList.toggle("dark", isDark)
    }

    apply()

    // Re-evaluate when OS preference changes (only matters for "system")
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [theme])

  return theme
}
