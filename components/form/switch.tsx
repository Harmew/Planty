import React from "react";

// React Native
import { Pressable, StyleSheet } from "react-native";

// Reanimated
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

// Libs
import { Haptics } from "@/libs";

type SwitchProps = {
  /**
   * If the switch is selected
   */
  isSelected: boolean;
  /**
   * Callback function when the switch is toggled
   */
  onSelectedChange?: (value: boolean) => void;
  /** Width of the switch
   * @default 50
   */
  width?: number;
  /** Height of the switch
   * @default 24
   */
  height?: number;
  /**
   * Color of the switch when it is active
   *  @default "tint"
   */
  activeColor?: keyof Theme["tokens"];
  /**
   * Color of the switch when it is inactive
   * @default "surfaceDisabled"
   */
  inactiveColor?: keyof Theme["tokens"];
  /** If the switch is disabled
   * @default false
   */
  disabled?: boolean;
};

export const Switch = ({
  isSelected,
  onSelectedChange,
  width = 50,
  height = 24,
  activeColor = "tint",
  inactiveColor = "surfaceDisabled",
  disabled = false,
}: SwitchProps) => {
  const { styles, theme } = useTheme(createStyles);
  const thumbSize = height - 4;

  // Controla a posição do thumb
  const thumbPosition = useSharedValue(isSelected ? width - thumbSize - 2 : 2);
  // Controla a animação da cor da track
  const progress = useSharedValue(isSelected ? 1 : 0);

  // Refs
  const thumbPositionRef = React.useRef(thumbPosition);
  const progressRef = React.useRef(progress);

  React.useEffect(() => {
    thumbPositionRef.current.value = withSpring(isSelected ? width - thumbSize - 2 : 2);
    progressRef.current.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected, thumbPositionRef, progressRef, thumbSize, width]);

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbPositionRef.current.value }],
  }));

  const animatedTrackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progressRef.current.value,
      [0, 1],
      [theme.tokens[inactiveColor], theme.tokens[activeColor]],
    ),
  }));

  const handleChange = () => {
    if (disabled) return;

    Haptics.hapticSelection();
    onSelectedChange?.(!isSelected);
  };

  return (
    <Pressable disabled={disabled} onPress={handleChange} style={{ width, height }} hitSlop={12}>
      <Animated.View style={[styles.track, animatedTrackStyle, { width, height, borderRadius: height / 2 }]}>
        <Animated.View
          style={[
            styles.thumb,
            animatedThumbStyle,
            { width: thumbSize, height: thumbSize, borderRadius: thumbSize / 2 },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    track: {
      justifyContent: "center",
      borderCurve: "continuous",
    },
    thumb: {
      backgroundColor: theme.colors.white,
      position: "absolute",
      top: 2,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
  });
