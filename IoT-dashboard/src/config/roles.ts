export const ROLES = {
  FARM_MANAGER: "farm_manager",
  FARM_WORKER: "farm_worker",
  TECHNICIAN: "technician",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// Check if a role can see a component
export function canSee(role: string | undefined, component: string): boolean {
  if (!role) return false
  // Extend with component visibility rules as needed
  return false
}
