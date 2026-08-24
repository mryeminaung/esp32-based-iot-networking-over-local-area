import { motion } from "framer-motion"
import { useState, useCallback } from "react"
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { sendCommand } from "@/features/dashboard/hooks/useEsp32Sync";
import { useHeader } from "@/hooks/useHeader";
import { getMoistureCondition } from "@/lib/moistureUtils";
import { useDashboardStore, type DeviceKey } from "@/store/use-dashboard-store";
import {
	Droplets,
	Fan,
	Lightbulb,
	Power,
	Thermometer,
	WifiOff,
	Zap,
} from "lucide-react";
import ControlItem from "./components/ControlItem";

const fadeInUp = {
	hidden: { opacity: 0, y: 16 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
	}),
}

const actuators: {
	key: DeviceKey;
	icon: typeof Lightbulb;
	label: string;
	gpio: string;
	color: string;
	type: "toggle" | "slider";
	description: string;
}[] = [
	{
		key: "water_pump",
		icon: Droplets,
		label: "Irrigation Pump",
		gpio: "GPIO 22",
		color: "blue",
		type: "toggle",
		description: "Pumps water to irrigation lines",
	},
	{
		key: "relay",
		icon: Zap,
		label: "Relay",
		gpio: "GPIO 21",
		color: "teal",
		type: "toggle",
		description: "Controls external power circuits",
	},
	{
		key: "fan",
		icon: Fan,
		label: "Ventilation Fan",
		gpio: "GPIO 19",
		color: "gray",
		type: "slider",
		description: "Adjustable speed ventilation",
	},
	{
		key: "white_light",
		icon: Lightbulb,
		label: "Grow Light",
		gpio: "GPIO 18",
		color: "purple",
		type: "toggle",
		description: "Supplemental grow lighting",
	},
];

