import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone MinimalisticMagnifer, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <MinimalisticMagnifer
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type MinimalisticMagniferProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const MinimalisticMagnifer = ({ size = 24, tone = "tint", ...props }: MinimalisticMagniferProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
      />
      <Path d="M20 20L22 22" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
};
