import { useDashboardStore } from "@/store/dashboard"
import { Activity, Clock, Globe, Monitor, Network, HardDrive, Wifi, Cpu } from "lucide-react"

export default function DeviceInfoPage() {
  const sysInfo = useDashboardStore((s) => s.sysInfo)
  const connected = useDashboardStore((s) => s.connected)

  const infoItems = [
    { icon: Monitor, label: "Device", value: sysInfo.device, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { icon: Activity, label: "Status", value: connected ? "Online" : "Offline", color: connected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400", bg: connected ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30" },
    { icon: Network, label: "WiFi Network", value: sysInfo.wifi, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/30" },
    { icon: Globe, label: "IP Address", value: sysInfo.ip, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
    { icon: HardDrive, label: "MAC Address", value: sysInfo.mac, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { icon: Monitor, label: "Mode", value: sysInfo.mode, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
    { icon: Clock, label: "Uptime", value: sysInfo.uptime, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  ]

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      {/* Header card */}
      <div className="card flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Device Info
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ESP32 device and network information
          </p>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="card flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {item.value || "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
