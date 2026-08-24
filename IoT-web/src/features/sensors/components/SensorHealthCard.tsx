import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Wifi, WifiOff, Clock, Thermometer, Droplets, Sun, Wind, Waves } from "lucide-react"
import { useDashboardStore } from "@/store/use-dashboard-store"

const sensorFields = [
	{ key: "temperature", label: "Temperature", icon: Thermometer, unit: "°C", color: "text-cyan-500" },
	{ key: "humidity", label: "Humidity", icon: Droplets, unit: "%", color: "text-blue-500" },
	{ key: "soilMoisture", label: "Soil Moisture", icon: Droplets, unit: "%", color: "text-green-500" },
	{ key: "light", label: "Light", icon: Sun, unit: "lux", color: "text-amber-500" },
	{ key: "airQuality", label: "Air Quality", icon: Wind, unit: "AQI", color: "text-purple-500" },
	{ key: "waterLevel", label: "Water Level", icon: Waves, unit: "cm", color: "text-indigo-500" },
]

function formatLastSeen(date: Date | null): string {
	if (!date) return "Never"
	const now = new Date()
	const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

	if (diff < 10) return "Just now"
	if (diff < 60) return `${diff}s ago`
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
	return date.toLocaleDateString()
}

export default function SensorHealthCard() {
	const connected = useDashboardStore((s) => s.connected)
	const lastSeen = useDashboardStore((s) => s.lastSeen)
	const sysInfo = useDashboardStore((s) => s.sysInfo)
	const moisture = useDashboardStore((s) => s.moisture)

	return (
		<Card>
			<CardHeader>
				<h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
					<Activity size={18} className="text-green-500" />
					Sensor Health
				</h2>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* ESP32 Status */}
				<div className="flex items-center justify-between p-3 rounded-xl bg-bg-muted border border-border">
					<div className="flex items-center gap-3">
						{connected ? (
							<Wifi size={18} className="text-green-500" />
						) : (
							<WifiOff size={18} className="text-red-500" />
						)}
						<div>
							<p className="text-sm font-medium text-text-primary">ESP32</p>
							<p className="text-xs text-text-muted">{sysInfo.device}</p>
						</div>
					</div>
					<Badge
						variant="outline"
						className={`text-xs font-semibold ${
							connected
								? "bg-green-100 text-green-700 border-green-200"
								: "bg-red-100 text-red-700 border-red-200"
						}`}>
						{connected ? "Online" : "Offline"}
					</Badge>
				</div>

				{/* Last Seen + Uptime */}
				<div className="grid grid-cols-2 gap-3">
					<div className="p-3 rounded-xl bg-bg-muted border border-border">
						<div className="flex items-center gap-2 mb-1">
							<Clock size={14} className="text-text-muted" />
							<span className="text-xs text-text-muted">Last Seen</span>
						</div>
						<p className="text-sm font-semibold text-text-primary">
							{formatLastSeen(lastSeen)}
						</p>
					</div>
					<div className="p-3 rounded-xl bg-bg-muted border border-border">
						<div className="flex items-center gap-2 mb-1">
							<Activity size={14} className="text-text-muted" />
							<span className="text-xs text-text-muted">Uptime</span>
						</div>
						<p className="text-sm font-semibold text-text-primary">
							{sysInfo.uptime}
						</p>
					</div>
				</div>

				{/* Sensor Values */}
				<div className="space-y-2">
					<p className="text-xs font-medium text-text-muted uppercase tracking-wider">Sensors</p>
					<div className="grid grid-cols-2 gap-2">
						{sensorFields.map((sensor) => {
							const Icon = sensor.icon
							const value = sensor.key === "soilMoisture" ? moisture : null
							const isOnline = connected && value !== null && value !== undefined

							return (
								<div
									key={sensor.key}
									className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
										isOnline
											? "border-green-200 bg-green-50/50 dark:bg-green-900/10"
											: "border-border bg-bg-muted"
									}`}>
									<Icon size={14} className={sensor.color} />
									<div className="flex-1 min-w-0">
										<p className="text-xs text-text-muted truncate">{sensor.label}</p>
										<p className="text-sm font-semibold text-text-primary">
											{isOnline ? `${value}${sensor.unit}` : "—"}
										</p>
									</div>
									<div className={`w-2 h-2 rounded-full shrink-0 ${isOnline ? "bg-green-500" : "bg-gray-300"}`} />
								</div>
							)
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
