import { Icon24Back, Icon24ChevronLeft } from "@vkontakte/icons";
import { PanelHeader, PanelHeaderButton, usePlatform } from "@vkontakte/vkui";
import { memo } from "react";
import { browserBack } from "../scripts/browserBack";

export const GamePanelHeader = memo(() => {
  const platform = usePlatform();

  return (
    <PanelHeader
      style={{ backgroundColor: "transparent" }}
      transparent={true}
      shadow={false}
      separator={false}
      before={
        <PanelHeaderButton onClick={browserBack}>
          {platform === "ios" ? (
            <Icon24ChevronLeft width={28} height={28} fill="#1A84FF" />
          ) : (
            <Icon24Back width={28} height={28} fill="#1A84FF" />
          )}
        </PanelHeaderButton>
      }
    />
  );
});
