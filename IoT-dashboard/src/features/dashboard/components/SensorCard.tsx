import { useDashboardStore } from "@/store/dashboard";
import RadialGauge from "./RadialGauge";
import { Droplets } from "lucide-react";

export default function SensorCard() {
	const moisture = useDashboardStore((s) => s.moisture);

	return (
		<section className="bg-bg-card rounded-2xl p-6 sm:p-8 border border-border text-center h-full">
			<div className="flex items-center justify-center gap-2 mb-5">
				<Droplets size={18} className="text-water" />
				<h2 className="text-[1rem] sm:text-[1.1rem] font-bold text-text-primary">
					Soil Moisture
				</h2>
			</div>
			<RadialGauge value={moisture} />
		</section>
	);
}
