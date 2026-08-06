import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Colors, DeviceColors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

type Props = {
  value: number;
  onValueChange: (value: number) => void;
  onSlidingComplete: (value: number) => void;
  disabled?: boolean;
};

export default function FanSlider({
  value,
  onValueChange,
  onSlidingComplete,
  disabled = false,
}: Props) {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];
  const deviceColor = DeviceColors.fan;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bgCard,
          borderColor: colors.border,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: value > 0 ? deviceColor.activeBg : deviceColor.bg },
          ]}
        >
          <Ionicons
            name="airplane"
            size={20}
            color={value > 0 ? "#FFFFFF" : deviceColor.text}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Ventilation Fan
          </Text>
          <Text style={[styles.status, { color: value > 0 ? deviceColor.activeBg : colors.textMuted }]}>
            {value > 0 ? "ON" : "OFF"}
          </Text>
        </View>
        <Text style={[styles.value, { color: deviceColor.activeBg }]}>
          {Math.round(value)}%
        </Text>
      </View>
      <Slider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        onSlidingComplete={onSlidingComplete}
        minimumValue={0}
        maximumValue={100}
        step={1}
        minimumTrackTintColor={deviceColor.activeBg}
        maximumTrackTintColor={colors.border}
        thumbTintColor={deviceColor.activeBg}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
  },
  slider: {
    width: "100%",
    height: 40,
  },
});
