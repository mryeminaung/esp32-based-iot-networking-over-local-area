import { Outlet, useLocation } from "react-router"
import { useEffect, useState } from "react"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"
import useEsp32Sync from "@/features/dashboard/hooks/useEsp32Sync"
import { useTheme } from "@/hooks/useTheme"

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Start ESP32 sync for all authenticated users
  useEsp32Sync()
  useTheme()

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Ctrl+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault()
        setCollapsed((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const closeMobile = () => setMobileOpen(false)
  const toggleMobile = () => setMobileOpen((prev) => !prev)

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Desktop sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobile}
          />
          {/* Drawer */}
          <div className="relative z-10 h-full">
            <Sidebar collapsed={false} onToggle={closeMobile} />
          </div>
        </div>
      )}

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "md:ml-[72px]" : "md:ml-56"
        }`}
      >
        <TopBar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onMobileToggle={toggleMobile}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
