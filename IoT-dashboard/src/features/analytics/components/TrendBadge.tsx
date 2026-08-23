import { TrendingUp, TrendingDown, Minus } from "lucide-react"

type TrendBadgeProps = {
 current: number | null
 previous: number | null
 unit?: string
 invert?: boolean // for airQuality: lower is better
}

export default function TrendBadge({ current, previous, unit = "", invert = false }: TrendBadgeProps) {
 if (current === null || previous === null) {
 return <span className="text-xs text-text-muted">—</span>
 }

 const diff = current - previous
 const threshold = 0.5

 let trend: "up" | "down" | "stable"
 if (Math.abs(diff) < threshold) {
 trend = "stable"
 } else if ((diff > 0 && !invert) || (diff < 0 && invert)) {
 trend = "up"
 } else {
 trend = "down"
 }

 const colors = {
 up: invert
 ? "text-red-500 bg-red-50 "
 : "text-green-600 bg-green-50 ",
 down: invert
 ? "text-green-600 bg-green-50 "
 : "text-red-500 bg-red-50 ",
 stable: "text-text-muted bg-bg-muted",
 }

 const icons = {
 up: TrendingUp,
 down: TrendingDown,
 stable: Minus,
 }

 const Icon = icons[trend]

 return (
 <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${colors[trend]}`}>
 <Icon className="w-3 h-3" />
 {Math.abs(diff).toFixed(1)}{unit}
 </span>
 )
}
