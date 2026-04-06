import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone ChevronUp, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <ChevronUp
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type ChevronUpProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const ChevronUp = ({ size = 24, tone = "tint", ...props }: ChevronUpProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M18 15L12 9L6 15"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
