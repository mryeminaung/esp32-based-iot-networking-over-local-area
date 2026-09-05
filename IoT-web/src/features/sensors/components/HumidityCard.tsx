import { useDashboardStore } from "@/store/use-dashboard-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ThresholdRadialGauge from "./ThresholdRadialGauge";
import { Droplets } from "lucide-react";

const humidityThresholds = [
	{
		max: 30,
		label: "DRY",
		hex: "#f59e0b",
		bgClass: "bg-amber-100 dark:bg-amber-900/30",
		textClass: "text-amber-600",
	},
	{
		max: 70,
		label: "NORMAL",
		hex: "#10b981",
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
	},
	{
		max: 100,
		label: "HUMID",
		hex: "#3b82f6",
		bgClass: "bg-blue-100 dark:bg-blue-900/30",
		textClass: "text-blue-600",
	},
];

const scaleMarkers = [
	{ position: 0, label: "0%" },
	{ position: 30, label: "30%" },
	{ position: 70, label: "70%" },
	{ position: 100, label: "100%" },
];

export default function HumidityCard() {
	const humidity = useDashboardStore((s) => s.sensors.humidity);

	return (
		<Card className="text-center h-full">
			<CardHeader className="pb-5">
				<div className="flex items-center justify-center gap-2">
					<Droplets size={18} className="text-blue-500" />
					<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-text-primary">
						Humidity
					</h2>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<ThresholdRadialGauge
					value={humidity}
					min={0}
					max={100}
					thresholds={humidityThresholds}
					unit="%"
					scaleMarkers={scaleMarkers}
				/>
			</CardContent>
		</Card>
	);
}
