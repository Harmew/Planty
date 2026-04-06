import React from "react";

// React Native
import { Alert, Platform, StyleSheet, View } from "react-native";

// Expo Router
import { useRouter } from "expo-router";

// Reanimated
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

// Components
import { Button, ProgressLine, Row, Surface, Typography } from "@/components/common";
import { Switch } from "@/components/form";
import { ScreenWrapper } from "@/components/layout";

// SVGs
import { Icons } from "@/components/svgs";

// Safe Area Context
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

// Services
import { useServices } from "@/services";

// Tipos
import type { Permissions } from "@/services/permission/permission.schema";

const Permissoes = () => {
  const { styles, theme, scheme } = useTheme(createStyles);
  const { bottom: marginBottom } = useSafeAreaInsets();
  const { permission } = useServices();
  const router = useRouter();

  const [permissions, setPermissions] = React.useState<Permissions>({
    notifications: "undetermined",
    camera: "undetermined",
    gallery: "undetermined",
  });

  const fetchPermissions = React.useCallback(async () => {
    const result = await permission.getAll();
    setPermissions(result);
  }, [permission]);

  React.useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Função para solicitar permissão específica
  const requestPermission = async (key: keyof Permissions) => {
    let granted = false;

    if (key === "notifications") granted = await permission.requestNotifications();
    if (key === "camera") granted = await permission.requestCamera();
    if (key === "gallery") granted = await permission.requestGallery();

    // Atualiza estado
    setPermissions((prev) => ({
      ...prev,
      [key]: granted ? "granted" : "denied",
    }));
  };

  const openAppSettings = async () => {
    try {
      await permission.getAll();
    } catch {}
  };

  const handleContinue = () => {
    if (
      permissions.camera === "granted" &&
      permissions.notifications === "granted" &&
      permissions.gallery === "granted"
    ) {
      router.replace("/(onboarding)/tudo-certo");
    } else {
      Alert.alert(
        "Por favor",
        "As permissões são necessárias para usar este aplicativo",
        [{ text: "Ajustes", onPress: () => openAppSettings() }],
        {
          cancelable: false,
          userInterfaceStyle: scheme,
        },
      );
    }
  };

  return (
    <ScreenWrapper
      style={[
        styles.container,
        { marginBottom: Platform.OS === "ios" ? marginBottom : marginBottom + theme.spacings.lg },
      ]}
    >
      <ProgressLine maxWidth={150} percentage={66} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(40)}>
          <Typography variant="display" tone="tint">
            Precisamos da{"\n"}sua permissão
          </Typography>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80)}>
          <Typography>
            Para que o app funcione corretamente, precisamos acessar algumas funcionalidades do seu dispositivo, como
            notificações e armazenamento
          </Typography>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120)}>
          <Typography>Não se preocupe, só vamos usar o que for realmente necessário</Typography>
        </Animated.View>

        {/* Notificações */}
        <Animated.View entering={FadeInDown.delay(160)}>
          <Surface>
            <Row justify="space-between">
              <Row flex={1}>
                <Icons.Bell tone="text" />
                <Typography flex={1} numberOfLines={1}>
                  Notificacoes
                </Typography>
              </Row>
              <Switch
                isSelected={permissions.notifications === "granted"}
                onSelectedChange={async () => await requestPermission("notifications")}
              />
            </Row>
          </Surface>
        </Animated.View>

        {/* Câmera */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <Surface>
            <Row justify="space-between">
              <Row flex={1}>
                <Icons.CameraMinimalistic tone="text" />
                <Typography flex={1} numberOfLines={1}>
                  Câmera
                </Typography>
              </Row>
              <Switch
                isSelected={permissions.camera === "granted"}
                onSelectedChange={async () => await requestPermission("camera")}
              />
            </Row>
          </Surface>
        </Animated.View>

        {/* Galeria */}
        <Animated.View entering={FadeInDown.delay(240)}>
          <Surface>
            <Row justify="space-between">
              <Row flex={1}>
                <Icons.Gallery tone="text" />
                <Typography flex={1} numberOfLines={1}>
                  Galeria
                </Typography>
              </Row>
              <Switch
                isSelected={permissions.gallery === "granted"}
                onSelectedChange={async () => await requestPermission("gallery")}
              />
            </Row>
          </Surface>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInRight.delay(280)}>
        <Button onPress={handleContinue} style={{ alignSelf: "flex-end" }}>
          <Button.Label>Continuar</Button.Label>
          <Icons.ArrowRight tone="textOnTint" size={20} />
        </Button>
      </Animated.View>
    </ScreenWrapper>
  );
};

export default Permissoes;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacings.lg,
      marginHorizontal: theme.spacings.xl,
    },
    content: {
      flex: 1,
      gap: theme.spacings.xl,
      justifyContent: "center",
    },
  });
