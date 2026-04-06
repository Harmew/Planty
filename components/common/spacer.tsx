import React from "react";

// React Native
import { View, type ViewStyle } from "react-native";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Props for the Spacer component
 * @example
 * ```tsx
 * <Spacer size="lg" />
 * ```
 */
type SpacerProps = {
  /** Spacer size */
  size?: keyof Theme["spacings"];
  /** Horizontal orientation */
  horizontal?: boolean;
  /** Custom style */
  style?: ViewStyle;
};

export const Spacer = ({ size = "lg", horizontal = false, style }: SpacerProps) => {
  const { theme } = useTheme();

  const spacerStyle: ViewStyle = horizontal ? { width: theme.spacings[size] } : { height: theme.spacings[size] };

  return <View style={[spacerStyle, style]} />;
};
