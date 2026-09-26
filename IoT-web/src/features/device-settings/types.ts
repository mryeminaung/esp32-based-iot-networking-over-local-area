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
  buzzer: {
    enabled: boolean;
    lowWater: boolean;
    drySoil: boolean;
    sensorError: boolean;
  };
  growLight: {
    lowThreshold: number;
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
    buzzer: {
      enabled: api.buzzerEnabled,
      lowWater: api.buzzerLowWater,
      drySoil: api.buzzerDrySoil,
      sensorError: api.buzzerSensorError,
    },
    growLight: {
      lowThreshold: api.lightLowThreshold,
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
    buzzerEnabled: settings.buzzer.enabled,
    buzzerLowWater: settings.buzzer.lowWater,
    buzzerDrySoil: settings.buzzer.drySoil,
    buzzerSensorError: settings.buzzer.sensorError,
    lightLowThreshold: settings.growLight.lowThreshold,
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
