import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import SplashScreen from "@/components/SplashScreen";
import { useTheme } from "@/hooks/useTheme";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";

const SPLASH_KEY = "splashDone";

export default function RootLayout() {
	useTheme();
	const location = useLocation();
	const [showSplash, setShowSplash] = useState(() => {
		return !sessionStorage.getItem(SPLASH_KEY);
	});

	// Scroll to top on route change
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [location.pathname]);

	// Clear splash flag on refresh so it shows again next time
	useEffect(() => {
		const handleBeforeUnload = () => {
			sessionStorage.removeItem(SPLASH_KEY);
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, []);

	return (
		<>
			{showSplash && (
				<SplashScreen
					onDone={() => {
						sessionStorage.setItem(SPLASH_KEY, "true");
						setShowSplash(false);
					}}
				/>
			)}
			<div className="min-h-screen flex flex-col">
				{!showSplash && (
					<>
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, ease: "easeOut" }}
							className="max-w-[1100px] mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-8">
							<Header />
						</motion.div>
						<div className="flex-1">
							<AnimatePresence mode="wait">
								<motion.div
									key={location.pathname}
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									// exit={{ opacity: 0 }}
									transition={{ duration: 0.5 }}>
									<Outlet />
								</motion.div>
							</AnimatePresence>
						</div>
					</>
				)}
			</div>
			<ScrollToTop />
		</>
	);
}
