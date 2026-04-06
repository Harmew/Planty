import React from "react";

// React Native
import { StyleSheet, Text, type TextProps } from "react-native";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

type Variant = "display" | "h1" | "h2" | "h3" | "text" | "textSmall";

type Tone =
  | "text"
  | "textOnTint"
  | "textSecondary"
  | "tint"
  | "tintSecondary"
  | "error"
  | "success"
  | "warning"
  | "info"
  | "black";

type Decoration = "none" | "underline" | "line-through" | "underline line-through";

export type TypographyProps = TextProps & {
  flex?: number;
  variant?: Variant;
  tone?: Tone;
  align?: "left" | "center" | "right";
  decoration?: Decoration;
};

export const Typography = ({
  flex,
  variant = "text",
  tone = "text",
  align = "left",
  decoration = "none",
  style,
  children,
  ...props
}: TypographyProps) => {
  const { styles, theme } = useTheme(createStyles);

  const toneColor = getToneColor(theme.tokens, tone);

  return (
    <Text
      style={[
        styles[variant],
        {
          flex,
          color: toneColor,
          textAlign: align,
          textDecorationLine: decoration !== "none" ? decoration : undefined,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

function getToneColor(tokens: Theme["tokens"], tone: Tone) {
  switch (tone) {
    case "textOnTint":
      return tokens.textOnTint;
    case "tint":
      return tokens.tint;
    case "tintSecondary":
      return tokens.tintSecondary;
    case "textSecondary":
      return tokens.textSecondary;
    case "error":
      return tokens.error;
    case "success":
      return tokens.success;
    case "warning":
      return tokens.warning;
    case "info":
      return tokens.info;
    case "black":
      return tokens.black;
    default:
      return tokens.text;
  }
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    display: {
      fontSize: theme.fontSizes.xxxl,
      lineHeight: theme.lineHeights.xxxl,
      fontWeight: "bold",
      ...theme.fonts,
    },
    h1: {
      fontSize: theme.fontSizes.xxl,
      lineHeight: theme.lineHeights.xl,
      fontWeight: "bold",
      ...theme.fonts,
    },
    h2: {
      fontSize: theme.fontSizes.xl,
      lineHeight: theme.lineHeights.lg,
      fontWeight: "bold",
      ...theme.fonts,
    },
    h3: {
      fontSize: theme.fontSizes.lg,
      lineHeight: theme.lineHeights.md,
      fontWeight: "semibold",
      ...theme.fonts,
    },
    text: {
      fontSize: theme.fontSizes.md,
      lineHeight: theme.lineHeights.md,
      ...theme.fonts,
    },
    textSmall: {
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.lineHeights.sm,
      ...theme.fonts,
    },
  });
