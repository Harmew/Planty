import React from "react";

// Splash Screen
import * as SplashScreen from "expo-splash-screen";

// Expo Font
import * as Font from "expo-font";

// Icons
import { MaterialIcons } from "@expo/vector-icons";

// Services
import { initServices, useServices } from "@/services";

type INITIALIZATION_STATE = {
  appReady: boolean;
  isOnboardingCompleted: boolean;
  error: Error | null;
};

export const useInitialization = () => {
  const [state, setState] = React.useState<INITIALIZATION_STATE>({
    appReady: false,
    isOnboardingCompleted: false,
    error: null,
  });

  const { onboarding, permission } = useServices();

  const initializingRef = React.useRef(false);

  React.useEffect(() => {
    if (initializingRef.current) return;

    initializingRef.current = true;

    const bootstrap = async () => {
      try {
        /** Inicializa os serviços (fontes e serviços) */
        await Promise.all([
          Font.loadAsync({
            ...MaterialIcons.font,
          }),
          initServices(),
        ]);

        /** Inicializa o estado da aplicação */
        const isOnboardingCompleted = await onboarding.isCompleted();

        /** Oculta a Splash Screen */
        await SplashScreen.hideAsync().catch(() => {});

        /** Atualiza o estado da aplicação */
        setState({
          appReady: true,
          isOnboardingCompleted,
          error: null,
        });
      } catch (err) {
        const errorInstance = err instanceof Error ? err : new Error(String(err));
        setState((prev) => ({
          ...prev,
          appReady: true,
          error: errorInstance,
        }));

        await SplashScreen.hideAsync().catch(() => {});
      }
    };

    bootstrap();
  }, [onboarding, permission]);

  return {
    state,
  };
};
