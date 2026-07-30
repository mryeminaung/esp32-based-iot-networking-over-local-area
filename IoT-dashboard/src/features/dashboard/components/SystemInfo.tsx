import { useDashboardStore } from "@/store/dashboard";
import { Activity, Clock, Globe, Monitor, Network } from "lucide-react";
import InfoRow from "./InfoRow";

export default function SystemInfo() {
	const sysInfo = useDashboardStore((s) => s.sysInfo);
	const connected = useDashboardStore((s) => s.connected);

	const rows = [
		{ icon: Monitor, label: "Device", value: sysInfo.device },
		{ icon: Network, label: "WiFi", value: sysInfo.wifi },
		{ icon: Activity, label: "Status", value: connected ? "Online" : "Offline" },
		{ icon: Monitor, label: "Mode", value: sysInfo.mode },
		{ icon: Globe, label: "IP Address", value: sysInfo.ip },
		{ icon: Clock, label: "Uptime", value: sysInfo.uptime },
	];

	return (
		<section className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border">
			<h2 className="text-[1rem] sm:text-[1.1rem] font-bold mb-4 text-text-primary">
				Technical Details
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-0">
				{rows.map((r) => (
					<InfoRow
						key={r.label}
						icon={r.icon}
						label={r.label}
						value={r.value}
					/>
				))}
			</div>
		</section>
	);
}
