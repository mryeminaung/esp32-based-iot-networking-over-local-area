import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { DeviceKey } from "@/types";
import { Colors, DeviceColors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

type Props = {
  device: DeviceKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
};

export default function DeviceCard({
  device,
  label,
  icon,
  value,
  onToggle,
  disabled = false,
}: Props) {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];
  const deviceColor = DeviceColors[device] || DeviceColors.relay;

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
      <View style={styles.left}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: value ? deviceColor.activeBg : deviceColor.bg },
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={value ? "#FFFFFF" : deviceColor.text}
          />
        </View>
        <View style={styles.info}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            {label}
          </Text>
          <Text style={[styles.status, { color: value ? deviceColor.activeBg : colors.textMuted }]}>
            {value ? "ON" : "OFF"}
          </Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{
          false: colors.toggleOff,
          true: deviceColor.activeBg,
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={colors.toggleOff}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
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
});
