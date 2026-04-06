import React from "react";

// React Native
import { Pressable, StyleSheet } from "react-native";

// Hooks
import { Theme, useTheme } from "@/hooks/use-theme";

// Reanimated
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// React Native Screen
import { FullWindowOverlay } from "react-native-screens";

// Components
import { Button } from "./button";
import { PressableFeedback } from "./pressable-feedback";
import { Row } from "./row";
import { Surface } from "./surface";
import { Typography } from "./typography";

type MenuContextType = {
  /**
   * Se o menu está aberto ou fechado
   */
  isOpen: boolean;
  /**
   * Função para abrir ou fechar o menu
   */
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MenuContext = React.createContext<MenuContextType | null>(null);

const useMenu = () => {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within a Menu");
  return ctx;
};

export const Menu = ({ children }: React.PropsWithChildren) => {
  const [isOpen, setOpen] = React.useState(false);

  return <MenuContext.Provider value={{ isOpen, setOpen }}>{children}</MenuContext.Provider>;
};

const MenuTrigger = ({ children }: React.PropsWithChildren) => {
  const { setOpen } = useMenu();

  return (
    <Button isIconOnly variant="secondary" size="sm" onPress={() => setOpen(true)}>
      {children}
    </Button>
  );
};

const MenuOverlay = () => {
  const { isOpen, setOpen } = useMenu();
  const { styles } = useTheme(createStyles);

  if (!isOpen) return null;
  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
    </Animated.View>
  );
};

const MenuContent = ({ children }: React.PropsWithChildren) => {
  const { styles } = useTheme(createStyles);
  const { isOpen } = useMenu();

  if (!isOpen) return null;
  return (
    <FullWindowOverlay>
      <MenuOverlay />

      <Animated.View
        entering={FadeIn.duration(150)}
        exiting={FadeOut.duration(100)}
        style={{
          ...StyleSheet.absoluteFill,
          justifyContent: "center",
        }}
        pointerEvents="box-none"
      >
        <Surface style={styles.content}>{children}</Surface>
      </Animated.View>
    </FullWindowOverlay>
  );
};

const MenuItem = ({
  children,
  onPress,
  variant = "default",
  icon,
  align = "left",
}: React.PropsWithChildren<{
  onPress?: () => void;
  variant?: "default" | "danger";
  icon?: React.ReactNode;
  align?: "left" | "center" | "right";
}>) => {
  const { setOpen } = useMenu();
  const { theme, styles } = useTheme(createStyles);

  const isDanger = variant === "danger";

  return (
    <PressableFeedback
      style={[styles.item, isDanger && { backgroundColor: theme.tokens.error + "20" }]}
      onPress={() => {
        onPress?.();
        setOpen(false);
      }}
    >
      <Row align="center">
        {icon}
        <Typography align={align} flex={1} tone={isDanger ? "error" : "text"}>
          {children}
        </Typography>
      </Row>
    </PressableFeedback>
  );
};

Menu.Trigger = MenuTrigger;
Menu.Content = MenuContent;
Menu.Item = MenuItem;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      backgroundColor: theme.tokens.overlay,
      ...StyleSheet.absoluteFill,
    },
    content: {
      marginHorizontal: theme.spacings.xl * 2,
      gap: theme.spacings.xs,
      maxHeight: 600,
    },
    item: {
      padding: theme.spacings.sm,
      borderRadius: theme.borderRadius.md,
      borderCurve: "continuous",
    },
  });
