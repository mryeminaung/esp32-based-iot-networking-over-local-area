import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import { getWaterStatus } from "@/types";

type Props = {
  level: number; // 0-100
};

const STATUS_CONFIG = {
  Full: { color: "#0284C7", bg: "#F0F9FF", border: "#BAE6FD" },
  Medium: { color: "#F59E0B", bg: "#FEF3C7", border: "#FDE68A" },
  Low: { color: "#EF4444", bg: "#FEE2E2", border: "#FECACA" },
};

const TANK_HEIGHT = 120;

export default function WaterTankCard({ level }: Props) {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];
  const status = getWaterStatus(level);
  const config = STATUS_CONFIG[status];

  const fillHeight = useSharedValue(0);

  useEffect(() => {
    // Animate from current position to target
    const targetHeight = (level / 100) * TANK_HEIGHT;
    fillHeight.value = withSpring(targetHeight, {
      damping: 15,
      stiffness: 80,
    });
  }, [level, fillHeight]);

  const animatedFillStyle = useAnimatedStyle(() => ({
    height: fillHeight.value,
  }));

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
        <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
          <Ionicons name="water" size={20} color={config.color} />
        </View>
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          Water Tank Level
        </Text>
      </View>

      <View style={styles.content}>
        {/* Vertical tank indicator */}
        <View style={styles.tankWrapper}>
          <View style={[styles.tank, { borderColor: config.border }]}>
            {/* Water fill */}
            <Animated.View
              style={[
                styles.tankFill,
                animatedFillStyle,
                { backgroundColor: config.color },
              ]}
            />
          </View>
          {/* Level markers */}
          <View style={styles.markers}>
            <Text style={[styles.marker, { color: colors.textMuted }]}>100%</Text>
            <Text style={[styles.marker, { color: colors.textMuted }]}>75%</Text>
            <Text style={[styles.marker, { color: colors.textMuted }]}>50%</Text>
            <Text style={[styles.marker, { color: colors.textMuted }]}>25%</Text>
            <Text style={[styles.marker, { color: colors.textMuted }]}>0%</Text>
          </View>
        </View>

        {/* Value and status */}
        <View style={styles.infoSection}>
          <Text style={[styles.value, { color: colors.textPrimary }]}>
            {level}%
          </Text>
          <View style={[styles.badge, { backgroundColor: config.bg }]}>
            <Text style={[styles.badgeText, { color: config.color }]}>
              {status}
            </Text>
          </View>

          {status === "Low" && (
            <View style={[styles.warning, { backgroundColor: STATUS_CONFIG.Low.bg }]}>
              <Ionicons name="warning" size={14} color={STATUS_CONFIG.Low.color} />
              <Text style={[styles.warningText, { color: STATUS_CONFIG.Low.color }]}>
                Refill needed
              </Text>
            </View>
          )}
        </View>
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
  content: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  tankWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tank: {
    width: 40,
    height: TANK_HEIGHT,
    borderRadius: 8,
    borderWidth: 2,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  tankFill: {
    width: "100%",
    borderRadius: 6,
  },
  markers: {
    height: TANK_HEIGHT,
    justifyContent: "space-between",
  },
  marker: {
    fontSize: 10,
    fontWeight: "500",
  },
  infoSection: {
    flex: 1,
    gap: 8,
  },
  value: {
    fontSize: 36,
    fontWeight: "700",
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
  warning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
