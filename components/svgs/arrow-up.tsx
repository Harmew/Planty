import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone ArrowUp, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <ArrowUp
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type ArrowUpProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const ArrowUp = ({ size = 24, tone = "tint", ...props }: ArrowUpProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M5 12L12 5L19 12"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 19V5" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};
