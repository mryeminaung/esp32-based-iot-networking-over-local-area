import { useDashboardStore } from "@/store/dashboard"
import { Activity } from "lucide-react"

export default function ActivityLogPage() {
  const logs = useDashboardStore((s) => s.logs)

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      {/* Header card */}
      <div className="card flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Activity Logs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Device control history and sensor events
          </p>
        </div>
      </div>

      {/* Logs card */}
      {logs.length === 0 ? (
        <div className="card text-center py-12">
          <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No activity recorded yet
          </p>
        </div>
      ) : (
        <div className="card p-0 divide-y divide-gray-100 dark:divide-gray-800">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 px-5 py-3"
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  log.type === "on"
                    ? "bg-green-500"
                    : log.type === "off"
                      ? "bg-red-500"
                      : log.type === "adjust"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                }`}
              />
              <span className="text-xs text-gray-400 dark:text-gray-500 w-20 shrink-0">
                {log.time}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {log.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
