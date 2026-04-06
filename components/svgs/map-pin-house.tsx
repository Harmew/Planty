import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone MapPinHouse, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <MapPinHouse
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type MapPinHouseProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const MapPinHouse = ({ size = 24, tone = "tint", ...props }: MapPinHouseProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M15 22C14.7348 22 14.4804 21.8946 14.2929 21.7071C14.1054 21.5196 14 21.2652 14 21V17C14 16.8354 14.0406 16.6734 14.1182 16.5282C14.1958 16.3831 14.3081 16.2593 14.445 16.168L17.445 14.168C17.6093 14.0584 17.8025 13.9999 18 13.9999C18.1975 13.9999 18.3907 14.0584 18.555 14.168L21.555 16.168C21.6919 16.2593 21.8042 16.3831 21.8818 16.5282C21.9594 16.6734 22 16.8354 22 17V21C22 21.2652 21.8946 21.5196 21.7071 21.7071C21.5196 21.8946 21.2652 22 21 22H15Z"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 14.993 7.539 20.193 9.399 21.799C9.57237 21.929 9.78329 21.9992 10 21.999"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M18 22V19" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
