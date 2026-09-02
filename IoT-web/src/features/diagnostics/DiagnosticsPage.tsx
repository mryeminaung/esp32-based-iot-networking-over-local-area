import { memo } from "react"
import { motion } from "framer-motion"
import { useHeader } from "@/hooks/useHeader"
import { useDashboardStore } from "@/store/use-dashboard-store"
import PageHeader from "@/components/PageHeader"
import ConnectionStatus from "./components/ConnectionStatus"
import DeviceStatusCard from "./components/DeviceStatusCard"
import SensorHealthCard from "./components/SensorHealthCard"
import ActuatorTestCard from "./components/ActuatorTestCard"
import { Stethoscope } from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
}

export default memo(function DiagnosticsPage() {
  useHeader("Diagnostics")

  const connected = useDashboardStore((s) => s.connected)
  const sysInfo = useDashboardStore((s) => s.sysInfo)
  const devices = useDashboardStore((s) => s.devices)

  // Build sensor health data from store
  const sensorHealth = connected
    ? {
        soilMoisture: useDashboardStore.getState().moisture,
        red_light: devices.red_light as boolean,
        yellow_light: devices.yellow_light as boolean,
        green_light: devices.green_light as boolean,
        white_light: devices.white_light as boolean,
        relay: devices.relay as boolean,
        water_pump: devices.water_pump as boolean,
      }
    : null

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      <motion.div
        variants={fadeInUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <PageHeader
          title="Device Diagnostics"
          description="Monitor ESP32 status and test actuators"
        >
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Stethoscope className="w-4 h-4" />
            <span>Technician View</span>
          </div>
        </PageHeader>
      </motion.div>

      {/* Connection Status */}
      <ConnectionStatus />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column */}
        <div className="space-y-5">
          <motion.div
            variants={fadeInUp}
            custom={2}
            initial="hidden"
            animate="visible"
          >
            <DeviceStatusCard status={sysInfo} connected={connected} />
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <motion.div
            variants={fadeInUp}
            custom={3}
            initial="hidden"
            animate="visible"
          >
            <SensorHealthCard sensors={sensorHealth} connected={connected} />
          </motion.div>
        </div>
      </div>

      {/* Actuator Testing - Full Width */}
      <motion.div
        variants={fadeInUp}
        custom={4}
        initial="hidden"
        animate="visible"
      >
        <ActuatorTestCard connected={connected} />
      </motion.div>
    </div>
  )
})
