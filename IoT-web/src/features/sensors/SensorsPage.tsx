import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useHeader } from "@/hooks/useHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { useDashboardStore } from "@/store/use-dashboard-store";
import { motion } from "framer-motion";
import {
	AlertTriangle,
	Bell,
	Droplets,
	Power,
	Sun,
	Thermometer,
	Waves,
	WifiOff,
	Wind,
} from "lucide-react";
import { MoistureCard } from "./components/MoistureCard";
import SensorCard from "./components/SensorCard";
import SensorGaugeCard from "./components/SensorGaugeCard";
import SensorHealthCard from "./components/SensorHealthCard";

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
		onColor: "text-purple-500",
		offColor: "text-text-muted",
		bg: "bg-purple-100 dark:bg-purple-900/30",
		iconBg: "bg-purple-100 dark:bg-purple-900/30",
	},
	{
		key: "buzzer" as const,
		label: "Buzzer",
		onColor: "text-amber-500",
		offColor: "text-text-muted",
		bg: "bg-amber-100 dark:bg-amber-900/30",
		iconBg: "bg-amber-100 dark:bg-amber-900/30",
	},
];

const tempThresholds = [
	{
		max: 15,
		label: "COLD",
		bgClass: "bg-blue-100 dark:bg-blue-900/30",
		textClass: "text-blue-600",
		barColor: "bg-blue-500",
	},
	{
		max: 30,
		label: "NORMAL",
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
		barColor: "bg-green-500",
	},
	{
		max: 100,
		label: "HOT",
		bgClass: "bg-red-100 dark:bg-red-900/30",
		textClass: "text-red-600",
		barColor: "bg-red-500",
	},
];

const humidityThresholds = [
	{
		max: 30,
		label: "DRY",
		bgClass: "bg-amber-100 dark:bg-amber-900/30",
		textClass: "text-amber-600",
		barColor: "bg-amber-500",
	},
	{
		max: 70,
		label: "NORMAL",
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
		barColor: "bg-green-500",
	},
	{
		max: 100,
		label: "HUMID",
		bgClass: "bg-blue-100 dark:bg-blue-900/30",
		textClass: "text-blue-600",
		barColor: "bg-blue-500",
	},
];

const waterLevelThresholds = [
	{
		max: 20,
		label: "LOW",
		bgClass: "bg-red-100 dark:bg-red-900/30",
		textClass: "text-red-600",
		barColor: "bg-red-500",
	},
	{
		max: 60,
		label: "MID",
		bgClass: "bg-amber-100 dark:bg-amber-900/30",
		textClass: "text-amber-600",
		barColor: "bg-amber-500",
	},
	{
		max: 100,
		label: "FULL",
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
		barColor: "bg-green-500",
	},
];

const lightThresholds = [
	{
		max: 200,
		label: "DIM",
		bgClass: "bg-purple-100 dark:bg-purple-900/30",
		textClass: "text-purple-600",
		barColor: "bg-purple-500",
	},
	{
		max: 600,
		label: "NORMAL",
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
		barColor: "bg-green-500",
	},
	{
		max: 1024,
		label: "BRIGHT",
		bgClass: "bg-amber-100 dark:bg-amber-900/30",
		textClass: "text-amber-600",
		barColor: "bg-amber-500",
	},
];

const airQualityThresholds = [
	{
		max: 150,
		label: "GOOD",
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
		barColor: "bg-green-500",
	},
	{
		max: 300,
		label: "MODERATE",
		bgClass: "bg-amber-100 dark:bg-amber-900/30",
		textClass: "text-amber-600",
		barColor: "bg-amber-500",
	},
	{
		max: 500,
		label: "POOR",
		bgClass: "bg-red-100 dark:bg-red-900/30",
		textClass: "text-red-600",
		barColor: "bg-red-500",
	},
];

