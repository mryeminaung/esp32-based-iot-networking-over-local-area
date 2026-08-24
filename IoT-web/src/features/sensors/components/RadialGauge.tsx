import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { getMoistureCondition } from "@/lib/moistureUtils";

type RadialGaugeProps = {
	value: number; // 0–100
	size?: number;
};

const circumference = 2 * Math.PI * 68; // r=68 → ~427.26

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

export default function RadialGauge({ value, size = 200 }: RadialGaugeProps) {
	const fillRef = useRef<SVGCircleElement>(null);

	const gaugeSize =
		size > 120 ? "w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]" : "w-full";

	/* Clamp & compute offset */
	const clamped = Math.max(0, Math.min(100, value));
	const offset = circumference - (clamped / 100) * circumference;

	/* Colors based on moisture thresholds */
	const condition = getMoistureCondition(clamped);
	const color = condition.hex;

	/* Animate on change */
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
					{/* Background track */}
					<circle
						cx="80"
						cy="80"
						r="68"
						fill="none"
						stroke="#e2e8f0"
						strokeWidth={10}
						className="stroke-border"
					/>
					{/* Filled arc */}
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
						%
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

			{/* Moisture scale bar */}
			<div className="w-full max-w-[280px]">
				<div className="flex justify-between text-[0.65rem] text-text-muted font-medium mb-1.5">
					<span>0%</span>
					<span>30%</span>
					<span>50%</span>
					<span>100%</span>
				</div>
				<div className="h-2.5 rounded-full overflow-hidden flex">
					<div className="bg-danger flex-1" />
					<div className="bg-warning flex-1" />
					<div className="bg-success flex-[2]" />
				</div>
				{/* Position indicator */}
				<div className="relative h-1 mt-1">
					<motion.div
						className="absolute w-2.5 h-2.5 rounded-full bg-text-primary border-2 border-bg-card shadow -top-[3px]"
						animate={{ left: `calc(${clamped}% - 5px)` }}
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
					/>
				</div>
			</div>
		</div>
	);
}
