import { getSensorAnalytics, type SensorAnalytics } from "@/api/sensors";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import PageHeader from "@/components/PageHeader";
import { useHeader } from "@/hooks/useHeader";
import { BarChart3, FileSpreadsheet, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AnalyticsSummary from "./components/AnalyticsSummary";
import DateRangePicker, {
	getDateRange,
	getPresetLabel,
} from "./components/DateRangePicker";
import SensorChart from "./components/SensorChart";
import { exportAnalyticsExcel } from "./exportAnalytics";

const CHART_SENSORS = [
	{
		key: "temperature" as const,
		title: "Temperature",
		color: "#f97316",
		unit: "°C",
	},
	{
		key: "humidity" as const,
		title: "Humidity",
		color: "#3b82f6",
		unit: "%",
	},
	{
		key: "soilMoisture" as const,
		title: "Soil Moisture",
		color: "#16a34a",
		unit: "%",
	},
	{
		key: "light" as const,
		title: "Light Intensity",
		color: "#eab308",
		unit: " lux",
	},
];

const SENSOR_KEYS = [
	"temperature",
	"humidity",
	"soilMoisture",
	"light",
	"airQuality",
	"waterLevel",
] as const;

function aggregatePeriod(data: SensorAnalytics[]): SensorAnalytics {
	const agg: Record<
		string,
		{ avg: number; min: number; max: number; count: number }
	> = {};

	for (const day of data) {
		for (const key of SENSOR_KEYS) {
			const entry = day[key];
			if (entry.avg === null) continue;
			if (!agg[key])
				agg[key] = { avg: 0, min: Infinity, max: -Infinity, count: 0 };
			agg[key].avg += entry.avg;
			agg[key].min = Math.min(agg[key].min, entry.min ?? entry.avg);
			agg[key].max = Math.max(agg[key].max, entry.max ?? entry.avg);
			agg[key].count++;
		}
	}

	const result = {} as Record<
		string,
		{ avg: number | null; min: number | null; max: number | null }
	>;
	for (const key of SENSOR_KEYS) {
		const a = agg[key];
		result[key] =
			a && a.count > 0
				? { avg: a.avg / a.count, min: a.min, max: a.max }
				: { avg: null, min: null, max: null };
	}

	return result as unknown as SensorAnalytics;
}

export default function AnalyticsPage() {
	useHeader("Sensor Analytics");

	const [preset, setPreset] = useState("7d");
	const [analytics, setAnalytics] = useState<SensorAnalytics[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [exporting, setExporting] = useState(false);

	const fetchAnalytics = async () => {
		setLoading(true);
		setError(null);
		try {
			const { from, to } = getDateRange(preset);
			const data = await getSensorAnalytics(from, to);
			setAnalytics(data);
		} catch {
			setError("Failed to load analytics data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAnalytics();
	}, [preset]);

	const periodSummary = useMemo(
		() => (analytics.length > 0 ? aggregatePeriod(analytics) : null),
		[analytics],
	);

	const handleExport = () => {
		if (exporting || analytics.length === 0) return;
		setExporting(true);
		try {
			exportAnalyticsExcel(analytics, preset, getPresetLabel(preset));
		} finally {
			setExporting(false);
		}
	};

	return (
		<div className="max-w-[1100px] mx-auto space-y-5">
			{/* Header */}
			<PageHeader
				title="Sensor Analytics"
				description="Historical sensor data and trends">
				<div className="flex items-center gap-2 flex-wrap justify-end">
					<DateRangePicker
						preset={preset}
						onChange={setPreset}
					/>
					<button
						onClick={handleExport}
						disabled={exporting || loading || analytics.length === 0}
						className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white text-green-700 hover:bg-green-50 text-sm font-semibold shadow-md shadow-green-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border-2 border-white hover:cursor-pointer">
							<FileSpreadsheet className="w-4 h-4" />
							{exporting ? "Exporting..." : "Export Excel"}
						</button>
					</div>
			</PageHeader>

			{error && (
				<ErrorState
					message={error}
					action={
						<button
							onClick={fetchAnalytics}
							className="mt-2 inline-flex items-center gap-1.5 text-sm text-green hover:text-green/80">
							<RefreshCw className="w-3.5 h-3.5" /> Retry
						</button>
					}
				/>
			)}

			{loading ? (
				<LoadingState message="Loading analytics..." />
			) : analytics.length === 0 ? (
				<EmptyState
					icon={<BarChart3 className="w-12 h-12" />}
					title="No sensor data available for the selected period"
					description="Data will appear once the collector starts recording."
				/>
			) : (
				<>
					{/* Summary Cards */}
					<AnalyticsSummary current={periodSummary} />

					{/* Charts */}
					<div className="grid gap-4 sm:grid-cols-2">
						{CHART_SENSORS.map((sensor) => (
							<SensorChart
								key={sensor.key}
								title={`${sensor.title} (${getPresetLabel(preset)} trend)`}
								data={analytics}
								dataKey={sensor.key}
								color={sensor.color}
								unit={sensor.unit}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
}
