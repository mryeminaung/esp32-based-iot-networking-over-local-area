import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Threshold = {
	max: number;
	label: string;
	bgClass: string;
	textClass: string;
	barColor: string;
};

type SensorGaugeCardProps = {
	label: string;
	value: number;
	unit: string;
	icon: LucideIcon;
	color: string;
	bgColor: string;
	min?: number;
	max: number;
	thresholds?: Threshold[];
	decimals?: number;
};

function getThreshold(value: number, thresholds: Threshold[]): Threshold {
	for (const t of thresholds) {
		if (value <= t.max) return t;
	}
	return thresholds[thresholds.length - 1];
}

export default function SensorGaugeCard({
	label,
	value,
	unit,
	icon: Icon,
	color,
	bgColor,
	min = 0,
	max,
	thresholds,
	decimals = 0,
}: SensorGaugeCardProps) {
	const clamped = Math.max(min, Math.min(max, value));
	const percentage = ((clamped - min) / (max - min)) * 100;
	const condition = thresholds ? getThreshold(clamped, thresholds) : null;
	const displayValue =
		decimals > 0 ? clamped.toFixed(decimals) : Math.round(clamped);

	return (
		<Card>
			<CardContent className="space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div
							className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center`}>
							<Icon
								size={16}
								className={color}
							/>
						</div>
						<span className="text-sm font-medium text-text-primary">
							{label}
						</span>
					</div>
					{condition && (
						<span
							className={`text-xs font-bold px-2 py-0.5 rounded-full ${condition.bgClass} ${condition.textClass}`}>
							{condition.label}
						</span>
					)}
				</div>

				<div className="flex items-baseline gap-1">
					<span className="text-2xl font-bold text-text-primary">
						{displayValue}
					</span>
					<span className="text-sm text-text-muted">{unit}</span>
				</div>

				<div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
					<motion.div
						className={`h-full rounded-full ${condition?.barColor || color}`}
						initial={{ width: 0 }}
						animate={{ width: `${percentage}%` }}
						transition={{ duration: 0.5, ease: "easeOut" as const }}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
