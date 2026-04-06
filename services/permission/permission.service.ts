// React Native
import { Linking } from "react-native";

// Expo Image Picker
import * as ImagePicker from "expo-image-picker";

// Expo Notifications
import * as Notifications from "expo-notifications";

// Schemas
import { type Permissions, permissionsSchema } from "./permission.schema";

/**
 * Serviço para gerenciar permissões do aplicativo
 */
export class PermissionService {
  /**
   * Obtém todas as permissões do aplicativo
   * @returns Um objeto contendo o status de cada permissão
   */
  async getAll(): Promise<Permissions> {
    const notification = await Notifications.getPermissionsAsync();
    const camera = await ImagePicker.getCameraPermissionsAsync();
    const gallery = await ImagePicker.getMediaLibraryPermissionsAsync();

    return permissionsSchema.parse({
      notifications: notification.status,
      camera: camera.status,
      gallery: gallery.status,
    });
  }

  /**
   * Solicita permissão para enviar notificações
   * @returns Um booleano indicando se a permissão foi concedida
   */
  async requestNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  }

  /**
   * Solicita permissão para acessar a câmera
   * @returns Um booleano indicando se a permissão foi concedida
   */
  async requestCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === "granted";
  }

  /**
   * Solicita permissão para acessar a galeria
   * @returns Um booleano indicando se a permissão foi concedida
   */
  async requestGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  }

  /**
   * Abre as configurações do aplicativo
   */
  openSettings() {
    Linking.openSettings();
  }
}
