import type { DeviceSettings as ApiDeviceSettings } from "@/api/deviceSettings";

export type SoilMoistureStatus = "Dry" | "Normal" | "Wet";

export type DeviceSettings = {
  soilMoisture: {
    dryThreshold: number;
    optimalThreshold: number;
  };
  waterLevel: {
    lowThreshold: number;
    criticalThreshold: number;
    warningEnabled: boolean;
  };
  fan: {
    enabled: boolean;
    speed: number;
  };
  buzzer: {
    enabled: boolean;
    lowWater: boolean;
    drySoil: boolean;
    sensorError: boolean;
  };
};

/** Convert flat API response to nested component state */
export function apiToSettings(api: ApiDeviceSettings): DeviceSettings {
  return {
    soilMoisture: {
      dryThreshold: api.soilDryThreshold,
      optimalThreshold: api.soilOptimalThreshold,
    },
    waterLevel: {
      lowThreshold: api.waterLowThreshold,
      criticalThreshold: api.waterCriticalThreshold,
      warningEnabled: api.waterWarningEnabled,
    },
    fan: {
      enabled: api.fanEnabled,
      speed: api.fanSpeed,
    },
    buzzer: {
      enabled: api.buzzerEnabled,
      lowWater: api.buzzerLowWater,
      drySoil: api.buzzerDrySoil,
      sensorError: api.buzzerSensorError,
    },
  };
}

/** Convert nested component state to flat API payload */
export function settingsToApi(settings: DeviceSettings): Partial<ApiDeviceSettings> {
  return {
    soilDryThreshold: settings.soilMoisture.dryThreshold,
    soilOptimalThreshold: settings.soilMoisture.optimalThreshold,
    waterLowThreshold: settings.waterLevel.lowThreshold,
    waterCriticalThreshold: settings.waterLevel.criticalThreshold,
    waterWarningEnabled: settings.waterLevel.warningEnabled,
    fanEnabled: settings.fan.enabled,
    fanSpeed: settings.fan.speed,
    buzzerEnabled: settings.buzzer.enabled,
    buzzerLowWater: settings.buzzer.lowWater,
    buzzerDrySoil: settings.buzzer.drySoil,
    buzzerSensorError: settings.buzzer.sensorError,
  };
}

export function getSoilMoistureStatus(
  moisture: number,
  dry: number,
  optimal: number,
): SoilMoistureStatus {
  if (moisture < dry) return "Dry";
  if (moisture >= optimal) return "Wet";
  return "Normal";
}
