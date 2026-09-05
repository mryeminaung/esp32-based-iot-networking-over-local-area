import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"
import {
  Droplets, Activity, Power, WifiOff,
  Lightbulb, Zap, ArrowRight,
} from "lucide-react"
import { useDashboardStore, type DeviceKey } from "@/store/use-dashboard-store"
import { sendCommand } from "@/features/dashboard/hooks/useEsp32Sync"
import { getActivityLogs, type ActivityLog } from "@/api/activity"
import { getMoistureCondition } from "@/lib/moistureUtils"
import { Card, CardContent } from "@/components/ui/card"
import LoadingState from "@/components/LoadingState"
import ErrorState from "@/components/ErrorState"
import SystemDecision from "./SystemDecision"

const QUICK_DEVICES: {
  key: DeviceKey
  icon: typeof Lightbulb
  label: string
  color: string
  activeColor: string
}[] = [
  { key: "water_pump", icon: Droplets, label: "Water Pump", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600", activeColor: "bg-blue-600 text-white" },
  { key: "white_light", icon: Lightbulb, label: "Grow Light", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600", activeColor: "bg-purple-600 text-white" },
  { key: "relay", icon: Zap, label: "Relay", color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600", activeColor: "bg-teal-600 text-white" },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
}

export default function WorkerDashboard() {
  const navigate = useNavigate()
  const moisture = useDashboardStore((s) => s.moisture)
  const devices = useDashboardStore((s) => s.devices)
  const connected = useDashboardStore((s) => s.connected)

  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = () => {
    setLoading(true)
    setError(null)
    getActivityLogs({ limit: 8 })
      .then((r) => setRecentActivity(r.logs))
      .catch(() => setError("Failed to load activity"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const condition = getMoistureCondition(moisture)

  const handleToggle = (key: DeviceKey) => {
    const current = useDashboardStore.getState().devices[key]
    sendCommand(key, !current)
  }

  return (
    <>
      {error && (
        <ErrorState
          message={error}
          action={
            <button onClick={fetchData} className="mt-2 inline-flex items-center gap-1.5 text-sm text-green hover:text-green/80">
              Retry
            </button>
          }
        />
      )}

      {loading ? (
        <LoadingState message="Loading dashboard..." />
      ) : (
        <>
          {/* Connection warning */}
          {!connected && (
            <Card className="bg-danger/10 border-danger/30">
              <CardContent className="text-danger text-sm flex items-center gap-2">
                <WifiOff size={16} />
                ESP32 is offline — controls may not respond
              </CardContent>
            </Card>
          )}

          {/* System decision banner */}
          <SystemDecision />

          {/* Moisture + Quick Controls */}
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Soil moisture detail */}
            <motion.div
              custom={0}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <Card>
                <CardContent className="space-y-4">
                  <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <Droplets size={15} className="text-water" />
                    Soil Moisture
                  </h2>

                  {/* Big moisture reading */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        <circle
                          cx="40" cy="40" r="34"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="6"
                          className="text-border"
                        />
                        <circle
                          cx="40" cy="40" r="34"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${(moisture / 100) * 213.6} 213.6`}
                          className="text-water transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-text-primary">{moisture}%</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${condition.bgClass} ${condition.textClass}`}>
                          {condition.label}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted">
                        {moisture <= 30
                          ? "Soil is dry — irrigation needed"
                          : moisture < 50
                            ? "Soil is moist — monitor closely"
                            : "Soil moisture is optimal"}
                      </p>
                    </div>
                  </div>

                  {/* Moisture bar */}
                  <div className="p-3 rounded-xl bg-bg-muted">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-text-primary">Level</span>
                      <span className="text-xs font-bold text-text-primary">{moisture}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-water to-blue-400 transition-all duration-500"
                        style={{ width: `${moisture}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick device controls */}
            <motion.div
              custom={1}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <Card>
                <CardContent className="space-y-4">
                  <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <Power size={15} className="text-text-muted" />
                    Quick Controls
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    {QUICK_DEVICES.map((device) => {
                      const Icon = device.icon
                      const isOn = !!devices[device.key]
                      return (
                        <button
                          key={device.key}
                          onClick={() => handleToggle(device.key)}
                          disabled={!connected}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                            isOn
                              ? `${device.activeColor} border-transparent shadow-sm`
                              : `bg-bg-muted border-border hover:border-green/30 text-text-primary`
                          } ${!connected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-xs font-medium">{device.label}</span>
                          <span className={`text-[0.65rem] font-bold ${isOn ? "opacity-90" : "text-text-muted"}`}>
                            {isOn ? "ON" : "OFF"}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => navigate("/actuators")}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-bg-muted border border-border hover:border-green/30 text-sm text-text-muted hover:text-text-primary transition-all"
                  >
                    All Controls
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent activity */}
          <motion.div
            custom={2}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <Activity size={15} className="text-text-muted" />
                    Recent Activity
                  </h2>
                  <button
                    onClick={() => navigate("/activity")}
                    className="text-xs text-text-muted hover:text-green transition-colors flex items-center gap-1"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-9 h-9 text-border mx-auto mb-2" />
                    <p className="text-sm text-text-muted">No activity yet</p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {recentActivity.map((log, i) => (
                      <motion.div
                        key={log.id}
                        custom={i}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-bg-muted transition-colors"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            log.action === "ON"
                              ? "bg-success"
                              : log.action === "OFF"
                                ? "bg-danger"
                                : "bg-warning"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-text-primary truncate">
                            <span className="font-medium">{log.user?.name || "System"}</span>
                            {" · "}
                            <span className="text-text-muted">{log.device.replace(/_/g, " ")}</span>
                            {" "}
                            <span
                              className={`font-semibold ${
                                log.action === "ON"
                                  ? "text-success"
                                  : log.action === "OFF"
                                    ? "text-danger"
                                    : "text-warning"
                              }`}
                            >
                              {log.action}
                            </span>
                            {log.value !== null ? ` (${log.value}%)` : ""}
                          </p>
                          <p className="text-[0.65rem] text-text-muted mt-0.5">
                            {new Date(log.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </>
  )
}
