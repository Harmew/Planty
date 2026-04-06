import React from "react";

// React Native
import { Platform, StyleSheet, View } from "react-native";

// Components
import { Button, ProgressLine, Typography } from "@/components/common";
import { ScreenWrapper } from "@/components/layout";

// Expo Router
import { useRouter } from "expo-router";

// Reanimated
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

// Services
import { useServices } from "@/services";

// SVGs
import { Icons } from "@/components/svgs";

// Safe Area View
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

const TudoCerto = () => {
  const { styles, theme } = useTheme(createStyles);
  const { bottom: marginBottom } = useSafeAreaInsets();
  const { onboarding } = useServices();
  const router = useRouter();

  const handleFinishOnboarding = () => {
    onboarding.complete();
    router.replace("/(tabs)/minhas-plantas");
  };

  return (
    <ScreenWrapper
      style={[
        styles.container,
        { marginBottom: Platform.OS === "ios" ? marginBottom : marginBottom + theme.spacings.lg },
      ]}
    >
      <ProgressLine maxWidth={150} percentage={100} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(40)}>
          <Typography variant="display" tone="tint">
            Tudo certo!
          </Typography>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80)}>
          <Icons.UndrawRelaxedReading style={{ alignSelf: "center" }} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120)}>
          <Typography>Seu aplicativo está configurado e pronto para uso</Typography>
        </Animated.View>
        <Animated.View entering={FadeInRight.delay(160)}>
          <Typography>Aproveite todas as funcionalidades e mantenha suas plantas sempre saudáveis!</Typography>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInRight.delay(200)}>
        <Button onPress={handleFinishOnboarding} style={{ alignSelf: "flex-end" }}>
          <Button.Label>Vamos lá</Button.Label>
          <Icons.ArrowRight tone="textOnTint" size={20} />
        </Button>
      </Animated.View>
    </ScreenWrapper>
  );
};

export default TudoCerto;

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
