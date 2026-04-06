import React from "react";

// React Native
import { Alert, FlatList, View } from "react-native";

// Expo Router
import { useLocalSearchParams, useRouter } from "expo-router";

// Safe Area Context
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { Button, Menu, Row, Surface, Typography } from "@/components/common";
import { Header, ScreenWrapper } from "@/components/layout";

// Expo Image
import { Image } from "expo-image";

// Expo Linear Gradient

// SVGs
import { Icons } from "@/components/svgs";

// Reanimated
import Animated, { FadeInDown } from "react-native-reanimated";

// Hooks
import { useTheme } from "@/hooks/use-theme";

// Days Js
import dayjs from "dayjs";

// Store
import { useCareHistoryStore } from "@/stores/use-care-history-store";
import { useCareStore } from "@/stores/use-care-store";
import { usePlantStore } from "@/stores/use-plant-store";

// Utils
import { formatHumidityLabel, formatSunlightLabel, formatTemperatureRange } from "@/utils";

// Services
import { useServices } from "@/services";

// Schemas
import type { CareHistory } from "@/services/care/care-history.schema";
import type { Care } from "@/services/care/care.schema";
import type { Plant } from "@/services/plant/plant.schema";

const CARE_MAP = {
  water: { label: "Regar", icon: "Droplet", history: "Regou" },
  fertilizer: { label: "Adubar", icon: "Leaf", history: "Adubou" },
  prune: { label: "Podar", icon: "Scissors", history: "Podou" },
  repot: { label: "Replantar", icon: "Shovel", history: "Replantou" },
} as const;

const PlantCard = React.memo(({ plant }: { plant?: Plant }) => {
  const { theme } = useTheme();

  if (!plant) return null;
  return (
    <Surface as={Row} align="center">
      <Image
        source={plant?.image ? { uri: plant.image } : undefined}
        placeholder={require("@/assets/images/placeholder.png")}
        style={{
          alignSelf: "center",
          width: 120,
          height: 120,
          borderRadius: theme.borderRadius.md,
          // @ts-expect-error - borderCurve is not a valid style property types but in render has available
          borderCurve: "continuous",
        }}
      />
      <View style={{ flex: 1 }}>
        <Typography variant="h2">{plant?.name}</Typography>
        <Typography tone="textSecondary">{plant?.location}</Typography>
      </View>
    </Surface>
  );
});

PlantCard.displayName = "PlantCard";

const PlantInfo = React.memo(({ plant }: { plant?: Plant }) => {
  const { theme } = useTheme();

  if (!plant) return null;
  return (
    <Row flex={1} gap="md">
      <Surface wrapperStyle={{ flex: 1 }} style={{ backgroundColor: theme.colors.yellow600 }}>
        <View style={{ alignItems: "center", gap: theme.spacings.xs }}>
          <Icons.Sun tone="textOnTint" />
          <Typography tone="textOnTint" adjustsFontSizeToFit>
            {formatSunlightLabel(plant.sunlight)}
          </Typography>
        </View>
      </Surface>

      <Surface wrapperStyle={{ flex: 1 }} style={{ backgroundColor: theme.colors.green500 }}>
        <View style={{ alignItems: "center", gap: theme.spacings.xs }}>
          <Icons.Thermometer tone="textOnTint" />
          <Typography tone="textOnTint" adjustsFontSizeToFit>
            {formatTemperatureRange(plant.temperature_min, plant.temperature_max)}
          </Typography>
        </View>
      </Surface>

      <Surface wrapperStyle={{ flex: 1 }} style={{ backgroundColor: theme.colors.blue600 }}>
        <View style={{ alignItems: "center", gap: theme.spacings.xs }}>
          <Icons.Droplet tone="textOnTint" />
          <Typography tone="textOnTint" adjustsFontSizeToFit>
            {formatHumidityLabel(plant.humidity)}
          </Typography>
        </View>
      </Surface>
    </Row>
  );
});

PlantInfo.displayName = "PlantInfo";

const CareCard = React.memo(({ care }: { care: Care }) => {
  const { theme } = useTheme();

  const config = CARE_MAP[care.type];
  const Icon = Icons[config.icon];

  return (
    <Surface>
      <Row align="center">
        <Surface
          style={{
            padding: theme.spacings.xs,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.tokens.tint + "20",
          }}
        >
          <Icon />
        </Surface>
        <View style={{ flex: 1 }}>
          <Typography>{config.label}</Typography>
          <Typography variant="textSmall" tone="textSecondary">
            A cada {care.interval_days} dias
          </Typography>
        </View>
      </Row>
    </Surface>
  );
});

