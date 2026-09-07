import { recordReading } from "./sensorService.js";
import { createActivityLog } from "./activityService.js";
import { sendDeviceCommand, sendConfigToESP32 } from "./deviceService.js";
import { prisma } from "../config/db.js";

const ESP32_API_URL = process.env.ESP32_API_URL || "http://192.168.4.1";
const COLLECTION_INTERVAL = Number(process.env.COLLECTION_INTERVAL_MS) || 60000; // 1 min default

let intervalId: ReturnType<typeof setInterval> | null = null;
let lastFailLog = 0;

// ── Settings cache (avoids DB hit every cycle) ──
let cachedSettings: {
  soilDryThreshold: number;
  soilOptimalThreshold: number;
  waterCriticalThreshold: number;
  buzzerEnabled: boolean;
  buzzerLowWater: boolean;
  buzzerDrySoil: boolean;
} | null = null;
let settingsCacheTime = 0;
const SETTINGS_CACHE_TTL = 60000; // 1 min

async function getSettings() {
  const now = Date.now();
  if (cachedSettings && now - settingsCacheTime < SETTINGS_CACHE_TTL) {
    return cachedSettings;
  }
  try {
    const db = await prisma.deviceSettings.findFirst();
    if (db) {
      cachedSettings = {
        soilDryThreshold: db.soilDryThreshold,
        soilOptimalThreshold: db.soilOptimalThreshold,
        waterCriticalThreshold: db.waterCriticalThreshold,
        buzzerEnabled: db.buzzerEnabled,
        buzzerLowWater: db.buzzerLowWater,
        buzzerDrySoil: db.buzzerDrySoil,
      };
      settingsCacheTime = now;
    }
  } catch {
    // Use defaults if DB unavailable
    cachedSettings = {
      soilDryThreshold: 30,
      soilOptimalThreshold: 50,
      waterCriticalThreshold: 10,
      buzzerEnabled: true,
      buzzerLowWater: true,
      buzzerDrySoil: true,
    };
    settingsCacheTime = now;
  }
  return cachedSettings!;
}

/**
 * Evaluate sensor readings against thresholds and dispatch commands
 */
async function evaluateThresholds(reading: {
  soilMoisture: number | null;
  waterLevel: number | null;
}) {
  const s = await getSettings();
  if (!s.buzzerEnabled) return;

  // Buzzer: dry soil
  if (s.buzzerDrySoil && reading.soilMoisture !== null) {
    if (reading.soilMoisture < s.soilDryThreshold) {
      await sendDeviceCommand("buzzer", 1).catch(() => {});
    }
  }

  // Buzzer: critical water level
  if (s.buzzerLowWater && reading.waterLevel !== null) {
    if (reading.waterLevel < s.waterCriticalThreshold) {
      await sendDeviceCommand("buzzer", 1).catch(() => {});
    }
  }
}

/**
 * Fetch current sensor data from ESP32 and persist it
 */
async function collectReading() {
  try {
    const res = await fetch(`${ESP32_API_URL}/sensors`);
    if (!res.ok) throw new Error(`ESP32 responded ${res.status}`);

    const data = await res.json();

    const reading = {
      temperature: data.temperature ?? data.dht22?.temperature ?? null,
      humidity: data.humidity ?? data.dht22?.humidity ?? null,
      soilMoisture: data.soil_moisture ?? data.soilMoisture ?? null,
      light: data.light ?? null,
      airQuality: data.air_quality ?? data.airQuality ?? null,
      waterLevel: data.water_level ?? data.waterLevel ?? null,
    };

    await recordReading({ deviceId: 1, ...reading });

    // Evaluate thresholds and dispatch commands if needed
    await evaluateThresholds({
      soilMoisture: reading.soilMoisture,
      waterLevel: reading.waterLevel,
    });
  } catch (error) {
    const message = (error as Error).message;
    console.error("[Collector] Failed to collect reading:", message);
    if (!lastFailLog || Date.now() - lastFailLog > 300000) {
      lastFailLog = Date.now();
      await createActivityLog(null, "system", `ESP32 connection failed: ${message}`);
    }
  }
}

/**
 * Start the periodic sensor collection
 */
export function startCollector() {
  if (intervalId) return;
  console.log(`[Collector] Starting sensor collection every ${COLLECTION_INTERVAL}ms`);
  intervalId = setInterval(collectReading, COLLECTION_INTERVAL);
}

/**
 * Stop the collector
 */
export function stopCollector() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("[Collector] Stopped");
  }
}
