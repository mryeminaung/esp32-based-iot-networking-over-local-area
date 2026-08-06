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
