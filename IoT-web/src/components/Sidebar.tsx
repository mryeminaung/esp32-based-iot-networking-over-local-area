import { memo } from "react"
import { useAuthStore } from "@/store/use-auth-store"
import { getNavItems } from "@/config/navigation"
import { NavLink, useLocation } from "react-router"

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export default memo(function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  const navItems = getNavItems(user?.role)

  return (
		<aside
			className={`fixed left-0 top-0 h-full bg-bg-card border-r border-border z-40 flex flex-col transition-[width] duration-300 ${
				collapsed ? "w-[72px]" : "w-56"
			}`}>
			{/* Brand */}
			<div className="flex items-center gap-2.5 px-4 h-16 border-b border-border shrink-0">
				<img
					src="/logo.png"
					alt="Logo"
					className="w-10 h-10 rounded-full shrink-0 border border-border bg-bg-card"
				/>
				{!collapsed && (
					<div className="min-w-0 leading-tight">
						<h1 className="text-[10px] font-bold text-text-primary truncate">
							ESP32-Based Smart Agriculture
						</h1>
						<span className="text-[0.65rem] text-text-muted">IoT System</span>
					</div>
				)}
			</div>

			{/* Navigation */}
			<nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
				{navItems.map((item) => {
					const isActive =
						item.path === "/"
							? location.pathname === "/"
							: location.pathname.startsWith(item.path);

					return (
						<NavLink
							key={item.path}
							to={item.path}
							className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
								isActive
									? "bg-green-light text-green-hover font-semibold border-l-3 border-green-hover"
									: "text-text-secondary hover:bg-bg-muted hover:text-text-primary"
							}`}
							title={collapsed ? item.label : undefined}>
							<item.icon className="w-5 h-5 shrink-0" />
							{!collapsed && <span>{item.label}</span>}
						</NavLink>
					);
				})}
			</nav>
		</aside>
	);
})
