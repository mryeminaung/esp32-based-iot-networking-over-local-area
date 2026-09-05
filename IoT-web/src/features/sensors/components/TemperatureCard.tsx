import { useDashboardStore } from "@/store/use-dashboard-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ThresholdRadialGauge from "./ThresholdRadialGauge";
import { Thermometer } from "lucide-react";

const tempThresholds = [
	{
		max: 15,
		label: "COLD",
		hex: "#3b82f6",
		bgClass: "bg-blue-100 dark:bg-blue-900/30",
		textClass: "text-blue-600",
	},
	{
		max: 30,
		label: "NORMAL",
		hex: "#10b981",
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
	},
	{
		max: 50,
		label: "HOT",
		hex: "#ef4444",
		bgClass: "bg-red-100 dark:bg-red-900/30",
		textClass: "text-red-600",
	},
];

const scaleMarkers = [
	{ position: 0, label: "0°C" },
	{ position: 30, label: "15°C" },
	{ position: 60, label: "30°C" },
	{ position: 100, label: "50°C" },
];

export default function TemperatureCard() {
	const temperature = useDashboardStore((s) => s.sensors.temperature);

	return (
		<Card className="text-center h-full">
			<CardHeader className="pb-5">
				<div className="flex items-center justify-center gap-2">
					<Thermometer size={18} className="text-cyan-500" />
					<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-text-primary">
						Temperature
					</h2>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<ThresholdRadialGauge
					value={temperature}
					min={0}
					max={50}
					thresholds={tempThresholds}
					unit="°C"
					scaleMarkers={scaleMarkers}
				/>
			</CardContent>
		</Card>
	);
}
