import React from "react";

// React Native
import { Platform, View, type StyleProp, type ViewStyle } from "react-native";

// Expo StatusBar
import { StatusBar } from "expo-status-bar";

// React Native Safe Area Context
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Hooks
import { useTheme } from "@/hooks/use-theme";

type ElementType = React.ElementType;

type ScreenWrapperBaseProps = {
  flex?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Propiedades do ScreenWrapper
 * @example
 * ```tsx
 * <ScreenWrapper>
 *   {children}
 * </ScreenWrapper>
 * ```
 */
type ScreenWrapperProps<T extends ElementType> = ScreenWrapperBaseProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof ScreenWrapperBaseProps>;

export function ScreenWrapper<T extends ElementType = typeof View>({
  as,
  flex = 1,
  children,
  style,
  ...rest
}: ScreenWrapperProps<T>) {
  const { top: marginTop } = useSafeAreaInsets();
  const { scheme } = useTheme();

  const Component = as ?? View;
  const statusBarStyle = scheme === "dark" ? "light" : "dark";

  const screenWrapperStyles: ViewStyle = {
    flex,
    marginTop: Platform.OS === "ios" ? marginTop : marginTop,
  };

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <Component style={[screenWrapperStyles, style]} {...rest}>
        {children}
      </Component>
    </>
  );
}
