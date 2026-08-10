import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  unit: string;
  status: string;
  statusColor: string;
  statusBg: string;
  accentColor: string;
};

export default function SensorCard({
  icon,
  title,
  value,
  unit,
  status,
  statusColor,
  statusBg,
  accentColor,
}: Props) {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bgCard,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: statusBg }]}>
          <Ionicons name={icon} size={20} color={accentColor} />
        </View>
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          {title}
        </Text>
      </View>

      {/* Value */}
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
        <Text style={[styles.unit, { color: colors.textMuted }]}>{unit}</Text>
      </View>

      {/* Status badge */}
      <View style={[styles.badge, { backgroundColor: statusBg }]}>
        <Text style={[styles.badgeText, { color: statusColor }]}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: "700",
  },
  unit: {
    fontSize: 14,
    fontWeight: "500",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