export default function ActuatorsPage() {
	useHeader("Actuators");
	const devices = useDashboardStore((s) => s.devices);
	const connected = useDashboardStore((s) => s.connected);
	const moisture = useDashboardStore((s) => s.moisture);
	const condition = getMoistureCondition(moisture);
	const [testing, setTesting] = useState<DeviceKey | null>(null);

	const handleToggle = (key: DeviceKey) => {
		const current = useDashboardStore.getState().devices[key];
		sendCommand(key, !current);
	};

	const handleSlider = (key: DeviceKey, val: number) => {
		sendCommand(key, val, val);
	};

	const handleTest = useCallback((key: DeviceKey) => {
		if (testing) return;
		setTesting(key);
		const prev = useDashboardStore.getState().devices[key];

		// Turn on
		sendCommand(key, true);

		// Auto-off after 5 seconds
		setTimeout(() => {
			sendCommand(key, false);
			setTesting(null);
		}, 5000);
	}, [testing]);

	const activeCount = actuators.filter((a) => {
		const val = devices[a.key];
		return typeof val === "boolean" ? val : val > 0;
	}).length;

	return (
		<div className="max-w-[1100px] mx-auto space-y-5">
			{/* Header */}
			<PageHeader
				title="Actuators & Irrigation"
				description="Control pumps, fans, lights and relays"
			/>

			{/* Connection warning */}
			{!connected && (
				<Card className="bg-red-50 border-red-200 hidden">
					<CardContent className="text-red-700 text-sm flex items-center gap-2">
						<WifiOff size={16} />
						ESP32 is offline — controls may not respond
					</CardContent>
				</Card>
			)}

			{/* Status Overview */}
			<div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
				{[
					{ icon: <Power className="w-4 h-4 text-amber-600 dark:text-amber-400" />, bg: "bg-amber-100 dark:bg-amber-900/30", label: "Active", value: `${activeCount}/${actuators.length}` },
					{ icon: <Thermometer className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />, bg: "bg-cyan-100 dark:bg-cyan-900/30", label: "Soil", value: condition.label, valueClass: condition.color },
					{ icon: <Droplets className="w-4 h-4 text-blue-600" />, bg: "bg-blue-100", label: "Moisture", value: `${moisture}%` },
					{ icon: <Fan className="w-4 h-4 text-green-600" />, bg: "bg-green-100", label: "Fan", value: devices.fan > 0 ? `${devices.fan}%` : "OFF" },
				].map((stat, i) => (
					<motion.div
						key={stat.label}
						custom={i}
						variants={fadeInUp}
						initial="hidden"
						animate="visible"
					>
						<Card>
							<CardContent className="flex items-center gap-3">
								<div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
									{stat.icon}
								</div>
								<div>
									<p className="text-xs text-text-muted">{stat.label}</p>
									<p className={`text-lg font-bold ${stat.valueClass || "text-text-primary"}`}>{stat.value}</p>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>

			{/* Controls + Status Grid */}
			<div className="grid gap-5 lg:grid-cols-2">
				{/* Irrigation Controls */}
				<motion.div
					custom={4}
					variants={fadeInUp}
					initial="hidden"
					animate="visible"
				>
					<Card>
						<CardContent>
							<div className="flex items-center justify-between mb-4 gap-2">
								<h2 className="text-base font-semibold text-text-primary flex items-center gap-2 min-w-0">
									<Droplets
										size={18}
										className="text-blue-500 shrink-0"
									/>
									<span className="truncate">Irrigation Controls</span>
								</h2>
								<div className="flex items-center gap-1.5">
									<Power
										size={12}
										className={
											devices.water_pump ? "text-green-500" : "text-gray-400"
										}
									/>
									<span
										className={`text-xs font-semibold ${
											devices.water_pump ? "text-green-600 " : "text-gray-400"
										}`}>
										{devices.water_pump ? "RUNNING" : "IDLE"}
									</span>
								</div>
							</div>

							{/* Moisture condition bar */}
							<div className="flex flex-wrap items-center gap-3 mb-4 p-3 rounded-xl bg-bg-muted border border-border">
								<div className="flex items-center gap-2">
									<span className="text-xs text-text-muted font-medium uppercase tracking-wider">
										Mode
									</span>
									<span className="text-xs font-bold text-text-primary">
										MANUAL
									</span>
								</div>
								<div className="w-px h-4 bg-border" />
								<div className="flex items-center gap-2">
									<span className="text-xs text-text-muted font-medium uppercase tracking-wider">
										Soil
									</span>
									<span className={`text-xs font-bold ${condition.color}`}>
										{condition.label}
									</span>
								</div>
							</div>

							{/* Device list */}
							<div className="space-y-0">
								{actuators.map((act, i) => {
									const isLast = i === actuators.length - 1;
									const val = devices[act.key];

									return act.type === "slider" ? (
										<ControlItem
											key={act.key}
											icon={act.icon}
											label={act.label}
											gpio={act.gpio}
											color={act.color}
											sliderValue={val as number}
											onSliderChange={(v) => handleSlider(act.key, v)}
											onTest={() => handleTest(act.key)}
											testing={testing === act.key}
											last={isLast}
											hideGpio
										/>
									) : (
										<ControlItem
											key={act.key}
											icon={act.icon}
											label={act.label}
											gpio={act.gpio}
											color={act.color}
											checked={val as boolean}
											onToggle={() => handleToggle(act.key)}
											onTest={() => handleTest(act.key)}
											testing={testing === act.key}
											last={isLast}
											hideGpio
										/>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Actuators Status Grid */}
				<motion.div
					custom={5}
					variants={fadeInUp}
					initial="hidden"
					animate="visible"
				>
					<Card>
						<CardContent>
							<h2 className="text-base font-semibold text-text-primary flex items-center gap-2 mb-4">
								<Power
									size={18}
									className="text-amber-500"
								/>
								Actuators Status
							</h2>

							<div className="grid gap-3">
								{actuators.map((act, i) => {
									const val = devices[act.key];
									const isOn = typeof val === "boolean" ? val : val > 0;
									const Icon = act.icon;

									return (
										<motion.div
											key={act.key}
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
												className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
													isOn ? "bg-green-100 " : "bg-bg-muted"
												}`}>
												<Icon
													className={`w-4 h-4 ${
														isOn ? "text-green-600 " : "text-text-muted"
													}`}
												/>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-text-primary">
													{act.label}
												</p>
												<p className="text-xs text-text-muted">{act.description}</p>
											</div>
											<span
												className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
													isOn
														? "bg-green-100 text-green-700 "
														: "bg-bg-muted text-text-muted"
												}`}>
												{typeof val === "number" && act.type === "slider"
													? isOn
														? `${val}%`
														: "OFF"
													: isOn
														? "ON"
														: "OFF"}
											</span>
										</motion.div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
