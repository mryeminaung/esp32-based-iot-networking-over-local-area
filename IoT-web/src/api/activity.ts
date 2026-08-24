import { backendClient } from "./auth"

export type ActivityLog = {
  id: number
  userId: number
  device: string
  action: string
  value: number | null
  createdAt: string
  user: {
    id: number
    name: string | null
    email: string
    role: string
  }
}

export type ActivityFilters = {
  userId?: number
  action?: string
  device?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

type ActivityResponse = {
  success: boolean
  data: {
    logs: ActivityLog[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export async function getActivityLogs(
  filters: ActivityFilters = {}
): Promise<{ logs: ActivityLog[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const params = new URLSearchParams()
  if (filters.userId) params.append("userId", String(filters.userId))
  if (filters.action) params.append("action", filters.action)
  if (filters.device) params.append("device", filters.device)
  if (filters.startDate) params.append("startDate", filters.startDate)
  if (filters.endDate) params.append("endDate", filters.endDate)
  if (filters.page) params.append("page", String(filters.page))
  if (filters.limit) params.append("limit", String(filters.limit))

  const { data } = await backendClient.get<ActivityResponse>(`/activity?${params.toString()}`)
  return data.data
}

export async function createActivityLog(payload: {
  device: string
  action: string
  value?: number
}): Promise<void> {
  await backendClient.post("/activity", payload)
}
