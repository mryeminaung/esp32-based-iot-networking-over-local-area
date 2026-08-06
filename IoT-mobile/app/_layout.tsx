import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useResolvedTheme } from "@/hooks/useResolvedTheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}
