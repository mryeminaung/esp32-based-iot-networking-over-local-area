import React, { useState, useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDashboardStore } from "@/store/dashboard";
import SensorCard from "@/features/dashboard/components/SensorCard";
import WaterTankCard from "@/features/dashboard/components/WaterTankCard";
import {
  getTemperatureStatus,
  getLightStatus,
  getAirQualityStatus,
} from "@/types";
import { Colors, SensorColors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

// Trend type
type Trend = "up" | "down" | "stable";

function useTrend(value: number): Trend {
  const prevRef = useRef(value);
  const [trend, setTrend] = useState<Trend>("stable");

  useEffect(() => {
    if (value > prevRef.current) {
      setTrend("up");
    } else if (value < prevRef.current) {
      setTrend("down");
    } else {
      setTrend("stable");
    }
    prevRef.current = value;
  }, [value]);

  return trend;
}

function TrendIndicator({ trend, color }: { trend: Trend; color: string }) {
  if (trend === "stable") return null;

  return (
    <View style={[styles.trendBadge, { backgroundColor: color + "15" }]}>
      <Ionicons
        name={trend === "up" ? "arrow-up" : "arrow-down"}
        size={12}
        color={color}
      />
    </View>
  );
}

// Sensor groups
const SENSOR_GROUPS = [
  {
    title: "Environment",
    icon: "thermometer" as const,
    type: "grid" as const,
  },
  {
    title: "Light & Water",
    icon: "sunny" as const,
    type: "list" as const,
  },
  {
    title: "Air Quality",
    icon: "leaf" as const,
    type: "list" as const,
  },
];

export default function SensorsScreen() {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];

  // Sensor values from store
  const temperature = useDashboardStore((s) => s.temperature);
  const humidity = useDashboardStore((s) => s.humidity);
  const lightIntensity = useDashboardStore((s) => s.lightIntensity);
  const waterLevel = useDashboardStore((s) => s.waterLevel);
  const airQuality = useDashboardStore((s) => s.airQuality);
  const connected = useDashboardStore((s) => s.connected);

  // Trends
  const tempTrend = useTrend(temperature);
  const humidityTrend = useTrend(humidity);
  const lightTrend = useTrend(lightIntensity);
  const waterTrend = useTrend(waterLevel);
  const airTrend = useTrend(airQuality);

  const tempStatus = getTemperatureStatus(temperature);
  const lightStatus = getLightStatus(lightIntensity);
  const airStatus = getAirQualityStatus(airQuality);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bgPage }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View
        style={[
          styles.headerCard,
          {
            backgroundColor: colors.bgCard,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Ionicons name="analytics" size={24} color={colors.accent} />
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              Sensor Readings
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              Real-time data from ESP32
            </Text>
          </View>
        </View>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: connected ? "#10B981" : "#EF4444" },
            ]}
          />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            {connected ? "Live" : "Offline"}
          </Text>
        </View>
      </View>

      {/* Environment Group - 2-column grid */}
      <View style={styles.groupContainer}>
        <View style={styles.groupHeader}>
          <Ionicons name="thermometer" size={18} color={colors.accent} />
          <Text style={[styles.groupTitle, { color: colors.textPrimary }]}>Environment</Text>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <View style={[styles.miniCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={styles.miniHeader}>
                <View style={[styles.miniIcon, { backgroundColor: SensorColors.temperature.bg }]}>
                  <Ionicons name="thermometer" size={18} color={SensorColors.temperature.accent} />
                </View>
                <TrendIndicator trend={tempTrend} color={SensorColors.temperature.text} />
              </View>
              <Text style={[styles.miniValue, { color: colors.textPrimary }]}>{temperature}°C</Text>
              <Text style={[styles.miniLabel, { color: colors.textMuted }]}>Temperature</Text>
              <View style={[styles.miniBadge, { backgroundColor: SensorColors.temperature.bg }]}>
                <Text style={[styles.miniBadgeText, { color: SensorColors.temperature.text }]}>{tempStatus}</Text>
              </View>
            </View>
          </View>
          <View style={styles.gridItem}>
            <View style={[styles.miniCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={styles.miniHeader}>
                <View style={[styles.miniIcon, { backgroundColor: SensorColors.humidity.bg }]}>
                  <Ionicons name="water" size={18} color={SensorColors.humidity.accent} />
                </View>
                <TrendIndicator trend={humidityTrend} color={SensorColors.humidity.text} />
              </View>
              <Text style={[styles.miniValue, { color: colors.textPrimary }]}>{humidity}%</Text>
              <Text style={[styles.miniLabel, { color: colors.textMuted }]}>Humidity</Text>
              <View style={[styles.miniBadge, { backgroundColor: SensorColors.humidity.bg }]}>
                <Text style={[styles.miniBadgeText, { color: SensorColors.humidity.text }]}>DHT22</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Light & Water Group */}
      <View style={styles.groupContainer}>
        <View style={styles.groupHeader}>
          <Ionicons name="sunny" size={18} color={colors.accent} />
          <Text style={[styles.groupTitle, { color: colors.textPrimary }]}>Light & Water</Text>
        </View>
        <View style={[styles.groupCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <SensorCard
            icon="sunny"
            title="Light Intensity (BH1750)"
            value={`${lightIntensity}`}
            unit="lux"
            status={lightStatus}
            statusColor={SensorColors.light.text}
            statusBg={SensorColors.light.bg}
            accentColor={SensorColors.light.accent}
          />
          <WaterTankCard level={waterLevel} />
        </View>
      </View>

      {/* Air Quality Group */}
      <View style={styles.groupContainer}>
        <View style={styles.groupHeader}>
          <Ionicons name="leaf" size={18} color={colors.accent} />
          <Text style={[styles.groupTitle, { color: colors.textPrimary }]}>Air Quality</Text>
        </View>
        <View style={[styles.groupCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <SensorCard
            icon="leaf"
            title="Air Quality (MQ-135)"
            value={`${airQuality}`}
            unit="AQI"
            status={airStatus}
            statusColor={SensorColors.airQuality.text}
            statusBg={SensorColors.airQuality.bg}
            accentColor={SensorColors.airQuality.accent}
          />
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
  headerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  // Groups
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
    gap: 12,
  },
  // 2-column grid
  gridRow: {
    flexDirection: "row",
    gap: 12,
  },
  gridItem: {
    flex: 1,
    minWidth: 0,
  },
  miniCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  miniHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  miniIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  miniValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  miniBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  // Trend indicator
  trendBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
