import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/store/dashboard";

export default function ScrollToTop() {
	const [show, setShow] = useState(false);
	const theme = useDashboardStore((s) => s.theme);
	const isDark = theme === "dark";

	useEffect(() => {
		const handleScroll = () => {
			setShow(window.scrollY > 300);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<AnimatePresence>
			{show && (
				<motion.button
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.8 }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					onClick={scrollToTop}
					className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-colors border ${
						isDark
							? "bg-bg-card border-border hover:bg-bg-card-hover text-text-primary"
							: "bg-accent hover:bg-accent-hover text-white border-transparent"
					}`}
					aria-label="Scroll to top">
					<ArrowUp size={20} />
				</motion.button>
			)}
		</AnimatePresence>
	);
}
