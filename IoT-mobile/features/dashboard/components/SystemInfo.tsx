import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SysInfo } from "@/types";
import { Colors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

type Props = {
  info: SysInfo;
  connected: boolean;
};

const INFO_ITEMS = [
  { key: "device", label: "Device", icon: "desktop" as const },
  { key: "wifi", label: "WiFi", icon: "wifi" as const },
  { key: "ip", label: "IP Address", icon: "globe" as const },
  { key: "uptime", label: "Uptime", icon: "time" as const },
];

export default function SystemInfo({ info, connected }: Props) {
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
        <Ionicons name="hardware-chip" size={18} color={colors.textMuted} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Technical Details
        </Text>
      </View>

      {/* Info rows */}
      {INFO_ITEMS.map((item, index) => (
        <View
          key={item.key}
          style={[
            styles.row,
            {
              borderBottomColor: colors.border,
              borderBottomWidth: index < INFO_ITEMS.length - 1 ? 1 : 0,
            },
          ]}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.iconContainer, { backgroundColor: colors.bgMuted }]}>
              <Ionicons name={item.icon} size={16} color={colors.textMuted} />
            </View>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {item.label}
            </Text>
          </View>
          <Text style={[styles.value, { color: colors.textPrimary }]}>
            {info[item.key as keyof SysInfo] ?? "--"}
          </Text>
        </View>
      ))}

      {/* Status row */}
      <View style={[styles.row, { borderBottomWidth: 0 }]}>
        <View style={styles.rowLeft}>
          <View style={[styles.iconContainer, { backgroundColor: colors.bgMuted }]}>
            <Ionicons name="pulse" size={16} color={colors.textMuted} />
          </View>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Status
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: connected ? "#10B981" : "#EF4444",
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: connected ? "#10B981" : "#EF4444" },
            ]}
          >
            {connected ? "Online" : "Offline"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
