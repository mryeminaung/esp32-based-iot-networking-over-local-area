import { motion } from "framer-motion"
import SensorCard from "./components/SensorCard";
import { MoistureCard } from "./components/MoistureCard";
import SensorHealthCard from "./components/SensorHealthCard";
import { useDashboardStore } from "@/store/use-dashboard-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useHeader } from "@/hooks/useHeader";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Power, WifiOff, Droplets, Waves, Thermometer } from "lucide-react";

const fadeInUp = {
	hidden: { opacity: 0, y: 16 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
	}),
}

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
];

export default function SensorsPage() {
	useHeader("Sensors");
	const devices = useDashboardStore((s) => s.devices);
	const moisture = useDashboardStore((s) => s.moisture);
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
					animate="visible"
				>
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

			{/* Device States Grid */}
			<motion.div
				custom={0}
				variants={fadeInUp}
				initial="hidden"
				animate="visible"
			>
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
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
					animate="visible"
				>
					<SensorCard />
				</motion.div>
				<motion.div
					className="md:col-span-1 flex gap-2 flex-col-reverse"
					custom={1}
					variants={fadeInUp}
					initial="hidden"
					animate="visible"
				>
					<MoistureCard name="Dry" gpio={2} color="red" active={moisture <= 30} />
					<MoistureCard name="Moist" gpio={4} color="yellow" active={moisture > 30 && moisture < 50} />
					<MoistureCard name="Optimal" gpio={5} color="green" active={moisture >= 50} />
				</motion.div>
			</div>

			{/* DHT22 & Water Level Placeholder Cards */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				{/* DHT22 Temperature & Humidity */}
				<motion.div
					custom={2}
					variants={fadeInUp}
					initial="hidden"
					animate="visible"
				>
					<Card className="relative overflow-hidden">
						<div className="absolute top-3 right-3">
							<Badge variant="outline" className="text-[0.625rem] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
								COMING SOON
							</Badge>
						</div>
						<CardContent>
							<div className="flex items-center gap-2 mb-4">
								<Thermometer size={18} className="text-cyan-500" />
								<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-text-primary">
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
				</motion.div>

				{/* Water Level Sensor */}
				<motion.div
					custom={3}
					variants={fadeInUp}
					initial="hidden"
					animate="visible"
				>
					<Card className="relative overflow-hidden">
						<div className="absolute top-3 right-3">
							<Badge variant="outline" className="text-[0.625rem] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
								COMING SOON
							</Badge>
						</div>
						<CardContent>
							<div className="flex items-center gap-2 mb-4">
								<Waves size={18} className="text-blue-500" />
								<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-text-primary">
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
				</motion.div>
			</div>

		</div>
	);
}
