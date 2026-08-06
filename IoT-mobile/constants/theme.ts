/**
 * Theme colors matching the IoT-dashboard web app
 * Sage green palette with dark mode support
 */

// Light theme colors (sage green)
const lightColors = {
  // Page & surfaces
  bgPage: "#E8F0E4",
  bgCard: "#FFFFFF",
  bgCardHover: "#F0F5ED",
  bgMuted: "#DDE8D8",

  // Borders
  border: "#D5DDD7",
  borderStrong: "#B0BFB3",

  // Text
  textPrimary: "#17231B",
  textSecondary: "#3D4F44",
  textMuted: "#647067",

  // Accent (green)
  accent: "#166534",
  accentLight: "#F0FDF4",
  accentHover: "#15803D",
  accentBright: "#22C55E",

  // Water (blue)
  water: "#0284C7",
  waterLight: "#F0F9FF",

  // Semantic
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  danger: "#EF4444",
  dangerLight: "#FEE2E2",

  // Toggle
  toggleOff: "#B0BFB3",

  // Status bar
  statusBar: "dark",
};

// Dark theme colors
const darkColors = {
  // Page & surfaces
  bgPage: "#0F172A",
  bgCard: "#1E293B",
  bgCardHover: "#253449",
  bgMuted: "#1E293B",

  // Borders
  border: "#334155",
  borderStrong: "#475569",

  // Text
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",

  // Accent (green)
  accent: "#4ADE80",
  accentLight: "#052e16",
  accentHover: "#22C55E",
  accentBright: "#4ADE80",

  // Water (blue)
  water: "#38BDF8",
  waterLight: "#0c4a6e",

  // Semantic
  success: "#10B981",
  successLight: "#064e3b",
  warning: "#F59E0B",
  warningLight: "#78350f",
  danger: "#EF4444",
  dangerLight: "#7f1d1d",

  // Toggle
  toggleOff: "#475569",

  // Status bar
  statusBar: "light",
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

// Device color mappings (from web dashboard)
export const DeviceColors = {
  water_pump: { bg: "#F0F9FF", text: "#0284C7", activeBg: "#0284C7" },
  relay: { bg: "#F0FDFA", text: "#0D9488", activeBg: "#0D9488" },
  fan: { bg: "#F3F4F6", text: "#6B7280", activeBg: "#6B7280" },
  white_light: { bg: "#FAF5FF", text: "#9333EA", activeBg: "#9333EA" },
  red_light: { bg: "#FEF2F2", text: "#EF4444", activeBg: "#EF4444" },
  yellow_light: { bg: "#FFFBEB", text: "#F59E0B", activeBg: "#F59E0B" },
  green_light: { bg: "#F0FDF4", text: "#22C55E", activeBg: "#22C55E" },
};

// Icon name mappings (expo vector icons names)
export const DeviceIcons = {
  water_pump: "water" as const,
  relay: "flash" as const,
  fan: "fan" as const,
  white_light: "bulb" as const,
  red_light: "bulb" as const,
  yellow_light: "bulb" as const,
  green_light: "bulb" as const,
};

// Feature icon mappings
export const FeatureIcons = {
  sprout: "leaf" as const,
  droplets: "water" as const,
  alertTriangle: "warning" as const,
  checkCircle: "checkmark-circle" as const,
  info: "information-circle" as const,
  power: "power" as const,
  fan: "fan" as const,
  zap: "flash" as const,
  history: "time" as const,
  monitor: "desktop" as const,
  network: "globe" as const,
  activity: "pulse" as const,
  clock: "time" as const,
  wifi: "wifi" as const,
  cpu: "hardware-chip" as const,
  settings: "settings" as const,
  moon: "moon" as const,
  sun: "sunny" as const,
};
