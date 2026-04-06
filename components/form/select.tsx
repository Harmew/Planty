import React from "react";

// React Native
import { Pressable, StyleSheet } from "react-native";

// Reanimated
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Hooks
import { useTheme, type Theme } from "@/hooks/use-theme";

// Context
import { useTextField } from "./text-field";

// Icons
import { Icons } from "@/components/svgs";

// Components
import { FullWindowOverlay, PressableFeedback, Row, Surface, Typography } from "@/components/common";

type SelectValue<T = string> = {
  label: string;
  value: T;
} | null;

type SelectContextType = {
  /**
   * Valor selecionado
   * Representa o valor atualmente selecionado no componente Select.
   */
  value: SelectValue;
  /**
   * Função para atualizar o valor selecionado
   */
  setValue: (value: SelectValue) => void;
  /**
   * Indica se o menu suspenso está aberto
   */
  isOpen: boolean;
  /**
   * Função para atualizar o estado do menu suspenso
   */
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SelectContext = React.createContext<SelectContextType | null>(null);

const useSelect = () => {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("Use dentro do Select");
  return ctx;
};

type SelectProps = React.PropsWithChildren<{
  value?: SelectValue;
  onChange?: (value: SelectValue) => void;
}>;

export const Select = ({ children, value: valueProp, onChange }: SelectProps) => {
  const [internalValue, setInternalValue] = React.useState<SelectValue>(null);

  const value = valueProp !== undefined ? valueProp : internalValue;

  const setValue = (val: SelectValue) => {
    if (onChange) onChange(val);
    else setInternalValue(val);
  };

  const [isOpen, setOpen] = React.useState(false);
  return <SelectContext.Provider value={{ value, setValue, isOpen, setOpen }}>{children}</SelectContext.Provider>;
};

const SelectTriggerComponent = ({ children, icon }: React.PropsWithChildren<{ icon?: React.JSX.Element }>) => {
  const { isOpen, setOpen } = useSelect();
  const { styles, theme } = useTheme(createStyles);

  const progress = useSharedValue(0);
  const progressRef = React.useRef(progress);

  const { isDisabled, isInvalid } = useTextField();
  const borderColor = isInvalid ? theme.tokens.error : theme.tokens.background;

  React.useEffect(() => {
    progressRef.current.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(progressRef.current.value, [0, 1], [0, 180])}deg`,
        },
      ],
    };
  });

  return (
    <PressableFeedback
      disabled={isDisabled}
      style={[styles.trigger, { borderColor, opacity: isDisabled ? 0.6 : 1 }]}
      onPress={() => setOpen((prev) => !prev)}
    >
      <Row align="center" justify="space-between">
        <Row gap="xxs" align="center" flex={1}>
          {icon ? icon : null}
          {children}
        </Row>

        <Animated.View style={animatedStyle}>
          <Icons.ChevronDown size={20} tone="textSecondary" />
        </Animated.View>
      </Row>
    </PressableFeedback>
  );
};

const SelectValueComponent = ({ placeholder = "Selecione" }: { placeholder?: string }) => {
  const { value } = useSelect();

  return (
    <Typography tone={value ? "text" : "textSecondary"} numberOfLines={1}>
      {value?.label ?? placeholder}
    </Typography>
  );
};

const SelectOverlayComponent = () => {
  const { isOpen, setOpen } = useSelect();
  const { styles } = useTheme(createStyles);

  if (!isOpen) return null;
  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
    </Animated.View>
  );
};

const SelectContentComponent = ({ children }: React.PropsWithChildren) => {
  const { styles } = useTheme(createStyles);
  const { isOpen } = useSelect();

  if (!isOpen) return null;

  return (
    <FullWindowOverlay>
      <SelectOverlayComponent />

      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={{ ...StyleSheet.absoluteFill, justifyContent: "center" }}
        pointerEvents="box-none"
      >
        <Surface style={styles.content}>{children}</Surface>
      </Animated.View>
    </FullWindowOverlay>
  );
};

const SelectItemComponent = ({ label, value }: { label: string; value: string }) => {
  const { value: selectedValue, setValue, setOpen } = useSelect();
  const { styles, theme } = useTheme(createStyles);

  const isSelected = selectedValue?.value === value;

  return (
    <PressableFeedback
      style={[styles.item, isSelected && { backgroundColor: theme.tokens.background }]}
      onPress={() => {
        setValue({ label, value });
        setOpen(false);
      }}
    >
      <Row justify="space-between" align="center">
        <Typography flex={1}>{label}</Typography>
        {isSelected ? <Icons.Check size={20} /> : null}
      </Row>
    </PressableFeedback>
  );
};

Select.Trigger = SelectTriggerComponent;
Select.Value = SelectValueComponent;
Select.Content = SelectContentComponent;
Select.Item = SelectItemComponent;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    trigger: {
      height: 56,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      borderCurve: "continuous",
      paddingHorizontal: theme.spacings.sm,
      backgroundColor: theme.tokens.surface,
      justifyContent: "center",
    },
    overlay: {
      backgroundColor: theme.tokens.overlay,
      ...StyleSheet.absoluteFill,
    },
    content: {
      marginHorizontal: theme.spacings.xl,
      gap: theme.spacings.xs,
      maxHeight: 600,
    },
    item: {
      padding: theme.spacings.sm,
      borderRadius: theme.borderRadius.md,
      borderCurve: "continuous",
    },
  });
