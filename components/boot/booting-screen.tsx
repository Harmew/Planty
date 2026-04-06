import React from "react";

// React Native
import { StyleSheet, View } from "react-native";

// SVGs
import { Icons } from "../svgs";

/**
 * @example
 * ```tsx
 * <BootingScreen />
 * ```
 */
export const BootingScreen = () => {
  return (
    <View style={styles.container}>
      <Icons.PlantIntro size={150} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
