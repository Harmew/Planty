import React from "react";

//  React Native
import { useColorScheme } from "react-native";

// Theme
import { BorderRadius, Colors, FontSizes, Fonts, LineHeights, Scheme, Shadows, Spacings } from "@/theme";

type Theme = {
  colors: typeof Colors;
  borderRadius: typeof BorderRadius;
  fontSizes: typeof FontSizes;
  fonts: typeof Fonts;
  shadows: typeof Shadows;
  spacings: typeof Spacings;
  lineHeights: typeof LineHeights;
  tokens: typeof Scheme.dark | typeof Scheme.light;
};

type Mode = "light" | "dark";

// overloads
export function useTheme(): { theme: Theme; scheme: Mode };
export function useTheme<T>(factory: (theme: Theme) => T): { theme: Theme; styles: T; scheme: Mode };

export function useTheme<T>(factory?: (theme: Theme) => T) {
  const colorScheme = useColorScheme();
  const mode: Mode = colorScheme === "unspecified" ? "light" : colorScheme;

  const theme = React.useMemo<Theme>(() => {
    return {
      colors: Colors,
      borderRadius: BorderRadius,
      fontSizes: FontSizes,
      fonts: Fonts,
      shadows: Shadows,
      lineHeights: LineHeights,
      spacings: Spacings,
      tokens: Scheme[mode] ?? Scheme.light,
    };
  }, [mode]);

  const styles = React.useMemo(() => {
    if (!factory) return undefined;
    return factory(theme);
  }, [theme, factory]);

  if (factory) {
    return { theme, styles, scheme: mode } as { theme: Theme; styles: T; scheme: Mode };
  }

  return { theme, scheme: mode };
}

export type { Theme };
