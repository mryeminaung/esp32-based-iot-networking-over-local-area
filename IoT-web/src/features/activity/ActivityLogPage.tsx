import {
	getActivityLogs,
	type ActivityFilters,
	type ActivityLog,
} from "@/api/activity";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useHeader } from "@/hooks/useHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { Activity, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { useEffect, useState } from "react";

const DEVICE_OPTIONS = [
	{ value: "red_light", label: "Red Light" },
	{ value: "yellow_light", label: "Yellow Light" },
	{ value: "green_light", label: "Green Light" },
	{ value: "white_light", label: "Grow Light" },
	{ value: "relay", label: "Relay" },
	{ value: "fan", label: "Ventilation Fan" },
	{ value: "water_pump", label: "Irrigation Pump" },
];

const ACTION_OPTIONS = [
	{ value: "ON", label: "On" },
	{ value: "OFF", label: "Off" },
	{ value: "ADJUST", label: "Adjust" },
];

const DATE_PRESETS = [
	{ value: "today", label: "Today" },
	{ value: "yesterday", label: "Yesterday" },
	{ value: "week", label: "This Week" },
	{ value: "month", label: "This Month" },
	{ value: "all", label: "All Time" },
];

function getDateRange(preset: string): {
	startDate?: string;
	endDate?: string;
} {
	const now = new Date();
	const today = now.toISOString().split("T")[0];

	switch (preset) {
		case "today":
			return { startDate: today, endDate: today };
		case "yesterday": {
			const yesterday = new Date(now);
			yesterday.setDate(yesterday.getDate() - 1);
			const y = yesterday.toISOString().split("T")[0];
			return { startDate: y, endDate: y };
		}
		case "week": {
			const weekAgo = new Date(now);
			weekAgo.setDate(weekAgo.getDate() - 7);
			return { startDate: weekAgo.toISOString().split("T")[0], endDate: today };
		}
		case "month": {
			const monthAgo = new Date(now);
			monthAgo.setMonth(monthAgo.getMonth() - 1);
			return {
				startDate: monthAgo.toISOString().split("T")[0],
				endDate: today,
			};
		}
		default:
			return {};
	}
}

function getActionColor(action: string) {
	switch (action) {
		case "On":
			return "bg-green-light text-green";
		case "Off":
			return "bg-red-100 text-red-600";
		case "Adjust":
			return "bg-amber-100 text-amber-600";
		default:
			return "bg-bg-muted text-text-muted";
	}
}

function getRoleBadge(role: string) {
	switch (role) {
		case "farm_manager":
			return "bg-purple-100 text-purple-600";
		case "technician":
			return "bg-blue-100 text-blue-600";
		default:
			return "bg-green-light text-green";
	}
}

