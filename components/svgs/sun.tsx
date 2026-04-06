import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone Sun, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <Sun
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type SunProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const Sun = ({ size = 24, tone = "tint", ...props }: SunProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 2V4" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 20V22" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M4.92969 4.92999L6.33969 6.33999"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.6602 17.66L19.0702 19.07"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M2 12H4" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M20 12H22" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M6.33969 17.66L4.92969 19.07"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.0702 4.92999L17.6602 6.33999"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
