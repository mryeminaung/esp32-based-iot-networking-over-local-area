import { useEffect, useState } from "react"
import { Activity, ChevronLeft, ChevronRight, Filter, X } from "lucide-react"
import { getActivityLogs, type ActivityLog, type ActivityFilters } from "@/api/activity"
import { useAuthStore } from "@/store/use-auth-store"
import { useHeader } from "@/hooks/useHeader"
import PageHeader from "@/components/PageHeader"

const DEVICE_OPTIONS = [
  { value: "red_light", label: "Red Light" },
  { value: "yellow_light", label: "Yellow Light" },
  { value: "green_light", label: "Green Light" },
  { value: "white_light", label: "Grow Light" },
  { value: "relay", label: "Relay" },
  { value: "fan", label: "Ventilation Fan" },
  { value: "water_pump", label: "Irrigation Pump" },
]

const ACTION_OPTIONS = [
  { value: "ON", label: "ON" },
  { value: "OFF", label: "OFF" },
  { value: "ADJUST", label: "ADJUST" },
]

const DATE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" },
]

function getDateRange(preset: string): { startDate?: string; endDate?: string } {
  const now = new Date()
  const today = now.toISOString().split("T")[0]

  switch (preset) {
    case "today":
      return { startDate: today, endDate: today }
    case "yesterday": {
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      const y = yesterday.toISOString().split("T")[0]
      return { startDate: y, endDate: y }
    }
    case "week": {
      const weekAgo = new Date(now)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return { startDate: weekAgo.toISOString().split("T")[0], endDate: today }
    }
    case "month": {
      const monthAgo = new Date(now)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return { startDate: monthAgo.toISOString().split("T")[0], endDate: today }
    }
    default:
      return {}
  }
}

function getActionColor(action: string) {
  switch (action) {
    case "ON":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    case "OFF":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    case "ADJUST":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
  }
}

function getRoleBadge(role: string) {
  switch (role) {
    case "farm_manager":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
    case "technician":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    default:
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
  }
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
}

export default function ActivityLogPage() {
  useHeader("Activity Logs")
  const user = useAuthStore((s) => s.user)
  const isManager = user?.role === "farm_manager"

  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })

  // Filters
  const [deviceFilter, setDeviceFilter] = useState("")
  const [actionFilter, setActionFilter] = useState("")
  const [datePreset, setDatePreset] = useState("today")
  const [showFilters, setShowFilters] = useState(false)

  const fetchLogs = async (page = 1) => {
    setLoading(true)
    try {
      const filters: ActivityFilters = { page, limit: 20 }
      if (deviceFilter) filters.device = deviceFilter
      if (actionFilter) filters.action = actionFilter

      const dateRange = getDateRange(datePreset)
      if (dateRange.startDate) filters.startDate = dateRange.startDate
      if (dateRange.endDate) filters.endDate = dateRange.endDate

      const result = await getActivityLogs(filters)
      setLogs(result.logs)
      setPagination(result.pagination)
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs(1)
  }, [deviceFilter, actionFilter, datePreset])

  const hasActiveFilters = deviceFilter || actionFilter || datePreset !== "today"

  const clearFilters = () => {
    setDeviceFilter("")
    setActionFilter("")
    setDatePreset("today")
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      {/* Header */}
      <PageHeader
        title="Activity Logs"
        description={isManager ? "All user activity across the system" : "Your device control history"}
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          )}
        </button>
      </PageHeader>

      {/* Filter bar */}
      {showFilters && (
        <div className="card">
          <div className="flex flex-wrap items-center gap-4">
            {/* Device filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Device
              </label>
              <select
                value={deviceFilter}
                onChange={(e) => setDeviceFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Devices</option>
                {DEVICE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Action
              </label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Actions</option>
                {ACTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Date
              </label>
              <select
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DATE_PRESETS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 mt-5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Logs table */}
      {loading ? (
        <div className="card text-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Loading activity...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="card text-center py-12">
          <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No activity recorded for the selected filters
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <div className="col-span-3">User</div>
            <div className="col-span-2">Device</div>
            <div className="col-span-2">Action</div>
            <div className="col-span-2">Value</div>
            <div className="col-span-3 text-right">Time</div>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {logs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                {/* User */}
                <div className="col-span-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 shrink-0">
                    {(log.user.name || log.user.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {log.user.name || "Unnamed"}
                    </p>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[0.6rem] font-medium ${getRoleBadge(log.user.role)}`}>
                      {log.user.role.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Device */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {DEVICE_OPTIONS.find((d) => d.value === log.device)?.label || log.device}
                  </span>
                </div>

                {/* Action */}
                <div className="col-span-2 flex items-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </div>

                {/* Value */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {log.value !== null ? `${log.value}%` : "—"}
                  </span>
                </div>

                {/* Time */}
                <div className="col-span-3 flex items-center justify-end gap-2 text-right">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDate(log.createdAt)}
                  </span>
                  <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                    {formatTime(log.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-gray-100 dark:border-gray-800 gap-3">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => fetchLogs(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300 tabular-nums">
                  {pagination.page}/{pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchLogs(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
