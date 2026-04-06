import React from "react";

// React Native
import { Platform, StyleSheet, View } from "react-native";

// Components
import { Button, ProgressLine, Typography } from "@/components/common";
import { ScreenWrapper } from "@/components/layout";

// Reanimated
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

// SVGs
import { Icons } from "@/components/svgs";

// Safe Area View
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Expo Router
import { Link } from "expo-router";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

const BemVindo = () => {
  const { styles, theme } = useTheme(createStyles);
  const { bottom: marginBottom } = useSafeAreaInsets();

  return (
    <ScreenWrapper
      style={[
        styles.container,
        { marginBottom: Platform.OS === "ios" ? marginBottom : marginBottom + theme.spacings.lg },
      ]}
    >
      <ProgressLine maxWidth={150} percentage={33} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(40)}>
          <Typography variant="display" tone="tint">
            Bem-vindo ao{"\n"}Planty
          </Typography>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80)}>
          <Icons.UndrawWelcoming style={{ alignSelf: "center" }} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120)}>
          <Typography>
            Descubra uma forma simples e divertida de cuidar das suas plantas e acompanhar suas tarefas diárias. Vamos
            começar essa jornada juntos!
          </Typography>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInRight.delay(160)}>
        <Link replace href={"/(onboarding)/permissoes"} asChild style={{ alignSelf: "flex-end" }}>
          <Button>
            <Button.Label>Continuar</Button.Label>
            <Icons.ArrowRight tone="textOnTint" size={20} />
          </Button>
        </Link>
      </Animated.View>
    </ScreenWrapper>
  );
};

export default BemVindo;

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
