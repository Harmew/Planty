import React from "react";

// React Native
import { Alert, FlatList, View } from "react-native";

// Components
import { Button, Row, Surface, Typography } from "@/components/common";
import { ScreenWrapper, TAB_BAR_HEIGHT } from "@/components/layout";

// Hooks
import { usePendingCares, type PendingCare } from "@/hooks/use-pending-cares";
import { usePlantsWithCares, type PlantWithCares } from "@/hooks/use-plants-with-cares";
import { useTheme } from "@/hooks/use-theme";

// Expo Image
import { Image } from "expo-image";

// Reanimated
import Animated, { FadeInDown } from "react-native-reanimated";

// Safe Area
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Services
import { useServices } from "@/services";

// SVGs
import { Icons } from "@/components/svgs";

// Expo Router
import { useRouter } from "expo-router";

// Days Js
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

// Schemas
import type { Care, Cares } from "@/services/care/care.schema";

dayjs.locale("pt-br");

const CARE_MAP = {
  water: { label: "Regar", icon: "Droplet" },
  fertilizer: { label: "Adubar", icon: "Leaf" },
  prune: { label: "Podar", icon: "Scissors" },
  repot: { label: "Replantar", icon: "Shovel" },
} as const;

type CareUI = {
  type: string;
  label: string;
  icon: keyof typeof Icons;
  enabled: boolean;
  data?: Care;
};

const mapPlantCares = (cares: Cares): CareUI[] => {
  const map = Object.fromEntries(cares.map((c) => [c.type, c]));

  return Object.entries(CARE_MAP).map(([key, config]) => {
    const existing = map[key];
    return { ...config, type: key, data: existing, enabled: !!existing };
  });
};

const PlantCard = React.memo(({ plant }: { plant: PlantWithCares }) => {
  const caresUI = React.useMemo(() => mapPlantCares(plant.cares), [plant.cares]);
  const { theme } = useTheme();

  return (
    <Surface style={{ padding: theme.spacings.sm }}>
      <Row align="center">
        <Image
          source={plant.image ? { uri: plant.image } : undefined}
          placeholder={require("@/assets/images/placeholder.png")}
          style={{
            width: 40,
            height: 40,
            borderRadius: theme.borderRadius.sm,
            // @ts-expect-error - borderCurve is not a valid style property types but in render has available
            borderCurve: "continuous",
          }}
          contentFit="cover"
        />

        <Typography numberOfLines={1} flex={1}>
          {plant.name}
        </Typography>
      </Row>

      {/* Lista de cuidados */}

      <Row flex={1}>
        {caresUI.map((care) => {
          const isEnabled = care.enabled;
          const Icon = Icons[care.icon];

          const backgroundColor = isEnabled ? theme.tokens.tint + "20" : theme.tokens.surfaceDisabled + "10";

          return (
            <Surface
              wrapperStyle={{ flex: 1 }}
              key={care.type}
              style={{
                alignItems: "center",
                padding: theme.spacings.xs,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.tokens.background,
                opacity: isEnabled ? 1 : 0.8,
                gap: theme.spacings.xxs,
              }}
            >
              <Surface
                style={{
                  padding: theme.spacings.xs,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor,
                }}
              >
                <Icon tone={isEnabled ? "tint" : "textSecondary"} />
              </Surface>

              <Typography variant="textSmall" tone="textSecondary">
                {isEnabled ? `${care.data?.interval_days} dias` : "-"}
              </Typography>
            </Surface>
          );
        })}
      </Row>
    </Surface>
  );
});

PlantCard.displayName = "PlantCard";

const Calendar = React.memo(() => {
  const calendar = React.useMemo(() => {
    const now = dayjs();
    return {
      year: now.format("YYYY"),
      dayName: now.format("dddd"),
      day: now.format("D"),
      month: now.format("MMMM"),
    };
  }, []);

  return (
    <Surface>
      <Row align="center" justify="space-between">
        <View>
          <Typography tone="textSecondary">{calendar.year}</Typography>
          <Typography variant="h3">
            {calendar.dayName.charAt(0).toUpperCase() + calendar.dayName.slice(1)}, {calendar.day}
          </Typography>
        </View>
        <Typography variant="h1" tone="tint" style={{ fontWeight: "300" }}>
          {calendar.month.toUpperCase()}
        </Typography>
      </Row>
    </Surface>
  );
});

Calendar.displayName = "Calendar";

