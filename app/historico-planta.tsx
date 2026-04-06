import React from "react";

// React Native
import { FlatList } from "react-native";

// Expo Router
import { useLocalSearchParams } from "expo-router";

// Safe Area Context
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { Row, Surface, Typography } from "@/components/common";
import { Header, ScreenWrapper } from "@/components/layout";

// SVGs
import { Icons } from "@/components/svgs";

// Reanimated
import Animated, { FadeInDown } from "react-native-reanimated";

// Hooks
import { useTheme } from "@/hooks/use-theme";

// Stores
import { useCareHistoryStore } from "@/stores/use-care-history-store";

// Schema
import type { CareHistory } from "@/services/care/care-history.schema";

// Days Js
import dayjs from "dayjs";

const CARE_MAP = {
  water: { icon: "Droplet", history: "Regou" },
  fertilizer: { icon: "Leaf", history: "Adubou" },
  prune: { icon: "Scissors", history: "Podou" },
  repot: { icon: "Shovel", history: "Replantou" },
} as const;

const Item = React.memo(
  ({ item, index }: { item: CareHistory; index: number }) => {
    const config = CARE_MAP[item.type] ?? CARE_MAP.water;
    const Icon = React.useMemo(() => Icons[config.icon], [config.icon]);

    const shouldAnimate = index < 10;

    return (
      <Animated.View entering={shouldAnimate ? FadeInDown.delay(index * 40) : undefined}>
        <Surface>
          <Row align="center">
            <Icon size={20} tone="textSecondary" />

            <Row flex={1} justify="space-between">
              <Typography flex={1} numberOfLines={1}>
                {config.history}
              </Typography>

              <Typography variant="textSmall" tone="textSecondary" numberOfLines={1}>
                {dayjs(item.done_at).format("DD/MM/YYYY [às] HH:mm")}
              </Typography>
            </Row>
          </Row>
        </Surface>
      </Animated.View>
    );
  },
  (prev, next) => prev.item.id === next.item.id,
);

Item.displayName = "Item";

const ListHeader = React.memo(() => <Header title="Histórico de Cuidados" />);

ListHeader.displayName = "ListHeader";

const ListEmpty = React.memo(() => {
  return (
    <Animated.View entering={FadeInDown.delay(120)}>
      <Surface style={{ flex: 1 }}>
        <Icons.Clock tone="text" style={{ alignSelf: "center" }} />
        <Typography align="center">Nenhum histórico encontrado</Typography>
      </Surface>
    </Animated.View>
  );
});

ListEmpty.displayName = "ListEmpty";

const HistoricoPlanta = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();

  const historyByPlant = useCareHistoryStore((state) => state.historyByPlant);

  const history = React.useMemo(() => {
    if (!historyByPlant || !id) return [];

    return historyByPlant[Number(id)] ?? [];
  }, [historyByPlant, id]);

  const renderItem = React.useCallback(
    ({ item, index }: { item: CareHistory; index: number }) => <Item item={item} index={index} />,
    [],
  );

  return (
    <ScreenWrapper
      as={FlatList<CareHistory>}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: theme.spacings.lg,
        marginHorizontal: theme.spacings.xl,
        paddingBottom: bottom + theme.spacings.xl,
      }}
      // Data
      data={history}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      removeClippedSubviews={false}
      getItemLayout={(_, index) => ({
        length: 52, // altura aproximada do item
        offset: 52 * index,
        index,
      })}
      // Extra Components
      ListHeaderComponent={<ListHeader />}
      ListEmptyComponent={<ListEmpty />}
      // Render
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={5}
    />
  );
};

export default HistoricoPlanta;
