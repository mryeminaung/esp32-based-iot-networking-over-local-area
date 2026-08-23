import { useDashboardStore, type DeviceKey } from "@/store/use-dashboard-store";
import { sendCommand } from "@/features/dashboard/hooks/useEsp32Sync";
import { getMoistureCondition } from "@/lib/moistureUtils";
import { useHeader } from "@/hooks/useHeader";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ControlItem from "./components/ControlItem";
import {
	Droplets,
	Fan,
	Lightbulb,
	Zap,
	Power,
	WifiOff,
	Thermometer,
} from "lucide-react";

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

	const handleToggle = (key: DeviceKey) => {
		const current = useDashboardStore.getState().devices[key];
		sendCommand(key, !current);
	};

	const handleSlider = (key: DeviceKey, val: number) => {
		sendCommand(key, val, val);
	};

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
				<Card className="bg-red-50 border-red-200 ">
					<CardContent className="text-red-700 text-sm flex items-center gap-2">
						<WifiOff size={16} />
						ESP32 is offline — controls may not respond
					</CardContent>
				</Card>
			)}

			{/* Status Overview */}
			<div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
				<Card>
					<CardContent className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
							<Power className="w-4 h-4 text-amber-600 dark:text-amber-400" />
						</div>
						<div>
							<p className="text-xs text-text-muted">Active</p>
							<p className="text-lg font-bold text-gray-900 dark:text-white">
								{activeCount}/{actuators.length}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
							<Thermometer className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
						</div>
						<div>
							<p className="text-xs text-text-muted">Soil</p>
							<p className={`text-lg font-bold ${condition.color}`}>{condition.label}</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
							<Droplets className="w-4 h-4 text-blue-600 " />
						</div>
						<div>
							<p className="text-xs text-text-muted">Moisture</p>
							<p className="text-lg font-bold text-gray-900 dark:text-white">{moisture}%</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
							<Fan className="w-4 h-4 text-green-600 " />
						</div>
						<div>
							<p className="text-xs text-text-muted">Fan</p>
							<p className="text-lg font-bold text-gray-900 dark:text-white">
								{devices.fan > 0 ? `${devices.fan}%` : "OFF"}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Irrigation Controls */}
			<Card>
				<div className="flex items-center justify-between mb-4 gap-2">
					<h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 min-w-0">
						<Droplets size={18} className="text-blue-500 shrink-0" />
						<span className="truncate">Irrigation Controls</span>
					</h2>
					<div className="flex items-center gap-1.5">
						<Power
							size={12}
							className={devices.water_pump ? "text-green-500" : "text-gray-400"}
						/>
						<span
							className={`text-xs font-semibold ${
								devices.water_pump
									? "text-green-600 "
									: "text-gray-400"
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
						<span className="text-xs font-bold text-gray-900 dark:text-white">
							MANUAL
						</span>
					</div>
					<div className="w-px h-4 bg-border" />
					<div className="flex items-center gap-2">
						<span className="text-xs text-text-muted font-medium uppercase tracking-wider">
							Soil
						</span>
						<span className={`text-xs font-bold ${condition.color}`}>{condition.label}</span>
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
								last={isLast}
								hideGpio
							/>
						);
					})}
				</div>
			</Card>

			{/* Device Status Grid */}
			<Card>
				<h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
					<Power size={18} className="text-amber-500" />
					Device Status
				</h2>

				<div className="grid gap-3 sm:grid-cols-2">
					{actuators.map((act) => {
						const val = devices[act.key];
						const isOn = typeof val === "boolean" ? val : val > 0;
						const Icon = act.icon;

						return (
							<div
								key={act.key}
								className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
									isOn
										? "border-green-200 bg-green-50/50 dark:bg-green-900/10"
										: "border-border bg-bg-muted"
								}`}>
								<div
									className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
										isOn
											? "bg-green-100 "
											: "bg-bg-muted"
									}`}>
									<Icon
										className={`w-4 h-4 ${
											isOn
												? "text-green-600 "
												: "text-text-muted"
										}`}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										{act.label}
									</p>
									<p className="text-xs text-text-muted">
										{act.description}
									</p>
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
							</div>
						);
					})}
				</div>
			</Card>
		</div>
	);
}
