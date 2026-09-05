import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export type ThresholdConfig = {
	max: number;
	label: string;
	hex: string;
	bgClass: string;
	textClass: string;
};

type ScaleMarker = {
	position: number; // percentage 0-100
	label: string;
};

type ThresholdRadialGaugeProps = {
	value: number;
	min?: number;
	max: number;
	thresholds: ThresholdConfig[];
	size?: number;
	unit?: string;
	scaleMarkers?: ScaleMarker[];
};

const circumference = 2 * Math.PI * 68;

function AnimatedNumber({ value }: { value: number }) {
	const motionValue = useMotionValue(0);
	const springValue = useSpring(motionValue, { stiffness: 100, damping: 20 });
	const [display, setDisplay] = useState(0);

	useEffect(() => {
		motionValue.set(value);
	}, [motionValue, value]);

	useEffect(() => {
		const unsubscribe = springValue.on("change", (latest) => {
			setDisplay(Math.round(latest));
		});
		return unsubscribe;
	}, [springValue]);

	return <>{display}</>;
}

function getCondition(
	value: number,
	thresholds: ThresholdConfig[],
): ThresholdConfig {
	for (const t of thresholds) {
		if (value <= t.max) return t;
	}
	return thresholds[thresholds.length - 1];
}

export default function ThresholdRadialGauge({
	value,
	min = 0,
	max,
	thresholds,
	size = 200,
	unit = "%",
	scaleMarkers,
}: ThresholdRadialGaugeProps) {
	const fillRef = useRef<SVGCircleElement>(null);

	const gaugeSize =
		size > 120 ? "w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]" : "w-full";

	const clamped = Math.max(min, Math.min(max, value));
	const percentage = ((clamped - min) / (max - min)) * 100;
	const offset = circumference - (percentage / 100) * circumference;

	const condition = getCondition(clamped, thresholds);
	const color = condition.hex;

	useEffect(() => {
		if (fillRef.current) {
			fillRef.current.style.strokeDashoffset = String(offset);
			fillRef.current.style.stroke = color;
		}
	}, [offset, color]);

	return (
		<div className="flex flex-col items-center gap-4">
			<div
				className={`relative mx-auto ${gaugeSize}`}
				style={{ aspectRatio: "1" }}>
				<svg
					className="w-full h-full -rotate-90"
					viewBox="0 0 160 160"
					preserveAspectRatio="xMidYMid meet">
					<circle
						cx="80"
						cy="80"
						r="68"
						fill="none"
						stroke="#e2e8f0"
						strokeWidth={10}
						className="stroke-border"
					/>
					<circle
						ref={fillRef}
						cx="80"
						cy="80"
						r="68"
						fill="none"
						stroke={color}
						strokeWidth={10}
						strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={circumference}
						style={{
							transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease",
						}}
					/>
				</svg>

				{/* Center label */}
				<div className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
					<span className="block text-[2rem] sm:text-[2.5rem] font-bold text-text-primary">
						<AnimatedNumber value={clamped} />
					</span>
					<span className="text-[0.8rem] sm:text-[0.9rem] font-semibold text-text-muted">
						{unit}
					</span>
				</div>
			</div>

			{/* Condition badge */}
			<motion.div
				key={condition.label}
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ type: "spring", stiffness: 400, damping: 15 }}
				className={`${condition.bgClass} px-4 py-1.5 rounded-full`}>
				<span className={`text-[0.8rem] sm:text-[0.875rem] font-bold ${condition.textClass}`}>
					{condition.label}
				</span>
			</motion.div>

			{/* Scale bar */}
			{scaleMarkers && (
				<div className="w-full max-w-[280px]">
					<div className="flex justify-between text-[0.65rem] text-text-muted font-medium mb-1.5">
						{scaleMarkers.map((m) => (
							<span key={m.label}>{m.label}</span>
						))}
					</div>
					<div className="h-2.5 rounded-full overflow-hidden flex">
						{thresholds.map((t, i) => {
							const prevMax = i === 0 ? min : thresholds[i - 1].max;
							const widthPercent =
								((t.max - prevMax) / (max - min)) * 100;
							return (
								<div
									key={t.label}
									className="h-full"
									style={{
										backgroundColor: t.hex,
										flex: `${widthPercent} 0 0`,
									}}
								/>
							);
						})}
					</div>
					{/* Position indicator */}
					<div className="relative h-1 mt-1">
						<motion.div
							className="absolute w-2.5 h-2.5 rounded-full bg-text-primary border-2 border-bg-card shadow -top-[3px]"
							animate={{ left: `calc(${percentage}% - 5px)` }}
							transition={{ type: "spring", stiffness: 300, damping: 25 }}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
