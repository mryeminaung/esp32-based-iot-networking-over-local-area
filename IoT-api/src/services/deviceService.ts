import { AppError } from "../utils/appError.js";
import { esp32Fetch } from "../utils/esp32.js";

/**
 * Fetch current device state and sensor data from ESP32
 */
export async function getDeviceState() {
	const res = await esp32Fetch("/all");
	return await res.json();
}

/**
 * Send a control command to ESP32
 */
export async function sendDeviceCommand(device: string, state: number, value = 0) {
	const res = await esp32Fetch("/control", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ device, state, value }),
	});
	return await res.json();
}

/**
 * Push threshold config to ESP32
 */
export async function sendConfigToESP32(config: {
	soilDryThreshold: number;
	soilOptimalThreshold: number;
	waterLowThreshold: number;
	waterCriticalThreshold: number;
	buzzerEnabled: boolean;
	buzzerLowWater: boolean;
	buzzerDrySoil: boolean;
	lightLowThreshold: number;
}) {
	try {
		const res = await esp32Fetch("/config", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(config),
		});
		return await res.json();
	} catch (error) {
		// Non-fatal — ESP32 may be offline; settings are still saved in DB
		if (error instanceof AppError) {
			console.error("[DeviceService] Failed to push config to ESP32:", error.message);
		} else {
			console.error("[DeviceService] Failed to push config to ESP32:", (error as Error).message);
		}
		return null;
	}
}
