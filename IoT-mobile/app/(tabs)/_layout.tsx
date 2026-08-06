import { Tabs } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

function HeaderTitle({ title, subtitle }: { title: string; subtitle: string }) {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.bgPage }]}>
      <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
    </View>
  );
}

export default function TabLayout() {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bgPage }]} edges={["top"]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.bgCard,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
          headerStyle: {
            backgroundColor: colors.bgPage,
            shadowColor: "transparent",
            elevation: 0,
          },
          headerTintColor: colors.textPrimary,
          headerShown: true,
          contentStyle: {
            backgroundColor: colors.bgPage,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            header: () => (
              <HeaderTitle title="Smart Agriculture" subtitle="IoT Monitoring System" />
            ),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="leaf" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="devices"
          options={{
            title: "Devices",
            header: () => (
              <HeaderTitle title="Device Controls" subtitle="Irrigation & Lighting" />
            ),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="hardware-chip" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            header: () => (
              <HeaderTitle title="Settings" subtitle="Configuration" />
            ),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
});
