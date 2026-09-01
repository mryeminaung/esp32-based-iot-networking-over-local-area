import {
  LayoutDashboard,
  Activity,
  Users,
  Server,
  Thermometer,
  Power,
  BarChart3,
  Bot,
  Stethoscope,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { ROLES, type Role } from "./roles"

export type NavItem = {
  path: string
  label: string
  icon: LucideIcon
  roles: Role[]
}

export type NavSection = {
  title?: string // Optional section title (hidden when sidebar is collapsed)
  items: NavItem[]
}

export const navigation: NavSection[] = [
  {
    // Main section - no title
    items: [
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
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        path: "/analytics",
        label: "Analytics",
        icon: BarChart3,
        roles: [ROLES.FARM_MANAGER],
      },
      {
        path: "/activity",
        label: "Activity Logs",
        icon: Activity,
        roles: [ROLES.FARM_MANAGER, ROLES.FARM_WORKER],
      },
    ],
  },
  {
    title: "Management",
    items: [
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
        roles: [ROLES.TECHNICIAN],
      },
      {
        path: "/automation",
        label: "Automation",
        icon: Bot,
        roles: [ROLES.FARM_MANAGER],
      },
      {
        path: "/diagnostics",
        label: "Diagnostics",
        icon: Stethoscope,
        roles: [ROLES.TECHNICIAN],
      },
    ],
  },
  {
    // Settings - separated at bottom
    items: [
      {
        path: "/settings",
        label: "Settings",
        icon: Settings,
        roles: [ROLES.FARM_MANAGER, ROLES.FARM_WORKER, ROLES.TECHNICIAN],
      },
    ],
  },
]

// Filter navigation sections by role
export function getNavSections(role: string | undefined): NavSection[] {
  if (!role) return []

  return navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role as Role)),
    }))
    .filter((section) => section.items.length > 0)
}

// Legacy: flat list for backwards compatibility
export function getNavItems(role: string | undefined): NavItem[] {
  if (!role) return []
  return navigation.flatMap((section) =>
    section.items.filter((item) => item.roles.includes(role as Role))
  )
}
