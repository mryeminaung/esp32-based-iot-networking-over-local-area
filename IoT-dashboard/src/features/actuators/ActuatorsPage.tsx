import { useDashboardStore, type DeviceKey } from "@/store/dashboard";
import { sendCommand } from "@/features/dashboard/hooks/useEsp32Sync";
import { getMoistureCondition } from "@/lib/moistureUtils";
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
			<div className="card flex items-center gap-3">
				<div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
					<Power className="w-5 h-5 text-amber-600 dark:text-amber-400" />
				</div>
				<div>
					<h1 className="text-xl font-bold text-gray-900 dark:text-white">
						Actuators & Irrigation
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Control pumps, fans, lights and relays
					</p>
				</div>
			</div>

			{/* Connection warning */}
			{!connected && (
				<div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
					<WifiOff size={16} />
					ESP32 is offline — controls may not respond
				</div>
			)}

			{/* Status Overview */}
			<div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
				<div className="card flex items-center gap-3">
					<div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
						<Power className="w-4 h-4 text-amber-600 dark:text-amber-400" />
					</div>
					<div>
						<p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
						<p className="text-lg font-bold text-gray-900 dark:text-white">
							{activeCount}/{actuators.length}
						</p>
					</div>
				</div>
				<div className="card flex items-center gap-3">
					<div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
						<Thermometer className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
					</div>
					<div>
						<p className="text-xs text-gray-500 dark:text-gray-400">Soil</p>
						<p className={`text-lg font-bold ${condition.color}`}>{condition.label}</p>
					</div>
				</div>
				<div className="card flex items-center gap-3">
					<div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
						<Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
					</div>
					<div>
						<p className="text-xs text-gray-500 dark:text-gray-400">Moisture</p>
						<p className="text-lg font-bold text-gray-900 dark:text-white">{moisture}%</p>
					</div>
				</div>
				<div className="card flex items-center gap-3">
					<div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
						<Fan className="w-4 h-4 text-green-600 dark:text-green-400" />
					</div>
					<div>
						<p className="text-xs text-gray-500 dark:text-gray-400">Fan</p>
						<p className="text-lg font-bold text-gray-900 dark:text-white">
							{devices.fan > 0 ? `${devices.fan}%` : "OFF"}
						</p>
					</div>
				</div>
			</div>

			{/* Irrigation Controls */}
			<div className="card">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
						<Droplets size={18} className="text-blue-500" />
						Irrigation Controls
					</h2>
					<div className="flex items-center gap-1.5">
						<Power
							size={12}
							className={devices.water_pump ? "text-green-500" : "text-gray-400"}
						/>
						<span
							className={`text-xs font-semibold ${
								devices.water_pump
									? "text-green-600 dark:text-green-400"
									: "text-gray-400"
							}`}>
							{devices.water_pump ? "RUNNING" : "IDLE"}
						</span>
					</div>
				</div>

				{/* Moisture condition bar */}
				<div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center gap-2">
						<span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
							Mode
						</span>
						<span className="text-xs font-bold text-gray-900 dark:text-white">
							MANUAL
						</span>
					</div>
					<div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
					<div className="flex items-center gap-2">
						<span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
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
			</div>

			{/* Device Status Grid */}
			<div className="card">
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
										? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
										: "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30"
								}`}>
								<div
									className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
										isOn
											? "bg-green-100 dark:bg-green-900/30"
											: "bg-gray-100 dark:bg-gray-800"
									}`}>
									<Icon
										className={`w-4 h-4 ${
											isOn
												? "text-green-600 dark:text-green-400"
												: "text-gray-400 dark:text-gray-500"
										}`}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										{act.label}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{act.description}
									</p>
								</div>
								<span
									className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
										isOn
											? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
											: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
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
			</div>
		</div>
	);
}
