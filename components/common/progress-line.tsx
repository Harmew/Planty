import React from "react";

// React Native
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

// Reanimated
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

type ProgressLineProps = {
  /**
   * Largura total da barra
   */
  maxWidth?: number;
  /**
   * Altura da barra
   * @default 6
   */
  height?: number;
  /**
   * Porcentagem da barra preenchida
   * @default 0
   */
  percentage: number;
  /**
   * Cor da linha ativa
   * @default "tint"
   */
  activeColor?: keyof Theme["tokens"];
  /**
   * Cor da linha de fundo
   * @default "backgroundSecondary"
   */
  backgroundColor?: keyof Theme["tokens"];
  /**
   * Duração da animação em ms
   * @default 300
   */
  duration?: number;
  /**
   * Styles
   */
  style?: StyleProp<ViewStyle>;
};

export const ProgressLine: React.FC<ProgressLineProps> = ({
  maxWidth,
  height = 6,
  percentage = 0,
  activeColor = "tint",
  backgroundColor = "backgroundSecondary",
  duration = 300,
  style,
}) => {
  const { theme } = useTheme();

  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  const progress = useSharedValue(0);
  const progressRef = React.useRef(progress);

  React.useEffect(() => {
    if (!containerWidth) return;

    const clamped = Math.min(Math.max(percentage, 0), 100);

    // Atualiza com animação
    progressRef.current.value = withTiming((clamped / 100) * containerWidth, {
      duration,
      easing: Easing.out(Easing.exp),
    });
  }, [percentage, containerWidth, duration]);

  // Estilo animado da barra
  const animatedStyle = useAnimatedStyle(() => ({
    width: progressRef.current.value,
  }));

  return (
    <View
      onLayout={(e) => {
        if (!containerWidth) {
          setContainerWidth(e.nativeEvent.layout.width);
        }
      }}
      style={[
        styles.container,
        {
          height,
          maxWidth: maxWidth ?? "100%",
          backgroundColor: theme.tokens[backgroundColor],
          borderRadius: height,
        },
        style,
      ]}
    >
      <Animated.View
        style={[animatedStyle, { height, backgroundColor: theme.tokens[activeColor], borderRadius: height / 2 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});
