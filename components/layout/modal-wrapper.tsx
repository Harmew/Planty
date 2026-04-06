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

type ModalWrapperBaseProps = {
  flex?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Propiedades do ModalWrapper
 * @example
 * ```tsx
 * <ModalWrapper>
 *   {children}
 * </ModalWrapper>
 * ```
 */
type ModalWrapperProps<T extends ElementType> = ModalWrapperBaseProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof ModalWrapperBaseProps>;

export function ModalWrapper<T extends ElementType = typeof View>({
  as,
  flex = 1,
  children,
  style,
  ...rest
}: ModalWrapperProps<T>) {
  const { top: marginTop } = useSafeAreaInsets();
  const { theme, scheme } = useTheme();

  const Component = as ?? View;
  const statusBarStyle = scheme === "dark" ? "light" : "dark";

  const modalWrapperStyles: ViewStyle = {
    flex,
    marginTop: Platform.OS === "ios" ? theme.spacings.lg : marginTop,
  };

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <Component style={[modalWrapperStyles, style]} {...rest}>
        {children}
      </Component>
    </>
  );
}
