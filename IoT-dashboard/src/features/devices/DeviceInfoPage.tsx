import { useDashboardStore } from "@/store/use-dashboard-store"
import { useHeader } from "@/hooks/useHeader"
import PageHeader from "@/components/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Clock, Globe, Monitor, Network, HardDrive } from "lucide-react"

export default function DeviceInfoPage() {
 useHeader("Device Info")
 const sysInfo = useDashboardStore((s) => s.sysInfo)
 const connected = useDashboardStore((s) => s.connected)

 const infoItems = [
 { icon: Monitor, label: "Device", value: sysInfo.device, color: "text-blue-600", bg: "bg-blue-100" },
 { icon: Activity, label: "Status", value: connected ? "Online" : "Offline", color: connected ? "text-green-600" : "text-red-600", bg: connected ? "bg-green-100" : "bg-red-100" },
 { icon: Network, label: "WiFi Network", value: sysInfo.wifi, color: "text-violet-600", bg: "bg-violet-100" },
 { icon: Globe, label: "IP Address", value: sysInfo.ip, color: "text-cyan-600", bg: "bg-cyan-100" },
 { icon: HardDrive, label: "MAC Address", value: sysInfo.mac, color: "text-amber-600", bg: "bg-amber-100" },
 { icon: Monitor, label: "Mode", value: sysInfo.mode, color: "text-indigo-600", bg: "bg-indigo-100" },
 { icon: Clock, label: "Uptime", value: sysInfo.uptime, color: "text-emerald-600", bg: "bg-emerald-100" },
 ]

 return (
 <div className="max-w-[1100px] mx-auto space-y-5">
 {/* Header card */}
 <PageHeader
 title="Device Info"
 description="ESP32 device and network information"
 />

 {/* Info grid */}
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {infoItems.map((item) => (
 <Card key={item.label}>
 <CardContent className="flex items-center gap-4">
 <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
 <item.icon className={`w-5 h-5 ${item.color}`} />
 </div>
 <div className="min-w-0">
 <p className="text-xs text-text-muted">
 {item.label}
 </p>
 <p className="text-sm font-semibold text-text-primary truncate">
 {item.value || "—"}
 </p>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 </div>
 )
}
