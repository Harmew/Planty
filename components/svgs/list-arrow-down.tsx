import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone ListArrowDown, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <ListArrowDown
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type ListArrowDownProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const ListArrowDown = ({ size = 24, tone = "tint", ...props }: ListArrowDownProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M15 17.5L17.5 20M17.5 20L20 17.5M17.5 20V14"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M21 6H3" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M21 10H3" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M11 14H3" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M11 18H3" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
};
