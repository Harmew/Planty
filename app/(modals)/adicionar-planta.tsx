import React from "react";

// React Native
import { Alert, TextInput } from "react-native";

// React Native Keyboard Controller
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

// Expo Router
import { useLocalSearchParams, useRouter } from "expo-router";

// Store
import { usePlantStore } from "@/stores/use-plant-store";

// Safe Area Context
import { useSafeAreaInsets } from "react-native-safe-area-context";

// React Hook Form
import { Controller, useForm } from "react-hook-form";

// Hookform Resolvers
import { zodResolver } from "@hookform/resolvers/zod";

// Services
import { useServices } from "@/services";

// SVGs
import { Icons } from "@/components/svgs";

// Components
import { Button } from "@/components/common";
import { Description, FieldError, ImageUploader, InputGroup, Label, Select, TextField } from "@/components/form";
import { Header, ModalWrapper } from "@/components/layout";

// Hooks
import { useTheme } from "@/hooks/use-theme";

// Schema
import { createPlantSchema, plantSunlight, type CreatePlant } from "@/services/plant/plant.schema";

// Utils
import { formatSunlightLabel } from "@/utils";

const onlyNumbers = (text: string) => text.replace(/\D/g, "");

const AdicionarPlanta = () => {
  /** Verifica se estamos editando uma planta existente */
  const { id } = useLocalSearchParams<{ id: string }>();
  const plantId = Number(id);

  const { bottom: paddingBottom } = useSafeAreaInsets();
  const { theme, scheme } = useTheme();
  const { plant, ai } = useServices();
  const router = useRouter();

  /** Planta existente caso esteja editando */
  const existing_plant = usePlantStore((state) => state.plants.find((plant) => plant.id === plantId));
  const sunlightOptions = React.useMemo(() => plantSunlight.options, []);

  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);

  // Refs
  const nameRef = React.useRef<TextInput>(null);
  const locationRef = React.useRef<TextInput>(null);
  const temperatureMaxRef = React.useRef<TextInput>(null);
  const temperatureMinRef = React.useRef<TextInput>(null);
  const humidityRef = React.useRef<TextInput>(null);

  const { control, handleSubmit, setValue, getValues } = useForm<CreatePlant>({
    resolver: zodResolver(createPlantSchema),
    defaultValues: {
      image: existing_plant?.image ? { uri: existing_plant?.image } : undefined,
      name: existing_plant?.name ?? "",
      location: existing_plant?.location ?? "",
      sunlight: existing_plant?.sunlight ?? "medium",
      humidity: existing_plant?.humidity ?? "",
      temperature_min: existing_plant?.temperature_min ?? "",
      temperature_max: existing_plant?.temperature_max ?? "",
    },
  });

  const handleGenerateAI = React.useCallback(async () => {
    try {
      const name = getValues("name");

      if (!name) {
        Alert.alert(
          "Planty informa",
          "Para gerar os dados da planta, informe o nome dela.",
          [{ text: "Entendi", onPress: () => nameRef.current?.focus() }],
          { cancelable: false, userInterfaceStyle: scheme },
        );
        return;
      }

      if (isGenerating) return;

      setIsGenerating(true);

      const data = await ai.generatePlantData(name);
      if (!data) {
        Alert.alert(
          "Planty informa",
          "Não foi possível gerar os dados da planta.",
          [{ text: "Entendi", onPress: () => nameRef.current?.focus() }],
          { cancelable: false, userInterfaceStyle: scheme },
        );
        return;
      }

      setValue("sunlight", data.sunlight);
      setValue("temperature_min", String(data.minTemperature));
      setValue("temperature_max", String(data.maxTemperature));
      setValue("humidity", String(data.humidity));
      setIsGenerating(false);
    } catch (error: any) {
      setIsGenerating(false);
      Alert.alert("Planty informa", error.message ?? "Tente novamente", [{ text: "Entendi" }], {
        cancelable: false,
        userInterfaceStyle: scheme,
      });
    }
  }, [ai, setValue, getValues, isGenerating, scheme]);

  const onSubmit = React.useCallback(
    async (data: CreatePlant) => {
      try {
        // Apenas atualiza a planta existente
        if (existing_plant) {
          await plant.updatePlant(existing_plant.id, data);
          router.back();
          return;
        }

        const result = await plant.createPlant(data);

        Alert.alert(
          "Planta adicionada com sucesso!",
          "Adicione seus cuidados para começar a monitorar sua planta e receber notificações personalizadas",
          [
            {
              text: "Adicionar agora",
              onPress: () => router.replace({ pathname: "/minha-planta", params: { id: result.id } }),
              style: "default",
              isPreferred: true,
            },
            {
              text: "Adicionar depois",
              onPress: () => router.back(),
              style: "cancel",
            },
          ],
          { cancelable: false, userInterfaceStyle: scheme },
        );
      } catch (error: any) {
        Alert.alert("Algo deu errado", error.message ?? "Ocorreu um erro inesperado", [{ text: "Entendi" }], {
          cancelable: false,
          userInterfaceStyle: scheme,
        });
      }
    },
    [plant, router, scheme, existing_plant],
  );

  return (
    <ModalWrapper
      as={KeyboardAwareScrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: theme.spacings.lg,
        marginHorizontal: theme.spacings.xl,
        paddingBottom,
      }}
    >
      <Header isModal title={existing_plant ? "Editar Planta" : "Adicionar Planta"} />

      {/* Iamge */}
      <Controller
        control={control}
        name="image"
        render={({ field, fieldState }) => (
          <TextField isRequired isInvalid={fieldState.invalid}>
            <ImageUploader
              isInvalid={fieldState.invalid}
              file={field.value}
              onSelect={field.onChange}
              onClear={() => field.onChange(null)}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      {/* Nome */}
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <TextField isRequired isInvalid={fieldState.invalid}>
            <Label>Nome</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Icons.Leaf tone="textSecondary" size={20} />
              </InputGroup.Prefix>
              <InputGroup.Input
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Ex: Samambaia"
                ref={nameRef}
                onSubmitEditing={() => locationRef.current?.focus()}
              />
            </InputGroup>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      {/* Localização */}
      <Controller
        control={control}
        name="location"
        render={({ field, fieldState }) => (
          <TextField isRequired isInvalid={fieldState.invalid}>
            <Label>Localização</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Icons.MapPinHouse tone="textSecondary" size={20} />
              </InputGroup.Prefix>
              <InputGroup.Input
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Ex: Varanda"
                ref={locationRef}
                onSubmitEditing={() => temperatureMaxRef.current?.focus()}
              />
            </InputGroup>
            <Description>Onde sua planta está?</Description>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      {/* Luz Solar */}
      <Controller
        control={control}
        name="sunlight"
        render={({ field, fieldState }) => (
          <TextField isRequired isInvalid={fieldState.invalid}>
            <Label>Luz solar</Label>
            <Select
              value={field.value ? { value: field.value, label: formatSunlightLabel(field.value) } : null}
              onChange={(val) => field.onChange(val?.value)}
            >
              <Select.Trigger icon={<Icons.Sun tone="textSecondary" size={20} />}>
                <Select.Value placeholder="Selecione uma opção" />
              </Select.Trigger>
              <Select.Content>
                {sunlightOptions.map((item) => (
                  <Select.Item key={item} value={item} label={formatSunlightLabel(item)} />
                ))}
              </Select.Content>
            </Select>
            <Description>Quantidade de luz que a planta precisa</Description>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      {/* Temperatura Máxima */}
      <Controller
        control={control}
        name="temperature_max"
        render={({ field, fieldState }) => (
          <TextField isInvalid={fieldState.invalid}>
            <Label>Temperatura máxima</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Icons.ThermometerSun tone="textSecondary" size={20} />
              </InputGroup.Prefix>
              <InputGroup.Input
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                value={field.value}
                onChangeText={(text) => field.onChange(onlyNumbers(text))}
                placeholder="Ex: 30°"
                ref={temperatureMaxRef}
                onSubmitEditing={() => temperatureMinRef.current?.focus()}
              />
            </InputGroup>
            <Description>Temperatura máxima recomendada</Description>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      {/* Temperatura mínima */}
      <Controller
        control={control}
        name="temperature_min"
        render={({ field, fieldState }) => (
          <TextField isInvalid={fieldState.invalid}>
            <Label>Temperatura mínima</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Icons.ThermometerSnowflake tone="textSecondary" size={20} />
              </InputGroup.Prefix>
              <InputGroup.Input
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                value={field.value}
                onChangeText={(text) => field.onChange(onlyNumbers(text))}
                placeholder="Ex: 1°"
                ref={temperatureMinRef}
                onSubmitEditing={() => humidityRef.current?.focus()}
              />
            </InputGroup>
            <Description>Temperatura mínima recomendada</Description>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      {/* Umidade */}
      <Controller
        control={control}
        name="humidity"
        render={({ field, fieldState }) => (
          <TextField isInvalid={fieldState.invalid}>
            <Label>Umidade</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Icons.CloudDrizzle tone="textSecondary" size={20} />
              </InputGroup.Prefix>
              <InputGroup.Input
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                value={field.value}
                onChangeText={(text) => field.onChange(onlyNumbers(text))}
                placeholder="Ex: 30%"
                ref={humidityRef}
              />
            </InputGroup>
            <Description>Nível de umidade ideal</Description>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      <Button onPress={handleGenerateAI} variant="secondary" isLoading={isGenerating}>
        <Icons.Sparkles tone="tint" size={20} />
        <Button.Label>Gerar automaticamente</Button.Label>
      </Button>

      {/* Botão de Salvar planta */}
      <Button onPress={handleSubmit(onSubmit)} disabled={isGenerating}>
        <Button.Label>{existing_plant ? "Atualizar planta" : "Adicionar planta"}</Button.Label>
      </Button>
    </ModalWrapper>
  );
};

export default AdicionarPlanta;
