import type { AllData } from "@/api/esp32"

export type DeviceStatus = {
  device: string
  ip: string
  mac: string
  uptime: string
  freeHeap: number
  status: "Online" | "Offline"
  mode: "AP Mode" | "STA Mode"
  wifi: string
}

export type SensorHealth = {
  soilMoisture: number
  red_light: boolean
  yellow_light: boolean
  green_light: boolean
  white_light: boolean
  relay: boolean
  water_pump: boolean
}

export type ActuatorTestResult = {
  success: boolean
  device: string
  action: string
}

export type DiagnosticsData = DeviceStatus & SensorHealth

export const DEVICE_LABELS: Record<string, string> = {
  red_light: "Red LED",
  yellow_light: "Yellow LED",
  green_light: "Green LED",
  white_light: "White LED",
  relay: "Relay",
  water_pump: "Water Pump",
}

export const LED_DEVICES = ["red_light", "yellow_light", "green_light", "white_light"] as const
export const DIGITAL_DEVICES = ["relay", "water_pump"] as const