export default function SensorsPage() {
	useHeader("Sensors");
	const devices = useDashboardStore((s) => s.devices);
	const moisture = useDashboardStore((s) => s.moisture);
	const sensors = useDashboardStore((s) => s.sensors);
	const connected = useDashboardStore((s) => s.connected);
	const user = useAuthStore((s) => s.user);
	const isTechnician = user?.role === "technician";

	// Technician sees sensor health overview only
	if (isTechnician) {
		return (
			<div className="max-w-[1100px] mx-auto space-y-5">
				<PageHeader
					title="Sensor Health"
					description="Monitor sensor connection status and health"
				/>

				{!connected && (
					<Card className="bg-danger/10 border-danger/30">
						<CardContent className="text-danger text-sm flex items-center gap-2">
							<WifiOff size={16} />
							ESP32 is offline — readings may be stale
						</CardContent>
					</Card>
				)}

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

			{/* Connection warning */}
			{!connected && (
				<Card className="bg-danger/10 border-danger/30">
					<CardContent className="text-danger text-sm flex items-center gap-2">
						<WifiOff size={16} />
						ESP32 is offline — readings may be stale
					</CardContent>
				</Card>
			)}

			{/* Low water alert */}
			{sensors.waterLevel < 10 && connected && (
				<Card className="bg-amber-50 border-amber-300 dark:bg-amber-900/20 dark:border-amber-700">
					<CardContent className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
							<AlertTriangle size={18} className="text-amber-600 dark:text-amber-400" />
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
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
													? "bg-green-100 text-green-700 "
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

			{/* Soil Moisture Gauge + Moisture Threshold LEDs */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-3">
				<motion.div
					className="md:col-span-2"
					custom={0}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<SensorCard />
				</motion.div>
				<motion.div
					className="md:col-span-1 flex gap-2 flex-col-reverse"
					custom={1}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<MoistureCard
						name="Dry"
						gpio={2}
						color="red"
						active={moisture <= 30}
					/>
					<MoistureCard
						name="Moist"
						gpio={4}
						color="yellow"
						active={moisture > 30 && moisture < 50}
					/>
					<MoistureCard
						name="Optimal"
						gpio={5}
						color="green"
						active={moisture >= 50}
					/>
				</motion.div>
			</div>

			{/* Additional Sensor Cards */}
			<motion.div
				custom={2}
				variants={fadeInUp}
				initial="hidden"
				animate="visible">
				<h2 className="text-sm font-semibold text-text-primary mb-3">
					Environmental Sensors
				</h2>
			</motion.div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<motion.div
					custom={3}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<SensorGaugeCard
						label="Temperature"
						value={sensors.temperature}
						unit="°C"
						icon={Thermometer}
						color="text-cyan-500"
						bgColor="bg-cyan-100 dark:bg-cyan-900/30"
						min={0}
						max={50}
						thresholds={tempThresholds}
						decimals={1}
					/>
				</motion.div>

				<motion.div
					custom={4}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<SensorGaugeCard
						label="Humidity"
						value={sensors.humidity}
						unit="%"
						icon={Droplets}
						color="text-blue-500"
						bgColor="bg-blue-100 dark:bg-blue-900/30"
						min={0}
						max={100}
						thresholds={humidityThresholds}
						decimals={1}
					/>
				</motion.div>

				<motion.div
					custom={5}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<SensorGaugeCard
						label="Water Level"
						value={sensors.waterLevel}
						unit="%"
						icon={Waves}
						color="text-indigo-500"
						bgColor="bg-indigo-100 dark:bg-indigo-900/30"
						min={0}
						max={100}
						thresholds={waterLevelThresholds}
					/>
				</motion.div>

				<motion.div
					custom={6}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<SensorGaugeCard
						label="Light Intensity"
						value={sensors.light}
						unit="lux"
						icon={Sun}
						color="text-amber-500"
						bgColor="bg-amber-100 dark:bg-amber-900/30"
						min={0}
						max={1024}
						thresholds={lightThresholds}
					/>
				</motion.div>

				<motion.div
					custom={7}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<SensorGaugeCard
						label="Air Quality"
						value={sensors.airQuality}
						unit="AQI"
						icon={Wind}
						color="text-purple-500"
						bgColor="bg-purple-100 dark:bg-purple-900/30"
						min={0}
						max={500}
						thresholds={airQualityThresholds}
					/>
				</motion.div>
			</div>
		</div>
	);
}
