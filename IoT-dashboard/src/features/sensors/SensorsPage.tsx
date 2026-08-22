import CardContainer from "./components/CardContainer";
import SensorCard from "./components/SensorCard";
import { useDashboardStore } from "@/store/use-dashboard-store";
import { useHeader } from "@/hooks/useHeader";
import PageHeader from "@/components/PageHeader";
import { Power, WifiOff, Droplets, Waves, Thermometer } from "lucide-react";

const deviceList = [
	{
		key: "red_light" as const,
		label: "Red LED",
		onColor: "text-red-500",
		offColor: "text-gray-300 dark:text-gray-600",
		bg: "bg-red-100 dark:bg-red-900/30",
		iconBg: "bg-red-100 dark:bg-red-900/30",
	},
	{
		key: "yellow_light" as const,
		label: "Yellow LED",
		onColor: "text-yellow-500",
		offColor: "text-gray-300 dark:text-gray-600",
		bg: "bg-yellow-100 dark:bg-yellow-900/30",
		iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
	},
	{
		key: "green_light" as const,
		label: "Green LED",
		onColor: "text-green-500",
		offColor: "text-gray-300 dark:text-gray-600",
		bg: "bg-green-100 dark:bg-green-900/30",
		iconBg: "bg-green-100 dark:bg-green-900/30",
	},
	{
		key: "white_light" as const,
		label: "Grow Light",
		onColor: "text-amber-400",
		offColor: "text-gray-300 dark:text-gray-600",
		bg: "bg-gray-100 dark:bg-gray-800",
		iconBg: "bg-amber-100 dark:bg-amber-900/30",
	},
	{
		key: "fan" as const,
		label: "Fan",
		onColor: "text-cyan-500",
		offColor: "text-gray-300 dark:text-gray-600",
		bg: "bg-cyan-100 dark:bg-cyan-900/30",
		iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
	},
	{
		key: "water_pump" as const,
		label: "Water Pump",
		onColor: "text-indigo-500",
		offColor: "text-gray-300 dark:text-gray-600",
		bg: "bg-indigo-100 dark:bg-indigo-900/30",
		iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
	},
	{
		key: "relay" as const,
		label: "Relay",
		onColor: "text-amber-500",
		offColor: "text-gray-300 dark:text-gray-600",
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
				<div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
					<WifiOff size={16} />
					ESP32 is offline — readings may be stale
				</div>
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
				<div className="card relative overflow-hidden">
					<div className="absolute top-3 right-3">
						<span className="text-[0.625rem] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
							COMING SOON
						</span>
					</div>
					<div className="flex items-center gap-2 mb-4">
						<Thermometer size={18} className="text-cyan-500" />
						<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-gray-900 dark:text-white">
							DHT22 Sensor
						</h2>
					</div>
					<div className="flex items-center justify-center py-8">
						<div className="text-center">
							<div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
								<Thermometer className="w-8 h-8 text-gray-300 dark:text-gray-600" />
							</div>
							<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
								Temperature & Humidity
							</p>
							<p className="text-xs text-gray-400 dark:text-gray-500">
								Requires DHT22 sensor wiring to ESP32
							</p>
						</div>
					</div>
					<div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
						<span>GPIO: TBD</span>
						<span>Protocol: One-Wire</span>
					</div>
				</div>

				{/* Water Level Sensor */}
				<div className="card relative overflow-hidden">
					<div className="absolute top-3 right-3">
						<span className="text-[0.625rem] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
							COMING SOON
						</span>
					</div>
					<div className="flex items-center gap-2 mb-4">
						<Waves size={18} className="text-blue-500" />
						<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-gray-900 dark:text-white">
							Water Level
						</h2>
					</div>
					<div className="flex items-center justify-center py-8">
						<div className="text-center">
							<div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
								<Droplets className="w-8 h-8 text-gray-300 dark:text-gray-600" />
							</div>
							<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
								Water Tank Level
							</p>
							<p className="text-xs text-gray-400 dark:text-gray-500">
								Requires ultrasonic or float sensor
							</p>
						</div>
					</div>
					<div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
						<span>GPIO: TBD</span>
						<span>Protocol: Analog</span>
					</div>
				</div>
			</div>

			{/* Device States Grid */}
			<div className="card space-y-4">
				<h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
					<Power
						size={18}
						className="text-amber-500"
					/>
					All Device States
				</h2>

				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{deviceList.map((device) => {
						const isOn = !!devices[device.key];
						return (
							<div
								key={device.key}
								className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
									isOn
										? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
										: "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30"
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
											? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
											: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
									}`}>
									{isOn ? "ON" : "OFF"}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
