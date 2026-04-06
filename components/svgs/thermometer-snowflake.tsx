import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone ThermometerSnowflake, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <ThermometerSnowflake
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type ThermometerSnowflakeProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const ThermometerSnowflake = ({ size = 24, tone = "tint", ...props }: ThermometerSnowflakeProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M10 20L8.75 17.5L6 18"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 4L8.75 6.5L6 6"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.585 15H10"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 12H8.5L10 9"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 14.54C20.7626 14.9803 21.3586 15.6599 21.6955 16.4734C22.0325 17.2869 22.0916 18.1888 21.8637 19.0394C21.6358 19.8899 21.1336 20.6415 20.435 21.1775C19.7365 21.7136 18.8805 22.0041 18 22.0041C17.1195 22.0041 16.2635 21.7136 15.565 21.1775C14.8664 20.6415 14.3642 19.8899 14.1363 19.0394C13.9084 18.1888 13.9675 17.2869 14.3045 16.4734C14.6415 15.6599 15.2374 14.9803 16 14.54V4C16 3.46957 16.2107 2.96086 16.5858 2.58579C16.9609 2.21071 17.4696 2 18 2C18.5304 2 19.0391 2.21071 19.4142 2.58579C19.7893 2.96086 20 3.46957 20 4V14.54Z"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 10L5.5 12L4 14"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 21L10 15L8.5 12"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 3L10 9H12"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
