import { User, Shield, Palette, Mail } from "lucide-react"
import { NavLink } from "react-router"

const tabs = [
  { path: "/settings/profile", label: "Profile", icon: User },
  { path: "/settings/security", label: "Security", icon: Shield },
  { path: "/settings/theme", label: "Theme", icon: Palette },
  { path: "/settings/account", label: "Account", icon: Mail },
]

export default function SettingsSidebar() {
  return (
    <nav className="w-56 shrink-0 space-y-1">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-semibold border-l-3 border-green-600 dark:border-green-400 shadow-sm -translate-x-0.5"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            }`
          }
        >
          <tab.icon className="w-5 h-5 shrink-0" />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