function formatTime(dateStr: string) {
	const d = new Date(dateStr);
	return d.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

function formatDate(dateStr: string) {
	const d = new Date(dateStr);
	return d.toLocaleDateString([], {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function ActivityLogPage() {
	useHeader("Activity Logs");
	const user = useAuthStore((s) => s.user);
	const isManager = user?.role === "farm_manager";

	const [logs, setLogs] = useState<ActivityLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 20,
		total: 0,
		totalPages: 0,
	});

	// Filters
	const [deviceFilter, setDeviceFilter] = useState("all");
	const [actionFilter, setActionFilter] = useState("all");
	const [datePreset, setDatePreset] = useState("today");
	const [showFilters, setShowFilters] = useState(false);

	const fetchLogs = async (page = 1) => {
		setLoading(true);
		try {
			const filters: ActivityFilters = { page, limit: 20 };
			if (deviceFilter && deviceFilter !== "all") filters.device = deviceFilter;
			if (actionFilter && actionFilter !== "all") filters.action = actionFilter;

			const dateRange = getDateRange(datePreset);
			if (dateRange.startDate) filters.startDate = dateRange.startDate;
			if (dateRange.endDate) filters.endDate = dateRange.endDate;

			const result = await getActivityLogs(filters);
			setLogs(result.logs);
			setPagination(result.pagination);
		} catch {
			setLogs([]);
			setPagination({ page: 1, limit: 20, total: 0, totalPages: 0 });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLogs(1);
	}, [deviceFilter, actionFilter, datePreset]);

	const deviceLabel = DEVICE_OPTIONS.find((o) => o.value === deviceFilter)?.label;
	const actionLabel = ACTION_OPTIONS.find((o) => o.value === actionFilter)?.label;
	const dateLabel = DATE_PRESETS.find((o) => o.value === datePreset)?.label;

	const hasActiveFilters =
		(deviceFilter && deviceFilter !== "all") ||
		(actionFilter && actionFilter !== "all") ||
		datePreset !== "today";

	const clearFilters = () => {
		setDeviceFilter("all");
		setActionFilter("all");
		setDatePreset("today");
	};

	return (
		<div className="max-w-275 mx-auto space-y-5">
			{/* Header */}
			<PageHeader
				title="Activity Logs"
				description={
					isManager
						? "All user activity across the system"
						: "Your device control history"
				}>
				<button
					onClick={() => setShowFilters(!showFilters)}
					className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
						showFilters || hasActiveFilters
							? "bg-green-100 text-green-600"
							: "bg-bg-muted text-text-muted hover:bg-bg-card-hover"
					}`}>
					<Filter className="w-4 h-4" />
					Filters
					{hasActiveFilters && (
						<span className="w-2 h-2 rounded-full bg-green-500" />
					)}
				</button>
			</PageHeader>

			{/* Table card */}
			{loading ? (
				<Card className="text-center py-12">
					<CardContent>
						<div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
						<p className="text-text-muted">Loading activity...</p>
					</CardContent>
				</Card>
			) : (
				<Card className="p-0 overflow-hidden">
					{/* Inline filters */}
					{showFilters && (
						<div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-border bg-bg-muted/50">
							<Select
								value={deviceFilter}
								onValueChange={setDeviceFilter}>
								<SelectTrigger className="w-40 h-8 text-xs">
									<SelectValue placeholder="All Devices">{deviceLabel || "All Devices"}</SelectValue>
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false}>
									<SelectItem value="all">All Devices</SelectItem>
									{DEVICE_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={actionFilter}
								onValueChange={setActionFilter}>
								<SelectTrigger className="w-32 h-8 text-xs">
									<SelectValue placeholder="All Actions">{actionLabel || "All Actions"}</SelectValue>
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false}>
									<SelectItem value="all">All Actions</SelectItem>
									{ACTION_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={datePreset}
								onValueChange={setDatePreset}>
								<SelectTrigger className="w-32 h-8 text-xs">
									<SelectValue>{dateLabel || "Today"}</SelectValue>
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false}>
									{DATE_PRESETS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
									))}
								</SelectContent>
							</Select>

							{hasActiveFilters && (
								<button
									onClick={clearFilters}
									className="flex items-center gap-1 px-2 py-1 rounded text-xs text-text-muted hover:text-text-primary hover:bg-bg-muted transition-colors">
									<X className="w-3 h-3" />
									Clear
								</button>
							)}
						</div>
					)}

					{/* Table header */}
					<div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-bg-muted border-b border-border text-xs font-medium text-text-muted uppercase tracking-wider">
						<div className="col-span-3">User</div>
						<div className="col-span-2">Device</div>
						<div className="col-span-2">Action</div>
						<div className="col-span-2">Value</div>
						<div className="col-span-3 text-right">Time</div>
					</div>

					{/* Table rows or empty state */}
					{logs.length === 0 ? (
						<div className="text-center py-12">
							<Activity className="w-10 h-10 text-text-muted mx-auto mb-2" />
							<p className="text-sm text-text-muted">
								No activity recorded for the selected filters
							</p>
						</div>
					) : (
					<div className="divide-y divide-border">
						{logs.map((log) => (
							<div
								key={log.id}
								className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-3 hover:bg-bg-muted transition-colors">
								{/* User */}
								<div className="col-span-3 flex items-center gap-2">
									<div className="w-8 h-8 rounded-full bg-bg-muted flex items-center justify-center text-xs font-medium text-text-secondary shrink-0">
										{log.user ? (log.user.name || log.user.email).charAt(0).toUpperCase() : "S"}
									</div>
									<div className="min-w-0">
										<p className="text-sm font-medium text-text-primary truncate">
											{log.user?.name || "System"}
										</p>
										<span
											className={`inline-block px-1.5 py-0.5 rounded text-[0.6rem] font-medium ${getRoleBadge(log.user?.role || "system")}`}>
											{log.user?.role?.replace("_", " ") || "system"}
										</span>
									</div>
								</div>

								{/* Device */}
								<div className="col-span-2 flex items-center">
									<span className="text-sm text-text-secondary">
										{DEVICE_OPTIONS.find((d) => d.value === log.device)
											?.label || log.device}
									</span>
								</div>

								{/* Action */}
								<div className="col-span-2 flex items-center">
									<span
										className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getActionColor(log.action)}`}>
										{log.action}
									</span>
								</div>

								{/* Value */}
								<div className="col-span-2 flex items-center">
									<span className="text-sm text-text-muted">
										{log.value !== null ? `${log.value}%` : "—"}
									</span>
								</div>

								{/* Time */}
								<div className="col-span-3 flex items-center justify-end gap-2 text-right">
									<span className="text-xs text-text-muted">
										{formatDate(log.createdAt)}
									</span>
									<span className="text-sm font-mono text-text-secondary">
										{formatTime(log.createdAt)}
									</span>
								</div>
							</div>
						))}
					</div>
					)}

					{/* Pagination */}
					{pagination.totalPages > 1 && (
						<div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-border gap-3">
							<p className="text-xs sm:text-sm text-text-muted truncate">
								{(pagination.page - 1) * pagination.limit + 1}–
								{Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
								of {pagination.total}
							</p>
							<div className="flex items-center gap-2 shrink-0">
								<button
									onClick={() => fetchLogs(pagination.page - 1)}
									disabled={pagination.page <= 1}
									className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:bg-bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
									<ChevronLeft className="w-4 h-4" />
								</button>
								<span className="text-sm text-text-secondary tabular-nums">
									{pagination.page}/{pagination.totalPages}
								</span>
								<button
									onClick={() => fetchLogs(pagination.page + 1)}
									disabled={pagination.page >= pagination.totalPages}
									className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:bg-bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
									<ChevronRight className="w-4 h-4" />
								</button>
							</div>
						</div>
					)}
				</Card>
			)}
		</div>
	);
}
