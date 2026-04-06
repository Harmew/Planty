import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone CameraMinimalistic, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <CameraMinimalistic
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type CameraMinimalisticProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const CameraMinimalistic = ({ size = 24, tone = "tint", ...props }: CameraMinimalisticProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
      />
      <Path
        d="M10 19.9999H14C16.8089 19.9999 18.2134 19.9999 19.2223 19.3258C19.659 19.0339 20.034 18.6589 20.3259 18.2222C21 17.2133 21 15.8088 21 12.9999C21 10.191 20.9999 8.78674 20.3257 7.77784C20.0339 7.34108 19.6589 6.96608 19.2221 6.67424C18.2132 6.00012 16.8088 6.00012 13.9999 6.00012H9.99985C7.19093 6.00012 5.78646 6.00012 4.77757 6.67424C4.34081 6.96608 3.96581 7.34108 3.67397 7.77784C3 8.78651 3 10.1903 3 12.998V12.9999C3 15.8088 3 17.2133 3.67412 18.2222C3.96595 18.6589 4.34096 19.0339 4.77772 19.3258C5.78661 19.9999 7.19107 19.9999 10 19.9999Z"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
      />
      <Path d="M18 10H17.5" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M14.5 3.5H9.5" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
};
