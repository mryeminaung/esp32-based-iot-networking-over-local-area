import { useEffect, useState } from "react";
import { useHeader } from "@/hooks/useHeader";
import { useDashboardStore } from "@/store/use-dashboard-store";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Check } from "lucide-react";
import {
  getDeviceSettings,
  updateDeviceSettings,
} from "@/api/deviceSettings";
import SoilMoistureCard from "./components/SoilMoistureCard";
import WaterLevelCard from "./components/WaterLevelCard";
import FanConfigCard from "./components/FanConfigCard";
import BuzzerConfigCard from "./components/BuzzerConfigCard";
import {
  apiToSettings,
  settingsToApi,
  getSoilMoistureStatus,
} from "./types";
import type { DeviceSettings } from "./types";

const INITIAL_SETTINGS: DeviceSettings = {
  soilMoisture: { dryThreshold: 30, optimalThreshold: 50 },
  waterLevel: { lowThreshold: 25, criticalThreshold: 10, warningEnabled: true },
  fan: { enabled: true, speed: 65 },
  buzzer: { enabled: true, lowWater: true, drySoil: true, sensorError: false },
};

export default function DeviceSettingsPage() {
  useHeader("Device Settings");

  const moisture = useDashboardStore((s) => s.sensors.soilMoisture);

  const [settings, setSettings] = useState<DeviceSettings>(INITIAL_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDeviceSettings()
      .then((api) => setSettings(apiToSettings(api)))
      .catch(() => {
        /* keep INITIAL_SETTINGS as fallback */
      })
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof DeviceSettings>(
    section: K,
    field: keyof DeviceSettings[K],
    value: unknown,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const api = await updateDeviceSettings(settingsToApi(settings));
      setSettings(apiToSettings(api));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* toast or error handling could go here */
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      const api = await getDeviceSettings();
      setSettings(apiToSettings(api));
    } catch {
      /* keep current settings on failure */
    }
    setSaved(false);
  };

  const soilStatus = getSoilMoistureStatus(
    moisture,
    settings.soilMoisture.dryThreshold,
    settings.soilMoisture.optimalThreshold,
  );

  if (loading) {
    return <LoadingState message="Loading device settings..." />;
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      <PageHeader
        title="Device Settings"
        description="Configure sensor thresholds and device parameters for connected IoT devices."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SoilMoistureCard
          moisture={moisture}
          dryThreshold={settings.soilMoisture.dryThreshold}
          optimalThreshold={settings.soilMoisture.optimalThreshold}
          soilStatus={soilStatus}
          onThresholdChange={(field, value) =>
            update("soilMoisture", field, value)
          }
        />

        <WaterLevelCard
          lowThreshold={settings.waterLevel.lowThreshold}
          criticalThreshold={settings.waterLevel.criticalThreshold}
          warningEnabled={settings.waterLevel.warningEnabled}
          onThresholdChange={(field, value) =>
            update("waterLevel", field, value)
          }
          onWarningToggle={(val) => update("waterLevel", "warningEnabled", val)}
        />

        <FanConfigCard
          enabled={settings.fan.enabled}
          speed={settings.fan.speed}
          onEnabledChange={(val) => update("fan", "enabled", val)}
          onSpeedChange={(val) => update("fan", "speed", val)}
        />

        <BuzzerConfigCard
          enabled={settings.buzzer.enabled}
          lowWater={settings.buzzer.lowWater}
          drySoil={settings.buzzer.drySoil}
          sensorError={settings.buzzer.sensorError}
          onEnabledChange={(val) => update("buzzer", "enabled", val)}
          onConditionChange={(field, val) => update("buzzer", field, val)}
        />
      </div>

      {/* ── Bottom Actions ── */}
      <div className="flex items-center justify-end p-4 rounded-xl border border-border bg-card">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button className="gap-1.5" onClick={handleSave} disabled={saving}>
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
