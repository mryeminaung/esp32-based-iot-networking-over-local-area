import { useDashboardStore } from "@/store/use-dashboard-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RadialGauge from "./RadialGauge";
import { Droplets } from "lucide-react";

export default function SensorCard() {
	const moisture = useDashboardStore((s) => s.moisture);

	return (
		<Card className="text-center h-full">
			<CardHeader className="pb-5">
				<div className="flex items-center justify-center gap-2">
					<Droplets size={18} className="text-water" />
					<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-text-primary">
						Soil Moisture
					</h2>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<RadialGauge value={moisture} />
			</CardContent>
		</Card>
	);
}