CareCard.displayName = "CareCard";

const Empty = React.memo(({ onPress }: { onPress: () => void }) => (
  <Surface style={{ flex: 1 }}>
    <Icons.Leaf style={{ alignSelf: "center" }} />
    <Typography align="center">Nenhum cuidado cadastrado</Typography>
    <Typography align="center" variant="textSmall" tone="textSecondary">
      Adicione os cuidados para começar a receber lembretes
    </Typography>
    <Button size="sm" style={{ alignSelf: "center" }} onPress={onPress}>
      <Icons.Plus size={20} tone="textOnTint" />
      <Button.Label>Adicionar</Button.Label>
    </Button>
  </Surface>
));

Empty.displayName = "Empty";

const HistoryItem = React.memo(({ item }: { item: CareHistory }) => {
  const config = CARE_MAP[item.type];
  const Icon = Icons[config.icon];

  return (
    <Surface>
      <Row align="center">
        <Icon size={20} tone="textSecondary" />

        <Row flex={1} justify="space-between">
          <Typography flex={1} numberOfLines={1}>
            {config.history}
          </Typography>

          <Typography variant="textSmall" tone="textSecondary">
            {dayjs(item.done_at).format("DD/MM/YYYY [às] HH:mm")}
          </Typography>
        </Row>
      </Row>
    </Surface>
  );
});

HistoryItem.displayName = "HistoryItem";

const HistoryEmpty = React.memo(() => {
  return (
    <Surface>
      <Typography align="center">Sem histórico de cuidados</Typography>
      <Typography align="center" variant="textSmall" tone="textSecondary">
        Comece a cuidar da sua planta e consulte o histórico aqui
      </Typography>
    </Surface>
  );
});

HistoryEmpty.displayName = "HistoryEmpty";

const HistoryButton = React.memo(({ plantId }: { plantId: number }) => {
  const router = useRouter();

  const handlePress = React.useCallback(() => {
    router.push({
      pathname: "/historico-planta",
      params: { id: plantId },
    });
  }, [plantId, router]);

  return (
    <Button size="sm" variant="secondary" onPress={handlePress}>
      <Icons.Clock size={20} tone="text" />
      <Button.Label>Ver histórico completo</Button.Label>
    </Button>
  );
});

HistoryButton.displayName = "HistoryButton";

type HistoryListProps = {
  plantId?: number;
  history: CareHistory[];
};

const HistoryList = React.memo(({ plantId, history }: HistoryListProps) => {
  const { theme } = useTheme();

  const latest = history.slice(0, 1);

  if (history.length === 0 || !plantId) {
    return <HistoryEmpty />;
  }

  return (
    <View style={{ gap: theme.spacings.lg }}>
      {latest.map((item) => (
        <HistoryItem key={item.id} item={item} />
      ))}

      <HistoryButton plantId={plantId} />
    </View>
  );
});

HistoryList.displayName = "HistoryList";

type ListItem =
  | { type: "plant" }
  | { type: "info" }
  | { type: "care_header" }
  | { type: "care_item"; care: Care }
  | { type: "care_empty" }
  | { type: "care_button" }
  | { type: "history_header" }
  | { type: "history_list" };

