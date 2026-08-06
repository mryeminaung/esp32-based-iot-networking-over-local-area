import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getMoistureCondition } from "@/types";
import { Colors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import { useDashboardStore } from "@/store/dashboard";

type Props = {
  moisture: number;
};

const CONDITION_CONFIG = {
  DRY: {
    label: "DRY",
    message: "Irrigation required",
    detail: "Soil moisture is critically low",
    color: "#EF4444",
    bg: "#FEE2E2",
    bgOpacity: "rgba(239, 68, 68, 0.08)",
    borderOpacity: "rgba(239, 68, 68, 0.2)",
    icon: "warning" as const,
  },
  MOIST: {
    label: "MOIST",
    message: "Monitor soil condition",
    detail: "Soil moisture is below optimal",
    color: "#F59E0B",
    bg: "#FEF3C7",
    bgOpacity: "rgba(245, 158, 11, 0.08)",
    borderOpacity: "rgba(245, 158, 11, 0.2)",
    icon: "information-circle" as const,
  },
  OPTIMAL: {
    label: "WET / OPTIMAL",
    message: "Soil moisture sufficient",
    detail: "Current levels are healthy",
    color: "#10B981",
    bg: "#D1FAE5",
    bgOpacity: "rgba(16, 185, 129, 0.08)",
    borderOpacity: "rgba(16, 185, 129, 0.2)",
    icon: "checkmark-circle" as const,
  },
};

export default function AlertBanner({ moisture }: Props) {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];
  const thresholds = useDashboardStore((s) => s.thresholds);
  const condition = getMoistureCondition(moisture, thresholds);
  const config = CONDITION_CONFIG[condition];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: resolvedTheme === "dark" ? config.bg : config.bgOpacity,
          borderColor: config.borderOpacity,
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon} size={22} color={config.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: config.color }]}>
          {config.label}
        </Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {config.message}
        </Text>
        <Text style={[styles.detail, { color: colors.textMuted }]}>
          {config.detail}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
  },
  message: {
    fontSize: 14,
    marginTop: 2,
  },
  detail: {
    fontSize: 12,
    marginTop: 2,
  },
});
