import { useAuthStore } from "@/store/auth"
import { useDashboardStore } from "@/store/dashboard"
import { backendClient } from "@/api/auth"
import { useEffect, useState } from "react"
import {
  Users,
  Thermometer,
  Lightbulb,
  Power,
  Wifi,
  WifiOff,
  Droplets,
  Sprout,
  Activity,
  Server,
  Clock,
  Fan,
} from "lucide-react"

type User = { id: number; role: string }

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const moisture = useDashboardStore((s) => s.moisture)
  const devices = useDashboardStore((s) => s.devices)
  const connected = useDashboardStore((s) => s.connected)
  const sysInfo = useDashboardStore((s) => s.sysInfo)
  const logs = useDashboardStore((s) => s.logs)

  const [userCount, setUserCount] = useState(0)
  const [roleBreakdown, setRoleBreakdown] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await backendClient.get("/users")
        const users: User[] = data.data.users
        setUserCount(users.length)
        const breakdown: Record<string, number> = {}
        users.forEach((u) => {
          breakdown[u.role] = (breakdown[u.role] || 0) + 1
        })
        setRoleBreakdown(breakdown)
      } catch {
        // silently fail — stats will show 0
      }
    }
    fetchUsers()
  }, [])

  const activeDevices = Object.values(devices).filter((v) => v && v !== 0).length
  const totalDevices = Object.keys(devices).length

  const roleLabels: Record<string, string> = {
    farm_manager: "Farm Managers",
    farm_worker: "Farm Workers",
    technician: "Technicians",
  }

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: userCount,
      sub: `${roleBreakdown.farm_manager || 0} managers · ${roleBreakdown.farm_worker || 0} workers · ${roleBreakdown.technician || 0} technicians`,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Thermometer,
      label: "Sensors",
      value: 1,
      sub: `Soil moisture at ${moisture}%`,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Power,
      label: "Active Devices",
      value: `${activeDevices}/${totalDevices}`,
      sub: `${activeDevices} currently ON`,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: connected ? Wifi : WifiOff,
      label: "ESP32 Status",
      value: connected ? "Online" : "Offline",
      sub: connected ? sysInfo.ip : "Not connected",
      color: connected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
      bg: connected ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30",
    },
  ]

  const deviceSummary = [
    { icon: Lightbulb, label: "LEDs", count: 4, active: [devices.red_light, devices.yellow_light, devices.green_light, devices.white_light].filter(Boolean).length, color: "text-amber-500" },
    { icon: Fan, label: "Fan", count: 1, active: devices.fan ? 1 : 0, color: "text-cyan-500" },
    { icon: Droplets, label: "Water Pump", count: 1, active: devices.water_pump ? 1 : 0, color: "text-blue-500" },
    { icon: Power, label: "Relay", count: 1, active: devices.relay ? 1 : 0, color: "text-indigo-500" },
  ]

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      {/* Welcome banner */}
      <div className="card flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
          <Sprout className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || "User"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Here's what's happening on your farm today
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
                {stat.value}
              </p>
              <p className="text-[0.7rem] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                {stat.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Device breakdown */}
        <div className="card lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Server size={18} className="text-gray-500" />
            Device Overview
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {deviceSummary.map((d) => (
              <div
                key={d.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                  <d.icon className={`w-4 h-4 ${d.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {d.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {d.active}/{d.count} active
                  </p>
                </div>
                <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${d.count > 0 ? (d.active / d.count) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Soil moisture bar */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplets size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Soil Moisture
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {moisture}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                style={{ width: `${moisture}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity size={18} className="text-gray-500" />
            Recent Activity
          </h2>

          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No activity yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.slice(-5).reverse().map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-2 p-2 rounded-lg"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      log.type === "on"
                        ? "bg-green-500"
                        : log.type === "off"
                          ? "bg-red-500"
                          : log.type === "adjust"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-700 dark:text-gray-300 truncate">
                      {log.message}
                    </p>
                  </div>
                  <span className="text-[0.65rem] text-gray-400 dark:text-gray-500 shrink-0">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System info row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-3">
          <Clock size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Uptime</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{sysInfo.uptime}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Wifi size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Network</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{sysInfo.wifi}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Server size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Mode</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{sysInfo.mode}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