const MinhaPlanta = () => {
  /** Obtém os parâmetros da rota */
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom } = useSafeAreaInsets();
  const { theme, scheme } = useTheme();
  const { plant } = useServices();
  const router = useRouter();

  const history = useCareHistoryStore((state) => state.historyByPlant?.[Number(id)]);

  const selected_plant = usePlantStore((state) => state.plants.find((plant) => plant.id === Number(id)));
  const cares = useCareStore((state) => state.caresByPlant?.[Number(id)]);

  const data = React.useMemo(() => {
    const safeCares = cares ?? [];
    if (!selected_plant) return [];

    // Itens fixos (planta e informações)
    const list: ListItem[] = [{ type: "plant" }, { type: "info" }, { type: "care_header" }];

    // Cuidados - se houver, mostra os cuidados cadastrados, senão mostra um item vazio
    if (safeCares.length === 0) {
      list.push({ type: "care_empty" });
    } else {
      // Adiciona os cuidados à lista, intercalando com animações
      safeCares.forEach((care) => list.push({ type: "care_item", care }));
      list.push({ type: "care_button" });
    }

    // Histórico
    list.push({ type: "history_header" });
    list.push({ type: "history_list" });

    return list;
  }, [selected_plant, cares]);

  /**
   * Lida com a exclusão da planta
   */
  const handleDelete = React.useCallback(() => {
    if (!selected_plant) return;

    Alert.alert(
      "Excluir planta",
      `Tem certeza que deseja excluir a planta "${selected_plant.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await plant.deletePlant(selected_plant.id);
              router.back();
            } catch (error: any) {
              Alert.alert("Algo deu errado", error?.message || "Ocorreu um erro inesperado", [{ text: "Entendi" }], {
                cancelable: false,
                userInterfaceStyle: scheme,
              });
            }
          },
        },
      ],
      { cancelable: false, userInterfaceStyle: scheme },
    );
  }, [plant, router, selected_plant, scheme]);

  /**
   * Abre a tela de adicionar planta, passando o ID como parâmetro
   */
  const handleEdit = React.useCallback(() => {
    if (!selected_plant) return;

    router.push({
      pathname: "/(modals)/adicionar-planta",
      params: { id: selected_plant.id },
    });
  }, [selected_plant, router]);

  /**
   * Abre a tela de adicionar cuidados, passando o ID da planta como parâmetro
   */
  const handleAddCare = React.useCallback(() => {
    if (!selected_plant) return;

    router.push({
      pathname: "/(modals)/adicionar-cuidados",
      params: { id: selected_plant.id },
    });
  }, [selected_plant, router]);

  const renderers = React.useMemo(
    () => ({
      plant: (_: ListItem) => (
        <Animated.View entering={FadeInDown.delay(40)}>
          <PlantCard plant={selected_plant} />
        </Animated.View>
      ),

      info: (_: ListItem) => (
        <Animated.View entering={FadeInDown.delay(80)}>
          <PlantInfo plant={selected_plant} />
        </Animated.View>
      ),

      care_header: () => (
        <Animated.View entering={FadeInDown.delay(120)}>
          <Typography variant="h3">Cuidados</Typography>
        </Animated.View>
      ),

      care_item: (item: ListItem, index: number) => {
        const care = (item as Extract<ListItem, { type: "care_item" }>).care;

        return (
          <Animated.View entering={FadeInDown.delay(Math.min(40 + index * 30, 200))}>
            <CareCard care={care} />
          </Animated.View>
        );
      },

      care_empty: () => (
        <Animated.View entering={FadeInDown.delay(160)}>
          <Empty onPress={handleAddCare} />
        </Animated.View>
      ),

      care_button: () => (
        <Animated.View entering={FadeInDown.delay(180)}>
          <Button size="sm" variant="secondary" onPress={handleAddCare}>
            <Icons.Pencil size={20} tone="text" />
            <Button.Label>Editar cuidados</Button.Label>
          </Button>
        </Animated.View>
      ),

      history_header: () => (
        <Animated.View entering={FadeInDown.delay(220)}>
          <Typography variant="h3">Histórico</Typography>
        </Animated.View>
      ),

      history_list: () => (
        <Animated.View entering={FadeInDown.delay(260)}>
          <HistoryList history={history ?? []} plantId={selected_plant?.id} />
        </Animated.View>
      ),
    }),
    [selected_plant, handleAddCare, history],
  );

  const renderItem = React.useCallback(
    ({ item, index }: { item: ListItem; index: number }) => {
      return renderers[item.type](item, index);
    },
    [renderers],
  );

  const keyExtractor = React.useCallback((item: ListItem, index: number) => {
    if (item.type === "care_item") return `care-${item.care.id}`;
    return `${item.type}-${index}`;
  }, []);

  return (
    <ScreenWrapper
      as={FlatList<ListItem>}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: theme.spacings.lg,
        marginHorizontal: theme.spacings.xl,
        paddingBottom: bottom + theme.spacings.xl,
      }}
      // Data
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
      ListHeaderComponent={
        <Header
          title="Minha Planta"
          rightContent={
            <Menu>
              <Menu.Trigger>
                <Icons.Ellipsis tone="text" />
              </Menu.Trigger>

              {/* EDITAR PLANTA */}
              <Menu.Content>
                <Menu.Item onPress={handleEdit} icon={<Icons.Pencil tone="text" />}>
                  Editar
                </Menu.Item>

                {/* EXCLUIR PLANTA */}
                <Menu.Item onPress={handleDelete} icon={<Icons.Trash tone="error" />} variant="danger">
                  Excluir
                </Menu.Item>
              </Menu.Content>
            </Menu>
          }
        />
      }
    />
  );
};

export default MinhaPlanta;
