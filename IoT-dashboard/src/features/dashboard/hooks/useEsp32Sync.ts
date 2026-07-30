import { useEffect } from "react"
import { getAll, controlDevice } from "@/api/esp32"
import { useDashboardStore, type DeviceKey } from "@/store/dashboard"

const sliderKeys = new Set<DeviceKey>(["fan"])

const deviceLabels: Record<DeviceKey, string> = {
  red_light: "Red Light",
  yellow_light: "Yellow Light",
  green_light: "Green Light",
  white_light: "Grow Light",
  relay: "Relay",
  fan: "Ventilation Fan",
  water_pump: "Irrigation Pump",
}

let previousConnected = false
let consecutiveFailures = 0
let previousMoisture = -1

export function sendCommand(key: DeviceKey, state: boolean | number, value?: number) {
  const store = useDashboardStore.getState()
  const prev = store.devices[key]

  // Optimistic update
  if (typeof state === "boolean") {
    store.toggleDevice(key)
  } else {
    store.setSlider(key, state)
  }

  controlDevice(key, state ? 1 : 0, value)
    .then(() => {
      const now = new Date().toLocaleTimeString()
      const label = deviceLabels[key]
      if (typeof state === "boolean") {
        const action = key === "water_pump"
          ? (state ? "started" : "stopped")
          : (state ? "turned on" : "turned off")
        store.addLog({
          time: now,
          message: `${label} ${action}`,
          type: state ? "on" : "off",
        })
      } else {
        store.addLog({
          time: now,
          message: `${label} set to ${state}%`,
          type: "adjust",
        })
      }
    })
    .catch(() => {
      // Revert on failure
      useDashboardStore.setState((s) => ({
        devices: { ...s.devices, [key]: prev },
      }))
      const now = new Date().toLocaleTimeString()
      store.addLog({
        time: now,
        message: `Failed to control ${deviceLabels[key]}`,
        type: "info",
      })
    })
}

export default function useEsp32Sync() {
  const syncFromESP32 = useDashboardStore((s) => s.syncFromESP32)
  const setDisconnected = useDashboardStore((s) => s.setDisconnected)
  const addLog = useDashboardStore((s) => s.addLog)

  useEffect(() => {
    let mounted = true
    consecutiveFailures = 0

    const poll = async () => {
      try {
        const data = await getAll()
        if (!mounted) return

        // Reset failure counter on success
        consecutiveFailures = 0

        // Map ESP32 sensor keys → frontend store
        const devices: Partial<Record<DeviceKey, boolean | number>> = {}
        for (const key of Object.keys(deviceLabels) as DeviceKey[]) {
          if (sliderKeys.has(key)) {
            const valKey = `${key}Value` as string
            devices[key] = typeof data[valKey as keyof typeof data] === "number"
              ? (data[valKey as keyof typeof data] as number)
              : 0
          } else {
            devices[key] = data[key as keyof typeof data] === true
          }
        }

        syncFromESP32(
          {
            device: data.device,
            ip: data.ip,
            mac: data.mac,
            uptime: data.uptime,
            status: data.status,
            mode: data.mode,
            wifi: data.wifi,
          },
          data.soilMoisture,
          devices,
        )

        // Log moisture changes
        if (previousMoisture !== -1 && data.soilMoisture !== previousMoisture) {
          const now = new Date().toLocaleTimeString()
          const condition =
            data.soilMoisture <= 30 ? "DRY" :
            data.soilMoisture < 50 ? "MOIST" : "OPTIMAL"
          addLog({
            time: now,
            message: `Soil moisture changed to ${data.soilMoisture}% — ${condition}`,
            type: "info",
          })
        }
        previousMoisture = data.soilMoisture

        if (!previousConnected) {
          const now = new Date().toLocaleTimeString()
          addLog({ time: now, message: "Connected to ESP32", type: "info" })
        }
        previousConnected = true
      } catch {
        if (!mounted) return

        // Only disconnect after 2 consecutive failures (tolerate brief blips)
        consecutiveFailures++
        if (consecutiveFailures >= 2) {
          setDisconnected()
          if (previousConnected) {
            const now = new Date().toLocaleTimeString()
            addLog({ time: now, message: "Connection to ESP32 lost", type: "info" })
          }
          previousConnected = false
        }
      }
    }

    poll()
    const interval = setInterval(poll, 3000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [syncFromESP32, setDisconnected, addLog])
}
