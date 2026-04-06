// React Native Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Chave para armazenar o estado do onboarding
 */
const KEY = "@planty_onboarding_service_is_completed";

/**
 * Serviço de onboarding da aplicação
 * @description Responsável por gerenciar o estado do onboarding do usuário
 */
export class OnboardingService {
  /**
   * Verifica se o onboarding foi concluído
   * @returns Verdadeiro se o onboarding foi concluído, falso caso contrário
   */
  async isCompleted(): Promise<boolean> {
    const value = await AsyncStorage.getItem(KEY);
    return value === "true";
  }

  /**
   * Marca o onboarding como concluído
   */
  async complete(): Promise<void> {
    await AsyncStorage.setItem(KEY, "true");
  }
}
