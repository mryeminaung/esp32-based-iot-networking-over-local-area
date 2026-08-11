import { useAuthStore } from "@/store/auth"
import { getNavItems } from "@/config/navigation"
import { NavLink, useLocation } from "react-router"

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuthStore()
  const location = useLocation()
  const navItems = getNavItems(user?.role)

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 flex flex-col transition-[width] duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-10 h-10 rounded-full shrink-0 border border-gray-200 dark:border-gray-700 bg-white"
        />
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">
              Smart Agriculture
            </h1>
            <span className="text-[0.65rem] text-gray-400 dark:text-gray-500">
              IoT System
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path)

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-semibold border-l-3 border-green-600 dark:border-green-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
