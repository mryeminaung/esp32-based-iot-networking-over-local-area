import { useEffect } from "react"
import { useDashboardStore } from "@/store/use-dashboard-store"

/**
 * Keeps <html class="dark"> in sync with the store's theme value.
 */
export function useTheme() {
  const theme = useDashboardStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return theme
}
