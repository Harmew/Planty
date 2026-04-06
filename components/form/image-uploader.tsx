import React from "react";

// React Native
import { Alert, Platform, StyleSheet } from "react-native";

// React Native Reanimated
import Animated, { FadeIn } from "react-native-reanimated";

// Expo Image Picker
import type { ImagePickerAsset } from "expo-image-picker";

// Expo Image
import { Image, ImageSource } from "expo-image";

// SVGs
import { Icons } from "@/components/svgs";

// Components
import { Button, PressableFeedback, Row, Spinner, Typography } from "@/components/common";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

// Utils
import { pickMedia } from "@/utils";

export const getFilePath = (file: ImagePickerAsset): ImageSource | null => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object" && "uri" in file) return file;
  return null;
};

type ImageUploaderProps = {
  /**
   * The file to upload
   */
  file?: ImagePickerAsset | null | undefined;
  /**
   * Callback function when a file is selected
   * @param file The selected file
   * @returns void
   */
  onSelect: (file: ImagePickerAsset) => void;
  /**
   * Callback function when the file is cleared
   * @returns void
   */
  onClear: () => void;
  /**
   * Placeholder text for the uploader
   */
  placeholder?: string;
  /**
   * Indicates whether the uploaded file is invalid
   */
  isInvalid?: boolean;
};

export const ImageUploader = ({
  file = null,
  onSelect,
  onClear,
  placeholder = "Enviar imagem",
  isInvalid,
}: ImageUploaderProps) => {
  const { styles, theme } = useTheme(createStyles);

  const [isPickingMedia, setIsPickingMedia] = React.useState<boolean>(false);

  const pickImage = async () => {
    try {
      setTimeout(() => setIsPickingMedia(true), 300);
      await pickMedia(
        (asset) => {
          onSelect(asset);
          setIsPickingMedia(false);
        },
        () => {
          setIsPickingMedia(false);
        },
      );
    } catch (e) {
      Alert.alert("Ops", String(e));
    }
  };

  if (!file) {
    return (
      <Row
        as={PressableFeedback}
        align="center"
        justify="center"
        style={[
          styles.container,
          { borderColor: isPickingMedia ? theme.tokens.tint : isInvalid ? theme.tokens.error : theme.tokens.surface },
        ]}
        onPress={pickImage}
      >
        <Icons.CloudUpload tone="text" size={20} />
        <Typography>{placeholder}</Typography>
        {isPickingMedia && Platform.OS === "ios" && (
          <Animated.View entering={FadeIn} style={styles.loading_overlay}>
            <Spinner />
          </Animated.View>
        )}
      </Row>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={styles.image_container}>
      <Image source={getFilePath(file)} style={styles.image} contentFit="cover" transition={100} />
      <Button isIconOnly variant="danger" style={styles.delete_icon} onPress={onClear} size="sm">
        <Icons.Trash tone="textOnTint" size={20} />
      </Button>
    </Animated.View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      height: 56,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.tokens.surface,
      borderWidth: 1,
      borderCurve: "continuous",
    },
    image_container: {
      position: "relative",
      alignSelf: "center",
      width: 160,
      height: 160,
    },
    image: {
      borderRadius: theme.borderRadius.lg,
      flex: 1,
      borderCurve: "continuous",
    },
    delete_icon: {
      position: "absolute",
      right: -8,
      top: -8,
      zIndex: 10,
    },
    loading_overlay: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
      backgroundColor: theme.tokens.surface,
    },
  });
