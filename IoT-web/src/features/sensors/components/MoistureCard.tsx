import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface DeviceCardProps {
	name: string;
	gpio: number;
	color: "red" | "yellow" | "green";
	active: boolean;
}

const colors = {
	red: {
		bg: "bg-red-100",
		text: "text-red-500",
		activeBg: "bg-red-500",
		activeText: "text-white",
		activeIconBg: "bg-white/25",
	},
	yellow: {
		bg: "bg-yellow-100",
		text: "text-amber-500",
		activeBg: "bg-amber-500",
		activeText: "text-white",
		activeIconBg: "bg-white/25",
	},
	green: {
		bg: "bg-green-100",
		text: "text-green-500",
		activeBg: "bg-green-500",
		activeText: "text-white",
		activeIconBg: "bg-white/25",
	},
};

export function MoistureCard({ name, gpio, color, active }: DeviceCardProps) {
	const c = colors[color];

	return (
		<motion.div
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.98 }}
			className={`flex w-full h-full flex-col justify-center items-center gap-2 py-4 rounded-2xl p-3 shadow-sm ${
				active
					? `${c.activeBg} shadow-md`
					: "bg-bg-card shadow-sm border border-border"
			}`}>
			{/* Icon */}
			<motion.div
				animate={active ? { scale: [1, 1.1, 1] } : { scale: 1 }}
				transition={{ duration: 0.4, ease: "easeOut" as const }}
				className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? c.activeIconBg : c.bg}`}>
				<Lightbulb
					className={`h-5 w-5 transition-colors duration-300 ${active ? "text-white" : c.text}`}
				/>
			</motion.div>

			{/* Label */}
			<div className="text-center">
				<h3
					className={`text-xs font-semibold leading-tight transition-colors duration-300 ${active ? "text-white" : ""}`}>
					{name}
				</h3>
			</div>
		</motion.div>
	);
}
