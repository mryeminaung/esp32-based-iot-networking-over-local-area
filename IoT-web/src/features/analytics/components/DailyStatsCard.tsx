import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type DailyStatsCardProps = {
 icon: LucideIcon
 label: string
 value: number | null
 avg: number | null
 unit: string
 iconClass: string
}

export default function DailyStatsCard({
 icon: Icon,
 label,
 value,
 avg,
 unit,
 iconClass,
}: DailyStatsCardProps) {
 const displayValue = value ?? avg

 return (
 <Card>
 <CardContent className="flex items-center gap-3">
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
 <Icon className="w-5 h-5" />
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-xs text-text-muted">{label}</p>
 <div className="flex items-center gap-1.5 mt-0.5">
	 <span className="text-lg font-bold text-text-primary">
	 {displayValue !== null ? displayValue.toFixed(1) : "—"}
	 </span>
	 <span className="text-xs text-text-muted">{unit}</span>
 </div>
 </div>
 </CardContent>
 </Card>
 )
}
