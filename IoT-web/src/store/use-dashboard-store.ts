import { create } from "zustand";

// ── Type definitions ──
export type DeviceKey =
	| "red_light"
	| "yellow_light"
	| "green_light"
	| "white_light"
	| "relay"
	| "fan"
	| "water_pump";

export type LogEntry = {
	id: number;
	time: string;
	message: string;
	type: "on" | "off" | "info" | "adjust";
};

export type SysInfo = {
	device: string;
	status: "Online" | "Offline";
	mode: "AP Mode" | "STA Mode";
	wifi: string;
	ip: string;
	mac: string;
	uptime: string;
};

export type Theme = "light" | "dark";

export type DeviceKeys = Record<DeviceKey, boolean | number>;

export type DashboardState = {
	connected: boolean;
	connecting: boolean;
	devices: DeviceKeys;
	sysInfo: SysInfo;
	moisture: number;
	logs: LogEntry[];
	theme: Theme;
};

export type DashboardActions = {
	setConnected: (val: boolean) => void;
	setConnecting: (val: boolean) => void;
	toggleDevice: (key: DeviceKey) => void;
	setSlider: (key: DeviceKey, val: number) => void;
	setSysInfo: (info: Partial<SysInfo>) => void;
	setMoisture: (val: number) => void;
	syncFromESP32: (
		sysInfo: Partial<SysInfo>,
		moisture: number,
		devices?: Partial<DeviceKeys>,
	) => void;
	setDisconnected: () => void;
	addLog: (entry: Omit<LogEntry, "id">) => void;
	clearLogs: () => void;
	toggleTheme: () => void;
	setTheme: (t: Theme) => void;
};

const initialSysInfo: SysInfo = {
	device: "ESP32 Dev Board",
	status: "Online",
	mode: "STA Mode",
	wifi: "Unknown",
	ip: "--",
	mac: "--:--:--:--:--:--",
	uptime: "0d 00:00:00",
};

let logId = 0;

export const useDashboardStore = create<DashboardState & DashboardActions>(
	(set) => ({
		// ── State ──
		connected: false,
		connecting: false,
		devices: {
			red_light: false,
			yellow_light: false,
			green_light: false,
			white_light: false,
			relay: false,
			fan: 0,
			water_pump: false,
		},
		sysInfo: initialSysInfo,
		moisture: 0,
		logs: [],
		theme: (localStorage.getItem("theme") as Theme) || "light",

		// ── Actions ──
		setConnected: (connected) => set({ connected }),
		setConnecting: (connecting) => set({ connecting }),

		toggleDevice: (key) =>
			set((s) => ({
				devices: { ...s.devices, [key]: !s.devices[key] },
			})),

		setSlider: (key, val) =>
			set((s) => ({
				devices: { ...s.devices, [key]: val },
			})),

		setSysInfo: (info) =>
			set((s) => ({
				sysInfo: { ...s.sysInfo, ...info },
			})),

		setMoisture: (moisture) => set({ moisture }),

		syncFromESP32: (sysInfo, moisture, devices) =>
			set((s) => ({
				sysInfo: { ...s.sysInfo, ...sysInfo },
				moisture,
				devices: devices ? { ...s.devices, ...devices } : s.devices,
				connected: true,
				connecting: false,
			})),

		setDisconnected: () => set({ connected: false, connecting: false }),

		addLog: (entry) =>
			set((s) => ({
				logs: [...s.logs.slice(-99), { ...entry, id: ++logId }],
			})),

		clearLogs: () => set({ logs: [] }),

		toggleTheme: () =>
			set((s) => {
				const next = s.theme === "light" ? "dark" : "light";
				localStorage.setItem("theme", next);
				return { theme: next };
			}),

		setTheme: (theme) => {
			localStorage.setItem("theme", theme);
			set({ theme });
		},
	}),
);
