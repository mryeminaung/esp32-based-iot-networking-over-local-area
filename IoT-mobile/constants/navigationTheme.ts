import type { Theme } from "@react-navigation/native";

// Light theme matching sage green palette
export const LightNavigationTheme: Theme = {
  dark: false,
  colors: {
    primary: "#166534",
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#17231B",
    border: "#E5E7EB",
    notification: "#EF4444",
  },
  fonts: {
    regular: {
      fontFamily: "System",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "System",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "System",
      fontWeight: "700",
    },
    heavy: {
      fontFamily: "System",
      fontWeight: "800",
    },
  },
};

// Dark theme matching sage green palette
export const DarkNavigationTheme: Theme = {
  dark: true,
  colors: {
    primary: "#4ADE80",
    background: "#0F172A",
    card: "#1E293B",
    text: "#F1F5F9",
    border: "#334155",
    notification: "#EF4444",
  },
  fonts: {
    regular: {
      fontFamily: "System",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "System",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "System",
      fontWeight: "700",
    },
    heavy: {
      fontFamily: "System",
      fontWeight: "800",
    },
  },
};
