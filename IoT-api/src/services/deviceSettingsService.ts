import { prisma } from "../config/db.js";
import { sendConfigToESP32 } from "./deviceService.js";

export async function getSettings() {
  const settings = await prisma.deviceSettings.findFirst();
  if (settings) return settings;

  // Create with defaults on first access
  return prisma.deviceSettings.create({ data: {} });
}

export async function updateSettings(data: Record<string, unknown>) {
  const existing = await prisma.deviceSettings.findFirst();

  let settings;
  if (existing) {
    settings = await prisma.deviceSettings.update({
      where: { id: existing.id },
      data,
    });
  } else {
    settings = await prisma.deviceSettings.create({ data });
  }

  // Push updated thresholds to ESP32 (non-blocking, best-effort)
  sendConfigToESP32({
    soilDryThreshold: settings.soilDryThreshold,
    soilOptimalThreshold: settings.soilOptimalThreshold,
    waterLowThreshold: settings.waterLowThreshold,
    waterCriticalThreshold: settings.waterCriticalThreshold,
    buzzerEnabled: settings.buzzerEnabled,
    buzzerLowWater: settings.buzzerLowWater,
    buzzerDrySoil: settings.buzzerDrySoil,
  }).catch(() => {
    /* already logged inside sendConfigToESP32 */
  });

  return settings;
}
