import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDashboardStore } from "@/store/dashboard";
import useEsp32Sync from "./hooks/useEsp32Sync";
import MoistureGauge from "./components/MoistureGauge";
import MoistureIndicator from "./components/MoistureIndicator";
import AlertBanner from "./components/AlertBanner";
import SystemInfo from "./components/SystemInfo";
import { getMoistureCondition } from "@/types";
import { Colors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

export default function DashboardScreen() {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];

  const moisture = useDashboardStore((s) => s.moisture);
  const sysInfo = useDashboardStore((s) => s.sysInfo);
  const connected = useDashboardStore((s) => s.connected);

  // Start ESP32 polling
  useEsp32Sync();

  const condition = getMoistureCondition(moisture);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bgPage }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Soil Moisture Card */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="water" size={20} color={colors.accent} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Soil Moisture
          </Text>
        </View>
        <MoistureGauge value={moisture} size={200} strokeWidth={10} />
      </View>

      {/* Moisture Indicators */}
      <View style={styles.indicators}>
        <MoistureIndicator condition="DRY" active={condition === "DRY"} />
        <MoistureIndicator condition="MOIST" active={condition === "MOIST"} />
        <MoistureIndicator condition="OPTIMAL" active={condition === "OPTIMAL"} />
      </View>

      {/* System Decision Banner */}
      <AlertBanner moisture={moisture} />

      {/* System Info Card */}
      <SystemInfo info={sysInfo} connected={connected} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  indicators: {
    flexDirection: "row",
    gap: 8,
  },
});
