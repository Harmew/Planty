import React from "react";

// React Native
import { Platform } from "react-native";

// React Native Screen
import { FullWindowOverlay as NativeFullWindowOverlay } from "react-native-screens";

/**
 * Props for the FullWindowOverlay component
 *
 * @description
 * FullWindowOverlay renders content in a separate native window on iOS,
 * which allows overlays (dialogs, toasts) to appear above
 * native modals and the keyboard. However, this breaks the React Native
 * element inspector because it attaches to the main window.
 */
export function FullWindowOverlay({ children }: React.PropsWithChildren) {
  if (Platform.OS !== "ios") {
    return <>{children}</>;
  }

  return <NativeFullWindowOverlay>{children}</NativeFullWindowOverlay>;
}
