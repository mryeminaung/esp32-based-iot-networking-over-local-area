import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState, useCallback } from "react";
import "react-native-reanimated";

import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import { LightNavigationTheme, DarkNavigationTheme } from "@/constants/navigationTheme";
import SplashScreen from "@/features/splash";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === "dark";
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashDone = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <ThemeProvider value={isDark ? DarkNavigationTheme : LightNavigationTheme}>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}
