import React from "react";

// SVG
import Svg, { Defs, G, LinearGradient, Path, Stop } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone Spinner, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <Spinner
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type SpinnerProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const Spinner = ({ size = 24, tone = "tint", ...props }: SpinnerProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Defs>
        <LinearGradient id="grad" x1="50%" x2="50%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={theme.tokens[tone]} />
          <Stop offset="100%" stopColor={theme.tokens[tone]} stopOpacity={0.5} />
        </LinearGradient>
      </Defs>

      <G fill="none">
        <Path
          d="M8.749.021a1.5 1.5 0 0 1 .497 2.958A7.5 7.5 0 0 0 3 10.375a7.5 7.5 0 0 0 7.5 7.5v3c-5.799 0-10.5-4.7-10.5-10.5C0 5.23 3.726.865 8.749.021"
          fill="url(#grad)"
          transform="translate(1.5 1.625)"
        />
        <Path
          d="M15.392 2.673a1.5 1.5 0 0 1 2.119-.115A10.48 10.48 0 0 1 21 10.375c0 5.8-4.701 10.5-10.5 10.5v-3a7.5 7.5 0 0 0 5.007-13.084a1.5 1.5 0 0 1-.115-2.118"
          fill="url(#grad)"
          transform="translate(1.5 1.625)"
        />
      </G>
    </Svg>
  );
};
