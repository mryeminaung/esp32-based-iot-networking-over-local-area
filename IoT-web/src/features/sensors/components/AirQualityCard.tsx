import { useDashboardStore } from "@/store/use-dashboard-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ThresholdRadialGauge from "./ThresholdRadialGauge";
import { Wind } from "lucide-react";

const airQualityThresholds = [
	{
		max: 150,
		label: "GOOD",
		hex: "#10b981",
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
	},
	{
		max: 300,
		label: "MODERATE",
		hex: "#f59e0b",
		bgClass: "bg-amber-100 dark:bg-amber-900/30",
		textClass: "text-amber-600",
	},
	{
		max: 500,
		label: "POOR",
		hex: "#ef4444",
		bgClass: "bg-red-100 dark:bg-red-900/30",
		textClass: "text-red-600",
	},
];

const scaleMarkers = [
	{ position: 0, label: "0" },
	{ position: 30, label: "150" },
	{ position: 60, label: "300" },
	{ position: 100, label: "500" },
];

export default function AirQualityCard() {
	const airQuality = useDashboardStore((s) => s.sensors.airQuality);

	return (
		<Card className="text-center h-full">
			<CardHeader className="pb-5">
				<div className="flex items-center justify-center gap-2">
					<Wind size={18} className="text-purple-500" />
					<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-text-primary">
						Air Quality
					</h2>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<ThresholdRadialGauge
					value={airQuality}
					min={0}
					max={500}
					thresholds={airQualityThresholds}
					unit="AQI"
					scaleMarkers={scaleMarkers}
				/>
			</CardContent>
		</Card>
	);
}
