import { memo, useState, useRef, useEffect } from "react"
import { useDashboardStore } from "@/store/use-dashboard-store"
import { useAuthStore } from "@/store/use-auth-store"
import { useHeaderStore } from "@/store/use-header-store"
import { Moon, Sun, QrCode, PanelLeftClose, PanelLeft, ChevronDown, Settings, LogOut, Mail, Menu } from "lucide-react"
import { useNavigate, useLocation } from "react-router"
import DeviceQRCode from "@/features/dashboard/components/DeviceQRCode"
import UserAvatar from "@/features/users/components/UserAvatar"

const roleLabels: Record<string, string> = {
  farm_manager: "Farm Manager",
  farm_worker: "Farm Worker",
  technician: "Technician",
}

type TopBarProps = {
  collapsed: boolean
  onToggle: () => void
  onMobileToggle: () => void
}

export default memo(function TopBar({ collapsed, onToggle, onMobileToggle }: TopBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const connected = useDashboardStore((s) => s.connected)
  const connecting = useDashboardStore((s) => s.connecting)
  const theme = useDashboardStore((s) => s.theme)
  const toggleTheme = useDashboardStore((s) => s.toggleTheme)
  const pageTitle = useHeaderStore((s) => s.title)
  const [showQR, setShowQR] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown on route change
  useEffect(() => {
    setShowMenu(false)
  }, [location.pathname])

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showMenu])

  return (
    <>
      <header className="h-14 sm:h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 flex items-center justify-between px-3 sm:px-6 shrink-0 sticky top-0 z-30">
        {/* Left: toggle + page title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={onMobileToggle}
            className="md:hidden w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
            title="Open menu"
          >
            <Menu size={18} />
          </button>
          {/* Desktop sidebar toggle */}
          <button
            onClick={onToggle}
            className="hidden md:flex w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate min-w-0">
            {pageTitle}
          </h2>
        </div>

        {/* Right: actions + user menu */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Connection status */}
          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              connected
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                connected ? "bg-green-500" : "bg-red-500 animate-pulse"
              }`}
            />
            {connecting ? "Connecting..." : connected ? "Online" : "Offline"}
          </div>
          {/* Mobile: dot only */}
          <div
            className={`sm:hidden w-2.5 h-2.5 rounded-full ${
              connected ? "bg-green-500" : "bg-red-500 animate-pulse"
            }`}
            title={connected ? "Online" : "Offline"}
          />

          {/* QR code */}
          <button
            onClick={() => setShowQR(true)}
            className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Show QR code"
          >
            <QrCode size={16} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Toggle dark mode"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <UserAvatar
                name={user?.name || null}
                email={user?.email || ""}
                imageUrl={user?.image}
                size="xs"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">
                  {user?.name || user?.email}
                </p>
                <p className="text-[0.65rem] text-gray-400 dark:text-gray-500 leading-tight">
                  {roleLabels[user?.role] || user?.role}
                </p>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {/* Dropdown */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg py-1 z-[60]">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || "No name"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>

                {/* Menu items */}
                <button
                  onClick={() => {
                    setShowMenu(false)
                    navigate("/settings/account")
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <Mail size={16} />
                  Account
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false)
                    navigate("/settings")
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                <button
                  onClick={() => {
                    setShowMenu(false)
                    logout()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* QR modal */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowQR(false)
          }}
        >
          <div className="relative">
            <button
              onClick={() => setShowQR(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm hover:opacity-80 transition-all cursor-pointer shadow-lg"
            >
              ✕
            </button>
            <DeviceQRCode />
          </div>
        </div>
      )}
    </>
  )
})
