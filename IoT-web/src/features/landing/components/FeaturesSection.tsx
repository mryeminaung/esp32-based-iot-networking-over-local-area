import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
	Thermometer,
	Droplets,
	Sun,
	Wind,
	Waves,
	Sprout,
	type LucideIcon,
} from "lucide-react";

type Sensor = {
	icon: LucideIcon;
	title: string;
	color: string;
	iconBg: string;
	what: string;
	why: string;
	where: string;
	features: string[];
};

const SENSORS: Sensor[] = [
	{
		icon: Thermometer,
		title: "Temperature",
		color: "text-red-400",
		iconBg: "bg-red-500/15",
		what: "Measures ambient air temperature using a DHT22 digital sensor with ±0.5°C accuracy.",
		why: "Temperature directly affects crop growth rate, flowering, and fruit development. Monitoring prevents heat stress and frost damage.",
		where: "Mounted above the crop canopy inside the greenhouse or open field monitoring station.",
		features: [
			"DHT22 digital sensor",
			"Range: -40°C to 80°C",
			"Accuracy: ±0.5°C",
			"Readings every 60 seconds",
		],
	},
	{
		icon: Droplets,
		title: "Humidity",
		color: "text-blue-400",
		iconBg: "bg-blue-500/15",
		what: "Tracks relative humidity in the air using the DHT22 sensor paired with temperature measurement.",
		why: "High humidity promotes fungal diseases; low humidity causes wilting. Maintaining 40–70% RH is critical for most crops.",
		where: "Co-located with the temperature sensor, positioned at canopy level for accurate readings.",
		features: [
			"DHT22 combined sensor",
			"Range: 0–100% RH",
			"Accuracy: ±2% RH",
			"Real-time dashboard display",
		],
	},
	{
		icon: Sprout,
		title: "Soil Moisture",
		color: "text-green-400",
		iconBg: "bg-green-500/15",
		what: "Capacitive soil moisture sensor measures volumetric water content in the root zone without corroding.",
		why: "Over-watering wastes water and causes root rot; under-watering stunts growth. Precise monitoring enables data-driven irrigation.",
		where: "Buried 5–10 cm deep in the soil near the root zone of primary crops.",
		features: [
			"Capacitive (no corrosion)",
			"Analog output on GPIO 34",
			"DRY / MOIST / OPTIMAL zones",
			"Triggers auto-irrigation",
		],
	},
	{
		icon: Sun,
		title: "Light Intensity",
		color: "text-yellow-400",
		iconBg: "bg-yellow-500/15",
		what: "BH1750 digital lux sensor measures ambient light intensity in lux for photosynthesis optimization.",
		why: "Insufficient light reduces yield; excessive light can scorch leaves. Light data drives grow-light and shading automation.",
		where: "Mounted at the top of the monitoring station, facing upward with an unobstructed view.",
		features: [
			"BH1750 I²C digital sensor",
			"Range: 1 – 65535 lux",
			"High resolution: 1 lux",
			"Drives LED grow-light control",
		],
	},
	{
		icon: Wind,
		title: "Air Quality",
		color: "text-purple-400",
		iconBg: "bg-purple-500/15",
		what: "MQ-135 analog gas sensor detects NH₃, NOₓ, CO₂, benzene, and smoke for environmental safety.",
		why: "Poor air quality from pesticides, exhaust, or buildup of gases harms both crops and farm workers. Alerts enable timely ventilation.",
		where: "Placed inside enclosed greenhouse areas or near pesticide storage zones.",
		features: [
			"MQ-135 gas sensor",
			"Detects NH₃, NOₓ, CO₂, benzene",
			"Analog + digital output",
			"Triggers fan ventilation",
		],
	},
	{
		icon: Waves,
		title: "Water Level",
		color: "text-cyan-400",
		iconBg: "bg-cyan-500/15",
		what: "Ultrasonic distance sensor measures water level in tanks and reservoirs for supply management.",
		why: "Running dry mid-irrigation damages pumps and stresses crops. Continuous monitoring prevents water shortages.",
		where: "Mounted at the top of water tanks, facing downward toward the water surface.",
		features: [
			"Ultrasonic distance measurement",
			"Non-contact (no corrosion)",
			"Tank percentage display",
			"Low-level pump safety cutoff",
		],
	},
];

export default function FeaturesSection() {
	const [active, setActive] = useState(0);
	const sensor = SENSORS[active];
	const Icon = sensor.icon;

	return (
		<section className="py-24 px-6">
			<div className="max-w-5xl mx-auto">
				{/* Section header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16">
					<h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
						Six Sensors,{" "}
						<span className="text-green-600">One Dashboard</span>
					</h2>
					<p className="mt-4 text-text-muted max-w-xl mx-auto">
						Every critical environmental metric from your farm, collected every
						60 seconds and stored for historical analysis.
					</p>
				</motion.div>

				{/* Tab layout */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-60px" }}
					transition={{ duration: 0.6 }}
					className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
					{/* Left: sensor tabs */}
					<div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
						{SENSORS.map((s, i) => {
							const TabIcon = s.icon;
							const isActive = i === active;
							return (
								<button
									key={s.title}
									onClick={() => setActive(i)}
									className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium transition-all duration-200 shrink-0 cursor-pointer border ${
										isActive
											? "bg-bg-card border-border shadow-sm text-text-primary"
											: "bg-transparent border-transparent text-text-muted hover:text-text-secondary hover:bg-bg-muted"
									}`}>
									<div
										className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
											isActive ? s.iconBg : "bg-bg-muted"
										}`}>
										<TabIcon
											className={`w-[18px] h-[18px] ${isActive ? s.color : ""}`}
										/>
									</div>
									<span className="hidden md:block">{s.title}</span>
									<span className="md:hidden text-xs whitespace-nowrap">
										{s.title}
									</span>
								</button>
							);
						})}
					</div>

					{/* Right: detail panel */}
					<div className="bg-bg-card border border-border rounded-2xl p-6 sm:p-8 min-h-[380px]">
						<AnimatePresence mode="wait">
							<motion.div
								key={active}
								initial={{ opacity: 0, x: 12 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -12 }}
								transition={{ duration: 0.25 }}
								className="space-y-6">
								{/* Title */}
								<div className="flex items-center gap-3">
									<div
										className={`w-11 h-11 rounded-xl flex items-center justify-center ${sensor.iconBg}`}>
										<Icon className={`w-5 h-5 ${sensor.color}`} />
									</div>
									<h3 className="text-xl font-bold text-text-primary">
										{sensor.title}
									</h3>
								</div>

								{/* What / Why / Where */}
								<div className="space-y-4">
									{[
										{ label: "What", text: sensor.what },
										{ label: "Why", text: sensor.why },
										{ label: "Where", text: sensor.where },
									].map((item) => (
										<div key={item.label}>
											<h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
												{item.label}
											</h4>
											<p className="text-sm text-text-secondary leading-relaxed">
												{item.text}
											</p>
										</div>
									))}
								</div>

								{/* Features */}
								<div>
									<h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
										Features
									</h4>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
										{sensor.features.map((f) => (
											<div
												key={f}
												className="flex items-center gap-2 text-sm text-text-secondary">
												<div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
												{f}
											</div>
										))}
									</div>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
