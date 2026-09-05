import { useDashboardStore } from "@/store/use-dashboard-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ThresholdRadialGauge from "./ThresholdRadialGauge";
import { Waves } from "lucide-react";

const waterLevelThresholds = [
	{
		max: 20,
		label: "LOW",
		hex: "#ef4444",
		bgClass: "bg-danger/10",
		textClass: "text-danger",
	},
	{
		max: 60,
		label: "MID",
		hex: "#f59e0b",
		bgClass: "bg-warning/10",
		textClass: "text-warning",
	},
	{
		max: 100,
		label: "FULL",
		hex: "#10b981",
		bgClass: "bg-success/10",
		textClass: "text-success",
	},
];

const scaleMarkers = [
	{ position: 0, label: "0%" },
	{ position: 20, label: "20%" },
	{ position: 60, label: "60%" },
	{ position: 100, label: "100%" },
];

export default function WaterLevelCard() {
	const waterLevel = useDashboardStore((s) => s.sensors.waterLevel);

	return (
		<Card className="text-center h-full">
			<CardHeader className="pb-5">
				<div className="flex items-center justify-center gap-2">
					<Waves size={18} className="text-indigo-500" />
					<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-text-primary">
						Water Level
					</h2>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<ThresholdRadialGauge
					value={waterLevel}
					max={100}
					thresholds={waterLevelThresholds}
					scaleMarkers={scaleMarkers}
				/>
			</CardContent>
		</Card>
	);
}