const Pending = React.memo(({ pendingCares }: { pendingCares: PendingCare[] }) => {
  const { theme, scheme } = useTheme();
  const { care } = useServices();

  const loadingRef = React.useRef<string | null>(null);

  const handleMarkAsDone = React.useCallback(
    async (item: PendingCare) => {
      const id = `${item.plantId}-${item.type}`;

      if (loadingRef.current === id) return;

      try {
        loadingRef.current = id;
        await care.markAsDone(item.plantId, item.type);
        loadingRef.current = null;
      } catch (error: any) {
        loadingRef.current = null;
        Alert.alert("Algo deu errado", error?.message || "Não foi possível concluir o cuidado", [{ text: "Entendi" }], {
          cancelable: false,
          userInterfaceStyle: scheme,
        });
      }
    },
    [care, scheme],
  );

  // Early return para lista vazia
  if (pendingCares.length === 0) {
    return (
      <Surface>
        <Typography tone="text" align="center">
          Nenhum cuidado para hoje
        </Typography>
      </Surface>
    );
  }

  return (
    <Surface>
      {pendingCares.map((item) => {
        const config = CARE_MAP[item.type];
        const Icon = Icons[config.icon];

        const isActionable = item.isToday || item.isOverdue;

        const label = item.isOverdue ? "Atrasado" : item.isToday ? "Hoje" : "Amanhã";

        const backgroundColor = item.isOverdue
          ? theme.tokens.error + "20"
          : item.isToday
            ? theme.tokens.tint + "20"
            : theme.tokens.surfaceDisabled;

        return (
          <Row key={`${item.plantId}-${item.type}`} align="center" justify="space-between">
            <Row align="center" gap="sm" style={{ flex: 1 }}>
              <Surface style={{ padding: theme.spacings.xs, borderRadius: theme.borderRadius.md, backgroundColor }}>
                <Icon tone={item.isOverdue ? "error" : item.isToday ? "tint" : "textSecondary"} />
              </Surface>

              <View style={{ flex: 1 }}>
                <Typography numberOfLines={1}>
                  {config.label} {item.plantName}
                </Typography>

                <Typography variant="textSmall" tone="textSecondary">
                  {label}
                </Typography>
              </View>
            </Row>

            {isActionable && (
              <Button size="sm" onPress={() => handleMarkAsDone(item)}>
                <Button.Label>Concluir</Button.Label>
              </Button>
            )}
          </Row>
        );
      })}
    </Surface>
  );
});

Pending.displayName = "Pending";

const Empty = React.memo(() => {
  const router = useRouter();

  const openAddPlant = React.useCallback(() => {
    router.push("/(modals)/adicionar-planta");
  }, [router]);

  return (
    <Surface>
      <Icons.Leaf style={{ alignSelf: "center" }} />
      <Typography align="center">Você ainda não tem plantas</Typography>
      <Typography align="center" variant="textSmall" tone="textSecondary">
        Vamos começar adicionando a sua primeira planta?
      </Typography>
      <Button size="sm" style={{ alignSelf: "center" }} onPress={openAddPlant}>
        <Icons.Plus size={20} tone="textOnTint" />
        <Button.Label>Adicionar</Button.Label>
      </Button>
    </Surface>
  );
});

Empty.displayName = "Empty";

type ListItem =
  | { type: "calendar" }
  | { type: "pending" }
  | { type: "section_title" }
  | { type: "plant_item"; plant: PlantWithCares }
  | { type: "empty" };

const MeusCuidados = () => {
  const plantsWithCares = usePlantsWithCares();
  const pendingCares = usePendingCares(plantsWithCares);

  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();

  const data = React.useMemo(() => {
    const list: ListItem[] = [];

    // HEADER
    list.push({ type: "calendar" });

    if (plantsWithCares.length > 0) {
      list.push({ type: "pending" });
    }

    // CONTENT
    if (plantsWithCares.length === 0) {
      list.push({ type: "empty" });
      return list;
    }

    list.push({ type: "section_title" });

    // ITEMS
    plantsWithCares.forEach((plant) => {
      list.push({ type: "plant_item", plant });
    });

    return list;
  }, [plantsWithCares]);

  const renderers = React.useMemo(
    () => ({
      calendar: () => (
        <Animated.View entering={FadeInDown.delay(40)}>
          <Calendar />
        </Animated.View>
      ),

      pending: () => (
        <Animated.View entering={FadeInDown.delay(80)}>
          <Pending pendingCares={pendingCares} />
        </Animated.View>
      ),

      section_title: () => (
        <Animated.View entering={FadeInDown.delay(120)}>
          <Typography variant="h3">Meus Cuidados</Typography>
        </Animated.View>
      ),

      plant_item: (item: ListItem, index: number) => {
        const plant = (item as Extract<ListItem, { type: "plant_item" }>).plant;

        return (
          <Animated.View entering={FadeInDown.delay(Math.min(140 + index * 40, 500))}>
            <PlantCard plant={plant} />
          </Animated.View>
        );
      },

      empty: () => (
        <Animated.View entering={FadeInDown.delay(120)}>
          <Empty />
        </Animated.View>
      ),
    }),
    [pendingCares],
  );

  const renderItem = React.useCallback(
    ({ item, index }: { item: ListItem; index: number }) => {
      return renderers[item.type](item, index);
    },
    [renderers],
  );

  const keyExtractor = React.useCallback((item: ListItem, index: number) => {
    if (item.type === "plant_item") return `plant-${item.plant.id}`;
    return `${item.type}-${index}`;
  }, []);

  return (
    <ScreenWrapper
      as={FlatList<ListItem>}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: theme.spacings.lg,
        marginHorizontal: theme.spacings.xl,
        paddingBottom: TAB_BAR_HEIGHT + bottom + theme.spacings.xl,
      }}
      // Data
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
      removeClippedSubviews={false}
    />
  );
};

export default MeusCuidados;
