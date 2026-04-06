import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * Obtém o nome do aplicativo com base na variante atual.
 * @returns O nome do aplicativo.
 */
const getAppName = () => {
  if (process.env.APP_VARIANT === "development") {
    return "Planty (development)";
  }

  if (process.env.APP_VARIANT === "preview") {
    return "Planty (preview)";
  }

  return "Planty";
};

/**
 * Obtém o ícone do aplicativo com base na variante atual.
 * @returns O caminho para o ícone do aplicativo.
 */
const getAppIcon = () => {
  if (process.env.APP_VARIANT === "development") {
    return "./assets/images/icons/icon-development.png";
  }

  if (process.env.APP_VARIANT === "preview") {
    return "./assets/images/icons/icon-preview.png";
  }

  return "./assets/images/icons/icon.png";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "Planty",
  owner: "harmew",
  scheme: "planty",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  assetBundlePatterns: ["**/*"],
  icon: getAppIcon(),
  ios: {
    bundleIdentifier: "com.harmew.planty",
    supportsTablet: true,
    requireFullScreen: true,
    infoPlist: {
      UIBackgroundModes: ["remote-notification"],
      NSCameraUsageDescription: "Precisamos da câmera para tirar fotos das plantas.",
      NSPhotoLibraryUsageDescription: "Precisamos acessar suas fotos para adicionar imagens das plantas.",
      NSPhotoLibraryAddUsageDescription: "Salvar imagens das plantas.",
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: ["planty"],
        },
      ],
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "com.harmew.planty",
    allowBackup: false,
    permissions: [
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.POST_NOTIFICATIONS",
    ],
    adaptiveIcon: {
      backgroundColor: "#F6F6F6",
      foregroundImage: "./assets/images/icons/adaptive-icon.png",
    },
    softwareKeyboardLayoutMode: "pan",
    predictiveBackGestureEnabled: false,
    intentFilters: [
      {
        action: "VIEW",
        data: [
          {
            scheme: "planty",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  plugins: [
    "expo-sqlite",
    "expo-sharing",
    "expo-image",
    "expo-router",
    "expo-document-picker",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/icons/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#F6F6F6",
        dark: {
          backgroundColor: "#19191D",
        },
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/images/icons/notification-icon.png",
        color: "#F6F6F6",
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          enableProguardInReleaseBuilds: true,
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
        },
      },
    ],
  ],
  extra: {
    APP_VARIANT: process.env.APP_VARIANT,
    eas: {
      projectId: "...",
    },
  },
});
