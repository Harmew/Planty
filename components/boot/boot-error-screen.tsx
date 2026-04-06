import React from "react";

// React Native
import { StyleSheet, Text, View } from "react-native";

// Theme Constants (Not inside react for better performance)
import { Colors, FontSizes, LineHeights, Spacings } from "@/theme";

/**
 * Props for the BootErrorScreen component
 * @example
 * ```tsx
 * <BootErrorScreen error={error} />
 * ```
 */
type BootErrorScreenProps = {
  error?: Error | null;
};

export const BootErrorScreen = ({ error }: BootErrorScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Não foi possível iniciar o aplicativo</Text>
      <Text style={styles.text}>Ocorreu um problema durante a inicialização</Text>
      {error?.message ? <Text style={styles.error_text}>{error.message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacings.lg,
    gap: Spacings.md,
  },
  title: {
    textAlign: "center",
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.md,
    color: Colors.red500,
  },
  text: {
    textAlign: "center",
    fontSize: FontSizes.md,
    lineHeight: LineHeights.md,
    color: Colors.black,
  },
  error_text: {
    textAlign: "center",
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.sm,
    color: Colors.gray900,
  },
});
