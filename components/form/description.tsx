import React from "react";

// Components
import { Typography } from "@/components/common";

// Context
import { useTextField } from "./text-field";

// Reanimated
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";

const ANIMATION_DURATION = 150;
const ANIMATION_EASING = Easing.out(Easing.ease);

export const Description = ({ children }: React.PropsWithChildren) => {
  const { isDisabled, isInvalid } = useTextField();

  if (!children) return null;
  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION_DURATION).easing(ANIMATION_EASING)}
      exiting={FadeOut.duration(ANIMATION_DURATION).easing(ANIMATION_EASING)}
    >
      <Typography variant="textSmall" tone={isDisabled ? "textSecondary" : isInvalid ? "error" : "textSecondary"}>
        {children}
      </Typography>
    </Animated.View>
  );
};
