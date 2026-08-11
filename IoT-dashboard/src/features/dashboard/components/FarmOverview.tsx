import { useDashboardStore } from "@/store/dashboard";
import { getMoistureCondition } from "@/lib/moistureUtils";
import { Droplets, Wifi, Cpu, Sprout } from "lucide-react";
import { motion } from "framer-motion";

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function FarmOverview() {
	const moisture = useDashboardStore((s) => s.moisture);
	const connected = useDashboardStore((s) => s.connected);
	const devices = useDashboardStore((s) => s.devices);
	const sysInfo = useDashboardStore((s) => s.sysInfo);

	const condition = getMoistureCondition(moisture);
	const pumpRunning = devices.water_pump;

	const cards = [
		{
			icon: Sprout,
			label: "Soil Moisture",
			value: `${moisture}%`,
			sub: condition.label,
			subColor: condition.color,
			bg: "bg-accent-light",
			iconColor: "text-accent",
		},
		{
			icon: Droplets,
			label: "Irrigation",
			value: pumpRunning ? "Running" : "Idle",
			sub: pumpRunning ? "Pump active" : "Pump off",
			subColor: pumpRunning ? "text-water" : "text-text-muted",
			bg: "bg-water-light",
			iconColor: "text-water",
		},
		{
			icon: Wifi,
			label: "Network",
			value: connected ? "Online" : "Offline",
			sub: sysInfo.wifi !== "Unknown" ? sysInfo.wifi : "Not connected",
			subColor: connected ? "text-success" : "text-danger",
			bg: "bg-success/10",
			iconColor: "text-success",
		},
		{
			icon: Cpu,
			label: "System",
			value: connected ? "Online" : "Offline",
			sub: sysInfo.uptime,
			subColor: connected ? "text-success" : "text-danger",
			bg: connected ? "bg-success/10" : "bg-danger/10",
			iconColor: connected ? "text-success" : "text-danger",
		},
	];

	return (
		<motion.div
			className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4 h-full"
			variants={container}
			initial="hidden"
			animate="show">
			{cards.map((card) => (
				<motion.div
					key={card.label}
					variants={item}
					whileHover={{ y: -4, boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}
					className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border flex items-start gap-3 cursor-default">
					<div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${card.bg}`}>
						<card.icon size={20} className={card.iconColor} />
					</div>
					<div className="min-w-0">
						<p className="text-[0.7rem] sm:text-[0.75rem] text-text-muted font-medium uppercase tracking-wider">
							{card.label}
						</p>
						<p className="text-[1rem] sm:text-[1.15rem] font-bold text-text-primary mt-0.5 truncate">
							{card.value}
						</p>
						<p className={`text-[0.7rem] sm:text-[0.75rem] font-medium mt-0.5 ${card.subColor}`}>
							{card.sub}
						</p>
					</div>
				</motion.div>
			))}
		</motion.div>
	);
}
