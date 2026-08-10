import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

type Props = {
  connected: boolean;
  ip: string;
  lastUpdated: string;
};

export default function ConnectionStatus({ connected, ip, lastUpdated }: Props) {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bgCard,
          borderColor: connected ? "#10B981" : "#EF4444",
        },
      ]}
    >
      <View style={styles.row}>
        {/* Status indicator */}
        <View style={styles.statusSection}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: connected ? "#10B981" : "#EF4444" },
            ]}
          />
          <View>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
              ESP32
            </Text>
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

        {/* IP Address */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="globe-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>IP</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{ip}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Updated</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{lastUpdated}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "700",
  },
  infoSection: {
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "600",
  },
});
