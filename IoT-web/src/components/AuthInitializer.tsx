import { useEffect } from "react"
import { useAuthStore } from "@/store/use-auth-store"
import { useDashboardStore } from "@/store/use-dashboard-store"
import { getDeviceSettings } from "@/api/deviceSettings"
import { apiToSettings } from "@/features/device-settings/types"
import { Loader2 } from "lucide-react"

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode
}) {
  const { initialized, initialize, user } = useAuthStore()
  const setDeviceSettings = useDashboardStore((s) => s.setDeviceSettings)

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  // Fetch device settings after auth is ready (only if logged in)
  useEffect(() => {
    if (!initialized || !user) return
    getDeviceSettings()
      .then((api) => {
        const s = apiToSettings(api)
        setDeviceSettings({
          soilDryThreshold: s.soilMoisture.dryThreshold,
          soilOptimalThreshold: s.soilMoisture.optimalThreshold,
          waterLowThreshold: s.waterLevel.lowThreshold,
          waterCriticalThreshold: s.waterLevel.criticalThreshold,
          waterWarningEnabled: s.waterLevel.warningEnabled,
          buzzerEnabled: s.buzzer.enabled,
          buzzerLowWater: s.buzzer.lowWater,
          buzzerDrySoil: s.buzzer.drySoil,
          buzzerSensorError: s.buzzer.sensorError,
          fanEnabled: s.fan.enabled,
          fanSpeed: s.fan.speed,
        })
      })
      .catch(() => {
        /* keep defaults in store */
      })
  }, [initialized, user, setDeviceSettings])

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return <>{children}</>
}
