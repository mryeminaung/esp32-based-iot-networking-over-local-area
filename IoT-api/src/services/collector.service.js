import { recordReading } from "./sensor.service.js";
import { evaluateRules } from "./automation.service.js";
import { createActivityLog } from "./activity.service.js";

const ESP32_API_URL = process.env.ESP32_API_URL || "http://192.168.4.1";
const COLLECTION_INTERVAL = Number(process.env.COLLECTION_INTERVAL_MS) || 60000; // 1 min default

let intervalId = null;

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

    // Evaluate automation rules against the latest reading
    await evaluateRules(reading);
  } catch (error) {
    console.error("[Collector] Failed to collect reading:", error.message);
    // Log ESP32 connection failure (throttle: only log once per 5 minutes)
    if (!collectReading._lastFailLog || Date.now() - collectReading._lastFailLog > 300000) {
      collectReading._lastFailLog = Date.now();
      await createActivityLog(null, "system", `ESP32 connection failed: ${error.message}`);
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
