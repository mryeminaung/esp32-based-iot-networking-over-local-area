import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useHeader } from "@/hooks/useHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { useDashboardStore } from "@/store/use-dashboard-store";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";
import {
	AlertTriangle,
	Bell,
	Droplets,
	Power,
	Sun,
	Thermometer,
	Waves,
	Wind,
} from "lucide-react";
import RadialGauge from "./components/RadialGauge";
import SensorHealthCard from "./components/SensorHealthCard";
import ThresholdRadialGauge from "./components/ThresholdRadialGauge";

// ── Shared threshold colors (consistent across all sensors) ──
const LOW_COLOR = "#ef4444";
const MED_COLOR = "#f59e0b";
const HIGH_COLOR = "#10b981";

// ── Threshold configs per sensor ──

// ESP32 outputs 0-100 for light (mapped from raw analog 0-4095)
const lightThresholds = [
	{
		max: 30,
		label: "LOW",
		hex: LOW_COLOR,
		bgClass: "bg-red-100 dark:bg-red-900/30",
		textClass: "text-red-600",
	},
	{
		max: 70,
		label: "MED",
		hex: MED_COLOR,
		bgClass: "bg-amber-100 dark:bg-amber-900/30",
		textClass: "text-amber-600",
	},
	{
		max: 100,
		label: "HIGH",
		hex: HIGH_COLOR,
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
	},
];

// ESP32 outputs 0-100 for air quality (mapped from raw analog 0-4095)
// Lower = better air, Higher = worse air
const airQualityThresholds = [
	{
		max: 30,
		label: "LOW",
		hex: HIGH_COLOR,
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
	},
	{
		max: 70,
		label: "MED",
		hex: MED_COLOR,
		bgClass: "bg-amber-100 dark:bg-amber-900/30",
		textClass: "text-amber-600",
	},
	{
		max: 100,
		label: "HIGH",
		hex: LOW_COLOR,
		bgClass: "bg-red-100 dark:bg-red-900/30",
		textClass: "text-red-600",
	},
];

type ThresholdConfig = {
	max: number;
	label: string;
	hex: string;
	bgClass: string;
	textClass: string;
};

function getThreshold(value: number, thresholds: ThresholdConfig[]) {
	for (const t of thresholds) {
		if (value <= t.max) return t;
	}
	return thresholds[thresholds.length - 1];
}

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
		icon: Power,
		onColor: "text-red-500",
		offColor: "text-text-muted",
		iconBg: "bg-red-100 dark:bg-red-900/30",
	},
	{
		key: "yellow_light" as const,
		label: "Yellow LED",
		icon: Power,
		onColor: "text-yellow-500",
		offColor: "text-text-muted",
		iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
	},
	{
		key: "green_light" as const,
		label: "Green LED",
		icon: Power,
		onColor: "text-green-500",
		offColor: "text-text-muted",
		iconBg: "bg-green-100",
	},
	{
		key: "white_light" as const,
		label: "Grow Light",
		icon: Power,
		onColor: "text-purple-500",
		offColor: "text-text-muted",
		iconBg: "bg-purple-100 dark:bg-purple-900/30",
	},
	{
		key: "buzzer" as const,
		label: "Buzzer",
		icon: Bell,
		onColor: "text-amber-500",
		offColor: "text-text-muted",
		iconBg: "bg-amber-100 dark:bg-amber-900/30",
	},
];

// ── Live chart card — subscribes to store, shows rolling buffer ──
const MAX_POINTS = 30;

