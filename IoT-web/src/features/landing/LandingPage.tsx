import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/use-auth-store";
import { useDashboardStore } from "@/store/use-dashboard-store";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";

const THEME_ICONS = {
	light: Sun,
	dark: Moon,
	system: Monitor,
} as const;

export default function LandingPage() {
	useTheme();
	const theme = useDashboardStore((s) => s.theme);
	const toggleTheme = useDashboardStore((s) => s.toggleTheme);
	const ThemeIcon = THEME_ICONS[theme];
	const user = useAuthStore((s) => s.user);
	const navigate = useNavigate();
	const [scrolled, setScrolled] = useState(false);

	// Track scroll for nav blur effect
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Redirect authenticated users to dashboard
	useEffect(() => {
		if (user) navigate("/dashboard", { replace: true });
	}, [user, navigate]);

	return (
		<div className="min-h-screen bg-bg-page">
			{/* Top nav bar */}
			<nav
				className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-5xl rounded-2xl border transition-all duration-300 ${
					scrolled
						? "backdrop-blur-sm border-gray-200 dark:border-border shadow-lg shadow-black/5"
						: "bg-white/5 dark:bg-white/5 border-gray-300/30 dark:border-white/10"
				}`}>
				<div className="px-6 h-14 flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<img
							src="/logo.png"
							alt="Logo"
							className="w-9 h-9 rounded-full border border-border bg-bg-card"
						/>
						<span
							className={`text-sm font-bold hidden sm:block ${scrolled ? "text-black dark:text-white" : "text-white dark:text-white"}`}>
							Smart Agriculture
						</span>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={toggleTheme}
							className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
							title={`Theme: ${theme}`}>
							<ThemeIcon className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400" />
						</button>
						<button
							onClick={() => navigate("/login")}
							className={`px-5 py-2 text-sm font-medium rounded-full border transition-all cursor-pointer ${
								scrolled
									? "text-gray-900 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border-gray-200 dark:border-white/10"
									: "text-gray-100 hover:text-white bg-white/5 hover:bg-white/10 border-white/10"
							}`}>
							Login
						</button>
						<button
							onClick={() => navigate("/login")}
							className="px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 rounded-full transition-colors cursor-pointer">
							Get Started
						</button>
					</div>
				</div>
			</nav>

			{/* Page content */}
			<div>
				<HeroSection />
				<FeaturesSection />
				<HowItWorks />
				<Footer />
			</div>
		</div>
	);
}
