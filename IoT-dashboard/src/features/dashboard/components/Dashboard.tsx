import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import ActivityLog from "./ActivityLog";
import CardContainer from "@/features/sensors/components/CardContainer";
import FarmOverview from "./FarmOverview";
import QuickControls from "@/features/actuators/components/QuickControls";

import SensorCard from "@/features/sensors/components/SensorCard";
import SystemDecision from "./SystemDecision";
import SystemInfo from "./SystemInfo";
import { useAuthStore } from "@/store/use-auth-store";
import { ROLES } from "@/config/roles";

const section = {
	hidden: { opacity: 0, y: 30 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 260, damping: 20 },
	},
};

export default function Dashboard() {
	const user = useAuthStore((s) => s.user);
	const isManager = user?.role === ROLES.FARM_MANAGER;

	return (
		<div className="flex-1 max-w-[1100px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-6 space-y-5">
			{/* Technical Info */}
			<motion.div
				variants={section}
				initial="hidden"
				animate="show">
				<SystemInfo />
			</motion.div>

			{/* Soil Moisture Gauge + LED Status Indicators */}
			<div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-3">
				<motion.div
					variants={section}
					initial="hidden"
					animate="show"
					transition={{ delay: 0.1 }}
					className="md:col-span-2">
					<SensorCard />
				</motion.div>
				<motion.div
					variants={section}
					initial="hidden"
					animate="show"
					transition={{ delay: 0.2 }}
					className="md:col-span-1">
					<CardContainer />
				</motion.div>
			</div>

			{/* System Decision Banner */}
			<motion.div
				variants={section}
				initial="hidden"
				animate="show"
				transition={{ delay: 0.3 }}>
				<SystemDecision />
			</motion.div>

			{/* Irrigation Controls + Farm Overview */}
			<div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-3">
				<motion.div
					variants={section}
					initial="hidden"
					animate="show"
					transition={{ delay: 0.4 }}
					className="md:col-span-2">
					<QuickControls />
				</motion.div>
				<motion.div
					variants={section}
					initial="hidden"
					animate="show"
					transition={{ delay: 0.5 }}
					className="md:col-span-1">
					<FarmOverview />
				</motion.div>
			</div>

			{/* Farm Activity - Manager Only */}
			{isManager && (
				<motion.div
					variants={section}
					initial="hidden"
					animate="show"
					transition={{ delay: 0.6 }}>
					<ActivityLog />
				</motion.div>
			)}

			<Footer />
		</div>
	);
}
