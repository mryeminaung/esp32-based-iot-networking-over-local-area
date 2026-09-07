import {
  LayoutDashboard,
  Activity,
  Users,
  Thermometer,
  Power,
  BarChart3,
  Stethoscope,
  Settings,
  SlidersHorizontal,
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
		title: "Overview",
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
		title: "Management",
		items: [
			{
				path: "/users",
				label: "Users",
				icon: Users,
				roles: [ROLES.FARM_MANAGER],
			},
			{
				path: "/device-settings",
				label: "Device Settings",
				icon: SlidersHorizontal,
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
];

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
