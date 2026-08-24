import { useDashboardStore } from "@/store/use-dashboard-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoistureCard } from "./MoistureCard";

export default function CardContainer() {
	const moisture = useDashboardStore((s) => s.moisture);

	/* Match ESP32 thresholds: ≤30 Red, 31–49 Yellow, ≥50 Green */
	const redActive = moisture <= 30;
	const yellowActive = moisture > 30 && moisture < 50;
	const greenActive = moisture >= 50;

	return (
		<Card className="h-full">
			<CardHeader className="pb-5 max-sm:pb-[14px]">
				<h2 className="text-[1.1rem] font-bold max-sm:text-[1rem]">
					Moisture Status Indicators
				</h2>
			</CardHeader>
			<CardContent>
				<div className="flex flex-wrap md:flex-col-reverse items-center justify-between gap-3 sm:gap-4 md:gap-6">
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
			</CardContent>
		</Card>
	);
}
