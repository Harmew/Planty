import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone SquareTopDown, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <SquareTopDown
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type SquareTopDownProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const SquareTopDown = ({ size = 24, tone = "tint", ...props }: SquareTopDownProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M13 11L22 2M22 2H16.6562M22 2V7.34375"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};
