import { memo } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Wifi,
  Globe,
  HardDrive,
  Clock,
  Cpu,
  Radio,
  Server,
} from "lucide-react"
import type { DeviceStatus } from "../types"

type DeviceStatusCardProps = {
  status: DeviceStatus | null
  connected: boolean
}

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
}

function StatusRow({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  delay: number
}) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-3 p-3 rounded-lg bg-bg-muted/50"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-green-light">
        <Icon className="w-4 h-4 text-green" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm font-medium text-text-primary truncate">
          {value || "—"}
        </p>
      </div>
    </motion.div>
  )
}

export default memo(function DeviceStatusCard({
  status,
  connected,
}: DeviceStatusCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Server className="w-5 h-5 text-green" />
          Device Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!status ? (
          <div className="flex items-center justify-center py-8 text-text-muted">
            {connected ? "Loading device info..." : "Waiting for connection..."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <StatusRow
              icon={HardDrive}
              label="Device"
              value={status.device}
              delay={0}
            />
            <StatusRow
              icon={Globe}
              label="IP Address"
              value={status.ip}
              delay={1}
            />
            <StatusRow
              icon={Radio}
              label="MAC Address"
              value={status.mac}
              delay={2}
            />
            <StatusRow
              icon={Clock}
              label="Uptime"
              value={status.uptime}
              delay={3}
            />
            <StatusRow
              icon={Cpu}
              label="Free Memory"
              value={
                status.freeHeap ? `${status.freeHeap} KB` : "—"
              }
              delay={4}
            />
            <StatusRow
              icon={Wifi}
              label="WiFi Network"
              value={status.wifi}
              delay={5}
            />
            <StatusRow
              icon={Radio}
              label="Mode"
              value={status.mode}
              delay={6}
            />
            <StatusRow
              icon={Server}
              label="Status"
              value={status.status}
              delay={7}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
})
