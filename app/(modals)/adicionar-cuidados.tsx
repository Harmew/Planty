import React from "react";

// React Native
import { Alert } from "react-native";

// React Native Keyboard Controller
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

// Expo Router
import { useLocalSearchParams, useRouter } from "expo-router";

// Store
import { useCareStore } from "@/stores/use-care-store";

// Safe Area Context
import { useSafeAreaInsets } from "react-native-safe-area-context";

// React Hook Form
import { type Control, Controller, useForm, type UseFormSetValue, useWatch } from "react-hook-form";

// Hookform Resolvers
import { zodResolver } from "@hookform/resolvers/zod";

// Services
import { useServices } from "@/services";

// SVGs
import { Icons } from "@/components/svgs";

// Components
import { Button, Row, Surface, Typography } from "@/components/common";
import { FieldError, InputGroup, Switch, TextField } from "@/components/form";
import { Header, ModalWrapper } from "@/components/layout";

// Hooks
import { useTheme } from "@/hooks/use-theme";

// Schema
import { Care, CreateCares, createCaresSchema } from "@/services/care/care.schema";

const onlyNumbers = (text: string) => text.replace(/\D/g, "");

type ItemProps = {
  name: keyof CreateCares;
  control: Control<CreateCares>;
  setValue: UseFormSetValue<CreateCares>;
  label: string;
};

const Item = ({ control, name, label, setValue }: ItemProps) => {
  const enabled = useWatch({ control, name: `${name}.enabled` });
  const { theme } = useTheme();

  const backgroundColor = enabled ? theme.tokens.tint + "20" : theme.tokens.surfaceDisabled;

  const iconMap = {
    water: <Icons.Droplet tone={enabled ? "tint" : "textSecondary"} />,
    fertilizer: <Icons.Leaf tone={enabled ? "tint" : "textSecondary"} />,
    prune: <Icons.Scissors tone={enabled ? "tint" : "textSecondary"} />,
    repot: <Icons.Shovel tone={enabled ? "tint" : "textSecondary"} />,
  };

  return (
    <Surface>
      <Row justify="space-between" align="center">
        <Row flex={1} align="center">
          <Surface style={{ padding: theme.spacings.xs, borderRadius: theme.borderRadius.md, backgroundColor }}>
            {iconMap[name]}
          </Surface>
          <Typography tone={enabled ? "text" : "textSecondary"}>{label}</Typography>
        </Row>

        <Controller
          control={control}
          name={`${name}.enabled`}
          render={({ field }) => (
            <Switch
              isSelected={field.value}
              onSelectedChange={(value) => {
                // Atualiza o estado do switch
                setValue(`${name}.enabled`, value, {
                  shouldValidate: true,
                });

                // Se desabilitado, limpa o valor do intervalo para evitar dados inconsistentes
                if (!value) {
                  setValue(`${name}.interval_days`, "", {
                    shouldValidate: true,
                  });
                }
              }}
            />
          )}
        />
      </Row>

      <Typography flex={1} variant="textSmall" tone={enabled ? "text" : "textSecondary"}>
        Seja notificado para {label.toLowerCase()} sua planta de tempos em tempos
      </Typography>

      {/* Intervalo */}
      <Controller
        control={control}
        name={`${name}.interval_days`}
        render={({ field, fieldState }) => (
          <TextField isRequired={enabled} isDisabled={!enabled} isInvalid={fieldState.invalid}>
            <InputGroup>
              <InputGroup.Prefix>
                <Icons.CalendarDays tone="textSecondary" size={20} />
              </InputGroup.Prefix>
              <InputGroup.Input
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                value={field.value}
                onChangeText={(text) => field.onChange(onlyNumbers(text))}
                placeholder="Ex: 2 dias"
                variant="outlined"
              />
            </InputGroup>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
    </Surface>
  );
};

const AdicionarCuidados = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom: paddingBottom } = useSafeAreaInsets();
  const { theme, scheme } = useTheme();
  const { care } = useServices();
  const router = useRouter();

  const existing_cares = useCareStore((state) => state.caresByPlant?.[Number(id)]);

  const caresMap = React.useMemo(() => {
    const map: Record<string, Care> = {};

    existing_cares?.forEach((c) => {
      map[c.type] = c;
    });

    return map;
  }, [existing_cares]);

  const { control, handleSubmit, setValue } = useForm<CreateCares>({
    resolver: zodResolver(createCaresSchema),
    defaultValues: {
      water: {
        enabled: !!caresMap.water,
        interval_days: caresMap.water?.interval_days?.toString() ?? "",
      },
      fertilizer: {
        enabled: !!caresMap.fertilizer,
        interval_days: caresMap.fertilizer?.interval_days?.toString() ?? "",
      },
      prune: {
        enabled: !!caresMap.prune,
        interval_days: caresMap.prune?.interval_days?.toString() ?? "",
      },
      repot: {
        enabled: !!caresMap.repot,
        interval_days: caresMap.repot?.interval_days?.toString() ?? "",
      },
    },
  });

  const onSubmit = React.useCallback(
    async (data: CreateCares) => {
      try {
        await care.createOrUpdateCares(Number(id), data);

        router.back();
      } catch (error: any) {
        Alert.alert("Algo deu errado", error.message ?? "Ocorreu um erro inesperado", [{ text: "Entendi" }], {
          cancelable: false,
          userInterfaceStyle: scheme,
        });
      }
    },
    [id, care, scheme, router],
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
      <Header isModal title={"Cuidados da Planta"} />

      <Item control={control} name="water" label="Regar" setValue={setValue} />
      <Item control={control} name="fertilizer" label="Adubar" setValue={setValue} />
      <Item control={control} name="prune" label="Podar" setValue={setValue} />
      <Item control={control} name="repot" label="Replantar" setValue={setValue} />

      {/* Botão de Salvar Cuidados */}
      <Button onPress={handleSubmit(onSubmit)}>
        <Button.Label>Salvar cuidados</Button.Label>
      </Button>
    </ModalWrapper>
  );
};

export default AdicionarCuidados;
