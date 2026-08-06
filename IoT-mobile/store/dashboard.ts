import { create } from "zustand";
import type { DeviceKey, LogEntry, SysInfo, Theme, DeviceStates, MoistureThresholds } from "@/types";

// ── Type definitions ──
export type ThemeMode = "light" | "dark" | "system";

export type PollingInterval = 1 | 3 | 5 | 10 | 30;

export type DashboardState = {
  connected: boolean;
  connecting: boolean;
  devices: DeviceStates;
  sysInfo: SysInfo;
  moisture: number;
  logs: LogEntry[];
  themeMode: ThemeMode;
  resolvedTheme: Theme;
  pollingInterval: PollingInterval;
  thresholds: MoistureThresholds;
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
    devices?: Partial<DeviceStates>,
  ) => void;
  setDisconnected: () => void;
  addLog: (entry: Omit<LogEntry, "id">) => void;
  clearLogs: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  resolveTheme: (systemScheme: Theme) => void;
  loadTheme: () => Promise<void>;
  setPollingInterval: (interval: PollingInterval) => void;
  setThresholds: (thresholds: Partial<MoistureThresholds>) => void;
  loadSettings: () => Promise<void>;
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

// Safe storage helper
const safeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
      await AsyncStorage.setItem(key, value);
    } catch {
      // Silently fail
    }
  },
};

export const useDashboardStore = create<DashboardState & DashboardActions>(
  (set, get) => ({
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
    themeMode: "system",
    resolvedTheme: "light",
    pollingInterval: 3,
    thresholds: { dryBelow: 30, moistBelow: 50 },

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

    setThemeMode: (themeMode) => {
      set({ themeMode });
      safeStorage.setItem("themeMode", themeMode);
    },

    resolveTheme: (systemScheme) => {
      const { themeMode } = get();
      const resolvedTheme = themeMode === "system" ? systemScheme : themeMode;
      set({ resolvedTheme });
    },

    loadTheme: async () => {
      const saved = await safeStorage.getItem("themeMode");
      if (saved === "light" || saved === "dark" || saved === "system") {
        set({ themeMode: saved });
      }
    },

    setPollingInterval: (pollingInterval) => {
      set({ pollingInterval });
      safeStorage.setItem("pollingInterval", String(pollingInterval));
    },

    setThresholds: (thresholds) => {
      set((s) => ({
        thresholds: { ...s.thresholds, ...thresholds },
      }));
      const current = get().thresholds;
      safeStorage.setItem("thresholds", JSON.stringify(current));
    },

    loadSettings: async () => {
      const savedInterval = await safeStorage.getItem("pollingInterval");
      if (savedInterval) {
        const interval = Number(savedInterval) as PollingInterval;
        if ([1, 3, 5, 10, 30].includes(interval)) {
          set({ pollingInterval: interval });
        }
      }
      const savedThresholds = await safeStorage.getItem("thresholds");
      if (savedThresholds) {
        try {
          const thresholds = JSON.parse(savedThresholds) as MoistureThresholds;
          set({ thresholds });
        } catch {}
      }
    },
  }),
);
