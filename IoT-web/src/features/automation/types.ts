export type AutomationRule = {
  id: number
  name: string
  enabled: boolean
  sensor: string
  condition: string
  threshold: number
  action: string
  duration: number | null
  cooldown: number
  lastTriggered: string | null
  createdAt: string
  updatedAt: string
}

export type CreateRuleInput = {
  name: string
  sensor: string
  condition: string
  threshold: number
  action: string
  duration?: number | null
  cooldown?: number
}

export type UpdateRuleInput = Partial<CreateRuleInput> & { enabled?: boolean }

export const SENSOR_OPTIONS = [
  { value: "soilMoisture", label: "Soil Moisture" },
  { value: "temperature", label: "Temperature" },
  { value: "humidity", label: "Humidity" },
  { value: "light", label: "Light" },
  { value: "airQuality", label: "Air Quality" },
  { value: "waterLevel", label: "Water Level" },
]

export const CONDITION_OPTIONS = [
  { value: "below", label: "Below" },
  { value: "above", label: "Above" },
  { value: "equals", label: "Equals" },
]

export const ACTION_OPTIONS = [
  { value: "pump_on", label: "Turn Pump On" },
  { value: "pump_off", label: "Turn Pump Off" },
  { value: "led_on", label: "Turn LED On" },
  { value: "led_off", label: "Turn LED Off" },
]

export const SENSOR_UNITS: Record<string, string> = {
  soilMoisture: "%",
  temperature: "°C",
  humidity: "%",
  light: "lux",
  airQuality: "AQI",
  waterLevel: "cm",
}

export const sensorLabels: Record<string, string> = {
  soilMoisture: "Soil Moisture",
  temperature: "Temperature",
  humidity: "Humidity",
  light: "Light",
  airQuality: "Air Quality",
  waterLevel: "Water Level",
}

export const conditionLabels: Record<string, string> = {
  below: "Below",
  above: "Above",
  equals: "Equals",
}

export const actionLabels: Record<string, string> = {
  pump_on: "Turn Pump On",
  pump_off: "Turn Pump Off",
  led_on: "Turn LED On",
  led_off: "Turn LED Off",
}
