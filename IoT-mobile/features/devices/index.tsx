import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDashboardStore } from "@/store/dashboard";
import { sendCommand } from "@/features/dashboard/hooks/useEsp32Sync";
import DeviceCard from "./components/DeviceCard";
import FanSlider from "./components/FanSlider";
import { Colors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import type { DeviceKey } from "@/types";
import type { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type DeviceConfig = {
  key: DeviceKey;
  label: string;
  icon: IoniconsName;
  type: "toggle" | "slider";
};

const DEVICE_CONFIG: DeviceConfig[] = [
  { key: "water_pump", label: "Irrigation Pump", icon: "water", type: "toggle" },
  { key: "relay", label: "Relay", icon: "flash", type: "toggle" },
  { key: "fan", label: "Ventilation Fan", icon: "airplane", type: "slider" },
  { key: "white_light", label: "Grow Light", icon: "bulb", type: "toggle" },
];

export default function DevicesScreen() {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];
  const devices = useDashboardStore((s) => s.devices);
  const connected = useDashboardStore((s) => s.connected);
  const moisture = useDashboardStore((s) => s.moisture);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bgPage }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View style={[styles.headerCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Ionicons name="power" size={18} color={colors.textMuted} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Irrigation Control
          </Text>
        </View>
        <View style={[styles.modeBar, { backgroundColor: colors.bgMuted, borderColor: colors.border }]}>
          <View style={styles.modeItem}>
            <Text style={[styles.modeLabel, { color: colors.textMuted }]}>Mode</Text>
            <Text style={[styles.modeValue, { color: colors.textPrimary }]}>MANUAL</Text>
          </View>
          <View style={[styles.modeDivider, { backgroundColor: colors.border }]} />
          <View style={styles.modeItem}>
            <Text style={[styles.modeLabel, { color: colors.textMuted }]}>Soil</Text>
            <Text style={[styles.modeValue, { color: colors.textPrimary }]}>
              {moisture <= 30 ? "DRY" : moisture < 50 ? "MOIST" : "OPTIMAL"}
            </Text>
          </View>
        </View>
      </View>

      {/* Offline Banner */}
      {!connected && (
        <View style={[styles.offlineBanner, { backgroundColor: "#FEE2E2", borderColor: "#FECACA" }]}>
          <Ionicons name="warning" size={18} color="#EF4444" />
          <Text style={styles.offlineText}>
            ESP32 is offline. Controls may not work.
          </Text>
        </View>
      )}

      {/* Device Controls */}
      <View style={[styles.controlsCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        {DEVICE_CONFIG.map((device, index) =>
          device.type === "slider" ? (
            <FanSlider
              key={device.key}
              value={devices[device.key] as number}
              onValueChange={(val) => {
                useDashboardStore.getState().setSlider(device.key, val);
              }}
              onSlidingComplete={(val) => {
                sendCommand(device.key, val, val);
              }}
              disabled={!connected}
            />
          ) : (
            <DeviceCard
              key={device.key}
              device={device.key}
              label={device.label}
              icon={device.icon}
              value={devices[device.key] as boolean}
              onToggle={(val) => sendCommand(device.key, val)}
              disabled={!connected}
            />
          )
        )}
      </View>
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
  headerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  modeBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  modeItem: {
    flex: 1,
    alignItems: "center",
  },
  modeLabel: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modeValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  modeDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 12,
  },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  offlineText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  controlsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
});
