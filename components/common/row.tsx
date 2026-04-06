import React from "react";

// React Native
import { View, type StyleProp, type ViewStyle } from "react-native";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

type ElementType = React.ElementType;

type RowBaseProps = {
  flex?: number;
  gap?: keyof Theme["spacings"];
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  justify?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
};
type RowProps<T extends ElementType = typeof View> = RowBaseProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof RowBaseProps> & {
    as?: T;
    style?: StyleProp<ViewStyle>;
  };

export function Row<T extends ElementType = typeof View>({
  as,
  flex,
  gap = "sm",
  align = "center",
  justify = "flex-start",
  children,
  style,
  ...rest
}: RowProps<T>) {
  const { theme } = useTheme();

  const Component = as ?? View;

  const viewStyles: ViewStyle = {
    flex,
    flexDirection: "row",
    alignItems: align,
    justifyContent: justify,
    gap: theme.spacings[gap],
  };

  return (
    <Component style={[viewStyles, style]} {...rest}>
      {children}
    </Component>
  );
}
