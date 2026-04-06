import React from "react";

// React Native
import { StyleSheet, TextInput, type TextInputProps } from "react-native";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

// Context
import { useTextField } from "./text-field";

type Variant = "primary" | "outlined";

export type InputProps = TextInputProps & {
  /**
   * Variantes do campo de entrada
   * @default "primary"
   */
  variant?: Variant;
  /**
   * Indica se o campo de entrada é inválido
   * @default false
   */
  isInvalid?: boolean;
  /**
   * Indica se o campo de entrada está desabilitado
   * @default false
   */
  isDisabled?: boolean;
};

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    { variant = "primary", isInvalid: localInvalid, isDisabled: localDisabled, style, onFocus, onBlur, ...rest },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const { styles, theme } = useTheme(createStyles);

    const { isDisabled: contextIsDisabled, isInvalid: contextIsInvalid } = useTextField();

    // prioridade: prop > context
    const isInvalid = localInvalid ?? contextIsInvalid ?? false;
    const isDisabled = localDisabled ?? contextIsDisabled ?? false;

    const backgroundColor = variant === "outlined" ? theme.tokens.background : theme.tokens.surface;
    const borderColor = isInvalid ? theme.tokens.error : isFocused ? theme.tokens.tint : theme.tokens.background;

    return (
      <TextInput
        ref={ref}
        editable={!isDisabled}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        placeholderTextColor={theme.tokens.textSecondary}
        selectionColor={isInvalid ? theme.tokens.error : theme.tokens.tint}
        style={[styles.base, { backgroundColor, borderColor, opacity: isDisabled ? 0.6 : 1 }, style]}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      height: 56,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      borderCurve: "continuous",
      paddingHorizontal: theme.spacings.sm,
      fontSize: theme.fontSizes.md,
      color: theme.tokens.text,
    },
  });
