import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

type Props = {
  onDone: () => void;
};

type Phase = "show" | "fade" | "hidden";

export default function SplashScreen({ onDone }: Props) {
  const resolvedTheme = useResolvedTheme();
  const colors = Colors[resolvedTheme];
  const [phase, setPhase] = useState<Phase>("show");

  // Animation values
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(0.8);
  const wave1Scale = useSharedValue(0.5);
  const wave2Scale = useSharedValue(0.5);
  const wave3Scale = useSharedValue(0.5);
  const wave1Opacity = useSharedValue(0);
  const wave2Opacity = useSharedValue(0);
  const wave3Opacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const dot1Opacity = useSharedValue(0);
  const dot2Opacity = useSharedValue(0);
  const dot3Opacity = useSharedValue(0);

  useEffect(() => {
    // Icon entrance animation
    iconScale.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.back(1.5)),
    });

    // Wave animations (repeating)
    const createWaveAnimation = (
      scaleSV: typeof wave1Scale,
      opacitySV: typeof wave1Opacity,
      delay: number,
    ) => {
      scaleSV.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 2000, easing: Easing.out(Easing.quad) }),
            withTiming(0.5, { duration: 0 }),
          ),
          -1,
          false,
        ),
      );
      opacitySV.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.6, { duration: 2000, easing: Easing.out(Easing.quad) }),
            withTiming(0, { duration: 0 }),
          ),
          -1,
          false,
        ),
      );
    };

    createWaveAnimation(wave1Scale, wave1Opacity, 0);
    createWaveAnimation(wave2Scale, wave2Opacity, 400);
    createWaveAnimation(wave3Scale, wave3Opacity, 800);

    // Progress bar animation
    progressWidth.value = withTiming(1, {
      duration: 2500,
      easing: Easing.inOut(Easing.quad),
    });

    // Dot animations (repeating)
    const createDotAnimation = (
      dotSV: typeof dot1Opacity,
      delay: number,
    ) => {
      dotSV.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0, { duration: 300 }),
          ),
          -1,
          false,
        ),
      );
    };

    createDotAnimation(dot1Opacity, 0);
    createDotAnimation(dot2Opacity, 200);
    createDotAnimation(dot3Opacity, 400);

    // Phase transitions
    const fadeTimer = setTimeout(() => {
      setPhase("fade");
      opacity.value = withTiming(0, { duration: 500 });
      scale.value = withTiming(1.05, { duration: 500 });
    }, 2500);

    const doneTimer = setTimeout(() => {
      setPhase("hidden");
      onDone();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const wave1Style = useAnimatedStyle(() => ({
    transform: [{ scale: wave1Scale.value }],
    opacity: wave1Opacity.value,
  }));

  const wave2Style = useAnimatedStyle(() => ({
    transform: [{ scale: wave2Scale.value }],
    opacity: wave2Opacity.value,
  }));

  const wave3Style = useAnimatedStyle(() => ({
    transform: [{ scale: wave3Scale.value }],
    opacity: wave3Opacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
  }));

  if (phase === "hidden") return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.bgPage },
        containerStyle,
      ]}
    >
      {/* Signal waves */}
      <View style={styles.waveContainer}>
        {/* Wave 3 (outermost) */}
        <Animated.View
          style={[styles.wave, styles.wave3, wave3Style, { borderColor: colors.accent + "40" }]}
        />
        {/* Wave 2 */}
        <Animated.View
          style={[styles.wave, styles.wave2, wave2Style, { borderColor: colors.accent + "60" }]}
        />
        {/* Wave 1 (innermost) */}
        <Animated.View
          style={[styles.wave, styles.wave1, wave1Style, { borderColor: colors.accent + "80" }]}
        />

        {/* Center icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.accentLight, borderColor: colors.accent + "30" },
            iconStyle,
          ]}
        >
          <Ionicons name="leaf" size={40} color={colors.accent} />
        </Animated.View>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Smart Agriculture
      </Text>

      {/* Subtitle with animated dots */}
      <View style={styles.subtitleRow}>
        <Ionicons name="radio" size={14} color={colors.accent} />
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Connecting to sensors
        </Text>
        <View style={styles.dotsContainer}>
          <Animated.Text style={[styles.dot, dot1Style]}>.</Animated.Text>
          <Animated.Text style={[styles.dot, dot2Style]}>.</Animated.Text>
          <Animated.Text style={[styles.dot, dot3Style]}>.</Animated.Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <Animated.View
          style={[
            styles.progressBar,
            { backgroundColor: colors.accent },
            progressStyle,
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  waveContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  wave: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 2,
  },
  wave1: {
    width: 100,
    height: 100,
  },
  wave2: {
    width: 140,
    height: 140,
  },
  wave3: {
    width: 180,
    height: 180,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  dotsContainer: {
    flexDirection: "row",
    width: 20,
  },
  dot: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressTrack: {
    width: 192,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 32,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
