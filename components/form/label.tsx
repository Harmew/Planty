import React from "react";

// React Native
import { View } from "react-native";

// Components
import { Typography } from "@/components/common";

// Context
import { useTextField } from "./text-field";

const LabelRoot = React.forwardRef<View, React.PropsWithChildren>(({ children }, ref) => (
  <View ref={ref}>{typeof children === "string" ? <LabelText>{children}</LabelText> : children}</View>
));

LabelRoot.displayName = "TextField.Label";

const LabelText = ({ children }: React.PropsWithChildren) => {
  const { isDisabled, isRequired, isInvalid } = useTextField();

  return (
    <Typography variant="textSmall" tone={isDisabled ? "textSecondary" : isInvalid ? "error" : "text"}>
      {children}
      {isRequired ? (
        <Typography variant="textSmall" tone="error">
          {" *"}
        </Typography>
      ) : null}
    </Typography>
  );
};

export const Label = Object.assign(LabelRoot, {
  Text: LabelText,
});
