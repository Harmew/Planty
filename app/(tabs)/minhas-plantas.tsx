import React from "react";

// React Native
import { FlatList, View } from "react-native";

// Components
import { Button, PressableFeedback, Row, Surface, Typography } from "@/components/common";
import { ScreenWrapper, TAB_BAR_HEIGHT } from "@/components/layout";

// Safe Area Context
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Reanimated
import Animated, { FadeInDown } from "react-native-reanimated";

// Expo Router
import { useRouter } from "expo-router";

// Expo Image
import { Image } from "expo-image";

// SVGs
import { Icons } from "@/components/svgs";

// Hooks
import { useTheme } from "@/hooks/use-theme";

// Store
import { usePlantStore } from "@/stores/use-plant-store";

// Schemas
import type { Plant } from "@/services/plant/plant.schema";

type ItemProps = { item: Plant; onPress: (id: number) => void; index: number };

const Item = React.memo(
  ({ item, onPress, index }: ItemProps) => {
    const { theme } = useTheme();

    return (
      <Animated.View entering={FadeInDown.delay(Math.min(160 + index * 40, 480))}>
        <Surface as={PressableFeedback} onPress={() => onPress(item.id)} style={{ padding: theme.spacings.sm }}>
          <Row align="center">
            <Image
              source={item.image ? { uri: item.image } : undefined}
              placeholder={require("@/assets/images/placeholder.png")}
              style={{
                width: 80,
                height: 80,
                borderRadius: theme.borderRadius.md,
                // @ts-expect-error - borderCurve is not a valid style property types but in render has available
                borderCurve: "continuous",
              }}
              contentFit="cover"
            />

            <View style={{ flex: 1 }}>
              <Typography numberOfLines={1} variant="h3">
                {item.name}
              </Typography>
              <Typography numberOfLines={1} variant="textSmall" tone="textSecondary">
                {item.location}
              </Typography>
            </View>
          </Row>
        </Surface>
      </Animated.View>
    );
  },
  (prev, next) => {
    return (
      prev.item.id === next.item.id &&
      prev.item.name === next.item.name &&
      prev.item.image === next.item.image &&
      prev.item.location === next.item.location
    );
  },
);

Item.displayName = "Item";

const ListHeader = React.memo(() => {
  const router = useRouter();

  const openNotifications = React.useCallback(() => {
    router.push("/notificacoes");
  }, [router]);

  return (
    <Animated.View entering={FadeInDown.delay(40)}>
      <Row align="center" flex={1} justify="space-between">
        <Typography variant="h1">Minhas Plantas</Typography>
        <Button isIconOnly variant="secondary" size="sm" onPress={openNotifications}>
          <Icons.Bell tone="text" />
        </Button>
      </Row>
    </Animated.View>
  );
});

ListHeader.displayName = "ListHeader";

const ListEmpty = React.memo(() => {
  const router = useRouter();

  const openAddPlant = React.useCallback(() => {
    router.push("/(modals)/adicionar-planta");
  }, [router]);

  return (
    <Animated.View entering={FadeInDown.delay(120)}>
      <Surface style={{ flex: 1 }}>
        <Icons.Leaf style={{ alignSelf: "center" }} />
        <Typography align="center">Você ainda não tem plantas</Typography>
        <Typography align="center" variant="textSmall" tone="textSecondary">
          Vamos começar adicionando a sua primeira planta e acompanhar os cuidados dela?
        </Typography>
        <Button size="sm" style={{ alignSelf: "center" }} onPress={openAddPlant}>
          <Icons.Plus size={20} tone="textOnTint" />
          <Button.Label>Adicionar</Button.Label>
        </Button>
      </Surface>
    </Animated.View>
  );
});

ListEmpty.displayName = "ListEmpty";

const ListFooter = React.memo(() => {
  const plantsCount = usePlantStore((state) => state.plants.length);
  const router = useRouter();

  const handlePress = React.useCallback(() => {
    router.push("/(modals)/adicionar-planta");
  }, [router]);

  return (
    <Animated.View entering={FadeInDown.delay(80)}>
      {plantsCount > 0 ? (
        <Button size="sm" variant="secondary" onPress={handlePress}>
          <Icons.Plus size={20} tone="text" />
          <Button.Label>Adicionar planta</Button.Label>
        </Button>
      ) : null}
    </Animated.View>
  );
});

ListFooter.displayName = "ListFooter";

const MinhasPlantas = () => {
  const plants = usePlantStore((state) => state.plants);

  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();
  const router = useRouter();

  const openDetails = React.useCallback(
    (id: number) => router.push({ pathname: "/minha-planta", params: { id } }),
    [router],
  );

  const renderItem = React.useCallback(
    ({ item, index }: { item: Plant; index: number }) => <Item item={item} index={index} onPress={openDetails} />,
    [openDetails],
  );

  return (
    <ScreenWrapper
      as={FlatList<Plant>}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: theme.spacings.lg,
        marginHorizontal: theme.spacings.xl,
        paddingBottom: TAB_BAR_HEIGHT + bottom + theme.spacings.xl,
      }}
      // Data
      data={plants}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      // Layout
      removeClippedSubviews={false}
      // Extra Components
      ListHeaderComponent={<ListHeader />}
      ListEmptyComponent={<ListEmpty />}
      ListFooterComponent={<ListFooter />}
    />
  );
};

export default MinhasPlantas;
