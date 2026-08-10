import { Tabs, useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import CustomTabBar from "@/features/navigation/CustomTabBar";
import { usePathname } from "expo-router";
import type { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

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

const TABS: { key: string; label: string; icon: IoniconsName; iconFocused: IoniconsName }[] = [
  { key: "index", label: "Home", icon: "leaf-outline", iconFocused: "leaf" },
  { key: "sensors", label: "Sensors", icon: "analytics-outline", iconFocused: "analytics" },
  { key: "devices", label: "Devices", icon: "hardware-chip-outline", iconFocused: "hardware-chip" },
  { key: "settings", label: "Settings", icon: "settings-outline", iconFocused: "settings" },
];

function CustomTabBarWrapper() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab from pathname
  const activeTab = TABS.find((t) => {
    if (t.key === "index") return pathname === "/";
    return pathname.startsWith(`/${t.key}`);
  })?.key || "index";

  const handleTabPress = (key: string) => {
    if (key === "index") {
      router.push("/");
    } else {
      router.push(`/${key}` as any);
    }
  };

  return <CustomTabBar tabs={TABS} activeTab={activeTab} onTabPress={handleTabPress} />;
}

export default function RootLayout() {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bgPage }]} edges={["top"]}>
      <Tabs
        tabBar={() => <CustomTabBarWrapper />}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.bgPage,
            shadowColor: "transparent",
            elevation: 0,
          },
          headerTintColor: colors.textPrimary,
          headerShown: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            header: () => (
              <HeaderTitle title="Smart Agriculture" subtitle="IoT Monitoring System" />
            ),
          }}
        />
        <Tabs.Screen
          name="sensors"
          options={{
            title: "Sensors",
            header: () => (
              <HeaderTitle title="Sensor Readings" subtitle="Real-time Data" />
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
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            header: () => (
              <HeaderTitle title="Settings" subtitle="Configuration" />
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
