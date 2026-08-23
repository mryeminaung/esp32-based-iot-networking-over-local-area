import {
  LayoutDashboard,
  Activity,
  Users,
  Server,
  Thermometer,
  Power,
  BarChart3,
  type LucideIcon,
} from "lucide-react"
import { ROLES, type Role } from "./roles"

export type NavItem = {
  path: string
  label: string
  icon: LucideIcon
  roles: Role[]
}

export const navigation: NavItem[] = [
  {
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: [ROLES.FARM_MANAGER, ROLES.FARM_WORKER, ROLES.TECHNICIAN],
  },
  {
    path: "/sensors",
    label: "Sensors",
    icon: Thermometer,
    roles: [ROLES.FARM_MANAGER, ROLES.FARM_WORKER, ROLES.TECHNICIAN],
  },
  {
    path: "/actuators",
    label: "Actuators",
    icon: Power,
    roles: [ROLES.FARM_MANAGER, ROLES.FARM_WORKER, ROLES.TECHNICIAN],
  },
  // {
  //   path: "/analytics",
  //   label: "Analytics",
  //   icon: BarChart3,
  //   roles: [ROLES.FARM_MANAGER, ROLES.FARM_WORKER, ROLES.TECHNICIAN],
  // },
  {
    path: "/users",
    label: "Users",
    icon: Users,
    roles: [ROLES.FARM_MANAGER],
  },
  {
    path: "/devices",
    label: "Device Info",
    icon: Server,
    roles: [ROLES.FARM_MANAGER, ROLES.TECHNICIAN],
  },
  {
    path: "/activity",
    label: "Activity Logs",
    icon: Activity,
    roles: [ROLES.FARM_MANAGER],
  },
]

// Filter navigation items by role
export function getNavItems(role: string | undefined): NavItem[] {
  if (!role) return []
  return navigation.filter((item) => item.roles.includes(role as Role))
}
