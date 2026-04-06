import React from "react";

// React Native
import { Platform, View } from "react-native";

// Expo Router
import { useRouter } from "expo-router";

// SVGs
import { Icons } from "@/components/svgs";

// Components
import { Button, Row, Typography } from "@/components/common";

/**
 * Props for the Header component
 * @example
 * ```tsx
 * <Header
 *   title="My Header"
 *   showBackButton={false}
 * />
 * ```
 */
type HeaderProps = {
  /** The title to display in the header */
  title: string;
  /**
   * Whether to show the back button
   * @default true
   */
  showBackButton?: boolean;
  /**
   * Whether this header is being used inside a modal. If true, it will use a different style and behavior for the back button.
   * @default false
   */
  isModal?: boolean;
  /**
   * The content to display on the right side of the header
   */
  rightContent?: React.ReactNode;
};

const HEADER_HEIGHT = 36;

export const Header = ({ title, showBackButton = true, isModal = false, rightContent }: HeaderProps) => {
  const router = useRouter();

  return (
    <Row>
      {/* esquerda */}
      <View style={{ width: HEADER_HEIGHT, aspectRatio: 1 }}>
        {showBackButton ? (
          <Button isIconOnly onPress={() => router.back()} variant="secondary" size="sm">
            {Platform.OS === "ios" && isModal ? <Icons.ChevronDown tone="text" /> : <Icons.ChevronLeft tone="text" />}
          </Button>
        ) : null}
      </View>

      {/* centro REAL */}
      <Typography flex={1} variant="h3" align="center" numberOfLines={1}>
        {title}
      </Typography>

      {/* direita (espelho) */}
      <View style={{ width: HEADER_HEIGHT, aspectRatio: 1 }}>{rightContent}</View>
    </Row>
  );
};
