import React from "react";

// SVG
import { Path, Svg } from "react-native-svg";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

/**
 * Propiedades do ícone CloudUpload, baseado na paleta de cores do tema.
 * @example
 * ```tsx
 * <CloudUpload
 *   size={24}
 *   tone="tint"
 * />
 * ```
 */
export type CloudUploadProps = React.ComponentProps<typeof Svg> & {
  /** Tamanho do ícone */
  size?: number;
  /** Tom do ícone, baseado na paleta de cores do tema */
  tone?: keyof Theme["tokens"];
};

export const CloudUpload = ({ size = 24, tone = "tint", ...props }: CloudUploadProps) => {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path d="M12 13V21" stroke={theme.tokens[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M3.99985 14.899C3.25689 14.1399 2.69642 13.2217 2.36089 12.2139C2.02535 11.2062 1.92356 10.1352 2.06321 9.0823C2.20287 8.02936 2.58031 7.022 3.16695 6.13654C3.75358 5.25107 4.53403 4.51072 5.44918 3.97155C6.36433 3.43239 7.39018 3.10855 8.44902 3.02458C9.50786 2.9406 10.5719 3.09869 11.5606 3.48686C12.5493 3.87503 13.4367 4.48311 14.1556 5.26504C14.8745 6.04696 15.406 6.98223 15.7099 8H17.4999C18.4654 7.99989 19.4053 8.31032 20.1808 8.88544C20.9564 9.46056 21.5264 10.2699 21.8066 11.1938C22.0869 12.1177 22.0625 13.1073 21.7372 14.0164C21.4118 14.9254 20.8027 15.7057 19.9999 16.242"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 17L12 13L16 17"
        stroke={theme.tokens[tone]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
