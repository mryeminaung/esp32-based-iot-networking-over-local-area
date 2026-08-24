import { useEffect, useMemo, useState } from "react"
import { BarChart3 } from "lucide-react"
import { getSensorAnalytics, type SensorAnalytics } from "@/api/sensors"
import { useHeader } from "@/hooks/useHeader"
import PageHeader from "@/components/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import DateRangePicker, { getDateRange } from "./components/DateRangePicker"
import AnalyticsSummary from "./components/AnalyticsSummary"
import SensorChart from "./components/SensorChart"

const CHART_SENSORS = [
 { key: "temperature" as const, title: "Temperature (24h trend)", color: "#f97316", unit: "°C" },
 { key: "humidity" as const, title: "Humidity (24h trend)", color: "#3b82f6", unit: "%" },
 { key: "soilMoisture" as const, title: "Soil Moisture (24h trend)", color: "#16a34a", unit: "%" },
 { key: "light" as const, title: "Light Intensity (24h trend)", color: "#eab308", unit: " lux" },
]

const SENSOR_KEYS = ["temperature", "humidity", "soilMoisture", "light", "airQuality", "waterLevel"] as const

function aggregatePeriod(data: SensorAnalytics[]): SensorAnalytics {
 const agg: Record<string, { avg: number; min: number; max: number; count: number }> = {}

 for (const day of data) {
	 for (const key of SENSOR_KEYS) {
	 const entry = day[key]
	 if (entry.avg === null) continue
	 if (!agg[key]) agg[key] = { avg: 0, min: Infinity, max: -Infinity, count: 0 }
	 agg[key].avg += entry.avg
	 agg[key].min = Math.min(agg[key].min, entry.min ?? entry.avg)
	 agg[key].max = Math.max(agg[key].max, entry.max ?? entry.avg)
	 agg[key].count++
	 }
 }

 const result = {} as Record<string, { avg: number | null; min: number | null; max: number | null }>
 for (const key of SENSOR_KEYS) {
	 const a = agg[key]
	 result[key] = a && a.count > 0
	 ? { avg: a.avg / a.count, min: a.min, max: a.max }
	 : { avg: null, min: null, max: null }
 }

 return result as unknown as SensorAnalytics
}

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
		 setAnalytics([])
	 } finally {
		 setLoading(false)
	 }
	 }
	 fetchAnalytics()
 }, [preset])

 const periodSummary = useMemo(
	 () => (analytics.length > 0 ? aggregatePeriod(analytics) : null),
	 [analytics]
 )

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
	 <Card className="text-center py-12">
		 <CardContent>
		 <div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
		 <p className="text-text-muted">Loading analytics...</p>
		 </CardContent>
	 </Card>
	 ) : analytics.length === 0 ? (
	 <Card className="text-center py-12">
		 <CardContent>
		 <BarChart3 className="w-12 h-12 text-text-muted mx-auto mb-3" />
		 <p className="text-text-muted">
			 No sensor data available for the selected period.
			 <br />
			 <span className="text-sm">Data will appear once the collector starts recording.</span>
		 </p>
		 </CardContent>
	 </Card>
	 ) : (
	 <>
		 {/* Summary Cards */}
		 <AnalyticsSummary current={periodSummary} />

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
