import React from "react";

// Expo Router
import { Tabs } from "expo-router";

// Components
import { TabBar } from "@/components/layout";

// Hooks
import { useTheme } from "@/hooks/use-theme";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      initialRouteName="minhas-plantas"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: theme.tokens.background,
        },
      }}
    >
      <Tabs.Screen name="minhas-plantas" />
      <Tabs.Screen name="meus-cuidados" />
      <Tabs.Screen name="ajustes" />
    </Tabs>
  );
}
