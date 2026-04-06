import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone CPU, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <CPU
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type CPUProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const CPU = ({ size = 24, tone = "tint", ...props }: CPUProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M7 10C7 8.58579 7 7.87868 7.43934 7.43934C7.87868 7 8.58579 7 10 7H14C15.4142 7 16.1213 7 16.5607 7.43934C17 7.87868 17 8.58579 17 10V14C17 15.4142 17 16.1213 16.5607 16.5607C16.1213 17 15.4142 17 14 17H10C8.58579 17 7.87868 17 7.43934 16.5607C7 16.1213 7 15.4142 7 14V10Z"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
      />
      <Path
        d="M4 12C4 8.22876 4 6.34315 5.17157 5.17157C6.34315 4 8.22876 4 12 4C15.7712 4 17.6569 4 18.8284 5.17157C20 6.34315 20 8.22876 20 12C20 15.7712 20 17.6569 18.8284 18.8284C17.6569 20 15.7712 20 12 20C8.22876 20 6.34315 20 5.17157 18.8284C4 17.6569 4 15.7712 4 12Z"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
      />
      <Path d="M4 12H2" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M22 12H20" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M4 9H2" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M22 9H20" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M4 15H2" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M22 15H20" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 20V22" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 2V4" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M9 20V22" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M9 2V4" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M15 20V22" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M15 2V4" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
};
