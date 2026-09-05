import { memo } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Droplets,
  Lightbulb,
  Power,
  Waves,
} from "lucide-react"
import type { SensorHealth } from "../types"
import { DEVICE_LABELS, LED_DEVICES, DIGITAL_DEVICES } from "../types"
import { cn } from "@/lib/utils"
import { getMoistureCondition } from "@/lib/moistureUtils"

type SensorHealthCardProps = {
  sensors: SensorHealth | null
  connected: boolean
}

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
}

function MoistureIndicator({ value }: { value: number }) {
  const condition = getMoistureCondition(value)
  return (
    <motion.div
      variants={fadeInUp}
      custom={0}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-3 p-3 rounded-lg bg-bg-muted/50"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-water-light">
        <Droplets className="w-4 h-4 text-water" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-muted">Soil Moisture</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-text-primary">
            {value}%
          </p>
          <span
            className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded",
              condition.bgClass,
              condition.textClass
            )}
          >
            {condition.label}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function DeviceIndicator({
  device,
  isOn,
  delay,
}: {
  device: string
  isOn: boolean
  delay: number
}) {
  const label = DEVICE_LABELS[device] || device
  const isLed = LED_DEVICES.includes(device as typeof LED_DEVICES[number])
  const isDigital = DIGITAL_DEVICES.includes(device as typeof DIGITAL_DEVICES[number])

  let iconColor = "text-text-muted"
  if (isOn) {
    if (isLed) {
      if (device === "red_light") iconColor = "text-danger"
      else if (device === "yellow_light") iconColor = "text-warning"
      else if (device === "green_light") iconColor = "text-success"
      else iconColor = "text-text-primary"
    } else {
      iconColor = "text-green"
    }
  }

  return (
    <motion.div
      variants={fadeInUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-muted/50"
    >
      <div
        className={cn(
          "w-3 h-3 rounded-full",
          isOn ? "bg-success" : "bg-text-muted/30"
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text-primary">{label}</p>
      </div>
      <span
        className={cn(
          "text-xs font-medium",
          isOn ? "text-success" : "text-text-muted"
        )}
      >
        {isOn ? "ON" : "OFF"}
      </span>
    </motion.div>
  )
}

export default memo(function SensorHealthCard({
  sensors,
  connected,
}: SensorHealthCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Waves className="w-5 h-5 text-water" />
          Sensor & Actuator Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!sensors ? (
          <div className="flex items-center justify-center py-8 text-text-muted">
            {connected ? "Loading sensor data..." : "Waiting for connection..."}
          </div>
        ) : (
          <div className="space-y-2">
            <MoistureIndicator value={sensors.soilMoisture} />

            <div className="pt-2">
              <p className="text-xs font-medium text-text-muted mb-2 px-1">
                Actuators
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LED_DEVICES.map((device, i) => (
                  <DeviceIndicator
                    key={device}
                    device={device}
                    isOn={sensors[device as keyof SensorHealth] as boolean}
                    delay={i + 1}
                  />
                ))}
                {DIGITAL_DEVICES.map((device, i) => (
                  <DeviceIndicator
                    key={device}
                    device={device}
                    isOn={sensors[device as keyof SensorHealth] as boolean}
                    delay={i + 6}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
})
