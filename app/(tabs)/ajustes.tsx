import React from "react";

// React Native
import { Alert, Pressable, ScrollView } from "react-native";

// Reanimated
import Animated, { FadeInDown } from "react-native-reanimated";

// Expo Application
import * as Application from "expo-application";

// Services
import { useServices } from "@/services";

// Components
import { Row, Spinner, Surface, Typography } from "@/components/common";
import { ScreenWrapper } from "@/components/layout";

// SVGs
import { Icons } from "@/components/svgs";

// Hooks
import { useTheme } from "@/hooks/use-theme";

type ItemProps = {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  isLoading?: boolean;
};

const Item = ({ icon, label, right, onPress, isLoading }: ItemProps) => (
  <Row as={onPress ? Pressable : undefined} disabled={isLoading} onPress={onPress} justify="space-between">
    <Row flex={1}>
      {icon}
      <Typography flex={1} numberOfLines={1}>
        {label}
      </Typography>
    </Row>
    {isLoading ? <Spinner size={20} /> : right}
  </Row>
);

const appVersion = Application.nativeApplicationVersion || "??";
const buildNumber = Application.nativeBuildVersion || "??";

const Ajustes = () => {
  const { theme, scheme } = useTheme();
  const { storage, permission } = useServices();

  const [exporting, setExporting] = React.useState<boolean>(false);
  const [importing, setImporting] = React.useState<boolean>(false);

  const exportData = React.useCallback(async () => {
    try {
      if (exporting) return;
      setExporting(true);
      await storage.exportData();
      setExporting(false);
    } catch (error: any) {
      setExporting(false);
      Alert.alert("Algo deu errado", error.message ?? "Ocorreu um erro inesperado", [{ text: "Entendi" }], {
        cancelable: false,
        userInterfaceStyle: scheme,
      });
    }
  }, [storage, scheme, exporting]);

  const importData = React.useCallback(async () => {
    try {
      if (importing) return;
      setImporting(true);
      const result = await storage.importData();
      setImporting(false);

      if (!result) return;

      Alert.alert("Importação concluída", "Os dados foram importados com sucesso", [{ text: "Entendi" }], {
        cancelable: false,
        userInterfaceStyle: scheme,
      });
    } catch (error: any) {
      setImporting(false);
      Alert.alert("Algo deu errado", error.message ?? "Ocorreu um erro inesperado", [{ text: "Entendi" }], {
        cancelable: false,
        userInterfaceStyle: scheme,
      });
    }
  }, [storage, scheme, importing]);

  const openAppSettings = async () => {
    try {
      await permission.openSettings();
    } catch {}
  };

  return (
    <ScreenWrapper
      as={ScrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: theme.spacings.lg, marginHorizontal: theme.spacings.xl }}
    >
      <Animated.View entering={FadeInDown.delay(40)}>
        <Typography variant="h1">Ajustes</Typography>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80)}>
        <Surface>
          <Item
            icon={<Icons.Bell tone="text" />}
            label="Notificações"
            right={<Icons.ChevronRight tone="textSecondary" />}
            onPress={openAppSettings}
          />

          <Item
            icon={<Icons.CameraMinimalistic tone="text" />}
            label="Câmera"
            right={<Icons.ChevronRight tone="textSecondary" />}
            onPress={openAppSettings}
          />

          <Item
            icon={<Icons.Gallery tone="text" />}
            label="Galeria"
            right={<Icons.ChevronRight tone="textSecondary" />}
            onPress={openAppSettings}
          />
        </Surface>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120)}>
        <Surface>
          <Item
            icon={<Icons.SquareTopUp tone="text" />}
            label="Importar Dados"
            isLoading={importing}
            right={<Icons.ChevronRight tone="textSecondary" />}
            onPress={importData}
          />
          <Item
            icon={<Icons.SquareTopDown tone="text" />}
            label="Exportar Dados"
            isLoading={exporting}
            right={<Icons.ChevronRight tone="textSecondary" />}
            onPress={exportData}
          />
        </Surface>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160)}>
        <Surface>
          <Item icon={<Icons.CPU tone="text" />} label={`Versão do Aplicativo ${appVersion} - ${buildNumber}`} />
        </Surface>
      </Animated.View>
    </ScreenWrapper>
  );
};

export default Ajustes;
