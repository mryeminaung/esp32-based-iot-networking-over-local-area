import DeviceQRCode from "@/features/dashboard/components/DeviceQRCode";
import { useDashboardStore } from "@/store/dashboard";
import {
	FlaskConical,
	LayoutDashboard,
	Moon,
	QrCode,
	Sprout,
	Sun,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function Header() {
	const connected = useDashboardStore((s) => s.connected);
	const connecting = useDashboardStore((s) => s.connecting);
	const theme = useDashboardStore((s) => s.theme);
	const toggleTheme = useDashboardStore((s) => s.toggleTheme);
	const [showQR, setShowQR] = useState(false);

	return (
		<>
			<header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-bg-card p-5 sm:px-7 sm:py-5 rounded-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] gap-3 sm:gap-0">
				{/* Brand */}
				<Link
					to="/"
					className="flex items-center gap-3 sm:gap-[14px] w-full sm:w-auto hover:opacity-80 transition-opacity">
					<Sprout
						className="text-accent shrink-0 max-sm:w-7 max-sm:h-7"
						size={36}
					/>
					<div className="min-w-0">
						<h1 className="text-[1.2rem] sm:text-[1.5rem] font-bold truncate">
							Smart Agriculture
						</h1>
						<span className="block text-[0.75rem] sm:text-[0.8125rem] text-text-muted font-medium mt-[2px]">
							IoT Monitoring & Irrigation System
						</span>
					</div>
				</Link>

				{/* Actions — wraps on <400px screens */}
				<div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto flex-wrap">
					{/* Connection status */}
					<div
						className={`flex items-center gap-2 px-3.5 sm:px-[18px] py-2 sm:py-[10px] rounded-full text-sm ${
							connected
								? "bg-green-50 border border-green-200 dark:bg-green-900/15 dark:border-green-700/30"
								: "bg-red-50 border border-red-200 dark:bg-red-900/15 dark:border-red-700/30"
						}`}>
						<span
							className={`w-2.5 h-2.5 rounded-full shrink-0 ${
								connected
									? "bg-green-600"
									: "bg-red-500 animate-[pulse_2s_infinite]"
							}`}
						/>
						<span className="text-[0.8125rem] sm:text-[0.875rem] text-text-secondary font-medium whitespace-nowrap">
							{connecting
								? "Connecting…"
								: connected
									? "Connected"
									: "Disconnected"}
						</span>
					</div>

					{/* Dashboard link */}
					<Link
						to="/"
						className="w-[38px] h-[38px] sm:w-11 sm:h-11 rounded-xl border border-border bg-bg-muted flex items-center justify-center text-text-muted hover:bg-border transition-all shrink-0"
						title="Dashboard">
						<LayoutDashboard
							size={16}
							className="sm:size-5"
						/>
					</Link>

					{/* Experiments link */}
					<Link
						to="/experiments"
						className="w-[38px] h-[38px] sm:w-11 sm:h-11 rounded-xl border border-border bg-bg-muted flex items-center justify-center text-text-muted hover:bg-border transition-all shrink-0"
						title="Experiments">
						<FlaskConical
							size={16}
							className="sm:size-5"
						/>
					</Link>

					{/* QR code button */}
					<button
						onClick={() => setShowQR(true)}
						className="w-[38px] h-[38px] sm:w-11 sm:h-11 rounded-xl border border-border bg-bg-muted flex items-center justify-center cursor-pointer text-text-muted hover:bg-border transition-all shrink-0"
						title="Show QR code">
						<QrCode
							size={18}
							className="sm:size-5"
						/>
					</button>

					{/* Theme toggle */}
					<button
						onClick={toggleTheme}
						className="w-[38px] h-[38px] sm:w-11 sm:h-11 rounded-xl border border-border bg-bg-muted flex items-center justify-center cursor-pointer text-text-muted hover:bg-border transition-all shrink-0"
						title="Toggle dark mode">
						{theme === "light" ? (
							<Moon
								size={18}
								className="sm:size-5"
							/>
						) : (
							<Sun
								size={18}
								className="sm:size-5"
							/>
						)}
					</button>
				</div>
			</header>

			{/* QR code modal overlay */}
			{showQR && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
					onClick={(e) => {
						if (e.target === e.currentTarget) setShowQR(false);
					}}>
					<div className="relative">
						<button
							onClick={() => setShowQR(false)}
							className="absolute hidden -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-text-primary text-white flex items-center justify-center text-sm hover:opacity-80 transition-all cursor-pointer shadow-lg">
							✕
						</button>
						<DeviceQRCode />
					</div>
				</div>
			)}
		</>
	);
}
