import React from "react";

// React Native
import { StyleSheet, View } from "react-native";

// React Native Reanimated
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// React Native SVG
import Svg, { Path } from "react-native-svg";

const AnimatedView = Animated.createAnimatedComponent(View);

export type PlantIntroProps = {
  /** Tamanho do componente
   * @default 252
   */
  size?: number;
  /** Duração da animação
   * @default 1200
   */
  duration?: number;
};

export function PlantIntro({ size = 252, duration = 1200 }: PlantIntroProps) {
  const progress = useSharedValue(0);
  const progressRef = React.useRef(progress);

  React.useEffect(() => {
    progressRef.current.value = withTiming(1, { duration });
  }, [duration]);

  // CAULE
  const stemStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleY: interpolate(progressRef.current.value, [0, 1], [0, 1]) }],
      opacity: interpolate(progressRef.current.value, [0, 1], [0, 1]),
    };
  });

  // BOLINHA
  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(progressRef.current.value, [0, 1], [150, 0]) },
        { scale: interpolate(progressRef.current.value, [0, 1], [0.6, 1]) },
      ],
      opacity: interpolate(progressRef.current.value, [0.2, 1], [0, 1]),
    };
  });

  // FOLHAS INTERNAS
  const leafStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progressRef.current.value, [0.2, 1], [0, 1]), // delay leve
      transform: [
        { translateY: interpolate(progressRef.current.value, [0, 1], [60, 0]) },
        { scaleY: interpolate(progressRef.current.value, [0, 1], [0, 1]) },
      ],
    };
  });

  // FOLHA ESQUERDA GRANDE
  const bigLeafLeftStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progressRef.current.value, [0.5, 1], [0, 1]),
      transform: [
        { translateY: interpolate(progressRef.current.value, [0, 1], [80, 0]) },
        { scale: interpolate(progressRef.current.value, [0.5, 1], [0.6, 1]) },
        { rotate: `${interpolate(progressRef.current.value, [0.5, 1], [-15, 0])}deg` },
      ],
    };
  });

  // FOLHA DIREITA GRANDE
  const bigLeafRightStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progressRef.current.value, [0.5, 1], [0, 1]),
      transform: [
        { translateY: interpolate(progressRef.current.value, [0, 1], [80, 0]) },
        { scale: interpolate(progressRef.current.value, [0.5, 1], [0.6, 1]) },
        { rotate: `${interpolate(progressRef.current.value, [0.5, 1], [15, 0])}deg` },
      ],
    };
  });

  const height = (size * 195) / 252;

  return (
    <View style={styles.container}>
      <View style={{ width: size, height }}>
        {/* CAULE */}
        <AnimatedView style={[styles.content, stemStyle]}>
          <Svg width={size} height={height} viewBox="0 0 252 195">
            <Path d="M127.934 24H123.934V193H127.934V24Z" fill="#EDC659" />
          </Svg>
        </AnimatedView>

        {/* 🟡 BOLINHA */}
        <AnimatedView style={[styles.ball, circleStyle]}>
          <Svg width={size} height={height} viewBox="0 0 252 195">
            <Path
              d="M125.934 36C135.875 36 143.934 27.9411 143.934 18C143.934 8.05888 135.875 0 125.934 0C115.992 0 107.934 8.05888 107.934 18C107.934 27.9411 115.992 36 125.934 36Z"
              fill="#EDC659"
            />
          </Svg>
        </AnimatedView>

        <AnimatedView style={[styles.content, leafStyle]}>
          <Svg width={size} height={height} viewBox="0 0 252 195">
            {/* DIREITA */}
            <Path
              d="M183.628 120.178C170.951 167.038 125.934 194 125.934 194C125.934 194 104.663 149.106 117.34 102.245C130.017 55.3851 173.437 26.3632 173.437 26.3632C173.437 26.3632 196.304 73.3171 183.628 120.178Z"
              fill="#81B433"
            />

            {/* ESQUERDA */}
            <Path
              d="M68.3057 120.178C80.9824 167.038 125.934 194 125.934 194C125.934 194 147.27 149.106 134.593 102.245C121.917 55.3851 78.4965 26.3633 78.4965 26.3633C78.4965 26.3633 55.6291 73.3171 68.3057 120.178Z"
              fill="#8CC337"
            />
          </Svg>
        </AnimatedView>

        {/* FOLHA ESQUERDA GRANDE */}
        <AnimatedView style={[styles.content, bigLeafLeftStyle]}>
          <Svg width={size} height={height} viewBox="0 0 252 195">
            <Path
              d="M86.9334 108.107C121.718 141.968 125.967 194.022 125.967 194.022C125.967 194.022 73.8183 191.174 39.0335 157.312C4.24873 123.451 0 71.3977 0 71.3977C0 71.3977 52.1486 74.2451 86.9334 108.107Z"
              fill="#699328"
            />
          </Svg>
        </AnimatedView>

        {/* FOLHA DIREITA GRANDE */}
        <AnimatedView style={[styles.content, bigLeafRightStyle]}>
          <Svg width={size} height={height} viewBox="0 0 252 195">
            <Path
              d="M165 108.107C130.216 141.968 125.967 194.022 125.967 194.022C125.967 194.022 178.115 191.174 212.9 157.312C247.685 123.451 251.934 71.3977 251.934 71.3977C251.934 71.3977 199.785 74.2451 165 108.107Z"
              fill="#729F2C"
            />
          </Svg>
        </AnimatedView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  ball: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  content: {
    position: "absolute",
    width: "100%",
    height: "100%",
    transformOrigin: "bottom",
  },
});
