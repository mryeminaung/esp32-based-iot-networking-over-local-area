import { memo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, WifiOff, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboardStore } from "@/store/use-dashboard-store"

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
}

export default memo(function ConnectionStatus() {
  const connected = useDashboardStore((s) => s.connected)
  const connecting = useDashboardStore((s) => s.connecting)
  const sysInfo = useDashboardStore((s) => s.sysInfo)

  return (
    <motion.div
      variants={fadeInUp}
      custom={0}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            {/* Status indicator */}
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full",
                connected
                  ? "bg-success/10"
                  : connecting
                    ? "bg-warning/10"
                    : "bg-danger/10"
              )}
            >
              {connected ? (
                <Wifi className="w-6 h-6 text-success" />
              ) : (
                <WifiOff
                  className={cn(
                    "w-6 h-6",
                    connecting ? "text-warning" : "text-danger"
                  )}
                />
              )}
            </div>

            {/* Status text */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-text-primary">
                  {connected
                    ? "Connected"
                    : connecting
                      ? "Connecting..."
                      : "Disconnected"}
                </h3>
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    connected
                      ? "bg-success animate-pulse"
                      : connecting
                        ? "bg-warning animate-pulse"
                        : "bg-danger"
                  )}
                />
              </div>
              <p className="text-sm text-text-muted">
                {connected
                  ? `ESP32 is online at ${sysInfo?.ip || "unknown IP"}`
                  : connecting
                    ? "Attempting to connect to ESP32..."
                    : "ESP32 is not reachable"}
              </p>
            </div>

            {/* Last seen */}
            {sysInfo?.uptime && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-text-muted">
                <Clock className="w-4 h-4" />
                <span>Uptime: {sysInfo.uptime}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
})
