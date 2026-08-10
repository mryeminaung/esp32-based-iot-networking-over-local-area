import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { testConnection } from "@/api/esp32";
import { getEsp32Ip } from "@/api/client";
import { Colors } from "@/constants/theme";
import { useDashboardStore, type ThemeMode, type PollingInterval } from "@/store/dashboard";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

const THEME_OPTIONS: { key: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "light", label: "Light", icon: "sunny" },
  { key: "dark", label: "Dark", icon: "moon" },
  { key: "system", label: "System", icon: "phone-portrait" },
];

const POLLING_OPTIONS: { value: PollingInterval; label: string }[] = [
  { value: 1, label: "1s" },
  { value: 3, label: "3s" },
  { value: 5, label: "5s" },
  { value: 10, label: "10s" },
  { value: 30, label: "30s" },
];

export default function SettingsScreen() {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];

  const themeMode = useDashboardStore((s) => s.themeMode);
  const setThemeMode = useDashboardStore((s) => s.setThemeMode);
  const pollingInterval = useDashboardStore((s) => s.pollingInterval);
  const setPollingInterval = useDashboardStore((s) => s.setPollingInterval);
  const thresholds = useDashboardStore((s) => s.thresholds);
  const setThresholds = useDashboardStore((s) => s.setThresholds);
  const sysInfo = useDashboardStore((s) => s.sysInfo);
  const connected = useDashboardStore((s) => s.connected);
  const loadSettings = useDashboardStore((s) => s.loadSettings);

  const [testing, setTesting] = useState(false);
  const esp32Ip = getEsp32Ip();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleTestConnection = async () => {
    setTesting(true);
    const success = await testConnection();
    setTesting(false);

    if (success) {
      Alert.alert("Success", "Connected to ESP32!");
    } else {
      Alert.alert("Failed", "Could not connect to ESP32. Check the IP address in .env");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bgPage }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ESP32 Connection */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.bgMuted }]}>
            <Ionicons name="globe" size={18} color={colors.textMuted} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            ESP32 Connection
          </Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>IP Address</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{esp32Ip}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#166534", marginTop: 12 }]}
          onPress={handleTestConnection}
          disabled={testing}
        >
          {testing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.primaryButtonText}>Test Connection</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ESP32 Device Info */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.bgMuted }]}>
            <Ionicons name="hardware-chip" size={18} color={colors.textMuted} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            ESP32 Device Info
          </Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Status</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: connected ? "#10B981" : "#EF4444" }]} />
            <Text style={[styles.value, { color: connected ? "#10B981" : "#EF4444" }]}>
              {connected ? "Online" : "Offline"}
            </Text>
          </View>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Device</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{sysInfo.device}</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Mode</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{sysInfo.mode}</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>WiFi</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{sysInfo.wifi}</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>IP Address</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{sysInfo.ip}</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>MAC</Text>
          <Text style={[styles.value, { color: colors.textPrimary, fontSize: 12 }]}>{sysInfo.mac}</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Uptime</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{sysInfo.uptime}</Text>
        </View>
      </View>

      {/* Theme Toggle */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.bgMuted }]}>
            <Ionicons name="color-palette" size={18} color={colors.textMuted} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Appearance
          </Text>
        </View>

        <View style={styles.themeOptions}>
          {THEME_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.themeOption,
                {
                  backgroundColor: themeMode === option.key ? colors.accent : colors.bgMuted,
                  borderColor: themeMode === option.key ? colors.accent : colors.border,
                },
              ]}
              onPress={() => setThemeMode(option.key)}
            >
              <Ionicons
                name={option.icon}
                size={20}
                color={themeMode === option.key ? "#FFFFFF" : colors.textMuted}
              />
              <Text
                style={[
                  styles.themeLabel,
                  { color: themeMode === option.key ? "#FFFFFF" : colors.textSecondary },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Polling Interval */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.bgMuted }]}>
            <Ionicons name="time" size={18} color={colors.textMuted} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Polling Interval
          </Text>
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          How often to fetch data from ESP32. Lower values = faster updates but more network usage.
        </Text>

        <View style={styles.pollingOptions}>
          {POLLING_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.pollingOption,
                {
                  backgroundColor: pollingInterval === option.value ? colors.accent : colors.bgMuted,
                  borderColor: pollingInterval === option.value ? colors.accent : colors.border,
                },
              ]}
              onPress={() => setPollingInterval(option.value)}
            >
              <Text
                style={[
                  styles.pollingLabel,
                  { color: pollingInterval === option.value ? "#FFFFFF" : colors.textSecondary },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Alert Thresholds */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.bgMuted }]}>
            <Ionicons name="notifications" size={18} color={colors.textMuted} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Alert Thresholds
          </Text>
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Configure moisture levels that trigger DRY, MOIST, and OPTIMAL alerts.
        </Text>

        {/* DRY Threshold */}
        <View style={styles.thresholdContainer}>
          <View style={styles.thresholdHeader}>
            <Text style={[styles.thresholdLabel, { color: colors.textPrimary }]}>DRY below</Text>
            <Text style={[styles.thresholdValue, { color: "#EF4444" }]}>{thresholds.dryBelow}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={50}
            step={1}
            value={thresholds.dryBelow}
            onValueChange={(val) => setThresholds({ dryBelow: val })}
            minimumTrackTintColor="#EF4444"
            maximumTrackTintColor={colors.bgMuted}
            thumbTintColor="#EF4444"
          />
          <View style={styles.thresholdRange}>
            <Text style={[styles.thresholdRangeText, { color: colors.textMuted }]}>0%</Text>
            <Text style={[styles.thresholdRangeText, { color: colors.textMuted }]}>50%</Text>
          </View>
        </View>

        {/* MOIST Threshold */}
        <View style={styles.thresholdContainer}>
          <View style={styles.thresholdHeader}>
            <Text style={[styles.thresholdLabel, { color: colors.textPrimary }]}>MOIST below</Text>
            <Text style={[styles.thresholdValue, { color: "#F59E0B" }]}>{thresholds.moistBelow}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={thresholds.dryBelow + 1}
            maximumValue={100}
            step={1}
            value={thresholds.moistBelow}
            onValueChange={(val) => setThresholds({ moistBelow: val })}
            minimumTrackTintColor="#F59E0B"
            maximumTrackTintColor={colors.bgMuted}
            thumbTintColor="#F59E0B"
          />
          <View style={styles.thresholdRange}>
            <Text style={[styles.thresholdRangeText, { color: colors.textMuted }]}>{thresholds.dryBelow + 1}%</Text>
            <Text style={[styles.thresholdRangeText, { color: colors.textMuted }]}>100%</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={[styles.legend, { borderTopColor: colors.border }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#EF4444" }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              DRY: 0–{thresholds.dryBelow}%
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#F59E0B" }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              MOIST: {thresholds.dryBelow + 1}–{thresholds.moistBelow - 1}%
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              OPTIMAL: {thresholds.moistBelow}–100%
            </Text>
          </View>
        </View>
      </View>

      {/* About */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.bgMuted }]}>
            <Ionicons name="information-circle" size={18} color={colors.textMuted} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            About
          </Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>App Name</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>IoT Agriculture</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Version</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>1.0.0</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Platform</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>React Native + Expo</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Project</Text>
          <Text style={[styles.value, { color: colors.textPrimary, fontSize: 12 }]}>ESP32 IoT Networking Lab</Text>
        </View>
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
    paddingBottom: 100,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
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
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  themeOptions: {
    flexDirection: "row",
    gap: 10,
  },
  themeOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  pollingOptions: {
    flexDirection: "row",
    gap: 8,
  },
  pollingOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  pollingLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  thresholdContainer: {
    marginBottom: 20,
  },
  thresholdHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  thresholdLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  thresholdValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  thresholdRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  thresholdRangeText: {
    fontSize: 11,
  },
  legend: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 8,
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
