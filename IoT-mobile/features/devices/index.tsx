import React from "react";
import { ScrollView, StyleSheet, View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
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

// Device groups
const DEVICE_GROUPS = [
  {
    title: "Irrigation",
    icon: "water" as const,
    devices: [
      { key: "water_pump" as DeviceKey, label: "Water Pump", icon: "water" as IoniconsName, type: "toggle" as const },
    ],
  },
  {
    title: "Lighting",
    icon: "bulb" as const,
    devices: [
      { key: "white_light" as DeviceKey, label: "Grow Light", icon: "bulb" as IoniconsName, type: "toggle" as const },
    ],
  },
  {
    title: "Ventilation",
    icon: "airplane" as const,
    devices: [
      { key: "fan" as DeviceKey, label: "Fan Speed", icon: "airplane" as IoniconsName, type: "slider" as const },
      { key: "relay" as DeviceKey, label: "Relay", icon: "flash" as IoniconsName, type: "toggle" as const },
    ],
  },
];

// Quick actions
const QUICK_ACTIONS = [
  { label: "Water All", icon: "water", action: "water_all" },
  { label: "Lights Off", icon: "bulb-outline", action: "lights_off" },
  { label: "Full Speed", icon: "speedometer", action: "full_speed" },
];

export default function DevicesScreen() {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];
  const devices = useDashboardStore((s) => s.devices);
  const connected = useDashboardStore((s) => s.connected);
  const moisture = useDashboardStore((s) => s.moisture);

  const handleQuickAction = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    switch (action) {
      case "water_all":
        sendCommand("water_pump", true);
        break;
      case "lights_off":
        sendCommand("white_light", false);
        break;
      case "full_speed":
        sendCommand("fan", 100, 100);
        break;
    }
  };

  const handleToggle = (key: DeviceKey, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendCommand(key, value);
  };

  const handleSlider = (key: DeviceKey, value: number) => {
    useDashboardStore.getState().setSlider(key, value);
  };

  const handleSliderComplete = (key: DeviceKey, value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendCommand(key, value, value);
  };

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
            Device Controls
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

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.action}
              style={[styles.quickAction, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
              onPress={() => handleQuickAction(action.action)}
            >
              <Ionicons name={action.icon as IoniconsName} size={20} color={colors.accent} />
              <Text style={[styles.quickActionLabel, { color: colors.textPrimary }]}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Device Groups */}
      {DEVICE_GROUPS.map((group) => (
        <View key={group.title} style={styles.groupContainer}>
          <View style={styles.groupHeader}>
            <Ionicons name={group.icon} size={18} color={colors.accent} />
            <Text style={[styles.groupTitle, { color: colors.textPrimary }]}>{group.title}</Text>
          </View>
          <View style={[styles.groupCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            {group.devices.map((device, index) =>
              device.type === "slider" ? (
                <FanSlider
                  key={device.key}
                  value={devices[device.key] as number}
                  onValueChange={(val) => handleSlider(device.key, val)}
                  onSlidingComplete={(val) => handleSliderComplete(device.key, val)}
                  disabled={!connected}
                />
              ) : (
                <DeviceCard
                  key={device.key}
                  device={device.key}
                  label={device.label}
                  icon={device.icon}
                  value={devices[device.key] as boolean}
                  onToggle={(val) => handleToggle(device.key, val)}
                  disabled={!connected}
                />
              )
            )}
          </View>
        </View>
      ))}
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
  // Quick Actions
  quickActionsContainer: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  // Device Groups
  groupContainer: {
    gap: 10,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  groupCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
});
