import React from "react";

// React Native
import { LayoutChangeEvent, StyleSheet, type TextInput, View } from "react-native";

// Hooks
import { Theme, useTheme } from "@/hooks/use-theme";

// Components
import { Input, InputProps } from "./input";

type ContextType = {
  prefixWidth: number;
  suffixWidth: number;
  setPrefixWidth: React.Dispatch<React.SetStateAction<number>>;
  setSuffixWidth: React.Dispatch<React.SetStateAction<number>>;
};

const InputGroupContext = React.createContext<ContextType | null>(null);

const useInputGroup = () => {
  const ctx = React.useContext(InputGroupContext);
  if (!ctx) throw new Error("useInputGroup must be used inside InputGroup");
  return ctx;
};

export const InputGroup = ({ children }: React.PropsWithChildren) => {
  const { styles } = useTheme(createStlyes);

  const [prefixWidth, setPrefixWidth] = React.useState(0);
  const [suffixWidth, setSuffixWidth] = React.useState(0);

  return (
    <InputGroupContext.Provider value={{ prefixWidth, suffixWidth, setPrefixWidth, setSuffixWidth }}>
      <View style={styles.container}>{children}</View>
    </InputGroupContext.Provider>
  );
};

const InputGroupPrefix = ({ children }: React.PropsWithChildren) => {
  const { styles } = useTheme(createStlyes);
  const { setPrefixWidth } = useInputGroup();

  const onLayout = (e: LayoutChangeEvent) => {
    setPrefixWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.prefix} onLayout={onLayout}>
      {children}
    </View>
  );
};

const InputGroupSuffix = ({ children }: React.PropsWithChildren) => {
  const { styles } = useTheme(createStlyes);
  const { setSuffixWidth } = useInputGroup();

  const onLayout = (e: LayoutChangeEvent) => {
    setSuffixWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.suffix} onLayout={onLayout}>
      {children}
    </View>
  );
};

const InputGroupInput = React.forwardRef<TextInput, InputProps>(({ style, ...props }, ref) => {
  const { prefixWidth, suffixWidth } = useInputGroup();
  const { theme } = useTheme();

  return (
    <Input
      ref={ref}
      style={[
        {
          paddingLeft: prefixWidth ? prefixWidth + theme.spacings.md : 0,
          paddingRight: suffixWidth ? suffixWidth + theme.spacings.md : 0,
          zIndex: 0,
        },
        style,
      ]}
      {...props}
    />
  );
});

InputGroupInput.displayName = "InputGroup.Input";

InputGroup.Prefix = InputGroupPrefix;
InputGroup.Suffix = InputGroupSuffix;
InputGroup.Input = InputGroupInput;

const createStlyes = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: "relative",
      justifyContent: "center",
    },
    prefix: {
      position: "absolute",
      left: theme.spacings.sm,
      height: "100%",
      justifyContent: "center",
      zIndex: 1,
    },
    suffix: {
      position: "absolute",
      right: theme.spacings.sm,
      height: "100%",
      justifyContent: "center",
      zIndex: 1,
    },
  });
