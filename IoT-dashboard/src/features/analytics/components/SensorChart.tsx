import {
 AreaChart,
 Area,
 XAxis,
 YAxis,
 Tooltip,
 ResponsiveContainer,
 CartesianGrid,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import type { SensorAnalytics } from "@/api/sensors"

type SensorChartProps = {
 title: string
 data: SensorAnalytics[]
 dataKey: keyof Pick<SensorAnalytics, "temperature" | "humidity" | "soilMoisture" | "light" | "airQuality" | "waterLevel">
 color: string
 unit: string
}

function formatDate(dateStr: string) {
 const d = new Date(dateStr)
 return d.toLocaleDateString([], { month: "short", day: "numeric" })
}

export default function SensorChart({ title, data, dataKey, color, unit }: SensorChartProps) {
 // Transform data for recharts — each point has date, avg, min, max
 const chartData = data.map((d) => ({
 date: d[dataKey].avg !== null ? d.date : null,
 avg: d[dataKey].avg,
 min: d[dataKey].min,
 max: d[dataKey].max,
 })).filter((d) => d.date !== null)

 if (chartData.length === 0) {
 return (
 <Card>
 <CardContent>
 <p className="text-sm font-medium text-text-primary mb-3">{title}</p>
 <div className="h-[200px] flex items-center justify-center text-sm text-text-muted">
 No data available
 </div>
 </CardContent>
 </Card>
 )
 }

 return (
 <Card>
 <CardContent>
 <p className="text-sm font-medium text-text-primary mb-3">{title}</p>
 <div className="h-[180px] sm:h-[200px]">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
 <defs>
 <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor={color} stopOpacity={0.3} />
 <stop offset="95%" stopColor={color} stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
 <XAxis
 dataKey="date"
 tickFormatter={formatDate}
 tick={{ fontSize: 11, fill: "var(--text-muted)" }}
 axisLine={false}
 tickLine={false}
 />
 <YAxis
 tick={{ fontSize: 11, fill: "var(--text-muted)" }}
 axisLine={false}
 tickLine={false}
 width={35}
 />
 <Tooltip
 contentStyle={{
 background: "var(--bg-card)",
 border: "1px solid var(--border)",
 borderRadius: "8px",
 fontSize: "12px",
 boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
 }}
 labelFormatter={formatDate}
 formatter={(value: number, name: string) => {
 const labels: Record<string, string> = { avg: "Average", min: "Min", max: "Max" }
 return [`${value.toFixed(1)}${unit}`, labels[name] || name]
 }}
 />
 <Area
 type="monotone"
 dataKey="max"
 stroke="none"
 fill={`url(#gradient-${dataKey})`}
 fillOpacity={0.3}
 />
 <Area
 type="monotone"
 dataKey="avg"
 stroke={color}
 strokeWidth={2}
 fill={`url(#gradient-${dataKey})`}
 dot={false}
 activeDot={{ r: 4, strokeWidth: 0 }}
 />
 <Area
 type="monotone"
 dataKey="min"
 stroke="none"
 fill="transparent"
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </CardContent>
 </Card>
 )
}
