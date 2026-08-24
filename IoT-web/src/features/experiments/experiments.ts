import type { LucideIcon } from "lucide-react"
import { Globe, Lightbulb, Sprout, Wifi, Zap } from "lucide-react"

export type Status = "completed" | "in-progress" | "planned"

export type ExperimentDetail = {
	objective: string
	hardware: string[]
	technologies: string[]
	circuitImage?: boolean
	steps: string[]
	endpoints?: { method: string; path: string }[]
	result: string
	resources: { label: string; url?: string }[]
}

export type Experiment = {
	id: string
	title: string
	description: string
	icon: LucideIcon
	iconColor: string
	iconBg: string
	tags: string[]
	status: Status
	featured?: boolean
	detail: ExperimentDetail
}

export const statusConfig: Record<Status, { label: string; dot: string; badge: string }> = {
	completed: {
		label: "Completed",
		dot: "bg-success",
		badge: "bg-success/10 text-success border-success/20",
	},
	"in-progress": {
		label: "In Progress",
		dot: "bg-warning",
		badge: "bg-warning/10 text-warning border-warning/20",
	},
	planned: {
		label: "Planned",
		dot: "bg-border-strong",
		badge: "bg-bg-muted text-text-muted border-border",
	},
}

export const experiments: Experiment[] = [
	{
		id: "wifi-ap",
		title: "ESP32 WiFi Access Point",
		description: "Configure ESP32 as a local WiFi network",
		icon: Wifi,
		iconColor: "text-blue-600",
		iconBg: "bg-green-light",
		tags: ["ESP32 WiFi", "Access Point"],
		status: "completed",
		detail: {
			objective:
				"Configure the ESP32 in Access Point (AP) mode so devices can connect directly without an external router — the foundation for all local IoT communication.",
			hardware: ["ESP32 DevKit V1", "Micro-USB Cable", "Computer with WiFi"],
			technologies: ["ESP32", "WiFi", "AP Mode", "Arduino Framework"],
			steps: [
				"Set ESP32 to WiFi.AP mode in the Arduino sketch",
				"Assign SSID, password, and static IP (192.168.4.1)",
				"Upload firmware and open Serial Monitor for diagnostics",
				"Scan for the ESP32 network from a phone or laptop",
				"Verify connection and assign IP via DHCP",
			],
			result:
				"ESP32 successfully broadcasts its own WiFi network. Clients can connect and communicate directly without a router.",
			resources: [
				{ label: "Source Code" },
				{ label: "Tutorial Video" },
				{ label: "Lab Report" },
			],
		},
	},
	{
		id: "led-web",
		title: "LED Control using Web Server",
		description: "Control GPIO through HTTP requests",
		icon: Lightbulb,
		iconColor: "text-amber-600",
		iconBg: "bg-warning/10",
		tags: ["HTTP", "GPIO", "Web Server"],
		status: "completed",
		detail: {
			objective:
				"Host a web server on the ESP32 to control LEDs connected to GPIO pins via HTTP requests — introducing embedded web servers and GPIO interaction.",
			hardware: ["ESP32 DevKit V1", "LED", "220Ω Resistor", "Breadboard", "Jumper Wires"],
			technologies: ["ESP32", "WiFi", "HTTP", "REST API", "GPIO"],
			circuitImage: true,
			steps: [
				"Connect LED anode to GPIO pin via 220Ω resistor; cathode to GND",
				"Set up ESP32 in STA mode and connect to WiFi",
				"Start AsyncWebServer listening on port 80",
				"Register /api/led/on and /api/led/off GET handlers",
				"Use digitalWrite() to toggle LED state",
				"Test from browser and dashboard interface",
			],
			endpoints: [
				{ method: "GET", path: "/api/led/on" },
				{ method: "GET", path: "/api/led/off" },
			],
			result:
				"LED can be controlled successfully from the local dashboard through the ESP32 REST API.",
			resources: [
				{ label: "Source Code" },
				{ label: "Tutorial Video" },
				{ label: "Lab Report" },
			],
		},
	},
	{
		id: "pwm-motor",
		title: "Motor Speed Control using PWM",
		description: "Control motor speed using PWM signals",
		icon: Zap,
		iconColor: "text-purple-600",
		iconBg: "bg-purple-100",
		tags: ["PWM", "L298N", "Motor Driver"],
		status: "completed",
		detail: {
			objective:
				"Use Pulse Width Modulation (PWM) signals from the ESP32 to regulate DC motor speed through an L298N motor driver.",
			hardware: ["ESP32 DevKit V1", "L298N Motor Driver", "DC Motor", "12V Power Supply", "Jumper Wires"],
			technologies: ["ESP32", "PWM", "L298N", "Motor Driver"],
			circuitImage: true,
			steps: [
				"Connect L298N IN1/IN2/ENA to ESP32 GPIO pins",
				"Attach DC motor to L298N output terminals",
				"Power L298N with external 12V supply; share GND with ESP32",
				"Write PWM signal to ENA pin (0–255 duty cycle)",
				"Combine with digital outputs for forward/reverse control",
				"Test speed ramping from dashboard slider",
			],
			result:
				"Motor speed adjusts smoothly from 0–100% via PWM duty cycle changes from the dashboard.",
			resources: [
				{ label: "Source Code" },
				{ label: "Tutorial Video" },
				{ label: "Lab Report" },
			],
		},
	},
	{
		id: "internet-led",
		title: "Internet LED Control",
		description: "Remote ESP32 control over internet",
		icon: Globe,
		iconColor: "text-teal-600",
		iconBg: "bg-teal-100",
		tags: ["IoT Cloud", "Communication"],
		status: "completed",
		detail: {
			objective:
				"Extend local web server control to work over the internet using cloud relay, bridging embedded systems with global IoT connectivity.",
			hardware: ["ESP32 DevKit V1", "LED", "220Ω Resistor", "Breadboard", "Jumper Wires"],
			technologies: ["ESP32", "WiFi", "MQTT", "Cloud", "REST API"],
			steps: [
				"Set up ESP32 WiFi in STA mode with internet access",
				"Configure MQTT client on ESP32 (cloud broker)",
				"Subscribe to control topic (esp32/led/set)",
				"Publish status updates to status topic (esp32/led/status)",
				"Dashboard publishes MQTT messages via WebSocket relay",
				"Test from outside local network",
			],
			result:
				"ESP32 responds to MQTT commands from anywhere with internet access, enabling true remote IoT control.",
			resources: [
				{ label: "Source Code" },
				{ label: "Tutorial Video" },
				{ label: "Lab Report" },
			],
		},
	},
	{
		id: "smart-agri",
		title: "Smart Agriculture System",
		description: "Monitor soil moisture and automatically control water pump",
		icon: Sprout,
		iconColor: "text-green-600",
		iconBg: "bg-success/10",
		tags: ["Soil Sensor", "Relay", "Water Pump"],
		status: "in-progress",
		featured: true,
		detail: {
			objective:
				"Integrate sensors and actuators into a single real-world application: soil moisture sensing triggers automatic water pump control with visual feedback.",
			hardware: [
				"ESP32 DevKit V1",
				"Soil Moisture Sensor (YL-69)",
				"Relay Module",
				"Water Pump (5V)",
				"LEDs (Red/Yellow/Green)",
				"220Ω Resistors",
				"Breadboard",
				"Jumper Wires",
				"External Power Supply",
			],
			technologies: ["ESP32", "WiFi", "HTTP", "GPIO", "PWM", "Sensor", "Relay"],
			circuitImage: true,
			steps: [
				"Wire soil moisture sensor to ESP32 ADC pin",
				"Connect relay module to GPIO for pump control",
				"Wire status LEDs (Red=Dry, Yellow=Moist, Green=Wet)",
				"Read analog soil moisture values and map to percentage",
				"Implement auto-watering logic (pump on when dry)",
				"Poll sensors and serve telemetry via REST API",
				"Build React dashboard with real-time updates",
			],
			result:
				"System monitors soil moisture in real-time and automatically waters the plant when the soil is dry. Status LEDs and dashboard provide full visibility.",
			resources: [
				{ label: "Source Code" },
				{ label: "Tutorial Video" },
				{ label: "Lab Report" },
			],
		},
	},
]
