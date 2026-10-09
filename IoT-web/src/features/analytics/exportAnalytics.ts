import { utils, writeFile } from "xlsx"
import type { SensorAnalytics } from "@/api/sensors"

const SENSOR_COLUMNS = [
	{ key: "temperature", label: "Temperature (°C)" },
	{ key: "humidity", label: "Humidity (%)" },
	{ key: "soilMoisture", label: "Soil Moisture (%)" },
	{ key: "light", label: "Light (lux)" },
	{ key: "airQuality", label: "Air Quality (AQI)" },
	{ key: "waterLevel", label: "Water Level" },
] as const

type SensorKey = (typeof SENSOR_COLUMNS)[number]["key"]

function num(val: number | null | undefined): number | string {
	return val === null || val === undefined ? "" : val
}

function buildDailyRows(analytics: SensorAnalytics[]) {
	const headers = ["Date"]
	for (const col of SENSOR_COLUMNS) {
		headers.push(`${col.label} Avg`, `${col.label} Min`, `${col.label} Max`)
	}

	const rows: (string | number)[][] = [headers]

	for (const day of analytics) {
		const row: (string | number)[] = [day.date]
		for (const col of SENSOR_COLUMNS) {
			const entry = day[col.key as SensorKey]
			row.push(num(entry.avg), num(entry.min), num(entry.max))
		}
		rows.push(row)
	}

	return rows
}

function buildSummaryRows(
	analytics: SensorAnalytics[],
	presetLabel: string,
): (string | number)[][] {
	const rows: (string | number)[][] = [
		["Period", presetLabel],
		["Days with data", analytics.length],
		[],
		["Sensor", "Avg", "Min", "Max"],
	]

	for (const col of SENSOR_COLUMNS) {
		let avgSum = 0
		let avgCount = 0
		let min: number | null = null
		let max: number | null = null

		for (const day of analytics) {
			const entry = day[col.key as SensorKey]
			if (entry.avg === null) continue
			avgSum += entry.avg
			avgCount++
			if (entry.min !== null) min = min === null ? entry.min : Math.min(min, entry.min)
			if (entry.max !== null) max = max === null ? entry.max : Math.max(max, entry.max)
		}

		rows.push([
			col.label,
			avgCount > 0 ? Math.round((avgSum / avgCount) * 100) / 100 : "",
			num(min),
			num(max),
		])
	}

	return rows
}

export function exportAnalyticsExcel(
	analytics: SensorAnalytics[],
	preset: string,
	presetLabel: string,
) {
	const daily = utils.aoa_to_sheet(buildDailyRows(analytics))
	const summary = utils.aoa_to_sheet(
		buildSummaryRows(analytics, presetLabel),
	)

	// Reasonable column widths for readability
	daily["!cols"] = [{ wch: 12 }, ...SENSOR_COLUMNS.map(() => ({ wch: 14 }))]
	summary["!cols"] = [{ wch: 28 }, { wch: 12 }, { wch: 12 }, { wch: 12 }]

	const workbook = utils.book_new()
	utils.book_append_sheet(workbook, daily, "Daily Data")
	utils.book_append_sheet(workbook, summary, "Summary")

	const today = new Date().toISOString().split("T")[0]
	const filename = `analytics-${preset}-${today}.xlsx`
	writeFile(workbook, filename)
}
