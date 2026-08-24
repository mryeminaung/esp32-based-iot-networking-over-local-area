import { Outlet, useLocation } from "react-router"
import { motion } from "framer-motion"
import { useHeader } from "@/hooks/useHeader"
import PageHeader from "@/components/PageHeader"
import SettingsSidebar from "./components/SettingsSidebar"

const fadeIn = {
	hidden: { opacity: 0, y: 12 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.35, ease: "easeOut" },
	},
}

export default function SettingsLayout() {
 useHeader("Settings")
 const location = useLocation()

 return (
 <div className="max-w-[1100px] mx-auto space-y-5">
 <PageHeader
 title="Settings"
 description="Manage your account settings"
 />
 <div className="flex gap-5">
 <SettingsSidebar />
 <div className="flex-1 min-w-0">
 <motion.div
	key={location.pathname}
	variants={fadeIn}
	initial="hidden"
	animate="visible"
 >
 <Outlet />
 </motion.div>
 </div>
 </div>
 </div>
 )
}
