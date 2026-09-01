import PageHeader from "@/components/PageHeader";
import { useHeader } from "@/hooks/useHeader";
import { useAuthStore } from "@/store/use-auth-store";
import ManagerDashboard from "./components/ManagerDashboard";
import TechnicianDashboard from "./components/TechnicianDashboard";
import WorkerDashboard from "./components/WorkerDashboard";

const ROLE_DASHBOARDS = {
	farm_manager: ManagerDashboard,
	farm_worker: WorkerDashboard,
	technician: TechnicianDashboard,
} as const;

export default function DashboardPage() {
	useHeader("Dashboard");
	const user = useAuthStore((s) => s.user);

	const DashboardView =
		ROLE_DASHBOARDS[user?.role as keyof typeof ROLE_DASHBOARDS] ||
		ManagerDashboard;

	return (
		<div className="max-w-[1100px] mx-auto space-y-5">
			<PageHeader
				title={`Welcome back, ${user?.name || "User"}`}
				description="Here's what's happening on your farm right now"
			/>
			<DashboardView />
		</div>
	);
}
