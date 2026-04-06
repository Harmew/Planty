import React, { forwardRef } from "react";

// React Native
import { View } from "react-native";

// Components
import { Typography } from "@/components/common";

// Context
import { useTextField } from "./text-field";

// Reanimated
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";

const ANIMATION_DURATION = 150;
const ANIMATION_EASING = Easing.out(Easing.ease);

type FieldErrorProps = React.PropsWithChildren<{
  /**
   * Se o campo é inválido (dando overide no context)
   */
  isInvalid?: boolean;
}>;

export const FieldError = forwardRef<View, FieldErrorProps>(({ children, isInvalid: localIsInvalid }, ref) => {
  const { isInvalid: contextIsInvalid } = useTextField();

  // prioridade: prop > context
  const isInvalid = localIsInvalid ?? contextIsInvalid ?? false;

  if (!isInvalid || !children) return null;
  return (
    <Animated.View
      ref={ref}
      entering={FadeIn.duration(ANIMATION_DURATION).easing(ANIMATION_EASING)}
      exiting={FadeOut.duration(ANIMATION_DURATION).easing(ANIMATION_EASING)}
    >
      <Typography variant="textSmall" tone="error">
        {children}
      </Typography>
    </Animated.View>
  );
});

FieldError.displayName = "FieldError";
