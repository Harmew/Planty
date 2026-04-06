import React from "react";

// React Native
import { Dimensions, StyleSheet, View } from "react-native";

// Reanimated
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";

// Libs
import { Haptics } from "@/libs";

// React Navigation Bottom Tabs
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// React Navigation Native
import { useLinkBuilder } from "@react-navigation/native";

// Constants
import { useTheme, type Theme } from "@/hooks/use-theme";

// Components
import { Surface } from "@/components/common";
import { TabBarButton } from "./tab-bar-button";

export const TAB_BAR_HEIGHT = 60;

export const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation, insets }) => {
  const { styles } = useTheme(createStyles);
  const { buildHref } = useLinkBuilder();

  const leftRoutes = state.routes.slice(0, 2); // plantas e cuidados
  const rightRoutes = state.routes.slice(2); // ajustes

  const renderTab = (route: (typeof state.routes)[number], index: number, group: "left" | "right") => {
    const isFocused = state.index === index;

    const onPress = () => {
      Haptics.hapticTabPress();

      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: "tabLongPress",
        target: route.key,
      });
    };

    return (
      <TabBarButton
        key={route.key}
        route={route}
        isFocused={isFocused}
        group={group}
        href={buildHref(route.name, route.params)}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    );
  };

  return (
    <View style={[styles.container, { bottom: insets.bottom }]}>
      {/* Esquerda */}
      <Animated.View entering={FadeInLeft.delay(40)}>
        <Surface style={styles.surface}>{leftRoutes.map((route, i) => renderTab(route, i, "left"))}</Surface>
      </Animated.View>

      {/* Direita */}
      <Animated.View entering={FadeInRight.delay(40)}>
        <Surface style={styles.surface}>
          {rightRoutes.map((route, i) => renderTab(route, i + leftRoutes.length, "right"))}
        </Surface>
      </Animated.View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: width - theme.spacings.xl * 2,
      position: "absolute",
      bottom: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: theme.spacings.xl,
    },
    surface: {
      gap: 0,
      backgroundColor: theme.tokens.tabBackground,
      borderRadius: theme.borderRadius.full,
      flexDirection: "row",
      padding: theme.spacings.xxs,
    },
  });
