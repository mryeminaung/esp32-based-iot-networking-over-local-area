import { Calendar } from "lucide-react"

const PRESETS = [
 { value: "24h", label: "24h", fullLabel: "24 Hours", days: 1 },
 { value: "7d", label: "7d", fullLabel: "7 Days", days: 7 },
 { value: "30d", label: "30d", fullLabel: "30 Days", days: 30 },
 { value: "90d", label: "90d", fullLabel: "90 Days", days: 90 },
]

type DateRangePickerProps = {
 preset: string
 onChange: (preset: string) => void
}

export default function DateRangePicker({ preset, onChange }: DateRangePickerProps) {
 return (
 <div className="flex items-center gap-2 flex-wrap">
 <Calendar className="w-4 h-4 text-text-muted shrink-0" />
 <div className="flex rounded-lg border border-border overflow-hidden">
 {PRESETS.map((p) => (
 <button
 key={p.value}
 onClick={() => onChange(p.value)}
 className={`px-2.5 sm:px-3 py-2 min-h-[40px] text-xs font-medium transition-colors ${
 preset === p.value
 ? "bg-green text-white"
 : "bg-bg-card text-text-secondary hover:bg-bg-muted"
 }`}
 >
 <span className="sm:hidden">{p.label}</span>
 <span className="hidden sm:inline">{p.fullLabel}</span>
 </button>
 ))}
 </div>
 </div>
 )
}

export function getDateRange(preset: string): { from: string; to: string } {
 const now = new Date()
 const to = now.toISOString().split("T")[0]

 const p = PRESETS.find((pr) => pr.value === preset)
 const days = p?.days ?? 7

 const from = new Date(now)
 from.setDate(from.getDate() - days)

 return {
 from: from.toISOString().split("T")[0],
 to,
 }
}
