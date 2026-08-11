export interface User {
  id: number
  email: string
  name: string | null
  image: string | null
  role: string
  createdAt: string
}

export const ROLES = [
  { value: "farm_worker", label: "Farm Worker" },
  { value: "technician", label: "Technician" },
]

export const ALL_ROLES = [
  { value: "farm_manager", label: "Farm Manager" },
  { value: "farm_worker", label: "Farm Worker" },
  { value: "technician", label: "Technician" },
]

export const roleBadgeColors: Record<string, string> = {
  farm_manager: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  farm_worker: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  technician: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
}

export const roleLabels: Record<string, string> = {
  farm_manager: "Farm Manager",
  farm_worker: "Farm Worker",
  technician: "Technician",
}
