import React, { forwardRef, useMemo } from "react";

// React Native
import { View, type ViewProps } from "react-native";

// Hooks
import { useTheme } from "@/hooks/use-theme";

type TextFieldContextValue = {
  /**
   * Whether the entire text field is disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the text field is in an invalid state
   * @default false
   */
  isInvalid?: boolean;
  /**
   * Whether the text field is required (shows asterisk in label)
   * @default false
   */
  isRequired?: boolean;
};

const TextFieldContext = React.createContext<TextFieldContextValue | null>(null);

export function useTextField() {
  const ctx = React.useContext(TextFieldContext);
  if (!ctx) throw new Error("useTextField must be used inside TextField");
  return ctx;
}

type TextFieldProps = ViewProps & {
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
};

const TextFieldRoot = forwardRef<View, TextFieldProps>(
  ({ children, isDisabled = false, isInvalid = false, isRequired = false, style, ...rest }, ref) => {
    const { theme } = useTheme();

    const contextValue = useMemo(
      () => ({
        isDisabled,
        isInvalid,
        isRequired,
      }),
      [isDisabled, isInvalid, isRequired],
    );

    return (
      <TextFieldContext.Provider value={contextValue}>
        <View ref={ref} style={[{ gap: theme.spacings.xs, opacity: isDisabled ? 0.6 : 1 }, style]} {...rest}>
          {children}
        </View>
      </TextFieldContext.Provider>
    );
  },
);

TextFieldRoot.displayName = "TextField";

export const TextField = TextFieldRoot;
