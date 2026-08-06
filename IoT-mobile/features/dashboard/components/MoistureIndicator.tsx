import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MoistureCondition } from "@/types";

type Props = {
  condition: MoistureCondition;
  active: boolean;
};

const CONDITION_CONFIG = {
  DRY: {
    label: "DRY",
    activeBg: "#EF4444",
    activeText: "#FFFFFF",
    inactiveBg: "#FEE2E2",
    inactiveText: "#EF4444",
    icon: "bulb" as const,
  },
  MOIST: {
    label: "MOIST",
    activeBg: "#F59E0B",
    activeText: "#FFFFFF",
    inactiveBg: "#FEF3C7",
    inactiveText: "#F59E0B",
    icon: "bulb" as const,
  },
  OPTIMAL: {
    label: "WET",
    activeBg: "#22C55E",
    activeText: "#FFFFFF",
    inactiveBg: "#D1FAE5",
    inactiveText: "#22C55E",
    icon: "bulb" as const,
  },
};

export default function MoistureIndicator({ condition, active }: Props) {
  const config = CONDITION_CONFIG[condition];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: active ? config.activeBg : config.inactiveBg,
          shadowColor: active ? config.activeBg : "transparent",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: active ? 0.3 : 0,
          shadowRadius: 4,
          elevation: active ? 4 : 0,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: active
              ? "rgba(255,255,255,0.25)"
              : "rgba(255,255,255,0.5)",
          },
        ]}
      >
        <Ionicons
          name={config.icon}
          size={20}
          color={active ? config.activeText : config.inactiveText}
        />
      </View>
      <Text
        style={[
          styles.label,
          {
            color: active ? config.activeText : config.inactiveText,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
