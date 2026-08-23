import { useEffect, useState } from "react"
import {
 Users, Power, Wifi, WifiOff,
 Droplets, Activity, Server, Clock, Fan,
 Lightbulb, Cpu, Network,
} from "lucide-react"
import { useAuthStore } from "@/store/use-auth-store"
import { useDashboardStore } from "@/store/use-dashboard-store"
import { backendClient } from "@/api/auth"
import { getActivityLogs, type ActivityLog } from "@/api/activity"
import { useHeader } from "@/hooks/useHeader"
import { getMoistureCondition } from "@/lib/moistureUtils"
import PageHeader from "@/components/PageHeader"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

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

export default function DashboardPage() {
 useHeader("Dashboard")
 const user = useAuthStore((s) => s.user)
 const moisture = useDashboardStore((s) => s.moisture)
 const devices = useDashboardStore((s) => s.devices)
 const connected = useDashboardStore((s) => s.connected)
 const sysInfo = useDashboardStore((s) => s.sysInfo)

 const [userCount, setUserCount] = useState(0)
 const [roleBreakdown, setRoleBreakdown] = useState<Record<string, number>>({})
 const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([])

 useEffect(() => {
 backendClient
 .get("/users")
 .then(({ data }) => {
 const users: User[] = data.data.users
 setUserCount(users.length)
 const breakdown: Record<string, number> = {}
 users.forEach((u) => { breakdown[u.role] = (breakdown[u.role] || 0) + 1 })
 setRoleBreakdown(breakdown)
 })
 .catch(() => {})

 getActivityLogs({ limit: 5 })
 .then((r) => setRecentActivity(r.logs))
 .catch(() => {})
 }, [])

 const condition = getMoistureCondition(moisture)
 const activeDevices = Object.values(devices).filter((v) => v && v !== 0).length
 const totalDevices = Object.keys(devices).length

 const stats = [
 {
 icon: connected ? Wifi : WifiOff,
 label: "ESP32 Status",
 value: connected ? "Online" : "Offline",
 sub: connected ? sysInfo.ip : "No connection",
 iconClass: connected
 ? "bg-success/10 text-success"
 : "bg-danger/10 text-danger",
 },
 {
 icon: Droplets,
 label: "Soil Moisture",
 value: `${moisture}%`,
 sub: condition.label,
 iconClass: `${condition.bgClass} ${condition.textClass}`,
 },
 {
 icon: Power,
 label: "Active Devices",
 value: `${activeDevices}/${totalDevices}`,
 sub: `${activeDevices} device${activeDevices !== 1 ? "s" : ""} running`,
 iconClass: "bg-green-light text-green",
 },
 {
 icon: Users,
 label: "Team",
 value: userCount,
 sub: `${roleBreakdown.farm_manager || 0} mgr · ${roleBreakdown.farm_worker || 0} workers`,
 iconClass: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 ",
 },
 ]

 const sysInfoItems = [
 { icon: Clock, label: "Uptime", value: sysInfo.uptime },
 { icon: Network, label: "Network", value: sysInfo.wifi },
 { icon: Cpu, label: "Mode", value: sysInfo.mode },
 ]

 return (
 <div className="max-w-[1100px] mx-auto space-y-5">
 <PageHeader
 title={`Welcome back, ${user?.name || "User"}`}
 description="Here's what's happening on your farm right now"
 />

 {/* Stat cards */}
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 {stats.map((s) => (
 <Card key={s.label}>
 <CardContent className="flex items-start gap-3">
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.iconClass}`}>
 <s.icon className="w-5 h-5" />
 </div>
 <div className="min-w-0">
 <p className="text-xs text-text-muted font-medium">{s.label}</p>
 <p className="text-xl font-bold text-text-primary mt-0.5">{s.value}</p>
 <p className="text-[0.7rem] text-text-muted mt-0.5 truncate">{s.sub}</p>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>

 <div className="grid gap-5 lg:grid-cols-3">
 {/* Device overview */}
 <Card className="lg:col-span-2">
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
 <div className="p-4 rounded-xl bg-bg-muted">
 <div className="flex items-center justify-between mb-2.5">
 <div className="flex items-center gap-2">
 <Droplets size={15} className="text-water" />
 <span className="text-sm font-medium text-text-primary">Soil Moisture</span>
 </div>
 <div className="flex items-center gap-2">
 <span
 className={`text-xs font-semibold px-2 py-0.5 rounded-full ${condition.bgClass} ${condition.textClass}`}
 >
 {condition.label}
 </span>
 <span className="text-sm font-bold text-text-primary">{moisture}%</span>
 </div>
 </div>
 <div className="w-full h-2 rounded-full bg-border overflow-hidden">
 <div
 className="h-full rounded-full bg-gradient-to-r from-water to-blue-400 transition-all duration-500"
 style={{ width: `${moisture}%` }}
 />
 </div>
 </div>

 {/* System info strip */}
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
 {sysInfoItems.map((item) => (
 <div key={item.label} className="flex items-center gap-2 p-2.5 rounded-lg bg-bg-muted">
 <item.icon size={13} className="text-text-muted shrink-0" />
 <div className="min-w-0">
 <p className="text-[0.6rem] text-text-muted">{item.label}</p>
 <p className="text-xs font-medium text-text-primary truncate">{item.value}</p>
 </div>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>

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
 {recentActivity.map((log) => (
 <div
 key={log.id}
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
 <span className="font-medium">{log.user.name || "User"}</span>
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
 </div>
 ))}
 </div>
 )}
 </CardContent>
 </Card>
 </div>
 </div>
 )
}
