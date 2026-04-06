import React from "react";

// Expo Router
import { Stack } from "expo-router";

// Hooks
import { useTheme } from "@/hooks/use-theme";

export default function ModalsLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.tokens.background,
        },
      }}
    >
      <Stack.Screen name="adicionar-planta" />
      <Stack.Screen name="adicionar-cuidados" />
    </Stack>
  );
}
