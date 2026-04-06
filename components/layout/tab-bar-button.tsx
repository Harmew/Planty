import React from "react";

// React Native
import { Pressable, PressableProps, StyleSheet, View } from "react-native";

// Reanimated
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// React Navigation Native
import type { NavigationRoute, ParamListBase } from "@react-navigation/native";

// SVGs
import { HeartPulseProps, HomeProps, Icons, SettingsProps } from "@/components/svgs";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const icons: Record<string, React.FC<HomeProps | HeartPulseProps | SettingsProps>> = {
  "minhas-plantas": Icons.Home,
  "meus-cuidados": Icons.HeartPulse,
  ajustes: Icons.Settings,
};

type TabBarButtonProps = Omit<PressableProps, "style"> & {
  route: NavigationRoute<ParamListBase, string>;
  isFocused: boolean;
  href?: string;
  group?: "left" | "right";
  onPress?: () => void;
  onLongPress?: () => void;
};

export const TabBarButton: React.FC<TabBarButtonProps> = ({
  href,
  group,
  onPress,
  onLongPress,
  route,
  isFocused,
  ...props
}) => {
  const { theme, styles } = useTheme(createStyles);

  const progress = useSharedValue(isFocused ? 1 : 0);
  const progressRef = React.useRef(progress);

  React.useEffect(() => {
    // timing sem damping, muda de uma vez
    progressRef.current.value = withTiming(isFocused ? 1 : 0, { duration: 150 });
  }, [isFocused]);

  // Container animado
  const animatedContainerStyle = useAnimatedStyle(() => ({
    paddingHorizontal:
      group === "left"
        ? theme.spacings.lg + progress.value * (theme.spacings.lg - theme.spacings.sm)
        : theme.spacings.sm,
    backgroundColor: interpolateColor(progress.value, [0, 1], ["transparent", theme.tokens.tint]),
  }));

  return (
    <AnimatedPressable
      key={route.key}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.container, animatedContainerStyle]}
      android_ripple={undefined}
      {...props}
    >
      <View>
        {icons[route.name] &&
          React.createElement(icons[route.name], {
            size: 28,
            tone: isFocused ? "textOnTint" : "tabIconDefault",
          })}
      </View>
    </AnimatedPressable>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.full,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacings.sm,
    },
  });
