import React from "react";

// Expo Router
import { Redirect } from "expo-router";

// Components
import { BootErrorScreen, BootingScreen } from "@/components/boot";

// Hooks
import { useInitialization } from "@/hooks/use-initialization";
import { useMinimumDelay } from "@/hooks/use-minimum-delay";

export default function Index() {
  const {
    state: { appReady, error, isOnboardingCompleted },
  } = useInitialization();

  // Segura splash até dar tempo
  const canNavigate = useMinimumDelay(appReady, 1800);

  // 1. Error
  if (error) {
    return <BootErrorScreen error={error} />;
  }

  // 2. Splash
  if (!canNavigate) {
    return <BootingScreen />;
  }

  // 3. Onboarding
  if (!isOnboardingCompleted) {
    return <Redirect href="/(onboarding)/bem-vindo" />;
  }

  // 4. App direto (sem login, sem conta)
  return <Redirect href="/(tabs)/minhas-plantas" />;
}
