import { Outlet } from "react-router"
import { useEffect, useState } from "react"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"
import useEsp32Sync from "@/features/dashboard/hooks/useEsp32Sync"
import { useTheme } from "@/hooks/useTheme"

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  // Start ESP32 sync for all authenticated users
  useEsp32Sync()
  useTheme()

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "ml-[72px]" : "ml-64"
        }`}
      >
        <TopBar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
