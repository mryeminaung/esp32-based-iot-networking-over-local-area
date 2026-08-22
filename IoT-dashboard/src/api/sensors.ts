import { backendClient } from "./auth"

export type SensorReading = {
  id: number
  deviceId: number
  temperature: number | null
  humidity: number | null
  soilMoisture: number | null
  light: number | null
  airQuality: number | null
  waterLevel: number | null
  createdAt: string
}

export type SensorAnalytics = {
  date: string
  temperature: { avg: number | null; min: number | null; max: number | null }
  humidity: { avg: number | null; min: number | null; max: number | null }
  soilMoisture: { avg: number | null; min: number | null; max: number | null }
  light: { avg: number | null; min: number | null; max: number | null }
  airQuality: { avg: number | null; min: number | null; max: number | null }
  waterLevel: { avg: number | null; min: number | null; max: number | null }
}

export type SensorFilters = {
  device?: number
  from?: string
  to?: string
  page?: number
  limit?: number
}

type ReadingsResponse = {
  success: boolean
  data: {
    readings: SensorReading[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

type AnalyticsResponse = {
  success: boolean
  data: {
    analytics: SensorAnalytics[]
  }
}

type LatestResponse = {
  success: boolean
  data: {
    reading: SensorReading | null
  }
}

export async function getSensorReadings(
  filters: SensorFilters = {}
): Promise<{ readings: SensorReading[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const params = new URLSearchParams()
  if (filters.device) params.append("device", String(filters.device))
  if (filters.from) params.append("from", filters.from)
  if (filters.to) params.append("to", filters.to)
  if (filters.page) params.append("page", String(filters.page))
  if (filters.limit) params.append("limit", String(filters.limit))

  const { data } = await backendClient.get<ReadingsResponse>(`/sensors/readings?${params.toString()}`)
  return data.data
}

export async function getSensorAnalytics(
  from: string,
  to: string,
  device?: number
): Promise<SensorAnalytics[]> {
  const params = new URLSearchParams({ from, to })
  if (device) params.append("device", String(device))

  const { data } = await backendClient.get<AnalyticsResponse>(`/sensors/analytics?${params.toString()}`)
  return data.data.analytics
}

export async function getLatestSensorReading(
  device?: number
): Promise<SensorReading | null> {
  const params = new URLSearchParams()
  if (device) params.append("device", String(device))

  const { data } = await backendClient.get<LatestResponse>(`/sensors/latest?${params.toString()}`)
  return data.data.reading
}
