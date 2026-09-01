import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
	Wifi,
	WifiOff,
	Thermometer,
	Droplets,
	Sun,
	Wind,
	Waves,
	Lightbulb,
	Fan,
	Plug,
} from "lucide-react"
import { useDashboardStore } from "@/store/use-dashboard-store"

const sensorFields = [
	{ key: "temperature", label: "Temperature", icon: Thermometer, unit: "°C", color: "text-cyan-500" },
	{ key: "humidity", label: "Humidity", icon: Droplets, unit: "%", color: "text-blue-500" },
	{ key: "soilMoisture", label: "Soil Moisture", icon: Droplets, unit: "%", color: "text-green-500" },
	{ key: "light", label: "Light", icon: Sun, unit: "lux", color: "text-amber-500" },
	{ key: "airQuality", label: "Air Quality", icon: Wind, unit: "AQI", color: "text-purple-500" },
	{ key: "waterLevel", label: "Water Level", icon: Waves, unit: "cm", color: "text-indigo-500" },
]

const deviceFields = [
	{ key: "red_light" as const, label: "Red LED", icon: Lightbulb, color: "text-red-500" },
	{ key: "yellow_light" as const, label: "Yellow LED", icon: Lightbulb, color: "text-amber-500" },
	{ key: "green_light" as const, label: "Green LED", icon: Lightbulb, color: "text-green-500" },
	{ key: "white_light" as const, label: "Grow Light", icon: Lightbulb, color: "text-amber-400" },
	{ key: "fan" as const, label: "Fan", icon: Fan, color: "text-cyan-500" },
	{ key: "water_pump" as const, label: "Water Pump", icon: Droplets, color: "text-indigo-500" },
	{ key: "relay" as const, label: "Relay", icon: Plug, color: "text-amber-500" },
]

export default function SensorHealthCard() {
	const connected = useDashboardStore((s) => s.connected)
	const sysInfo = useDashboardStore((s) => s.sysInfo)
	const moisture = useDashboardStore((s) => s.moisture)
	const devices = useDashboardStore((s) => s.devices)

	return (
		<div className="space-y-4">
			{/* Connection Status Banner */}
			<Card className={`border-2 ${connected ? "border-green-200 bg-green-50/50 dark:bg-green-900/10" : "border-red-200 bg-red-50/50 dark:bg-red-900/10"}`}>
				<CardContent className="py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className={`w-12 h-12 rounded-xl flex items-center justify-center ${connected ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
								{connected ? (
									<Wifi size={24} className="text-green-600" />
								) : (
									<WifiOff size={24} className="text-red-500" />
								)}
							</div>
							<div>
								<h3 className="text-lg font-bold text-text-primary">{sysInfo.device}</h3>
								<p className="text-sm text-text-muted">{sysInfo.ip}</p>
							</div>
						</div>
						<Badge
							variant="outline"
							className={`text-sm font-bold px-4 py-1.5 ${
								connected
									? "bg-green-100 text-green-700 border-green-300"
									: "bg-red-100 text-red-700 border-red-300"
							}`}>
							{connected ? "ONLINE" : "OFFLINE"}
						</Badge>
					</div>
				</CardContent>
			</Card>

			{/* Sensor Readings */}
			<Card>
				<CardHeader className="pb-3">
					<h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Sensor Readings</h3>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
						{sensorFields.map((sensor) => {
							const Icon = sensor.icon
							const value = sensor.key === "soilMoisture" ? moisture : null
							const isOnline = connected && value !== null && value !== undefined

							return (
								<div
									key={sensor.key}
									className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
										isOnline
											? "border-green-200 bg-green-50/50 dark:bg-green-900/10"
											: "border-border bg-bg-muted"
									}`}>
									<div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
										isOnline ? "bg-green-100 dark:bg-green-900/30" : "bg-bg-muted"
									}`}>
										<Icon size={16} className={isOnline ? sensor.color : "text-text-muted"} />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs text-text-muted">{sensor.label}</p>
										<p className="text-sm font-bold text-text-primary">
											{isOnline ? `${value}${sensor.unit}` : "—"}
										</p>
									</div>
									<div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isOnline ? "bg-green-500" : "bg-gray-300"}`} />
								</div>
							)
						})}
					</div>
				</CardContent>
			</Card>

			{/* Device States */}
			<Card>
				<CardHeader className="pb-3">
					<h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Device States</h3>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
						{deviceFields.map((device) => {
							const Icon = device.icon
							const isOn = !!devices[device.key]

							return (
								<div
									key={device.key}
									className={`flex items-center gap-2 p-2.5 rounded-lg border transition-colors ${
										isOn
											? "border-green-200 bg-green-50/50 dark:bg-green-900/10"
											: "border-border bg-bg-muted"
									}`}>
									<Icon size={14} className={isOn ? device.color : "text-text-muted"} />
									<span className="text-xs font-medium text-text-primary flex-1 truncate">{device.label}</span>
									<div className={`w-2 h-2 rounded-full shrink-0 ${isOn ? "bg-green-500" : "bg-gray-300"}`} />
								</div>
							)
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
