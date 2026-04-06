import React from "react";

// React Native Reanimated
import "react-native-reanimated";

// React Native Screens
import { enableScreens } from "react-native-screens";

// Expo System UI
import * as SystemUI from "expo-system-ui";

// Expo Router
import { Stack } from "expo-router";

// React Native
import { Platform } from "react-native";

// Expo Constants
import Constants from "expo-constants";

// React Native Safe Area Context
import { SafeAreaProvider } from "react-native-safe-area-context";

// Keyboard Controller
import { KeyboardProvider } from "react-native-keyboard-controller";

// React Native Gesture Handler
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Splash Screen
import * as SplashScreen from "expo-splash-screen";

// Services
import { ServicesProvider } from "@/services";

// Hooks
import { useAndroidBackHandler } from "@/hooks/use-android-back-handler";
import { useTheme } from "@/hooks/use-theme";

// Se estiver em desenvolvimento, ativa o Reactotron
if (Constants.expoConfig?.extra?.APP_VARIANT === "development") {
  import("../reactotron");
}

/**
 * Previne o auto-hide da SplashScreen até que a aplicação esteja pronta
 */
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Habilita as telas nativas para melhorar a performance da navegação
 */
enableScreens(true);

function Layout() {
  const { theme } = useTheme();
  useAndroidBackHandler();

  React.useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.tokens.background);
  }, [theme.tokens.background]);

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.tokens.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="notificacoes" />
      <Stack.Screen name="minha-planta" />
      <Stack.Screen name="historico-planta" />
      <Stack.Screen
        name="(modals)"
        options={{
          presentation: Platform.OS === "ios" ? "modal" : undefined,
        }}
      />
    </Stack>
  );
}

/**
 * Layout principal da aplicação
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
            <ServicesProvider>
              <Layout />
            </ServicesProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
