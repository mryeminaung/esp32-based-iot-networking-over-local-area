import { useDashboardStore } from "@/store/dashboard";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

function getDecision(moisture: number) {
	if (moisture <= 30) {
		return {
			status: "DRY",
			message: "Irrigation required",
			detail: "Start irrigation recommended",
			icon: AlertTriangle,
			bg: "bg-danger/8",
			border: "border-danger/20",
			iconColor: "text-danger",
			statusColor: "text-danger",
		};
	}
	if (moisture < 50) {
		return {
			status: "MOIST",
			message: "Monitor soil condition",
			detail: "Irrigation may be needed",
			icon: Info,
			bg: "bg-warning/8",
			border: "border-warning/20",
			iconColor: "text-warning",
			statusColor: "text-warning",
		};
	}
	return {
		status: "WET / OPTIMAL",
		message: "Soil moisture sufficient",
		detail: "No irrigation required",
		icon: CheckCircle,
		bg: "bg-success/8",
		border: "border-success/20",
		iconColor: "text-success",
		statusColor: "text-success",
	};
}

export default function SystemDecision() {
	const moisture = useDashboardStore((s) => s.moisture);
	const decision = getDecision(moisture);
	const Icon = decision.icon;

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={decision.status}
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.98 }}
				transition={{ duration: 0.2 }}
				className={`rounded-2xl border ${decision.bg} ${decision.border} p-4 sm:p-5 flex items-center gap-4`}>
				<motion.div
					initial={{ rotate: -10 }}
					animate={{ rotate: 0 }}
					transition={{ type: "spring", stiffness: 400, damping: 15 }}
					className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${decision.bg}`}>
					<Icon
						size={22}
						className={decision.iconColor}
					/>
				</motion.div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<h3
							className={`text-[0.95rem] sm:text-[1.05rem] font-bold ${decision.statusColor}`}>
							{decision.status}
						</h3>
						<span className="text-[0.8rem] sm:text-[0.875rem] text-text-secondary font-medium">
							{decision.message}
						</span>
					</div>
					<p className="text-[0.75rem] sm:text-[0.8125rem] text-text-muted mt-0.5">
						{decision.detail}
					</p>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
