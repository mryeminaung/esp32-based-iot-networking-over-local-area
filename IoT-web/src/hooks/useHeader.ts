import { useEffect } from "react"
import { useHeaderStore } from "@/store/use-header-store"

const APP_NAME = "Smart Agriculture"

/**
 * Sets the browser tab title and TopBar title for the current page.
 * Call this at the top of any page component.
 *
 * @example
 * useHeader("Sensors")
 * useHeader("Dashboard", { tab: "Home" })
 */
export function useHeader(
  title: string,
  options?: { tab?: string }
) {
  const setTitle = useHeaderStore((s) => s.setTitle)

  useEffect(() => {
    // Set TopBar title
    setTitle(title)

    // Set browser tab title
    document.title = options?.tab
      ? `${options.tab} — ${APP_NAME}`
      : `${title} — ${APP_NAME}`

    // Reset on unmount
    return () => {
      setTitle("Dashboard")
      document.title = APP_NAME
    }
  }, [title, options?.tab, setTitle])
}
