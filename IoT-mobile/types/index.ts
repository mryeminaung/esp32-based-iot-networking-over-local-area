// Device key types matching ESP32 firmware
export type DeviceKey =
  | "red_light"
  | "yellow_light"
  | "green_light"
  | "white_light"
  | "relay"
  | "fan"
  | "water_pump";

// System info from ESP32 /system endpoint
export type SystemInfo = {
  device: string;
  ip: string;
  mac: string;
  uptime: string;
  freeHeap?: number;
  status: "Online" | "Offline";
  mode: "AP Mode" | "STA Mode";
  wifi: string;
};

// Sensor data from ESP32 /sensors endpoint
export type Sensors = {
  soilMoisture: number;
  red_light: boolean;
  yellow_light: boolean;
  green_light: boolean;
  white_light: boolean;
  fan: boolean;
  fanValue: number;
  relay: boolean;
  water_pump: boolean;
  // New sensors (UI-only for now)
  temperature: number;    // DHT22 °C
  humidity: number;       // DHT22 %
  lightIntensity: number; // BH1750 lux
  waterLevel: number;     // Water tank %
  airQuality: number;     // MQ-135 raw value (0-1024)
};

// Combined /all endpoint response
export type AllData = SystemInfo & Sensors;

// Control command response
export type ControlResult = {
  status: string;
};

// Device state record
export type DeviceStates = Record<DeviceKey, boolean | number>;

// Log entry for activity log
export type LogEntry = {
  id: number;
  time: string;
  message: string;
  type: "on" | "off" | "info" | "adjust";
};

// System info for store
export type SysInfo = {
  device: string;
  status: "Online" | "Offline";
  mode: "AP Mode" | "STA Mode";
  wifi: string;
  ip: string;
  mac: string;
  uptime: string;
};

// Theme type
export type Theme = "light" | "dark";

// Moisture condition
export type MoistureCondition = "DRY" | "MOIST" | "OPTIMAL";

// Alert thresholds for moisture
export type MoistureThresholds = {
  dryBelow: number;      // Below this = DRY (default: 30)
  moistBelow: number;    // Below this = MOIST, above = OPTIMAL (default: 50)
};

// Get moisture condition from percentage using thresholds
export function getMoistureCondition(
  value: number,
  thresholds: MoistureThresholds = { dryBelow: 30, moistBelow: 50 }
): MoistureCondition {
  if (value <= thresholds.dryBelow) return "DRY";
  if (value < thresholds.moistBelow) return "MOIST";
  return "OPTIMAL";
}

// ── New sensor condition types ──

export type TemperatureStatus = "Cold" | "Normal" | "Hot";
export type LightStatus = "Low Light" | "Optimal" | "Bright";
export type WaterStatus = "Full" | "Medium" | "Low";
export type AirQualityStatus = "Good" | "Moderate" | "Poor";

export function getTemperatureStatus(temp: number): TemperatureStatus {
  if (temp < 18) return "Cold";
  if (temp <= 30) return "Normal";
  return "Hot";
}

export function getLightStatus(lux: number): LightStatus {
  if (lux < 200) return "Low Light";
  if (lux <= 800) return "Optimal";
  return "Bright";
}

export function getWaterStatus(level: number): WaterStatus {
  if (level >= 60) return "Full";
  if (level >= 25) return "Medium";
  return "Low";
}

export function getAirQualityStatus(aqi: number): AirQualityStatus {
  if (aqi < 300) return "Good";
  if (aqi < 600) return "Moderate";
  return "Poor";
}
