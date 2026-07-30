import { useEffect } from "react"
import { useDashboardStore } from "@/store/dashboard"

/**
 * Keeps <html data-theme> in sync with the store's theme value.
 */
export function useTheme() {
  const theme = useDashboardStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return theme
}
