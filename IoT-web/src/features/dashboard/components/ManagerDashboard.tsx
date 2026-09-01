import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"
import {
  Users, Power, Wifi, WifiOff,
  Droplets, Activity, Server, Fan,
  Lightbulb, BarChart3, Bot, RefreshCw, ArrowRight,
} from "lucide-react"
import { useAuthStore } from "@/store/use-auth-store"
import { useDashboardStore } from "@/store/use-dashboard-store"
import { backendClient } from "@/api/auth"
import { getActivityLogs, type ActivityLog } from "@/api/activity"
import { getMoistureCondition } from "@/lib/moistureUtils"
import { Card, CardContent } from "@/components/ui/card"
import LoadingState from "@/components/LoadingState"
import ErrorState from "@/components/ErrorState"

type User = { id: number; role: string }

const DEVICE_GROUPS = [
  {
    icon: Lightbulb,
    label: "Lighting",
    items: [
      { name: "Red", key: "red_light", dot: "bg-red-500" },
      { name: "Yellow", key: "yellow_light", dot: "bg-yellow-400" },
      { name: "Green", key: "green_light", dot: "bg-green-500" },
      { name: "Grow", key: "white_light", dot: "bg-blue-400" },
    ],
  },
  {
    icon: Fan,
    label: "Ventilation",
    items: [{ name: "Fan", key: "fan", dot: "bg-cyan-500" }],
  },
  {
    icon: Droplets,
    label: "Irrigation",
    items: [{ name: "Water Pump", key: "water_pump", dot: "bg-blue-600" }],
  },
  {
    icon: Power,
    label: "Relay",
    items: [{ name: "Relay", key: "relay", dot: "bg-indigo-500" }],
  },
]

const QUICK_ACTIONS = [
  { label: "Analytics", icon: BarChart3, path: "/analytics", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
  { label: "Users", icon: Users, path: "/users", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600" },
  { label: "Automation", icon: Bot, path: "/automation", color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600" },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
}

export default function ManagerDashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const moisture = useDashboardStore((s) => s.moisture)
  const devices = useDashboardStore((s) => s.devices)
  const connected = useDashboardStore((s) => s.connected)

  const [userCount, setUserCount] = useState(0)
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = () => {
    setLoading(true)
    setError(null)
    Promise.all([
      backendClient.get("/users").then(({ data }) => setUserCount(data.data.users.length)),
      getActivityLogs({ limit: 5 }).then((r) => setRecentActivity(r.logs)),
    ])
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const condition = getMoistureCondition(moisture)
  const activeDevices = Object.values(devices).filter((v) => v && v !== 0).length
  const totalDevices = Object.keys(devices).length

  return (
    <>
      {error && (
        <ErrorState
          message={error}
          action={
            <button onClick={fetchData} className="mt-2 inline-flex items-center gap-1.5 text-sm text-green hover:text-green/80">
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          }
        />
      )}

      {loading ? (
        <LoadingState message="Loading dashboard..." />
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: connected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />,
                iconClass: connected ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
                label: "Status",
                value: connected ? "Online" : "Offline",
              },
              {
                icon: <Droplets className="w-5 h-5" />,
                iconClass: `${condition.bgClass} ${condition.textClass}`,
                label: "Soil Moisture",
                value: `${moisture}%`,
              },
              {
                icon: <Power className="w-5 h-5" />,
                iconClass: "bg-green-light text-green",
                label: "Active",
                value: `${activeDevices}/${totalDevices}`,
              },
              {
                icon: <Users className="w-5 h-5" />,
                iconClass: "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
                label: "Team",
                value: userCount,
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardContent className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.iconClass}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">{stat.label}</p>
                      <p className="text-lg font-bold text-text-primary">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {/* Device overview */}
            <motion.div
              custom={4}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2"
            >
              <Card>
                <CardContent className="space-y-4">
                  <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <Server size={15} className="text-text-muted" />
                    Device Status
                  </h2>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {DEVICE_GROUPS.map((group) => {
                      const activeCount = group.items.filter(
                        (d) => devices[d.key as keyof typeof devices]
                      ).length
                      return (
                        <div
                          key={group.label}
                          className="flex items-center gap-3 p-3 rounded-xl bg-bg-muted"
                        >
                          <div className="w-9 h-9 rounded-lg bg-bg-card border border-border flex items-center justify-center shrink-0">
                            <group.icon className="w-4 h-4 text-text-muted" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary">{group.label}</p>
                            <div className="flex gap-1.5 mt-1.5">
                              {group.items.map((d) => (
                                <span
                                  key={d.key}
                                  title={d.name}
                                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    devices[d.key as keyof typeof devices] ? d.dot : "bg-border"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span
                            className={`text-xs font-semibold tabular-nums ${
                              activeCount > 0 ? "text-success" : "text-text-muted"
                            }`}
                          >
                            {activeCount}/{group.items.length}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Soil moisture bar */}
                  <div className="p-3 rounded-xl bg-bg-muted">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Droplets size={14} className="text-water" />
                        <span className="text-xs font-medium text-text-primary">Soil Moisture</span>
                      </div>
                      <span className="text-xs font-bold text-text-primary">{moisture}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-water to-blue-400 transition-all duration-500"
                        style={{ width: `${moisture}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent activity */}
            <Card>
              <CardContent className="space-y-3">
                <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Activity size={15} className="text-text-muted" />
                  Recent Activity
                </h2>

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
          </div>

          {/* Quick actions */}
          <motion.div
            custom={5}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-bg-card border border-border hover:border-green/30 transition-all group text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${action.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{action.label}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-green transition-colors" />
                  </button>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </>
  )
}
