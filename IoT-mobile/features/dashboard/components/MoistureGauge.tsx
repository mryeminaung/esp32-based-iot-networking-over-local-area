import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { getMoistureCondition } from "@/types";
import { Colors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import { useDashboardStore } from "@/store/dashboard";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  value: number;
  size?: number;
  strokeWidth?: number;
};

const CONDITION_CONFIG = {
  DRY: { color: "#EF4444", label: "DRY", bg: "#FEE2E2" },
  MOIST: { color: "#F59E0B", label: "MOIST", bg: "#FEF3C7" },
  OPTIMAL: { color: "#10B981", label: "WET / OPTIMAL", bg: "#D1FAE5" },
};

export default function MoistureGauge({
  value,
  size = 200,
  strokeWidth = 10,
}: Props) {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];
  const thresholds = useDashboardStore((s) => s.thresholds);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const condition = getMoistureCondition(value, thresholds);
  const config = CONDITION_CONFIG[condition];

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(value / 100, {
      damping: 15,
      stiffness: 100,
    });
  }, [value, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(
      progress.value,
      [0, 1],
      [circumference, 0],
    ),
  }));

  return (
    <View style={styles.container}>
      {/* Gauge */}
      <View style={[styles.gaugeContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* Background track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress arc */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={config.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        {/* Center value */}
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: colors.textPrimary }]}>
            {value}
          </Text>
          <Text style={[styles.percent, { color: colors.textMuted }]}>%</Text>
        </View>
      </View>

      {/* Condition badge */}
      <View style={[styles.badge, { backgroundColor: config.bg }]}>
        <Text style={[styles.badgeText, { color: config.color }]}>
          {config.label}
        </Text>
      </View>

      {/* Scale bar */}
      <View style={styles.scaleBar}>
        <View style={styles.scaleTrack}>
          {/* DRY segment (red) */}
          <View style={[styles.scaleSegment, { backgroundColor: "#EF4444", flex: 1 }]} />
          {/* MOIST segment (amber) */}
          <View style={[styles.scaleSegment, { backgroundColor: "#F59E0B", flex: 1 }]} />
          {/* OPTIMAL segment (green) */}
          <View style={[styles.scaleSegment, { backgroundColor: "#10B981", flex: 2 }]} />
        </View>
        {/* Position indicator */}
        <View
          style={[
            styles.scaleDot,
            {
              left: `${Math.min(100, Math.max(0, value))}%`,
              backgroundColor: colors.textPrimary,
              borderColor: colors.bgCard,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
  },
  gaugeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  valueContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "baseline",
  },
  value: {
    fontSize: 40,
    fontWeight: "bold",
  },
  percent: {
    fontSize: 14,
    marginLeft: 2,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  scaleBar: {
    width: "100%",
    maxWidth: 280,
    height: 10,
    position: "relative",
  },
  scaleTrack: {
    flex: 1,
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  scaleSegment: {
    height: "100%",
  },
  scaleDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    top: 0,
    marginLeft: -5,
  },
});
