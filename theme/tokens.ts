import { Colors } from "./colors";

/**
 * Light Theme
 */
const LightTheme = {
  tint: Colors.green500,
  tintSecondary: Colors.green600,

  background: Colors.gray100,
  backgroundSecondary: Colors.gray300,

  overlay: Colors.black + "80",

  surface: Colors.white,
  surfaceDisabled: Colors.gray300,

  text: Colors.textLight,
  textOnTint: Colors.textOnTint,
  textSecondary: Colors.gray500,

  tabBackground: Colors.white,
  tabIconDefault: Colors.textLight,
  tabIconSelected: Colors.green500,

  error: Colors.red500,
  info: Colors.blue500,
  warning: Colors.orange500,
  success: Colors.green600,

  white: Colors.white,
  black: Colors.black,
} as const;

/**
 * Dark Theme
 */
const DarkTheme = {
  tint: Colors.green500,
  tintSecondary: Colors.green600,

  background: Colors.gray900,
  backgroundSecondary: Colors.gray700,

  overlay: Colors.black + "90",

  surface: Colors.gray800,
  surfaceDisabled: Colors.gray700,

  text: Colors.textDark,
  textOnTint: Colors.textOnTint,
  textSecondary: Colors.gray500,

  tabBackground: Colors.gray800,
  tabIconDefault: Colors.textDark,
  tabIconSelected: Colors.green500,

  error: Colors.red500,
  info: Colors.blue500,
  warning: Colors.orange500,
  success: Colors.green600,

  white: Colors.white,
  black: Colors.black,
} as const;

export const Scheme = {
  light: LightTheme,
  dark: DarkTheme,
};
