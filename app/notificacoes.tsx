import React from "react";

// React Native
import { Alert, FlatList, View } from "react-native";

// Components
import { Menu, PressableFeedback, Row, Surface, Typography } from "@/components/common";
import { Header, ScreenWrapper } from "@/components/layout";

// Schemas
import type { Notification, Notifications } from "@/services/notification/notification.schema";

// Days Js
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Hooks
import { useTheme } from "@/hooks/use-theme";

// Services
import { useServices } from "@/services";

// SVGs
import { Icons } from "@/components/svgs";

// Store
import { useNotificationStore } from "@/stores/use-notification-store";

// Reanimated
import Animated, { FadeInDown } from "react-native-reanimated";

// Safe Area Context
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Utils
import { formatNotificationDate } from "@/utils";

dayjs.extend(isSameOrBefore);

const ICON_MAP = {
  water: "Droplet",
  fertilizer: "Leaf",
  prune: "Scissors",
  repot: "Shovel",
} as const;

const Item = React.memo(
  ({ item, index }: { item: Notification; index: number }) => {
    const { notification } = useServices();
    const { theme, scheme } = useTheme();

    const isRead = Boolean(item.read);
    const { relative } = formatNotificationDate(item.scheduled_for);

    const backgroundColor = isRead ? theme.tokens.surfaceDisabled : theme.tokens.tint + "20";
    const Icon = React.useMemo(() => Icons[ICON_MAP[item.type]], [item.type]);
    const shouldAnimate = index < 10;

    const handleMarkAsRead = async () => {
      try {
        if (isRead) return;
        await notification.markAsRead(item.id);
      } catch (error: any) {
        Alert.alert("Algo deu errado", error?.message || "Ocorreu um erro inesperado", [{ text: "Entendi" }], {
          cancelable: false,
          userInterfaceStyle: scheme,
        });
      }
    };

    return (
      <Animated.View entering={shouldAnimate ? FadeInDown.delay(index * 40) : undefined}>
        <Surface
          as={PressableFeedback}
          disabled={isRead}
          onPress={handleMarkAsRead}
          style={{ opacity: isRead ? 0.8 : 1 }}
        >
          <Row align="center">
            <Surface style={{ padding: theme.spacings.xs, borderRadius: theme.borderRadius.md, backgroundColor }}>
              <Icon tone={isRead ? "textSecondary" : "tint"} />
            </Surface>

            {/* Conteúdo */}
            <View style={{ flex: 1, gap: theme.spacings.xxs }}>
              <Row align="center" justify="space-between" gap="xs">
                <Typography numberOfLines={1} flex={1}>
                  {item.title}
                </Typography>
                <Typography variant="textSmall" tone="textSecondary">
                  {relative}
                </Typography>
              </Row>

              <Typography flex={1} variant="textSmall" tone="textSecondary">
                {item.body}
              </Typography>
            </View>
          </Row>
        </Surface>
      </Animated.View>
    );
  },
  (prev, next) => prev.item.id === next.item.id && prev.item.read === next.item.read,
);

Item.displayName = "Item";

const ListHeader = React.memo(() => (
  <Header
    title="Notificações"
    rightContent={
      <Menu>
        <Menu.Trigger>
          <Icons.Info tone="text" />
        </Menu.Trigger>

        <Menu.Content>
          <Menu.Item align="center">
            Notificações são mantidas por até 3 meses e depois são removidas automaticamente
          </Menu.Item>
        </Menu.Content>
      </Menu>
    }
  />
));

ListHeader.displayName = "ListHeader";

const ListEmpty = React.memo(() => {
  return (
    <Animated.View entering={FadeInDown.delay(120)}>
      <Surface style={{ flex: 1 }}>
        <Icons.Bell tone="text" style={{ alignSelf: "center" }} />
        <Typography align="center">Nenhuma notificação no momento</Typography>
      </Surface>
    </Animated.View>
  );
});

ListEmpty.displayName = "ListEmpty";

const Notificacoes = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();

  /**
   * Filtra as notificações visíveis
   * @description Para a renderização de UI não mostra as notificações futuras, ela está armazenada apenas para utilizar em funções de agendamento e de export
   */
  const visibleNotifications: Notifications = React.useMemo(() => {
    const now = dayjs();
    return notifications.filter((notification) => dayjs(notification.scheduled_for).isSameOrBefore(now));
  }, [notifications]);

  const renderItem = React.useCallback(
    ({ item, index }: { item: Notification; index: number }) => <Item item={item} index={index} />,
    [],
  );

  return (
    <ScreenWrapper
      as={FlatList<Notification>}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: theme.spacings.lg,
        marginHorizontal: theme.spacings.xl,
        paddingBottom: bottom + theme.spacings.xl,
      }}
      // Data
      data={visibleNotifications}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      removeClippedSubviews={false}
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

export default Notificacoes;
