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
  red_light: boolean
  yellow_light: boolean
  green_light: boolean
  white_light: boolean
  fan: boolean
  fanValue: number
  relay: boolean
  water_pump: boolean
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

export async function getSystemInfo(): Promise<SystemInfo> {
  const { data } = await apiClient.get<ApiResponse<AllData>>("/devices")
  return data.data
}

export async function getSensors(): Promise<Sensors> {
  const { data } = await apiClient.get<ApiResponse<AllData>>("/devices")
  return data.data
}

export async function getAll(): Promise<AllData> {
  const { data } = await apiClient.get<ApiResponse<AllData>>("/devices")
  return data.data
}

export async function controlDevice(
  device: string,
  state: number,
  value?: number,
): Promise<ControlResult> {
  const { data } = await apiClient.post<ApiResponse<ControlResult>>(
    "/devices/control",
    {
      device,
      state,
      value: value ?? 0,
    },
  )
  return data.data
}
