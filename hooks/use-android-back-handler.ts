import React from "react";

// React Native
import { BackHandler, Platform, ToastAndroid } from "react-native";

// Expo Router
import { usePathname, useRouter } from "expo-router";

/**
 * Hook para gerenciar o comportamento do botão de voltar no Android.
 * - Se puder voltar na navegação, volta para a tela anterior.
 * - Se estiver na tela inicial (tabs/home), sai do aplicativo.
 * - Em qualquer outro caso, ignora o evento (comportamento padrão).
 */
export function useAndroidBackHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const lastPress = React.useRef(0);

  React.useEffect(() => {
    if (Platform.OS !== "android") return;

    const backAction = () => {
      // Se puder voltar na pilha, volta normalmente
      if (router.canGoBack()) {
        router.back();
        return true;
      }

      // Se está na tela inicial (ex: /(tabs)/minhas-plantas)
      if (pathname === "/minhas-plantas") {
        const now = Date.now();
        if (now - lastPress.current < 2000) {
          BackHandler.exitApp(); // Sai do app
        } else {
          lastPress.current = now;
          ToastAndroid.show("Pressione novamente para sair", ToastAndroid.SHORT);
        }
        return true;
      }

      // Para outras abas, mantém comportamento padrão
      return false;
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => subscription.remove();
  }, [router, pathname]);
}
