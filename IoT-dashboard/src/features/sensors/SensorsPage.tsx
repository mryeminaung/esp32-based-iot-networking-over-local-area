import CardContainer from "./components/CardContainer";
import SensorCard from "./components/SensorCard";
import { useDashboardStore } from "@/store/use-dashboard-store";
import { useHeader } from "@/hooks/useHeader";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Power, WifiOff, Droplets, Waves, Thermometer } from "lucide-react";

const deviceList = [
	{
		key: "red_light" as const,
		label: "Red LED",
		onColor: "text-red-500",
		offColor: "text-text-muted",
		bg: "bg-red-100 dark:bg-red-900/30",
		iconBg: "bg-red-100 dark:bg-red-900/30",
	},
	{
		key: "yellow_light" as const,
		label: "Yellow LED",
		onColor: "text-yellow-500",
		offColor: "text-text-muted",
		bg: "bg-yellow-100 dark:bg-yellow-900/30",
		iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
	},
	{
		key: "green_light" as const,
		label: "Green LED",
		onColor: "text-green-500",
		offColor: "text-text-muted",
		bg: "bg-green-100 ",
		iconBg: "bg-green-100 ",
	},
	{
		key: "white_light" as const,
		label: "Grow Light",
		onColor: "text-amber-400",
		offColor: "text-text-muted",
		bg: "bg-bg-muted",
		iconBg: "bg-amber-100 dark:bg-amber-900/30",
	},
	{
		key: "fan" as const,
		label: "Fan",
		onColor: "text-cyan-500",
		offColor: "text-text-muted",
		bg: "bg-cyan-100 dark:bg-cyan-900/30",
		iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
	},
	{
		key: "water_pump" as const,
		label: "Water Pump",
		onColor: "text-indigo-500",
		offColor: "text-text-muted",
		bg: "bg-indigo-100 dark:bg-indigo-900/30",
		iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
	},
	{
		key: "relay" as const,
		label: "Relay",
		onColor: "text-amber-500",
		offColor: "text-text-muted",
		bg: "bg-amber-100 dark:bg-amber-900/30",
		iconBg: "bg-amber-100 dark:bg-amber-900/30",
	},
];

export default function SensorsPage() {
	useHeader("Sensors");
	const devices = useDashboardStore((s) => s.devices);
	const connected = useDashboardStore((s) => s.connected);

	return (
		<div className="max-w-[1100px] mx-auto space-y-5">
			{/* Header */}
			<PageHeader
				title="Sensors & Devices"
				description="Monitor sensor readings and control devices"
			/>

			{/* Connection warning */}
			{!connected && (
				<Card className="bg-red-50 border-red-200 ">
					<CardContent className="text-red-700 text-sm flex items-center gap-2">
						<WifiOff size={16} />
						ESP32 is offline — readings may be stale
					</CardContent>
				</Card>
			)}

			{/* Soil Moisture Gauge + LED Status Indicators */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-3">
				<div className="md:col-span-2">
					<SensorCard />
				</div>
				<div className="md:col-span-1">
					<CardContainer />
				</div>
			</div>

			{/* DHT22 & Water Level Placeholder Cards */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				{/* DHT22 Temperature & Humidity */}
				<Card className="relative overflow-hidden">
					<div className="absolute top-3 right-3">
						<Badge variant="outline" className="text-[0.625rem] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
							COMING SOON
						</Badge>
					</div>
					<CardContent>
						<div className="flex items-center gap-2 mb-4">
							<Thermometer size={18} className="text-cyan-500" />
							<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-gray-900 dark:text-white">
								DHT22 Sensor
							</h2>
						</div>
						<div className="flex items-center justify-center py-8">
							<div className="text-center">
								<div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-bg-muted flex items-center justify-center">
									<Thermometer className="w-8 h-8 text-text-muted" />
								</div>
								<p className="text-sm text-text-muted mb-1">
									Temperature & Humidity
								</p>
								<p className="text-xs text-text-muted">
									Requires DHT22 sensor wiring to ESP32
								</p>
							</div>
						</div>
						<div className="flex items-center justify-between text-xs text-text-muted border-t border-border pt-3">
							<span>GPIO: TBD</span>
							<span>Protocol: One-Wire</span>
						</div>
					</CardContent>
				</Card>

				{/* Water Level Sensor */}
				<Card className="relative overflow-hidden">
					<div className="absolute top-3 right-3">
						<Badge variant="outline" className="text-[0.625rem] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
							COMING SOON
						</Badge>
					</div>
					<CardContent>
						<div className="flex items-center gap-2 mb-4">
							<Waves size={18} className="text-blue-500" />
							<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-gray-900 dark:text-white">
								Water Level
							</h2>
						</div>
						<div className="flex items-center justify-center py-8">
							<div className="text-center">
								<div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-bg-muted flex items-center justify-center">
									<Droplets className="w-8 h-8 text-text-muted" />
								</div>
								<p className="text-sm text-text-muted mb-1">
									Water Tank Level
								</p>
								<p className="text-xs text-text-muted">
									Requires ultrasonic or float sensor
								</p>
							</div>
						</div>
						<div className="flex items-center justify-between text-xs text-text-muted border-t border-border pt-3">
							<span>GPIO: TBD</span>
							<span>Protocol: Analog</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Device States Grid */}
			<Card>
				<CardHeader>
					<h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
						<Power
							size={18}
							className="text-amber-500"
						/>
						All Device States
					</h2>
				</CardHeader>
				<CardContent className="space-y-4">

				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{deviceList.map((device) => {
						const isOn = !!devices[device.key];
						return (
							<div
								key={device.key}
								className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
									isOn
										? "border-green-200 bg-green-50/50 dark:bg-green-900/10"
										: "border-border bg-bg-muted"
								}`}>
								<div
									className={`w-9 h-9 rounded-lg ${device.iconBg} flex items-center justify-center shrink-0`}>
									<Power
										className={`w-4 h-4 ${isOn ? device.onColor : device.offColor}`}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										{device.label}
									</p>
								</div>
								<span
									className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
										isOn
											? "bg-green-100 text-green-700 "
											: "bg-bg-muted text-text-muted"
									}`}>
									{isOn ? "ON" : "OFF"}
								</span>
							</div>
						);
					})}
				</div>
				</CardContent>
			</Card>
		</div>
	);
}
