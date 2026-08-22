import { Thermometer, Droplets, Sprout, Sun, Wind, Waves } from "lucide-react"
import type { SensorAnalytics } from "@/api/sensors"
import DailyStatsCard from "./DailyStatsCard"

type AnalyticsSummaryProps = {
  current: SensorAnalytics | null
  previous: SensorAnalytics | null
}

const SENSOR_CONFIG = [
  { key: "temperature" as const, icon: Thermometer, label: "Temperature", unit: "°C", iconClass: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400", invert: false },
  { key: "humidity" as const, icon: Droplets, label: "Humidity", unit: "%", iconClass: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400", invert: false },
  { key: "soilMoisture" as const, icon: Sprout, label: "Soil Moisture", unit: "%", iconClass: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400", invert: false },
  { key: "light" as const, icon: Sun, label: "Light", unit: "lux", iconClass: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400", invert: false },
  { key: "airQuality" as const, icon: Wind, label: "Air Quality", unit: "AQI", iconClass: "bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400", invert: true },
  { key: "waterLevel" as const, icon: Waves, label: "Water Level", unit: "%", iconClass: "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400", invert: false },
]

export default function AnalyticsSummary({ current, previous }: AnalyticsSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SENSOR_CONFIG.map((cfg) => (
        <DailyStatsCard
          key={cfg.key}
          icon={cfg.icon}
          label={cfg.label}
          value={current?.[cfg.key]?.avg ?? null}
          avg={current?.[cfg.key]?.avg ?? null}
          min={current?.[cfg.key]?.min ?? null}
          max={current?.[cfg.key]?.max ?? null}
          prevAvg={previous?.[cfg.key]?.avg ?? null}
          unit={cfg.unit}
          iconClass={cfg.iconClass}
          invert={cfg.invert}
        />
      ))}
    </div>
  )
}