function LiveChartCard({
	icon: Icon,
	iconColor,
	title,
	unit,
	color,
	sensorKey,
}: {
	icon: React.ComponentType<{ size?: number; className?: string }>;
	iconColor: string;
	title: string;
	unit: string;
	color: string;
	sensorKey: "temperature" | "humidity";
}) {
	const value = useDashboardStore((s) => s.sensors[sensorKey]);
	const [data, setData] = useState<{ time: string; value: number }[]>([]);
	const lastRef = useRef<number | null>(null);

	useEffect(() => {
		if (value === lastRef.current) return;
		lastRef.current = value;
		const now = new Date();
		const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
		setData((prev) => {
			const next = [...prev, { time, value }];
			return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
		});
	}, [value]);

	return (
		<Card className="h-full">
			<CardHeader className="pb-1">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Icon size={16} className={iconColor} />
						<h2 className="text-sm font-semibold text-text-primary">{title}</h2>
					</div>
					<span className="text-lg font-bold text-text-primary">
						{value}
						<span className="text-xs font-normal text-text-muted ml-0.5">{unit}</span>
					</span>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="h-[140px] w-full">
					{data.length > 1 ? (
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
								<defs>
									<linearGradient id={`live-${sensorKey}`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor={color} stopOpacity={0.3} />
										<stop offset="95%" stopColor={color} stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
								<XAxis
									dataKey="time"
									tick={{ fontSize: 10, fill: "var(--text-muted)" }}
									axisLine={false}
									tickLine={false}
									interval="preserveStartEnd"
								/>
								<YAxis
									domain={[0, "auto"]}
									tick={{ fontSize: 10, fill: "var(--text-muted)" }}
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
									formatter={(val: number) => [`${val}${unit}`, title]}
								/>
								<Area
									type="monotone"
									dataKey="value"
									stroke={color}
									strokeWidth={2}
									fill={`url(#live-${sensorKey})`}
									dot={false}
									activeDot={{ r: 4, strokeWidth: 0 }}
								/>
							</AreaChart>
						</ResponsiveContainer>
					) : (
						<div className="h-full flex items-center justify-center text-text-muted text-xs">
							Collecting data...
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

// ── Stat card (for light, air quality) ──
function StatSensorCard({
	icon: Icon,
	title,
	value,
	unit,
	thresholds,
}: {
	icon: React.ComponentType<{ size?: number; className?: string }>;
	iconColor: string;
	title: string;
	value: number;
	unit: string;
	thresholds: ThresholdConfig[];
}) {
	const condition = getThreshold(value, thresholds);

	return (
		<Card
			className="h-full border-l-4"
			style={{ borderLeftColor: condition.hex }}>
			<CardContent className="p-4 space-y-3">
				<div className="flex items-center gap-2">
					<div
						className="w-8 h-8 rounded-lg flex items-center justify-center"
						style={{ backgroundColor: `${condition.hex}20` }}>
						<Icon
							size={16}
							style={{ color: condition.hex }}
						/>
					</div>
					<span className="text-sm font-medium text-text-muted">{title}</span>
				</div>
				<div className="flex items-baseline gap-1.5">
					<span className="text-3xl font-bold text-text-primary">{value}</span>
					<span className="text-sm text-text-muted">{unit}</span>
				</div>
				<motion.div
					key={condition.label}
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className={`${condition.bgClass} px-3 py-1 rounded-full w-fit`}>
					<span className={`text-xs font-bold ${condition.textClass}`}>
						{condition.label}
					</span>
				</motion.div>
			</CardContent>
		</Card>
	);
}

export default function SensorsPage() {
	useHeader("Sensors");
	const devices = useDashboardStore((s) => s.devices);
	const sensors = useDashboardStore((s) => s.sensors);
	const connected = useDashboardStore((s) => s.connected);
	const deviceSettings = useDashboardStore((s) => s.deviceSettings);
	const user = useAuthStore((s) => s.user);
	const isTechnician = user?.role === "technician";

	const isWaterLow =
		sensors.waterLevel <= deviceSettings.waterCriticalThreshold;

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
			{isWaterLow && connected && (
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
							Device Status
						</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
							{deviceList.map((device, i) => {
								const isOn = !!devices[device.key];
								const Icon = device.icon;
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
											<Icon
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

			{/* Row 1: Light + Air Quality — stat cards */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<motion.div
					custom={0}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<StatSensorCard
						icon={Sun}
						iconColor="text-amber-500"
						title="Light Intensity"
						value={sensors.light}
						unit="lux"
						thresholds={lightThresholds}
					/>
				</motion.div>
				<motion.div
					custom={1}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<StatSensorCard
						icon={Wind}
						iconColor="text-purple-500"
						title="Air Quality"
						value={sensors.airQuality}
						unit="AQI"
						thresholds={airQualityThresholds}
					/>
				</motion.div>
			</div>

			{/* Row 2: Soil Moisture + Water Level — radial gauges */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<motion.div
					custom={0}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<SensorCardInline />
				</motion.div>
				<motion.div
					custom={1}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<WaterLevelRadialInline />
				</motion.div>
			</div>

			{/* Row 3: Temperature + Humidity — live charts */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<motion.div
					custom={0}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<LiveChartCard
						icon={Thermometer}
						iconColor="text-cyan-500"
						title="Temperature"
						unit="°C"
						color="#06b6d4"
						sensorKey="temperature"
					/>
				</motion.div>
				<motion.div
					custom={1}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<LiveChartCard
						icon={Droplets}
						iconColor="text-blue-500"
						title="Humidity"
						unit="%"
						color="#3b82f6"
						sensorKey="humidity"
					/>
				</motion.div>
			</div>
		</div>
	);
}

// ── Inline wrappers that read from store (keeps existing gauge components untouched) ──
function SensorCardInline() {
	const moisture = useDashboardStore((s) => s.sensors.soilMoisture);
	const dryThreshold = useDashboardStore(
		(s) => s.deviceSettings.soilDryThreshold,
	);
	const optimalThreshold = useDashboardStore(
		(s) => s.deviceSettings.soilOptimalThreshold,
	);

	return (
		<Card className="text-center h-full">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-center gap-2">
					<Droplets
						size={16}
						className="text-water"
					/>
					<h2 className="text-sm font-semibold text-text-primary">
						Soil Moisture
					</h2>
				</div>
			</CardHeader>
			<CardContent className="pt-0 flex justify-center">
				<div className="w-[180px]">
					<RadialGauge
						value={moisture}
						dryThreshold={dryThreshold}
						optimalThreshold={optimalThreshold}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

function WaterLevelRadialInline() {
	const waterLevel = useDashboardStore((s) => s.sensors.waterLevel);
	const waterLowThreshold = useDashboardStore(
		(s) => s.deviceSettings.waterLowThreshold,
	);
	const midMax = Math.round((waterLowThreshold + 100) / 2);

	const waterLevelThresholds = [
		{
			max: waterLowThreshold,
			label: "LOW",
			hex: LOW_COLOR,
			bgClass: "bg-red-100 dark:bg-red-900/30",
			textClass: "text-red-600",
		},
		{
			max: midMax,
			label: "MED",
			hex: MED_COLOR,
			bgClass: "bg-amber-100 dark:bg-amber-900/30",
			textClass: "text-amber-600",
		},
		{
			max: 100,
			label: "HIGH",
			hex: HIGH_COLOR,
			bgClass: "bg-green-100 dark:bg-green-900/30",
			textClass: "text-green-600",
		},
	];

	const scaleMarkers = [
		{ position: 0, label: "0%" },
		{ position: waterLowThreshold, label: `${waterLowThreshold}%` },
		{ position: midMax, label: `${midMax}%` },
		{ position: 100, label: "100%" },
	];

	return (
		<Card className="text-center h-full">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-center gap-2">
					<Waves
						size={16}
						className="text-indigo-500"
					/>
					<h2 className="text-sm font-semibold text-text-primary">
						Water Level
					</h2>
				</div>
			</CardHeader>
			<CardContent className="pt-0 flex justify-center">
				<div className="w-[180px]">
					<ThresholdRadialGauge
						value={waterLevel}
						max={100}
						thresholds={waterLevelThresholds}
						scaleMarkers={scaleMarkers}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
