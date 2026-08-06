import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
  },
  indicators: {
    flexDirection: "row",
    gap: 8,
  },
});
