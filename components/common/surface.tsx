import React from "react";

// React Native
import { StyleSheet, View, type ViewStyle } from "react-native";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

type ElementType = React.ElementType;

type Variant = "default" | "gradient";

type SurfaceBaseProps = React.PropsWithChildren & {
  style?: ViewStyle;
  wrapperStyle?: ViewStyle;
  variant?: Variant;
};

type SurfaceProps<T extends ElementType> = SurfaceBaseProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof SurfaceBaseProps>;

export function Surface<T extends ElementType = typeof View>({
  as,
  style,
  wrapperStyle,
  children,
  ...rest
}: SurfaceProps<T>) {
  const { styles } = useTheme(createStyles);
  const Component = as ?? View;

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <Component style={[styles.base, style]} {...rest}>
        {children}
      </Component>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      padding: theme.spacings.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.tokens.surface,
      borderCurve: "continuous",
      gap: theme.spacings.sm,
      overflow: "hidden",
    },
    wrapper: {
      borderRadius: theme.borderRadius.lg,
      borderCurve: "continuous",
      // sombras empilhadas aproximando o CSS
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.04,
      shadowRadius: 4,
    },
  });
