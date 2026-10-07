import axios from "axios"
import apiClient from "./client"

export type SystemInfo = {
  device: string
  ip: string
  mac: string
  uptime: string
  freeHeap?: number
  status: "Online" | "Offline"
  mode: "AP Mode" | "STA Mode"
  wifi: string
}

export type Sensors = {
  soilMoisture: number
  temperature: number
  humidity: number
  waterLevel: number
  light: number
  airQuality: number
  red_light: boolean
  yellow_light: boolean
  green_light: boolean
  white_light: boolean
  relay: boolean
  water_pump: boolean
  buzzer: boolean
}

/** Combined /all endpoint response */
export type AllData = SystemInfo & Sensors

export type ControlResult = {
  status: string
}

type ApiResponse<T> = {
  success: boolean
  data: T
}

/**
 * Direct ESP32 base URLs tried in order (browser → ESP32 on the LAN).
 * Falls back to the API proxy if none respond.
 */
const esp32Candidates = [
  import.meta.env.VITE_ESP32_API_URL,
  "http://esp32-server.local",
  "http://esp32.local",
].filter(Boolean) as string[]

const esp32Timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 3000

function makeEsp32Client(base: string) {
  return axios.create({
    baseURL: base.replace(/\/$/, ""),
    timeout: esp32Timeout,
    headers: { "Content-Type": "application/json" },
  })
}

function isAllData(data: unknown): data is AllData {
  return (
    !!data &&
    typeof data === "object" &&
    "soilMoisture" in (data as Record<string, unknown>) &&
    "temperature" in (data as Record<string, unknown>)
  )
}

/** Try each direct ESP32 URL for GET /all */
async function fetchAllDirect(): Promise<AllData> {
  let lastError: unknown = new Error("No ESP32 URL configured")

  for (const base of esp32Candidates) {
    try {
      const { data } = await makeEsp32Client(base).get<AllData>("/all")
      if (isAllData(data)) return data
      lastError = new Error(`Unexpected /all response from ${base}`)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError
}

/** Proxy through IoT-api → ESP32 (slower path, used if direct fails) */
async function fetchAllViaApi(): Promise<AllData> {
  const { data } = await apiClient.get<ApiResponse<AllData>>("/devices")
  if (!data?.data) throw new Error("Empty devices response from API")
  return data.data
}

export async function getSystemInfo(): Promise<SystemInfo> {
  return getAll()
}

export async function getSensors(): Promise<Sensors> {
  return getAll()
}

/**
 * Live dashboard poll: prefer direct ESP32, fall back to API /devices.
 * Direct path works even when the API server cannot reach the ESP32
 * (e.g. API in WSL, ESP32 on the Windows LAN).
 */
export async function getAll(): Promise<AllData> {
  if (esp32Candidates.length > 0) {
    try {
      return await fetchAllDirect()
    } catch {
      // fall through to API proxy
    }
  }
  return fetchAllViaApi()
}

/** Control a device: direct ESP32 /control first, then API proxy */
export async function controlDevice(
  device: string,
  state: number,
  value?: number,
): Promise<ControlResult> {
  const body = { device, state, value: value ?? 0 }
  let lastError: unknown = new Error("No ESP32 URL configured")

  for (const base of esp32Candidates) {
    try {
      const { data } = await makeEsp32Client(base).post<{ status?: string }>(
        "/control",
        body,
      )
      return { status: data?.status ?? "ok" }
    } catch (error) {
      lastError = error
    }
  }

  try {
    const { data } = await apiClient.post<ApiResponse<ControlResult>>(
      "/devices/control",
      body,
    )
    return data.data ?? { status: "ok" }
  } catch {
    throw lastError
  }
}
