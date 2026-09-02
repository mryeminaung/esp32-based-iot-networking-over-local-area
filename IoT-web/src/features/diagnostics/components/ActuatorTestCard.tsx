import { memo } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToastManager } from "@/components/ui/toast"
import { controlDevice } from "@/api/esp32"
import { createActivityLog } from "@/api/activity"
import {
  Droplets,
  Lightbulb,
  Power,
  Zap,
  Loader2,
} from "lucide-react"
import { DEVICE_LABELS, LED_DEVICES, DIGITAL_DEVICES } from "../types"
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

type ActuatorTestCardProps = {
  connected: boolean
}

type TestButtonProps = {
  device: string
  label: string
  icon: React.ElementType
  isOn: boolean
  delay: number
  connected: boolean
  onToggle: (device: string, state: boolean) => Promise<void>
}

function TestButton({
  device,
  label,
  icon: Icon,
  isOn,
  delay,
  connected,
  onToggle,
}: TestButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!connected || loading) return
    setLoading(true)
    try {
      await onToggle(device, !isOn)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      variants={fadeInUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Button
        variant={isOn ? "default" : "outline"}
        className={cn(
          "w-full justify-start gap-2 h-12",
          isOn && "bg-green text-white hover:bg-green/90"
        )}
        onClick={handleClick}
        disabled={!connected || loading}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
        <span className="flex-1 text-left">{label}</span>
        <span className={cn("text-xs", isOn ? "text-white/80" : "text-text-muted")}>
          {isOn ? "ON" : "OFF"}
        </span>
      </Button>
    </motion.div>
  )
}

export default memo(function ActuatorTestCard({
  connected,
}: ActuatorTestCardProps) {
  const toast = useToastManager()
  const devices = useDashboardStore((s) => s.devices)
  const toggleDevice = useDashboardStore((s) => s.toggleDevice)
  const setSlider = useDashboardStore((s) => s.setSlider)
  const addLog = useDashboardStore((s) => s.addLog)

  const handleDigitalToggle = async (device: string, state: boolean) => {
    const prev = devices[device as keyof typeof devices]

    // Optimistic update
    toggleDevice(device)

    try {
      await controlDevice(device, state ? 1 : 0)
      const now = new Date().toLocaleTimeString()
      const label = DEVICE_LABELS[device] || device
      addLog({
        time: now,
        message: `${label} ${state ? "turned on" : "turned off"} (test)`,
        type: state ? "on" : "off",
      })

      // Log to backend
      createActivityLog({
        device,
        action: state ? "TEST_ON" : "TEST_OFF",
      }).catch(() => {})

      toast.add({
        title: "Test Successful",
        description: `${label} ${state ? "turned on" : "turned off"}`,
        type: "success",
      })
    } catch {
      // Revert on failure
      useDashboardStore.setState((s) => ({
        devices: { ...s.devices, [device]: prev },
      }))
      toast.add({
        title: "Test Failed",
        description: `Failed to control ${DEVICE_LABELS[device] || device}`,
        type: "error",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="w-5 h-5 text-warning" />
          Actuator Testing
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <div className="flex items-center justify-center py-8 text-text-muted">
            Connect to ESP32 to test actuators
          </div>
        ) : (
          <div className="space-y-4">
            {/* LED Controls */}
            <div>
              <p className="text-xs font-medium text-text-muted mb-2 px-1">
                LEDs
              </p>
              <div className="grid grid-cols-2 gap-2">
                {LED_DEVICES.map((device, i) => (
                  <TestButton
                    key={device}
                    device={device}
                    label={DEVICE_LABELS[device]}
                    icon={Lightbulb}
                    isOn={devices[device as keyof typeof devices] as boolean}
                    delay={i}
                    connected={connected}
                    onToggle={handleDigitalToggle}
                  />
                ))}
              </div>
            </div>

            {/* Digital Controls */}
            <div>
              <p className="text-xs font-medium text-text-muted mb-2 px-1">
                Other Devices
              </p>
              <div className="grid grid-cols-2 gap-2">
                <TestButton
                  device="water_pump"
                  label={DEVICE_LABELS.water_pump}
                  icon={Droplets}
                  isOn={devices.water_pump}
                  delay={5}
                  connected={connected}
                  onToggle={handleDigitalToggle}
                />
                <TestButton
                  device="relay"
                  label={DEVICE_LABELS.relay}
                  icon={Power}
                  isOn={devices.relay}
                  delay={6}
                  connected={connected}
                  onToggle={handleDigitalToggle}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
})
