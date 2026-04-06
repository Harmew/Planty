import React from "react";

// React Native
import {
  PressableStateCallbackType,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

// Components
import { PressableFeedback } from "./pressable-feedback";
import { Spinner } from "./spinner";
import { Typography } from "./typography";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

type Variant = "primary" | "secondary" | "card" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonContextValue = {
  /** Variante do botão */
  variant: Variant;
  /** Tamanho do botão */
  size: Size;
  /** Indica se o botão está desabilitado */
  disabled?: boolean;
  /** Indica se o botão é apenas um ícone */
  isIconOnly?: boolean;
};

type ButtonProps = PressableProps & {
  /**
   * Variante do botão
   * @default "primary"
   */
  variant?: Variant;
  /**
   * Tamanho do botão
   * @default "md"
   */
  size?: Size;
  /**
   * Indica se o botão está desabilitado
   * @default false
   */
  disabled?: boolean;
  /**
   * Estilo adicional para o botão
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Botão apenas com ícone
   * @default false
   */
  isIconOnly?: boolean;
  /**
   * Estado de loading
   * @default false
   */
  isLoading?: boolean;
};

const ButtonContext = React.createContext<ButtonContextValue | null>(null);

function useButton() {
  const ctx = React.useContext(ButtonContext);
  if (!ctx) throw new Error("Button.Label must be used inside Button");
  return ctx;
}

const ButtonRoot = ({
  children,
  variant = "primary",
  size = "md",
  disabled,
  isIconOnly = false,
  isLoading = false,
  style,
  ...rest
}: ButtonProps) => {
  const { styles, theme } = useTheme(createStyles);

  const finalIsIconOnly = isIconOnly || isLoading;

  const contextValue = React.useMemo(
    () => ({ variant, size, disabled, isIconOnly }),
    [variant, size, disabled, isIconOnly],
  );

  const backgroundColor = getBackgroundColor(theme.tokens, variant);

  return (
    <ButtonContext.Provider value={contextValue}>
      <PressableFeedback
        accessibilityRole="button"
        accessibilityLabel={finalIsIconOnly ? "Botão de ação" : undefined}
        disabled={disabled}
        isLoading={isLoading}
        style={[
          styles.base,
          styles[size],
          isIconOnly && styles.iconOnly,
          { backgroundColor, opacity: disabled ? 0.8 : 1 },
          style,
        ]}
        {...rest}
      >
        {(state) => {
          if (isLoading) {
            return <Spinner size={getSpinnerSize(size)} tone={getSpinnerColor(variant)} />;
          }

          const resolved = resolveChildren(children, state);

          if (typeof resolved === "string") {
            return <ButtonLabel>{resolved}</ButtonLabel>;
          }

          return resolved;
        }}
      </PressableFeedback>
    </ButtonContext.Provider>
  );
};

type ButtonLabelProps = {
  children: React.ReactNode;
};

const ButtonLabel = ({ children }: ButtonLabelProps) => {
  const { variant, size } = useButton();

  return (
    <Typography variant={getTextVariant(size)} tone={getTextTone(variant)} align="center">
      {children}
    </Typography>
  );
};

export const Button = Object.assign(ButtonRoot, {
  Label: ButtonLabel,
});

function resolveChildren(children: ButtonProps["children"], state: PressableStateCallbackType): React.ReactNode {
  return typeof children === "function" ? children(state) : children;
}

function getBackgroundColor(tokens: Theme["tokens"], variant: Variant) {
  switch (variant) {
    case "primary":
      return tokens.tint;
    case "secondary":
      return tokens.surface;
    case "card":
      return "white";
    case "ghost":
      return "transparent";
    case "danger":
      return tokens.error;
  }
}

function getTextTone(variant: Variant) {
  switch (variant) {
    case "primary":
      return "textOnTint";
    case "secondary":
      return "text";
    case "ghost":
      return "text";
    case "card":
      return "black";
    case "danger":
      return "textOnTint";
  }
}

function getTextVariant(size: Size) {
  switch (size) {
    case "sm":
      return "textSmall";
    case "md":
      return "text";
    case "lg":
      return "h3";
  }
}

function getSpinnerSize(size: Size) {
  switch (size) {
    case "sm":
      return 16;
    case "md":
      return 20;
    case "lg":
      return 24;
  }
}

function getSpinnerColor(variant: Variant): keyof Theme["tokens"] {
  switch (variant) {
    case "primary":
      return "textOnTint";
    case "secondary":
      return "tint";
    case "ghost":
      return "text";
    case "danger":
      return "textOnTint";
    case "card":
      return "background";
  }
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      borderRadius: theme.borderRadius.lg,
      borderCurve: "continuous",
      gap: theme.spacings.xs,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    wrapper: {
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.04,
      shadowRadius: 4,
    },
    iconOnly: {
      paddingHorizontal: 0,
      aspectRatio: 1,
      justifyContent: "center",
    },
    sm: {
      height: 36,
      paddingHorizontal: theme.spacings.sm,
    },
    md: {
      height: 48,
      paddingHorizontal: theme.spacings.md,
    },
    lg: {
      height: 56,
      paddingHorizontal: theme.spacings.lg,
    },
  });
