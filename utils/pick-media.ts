// Expo Image Picker
import * as ImagePicker from "expo-image-picker";

/** Picker function for react compiler */
export const pickMedia = async (
  onSuccess: (asset: ImagePicker.ImagePickerAsset) => void,
  onError: (e: unknown) => void,
) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") throw new Error("Permissão negada");

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    shouldDownloadFromNetwork: true, // This is for iOS to download the original image from iCloud if it's not stored locally -- only work on expo 55 or above
    presentationStyle: ImagePicker.UIImagePickerPresentationStyle.CURRENT_CONTEXT,
  });

  if (result.canceled) {
    onError("Usuário cancelou a seleção de imagem.");
    return;
  }

  onSuccess(result.assets[0]);
};
