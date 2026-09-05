import { useDashboardStore } from "@/store/use-dashboard-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ThresholdRadialGauge from "./ThresholdRadialGauge";
import { Sun } from "lucide-react";

const lightThresholds = [
	{
		max: 200,
		label: "DIM",
		hex: "#a855f7",
		bgClass: "bg-purple-100 dark:bg-purple-900/30",
		textClass: "text-purple-600",
	},
	{
		max: 600,
		label: "NORMAL",
		hex: "#10b981",
		bgClass: "bg-green-100 dark:bg-green-900/30",
		textClass: "text-green-600",
	},
	{
		max: 1024,
		label: "BRIGHT",
		hex: "#f59e0b",
		bgClass: "bg-amber-100 dark:bg-amber-900/30",
		textClass: "text-amber-600",
	},
];

const scaleMarkers = [
	{ position: 0, label: "0" },
	{ position: 20, label: "200" },
	{ position: 59, label: "600" },
	{ position: 100, label: "1024" },
];

export default function LightCard() {
	const light = useDashboardStore((s) => s.sensors.light);

	return (
		<Card className="text-center h-full">
			<CardHeader className="pb-5">
				<div className="flex items-center justify-center gap-2">
					<Sun size={18} className="text-amber-500" />
					<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-text-primary">
						Light Intensity
					</h2>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<ThresholdRadialGauge
					value={light}
					min={0}
					max={1024}
					thresholds={lightThresholds}
					unit="lux"
					scaleMarkers={scaleMarkers}
				/>
			</CardContent>
		</Card>
	);
}
