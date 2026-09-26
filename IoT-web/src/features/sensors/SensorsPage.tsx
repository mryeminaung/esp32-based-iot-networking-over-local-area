import { getSensorReadings, type SensorReading } from "@/api/sensors";
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
	RefreshCw,
	Sun,
	Thermometer,
	Waves,
	Wind,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import RadialGauge from "./components/RadialGauge";
import SensorHealthCard from "./components/SensorHealthCard";
import ThresholdRadialGauge from "./components/ThresholdRadialGauge";

// ── Shared threshold colors (consistent across all sensors) ──
const LOW_COLOR = "#ef4444";
const MED_COLOR = "#f59e0b";
const HIGH_COLOR = "#10b981";

// ── Threshold configs per sensor ──

const lightThresholds = [
	{
		max: 200,
		label: "LOW",
		hex: LOW_COLOR,
		bgClass: "bg-red-100 dark:bg-red-900/30",
		textClass: "text-red-600",
	},
	{
		max: 600,
		label: "MED",
		hex: MED_COLOR,
		bgClass: "bg-amber-100 dark:bg-amber-900/30",
		textClass: "text-amber-600",
	},
	{
		max: 1024,
		label: "HIGH",
		hex: HIGH_COLOR,
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
	},
];

const airQualityThresholds = [
	{
		max: 150,
		label: "LOW",
		hex: HIGH_COLOR,
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
	},
	{
		max: 300,
		label: "MED",
		hex: MED_COLOR,
		bgClass: "bg-amber-100 dark:bg-amber-900/30",
		textClass: "text-amber-600",
	},
	{
		max: 500,
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

// ── Chart sensor card (area chart with recent readings) ──
function ChartSensorCard({
	icon: Icon,
	iconColor,
	title,
	currentValue,
	unit,
	sensorKey,
	chartColor,
}: {
	icon: React.ComponentType<{ size?: number; className?: string }>;
	iconColor: string;
	title: string;
	currentValue: number;
	unit: string;
	sensorKey: keyof Pick<SensorReading, "temperature" | "humidity">;
	chartColor: string;
}) {
	const [readings, setReadings] = useState<
		{ time: string; value: number | null }[]
	>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			const { readings: data } = await getSensorReadings({ limit: 20 });
			const chartData = data
				.map((r) => ({
					time: new Date(r.createdAt).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}),
					value: r[sensorKey],
				}))
				.filter((d): d is { time: string; value: number } => d.value !== null);
			setReadings(chartData);
		} catch {
			// ignore fetch errors
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Card className="h-full">
			<CardHeader className="pb-1">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Icon
							size={16}
							className={iconColor}
						/>
						<h2 className="text-sm font-semibold text-text-primary">{title}</h2>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-lg font-bold text-text-primary">
							{currentValue}
							<span className="text-xs font-normal text-text-muted ml-0.5">
								{unit}
							</span>
						</span>
						<button
							onClick={fetchData}
							className="p-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
							title="Refresh">
							<RefreshCw
								size={14}
								className="text-text-muted"
							/>
						</button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{/* Chart */}
				<div className="h-[120px] w-full">
					{loading ? (
						<div className="h-full flex items-center justify-center text-text-muted text-xs">
							Loading...
						</div>
					) : readings.length > 0 ? (
						<ResponsiveContainer
							width="100%"
							height="100%">
							<AreaChart
								data={readings}
								margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
								<defs>
									<linearGradient
										id={`gradient-${sensorKey}`}
										x1="0"
										y1="0"
										x2="0"
										y2="1">
										<stop
											offset="0%"
											stopColor={chartColor}
											stopOpacity={0.3}
										/>
										<stop
											offset="100%"
											stopColor={chartColor}
											stopOpacity={0.05}
										/>
									</linearGradient>
								</defs>
								<XAxis
									dataKey="time"
									tick={{
										fontSize: 10,
										fill: "var(--color-text-muted, #94a3b8)",
									}}
									axisLine={false}
									tickLine={false}
									interval="preserveStartEnd"
								/>
								<YAxis
									domain={[0, 100]}
									tick={{
										fontSize: 10,
										fill: "var(--color-text-muted, #94a3b8)",
									}}
									axisLine={false}
									tickLine={false}
									width={30}
									ticks={[0, 25, 50, 75, 100]}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "var(--color-bg-card, #fff)",
										border: "1px solid var(--color-border, #e2e8f0)",
										borderRadius: "8px",
										fontSize: "12px",
									}}
									formatter={(value: number) => [`${value}${unit}`, title]}
								/>
								<Area
									type="monotone"
									dataKey="value"
									stroke={chartColor}
									strokeWidth={2}
									fill={`url(#gradient-${sensorKey})`}
									dot={false}
									activeDot={{ r: 4, fill: chartColor }}
								/>
							</AreaChart>
						</ResponsiveContainer>
					) : (
						<div className="h-full flex items-center justify-center text-text-muted text-xs">
							No data yet
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
	iconColor,
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
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

			{/* Row 3: Temperature + Humidity — area charts */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<motion.div
					custom={0}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<ChartSensorCard
						icon={Thermometer}
						iconColor="text-cyan-500"
						title="Temperature"
						currentValue={sensors.temperature}
						unit="°C"
						sensorKey="temperature"
						chartColor="#06b6d4"
					/>
				</motion.div>
				<motion.div
					custom={1}
					variants={fadeInUp}
					initial="hidden"
					animate="visible">
					<ChartSensorCard
						icon={Droplets}
						iconColor="text-blue-500"
						title="Humidity"
						currentValue={sensors.humidity}
						unit="%"
						sensorKey="humidity"
						chartColor="#3b82f6"
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
			<CardContent className="pt-0">
				<RadialGauge
					value={moisture}
					size={120}
					dryThreshold={dryThreshold}
					optimalThreshold={optimalThreshold}
				/>
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
			<CardContent className="pt-0">
				<ThresholdRadialGauge
					value={waterLevel}
					size={120}
					max={100}
					thresholds={waterLevelThresholds}
					scaleMarkers={scaleMarkers}
				/>
			</CardContent>
		</Card>
	);
}
