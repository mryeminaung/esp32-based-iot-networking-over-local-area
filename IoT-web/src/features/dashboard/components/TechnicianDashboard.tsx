import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"
import {
  Wifi, Server, Droplets, Power,
  Cpu, Globe, Monitor, Clock, Stethoscope,
  RefreshCw, ArrowRight, Lightbulb, Zap,
} from "lucide-react"
import { useDashboardStore } from "@/store/use-dashboard-store"
import { getMoistureCondition } from "@/lib/moistureUtils"
import { Card, CardContent } from "@/components/ui/card"

const DEVICE_ICONS: Record<string, typeof Lightbulb> = {
  red_light: Lightbulb,
  yellow_light: Lightbulb,
  green_light: Lightbulb,
  white_light: Lightbulb,
  water_pump: Droplets,
  relay: Zap,
}

const DEVICE_LABELS: Record<string, string> = {
  red_light: "Red LED",
  yellow_light: "Yellow LED",
  green_light: "Green LED",
  white_light: "Grow Light",
  water_pump: "Water Pump",
  relay: "Relay",
}

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
}

export default function TechnicianDashboard() {
  const navigate = useNavigate()
  const moisture = useDashboardStore((s) => s.moisture)
  const devices = useDashboardStore((s) => s.devices)
  const connected = useDashboardStore((s) => s.connected)
  const sysInfo = useDashboardStore((s) => s.sysInfo)

  const condition = getMoistureCondition(moisture)
  const activeDevices = Object.values(devices).filter((v) => v && v !== 0).length
  const totalDevices = Object.keys(devices).length

  const systemFields = [
    { icon: Cpu, label: "Device", value: sysInfo.device || "—" },
    { icon: Wifi, label: "WiFi", value: sysInfo.wifi || "—" },
    { icon: Globe, label: "IP Address", value: sysInfo.ip || "—" },
    { icon: Monitor, label: "MAC", value: sysInfo.mac || "—" },
    { icon: Clock, label: "Uptime", value: sysInfo.uptime || "—" },
  ]

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-3">
        {/* System info */}
        <motion.div
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Server size={15} className="text-text-muted" />
                System Information
              </h2>

              <div className="grid gap-2 sm:grid-cols-2">
                {systemFields.map((field) => {
                  const Icon = field.icon
                  return (
                    <div
                      key={field.label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-bg-muted"
                    >
                      <div className="w-8 h-8 rounded-lg bg-bg-card border border-border flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-text-muted" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.65rem] text-text-muted uppercase tracking-wider">{field.label}</p>
                        <p className="text-sm font-medium text-text-primary truncate">{field.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Soil moisture + device count */}
        <motion.div
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Droplets size={15} className="text-water" />
                Sensor Reading
              </h2>

              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="5" className="text-border" />
                    <circle
                      cx="32" cy="32" r="27"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${(moisture / 100) * 169.6} 169.6`}
                      className="text-water transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-text-primary">{moisture}%</span>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${condition.bgClass} ${condition.textClass}`}>
                    {condition.label}
                  </span>
                  <p className="text-xs text-text-muted mt-1">
                    {activeDevices}/{totalDevices} devices active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Device health grid */}
      <motion.div
        custom={2}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Power size={15} className="text-text-muted" />
              Device Health
            </h2>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(devices).map(([key, value]) => {
                const Icon = DEVICE_ICONS[key] || Power
                const isOn = !!value
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      isOn
                        ? "border-success/30 bg-success/5"
                        : "border-border bg-bg-muted"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isOn ? "bg-success/10" : "bg-bg-card border border-border"
                    }`}>
                      <Icon className={`w-4 h-4 ${isOn ? "text-success" : "text-text-muted"}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-text-primary truncate">
                        {DEVICE_LABELS[key] || key}
                      </p>
                      <p className={`text-[0.65rem] font-bold ${isOn ? "text-success" : "text-text-muted"}`}>
                        {isOn ? "ON" : "OFF"}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick links */}
      <motion.div
        custom={3}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => navigate("/diagnostics")}
            className="flex items-center gap-3 p-4 rounded-xl bg-bg-card border border-border hover:border-green/30 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">Diagnostics</p>
              <p className="text-xs text-text-muted">Run system tests</p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-green transition-colors" />
          </button>

          <button
            onClick={() => navigate("/devices")}
            className="flex items-center gap-3 p-4 rounded-xl bg-bg-card border border-border hover:border-green/30 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">Device Info</p>
              <p className="text-xs text-text-muted">Firmware & hardware details</p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-green transition-colors" />
          </button>
        </div>
      </motion.div>
    </>
  )
}
