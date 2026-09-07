import { Bell } from "lucide-react";
import { motion } from "framer-motion";

interface BuzzerIndicatorProps {
	active: boolean;
	buzzerEnabled?: boolean;
	buzzerLowWater?: boolean;
}

const buzzerShake = {
	x: [0, -3, 3, -3, 2, -1, 0],
	transition: {
		duration: 0.4,
		repeat: Infinity,
		repeatDelay: 1.2,
		ease: "easeInOut" as const,
	},
};

export function BuzzerIndicator({ active, buzzerEnabled = true, buzzerLowWater = true }: BuzzerIndicatorProps) {
	const isActive = active && buzzerEnabled && buzzerLowWater;

	return (
		<motion.div
			animate={isActive ? buzzerShake : { x: 0 }}
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.98 }}
			className={`flex w-full h-full flex-col justify-center items-center gap-2 py-4 rounded-2xl p-3 shadow-sm ${
				isActive
					? "bg-amber-500 shadow-md"
					: "bg-bg-card shadow-sm border border-border"
			}`}>
			{/* Icon */}
			<motion.div
				animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
				transition={{ duration: 0.4, ease: "easeOut" as const }}
				className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? "bg-white/25" : "bg-amber-100"}`}>
				<Bell
					className={`h-5 w-5 transition-colors duration-300 ${isActive ? "text-white" : "text-amber-500"}`}
				/>
			</motion.div>

			{/* Label */}
			<div className="text-center">
				<h3
					className={`text-xs font-semibold leading-tight transition-colors duration-300 ${isActive ? "text-white" : ""}`}>
					Buzzer
				</h3>
				{!buzzerEnabled && (
					<p className="text-[0.6rem] text-text-muted mt-0.5">Disabled</p>
				)}
			</div>
		</motion.div>
	);
}
