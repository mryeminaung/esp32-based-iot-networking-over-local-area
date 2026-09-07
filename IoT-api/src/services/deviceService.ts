import { AppError } from "../utils/appError.js";
const ESP32_API_URL = process.env.ESP32_API_URL || "http://192.168.4.1";

/**
 * Fetch current device state and sensor data from ESP32
 */
export async function getDeviceState() {
  try {
    const res = await fetch(`${ESP32_API_URL}/all`);
    if (!res.ok) throw new Error(`ESP32 responded ${res.status}`);
    return await res.json();
  } catch (error) {
    throw new AppError(502, `ESP32 unreachable: ${(error as Error).message}`);
  }
}

/**
 * Send a control command to ESP32
 */
export async function sendDeviceCommand(device: string, state: number, value = 0) {
  try {
    const res = await fetch(`${ESP32_API_URL}/control`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device, state, value }),
    });
    if (!res.ok) throw new Error(`ESP32 responded ${res.status}`);
    return await res.json();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(502, `ESP32 unreachable: ${(error as Error).message}`);
  }
}

/**
 * Push threshold config to ESP32
 */
export async function sendConfigToESP32(config: {
  soilDryThreshold: number;
  soilOptimalThreshold: number;
  waterLowThreshold: number;
  waterCriticalThreshold: number;
  buzzerEnabled: boolean;
  buzzerLowWater: boolean;
  buzzerDrySoil: boolean;
}) {
  try {
    const res = await fetch(`${ESP32_API_URL}/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error(`ESP32 responded ${res.status}`);
    return await res.json();
  } catch (error) {
    // Non-fatal — ESP32 may be offline; settings are still saved in DB
    console.error("[DeviceService] Failed to push config to ESP32:", (error as Error).message);
    return null;
  }
}
