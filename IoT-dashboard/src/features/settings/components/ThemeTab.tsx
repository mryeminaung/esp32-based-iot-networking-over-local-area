import { useDashboardStore } from "@/store/use-dashboard-store"

export default function ThemeTab() {
  const theme = useDashboardStore((s) => s.theme)
  const toggleTheme = useDashboardStore((s) => s.toggleTheme)

  return (
    <div className="card space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Theme Preference
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Choose your preferred color theme for the dashboard.
        </p>
      </div>

      <div className="flex gap-4">
        {/* Light theme option */}
        <button
          onClick={() => theme !== "light" && toggleTheme()}
          className={`flex-1 p-4 rounded-xl border-2 transition-all cursor-pointer ${
            theme === "light"
              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <div className="w-full h-24 rounded-lg bg-white border border-gray-200 mb-3 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Light</p>
          {theme === "light" && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Active</p>
          )}
        </button>

        {/* Dark theme option */}
        <button
          onClick={() => theme !== "dark" && toggleTheme()}
          className={`flex-1 p-4 rounded-xl border-2 transition-all cursor-pointer ${
            theme === "dark"
              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <div className="w-full h-24 rounded-lg bg-gray-900 border border-gray-700 mb-3 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Dark</p>
          {theme === "dark" && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Active</p>
          )}
        </button>
      </div>
    </div>
  )
}
