import React from "react";

// React Native
import {
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

// Reanimated
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// Hooks
import { useTheme } from "@/hooks/use-theme";

// Libs
import { Haptics } from "@/libs";

type Props = PressableProps & {
  /**
   * Estilo do componente
   **/
  style?: StyleProp<ViewStyle>;
  /**
   * Opacidade do highlight
   * @default 0.08
   */
  highlightOpacity?: number;
  /**
   * Valor de escala do componente
   * @default 0.97
   */
  scaleValue?: number;
  /**
   * Se o componente está desabilitado
   * @default false
   */
  disabled?: boolean;
  /**
   * Se o componente está em estado de loading
   * @default false
   */
  isLoading?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

export function PressableFeedback({
  children,
  style,
  scaleValue = 0.97,
  highlightOpacity = 0.08,
  disabled,
  onPressIn,
  onPressOut,
  isLoading,
  ...rest
}: Props) {
  const { scheme } = useTheme();

  const scale = useSharedValue(1);
  const highlight = useSharedValue(0);

  const scaleRef = React.useRef(scale);
  const highlightRef = React.useRef(highlight);

  const [pressed, setPressed] = React.useState<boolean>(false);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(scaleRef.current.value, {
          duration: 120,
        }),
      },
    ],
  }));

  const highlightStyle = useAnimatedStyle(() => ({
    opacity: withTiming(highlightRef.current.value, { duration: 120 }),
  }));

  function handlePressIn(e: GestureResponderEvent) {
    Haptics.hapticButtonPress();

    setPressed(true);

    scaleRef.current.value = scaleValue;
    highlightRef.current.value = highlightOpacity;

    onPressIn?.(e);
  }

  function handlePressOut(e: GestureResponderEvent) {
    setPressed(false);

    scaleRef.current.value = 1;
    highlightRef.current.value = 0;

    onPressOut?.(e);
  }

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled || isLoading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, scaleStyle, style]}
    >
      <AnimatedView
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: scheme === "dark" ? "#000000" : "#FFFFFF" },
          highlightStyle,
        ]}
      />

      {typeof children === "function" ? children({ pressed, hovered: false }) : children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});
