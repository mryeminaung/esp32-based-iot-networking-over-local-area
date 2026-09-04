import { backendClient } from "./auth";

export type DeviceSettings = {
  id: number;
  soilDryThreshold: number;
  soilOptimalThreshold: number;
  waterLowThreshold: number;
  waterCriticalThreshold: number;
  waterWarningEnabled: boolean;
  fanEnabled: boolean;
  fanSpeed: number;
  buzzerEnabled: boolean;
  buzzerLowWater: boolean;
  buzzerDrySoil: boolean;
  buzzerSensorError: boolean;
  createdAt: string;
  updatedAt: string;
};

type DeviceSettingsResponse = {
  success: boolean;
  data: { settings: DeviceSettings };
};

export async function getDeviceSettings(): Promise<DeviceSettings> {
  const { data } = await backendClient.get<DeviceSettingsResponse>(
    "/device-settings",
  );
  return data.data.settings;
}

export async function updateDeviceSettings(
  settings: Partial<Omit<DeviceSettings, "id" | "createdAt" | "updatedAt">>,
): Promise<DeviceSettings> {
  const { data } = await backendClient.put<DeviceSettingsResponse>(
    "/device-settings",
    settings,
  );
  return data.data.settings;
}
