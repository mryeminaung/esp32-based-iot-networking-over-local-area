import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export default function HeroSection() {
	const navigate = useNavigate();

	return (
		<section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-[#0a1f12] via-[#0d2818] to-[#091a10]" />

			{/* Animated green orbs */}
			<motion.div
				className="absolute top-20 left-[15%] w-72 h-72 bg-green-500/10 rounded-full blur-3xl"
				animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
				transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute bottom-32 right-[10%] w-96 h-96 bg-blue-500/8 rounded-full blur-3xl"
				animate={{ y: [0, 25, 0], scale: [1, 1.05, 1] }}
				transition={{
					duration: 10,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 2,
				}}
			/>
			<motion.div
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/5 rounded-full blur-3xl"
				animate={{ scale: [1, 1.15, 1] }}
				transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
			/>

			{/* Grid pattern overlay */}
			<div
				className="absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Content */}
			<div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-30">
				{/* Badge */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
					<span className="text-sm font-medium text-green-300">
						Powered by ESP32
					</span>
				</motion.div>

				{/* Heading */}
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.15 }}
					className="text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
					<span>ESP32 Based Smart Agriculture </span>
					<span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
						IoT Monitoring System
					</span>
				</motion.h1>

				{/* Subtitle */}
				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.3 }}
					className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
					Monitor soil moisture, temperature, humidity, light, and air quality
					in real-time. Automate irrigation and lighting with intelligent
					threshold-based controls.
				</motion.p>

				{/* CTA Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.45 }}
					className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
					<button
						onClick={() => navigate("/login")}
						className="group flex items-center gap-2.5 px-8 py-3.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-green-600/25 hover:shadow-green-500/40 cursor-pointer">
						Get Started
						<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
					</button>
				</motion.div>
			</div>
		</section>
	);
}
