import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone CloudDrizzle, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <CloudDrizzle
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type CloudDrizzleProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const CloudDrizzle = ({ size = 24, tone = "tint", ...props }: CloudDrizzleProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M4.00034 14.899C3.25738 14.1399 2.69691 13.2217 2.36137 12.2139C2.02584 11.2062 1.92405 10.1352 2.0637 9.0823C2.20335 8.02935 2.5808 7.022 3.16743 6.13653C3.75407 5.25107 4.53452 4.51071 5.44967 3.97155C6.36482 3.43238 7.39067 3.10855 8.44951 3.02458C9.50835 2.9406 10.5724 3.09868 11.5611 3.48686C12.5498 3.87503 13.4372 4.48311 14.1561 5.26503C14.8749 6.04696 15.4065 6.98223 15.7103 8H17.5003C18.4659 7.99989 19.4058 8.31032 20.1813 8.88544C20.9569 9.46056 21.5269 10.2699 21.8071 11.1938C22.0874 12.1177 22.063 13.1073 21.7377 14.0164C21.4123 14.9254 20.8032 15.7057 20.0003 16.242"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M8 19V20" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 14V15" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 19V20" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 14V15" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 21V22" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 16V17" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};
