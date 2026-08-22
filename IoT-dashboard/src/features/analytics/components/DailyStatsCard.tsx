import type { LucideIcon } from "lucide-react"
import TrendBadge from "./TrendBadge"

type DailyStatsCardProps = {
  icon: LucideIcon
  label: string
  value: number | null
  avg: number | null
  min: number | null
  max: number | null
  prevAvg: number | null
  unit: string
  iconClass: string
  invert?: boolean
}

export default function DailyStatsCard({
  icon: Icon,
  label,
  value,
  avg,
  min,
  max,
  prevAvg,
  unit,
  iconClass,
  invert = false,
}: DailyStatsCardProps) {
  const displayValue = value ?? avg

  return (
    <div className="card flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-muted font-medium">{label}</p>
        <div className="flex flex-wrap items-baseline gap-1.5 mt-0.5">
          <span className="text-xl font-bold text-text-primary">
            {displayValue !== null ? displayValue.toFixed(1) : "—"}
          </span>
          <span className="text-sm text-text-muted">{unit}</span>
          <TrendBadge current={avg} previous={prevAvg} unit={unit} invert={invert} />
        </div>
        <p className="text-[0.7rem] text-text-muted mt-0.5 truncate">
          {min !== null && max !== null
            ? `${min.toFixed(0)} – ${max.toFixed(0)}${unit}`
            : "No data"}
        </p>
      </div>
    </div>
  )
}
