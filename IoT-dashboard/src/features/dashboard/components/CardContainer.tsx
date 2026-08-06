import { useDashboardStore } from "@/store/dashboard";
import { MoistureCard } from "./MoistureCard";

export default function CardContainer() {
	const moisture = useDashboardStore((s) => s.moisture);

	/* Match ESP32 thresholds: ≤30 Red, 31–49 Yellow, ≥50 Green */
	const redActive = moisture <= 30;
	const yellowActive = moisture > 30 && moisture < 50;
	const greenActive = moisture >= 50;

	return (
		<section className="card h-full">
			<h2 className="text-[1.1rem] font-bold mb-5 max-sm:text-[1rem] max-sm:mb-[14px]">
				Moisture Status Indicators
			</h2>
			<div className="flex flex-row md:flex-col-reverse items-center justify-between gap-4 sm:gap-6">
				<MoistureCard
					name="Dry"
					gpio={2}
					color="red"
					active={redActive}
				/>
				<MoistureCard
					name="Moist"
					gpio={4}
					color="yellow"
					active={yellowActive}
				/>
				<MoistureCard
					name="Wet"
					gpio={5}
					color="green"
					active={greenActive}
				/>
			</div>
		</section>
	);
}
