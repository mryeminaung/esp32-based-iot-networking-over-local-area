import { memo, useState, useRef, useEffect } from "react"
import { useDashboardStore } from "@/store/use-dashboard-store"
import { useAuthStore } from "@/store/use-auth-store"
import { useHeaderStore } from "@/store/use-header-store"
import { Moon, Sun, PanelLeftClose, PanelLeft, ChevronDown, Settings, LogOut, Mail, Menu } from "lucide-react"
import { useNavigate, useLocation } from "react-router"
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
      <header className="h-14 sm:h-16 bg-bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-3 sm:px-6 shrink-0 sticky top-0 z-30">
        {/* Left: toggle + page title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={onMobileToggle}
            className="md:hidden w-10 h-10 rounded-lg border border-border flex items-center justify-center text-text-muted hover:bg-bg-muted transition-colors cursor-pointer shrink-0"
            title="Open menu"
          >
            <Menu size={18} />
          </button>
          {/* Desktop sidebar toggle */}
          <button
            onClick={onToggle}
            className="hidden md:flex w-10 h-10 rounded-lg border border-border items-center justify-center text-text-muted hover:bg-bg-muted transition-colors cursor-pointer shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-text-primary truncate min-w-0">
            {pageTitle}
          </h2>
        </div>

        {/* Right: actions + user menu */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Connection status */}
          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              connected
                ? "bg-green-light text-green"
                : "bg-red-100 text-red-600"
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

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-text-muted hover:bg-bg-muted transition-colors cursor-pointer"
            title="Toggle dark mode"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg border border-border hover:bg-bg-muted transition-colors cursor-pointer"
            >
              <UserAvatar
                name={user?.name || null}
                email={user?.email || ""}
                imageUrl={user?.image}
                size="xs"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-text-secondary leading-tight">
                  {user?.name || user?.email}
                </p>
                <p className="text-[0.65rem] text-text-muted leading-tight">
                  {roleLabels[user?.role] || user?.role}
                </p>
              </div>
              <ChevronDown size={14} className="text-text-muted" />
            </button>

            {/* Dropdown */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-bg-card border border-border rounded-xl shadow-lg py-1 z-[60]">
                {/* User info */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {user?.name || "No name"}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {user?.email}
                  </p>
                </div>

                {/* Menu items */}
                <button
                  onClick={() => {
                    setShowMenu(false)
                    navigate("/settings/account")
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-bg-muted transition-colors cursor-pointer"
                >
                  <Mail size={16} />
                  Account
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false)
                    navigate("/settings")
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-bg-muted transition-colors cursor-pointer"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <div className="border-t border-border my-1" />
                <button
                  onClick={() => {
                    setShowMenu(false)
                    logout()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
})
