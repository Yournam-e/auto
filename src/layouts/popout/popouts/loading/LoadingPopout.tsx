import { ScreenSpinner } from "@vkontakte/vkui";
import { memo } from "react";

export const LoadingPopout = memo(() => {
  return <ScreenSpinner size="large" />;
});
