import React from "react";

// React Native
import { StyleSheet, View, type ViewStyle } from "react-native";

// Reanimated
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

// SVGs
import { Icons } from "@/components/svgs";

// Hooks
import { Theme } from "@/hooks/use-theme";

type SpinnerProps = {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
  /** Indica se o spinner está carregando */
  isLoading?: boolean;
  /** Duração da animação em milissegundos */
  duration?: number;
  /** Estilo adicional para o spinner */
  style?: ViewStyle;
};

export function Spinner({ size = 24, tone = "tint", isLoading = true, duration = 900, style }: SpinnerProps) {
  const rotation = useSharedValue(0);
  const rotationRef = React.useRef(rotation);

  React.useEffect(() => {
    if (!isLoading) {
      rotationRef.current.value = 0;
      return;
    }

    rotationRef.current.value = withRepeat(
      withTiming(360, {
        duration,
        easing: Easing.linear,
      }),
      -1,
    );
  }, [isLoading, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotationRef.current.value}deg` }],
    };
  });

  if (!isLoading) return null;

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={animatedStyle}>
        <Icons.Spinner size={size} tone={tone} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
