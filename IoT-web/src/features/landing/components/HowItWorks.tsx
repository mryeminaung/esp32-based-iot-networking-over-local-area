import { motion } from "framer-motion";
import { Cpu, BarChart3, Zap } from "lucide-react";

const STEPS = [
	{
		icon: Cpu,
		step: "01",
		title: "Connect Sensors",
		description:
			"ESP32 reads DHT22, capacitive soil sensor, BH1750, MQ-135, and water level sensor every second.",
		iconBg: "bg-green-500/15",
		iconColor: "text-green-400",
		dotColor: "bg-green-500",
	},
	{
		icon: BarChart3,
		step: "02",
		title: "Monitor & Store",
		description:
			"API server collects readings every 60s, stores them in PostgreSQL, and serves real-time data to the dashboard.",
		iconBg: "bg-blue-500/15",
		iconColor: "text-blue-400",
		dotColor: "bg-blue-500",
	},
	{
		icon: Zap,
		step: "03",
		title: "Automate & Act",
		description:
			"Threshold-based automation rules trigger irrigation pumps, grow lights, and fans — with manual override support.",
		iconBg: "bg-amber-500/15",
		iconColor: "text-amber-400",
		dotColor: "bg-amber-500",
	},
];

export default function HowItWorks() {
	return (
		<section className="py-24 px-6 bg-bg-muted/40">
			<div className="max-w-5xl mx-auto">
				{/* Section header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16">
					<h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
						How It{" "}
						<span className="text-green-600">Works</span>
					</h2>
					<p className="mt-4 text-text-muted max-w-xl mx-auto">
						From sensor to screen in three simple steps — fully automated, fully
						observable.
					</p>
				</motion.div>

				{/* Steps */}
				<div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Connector line — base track + animated flow */}
					<div className="hidden md:block absolute top-[52px] left-[20%] right-[20%]">
						{/* Base track */}
						<div className="h-px bg-gradient-to-r from-green-500/20 via-blue-500/20 to-amber-500/20" />
						{/* Flowing gradient overlay */}
						<div
							className="absolute inset-0 h-px"
							style={{
								background:
									"linear-gradient(90deg, transparent 0%, #22c55e 30%, #3b82f6 50%, #f59e0b 70%, transparent 100%)",
								backgroundSize: "200% 100%",
								animation: "lineFlow 3s linear infinite",
							}}
						/>
						{/* Glowing dot */}
						<div
							className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full shadow-[0_0_8px_2px_rgba(34,197,94,0.6)]"
							style={{ animation: "dotFlow 3s linear infinite" }}
						/>
					</div>

					{STEPS.map((s, i) => (
						<motion.div
							key={s.step}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{ duration: 0.5, delay: i * 0.12 }}
							className="relative flex flex-col items-center text-center">
							{/* Icon circle with ring */}
							<div className="relative mb-6">
								<div className="w-24 h-24 rounded-2xl bg-bg-card border border-border flex items-center justify-center shadow-sm">
									<s.icon className={`w-9 h-9 ${s.iconColor}`} />
								</div>
								<div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-bg-card border border-border flex items-center justify-center shadow-sm">
									<span className="text-[10px] font-bold text-text-muted">
										{s.step}
									</span>
								</div>
							</div>

							<h3 className="text-lg font-semibold text-text-primary">
								{s.title}
							</h3>
							<p className="mt-2 text-sm text-text-muted leading-relaxed max-w-[260px]">
								{s.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
