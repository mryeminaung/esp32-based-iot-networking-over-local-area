import { useAuthStore } from "@/store/use-auth-store";
import { Mail, Palette, QrCode, Shield, User } from "lucide-react";
import { NavLink } from "react-router";

const tabs = [
	{ path: "/settings/profile", label: "Profile", icon: User },
	{ path: "/settings/security", label: "Security", icon: Shield },
	{ path: "/settings/theme", label: "Theme", icon: Palette },
	{ path: "/settings/account", label: "Account", icon: Mail },
];

const managerTabs = [
	{ path: "/settings/qr-code", label: "QR Code", icon: QrCode },
];

export default function SettingsSidebar() {
	const user = useAuthStore((s) => s.user);
	const visibleTabs =
		user?.role === "farm_manager" ? [...tabs, ...managerTabs] : tabs;

	return (
		<nav className="w-56 shrink-0 space-y-1">
			{visibleTabs.map((tab) => (
				<NavLink
					key={tab.path}
					to={tab.path}
					className={({ isActive }) =>
						`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer ${
							isActive
								? "bg-green-light text-green-hover font-semibold border-l-4 border-green-hover"
								: "text-text-secondary hover:bg-bg-muted hover:text-text-primary"
						}`
					}>
					<tab.icon className="w-[18px] h-[18px] shrink-0" />
					<span>{tab.label}</span>
				</NavLink>
			))}
		</nav>
	);
}
