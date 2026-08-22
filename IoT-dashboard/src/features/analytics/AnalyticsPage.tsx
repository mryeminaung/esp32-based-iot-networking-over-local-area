import { useEffect, useState } from "react"
import { BarChart3 } from "lucide-react"
import { getSensorAnalytics, type SensorAnalytics } from "@/api/sensors"
import { useHeader } from "@/hooks/useHeader"
import PageHeader from "@/components/PageHeader"
import DateRangePicker, { getDateRange } from "./components/DateRangePicker"
import AnalyticsSummary from "./components/AnalyticsSummary"
import SensorChart from "./components/SensorChart"

const CHART_SENSORS = [
  { key: "temperature" as const, title: "Temperature (24h trend)", color: "#f97316", unit: "°C" },
  { key: "humidity" as const, title: "Humidity (24h trend)", color: "#3b82f6", unit: "%" },
  { key: "soilMoisture" as const, title: "Soil Moisture (24h trend)", color: "#16a34a", unit: "%" },
  { key: "light" as const, title: "Light Intensity (24h trend)", color: "#eab308", unit: " lux" },
]

export default function AnalyticsPage() {
  useHeader("Sensor Analytics")

  const [preset, setPreset] = useState("7d")
  const [analytics, setAnalytics] = useState<SensorAnalytics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const { from, to } = getDateRange(preset)
        const data = await getSensorAnalytics(from, to)
        setAnalytics(data)
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [preset])

  // Current day = last entry, previous day = second-to-last
  const currentDay = analytics.length > 0 ? analytics[analytics.length - 1] : null
  const previousDay = analytics.length > 1 ? analytics[analytics.length - 2] : null

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      {/* Header */}
      <PageHeader
        title="Sensor Analytics"
        description="Historical sensor data and trends"
      >
        <DateRangePicker preset={preset} onChange={setPreset} />
      </PageHeader>

      {loading ? (
        <div className="card text-center py-12">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-text-muted">Loading analytics...</p>
        </div>
      ) : analytics.length === 0 ? (
        <div className="card text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-text-muted">
            No sensor data available for the selected period.
            <br />
            <span className="text-sm">Data will appear once the collector starts recording.</span>
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <AnalyticsSummary current={currentDay} previous={previousDay} />

          {/* Charts */}
          <div className="grid gap-4 sm:grid-cols-2">
            {CHART_SENSORS.map((sensor) => (
              <SensorChart
                key={sensor.key}
                title={sensor.title}
                data={analytics}
                dataKey={sensor.key}
                color={sensor.color}
                unit={sensor.unit}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
