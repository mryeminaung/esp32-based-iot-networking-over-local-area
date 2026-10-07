import { AppError } from "./appError.js";

/** Per-request timeout so a bad IP doesn't hang the API */
export const ESP32_TIMEOUT_MS = 5000;

/**
 * Candidate base URLs, in order:
 * 1. ESP32_API_URL from .env (STA IP)
 * 2. mDNS hostnames (survive DHCP IP changes)
 */
export function esp32BaseUrls(): string[] {
	return [
		process.env.ESP32_API_URL,
		"http://esp32-server.local",
		"http://esp32.local",
	].filter((u): u is string => Boolean(u && u.trim()));
}

/**
 * Fetch from the ESP32, trying each base URL until one succeeds.
 * Throws AppError(502) if every candidate fails.
 */
export async function esp32Fetch(
	path: string,
	init?: RequestInit,
): Promise<Response> {
	const bases = esp32BaseUrls();
	if (bases.length === 0) {
		throw new AppError(502, "ESP32 unreachable: ESP32_API_URL not configured");
	}

	let lastError = "No ESP32 URL reachable";

	for (const base of bases) {
		const url = `${base.replace(/\/$/, "")}${path}`;
		try {
			const controller = new AbortController();
			const timer = setTimeout(() => controller.abort(), ESP32_TIMEOUT_MS);
			try {
				const res = await fetch(url, { ...init, signal: controller.signal });
				if (res.ok) return res;
				lastError = `ESP32 responded ${res.status}`;
			} finally {
				clearTimeout(timer);
			}
		} catch (error) {
			lastError = (error as Error).message || "network error";
		}
	}

	throw new AppError(502, `ESP32 unreachable: ${lastError}`);
}
