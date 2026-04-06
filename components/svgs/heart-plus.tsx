import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone HeartPlus, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <HeartPlus
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type HeartPlusProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const HeartPlus = ({ size = 24, tone = "tint", ...props }: HeartPlusProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M14.479 19.374L13.508 20.313C13.3217 20.527 13.0919 20.6989 12.834 20.8173C12.5762 20.9357 12.296 20.9978 12.0123 20.9996C11.7285 21.0014 11.4476 20.9428 11.1883 20.8277C10.9289 20.7126 10.697 20.5436 10.508 20.332L5 15C3.5 13.5 2 11.8 2 9.49998C2.00002 8.38718 2.33759 7.30056 2.96813 6.38364C3.59867 5.46672 4.49252 4.76264 5.53161 4.36438C6.5707 3.96612 7.70616 3.89242 8.78801 4.15302C9.86987 4.41362 10.8472 4.99626 11.591 5.82398C11.6434 5.87999 11.7067 5.92465 11.7771 5.95518C11.8474 5.98571 11.9233 6.00146 12 6.00146C12.0767 6.00146 12.1526 5.98571 12.2229 5.95518C12.2933 5.92465 12.3566 5.87999 12.409 5.82398C13.1504 4.99088 14.128 4.40335 15.2116 4.13958C16.2952 3.87581 17.4335 3.94833 18.4749 4.34746C19.5163 4.7466 20.4114 5.45343 21.0411 6.37388C21.6708 7.29433 22.0053 8.38474 22 9.49998C21.9997 10.0046 21.9259 10.5066 21.781 10.99"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M15 15H21" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18 12V18" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};
