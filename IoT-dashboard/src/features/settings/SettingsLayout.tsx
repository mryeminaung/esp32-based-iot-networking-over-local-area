import { Outlet } from "react-router"
import { useHeader } from "@/hooks/useHeader"
import PageHeader from "@/components/PageHeader"
import SettingsSidebar from "./components/SettingsSidebar"

export default function SettingsLayout() {
 useHeader("Settings")

 return (
 <div className="max-w-[1100px] mx-auto space-y-5">
 <PageHeader
 title="Settings"
 description="Manage your account settings"
 />
 <div className="flex gap-5">
 <SettingsSidebar />
 <div className="flex-1 min-w-0">
 <Outlet />
 </div>
 </div>
 </div>
 )
}
