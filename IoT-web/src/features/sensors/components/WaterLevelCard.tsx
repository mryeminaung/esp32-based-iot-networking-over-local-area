import { useDashboardStore } from "@/store/use-dashboard-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ThresholdRadialGauge from "./ThresholdRadialGauge";
import { Waves } from "lucide-react";

export default function WaterLevelCard() {
	const waterLevel = useDashboardStore((s) => s.sensors.waterLevel);
	const waterLowThreshold = useDashboardStore((s) => s.deviceSettings.waterLowThreshold);

	// Derive bands from store thresholds
	const midMax = Math.round((waterLowThreshold + 100) / 2);

	const waterLevelThresholds = [
		{
			max: waterLowThreshold,
			label: "LOW",
			hex: "#ef4444",
			bgClass: "bg-danger/10",
			textClass: "text-danger",
		},
		{
			max: midMax,
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
		{ position: waterLowThreshold, label: `${waterLowThreshold}%` },
		{ position: midMax, label: `${midMax}%` },
		{ position: 100, label: "100%" },
	];

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
