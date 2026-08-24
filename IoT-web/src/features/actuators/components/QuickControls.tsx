import { sendCommand } from "@/features/dashboard/hooks/useEsp32Sync";
import { useDashboardStore, type DeviceKey } from "@/store/use-dashboard-store";
import { getMoistureCondition } from "@/lib/moistureUtils";
import { Droplets, Fan, Lightbulb, Square, Power, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ControlItem from "./ControlItem";

const allDevices: {
	key: DeviceKey;
	icon: typeof Lightbulb;
	label: string;
	gpio: string;
	color: string;
	type: "toggle" | "slider";
	disabled?: boolean;
}[] = [
	{
		key: "water_pump",
		icon: Droplets,
		label: "Irrigation Pump",
		gpio: "GPIO 22",
		color: "blue",
		type: "toggle",
	},
	{
		key: "relay",
		icon: Zap,
		label: "Relay",
		gpio: "GPIO 21",
		color: "teal",
		type: "toggle",
	},
	{
		key: "fan",
		icon: Fan,
		label: "Ventilation Fan",
		gpio: "GPIO 19",
		color: "gray",
		type: "slider",
	},
	{
		key: "white_light",
		icon: Lightbulb,
		label: "Grow Light",
		gpio: "GPIO 18",
		color: "purple",
		type: "toggle",
	},
];

export default function QuickControls() {
	const devicesState = useDashboardStore((s) => s.devices);
	const moisture = useDashboardStore((s) => s.moisture);
	const pumpRunning = devicesState.water_pump;
	const condition = getMoistureCondition(moisture);

	const handleToggle = (key: DeviceKey) => {
		const current = useDashboardStore.getState().devices[key];
		sendCommand(key, !current);
	};

	const handleSlider = (key: DeviceKey, val: number) => {
		sendCommand(key, val, val);
	};

	return (
		<Card className="w-full h-full">
			<CardHeader className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4">
				{/* Header with pump status */}
				<div className="flex items-center justify-between">
					<h2 className="text-[0.9375rem] sm:text-[1.05rem] md:text-[1.1rem] font-bold text-text-primary">
						Irrigation Control
					</h2>
					<div className="flex items-center gap-1.5 sm:gap-2">
						<Power size={12} className={`sm:size-[14px] ${pumpRunning ? "text-success" : "text-text-muted"}`} />
						<span className={`text-[0.6875rem] sm:text-[0.75rem] font-semibold ${pumpRunning ? "text-success" : "text-text-muted"}`}>
							{pumpRunning ? "RUNNING" : "IDLE"}
						</span>
					</div>
				</div>

				{/* Mode indicator */}
				<div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-bg-muted border border-border">
					<div className="flex items-center gap-1.5 sm:gap-2">
						<span className="text-[0.625rem] sm:text-[0.7rem] text-text-muted font-medium uppercase tracking-wider">Mode</span>
						<span className="text-[0.6875rem] sm:text-[0.75rem] font-bold text-text-primary">MANUAL</span>
					</div>
					<div className="w-px h-3 sm:h-4 bg-border hidden sm:block" />
					<div className="flex items-center gap-1.5 sm:gap-2">
						<span className="text-[0.625rem] sm:text-[0.7rem] text-text-muted font-medium uppercase tracking-wider">Soil</span>
						<span className={`text-[0.6875rem] sm:text-[0.75rem] font-bold ${condition.color}`}>{condition.label}</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-4 sm:p-5 md:p-6 pt-0">
				{/* Device controls */}
				{allDevices.map((dev, i) => {
					const isLast = i === allDevices.length - 1;
					const val = devicesState[dev.key];

					return dev.type === "slider" ? (
						<ControlItem
							key={dev.key}
							icon={dev.icon}
							label={dev.label}
							gpio={dev.gpio}
							color={dev.color}
							sliderValue={val as number}
							onSliderChange={(v) => handleSlider(dev.key, v)}
							last={isLast}
							hideGpio
						/>
					) : (
						<ControlItem
							key={dev.key}
							icon={dev.icon}
							label={dev.label}
							gpio={dev.gpio}
							color={dev.color}
							checked={val as boolean}
							onToggle={() => handleToggle(dev.key)}
							disabled={dev.disabled}
							last={isLast}
							hideGpio
						/>
					);
				})}
			</CardContent>
		</Card>
	);
}
