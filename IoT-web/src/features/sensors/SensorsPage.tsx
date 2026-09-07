import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useHeader } from "@/hooks/useHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { useDashboardStore } from "@/store/use-dashboard-store";
import { motion } from "framer-motion";
import { AlertTriangle, Power } from "lucide-react";
import AirQualityCard from "./components/AirQualityCard";
import { BuzzerIndicator } from "./components/BuzzerIndicator";
import HumidityCard from "./components/HumidityCard";
import LightCard from "./components/LightCard";
import SensorCard from "./components/SensorCard";
import SensorHealthCard from "./components/SensorHealthCard";
import TemperatureCard from "./components/TemperatureCard";
import WaterLevelCard from "./components/WaterLevelCard";
import { WaterLevelIndicator } from "./components/WaterLevelIndicator";

const fadeInUp = {
	hidden: { opacity: 0, y: 16 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
	}),
};

const deviceList = [
	{
		key: "red_light" as const,
		label: "Red LED",
		onColor: "text-red-500",
		offColor: "text-text-muted",
		iconBg: "bg-red-100 dark:bg-red-900/30",
	},
	{
		key: "yellow_light" as const,
		label: "Yellow LED",
		onColor: "text-yellow-500",
		offColor: "text-text-muted",
		iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
	},
	{
		key: "green_light" as const,
		label: "Green LED",
		onColor: "text-green-500",
		offColor: "text-text-muted",
		iconBg: "bg-green-100",
	},
	{
		key: "white_light" as const,
		label: "Grow Light",
		onColor: "text-purple-500",
		offColor: "text-text-muted",
		iconBg: "bg-purple-100 dark:bg-purple-900/30",
	},
];

export default function SensorsPage() {
	useHeader("Sensors");
	const devices = useDashboardStore((s) => s.devices);
	const sensors = useDashboardStore((s) => s.sensors);
	const connected = useDashboardStore((s) => s.connected);
	const deviceSettings = useDashboardStore((s) => s.deviceSettings);
	const user = useAuthStore((s) => s.user);
	const isTechnician = user?.role === "technician";

	const isWaterLow = sensors.waterLevel <= deviceSettings.waterCriticalThreshold;

	// Technician sees sensor health overview only
	if (isTechnician) {
		return (
			<div className="max-w-[1100px] mx-auto space-y-5">
				<PageHeader
					title="Sensor Health"
					description="Monitor sensor connection status and health"
				/>

				<motion.div
					custom={0}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<SensorHealthCard />
				</motion.div>
			</div>
		);
	}

	return (
		<div className="max-w-[1100px] mx-auto space-y-5">
			{/* Header */}
			<PageHeader
				title="Sensors & Devices"
				description="Monitor sensor readings and control devices"
			/>

			{/* Low water alert */}
			{sensors.waterLevel < deviceSettings.waterCriticalThreshold && connected && (
				<Card className="bg-amber-50 border-amber-300 dark:bg-amber-900/20 dark:border-amber-700">
					<CardContent className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
							<AlertTriangle
								size={18}
								className="text-amber-600 dark:text-amber-400"
							/>
						</div>
						<div>
							<p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
								Water tank empty
							</p>
							<p className="text-xs text-amber-600 dark:text-amber-400">
								Buzzer is active — refill water tank
							</p>
						</div>
						<span className="ml-auto px-2.5 py-1 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs font-semibold animate-pulse">
							{sensors.waterLevel}%
						</span>
					</CardContent>
				</Card>
			)}

			{/* Device States Grid */}
			<motion.div
				custom={0}
				variants={fadeInUp}
				initial="hidden"
				animate="visible">
				<Card>
					<CardHeader>
						<h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
							<Power
								size={18}
								className="text-amber-500"
							/>
							Sensors Status
						</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{deviceList.map((device, i) => {
								const isOn = !!devices[device.key];
								return (
									<motion.div
										key={device.key}
										custom={i}
										variants={fadeInUp}
										initial="hidden"
										animate="visible"
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
											<p className="text-sm font-medium text-text-primary">
												{device.label}
											</p>
										</div>
										<span
											className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
												isOn
													? "bg-green-100 text-green-700"
													: "bg-bg-muted text-text-muted"
											}`}>
											{isOn ? "ON" : "OFF"}
										</span>
									</motion.div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Soil Moisture + Temperature + Humidity — 3 radial gauges in a row */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-3">
				<motion.div
					custom={0}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<SensorCard
					dryThreshold={deviceSettings.soilDryThreshold}
					optimalThreshold={deviceSettings.soilOptimalThreshold}
				/>
				</motion.div>
				<motion.div
					custom={1}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<TemperatureCard />
				</motion.div>
				<motion.div
					custom={2}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<HumidityCard />
				</motion.div>
			</div>

			{/* Water Level Gauge + Indicators + Buzzer — full width */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-3">
				<motion.div
					className="md:col-span-2"
					custom={0}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<WaterLevelCard />
				</motion.div>
				<motion.div
					className="md:col-span-1 flex gap-2 flex-col-reverse"
					custom={1}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<BuzzerIndicator
						active={isWaterLow && connected}
						buzzerEnabled={deviceSettings.buzzerEnabled}
						buzzerLowWater={deviceSettings.buzzerLowWater}
					/>
					<WaterLevelIndicator
						name="Full"
						color="green"
						active={sensors.waterLevel > Math.round((deviceSettings.waterLowThreshold + 100) / 2)}
					/>
					<WaterLevelIndicator
						name="Mid"
						color="yellow"
						active={sensors.waterLevel > deviceSettings.waterLowThreshold && sensors.waterLevel <= Math.round((deviceSettings.waterLowThreshold + 100) / 2)}
					/>
					<WaterLevelIndicator
						name="Low"
						color="red"
						active={sensors.waterLevel <= deviceSettings.waterLowThreshold}
					/>
				</motion.div>
			</div>

			{/* Light + Air Quality — 2 radial gauges */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<motion.div
					custom={3}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<LightCard />
				</motion.div>

				<motion.div
					custom={4}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<AirQualityCard />
				</motion.div>
			</div>
		</div>
	);
}
