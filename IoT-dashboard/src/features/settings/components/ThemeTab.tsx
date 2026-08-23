import { useDashboardStore } from "@/store/use-dashboard-store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ThemeTab() {
 const theme = useDashboardStore((s) => s.theme)
 const toggleTheme = useDashboardStore((s) => s.toggleTheme)

 return (
 <Card className="space-y-5">
 <CardContent className="space-y-5">
 <div>
 <h2 className="text-base font-semibold text-text-primary">
 Theme Preference
 </h2>
 <p className="text-sm text-text-muted mt-0.5">
 Choose your preferred color theme for the dashboard.
 </p>
 </div>

 <div className="flex gap-4">
 {/* Light theme option */}
 <Button
 variant="outline"
 onClick={() => theme !== "light" && toggleTheme()}
 className={`flex-1 p-4 h-auto rounded-xl border-2 ${
 theme === "light"
 ? "border-green-500 bg-green-50 "
 : "border-border hover:border-border-strong"
 }`}>
 <div className="w-full">
 <div className="w-full h-24 rounded-lg bg-white border border-gray-200 mb-3 flex items-center justify-center">
 <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200" />
 </div>
 <p className="text-sm font-medium text-text-primary">Light</p>
 {theme === "light" && (
 <p className="text-xs text-green-600 mt-1">Active</p>
 )}
 </div>
 </Button>

 {/* Dark theme option */}
 <Button
 variant="outline"
 onClick={() => theme !== "dark" && toggleTheme()}
 className={`flex-1 p-4 h-auto rounded-xl border-2 ${
 theme === "dark"
 ? "border-green-500 bg-green-50 "
 : "border-border hover:border-border-strong"
 }`}>
 <div className="w-full">
 <div className="w-full h-24 rounded-lg bg-gray-900 border border-gray-700 mb-3 flex items-center justify-center">
 <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700" />
 </div>
 <p className="text-sm font-medium text-text-primary">Dark</p>
 {theme === "dark" && (
 <p className="text-xs text-green-600 mt-1">Active</p>
 )}
 </div>
 </Button>
 </div>
 </CardContent>
 </Card>
 )
}
