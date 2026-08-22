import { useDashboardStore } from "@/store/use-dashboard-store";
import { History } from "lucide-react";

/* Dot color per log type */
const dotClass: Record<string, string> = {
	on: "bg-success",
	off: "bg-danger",
	info: "bg-water",
	adjust: "bg-warning",
};

export default function ActivityLog() {
	const logs = useDashboardStore((s) => s.logs);
	const clearLogs = useDashboardStore((s) => s.clearLogs);

	return (
		<section className="bg-bg-card rounded-2xl p-4 sm:p-5 md:p-6 border border-border w-full">
			<h2 className="flex items-center gap-2 text-[0.9375rem] sm:text-[1rem] md:text-[1.1rem] font-bold mb-3 sm:mb-4 md:mb-5">
				<History
					size={16}
					className="sm:size-[18px] md:size-5 text-text-muted shrink-0"
				/>
				<span>Farm Activity</span>
				<button
					onClick={clearLogs}
					className="ml-auto text-[0.6875rem] sm:text-[0.7rem] md:text-[0.75rem] font-semibold text-text-muted bg-transparent border border-border rounded-[6px] px-2 sm:px-2.5 md:px-3 py-1 cursor-pointer transition-all hover:text-danger hover:border-danger/30 hover:bg-danger/5 whitespace-nowrap">
					Clear
				</button>
			</h2>

			<div
				className="max-h-[200px] sm:max-h-[250px] md:max-h-[220px] overflow-y-auto"
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "#cbd5e1 transparent",
				}}>
				{logs.length === 0 ? (
					<div className="text-center align-middle text-text-muted py-6 text-[0.8125rem] sm:text-[0.875rem]">
						No activity yet
					</div>
				) : (
					[...logs]
						.reverse()
						.slice(0, 5)
						.map((entry) => (
							<div
								key={entry.id}
								className="flex items-start gap-1.5 sm:gap-2 md:gap-3 py-2 border-b border-border last:border-b-0 text-[0.75rem] sm:text-[0.8125rem] md:text-[0.875rem]">
								<span
									className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 mt-1.5 ${dotClass[entry.type] ?? "bg-text-muted"}`}
								/>
								<span className="text-text-muted text-[0.6875rem] sm:text-[0.75rem] md:text-[0.8125rem] font-[tabular-nums] shrink-0">
									{entry.time}
								</span>
								{/* Message wraps on small screens */}
								<span className="text-text-secondary break-words min-w-0">
									{entry.message}
								</span>
							</div>
						))
				)}
			</div>
		</section>
	);
}
